const DEFAULT_BASE_URL = 'https://router.project-osrm.org'
const EARTH_RADIUS_METERS = 6371000

const normalizeBaseUrl = (baseUrl) => (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')

const toRadians = (degrees) => degrees * (Math.PI / 180)

const getDistanceMeters = (first, second) => {
  const latitudeDifference = toRadians(second[0] - first[0])
  const longitudeDifference = toRadians(second[1] - first[1])
  const firstLatitude = toRadians(first[0])
  const secondLatitude = toRadians(second[0])
  const haversine = Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) *
    Math.sin(longitudeDifference / 2) ** 2

  return EARTH_RADIUS_METERS * 2 * Math.atan2(
    Math.sqrt(haversine),
    Math.sqrt(1 - haversine),
  )
}

const getProjectedSegmentDistance = (point, start, end) => {
  const latitudeScale = 110540
  const longitudeScale = 111320 * Math.cos(toRadians(point[0]))
  const pointX = (point[1] - start[1]) * longitudeScale
  const pointY = (point[0] - start[0]) * latitudeScale
  const endX = (end[1] - start[1]) * longitudeScale
  const endY = (end[0] - start[0]) * latitudeScale
  const segmentLengthSquared = endX ** 2 + endY ** 2
  const fraction = segmentLengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, (pointX * endX + pointY * endY) / segmentLengthSquared))
  const projectedX = pointX - endX * fraction
  const projectedY = pointY - endY * fraction

  return {
    distanceMeters: Math.hypot(projectedX, projectedY),
    fraction,
  }
}

const describeManeuver = (maneuver) => {
  const type = maneuver?.type || 'continue'
  const modifier = maneuver?.modifier || ''
  const turnInstructions = {
    left: 'Gira a la izquierda',
    right: 'Gira a la derecha',
    'slight left': 'Gira ligeramente a la izquierda',
    'slight right': 'Gira ligeramente a la derecha',
    'sharp left': 'Gira pronunciadamente a la izquierda',
    'sharp right': 'Gira pronunciadamente a la derecha',
    straight: 'Continúa recto',
    uturn: 'Haz un retorno',
  }

  if (type === 'depart') return 'Inicia el recorrido'
  if (type === 'arrive') return 'Has llegado a tu destino'

  if (type === 'roundabout' || type === 'rotary' || type === 'roundabout turn') {
    const exit = maneuver?.exit
    return `En la rotonda, toma la salida${exit ? ` ${exit}` : ''}`
  }

  if (type === 'turn' || type === 'end of road' || type === 'fork') {
    return turnInstructions[modifier] || 'Continúa por la vía'
  }

  if (type === 'merge') {
    return `Incorpórate${modifier ? ` hacia ${modifier}` : ''}`
  }

  if (type === 'on ramp') return 'Toma la vía de acceso'
  if (type === 'off ramp') return 'Toma la salida'
  if (type === 'new name') return 'Continúa'

  return 'Continúa por la vía'
}

export const buildRouteUrl = ({
  from,
  to,
  baseUrl = import.meta.env.VITE_ROUTING_BASE_URL || DEFAULT_BASE_URL,
}) => {
  if (!from || !to) {
    throw new Error('Se requieren coordenadas origen y destino para generar la ruta.')
  }

  const coordinates = [from, to].map(({ latitude, longitude }) => {
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      throw new Error('Las coordenadas para solicitar la ruta no son válidas.')
    }
    return `${lon},${lat}`
  })

  return `${normalizeBaseUrl(baseUrl)}/route/v1/driving/${coordinates.join(';')}?overview=full&geometries=geojson&steps=true&annotations=distance,duration`
}

const getRoutePositionAtDistance = (geometry, distanceMeters) => {
  let accumulatedDistance = 0

  for (let index = 0; index < geometry.length - 1; index += 1) {
    const start = geometry[index]
    const end = geometry[index + 1]
    const segmentLength = getDistanceMeters(start, end)

    if (distanceMeters <= accumulatedDistance + segmentLength || index === geometry.length - 2) {
      const fraction = segmentLength === 0
        ? 0
        : Math.max(0, Math.min(1, (distanceMeters - accumulatedDistance) / segmentLength))
      return {
        projectedPoint: [
          start[0] + (end[0] - start[0]) * fraction,
          start[1] + (end[1] - start[1]) * fraction,
        ],
        segmentIndex: index,
        fraction,
      }
    }

    accumulatedDistance += segmentLength
  }

  return null
}

