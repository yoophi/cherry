import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.heat'
import { useMap } from 'react-leaflet'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'

type CherryHeatLayerProps = {
  points: CherryTreePoint[]
  isMobile?: boolean
}

export function CherryHeatLayer({
  points,
  isMobile = false,
}: CherryHeatLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) {
      return
    }

    const heat = L.heatLayer(
      points.map((point) => [point.lat, point.lng, 0.65]),
      {
        radius: isMobile ? 22 : 28,
        blur: isMobile ? 28 : 35,
        minOpacity: 0.35,
        maxZoom: 15,
        max: 1,
        gradient: {
          0.0: 'rgba(255,230,240,0)',
          0.2: 'rgba(255,210,228,0.1)',
          0.4: 'rgba(255,192,215,0.18)',
          0.6: 'rgba(255,175,205,0.25)',
          0.8: 'rgba(255,160,195,0.3)',
          1.0: 'rgba(255,143,185,0.35)',
        },
      },
    )

    map.addLayer(heat)

    return () => {
      map.removeLayer(heat)
    }
  }, [isMobile, map, points])

  return null
}
