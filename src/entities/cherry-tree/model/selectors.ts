import type { CherryTreePoint } from './types'

export type CherryTreeDistrictStat = {
  district: string
  count: number
}

export function getCherryTreeDistricts(points: CherryTreePoint[]) {
  return [...new Set(points.map((point) => point.district))].sort((a, b) =>
    a.localeCompare(b, 'ko'),
  )
}

export function getCherryTreeDistrictStats(
  points: CherryTreePoint[],
): CherryTreeDistrictStat[] {
  const counts = points.reduce<Record<string, number>>((acc, point) => {
    acc[point.district] = (acc[point.district] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count || a.district.localeCompare(b.district, 'ko'))
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
