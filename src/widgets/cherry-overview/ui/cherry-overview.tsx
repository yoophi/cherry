import type { ReactNode } from 'react'

type CherryOverviewProps = {
  pointCount: number
  districtCount: number
  selectedDistrict: string | null
  status: 'loading' | 'ready' | 'error'
  filterSlot?: ReactNode
}

export function CherryOverview({
  pointCount,
  districtCount,
  selectedDistrict,
  status,
  filterSlot,
}: CherryOverviewProps) {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.28em] text-pink-300 uppercase">
        Real Dataset Heatmap
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        서울 벚꽃 지도
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        실제 프로젝트에서 추출한 벚꽃 나무 위치 데이터를 불러와 히트맵으로
        표시합니다. 현재 화면은 <code>public/data/cherry-trees.json</code>을
        기준으로 렌더링되며, 원본처럼 숫자 클러스터도 함께 보입니다.
      </p>

      <div className="mt-8 space-y-3">
        <div className="rounded-2xl border border-pink-300/20 bg-pink-300/10 p-4">
          <div className="text-sm font-medium text-pink-200">데이터 상태</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="text-zinc-400">레코드 수</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {pointCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="text-zinc-400">행정구역 수</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {districtCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-pink-100">
            현재 선택: {selectedDistrict ?? '전체'}
          </div>
        </div>

        {filterSlot}

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
          <div className="font-medium text-white">현재 상태</div>
          <ul className="mt-3 space-y-2">
            <li>
              데이터 로드:{' '}
              {status === 'loading'
                ? '불러오는 중'
                : status === 'ready'
                  ? '완료'
                  : '실패'}
            </li>
            <li>히트맵 레이어: 활성화</li>
            <li>클러스터 숫자 레이어: 활성화</li>
            <li>지도 범위: 데이터 기준 자동 맞춤</li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
