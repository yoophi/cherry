import 'leaflet'

declare module 'leaflet.markercluster'
declare module 'leaflet.heat'

declare module 'leaflet' {
  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup

  interface MarkerClusterGroupOptions {
    maxClusterRadius?: number
    showCoverageOnHover?: boolean
    spiderfyOnMaxZoom?: boolean
    disableClusteringAtZoom?: number
  }

  interface MarkerClusterGroup extends LayerGroup {
    addLayer(layer: Layer): this
    addLayers(layers: Layer[]): this
    clearLayers(): this
  }

  function heatLayer(
    latlngs: Array<[number, number] | [number, number, number]>,
    options?: HeatLayerOptions,
  ): Layer

  interface HeatLayerOptions {
    minOpacity?: number
    maxZoom?: number
    max?: number
    radius?: number
    blur?: number
    gradient?: Record<number, string>
  }
}
