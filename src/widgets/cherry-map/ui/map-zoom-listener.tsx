import { useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'

type MapZoomListenerProps = {
  onZoomChange: (zoom: number) => void
}

export function MapZoomListener({ onZoomChange }: MapZoomListenerProps) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom())
    },
  })

  useEffect(() => {
    onZoomChange(map.getZoom())
  }, [map, onZoomChange])

  return null
}
