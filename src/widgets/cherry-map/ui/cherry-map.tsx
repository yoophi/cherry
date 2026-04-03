import { activeMapProvider } from '../../../shared/config/map-provider'
import { KakaoCherryMap } from '../providers/kakao/ui/kakao-cherry-map'
import { OsmCherryMap } from '../providers/osm/ui/osm-cherry-map'
import type { CherryMapCanvasProps } from '../model/types'

export function CherryMap(props: CherryMapCanvasProps) {
  if (activeMapProvider === 'kakao') {
    return <KakaoCherryMap {...props} />
  }

  return <OsmCherryMap {...props} />
}
