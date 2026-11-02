import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../../../api';
import RutaMapa from './RutaMapa';
import { clearLocationWatch, getCurrentPosition, watchCurrentPosition } from '../../../services/locationProvider';
import { fetchRoute, getNextManeuver, getRouteProgress } from '../../../services/routing/osrmClient';
import { MapPin, Phone, CheckCircle, XCircle, X, RotateCcw, AlertTriangle, MessageSquare, Navigation, LocateFixed, Route as RouteIcon, List, Loader2, RefreshCw } from 'lucide-react';

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const hasValidCoordinates = (client) => {
  const latitude = Number(client.latitud);
  const longitude = Number(client.longitud);

  return client.latitud != null &&
    client.latitud !== '' &&
    client.longitud != null &&
    client.longitud !== '' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180;
};

const getDistanceInMeters = (origin, destination) => {
  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
  const earthRadiusMeters = 6371000;
  const latitudeDifference = degreesToRadians(Number(destination.latitud) - origin.latitude);
  const longitudeDifference = degreesToRadians(Number(destination.longitud) - origin.longitude);
  const originLatitude = degreesToRadians(origin.latitude);
  const destinationLatitude = degreesToRadians(Number(destination.latitud));
  const haversine = Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) *
    Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const getRouteOwnerId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id ?? user.tipo ?? 'anonymous';
  } catch {
    return 'anonymous';
  }
};

