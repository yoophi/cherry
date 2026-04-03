/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_PROVIDER?: 'osm' | 'kakao'
  readonly VITE_KAKAO_MAPS_APP_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
