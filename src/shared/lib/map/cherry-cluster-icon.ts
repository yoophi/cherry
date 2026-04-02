import L from 'leaflet'

export function createCherryPointIcon() {
  return L.divIcon({
    html: `
      <div style="
        width:5px;
        height:5px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:9999px;
        background:#ff8fab;
        border:1px solid white;
        box-shadow:0 1px 3px rgba(0,0,0,0.3);
      ">
      </div>
    `,
    className: '',
    iconSize: [5, 5],
    iconAnchor: [2.5, 2.5],
  })
}

export function createCherryClusterIcon(count: number) {
  const normalized = Math.min(Math.log10(count + 1) / Math.log10(1000), 1)
  const size = Math.round(36 + normalized * 28)
  const outerTone =
    count > 400
      ? 'rgba(255,107,157,0.6)'
      : count > 150
        ? 'rgba(255,143,171,0.6)'
        : 'rgba(255,200,221,0.7)'
  const innerTone =
    count > 400
      ? 'rgba(214,51,132,0.8)'
      : count > 150
        ? 'rgba(255,107,157,0.8)'
        : 'rgba(255,143,171,0.8)'

  return L.divIcon({
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:9999px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:${outerTone};
        box-shadow:0 10px 24px rgba(0,0,0,0.18);
      ">
        <div style="
          width:${Math.max(size - 10, 28)}px;
          height:${Math.max(size - 10, 28)}px;
          border-radius:9999px;
          background:${innerTone};
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:700;
          font-size:${Math.max(12, Math.round(size * 0.28))}px;
        ">
          ${count}
        </div>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
