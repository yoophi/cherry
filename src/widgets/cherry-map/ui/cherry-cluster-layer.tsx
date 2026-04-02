import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import { useMap } from 'react-leaflet'
import type { CherryTreePoint } from '../../../entities/cherry-tree/model/types'
import {
  createCherryPointIcon,
  createCherryClusterIcon,
} from '../../../shared/lib/map/cherry-cluster-icon'

type CherryClusterLayerProps = {
  points: CherryTreePoint[]
}

export function CherryClusterLayer({ points }: CherryClusterLayerProps) {
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
        return createCherryClusterIcon(cluster.getChildCount())
      },
    })

    const markers = points.map((point) =>
      L.marker([point.lat, point.lng], { icon: createCherryPointIcon() }).bindPopup(
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
