import { useMemo, useState } from 'react'
import { getCherryTreeDistrictStats } from '../../../entities/cherry-tree/model/selectors'
import { useCherryTrees } from '../../../entities/cherry-tree/model/use-cherry-trees'
import { DistrictFilter } from '../../../features/district-filter/ui/district-filter'
import { useDistrictFilter } from '../../../features/district-filter/model/use-district-filter'
import { CherryMap } from '../../../widgets/cherry-map/ui/cherry-map'
import { CherryOverview } from '../../../widgets/cherry-overview/ui/cherry-overview'

export function HomePage() {
  const { points, status } = useCherryTrees()
  const { districts, filteredPoints, selectedDistrict, setSelectedDistrict } =
    useDistrictFilter(points)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const districtCount = useMemo(
    () => new Set(points.map((point) => point.district)).size,
    [points],
  )
  const districtStats = useMemo(() => getCherryTreeDistrictStats(points), [points])

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#4c0519_0%,#18181b_42%,#09090b_100%)] text-zinc-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CherryOverview
          className="hidden lg:block"
          pointCount={filteredPoints.length}
          districtCount={districtCount}
          districtStats={districtStats}
          selectedDistrict={selectedDistrict}
          status={status}
          onSelectDistrict={setSelectedDistrict}
          filterSlot={
            <DistrictFilter
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelect={setSelectedDistrict}
            />
          }
        />

        {isMobileSidebarOpen ? (
          <>
            <button
              type="button"
              aria-label="사이드바 닫기"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-[999] bg-black/45 lg:hidden"
            />
            <CherryOverview
              className="fixed inset-y-0 left-0 z-[1000] w-[min(88vw,360px)] border-r border-[#ffd6e3] shadow-2xl lg:hidden"
              pointCount={filteredPoints.length}
              districtCount={districtCount}
              districtStats={districtStats}
              selectedDistrict={selectedDistrict}
              status={status}
              onSelectDistrict={setSelectedDistrict}
              onClose={() => setIsMobileSidebarOpen(false)}
              filterSlot={
                <DistrictFilter
                  districts={districts}
                  selectedDistrict={selectedDistrict}
                  onSelect={(district) => {
                    setSelectedDistrict(district)
                    setIsMobileSidebarOpen(false)
                  }}
                />
              }
            />
          </>
        ) : null}

        <div className="relative h-full min-h-0">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="absolute top-4 left-4 z-[900] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur transition hover:bg-black/55 lg:hidden"
            aria-label="사이드바 열기"
          >
            <span className="text-xl leading-none">☰</span>
          </button>

          <CherryMap points={filteredPoints} />
        </div>
      </div>
    </main>
  )
}
