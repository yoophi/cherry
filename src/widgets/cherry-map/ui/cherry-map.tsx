import { useMemo, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'
import { useIsMobile } from '../../../shared/lib/browser/use-is-mobile'
import { seoulCenter } from '../../../shared/lib/map/constants'
import { CherryClusterLayer } from './cherry-cluster-layer'
import { CherryHeatLayer } from './cherry-heat-layer'
import { MapZoomListener } from './map-zoom-listener'
import { MapViewport } from './map-viewport'

type CherryMapProps = {
  points: CherryTreePoint[]
}

export function CherryMap({ points }: CherryMapProps) {
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState(12)

  const mobileHeatStep = useMemo(() => {
    if (!isMobile) {
      return 1
    }

    if (zoom <= 11) {
      return 8
    }

    if (zoom <= 13) {
      return 5
    }

    if (zoom <= 15) {
      return 3
    }

    return 1
  }, [isMobile, zoom])

  const mobileClusterStep = useMemo(() => {
    if (!isMobile) {
      return 1
    }

    if (zoom <= 11) {
      return 10
    }

    if (zoom <= 13) {
      return 6
    }

    if (zoom <= 15) {
      return 3
    }

    return 1
  }, [isMobile, zoom])

  const heatPoints = useMemo(() => {
    if (mobileHeatStep === 1) {
      return points
    }

    return points.filter((_, index) => index % mobileHeatStep === 0)
  }, [mobileHeatStep, points])

  const clusterPoints = useMemo(() => {
    if (mobileClusterStep === 1) {
      return points
    }

    return points.filter((_, index) => index % mobileClusterStep === 0)
  }, [mobileClusterStep, points])

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
