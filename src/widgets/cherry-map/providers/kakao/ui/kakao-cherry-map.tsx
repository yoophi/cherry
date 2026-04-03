import { useEffect, useMemo, useRef, useState } from 'react'
import type { CherryTreePoint } from '../../../../../entities/cherry-tree/model/types'
import { useIsMobile } from '../../../../../shared/lib/browser/use-is-mobile'
import { kakaoMapsAppKey } from '../../../../../shared/config/map-provider'
import { loadKakaoMapsSdk } from '../../../../../shared/lib/map/load-kakao-maps'
import { seoulCenter } from '../../../../../shared/lib/map/constants'
import { getMapLayerPoints } from '../../../model/get-map-layer-points'
import type { CherryMapCanvasProps } from '../../../model/types'

type KakaoMapStatus = 'loading' | 'ready' | 'error'

const KAKAO_CLUSTER_STYLES = [
  {
    width: '42px',
    height: '42px',
    background: 'rgba(255,200,221,0.78)',
    borderRadius: '9999px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '13px',
    lineHeight: '42px',
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  },
  {
    width: '50px',
    height: '50px',
    background: 'rgba(255,143,171,0.8)',
    borderRadius: '9999px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '50px',
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  },
  {
    width: '58px',
    height: '58px',
    background: 'rgba(214,51,132,0.82)',
    borderRadius: '9999px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '15px',
    lineHeight: '58px',
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  },
]

function createMarkerImage() {
  const kakao = window.kakao as any
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="2.5" fill="#ff8fab" stroke="white" stroke-width="1" />
    </svg>
  `)
  const imageSize = new kakao.maps.Size(8, 8)
  const imageOption = {
    offset: new kakao.maps.Point(4, 4),
  }

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${svg}`,
    imageSize,
    imageOption,
  )
}

function createInfoWindowContent(point: CherryTreePoint) {
  return `
    <div style="min-width:180px;padding:12px 14px;font-family:system-ui,sans-serif;">
      <div style="font-weight:700;color:#9f1239;">${point.district}</div>
      <div style="margin-top:6px;color:#3f3f46;">${point.roadAddress || '도로명 정보 없음'}</div>
      <div style="margin-top:8px;font-size:12px;color:#71717a;">
        수고 ${point.heightM ?? '-'}m · 흉고 ${point.diameterCm ?? '-'}cm
      </div>
    </div>
  `
}

export function KakaoCherryMap({ points }: CherryMapCanvasProps) {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null)
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null)
  const listenersRef = useRef<Array<() => void>>([])
  const [status, setStatus] = useState<KakaoMapStatus>('loading')
  const [zoom, setZoom] = useState(8)

  const { clusterPoints } = useMemo(
    () => getMapLayerPoints(points, isMobile, zoom),
    [isMobile, points, zoom],
  )

  useEffect(() => {
    if (!kakaoMapsAppKey) {
      setStatus('error')
      return
    }

    let active = true

    loadKakaoMapsSdk()
      .then(() => {
        if (!active || !containerRef.current) {
          return
        }

        const kakao = window.kakao as any
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(seoulCenter[0], seoulCenter[1]),
          level: 8,
        })

        map.addControl(
          new kakao.maps.ZoomControl(),
          kakao.maps.ControlPosition.LEFT,
        )

        const handleIdle = () => {
          setZoom(map.getLevel())
        }

        kakao.maps.event.addListener(map, 'idle', handleIdle)
        listenersRef.current.push(() => {
          kakao.maps.event.removeListener(map, 'idle', handleIdle)
        })

        mapRef.current = map
        infoWindowRef.current = new kakao.maps.InfoWindow({
          removable: true,
        })
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        if (active) {
          setStatus('error')
        }
      })

    return () => {
      active = false
      listenersRef.current.forEach((removeListener) => removeListener())
      listenersRef.current = []
      clustererRef.current?.clear()
      clustererRef.current = null
      infoWindowRef.current?.close()
      infoWindowRef.current = null
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    if (points.length === 0) {
      const kakao = window.kakao as any
      mapRef.current.setCenter(
        new kakao.maps.LatLng(seoulCenter[0], seoulCenter[1]),
      )
      mapRef.current.setLevel(8)
      return
    }

    const kakao = window.kakao as any
    const bounds = new kakao.maps.LatLngBounds()
    for (const point of points) {
      bounds.extend(new kakao.maps.LatLng(point.lat, point.lng))
    }

    mapRef.current.setBounds(bounds)
  }, [points])

  useEffect(() => {
    if (!mapRef.current || status !== 'ready') {
      return
    }

    clustererRef.current?.clear()

    const markerImage = createMarkerImage()
    const kakao = window.kakao as any
    const markers = clusterPoints.map((point) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(point.lat, point.lng),
        image: markerImage,
      })

      const handleMarkerClick = () => {
        infoWindowRef.current?.setContent(createInfoWindowContent(point))
        infoWindowRef.current?.open(mapRef.current, marker)
      }

      kakao.maps.event.addListener(marker, 'click', handleMarkerClick)
      listenersRef.current.push(() => {
        kakao.maps.event.removeListener(marker, 'click', handleMarkerClick)
      })

      return marker
    })

    clustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapRef.current,
      averageCenter: true,
      minLevel: isMobile ? 6 : 4,
      gridSize: isMobile ? 32 : 40,
      styles: KAKAO_CLUSTER_STYLES,
      calculator: [20, 80],
      texts: (size: number) => String(size),
    })

    clustererRef.current.addMarkers(markers)

    return () => {
      clustererRef.current?.clear()
    }
  }, [clusterPoints, isMobile, status])

  return (
    <section className="relative h-full min-h-0">
      <div ref={containerRef} className="h-full w-full" />

      {status === 'loading' ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#fff5f8]/70 text-sm font-medium text-zinc-700">
          Kakao 지도 로딩 중
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fff5f8] px-6 text-center text-sm leading-6 text-zinc-700">
          <div>
            <div className="font-semibold text-zinc-950">Kakao 지도 설정이 필요합니다.</div>
            <div className="mt-2">
              <code>VITE_KAKAO_MAPS_APP_KEY</code> 환경변수를 설정한 뒤 다시 실행해주세요.
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
