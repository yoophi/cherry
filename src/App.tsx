import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
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

function CherryClusterLayer({ points }: { points: CherryTreePoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) {
      return
    }

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 42,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 17,
      iconCreateFunction(cluster) {
        const count = cluster.getChildCount()
        const tone =
          count > 400 ? '#881337' : count > 150 ? '#be123c' : count > 50 ? '#e11d48' : '#fb7185'
        const size = count > 400 ? 58 : count > 150 ? 52 : count > 50 ? 46 : 40

        return L.divIcon({
          html: `
            <div style="
              width:${size}px;
              height:${size}px;
              border-radius:9999px;
              background:${tone};
              color:white;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:700;
              font-size:13px;
              border:3px solid rgba(255,255,255,0.95);
              box-shadow:0 10px 24px rgba(0,0,0,0.28);
            ">
              ${count}
            </div>
          `,
          className: '',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })
      },
    })

    const pointIcon = L.divIcon({
      html: '<div style="width:10px;height:10px;border-radius:9999px;background:#ffe4ef;border:2px solid #be123c;box-shadow:0 4px 10px rgba(190,24,93,0.25);"></div>',
      className: '',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    })

    const markers = points.map((point) =>
      L.marker([point.lat, point.lng], { icon: pointIcon }).bindPopup(
        `
          <div style="min-width:180px;font-family:system-ui,sans-serif;">
            <div style="font-weight:700;color:#9f1239;">${point.district}</div>
            <div style="margin-top:6px;color:#3f3f46;">${point.roadAddress || '도로명 정보 없음'}</div>
            <div style="margin-top:8px;font-size:12px;color:#71717a;">
              수고 ${point.heightM ?? '-'}m · 흉고 ${point.diameterCm ?? '-'}cm
            </div>
          </div>
        `,
      ),
    )

    clusterGroup.addLayers(markers)
    map.addLayer(clusterGroup)

    return () => {
      map.removeLayer(clusterGroup)
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
            렌더링되며, 원본처럼 숫자 클러스터도 함께 보입니다.
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
                <li>클러스터 숫자 레이어: 활성화</li>
                <li>지도 범위: 데이터 기준 자동 맞춤</li>
              </ul>
            </div>
          </div>
        </aside>

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/30">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-sm font-medium text-white">
              Leaflet Heatmap + Cluster Counts
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              OpenStreetMap 위에 실제 벚꽃 나무 밀도와 클러스터 개수를 함께 표시
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
              <CherryClusterLayer points={points} />
            </MapContainer>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
