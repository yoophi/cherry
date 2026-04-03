import { kakaoMapsAppKey } from '../../config/map-provider'

declare global {
  interface Window {
    kakao?: any
  }
}

let kakaoMapsPromise: Promise<any> | null = null

export function loadKakaoMapsSdk() {
  if (!kakaoMapsAppKey) {
    return Promise.reject(new Error('Missing VITE_KAKAO_MAPS_APP_KEY'))
  }

  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Kakao Maps SDK requires a browser environment'))
  }

  if (window.kakao?.maps) {
    return new Promise<any>((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao))
    })
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise
  }

  kakaoMapsPromise = new Promise<any>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakaoMapsAppKey}&libraries=clusterer`
    script.async = true
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('Kakao Maps SDK did not initialize correctly'))
        return
      }

      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = () => {
      reject(new Error('Failed to load Kakao Maps SDK'))
    }

    document.head.appendChild(script)
  })

  return kakaoMapsPromise
}
