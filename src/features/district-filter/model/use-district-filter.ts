import { useMemo, useState } from 'react'
import {
  filterCherryTreesByDistrict,
  getCherryTreeDistricts,
} from '../../../entities/cherry-tree/model/selectors'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'

export function useDistrictFilter(points: CherryTreePoint[]) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const districts = useMemo(() => getCherryTreeDistricts(points), [points])
  const filteredPoints = useMemo(
    () => filterCherryTreesByDistrict(points, selectedDistrict),
    [points, selectedDistrict],
  )

  return {
    districts,
    filteredPoints,
    selectedDistrict,
    setSelectedDistrict,
  }
}
