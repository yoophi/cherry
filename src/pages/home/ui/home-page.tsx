import { useMemo } from 'react'
import { useCherryTrees } from '../../../entities/cherry-tree/model/use-cherry-trees'
import { DistrictFilter } from '../../../features/district-filter/ui/district-filter'
import { useDistrictFilter } from '../../../features/district-filter/model/use-district-filter'
import { CherryMap } from '../../../widgets/cherry-map/ui/cherry-map'
import { CherryOverview } from '../../../widgets/cherry-overview/ui/cherry-overview'

export function HomePage() {
  const { points, status } = useCherryTrees()
  const { districts, filteredPoints, selectedDistrict, setSelectedDistrict } =
    useDistrictFilter(points)

  const districtCount = useMemo(
    () => new Set(points.map((point) => point.district)).size,
    [points],
  )

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#4c0519_0%,#18181b_42%,#09090b_100%)] text-zinc-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CherryOverview
          pointCount={filteredPoints.length}
          districtCount={districtCount}
          selectedDistrict={selectedDistrict}
          status={status}
          filterSlot={
            <DistrictFilter
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelect={setSelectedDistrict}
            />
          }
        />
        <CherryMap points={filteredPoints} />
      </div>
    </main>
  )
}
