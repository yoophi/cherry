import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'
import { seoulCenter } from '../../../shared/lib/map/constants'
import { CherryClusterLayer } from './cherry-cluster-layer'
import { CherryHeatLayer } from './cherry-heat-layer'
import { MapViewport } from './map-viewport'

type CherryMapProps = {
  points: CherryTreePoint[]
}

export function CherryMap({ points }: CherryMapProps) {
  return (
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
  )
}
