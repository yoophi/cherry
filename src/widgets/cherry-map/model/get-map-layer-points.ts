import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'

type MapLayerPoints = {
  heatPoints: CherryTreePoint[]
  clusterPoints: CherryTreePoint[]
}

function getHeatStep(isMobile: boolean, zoom: number) {
  if (!isMobile) {
    return 1
  }

  if (zoom <= 11) {
    return 8
  }

  if (zoom <= 13) {
    return 5
  }

  if (zoom <= 15) {
    return 3
  }

  return 1
}

function getClusterStep(isMobile: boolean, zoom: number) {
  if (!isMobile) {
    return 1
  }

  if (zoom <= 11) {
    return 10
  }

  if (zoom <= 13) {
    return 6
  }

  if (zoom <= 15) {
    return 3
  }

  return 1
}

function samplePoints(points: CherryTreePoint[], step: number) {
  if (step === 1) {
    return points
  }

  return points.filter((_, index) => index % step === 0)
}

export function getMapLayerPoints(
  points: CherryTreePoint[],
  isMobile: boolean,
  zoom: number,
): MapLayerPoints {
  const heatStep = getHeatStep(isMobile, zoom)
  const clusterStep = getClusterStep(isMobile, zoom)

  return {
    heatPoints: samplePoints(points, heatStep),
    clusterPoints: samplePoints(points, clusterStep),
  }
}
