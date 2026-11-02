import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons'
import { AlertTriangle, CheckCircle2, LocateFixed, Loader2, Navigation, RefreshCw, X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const EMPTY_ROUTE = []
const defaultMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const riderMarkerIcon = L.divIcon({
  className: 'credurix-rider-marker',
  html: `
    <div style="width:44px;height:44px;display:grid;place-items:center;border:2px solid #fff;border-radius:9999px;background:#0f4c81;box-shadow:0 2px 8px rgba(15,23,42,.35)">
      <span data-rider-icon style="display:grid;width:34px;height:34px;place-items:center;color:#38bdf8;transform:rotate(-90deg);transition:transform 350ms ease-out">${icon(faMotorcycle, {
    styles: { width: '30px', height: '30px' },
  }).html.join('')}</span>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

const NavigationMotionContext = createContext(null)
const MAX_LOCATION_AGE_MS = 10000
const MAX_ANIMATED_ACCURACY_METERS = 100
const MAX_ANIMATED_DISTANCE_METERS = 200
const POSITION_ANIMATION_DURATION_MS = 650

const isValidLocation = (location) =>
  location &&
  Number.isFinite(location.latitude) &&
  location.latitude >= -90 &&
  location.latitude <= 90 &&
  Number.isFinite(location.longitude) &&
  location.longitude >= -180 &&
  location.longitude <= 180

const isFreshTimestamp = (timestamp) =>
  Number.isFinite(timestamp) &&
  Date.now() - timestamp >= -1000 &&
  Date.now() - timestamp <= MAX_LOCATION_AGE_MS

const isFreshLocation = (location) => isFreshTimestamp(location?.timestamp)

function NavigationMotionProvider({ currentLocation, navigationActive, children }) {
  const [position, setPosition] = useState(() => (
    isValidLocation(currentLocation)
      ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
      : null
  ))
  const positionRef = useRef(position)
  const lastSampleTimestampRef = useRef(null)

  useEffect(() => {
    let animationFrameId = null
    let isCancelled = false
    let previousSampleTimestamp = lastSampleTimestampRef.current
    let acceptedSampleTimestamp = null
    const setPositionAndRef = (nextPosition) => {
      if (isCancelled) return
      positionRef.current = nextPosition
      setPosition(nextPosition)
    }

    if (!isValidLocation(currentLocation)) return undefined

    const target = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    }
    const sampleTimestamp = currentLocation.timestamp

    if (!navigationActive) {
      setPositionAndRef(target)
      lastSampleTimestampRef.current = sampleTimestamp
      return undefined
    }

    if (!isFreshLocation(currentLocation)) return undefined
    if (
      Number.isFinite(lastSampleTimestampRef.current) &&
      Number.isFinite(sampleTimestamp) &&
      sampleTimestamp <= lastSampleTimestampRef.current
    ) {
      return undefined
    }
    previousSampleTimestamp = lastSampleTimestampRef.current
    lastSampleTimestampRef.current = sampleTimestamp
    acceptedSampleTimestamp = sampleTimestamp

    const start = positionRef.current
    if (!start) {
      setPositionAndRef(target)
      return undefined
    }

    const startLatLng = L.latLng(start.latitude, start.longitude)
    const targetLatLng = L.latLng(target.latitude, target.longitude)
    if (!startLatLng || !targetLatLng) return undefined

    const distanceMeters = startLatLng.distanceTo(targetLatLng)
    const accuracyIsUsable = Number.isFinite(currentLocation.accuracy) &&
      currentLocation.accuracy <= MAX_ANIMATED_ACCURACY_METERS
    if (
      distanceMeters < 0.5 ||
      !accuracyIsUsable ||
      distanceMeters > MAX_ANIMATED_DISTANCE_METERS
    ) {
      setPositionAndRef(target)
      return undefined
    }

    const startTime = performance.now()
    const animatePosition = (timestamp) => {
      if (isCancelled || !isValidLocation(currentLocation) || !isFreshLocation(currentLocation)) {
        animationFrameId = null
        return
      }

      const progress = Math.min(
        1,
        (timestamp - startTime) / POSITION_ANIMATION_DURATION_MS,
      )
      const nextPosition = {
        latitude: start.latitude + (target.latitude - start.latitude) * progress,
        longitude: start.longitude + (target.longitude - start.longitude) * progress,
      }
      setPositionAndRef(nextPosition)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animatePosition)
      } else {
        animationFrameId = null
      }
    }

    animationFrameId = window.requestAnimationFrame(animatePosition)
    return () => {
      isCancelled = true
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId)
        if (
          acceptedSampleTimestamp != null &&
          lastSampleTimestampRef.current === acceptedSampleTimestamp
        ) {
          lastSampleTimestampRef.current = previousSampleTimestamp
        }
      }
    }
  }, [currentLocation, navigationActive])

  const presentationLocation = position
    ? {
      ...(isValidLocation(currentLocation) ? currentLocation : {}),
      ...position,
    }
    : null

  return (
    <NavigationMotionContext.Provider value={presentationLocation}>
      {children}
    </NavigationMotionContext.Provider>
  )
}

const getShortestHeadingChange = (currentHeading, nextHeading) =>
  ((nextHeading - currentHeading + 540) % 360) - 180

function RiderMarker() {
  const currentLocation = useContext(NavigationMotionContext)
  const markerRef = useRef(null)
  const displayedHeadingRef = useRef(0)

  useEffect(() => {
    const headingValue = currentLocation?.heading
    const speedValue = currentLocation?.speed
    const accuracyValue = currentLocation?.accuracy
    const timestamp = currentLocation?.timestamp
    const heading = Number(headingValue)
    const speed = Number(speedValue)
    const accuracy = Number(accuracyValue)
    const headingIsUsable = headingValue != null &&
      headingValue !== '' &&
      isFreshTimestamp(timestamp) &&
      Number.isFinite(heading) &&
      heading >= 0 &&
      heading <= 360 &&
      speedValue != null &&
      speedValue !== '' &&
      Number.isFinite(speed) &&
      speed >= 1.2 &&
      accuracyValue != null &&
      accuracyValue !== '' &&
      Number.isFinite(accuracy) &&
      accuracy <= 35

    if (!headingIsUsable) return

    displayedHeadingRef.current = (
      displayedHeadingRef.current + getShortestHeadingChange(displayedHeadingRef.current, heading)
    ) % 360

    const markerElement = markerRef.current?.getElement()
    const iconContainer = markerElement?.querySelector('[data-rider-icon]')
    if (iconContainer && isValidLocation(currentLocation)) {
      iconContainer.style.transform = `rotate(${displayedHeadingRef.current - 90}deg)`
    }
  }, [
    currentLocation?.accuracy,
    currentLocation?.heading,
    currentLocation?.speed,
    currentLocation?.timestamp,
    currentLocation,
  ])

  if (!isValidLocation(currentLocation)) return null

  return (
    <Marker
      ref={markerRef}
      position={[currentLocation.latitude, currentLocation.longitude]}
      icon={riderMarkerIcon}
      zIndexOffset={1000}
    >
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  )
}

const getNavigationPanOffset = (map) => {
  const container = map.getContainer()
  const mapBounds = container.getBoundingClientRect()
  const mapSize = map.getSize()
  const root = container.closest('[data-navigation-map-root]')
  const navigationPanel = root?.querySelector('[data-navigation-panel-content]')
  const panelBottom = navigationPanel
    ? navigationPanel.getBoundingClientRect().bottom - mapBounds.top
    : 0
  const bottomControls = [
    root?.querySelector('[data-navigation-center-control]'),
    container.querySelector('.leaflet-control-zoom'),
  ].filter(Boolean)
  const firstBottomControl = bottomControls.reduce((top, control) => {
    const bounds = control.getBoundingClientRect()
    return bounds.width > 0 && bounds.height > 0
      ? Math.min(top, bounds.top - mapBounds.top)
      : top
  }, mapSize.y)
  const usableTop = Math.min(mapSize.y, Math.max(0, panelBottom + 16))
  const usableBottom = Math.max(0, Math.min(mapSize.y, firstBottomControl - 16))

  if (usableBottom <= usableTop) return L.point(0, 0)

  const riderTargetY = usableTop + (usableBottom - usableTop) * 0.75
  return L.point(0, mapSize.y / 2 - riderTargetY)
}

const setNavigationCamera = (map, location) => {
  map.setView(
    [location.latitude, location.longitude],
    18,
    { animate: false },
  )
  map.panBy(getNavigationPanOffset(map), { animate: false })
}

const getClientCoordinates = (cliente) => {
  if (!cliente) return null

  const latitude = Number(cliente.latitud)
  const longitude = Number(cliente.longitud)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null

  return [latitude, longitude]
}

const formatDistance = (distanceMeters) => {
  if (!Number.isFinite(distanceMeters)) return '—'
  return distanceMeters >= 1000
    ? `${(distanceMeters / 1000).toFixed(1)} km`
    : `${Math.round(distanceMeters)} m`
}

const formatDuration = (durationSeconds) => {
  if (!Number.isFinite(durationSeconds)) return '—'
  const minutes = Math.max(0, Math.round(durationSeconds / 60))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`
}

function MapCamera({ currentLocation, clienteLatLng, routeCoords, navigationActive }) {
  const map = useMap()
  const presentationLocation = useContext(NavigationMotionContext)
  const usableLocation = isValidLocation(currentLocation) ? currentLocation : presentationLocation
  const presentationLatitude = presentationLocation?.latitude
  const presentationLongitude = presentationLocation?.longitude
  const [followingLocation, setFollowingLocation] = useState(navigationActive)
  const followingLocationRef = useRef(navigationActive)
  const currentLocationRef = useRef(currentLocation)
  const presentationLocationRef = useRef(presentationLocation)
  const lastFollowPositionRef = useRef(null)

  useEffect(() => {
    const container = map.getContainer()
    const stopFollowing = () => {
      followingLocationRef.current = false
      setFollowingLocation(false)
    }
    const options = { passive: true }

    container.addEventListener('pointerdown', stopFollowing, options)
    container.addEventListener('touchstart', stopFollowing, options)
    container.addEventListener('wheel', stopFollowing, options)
    container.addEventListener('keydown', stopFollowing)

    return () => {
      container.removeEventListener('pointerdown', stopFollowing, options)
      container.removeEventListener('touchstart', stopFollowing, options)
      container.removeEventListener('wheel', stopFollowing, options)
      container.removeEventListener('keydown', stopFollowing)
    }
  }, [map])

  useEffect(() => {
    currentLocationRef.current = usableLocation
  }, [usableLocation])

  useEffect(() => {
    presentationLocationRef.current = presentationLocation
  }, [presentationLocation])

  useEffect(() => {
    let animationFrameId = null
    const invalidateMapSize = () => {
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null
        if (map.getContainer().isConnected) {
          map.invalidateSize({ pan: false })
          if (navigationActive && followingLocationRef.current && presentationLocationRef.current) {
            setNavigationCamera(map, presentationLocationRef.current)
            lastFollowPositionRef.current = presentationLocationRef.current
          }
        }
      })
    }

    invalidateMapSize()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(invalidateMapSize)
      const container = map.getContainer()
      const root = container.closest('[data-navigation-map-root]')
      const elementsToObserve = [
        container,
        root?.querySelector('[data-navigation-panel-content]'),
        root?.querySelector('[data-navigation-center-control]'),
        container.querySelector('.leaflet-control-zoom'),
      ]
      elementsToObserve.forEach((element) => {
        if (element) observer.observe(element)
      })
      return () => {
        observer.disconnect()
        if (animationFrameId != null) window.cancelAnimationFrame(animationFrameId)
      }
    }

    window.addEventListener('resize', invalidateMapSize)
    return () => {
      window.removeEventListener('resize', invalidateMapSize)
      if (animationFrameId != null) window.cancelAnimationFrame(animationFrameId)
    }
  }, [map, navigationActive])

  useEffect(() => {
    if (!navigationActive) {
      followingLocationRef.current = false
      lastFollowPositionRef.current = null
      return
    }

    followingLocationRef.current = true

    if (map.zoomControl) {
      map.zoomControl.setPosition('bottomleft')
    }

    const location = presentationLocationRef.current || currentLocationRef.current
    if (isValidLocation(location)) {
      setNavigationCamera(map, location)
      lastFollowPositionRef.current = location
    }
  }, [map, navigationActive])

  useEffect(() => {
    if (navigationActive) return

    if (routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords)
      if (clienteLatLng) bounds.extend(clienteLatLng)

      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2), { animate: false })
        return
      }
    }

    if (clienteLatLng) {
      map.setView(clienteLatLng, 15, { animate: false })
    }
  }, [clienteLatLng, map, navigationActive, routeCoords])

  useEffect(() => {
    if (
      !navigationActive ||
      !followingLocation ||
      !Number.isFinite(presentationLatitude) ||
      !Number.isFinite(presentationLongitude)
    ) return

    const previousPosition = lastFollowPositionRef.current
    const nextPosition = {
      latitude: presentationLatitude,
      longitude: presentationLongitude,
    }
    if (!previousPosition) {
      setNavigationCamera(map, nextPosition)
      lastFollowPositionRef.current = nextPosition
      return
    }

    const zoom = map.getZoom()
    const previousPoint = map.project(
      [previousPosition.latitude, previousPosition.longitude],
      zoom,
    )
    const nextPoint = map.project(
      [nextPosition.latitude, nextPosition.longitude],
      zoom,
    )
    const movement = nextPoint.subtract(previousPoint)

    if (movement.x !== 0 || movement.y !== 0) {
      map.panBy(movement, { animate: false })
    }
    lastFollowPositionRef.current = nextPosition
  }, [
    followingLocation,
    map,
    navigationActive,
    presentationLatitude,
    presentationLongitude,
  ])

  const centerOnCurrentLocation = () => {
    const location = presentationLocationRef.current || currentLocationRef.current
    if (!isValidLocation(location)) return
    followingLocationRef.current = true
    setFollowingLocation(true)
    if (navigationActive) {
      setNavigationCamera(map, location)
      lastFollowPositionRef.current = location
      return
    }

    map.setView(
      [location.latitude, location.longitude],
      Math.max(map.getZoom(), 15),
      { animate: false },
    )
  }

  useEffect(() => {
    if (map.zoomControl) {
      map.zoomControl.setPosition(navigationActive ? 'bottomleft' : 'topleft')
    }
  }, [map, navigationActive])

  return (
    <button
      type="button"
      onClick={centerOnCurrentLocation}
      disabled={!isValidLocation(usableLocation)}
      aria-label={followingLocation ? 'Centrar y seguir mi ubicación' : 'Volver a seguir mi ubicación'}
      data-navigation-center-control={navigationActive ? '' : undefined}
      className={`absolute right-3 z-[1000] flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-md transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${
        navigationActive
          ? 'bottom-[calc(env(safe-area-inset-bottom)+3.5rem)]'
          : 'top-3'
      }`}
    >
      <LocateFixed size={17} className={followingLocation ? 'text-blue-700' : 'text-slate-500'} />
      {followingLocation ? 'Siguiendo' : 'Centrar'}
    </button>
  )
}

