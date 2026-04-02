import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

type CherryTreePoint = {
  id: number
  lat: number
  lng: number
  district: string
  roadAddress: string
  heightM: number | null
  diameterCm: number | null
}

const seoulCenter: [number, number] = [37.55, 126.99]

function MapViewport({ points }: { points: CherryTreePoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) {
      map.setView(seoulCenter, 12)
      return
    }

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]))
    map.fitBounds(bounds.pad(0.05))
  }, [map, points])

  return null
}

function CherryHeatLayer({ points }: { points: CherryTreePoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) {
      return
    }

    const heat = L.heatLayer(
      points.map((point) => [point.lat, point.lng, 0.65]),
      {
        radius: 22,
        blur: 20,
        minOpacity: 0.35,
        maxZoom: 17,
        max: 1,
        gradient: {
          0.1: '#ffe4ef',
          0.3: '#fda4af',
          0.55: '#fb7185',
          0.8: '#f43f5e',
          1.0: '#881337',
        },
      },
    )

    map.addLayer(heat)

    return () => {
      map.removeLayer(heat)
    }
  }, [map, points])

  return null
}

function App() {
  const [points, setPoints] = useState<CherryTreePoint[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    async function loadCherryTrees() {
      try {
        setStatus('loading')
        const response = await fetch('/data/cherry-trees.json')
        if (!response.ok) {
          throw new Error(`Failed to load cherry tree data: ${response.status}`)
        }

        const data = (await response.json()) as CherryTreePoint[]
        if (!active) {
          return
        }

        setPoints(data)
        setStatus('ready')
      } catch (error) {
        console.error(error)
        if (!active) {
          return
        }
        setStatus('error')
      }
    }

    loadCherryTrees()

    return () => {
      active = false
    }
  }, [])

  const districtCount = useMemo(
    () => new Set(points.map((point) => point.district)).size,
    [points],
  )

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#4c0519_0%,#18181b_42%,#09090b_100%)] text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <p className="text-xs font-semibold tracking-[0.28em] text-pink-300 uppercase">
            Real Dataset Heatmap
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            서울 벚꽃 지도
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            실제 프로젝트에서 추출한 벚꽃 나무 위치 데이터를 불러와 히트맵으로
            표시합니다. 현재 화면은 `public/data/cherry-trees.json`을 기준으로
            렌더링됩니다.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-pink-300/20 bg-pink-300/10 p-4">
              <div className="text-sm font-medium text-pink-200">데이터 상태</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-zinc-400">레코드 수</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {points.length.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-zinc-400">행정구역 수</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {districtCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

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
                <li>지도 범위: 데이터 기준 자동 맞춤</li>
              </ul>
            </div>
          </div>
        </aside>

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/30">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-sm font-medium text-white">Leaflet Heatmap</div>
            <div className="mt-1 text-sm text-zinc-400">
              OpenStreetMap 위에 실제 벚꽃 나무 위치 밀도를 표시
            </div>
          </div>

          <div className="h-[70vh] min-h-[520px]">
            <MapContainer
              center={seoulCenter}
              zoom={12}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapViewport points={points} />
              <CherryHeatLayer points={points} />
            </MapContainer>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
