import type { ReactNode } from 'react'
import type { CherryTreeDistrictStat } from '../../../entities/cherry-tree/model/selectors'

type CherryOverviewProps = {
  className?: string
  pointCount: number
  districtCount: number
  districtStats: CherryTreeDistrictStat[]
  selectedDistrict: string | null
  status: 'loading' | 'ready' | 'error'
  onSelectDistrict: (district: string | null) => void
  filterSlot?: ReactNode
  onClose?: () => void
}

export function CherryOverview({
  className,
  pointCount,
  districtCount,
  districtStats,
  selectedDistrict,
  status,
  onSelectDistrict,
  filterSlot,
  onClose,
}: CherryOverviewProps) {
  const maxCount = districtStats[0]?.count ?? 1

  return (
    <aside
      className={`h-full overflow-y-auto border-r border-white/10 bg-[#fff5f8]/95 p-6 text-zinc-800 backdrop-blur ${className ?? ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-pink-300 uppercase">
            Real Dataset Heatmap
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            서울 벚꽃 지도
          </h1>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#ffd6e3] bg-white px-3 py-1 text-sm font-medium text-zinc-600 transition hover:bg-[#fff5f8]"
          >
            닫기
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        실제 프로젝트에서 추출한 벚꽃 나무 위치 데이터를 불러와 히트맵으로
        표시합니다. 현재 화면은 <code>public/data/cherry-trees.json</code>을
        기준으로 렌더링되며, 원본처럼 숫자 클러스터도 함께 보입니다.
      </p>

      <div className="mt-8 space-y-3">
        <div className="rounded-2xl border border-pink-300/30 bg-pink-300/12 p-4">
          <div className="text-sm font-medium text-[#d63384]">데이터 상태</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-[#ffd6e3] bg-white p-3">
              <div className="text-zinc-500">레코드 수</div>
              <div className="mt-1 text-xl font-semibold text-zinc-950">
                {pointCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl border border-[#ffd6e3] bg-white p-3">
              <div className="text-zinc-500">행정구역 수</div>
              <div className="mt-1 text-xl font-semibold text-zinc-950">
                {districtCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-[#d63384]">
            현재 선택: {selectedDistrict ?? '전체'}
          </div>
        </div>

        {filterSlot}

        <div className="rounded-2xl border border-[#ffd6e3] bg-white p-0 text-sm text-zinc-700">
          <div className="border-b border-[#ffeef4] px-4 py-3 font-medium text-zinc-950">
            구별 리스트
          </div>
          <div className="max-h-[42vh] overflow-y-auto">
            {districtStats.map((stat) => {
              const isActive = selectedDistrict === stat.district
              const width = Math.max(
                6,
                Math.round((stat.count / maxCount) * 100),
              )

              return (
                <button
                  key={stat.district}
                  type="button"
                  onClick={() => {
                    onSelectDistrict(stat.district)
                    onClose?.()
                  }}
                  className={`block w-full border-b border-[#ffeef4] px-4 py-3 text-left transition hover:bg-[#fff5f8] ${
                    isActive ? 'border-l-[3px] border-l-[#ff8fab] bg-[#fff0f5]' : ''
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-zinc-800">
                      {stat.district}
                    </span>
                    <span className="text-[13px] font-bold text-[#d63384]">
                      {stat.count.toLocaleString()}그루
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-[#ffeef4]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#ff8fab,#ffc8dd)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectDistrict(null)
              onClose?.()
            }}
            className={`w-full px-4 py-3 text-left text-xs font-medium transition ${
              selectedDistrict === null
                ? 'bg-[#fff0f5] text-[#d63384]'
                : 'bg-[#fafafa] text-zinc-500 hover:bg-[#fff5f8]'
            }`}
          >
            전체 보기
          </button>
        </div>

        <div className="rounded-2xl border border-[#ffd6e3] bg-white p-4 text-sm text-zinc-600">
          <div className="font-medium text-zinc-950">현재 상태</div>
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