export const getRouteProgress = (route, location, minimumProgressMeters = 0) => {
  const geometry = route?.geometry || []
  const invalidProgress = {
    valid: false,
    distanceFromRouteMeters: Infinity,
    traveledMeters: 0,
    geometryLengthMeters: 0,
    projectedPoint: null,
    segmentIndex: null,
    fraction: null,
  }

  if (
    geometry.length < 2 ||
    !location ||
    !Number.isFinite(Number(location.latitude)) ||
    !Number.isFinite(Number(location.longitude))
  ) {
    return invalidProgress
  }

  const point = [Number(location.latitude), Number(location.longitude)]
  if (point[0] < -90 || point[0] > 90 || point[1] < -180 || point[1] > 180) {
    return invalidProgress
  }

  let traveledMeters = 0
  let nearestDistance = Infinity
  let nearestProgress = 0

  for (let index = 0; index < geometry.length - 1; index += 1) {
    const start = geometry[index]
    const end = geometry[index + 1]
    if (
      !Array.isArray(start) ||
      !Array.isArray(end) ||
      !Number.isFinite(start[0]) ||
      !Number.isFinite(start[1]) ||
      !Number.isFinite(end[0]) ||
      !Number.isFinite(end[1]) ||
      start[0] < -90 ||
      start[0] > 90 ||
      start[1] < -180 ||
      start[1] > 180 ||
      end[0] < -90 ||
      end[0] > 90 ||
      end[1] < -180 ||
      end[1] > 180
    ) {
      return invalidProgress
    }

    const segmentLength = getDistanceMeters(start, end)
    const projection = getProjectedSegmentDistance(point, start, end)

    if (projection.distanceMeters < nearestDistance) {
      nearestDistance = projection.distanceMeters
      nearestProgress = traveledMeters + segmentLength * projection.fraction
    }

    traveledMeters += segmentLength
  }

  if (!Number.isFinite(nearestDistance)) return invalidProgress

  const progressFloor = Math.max(
    0,
    Math.min(traveledMeters, Number(minimumProgressMeters) || 0),
  )
  const progressMeters = Math.max(progressFloor, nearestProgress)
  const position = getRoutePositionAtDistance(geometry, progressMeters)
  if (!position) return invalidProgress

  return {
    valid: true,
    distanceFromRouteMeters: nearestDistance,
    traveledMeters: progressMeters,
    geometryLengthMeters: traveledMeters,
    projectedPoint: position.projectedPoint,
    segmentIndex: position.segmentIndex,
    fraction: position.fraction,
  }
}

export const splitRouteGeometry = (route, progress) => {
  const geometry = route?.geometry
  const { projectedPoint, segmentIndex } = progress || {}

  if (
    !Array.isArray(geometry) ||
    geometry.length < 2 ||
    !Array.isArray(projectedPoint) ||
    !Number.isInteger(segmentIndex) ||
    segmentIndex < 0 ||
    segmentIndex >= geometry.length - 1
  ) {
    return null
  }

  return {
    traveledGeometry: [...geometry.slice(0, segmentIndex + 1), projectedPoint],
    remainingGeometry: [projectedPoint, ...geometry.slice(segmentIndex + 1)],
  }
}

export const getNextManeuver = (
  route,
  location,
  reachedThresholdMeters = 18,
  minimumStepIndex = 0,
  progressMeters = null,
) => {
  if (!route?.steps?.length) return null

  const progress = Number.isFinite(progressMeters)
    ? progressMeters
    : getRouteProgress(route, location).traveledMeters
  const departureStepIndex = route.steps.findIndex((step, index) =>
    index >= minimumStepIndex && step.maneuverType === 'depart',
  )
  const departureStep = departureStepIndex >= 0 ? route.steps[departureStepIndex] : null
  if (departureStep && progress < reachedThresholdMeters) {
    return { ...departureStep, stepIndex: departureStepIndex, distanceToManeuverMeters: 0 }
  }

  const upcomingStepIndex = route.steps.findIndex((step, index) =>
    index >= minimumStepIndex &&
    step.maneuverType !== 'depart' &&
    step.distanceAlongRouteMeters > progress + reachedThresholdMeters,
  )

  if (upcomingStepIndex >= 0) {
    const upcomingStep = route.steps[upcomingStepIndex]
    return {
      ...upcomingStep,
      stepIndex: upcomingStepIndex,
      distanceToManeuverMeters: Math.max(0, upcomingStep.distanceAlongRouteMeters - progress),
    }
  }

  const arrivalStepIndex = route.steps.findIndex((step, index) =>
    index >= minimumStepIndex && step.maneuverType === 'arrive',
  )
  const arrivalStep = arrivalStepIndex >= 0 ? route.steps[arrivalStepIndex] : null
  if (!arrivalStep) return null

  const remainingDistance = Math.max(0, (route.distanceMeters || 0) - progress)
  return {
    ...arrivalStep,
    stepIndex: arrivalStepIndex,
    distanceToManeuverMeters: remainingDistance,
  }
};

export const fetchRoute = async ({ from, to, baseUrl, signal }) => {
  const routeUrl = buildRouteUrl({ from, to, baseUrl })
  const response = await fetch(routeUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OSRM respondió con error ${response.status}: ${errorText || 'sin detalle'}`)
  }

  const payload = await response.json()
  const route = payload.routes?.[0]

  if (!route) {
    throw new Error(payload.message || 'OSRM no encontró una ruta para estas coordenadas.')
  }

  const geometry = Array.isArray(route.geometry?.coordinates)
    ? route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])
    : []

  if (geometry.length < 2) {
    throw new Error('OSRM devolvió una ruta sin geometría suficiente.')
  }

  const rawSteps = (route.legs || []).flatMap((leg) => leg.steps || [])
  let distanceAlongRouteMeters = 0
  const steps = rawSteps.map((step) => {
    const maneuver = step.maneuver || {}
    const location = Array.isArray(maneuver.location)
      ? [Number(maneuver.location[0]), Number(maneuver.location[1])]
      : null
    const streetName = step.name?.trim() || ''
    const distance = Number(step.distance) || 0
    const stepDistanceAlongRoute = distanceAlongRouteMeters
    distanceAlongRouteMeters += distance

    return {
      distance,
      duration: Number(step.duration) || 0,
      streetName,
      instruction: describeManeuver(maneuver),
      maneuver,
      maneuverType: maneuver.type || '',
      location,
      distanceAlongRouteMeters: stepDistanceAlongRoute,
    }
  })

  return {
    geometry,
    distanceMeters: Number(route.distance) || 0,
    durationSeconds: Number(route.duration) || 0,
    steps,
  }
}
