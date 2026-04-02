import type { CherryTreePoint } from './types'

export function getCherryTreeDistricts(points: CherryTreePoint[]) {
  return [...new Set(points.map((point) => point.district))].sort((a, b) =>
    a.localeCompare(b, 'ko'),
  )
}

export function filterCherryTreesByDistrict(
  points: CherryTreePoint[],
  district: string | null,
) {
  if (!district) {
    return points
  }

  return points.filter((point) => point.district === district)
}