export default function RutaMapa({
  currentLocation,
  cliente,
  routeCoords = EMPTY_ROUTE,
  pendingRouteCoords = EMPTY_ROUTE,
  routeSummary = null,
  nextManeuver = null,
  remainingDistanceMeters = null,
  remainingDurationSeconds = null,
  navigationActive = false,
  hasArrived = false,
  onExitNavigation,
  isRouting = false,
  gpsError = '',
  routingError = '',
  onRetryRoute,
}) {
  const clienteLatLng = useMemo(
    () => getClientCoordinates(cliente),
    [cliente],
  )
  const validCurrentLocation = isValidLocation(currentLocation) ? currentLocation : null
  const defaultCenter = validCurrentLocation
    ? [validCurrentLocation.latitude, validCurrentLocation.longitude]
    : clienteLatLng || [20.9674, -89.6236]
  const visibleRouteCoords = navigationActive ? pendingRouteCoords : routeCoords

  return (
    <div className={navigationActive
      ? 'fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden bg-slate-950'
      : 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'}
      data-navigation-map-root
    >
      {!navigationActive && (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Navegación</p>
              <h2 className="text-sm font-bold text-slate-900">Mapa de recorrido</h2>
            </div>
            {routeSummary && (
              <div className="text-right text-[11px] font-semibold text-slate-600">
                <p>{formatDistance(remainingDistanceMeters ?? routeSummary.distanceMeters)}</p>
                <p>{formatDuration(remainingDurationSeconds ?? routeSummary.durationSeconds)}</p>
              </div>
            )}
          </div>

          {nextManeuver && (
            <div className="flex items-start gap-3 border-b border-blue-100 bg-blue-50 px-4 py-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm">
                <Navigation size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug text-slate-900">{nextManeuver.instruction}</p>
                {nextManeuver.streetName && (
                  <p className="mt-0.5 truncate text-xs text-slate-600">{nextManeuver.streetName}</p>
                )}
              </div>
              {nextManeuver.maneuverType !== 'depart' && (
                <span className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-blue-800">
                  {formatDistance(nextManeuver.distanceToManeuverMeters)}
                </span>
              )}
            </div>
          )}

          {isRouting && (
            <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-medium text-blue-900" role="status">
              <Loader2 size={15} className="animate-spin" />
              Calculando ruta…
            </div>
          )}

          {routingError && (
            <div className="flex flex-col gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" role="alert">
              <p className="text-xs leading-relaxed text-amber-950">{routingError}</p>
              <button
                type="button"
                onClick={onRetryRoute}
                disabled={isRouting || !onRetryRoute}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-bold text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
              >
                {isRouting ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                Reintentar ruta
              </button>
            </div>
          )}

          {!routeSummary && !routingError && !isRouting && (
            <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-600" role="status">
              La ruta vial aún no está disponible.
            </div>
          )}
        </>
      )}

      <div className={navigationActive ? 'absolute inset-0 h-full w-full' : 'relative h-[min(42vh,360px)] min-h-[260px] w-full'}>
        <MapContainer
          center={defaultCenter}
          zoom={15}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <NavigationMotionProvider
            currentLocation={currentLocation}
            navigationActive={navigationActive}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {validCurrentLocation && (
              <>
                <RiderMarker />
                <Circle
                  center={[validCurrentLocation.latitude, validCurrentLocation.longitude]}
                  radius={Math.max(30, Number(validCurrentLocation.accuracy || 30))}
                  pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.18, weight: 2 }}
                />
              </>
            )}

            {clienteLatLng && (
              <Marker position={clienteLatLng} icon={defaultMarkerIcon}>
                <Popup>{cliente?.nombre || 'Cliente'}</Popup>
              </Marker>
            )}

            {visibleRouteCoords.length > 1 && (
              <Polyline
                positions={visibleRouteCoords}
                pathOptions={{ color: '#0f4c81', weight: 6, opacity: 0.9 }}
              />
            )}

            <MapCamera
              key={navigationActive ? 'navigation' : 'preview'}
              currentLocation={validCurrentLocation}
              clienteLatLng={clienteLatLng}
              routeCoords={routeCoords}
              navigationActive={navigationActive}
            />
          </NavigationMotionProvider>
        </MapContainer>
      </div>

      {navigationActive && (
        <div className="absolute left-3 right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[1200] mx-auto max-w-2xl">
          <div data-navigation-panel-content className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Navegación activa</p>
                <p className="truncate text-sm font-black text-slate-900">{cliente?.nombre || 'Cliente en curso'}</p>
              </div>
              <button
                type="button"
                onClick={onExitNavigation}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <X size={17} />
                Volver a cobranza
              </button>
            </div>

            {hasArrived ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3" role="status">
                <CheckCircle2 size={22} className="shrink-0 text-emerald-700" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-emerald-950">Has llegado al cliente</p>
                  <p className="text-xs text-emerald-800">Regresa a cobranza para registrar el resultado de la visita.</p>
                </div>
              </div>
            ) : nextManeuver && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-blue-800 p-3 text-white">
                <Navigation size={21} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-black leading-snug">{nextManeuver.instruction}</p>
                  {nextManeuver.streetName && (
                    <p className="truncate text-xs text-blue-100">{nextManeuver.streetName}</p>
                  )}
                </div>
                {nextManeuver.maneuverType !== 'depart' && (
                  <span className="shrink-0 rounded-lg bg-white px-2.5 py-2 text-sm font-black text-blue-900">
                    {formatDistance(nextManeuver.distanceToManeuverMeters)}
                  </span>
                )}
              </div>
            )}

            {routeSummary && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-100 px-3 py-2">
                  <p className="font-medium text-slate-500">Distancia restante</p>
                  <p className="mt-0.5 font-black text-slate-900">
                    {formatDistance(remainingDistanceMeters ?? routeSummary.distanceMeters)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-3 py-2">
                  <p className="font-medium text-slate-500">Tiempo estimado</p>
                  <p className="mt-0.5 font-black text-slate-900">
                    {formatDuration(remainingDurationSeconds ?? routeSummary.durationSeconds)}
                  </p>
                </div>
              </div>
            )}

            {isRouting && (
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-900" role="status">
                <Loader2 size={15} className="animate-spin" />
                Calculando ruta…
              </p>
            )}

            {gpsError && (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950" role="alert">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {gpsError}
              </p>
            )}

            {routingError && (
              <div className="mt-3 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between" role="alert">
                <p className="text-xs leading-relaxed text-amber-950">{routingError}</p>
                <button
                  type="button"
                  onClick={onRetryRoute}
                  disabled={isRouting || !onRetryRoute}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-xs font-bold text-amber-950 disabled:opacity-50"
                >
                  {isRouting ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                  Reintentar ruta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
