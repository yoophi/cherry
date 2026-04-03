import { useMemo, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useIsMobile } from '../../../../../shared/lib/browser/use-is-mobile'
import { seoulCenter } from '../../../../../shared/lib/map/constants'
import { getMapLayerPoints } from '../../../model/get-map-layer-points'
import type { CherryMapCanvasProps } from '../../../model/types'
import { CherryClusterLayer } from '../../../ui/cherry-cluster-layer'
import { CherryHeatLayer } from '../../../ui/cherry-heat-layer'
import { MapViewport } from '../../../ui/map-viewport'
import { MapZoomListener } from '../../../ui/map-zoom-listener'

export function OsmCherryMap({ points }: CherryMapCanvasProps) {
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState(12)
  const { heatPoints, clusterPoints } = useMemo(
    () => getMapLayerPoints(points, isMobile, zoom),
    [isMobile, points, zoom],
  )

  return (
    <section className="h-full min-h-0">
      <div className="h-full w-full">
        <MapContainer
          center={seoulCenter}
          zoom={12}
          scrollWheelZoom
          zoomAnimation={!isMobile}
          fadeAnimation={!isMobile}
          markerZoomAnimation={!isMobile}
          className="h-full w-full"
        >
          <MapZoomListener onZoomChange={setZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewport points={points} />
          <CherryHeatLayer points={heatPoints} isMobile={isMobile} />
          <CherryClusterLayer points={clusterPoints} isMobile={isMobile} />
        </MapContainer>
      </div>
    </section>
  )
}
