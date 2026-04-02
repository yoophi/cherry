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
    <section className="h-full min-h-0">
      <div className="h-full w-full">
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
