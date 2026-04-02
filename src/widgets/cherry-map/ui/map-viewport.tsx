import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'
import { seoulCenter } from '../../../shared/lib/map/constants'

type MapViewportProps = {
  points: CherryTreePoint[]
}

export function MapViewport({ points }: MapViewportProps) {
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