export default function PwaRuta() {
  const [clientes, setClientes] = useState([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [routeMode, setRouteMode] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [routeStarted, setRouteStarted] = useState(false);
  const [routeFinished, setRouteFinished] = useState(false);
  const [clienteEnCursoId, setClienteEnCursoId] = useState(null);
  const [completedRouteClientIds, setCompletedRouteClientIds] = useState([]);
  const [routeTotalClientCount, setRouteTotalClientCount] = useState(0);
  const [routeLocation, setRouteLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingError, setRoutingError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const routeWatchIdRef = useRef(null);
  const routeRequestRef = useRef({ controller: null, sequence: 0, clientId: null });
  const routeDataRef = useRef(null);
  const lastRouteRequestRef = useRef({ clientId: null, requestedAt: 0 });
  const navigationStepRef = useRef({ clientId: null, index: 0 });
  const [routeActionError, setRouteActionError] = useState('');
  const [routeNeedsReconcile, setRouteNeedsReconcile] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [pendingRouteAction, setPendingRouteAction] = useState(null);
  const [storageError, setStorageError] = useState('');
  const [routeDay] = useState(getLocalDateKey);
  const routeStorageKey = useMemo(
    () => `credurix.smart-route.v1:${getRouteOwnerId()}:${routeDay}`,
    [routeDay],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [comentarioCobro, setComentarioCobro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isNoPagoModalOpen, setIsNoPagoModalOpen] = useState(false);
  const [clienteParaNoPago, setClienteParaNoPago] = useState(null);
  const [comentarioNoPago, setComentarioNoPago] = useState('');
  const [activeTab, setActiveTab] = useState('pendiente');

  const persistRouteProgress = useCallback((
    active,
    clientId,
    completedClientIds,
    totalClientCount,
  ) => {
    try {
      localStorage.setItem(routeStorageKey, JSON.stringify({
        date: routeDay,
        active,
        clienteEnCursoId: clientId,
        completedClientIds,
        totalClientCount,
      }));
      setStorageError('');
    } catch (error) {
      console.error('No se pudo guardar el progreso local de la ruta:', error);
      setStorageError('No se pudo guardar el progreso en este dispositivo. El servidor conserva los resultados confirmados.');
    }
  }, [routeDay, routeStorageKey]);

  const requestCurrentLocation = () => getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  });

  const getNextPendingClient = (directory, location) => {
    const pendingClients = directory.filter((client) =>
      (client.estado_visita || 'pendiente') === 'pendiente',
    );

    const clientsWithCoordinates = pendingClients
      .filter(hasValidCoordinates)
      .map((client, originalOrder) => ({
        client,
        originalOrder,
        distance: getDistanceInMeters(location, client),
      }))
      .sort((first, second) =>
        first.distance - second.distance || first.originalOrder - second.originalOrder,
      );

    if (clientsWithCoordinates.length > 0) {
      return clientsWithCoordinates[0].client;
    }

    // Keep unlocated clients in the backend's order and visit them after geolocated clients.
    return pendingClients.find((client) => !hasValidCoordinates(client)) || null;
  };

  const selectNextRouteClient = async (directory = clientes, progress = {}) => {
    setIsGettingLocation(true);
    setGpsError('');
    setRouteActionError('');

    try {
      const location = await requestCurrentLocation();
      if (
        !Number.isFinite(location.latitude) ||
        location.latitude < -90 || location.latitude > 90 ||
        !Number.isFinite(location.longitude) ||
        location.longitude < -180 || location.longitude > 180
      ) {
        throw new Error('El GPS devolvió coordenadas fuera de rango. Inténtalo nuevamente.');
      }
      setRouteLocation(location);
      const nextClient = getNextPendingClient(directory, location);
      setClienteEnCursoId(nextClient?.id ?? null);
      setRouteFinished(!nextClient);
      setRouteNeedsReconcile(false);
      persistRouteProgress(
        Boolean(nextClient),
        nextClient?.id ?? null,
        progress.completedClientIds ?? completedRouteClientIds,
        progress.totalClientCount ?? routeTotalClientCount,
      );
    } catch (error) {
      console.error('No se pudo obtener la ubicación para la ruta:', error);
      setGpsError(error.message);
      setRouteNeedsReconcile(false);
      setClienteEnCursoId(null);
      setRouteFinished(false);
      persistRouteProgress(
        true,
        null,
        progress.completedClientIds ?? completedRouteClientIds,
        progress.totalClientCount ?? routeTotalClientCount,
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const refreshDirectory = async () => {
    const response = await api.get('/clientes/directorio');
    if (!Array.isArray(response.data)) {
      throw new Error('El directorio recibido no tiene el formato esperado.');
    }
    setClientes(response.data);
    setLoadError('');
    return response.data;
  };

  const startOrResumeRoute = async () => {
    setRouteStarted(true);
    setRouteMode(true);
    setRouteFinished(false);
    const totalClientCount = Math.max(routeTotalClientCount, clientes.length);
    setRouteTotalClientCount(totalClientCount);
    persistRouteProgress(true, clienteEnCursoId, completedRouteClientIds, totalClientCount);
    await selectNextRouteClient(clientes, {
      completedClientIds: completedRouteClientIds,
      totalClientCount,
    });
  };

  const reconcileRouteWithServer = async () => {
    setIsReconciling(true);
    setRouteActionError('');

    try {
      const updatedDirectory = await refreshDirectory();
      const targetClientId = selectedClient?.id ?? clienteParaNoPago?.id ?? clienteEnCursoId;
      const targetClient = updatedDirectory.find((client) =>
        String(client.id) === String(targetClientId),
      );
      const targetStatus = targetClient?.estado_visita || 'pendiente';
      const expectedStatus = pendingRouteAction?.expectedStatus;
      const actionConfirmed = expectedStatus === 'pagado'
        ? !targetClient || targetStatus === expectedStatus
        : targetStatus === expectedStatus;

      setRouteNeedsReconcile(false);
      setPendingRouteAction(null);

      if (actionConfirmed) {
        const completedClientIds = routeMode && targetClientId != null
          ? [...new Set([...completedRouteClientIds, String(targetClientId)])]
          : completedRouteClientIds;
        const totalClientCount = Math.max(
          routeTotalClientCount,
          updatedDirectory.length + completedClientIds.filter((id) =>
            !updatedDirectory.some((client) => String(client.id) === String(id)),
          ).length,
        );
        setCompletedRouteClientIds(completedClientIds);
        setRouteTotalClientCount(totalClientCount);
        setIsModalOpen(false);
        setIsNoPagoModalOpen(false);
        setSelectedClient(null);
        setClienteParaNoPago(null);
        if (routeMode && targetClientId != null) {
          setClienteEnCursoId(null);
          await selectNextRouteClient(updatedDirectory, {
            completedClientIds,
            totalClientCount,
          });
        } else {
          setRouteActionError('El servidor confirma la operación y el directorio se actualizó.');
        }
      } else {
        setRouteActionError('El servidor todavía muestra al cliente como pendiente. No se avanzó la ruta; puedes volver a intentar la operación.');
      }
    } catch (error) {
      console.error('No se pudo reconciliar la ruta con el servidor:', error);
      setRouteActionError('No fue posible consultar el estado actualizado. La ruta permanece detenida; comprueba la conexión e inténtalo de nuevo.');
    } finally {
      setIsReconciling(false);
    }
  };

  const returnToCards = () => {
    setNavigationActive(false);
    setRouteMode(false);
    setRouteActionError('');
    setIsRouting(false);
  };

  const requestRoute = useCallback(async (targetClient, origin, { force = false } = {}) => {
    if (!targetClient) return;

    const clientId = String(targetClient.id);
    const currentRoute = routeDataRef.current;
    const requestInProgress = routeRequestRef.current;

    if (!hasValidCoordinates(targetClient)) {
      if (currentRoute?.clientId !== clientId) {
        routeDataRef.current = null;
        setRouteData(null);
      }
      setRoutingError('');
      return;
    }

    if (!origin) return;

    if (!force && currentRoute?.clientId === clientId) {
      const progress = getRouteProgress(currentRoute, origin);
      if (progress.distanceFromRouteMeters < 65) {
        if (requestInProgress.controller && requestInProgress.clientId === clientId) {
          requestInProgress.controller.abort();
          routeRequestRef.current = {
            ...requestInProgress,
            controller: null,
            sequence: requestInProgress.sequence + 1,
          };
          setIsRouting(false);
        }
        return;
      }
    }

    const lastRequest = lastRouteRequestRef.current;
    if (
      !force &&
      lastRequest.clientId === clientId &&
      Date.now() - lastRequest.requestedAt < 15000
    ) return;

    if (!force && requestInProgress.controller && requestInProgress.clientId === clientId) return;

    if (requestInProgress.controller) {
      requestInProgress.controller.abort();
    }

    if (currentRoute?.clientId !== clientId) {
      routeDataRef.current = null;
      setRouteData(null);
    }

    const controller = new AbortController();
    const sequence = requestInProgress.sequence + 1;
    routeRequestRef.current = { controller, sequence, clientId };
    lastRouteRequestRef.current = { clientId, requestedAt: Date.now() };
    setIsRouting(true);
    setRoutingError('');

    try {
      const route = await fetchRoute({
        from: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
        to: {
          latitude: Number(targetClient.latitud),
          longitude: Number(targetClient.longitud),
        },
        signal: controller.signal,
      });

      if (controller.signal.aborted || routeRequestRef.current.sequence !== sequence) return;

      const nextRoute = { ...route, clientId };
      routeDataRef.current = nextRoute;
      navigationStepRef.current = { clientId, index: 0 };
      setRouteData(nextRoute);
      setRoutingError('');
    } catch (error) {
      if (controller.signal.aborted || error.name === 'AbortError') return;
      if (routeRequestRef.current.sequence === sequence) {
        console.warn('No fue posible cargar la ruta del cliente:', error);
        setRoutingError(error.message || 'No se pudo calcular la ruta. Comprueba tu conexión e inténtalo de nuevo.');
      }
    } finally {
      if (routeRequestRef.current.sequence === sequence) {
        routeRequestRef.current = { ...routeRequestRef.current, controller: null };
        setIsRouting(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (routeWatchIdRef.current != null) {
        clearLocationWatch(routeWatchIdRef.current);
      }
      routeRequestRef.current.controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (!routeMode || !clienteEnCursoId) return undefined;

    return () => {
      routeRequestRef.current.controller?.abort();
      routeRequestRef.current = {
        controller: null,
        clientId: null,
        sequence: routeRequestRef.current.sequence + 1,
      };
    };
  }, [clienteEnCursoId, routeMode]);

  useEffect(() => {
    if (!routeMode) {
      if (routeWatchIdRef.current != null) {
        clearLocationWatch(routeWatchIdRef.current);
        routeWatchIdRef.current = null;
      }
      return;
    }

    const onLocationUpdate = (location) => {
      setGpsError('');
      const activeRoute = routeDataRef.current;
      if (activeRoute) {
        if (navigationStepRef.current.clientId !== activeRoute.clientId) {
          navigationStepRef.current = { clientId: activeRoute.clientId, index: 0 };
        }
        const maneuver = getNextManeuver(
          activeRoute,
          location,
          18,
          navigationStepRef.current.index,
        );
        if (maneuver) {
          navigationStepRef.current.index = Math.max(
            navigationStepRef.current.index,
            maneuver.stepIndex,
          );
        }
      }

      setRouteLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        heading: location.heading,
        speed: location.speed,
      });
    };

    const watchId = watchCurrentPosition(onLocationUpdate, (error) => {
      console.warn('GPS en seguimiento falló:', error);
      setGpsError(error?.message || 'No pudimos seguir tu ubicación en tiempo real.');
    }, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });

    routeWatchIdRef.current = watchId;

    return () => {
      if (routeWatchIdRef.current != null) {
        clearLocationWatch(routeWatchIdRef.current);
        routeWatchIdRef.current = null;
      }
    };
  }, [routeMode]);

  useEffect(() => {
    if (!routeMode || !routeLocation || !clienteEnCursoId) return;

    const targetClient = clientes.find((client) =>
      String(client.id) === String(clienteEnCursoId),
    );
    if (targetClient) requestRoute(targetClient, routeLocation);
  }, [clientes, clienteEnCursoId, requestRoute, routeLocation, routeMode]);

  useEffect(() => {
    let isMounted = true;

    const loadRoute = async () => {
      setIsLoadingClientes(true);
      try {
        const response = await api.get('/clientes/directorio');
        if (!Array.isArray(response.data)) {
          throw new Error('El directorio recibido no tiene el formato esperado.');
        }
        if (!isMounted) return;

        setClientes(response.data);
        setLoadError('');

        let savedRoute = null;
        try {
          savedRoute = JSON.parse(localStorage.getItem(routeStorageKey) || 'null');
        } catch {
          setStorageError('No se pudo leer el progreso guardado. Se utilizará el estado confirmado por el servidor.');
        }

        if (savedRoute?.date === routeDay) {
          const savedCompletedIds = Array.isArray(savedRoute.completedClientIds)
            ? savedRoute.completedClientIds.map(String)
            : [];
          const completedClientIds = savedCompletedIds.filter((id) => {
            const client = response.data.find((item) => String(item.id) === id);
            return !client || (client.estado_visita || 'pendiente') !== 'pendiente';
          });
          const missingCompletedCount = completedClientIds.filter((id) =>
            !response.data.some((client) => String(client.id) === String(id)),
          ).length;
          const totalClientCount = Math.max(
            Number(savedRoute.totalClientCount) || 0,
            response.data.length + missingCompletedCount,
          );
          setCompletedRouteClientIds(completedClientIds);
          setRouteTotalClientCount(totalClientCount);
          setRouteStarted(true);
          setRouteFinished(!savedRoute.active);

          if (savedRoute.active) {
            setRouteMode(true);
            setIsGettingLocation(true);
            try {
              const location = await requestCurrentLocation();
              if (!isMounted) return;
              setRouteLocation(location);
              const nextClient = getNextPendingClient(response.data, location);
              setClienteEnCursoId(nextClient?.id ?? null);
              setRouteFinished(!nextClient);
              persistRouteProgress(
                Boolean(nextClient),
                nextClient?.id ?? null,
                completedClientIds,
                totalClientCount,
              );
            } catch (error) {
              if (!isMounted) return;
              setGpsError(error.message);
              setClienteEnCursoId(null);
            } finally {
              if (isMounted) setIsGettingLocation(false);
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar el directorio de ruta:', error);
        if (isMounted) setLoadError('No se pudo cargar el directorio. Comprueba tu conexión e inténtalo de nuevo.');
      } finally {
        if (isMounted) setIsLoadingClientes(false);
      }
    };

    loadRoute();
    return () => {
      isMounted = false;
    };
  }, [persistRouteProgress, routeDay, routeStorageKey]);

  const handleCobrarClick = (cliente) => {
    if (routeNeedsReconcile) return;
    setRouteActionError('');
    setSelectedClient(cliente);
    setMontoRecibido(cliente.monto);
    setComentarioCobro('');
    setIsModalOpen(true);
  };

  const handleConfirmarPago = async () => {
    const amount = Number(montoRecibido);
    if (!selectedClient || !Number.isFinite(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    setIsSubmitting(true);
    setRouteActionError('');
    setPendingRouteAction({ clientId: selectedClient.id, expectedStatus: 'pagado' });

    try {
      await api.post(`/clientes/${selectedClient.id}/cobrar`, {
        monto: amount,
        comentarios: comentarioCobro,
      });

      const updatedDirectory = await refreshDirectory();
      const updatedClient = updatedDirectory.find((client) =>
        String(client.id) === String(selectedClient.id),
      );

      const paymentConfirmed = updatedClient
        ? updatedClient.estado_visita === 'pagado'
        : true;

      if (!paymentConfirmed) {
        setRouteNeedsReconcile(true);
        setRouteActionError('El servidor respondió, pero el directorio no confirma el cobro. La ruta no avanzó; actualiza el estado antes de continuar.');
        return;
      }

      setRouteNeedsReconcile(false);
      setPendingRouteAction(null);
      setIsModalOpen(false);
      setSelectedClient(null);
      setMontoRecibido('');
      setComentarioCobro('');

      if (routeMode && String(clienteEnCursoId) === String(selectedClient.id)) {
        const completedClientIds = [...new Set([
          ...completedRouteClientIds,
          String(selectedClient.id),
        ])];
        const totalClientCount = Math.max(
          routeTotalClientCount,
          updatedDirectory.length + completedClientIds.filter((id) =>
            !updatedDirectory.some((client) => String(client.id) === String(id)),
          ).length,
        );
        setCompletedRouteClientIds(completedClientIds);
        setRouteTotalClientCount(totalClientCount);
        setClienteEnCursoId(null);
        await selectNextRouteClient(updatedDirectory, {
          completedClientIds,
          totalClientCount,
        });
      }
    } catch (error) {
      console.error("Error al registrar el cobro:", error);
      setRouteNeedsReconcile(true);
      setRouteActionError('No se pudo confirmar el cobro con el servidor. No se avanzó la ruta. Actualiza el directorio antes de volver a intentarlo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoPagoClick = (cliente) => {
    if (routeNeedsReconcile) return;
    setRouteActionError('');
    setClienteParaNoPago(cliente);
    setComentarioNoPago('');
    setIsNoPagoModalOpen(true);
  };

  const confirmNoPago = async () => {
    if (!clienteParaNoPago) return;

    const client = clienteParaNoPago;
    setIsSubmitting(true);
    setRouteActionError('');
    setPendingRouteAction({ clientId: client.id, expectedStatus: 'no_pago' });

    try {
      await api.post(`/clientes/${client.id}/no-pago`, {
        comentarios: comentarioNoPago,
      });

      const updatedDirectory = await refreshDirectory();
      const updatedClient = updatedDirectory.find((currentClient) =>
        String(currentClient.id) === String(client.id),
      );

      if (!updatedClient || updatedClient.estado_visita !== 'no_pago') {
        setRouteNeedsReconcile(true);
        setRouteActionError('El servidor respondió, pero el directorio no confirma la visita. La ruta no avanzó; actualiza el estado antes de continuar.');
        return;
      }

      setRouteNeedsReconcile(false);
      setPendingRouteAction(null);
      setIsNoPagoModalOpen(false);
      setClienteParaNoPago(null);
      setComentarioNoPago('');

      if (routeMode && String(clienteEnCursoId) === String(client.id)) {
        const completedClientIds = [...new Set([
          ...completedRouteClientIds,
          String(client.id),
        ])];
        const totalClientCount = Math.max(
          routeTotalClientCount,
          updatedDirectory.length + completedClientIds.filter((id) =>
            !updatedDirectory.some((currentClient) => String(currentClient.id) === String(id)),
          ).length,
        );
        setCompletedRouteClientIds(completedClientIds);
        setRouteTotalClientCount(totalClientCount);
        setClienteEnCursoId(null);
        await selectNextRouteClient(updatedDirectory, {
          completedClientIds,
          totalClientCount,
        });
      }
    } catch (error) {
      console.error("Error al registrar visita fallida:", error);
      setRouteNeedsReconcile(true);
      setRouteActionError('No se pudo confirmar la visita con el servidor. No se avanzó la ruta. Actualiza el directorio antes de volver a intentarlo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMoney = (amount) => {
    const numericAmount = Math.abs(Number(amount) || 0);
    return numericAmount.toFixed(2);
  };

  const clientesFiltrados = clientes.filter(c => (c.estado_visita || 'pendiente') === activeTab);
  const clienteEnCurso = clientes.find((client) =>
    String(client.id) === String(clienteEnCursoId),
  ) || null;
  const currentRouteData = routeData?.clientId === String(clienteEnCursoId)
    ? routeData
    : null;
  const routeProgress = currentRouteData
    ? getRouteProgress(currentRouteData, routeLocation)
    : null;
  const nextManeuver = currentRouteData
    ? getNextManeuver(
      currentRouteData,
      routeLocation,
      18,
      navigationStepRef.current.clientId === currentRouteData.clientId
        ? navigationStepRef.current.index
        : 0,
    )
    : null;
  const routeProgressRatio = routeProgress?.geometryLengthMeters
    ? Math.min(1, routeProgress.traveledMeters / routeProgress.geometryLengthMeters)
    : 0;
  const remainingDistanceMeters = currentRouteData
    ? currentRouteData.distanceMeters * (1 - routeProgressRatio)
    : null;
  const remainingDurationSeconds = currentRouteData
    ? currentRouteData.durationSeconds * (1 - routeProgressRatio)
    : null;

  const getMapsUrl = (cliente) => {
    const latitud = Number(cliente.latitud);
    const longitud = Number(cliente.longitud);
    const tieneCoordenadas = cliente.latitud != null &&
      cliente.latitud !== '' &&
      cliente.longitud != null &&
      cliente.longitud !== '' &&
      Number.isFinite(latitud) &&
      Number.isFinite(longitud) &&
      latitud >= -90 && latitud <= 90 &&
      longitud >= -180 && longitud <= 180;
    const query = tieneCoordenadas
      ? `${latitud},${longitud}`
      : cliente.direccion || '';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };
  
  const completedClientsMissingFromDirectory = completedRouteClientIds.filter((id) =>
    !clientes.some((client) => String(client.id) === String(id)),
  ).length;
  const totalClientesDia = routeStarted
    ? Math.max(routeTotalClientCount, clientes.length + completedClientsMissingFromDirectory)
    : clientes.length;
  const clientesProcesados = clientes.filter(c => (c.estado_visita || 'pendiente') !== 'pendiente').length +
    completedClientsMissingFromDirectory;
  const progresoPorcentaje = totalClientesDia === 0 ? 0 : Math.round((clientesProcesados / totalClientesDia) * 100);
  const currentClientDistance = clienteEnCurso && routeLocation && hasValidCoordinates(clienteEnCurso)
    ? getDistanceInMeters(routeLocation, clienteEnCurso)
    : null;
  const hasArrivedAtClient = currentClientDistance !== null &&
    currentClientDistance <= 40 &&
    (!Number.isFinite(routeLocation?.accuracy) || routeLocation.accuracy <= 50);

  return (
    <div className="min-h-screen bg-slate-50 px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-3 font-sans sm:px-4 sm:pt-4">
      {/* HEADER Y BARRA DE PROGRESO */}
      <div className="mb-5 mt-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Progreso de hoy</span>
          <span className="text-xs font-black text-blue-600">
            {clientesProcesados} de {totalClientesDia} Visitados
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 transition-all duration-500 ease-out" 
            style={{ width: `${progresoPorcentaje}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">Operación de campo</p>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Ruta de hoy</h1>
        </div>
        {routeMode ? (
          <button
            type="button"
            onClick={returnToCards}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <List size={17} /> Ver tarjetas
          </button>
        ) : (
          <button
            type="button"
            onClick={startOrResumeRoute}
            disabled={isLoadingClientes || isGettingLocation || isSubmitting || routeNeedsReconcile}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isGettingLocation ? <Loader2 size={17} className="animate-spin" /> : <RouteIcon size={17} />}
            {routeStarted ? 'Reanudar ruta inteligente' : 'Iniciar Ruta Inteligente'}
          </button>
        )}
      </div>

      {storageError && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900" role="status">
          {storageError}
        </div>
      )}

      {loadError && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-900" role="alert">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => refreshDirectory().catch((error) => {
              console.error('No se pudo actualizar el directorio:', error);
              setLoadError('No se pudo actualizar el directorio. Inténtalo nuevamente.');
            })}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 font-bold text-rose-800"
          >
            <RefreshCw size={15} /> Reintentar
          </button>
        </div>
      )}

      {routeMode ? (
        <section className="mx-auto max-w-3xl" aria-label="Recorrido inteligente">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm">
                <Navigation size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900">Ruta Inteligente</p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  {routeLocation ? 'Ordenando pendientes desde tu ubicación actual' : 'La ruta se conserva mientras se obtiene tu ubicación'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => selectNextRouteClient()}
              disabled={isGettingLocation || isSubmitting || routeNeedsReconcile}
              aria-label="Actualizar ubicación GPS"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
            >
              {isGettingLocation ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
            </button>
          </div>

          {clienteEnCurso && (
            <div className="mb-4">
              <RutaMapa
                currentLocation={routeLocation}
                cliente={clienteEnCurso}
                routeCoords={currentRouteData?.geometry}
                routeSummary={currentRouteData}
                nextManeuver={nextManeuver}
                remainingDistanceMeters={remainingDistanceMeters}
                remainingDurationSeconds={remainingDurationSeconds}
                navigationActive={navigationActive}
                hasArrived={hasArrivedAtClient}
                onExitNavigation={() => setNavigationActive(false)}
                isRouting={isRouting}
                gpsError={gpsError}
                routingError={routingError}
                onRetryRoute={() => requestRoute(clienteEnCurso, routeLocation, { force: true })}
              />
            </div>
          )}

          {gpsError && (
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between" role="alert">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-xs font-bold text-amber-950">No pudimos obtener tu ubicación</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900">{gpsError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => selectNextRouteClient()}
                disabled={isGettingLocation || routeNeedsReconcile}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-900 disabled:opacity-50"
              >
                {isGettingLocation ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                Reintentar GPS
              </button>
            </div>
          )}

          {routeActionError && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950" role="alert">
              <p>{routeActionError}</p>
              {routeNeedsReconcile && (
                <button
                  type="button"
                  onClick={reconcileRouteWithServer}
                  disabled={isReconciling || isSubmitting}
                  className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 font-bold text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
                >
                  {isReconciling ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Revisar estado en el servidor
                </button>
              )}
            </div>
          )}

          {isGettingLocation && !gpsError && (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                <LocateFixed size={25} className="animate-pulse" />
              </span>
              <p className="text-sm font-bold text-slate-900">Buscando tu ubicación</p>
              <p className="mt-1 text-xs text-slate-500">Calcularemos el siguiente cliente pendiente más cercano.</p>
            </div>
          )}

          {!isGettingLocation && !gpsError && routeFinished && (
            <div className="rounded-3xl border border-blue-100 bg-white px-5 py-10 text-center shadow-sm sm:px-8">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                <CheckCircle size={26} />
              </span>
              <p className="text-lg font-black text-slate-900">Recorrido completado</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                No quedan clientes pendientes en el directorio de hoy.
              </p>
              <button
                type="button"
                onClick={returnToCards}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <List size={17} /> Revisar tarjetas del día
              </button>
            </div>
          )}

          {!isGettingLocation && !gpsError && !routeFinished && clienteEnCurso && (
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-blue-800 to-blue-950 px-5 py-5 text-white sm:px-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">Siguiente parada</p>
                    <p className="mt-1 text-sm font-bold">
                      {clientesProcesados} de {totalClientesDia} clientes atendidos
                    </p>
                  </div>
                  <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-black">
                    {progresoPorcentaje}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${progresoPorcentaje}%` }}
                  />
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Cliente en curso</p>
                    <h2 className="mt-1 break-words text-xl font-black uppercase tracking-tight text-slate-900 sm:text-2xl">
                      {clienteEnCurso.nombre}
                    </h2>
                  </div>
                  {currentClientDistance != null ? (
                    <span className="shrink-0 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-blue-800">
                      {currentClientDistance >= 1000
                        ? `${(currentClientDistance / 1000).toFixed(1)} km`
                        : `${Math.round(currentClientDistance)} m`}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600">
                      Sin GPS del cliente · al final
                    </span>
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dirección</p>
                    <p className="mt-1 break-words text-sm font-semibold leading-relaxed text-slate-800">
                      {clienteEnCurso.direccion || 'Sin dirección registrada'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pago de hoy</p>
                    <p className="mt-1 text-lg font-black text-slate-900">${formatMoney(clienteEnCurso.monto)}</p>
                    <p className="mt-1 text-xs text-slate-500">{clienteEnCurso.retraso || 'Al día'}</p>
                  </div>
                </div>

                {clienteEnCurso.telefono && (
                  <a
                    href={`tel:${clienteEnCurso.telefono}`}
                    className="mt-3 inline-flex min-h-11 w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    <Phone size={17} className="text-blue-800" />
                    {clienteEnCurso.telefono}
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setNavigationActive(true)}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <Navigation size={18} /> Navegar al cliente
                </button>

                {!routeNeedsReconcile && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleCobrarClick(clienteEnCurso)}
                      disabled={isSubmitting}
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle size={19} /> Cobrar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNoPagoClick(clienteEnCurso)}
                      disabled={isSubmitting}
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={19} className="text-slate-500" /> No pagó
                    </button>
                  </div>
                )}
              </div>
            </article>
          )}
        </section>
      ) : (
      <>
      {/* PESTAÑAS (TABS) MEJORADAS */}
      <div className="mb-5 flex rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
        <button 
          onClick={() => setActiveTab('pendiente')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pendiente' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setActiveTab('no_pago')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'no_pago' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          No Pagaron
        </button>
        <button 
          onClick={() => setActiveTab('pagado')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pagado' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pagados
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={`relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all sm:p-5 ${
              activeTab === 'pagado' ? 'opacity-80 bg-slate-50/50' : ''
            }`}>
              {/* Barra lateral indicadora de estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                activeTab === 'pagado' ? 'bg-slate-300' : 
                cliente.tiene_retraso ? 'bg-slate-500' : 'bg-blue-700'
              }`} />

              <div className="mb-2 flex items-start justify-between gap-2 pl-1">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-sm font-black uppercase tracking-tight text-slate-900 sm:text-base">{cliente.nombre}</h2>
                </div>
                <a 
                  href={`tel:${cliente.telefono}`}
                  className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-800 shadow-sm transition-colors hover:bg-blue-100"
                >
                  <Phone size={18} />
                </a>
              </div>

              <button 
                onClick={() => window.open(getMapsUrl(cliente), '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 text-slate-500 mb-4 text-xs hover:bg-slate-50 p-2 rounded-xl transition-colors w-full text-left pl-1"
              >
                <div className="shrink-0 rounded-xl bg-blue-50 p-2 text-blue-800">
                  <MapPin size={15} />
                </div>
                <span className="min-w-0 flex-1 truncate font-medium underline decoration-blue-200 underline-offset-2">
                  {cliente.direccion}
                </span>
              </button>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 pl-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {activeTab === 'pagado' ? "Cobro realizado" : (cliente.tiene_retraso ? "Total con Mora" : "Pago de hoy")}
                  </p>
                  <span className={`break-all text-lg font-black sm:text-xl ${activeTab === 'pagado' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    ${formatMoney(cliente.monto)}
                  </span>
                </div>
                
                {activeTab !== 'pagado' && (
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                    cliente.tiene_retraso 
                      ? 'border border-slate-200 bg-slate-100 text-slate-700' 
                      : 'border border-blue-100 bg-blue-50 text-blue-800'
                  }`}>
                    {cliente.retraso}
                  </span>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              {activeTab === 'pendiente' && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-800 px-2 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] sm:gap-2 sm:text-sm"
                  >
                    <CheckCircle size={18} /> Cobrar
                  </button>
                  <button 
                    onClick={() => handleNoPagoClick(cliente)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] sm:gap-2 sm:text-sm"
                  >
                    <XCircle size={18} className="text-slate-400" /> No Pagó
                  </button>
                </div>
              )}

              {activeTab === 'no_pago' && (
                <div className="pt-2">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 active:scale-[0.98]"
                  >
                    <RotateCcw size={18} /> Reintentar Cobro (2da Vuelta)
                  </button>
                </div>
              )}

              {activeTab === 'pagado' && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 pt-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  <CheckCircle size={16} /> Pago completado con éxito
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-16 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
            <p className="text-sm font-bold">
              {activeTab === 'pendiente' ? "¡Ruta completada! No hay clientes pendientes." : 
               activeTab === 'no_pago' ? "Ningún cliente ha faltado a su pago hoy." : 
               "Aún no se han registrado pagos hoy."}
            </p>
          </div>
        )}
      </div>
      </>
      )}

      {/* MODAL DE CONFIRMACIÓN NO PAGO (CON OBSERVACIONES) */}
      {isNoPagoModalOpen && clienteParaNoPago && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-sm overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-4 text-center shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:p-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
              <AlertTriangle size={28} className="text-slate-700" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">Registrar Visita Fallida</h2>
            <p className="text-slate-500 mb-4 text-xs">
              Cliente: <span className="font-bold text-slate-800 uppercase">{clienteParaNoPago.nombre}</span>
            </p>
            
            <div className="text-left mb-5">
              {routeActionError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950" role="alert">
                  <p>{routeActionError}</p>
                  {routeNeedsReconcile && (
                    <button
                      type="button"
                      onClick={reconcileRouteWithServer}
                      disabled={isReconciling || isSubmitting}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 font-bold disabled:opacity-50"
                    >
                      {isReconciling ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                      Revisar estado
                    </button>
                  )}
                </div>
              )}
              <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                <MessageSquare size={14} className="text-slate-400" /> Motivo u Observaciones
              </label>
              <textarea 
                rows="3"
                value={comentarioNoPago}
                onChange={(e) => setComentarioNoPago(e.target.value)}
                placeholder="Ej. No se encontraba en casa, pagará más tarde..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsNoPagoModalOpen(false)}
                disabled={isSubmitting || routeNeedsReconcile}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmNoPago}
                disabled={isSubmitting || routeNeedsReconcile}
                className="flex-1 rounded-xl bg-blue-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COBRO (CON OBSERVACIONES) */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="min-w-0 text-base font-black text-slate-900 sm:text-lg">Registrar Cobro</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-slate-500 mb-3 text-xs">Cliente: <span className="font-bold text-slate-900 uppercase">{selectedClient.nombre}</span></p>
            
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-700 mb-2">Monto recibido</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xl font-black text-slate-400">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={montoRecibido}
                  onChange={(e) => setMontoRecibido(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-xl font-bold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            <div className="mb-6">
              {routeActionError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950" role="alert">
                  <p>{routeActionError}</p>
                  {routeNeedsReconcile && (
                    <button
                      type="button"
                      onClick={reconcileRouteWithServer}
                      disabled={isReconciling || isSubmitting}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 font-bold disabled:opacity-50"
                    >
                      {isReconciling ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                      Revisar estado
                    </button>
                  )}
                </div>
              )}
              <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                <MessageSquare size={14} className="text-slate-400" /> Observaciones o Comentarios
              </label>
              <textarea 
                rows="2"
                value={comentarioCobro}
                onChange={(e) => setComentarioCobro(e.target.value)}
                placeholder="Ej. Dejó un adelanto, pidió cambio de billete de 500..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
            
            <button 
              onClick={handleConfirmarPago}
              disabled={isSubmitting || routeNeedsReconcile}
              className={`w-full text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-800 hover:bg-blue-900 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}