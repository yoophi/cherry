import { useMemo } from 'react'
import { useCherryTrees } from '../../../entities/cherry-tree/model/use-cherry-trees'
import { CherryMap } from '../../../widgets/cherry-map/ui/cherry-map'
import { CherryOverview } from '../../../widgets/cherry-overview/ui/cherry-overview'

export function HomePage() {
  const { points, status } = useCherryTrees()

  const districtCount = useMemo(
    () => new Set(points.map((point) => point.district)).size,
    [points],
  )

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#4c0519_0%,#18181b_42%,#09090b_100%)] text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CherryOverview
          pointCount={points.length}
          districtCount={districtCount}
          status={status}
        />
        <CherryMap points={points} />
      </div>
    </main>
  )
}
