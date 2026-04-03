export type MapProvider = 'osm' | 'kakao'

const mapProvider = import.meta.env.VITE_MAP_PROVIDER?.toLowerCase()

export const activeMapProvider: MapProvider =
  mapProvider === 'kakao' ? 'kakao' : 'osm'

export const kakaoMapsAppKey = import.meta.env.VITE_KAKAO_MAPS_APP_KEY ?? ''
