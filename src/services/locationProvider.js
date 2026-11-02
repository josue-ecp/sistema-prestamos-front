import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'

const activeWatchCleanups = new Set()

const normalizePosition = ({ coords }) => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
  accuracy: coords.accuracy,
  heading: coords.heading ?? coords.course ?? null,
  speed: coords.speed ?? null,
})

const getBrowserGeolocationError = (error) => {
  const messages = {
    1: 'Permite el acceso a la ubicación para continuar.',
    2: 'No fue posible determinar tu ubicación. Comprueba el GPS y la señal.',
    3: 'La ubicación tardó demasiado. Inténtalo nuevamente en un lugar con mejor señal.',
  }

  return messages[error?.code] || error?.message || 'No se pudo obtener la ubicación.'
}

const getNativeGeolocationError = (error) => {
  const message = String(error?.message || '').toLowerCase()

  if (message.includes('permission') || message.includes('denied')) {
    return new Error('El permiso de ubicación está denegado. Habilítalo en los ajustes de la aplicación.')
  }

  if (message.includes('disabled') || message.includes('location services')) {
    return new Error('La ubicación del dispositivo está desactivada. Activa el GPS e inténtalo de nuevo.')
  }

  return new Error(error?.message || 'No se pudo determinar tu ubicación. Comprueba el GPS y la señal.')
}

const ensureNativeLocationPermission = async () => {
  let permission = await Geolocation.checkPermissions()

  if (permission.location !== 'granted') {
    permission = await Geolocation.requestPermissions({ permissions: ['location'] })
  }

  if (permission.location !== 'granted') {
    throw new Error('El permiso de ubicación fue denegado. Habilítalo en los ajustes de la aplicación.')
  }
}

const getNativePositionOptions = (options) => ({
  enableHighAccuracy: options.enableHighAccuracy,
  timeout: options.timeout,
  maximumAge: options.maximumAge,
  interval: options.interval,
  minimumUpdateInterval: options.minimumUpdateInterval,
})

export const getCurrentPosition = async (options = {}) => {
  const normalizedOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    ...options,
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await ensureNativeLocationPermission()
      return normalizePosition(await Geolocation.getCurrentPosition(
        getNativePositionOptions(normalizedOptions),
      ))
    } catch (error) {
      throw getNativeGeolocationError(error)
    }
  }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Este dispositivo o navegador no ofrece geolocalización.')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(normalizePosition(position)),
      (error) => reject(new Error(getBrowserGeolocationError(error))),
      normalizedOptions,
    )
  })
}

export const watchCurrentPosition = (successCallback, errorCallback, options = {}) => {
  const normalizedOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    interval: 5000,
    minimumUpdateInterval: 3000,
    ...options,
  }

  let isStopped = false
  let browserWatchId = null
  let nativeWatchId = null

  const cleanup = () => {
    if (isStopped) return
    isStopped = true
    activeWatchCleanups.delete(cleanup)

    if (browserWatchId != null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(browserWatchId)
      browserWatchId = null
    }

    if (nativeWatchId != null) {
      const watchId = nativeWatchId
      nativeWatchId = null
      Geolocation.clearWatch({ id: watchId }).catch((error) => {
        console.warn('No se pudo detener el watcher nativo de ubicación:', error)
      })
    }
  }

  clearAllLocationWatches()
  activeWatchCleanups.add(cleanup)

  if (Capacitor.isNativePlatform()) {
    ensureNativeLocationPermission()
      .then(() => Geolocation.watchPosition(
        getNativePositionOptions(normalizedOptions),
        (position, error) => {
          if (isStopped) return
          if (error) {
            errorCallback(getNativeGeolocationError(error))
            return
          }
          if (position) successCallback(normalizePosition(position))
        },
      ))
      .then((watchId) => {
        if (isStopped) {
          return Geolocation.clearWatch({ id: watchId })
        }
        nativeWatchId = watchId
        return undefined
      })
      .catch((error) => {
        if (!isStopped) errorCallback(getNativeGeolocationError(error))
      })
  } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
    browserWatchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!isStopped) successCallback(normalizePosition(position))
      },
      (error) => {
        if (!isStopped) errorCallback(new Error(getBrowserGeolocationError(error)))
      },
      normalizedOptions,
    )
  } else {
    queueMicrotask(() => {
      if (!isStopped) errorCallback(new Error('Este dispositivo o navegador no ofrece geolocalización.'))
    })
  }

  return cleanup
}

export const clearLocationWatch = (watchCleanup) => {
  if (typeof watchCleanup === 'function') {
    watchCleanup()
  }
}

export const clearAllLocationWatches = () => {
  [...activeWatchCleanups].forEach((cleanup) => cleanup())
}
