# Cherry 프로젝트 기술 스택 분석

검토 기준일: 2026-04-02  
검토 대상: `https://koo6312.github.io/Cherry/`

## 한 줄 요약

이 프로젝트는 **GitHub Pages에 배포된 정적 웹앱**이며, **프레임워크 없이 HTML + CSS + Vanilla JavaScript**로 구현된 **Leaflet 기반 인터랙티브 지도 서비스**다.

## 핵심 기술

### 1. 배포 방식

- `GitHub Pages` 정적 호스팅
- 응답 헤더상 `server: GitHub.com`
- `last-modified: Wed, 01 Apr 2026 00:49:56 GMT`

### 2. 프론트엔드 구성

- `HTML`
- `CSS`
- `Vanilla JavaScript`
- 별도 번들러 흔적 없음
- React/Vue/Svelte/Next/Nuxt 같은 프레임워크 흔적 없음
- TypeScript 흔적 없음

### 3. 지도/시각화 라이브러리

페이지에서 CDN으로 직접 로드하는 라이브러리:

- `Leaflet 1.9.4`
- `leaflet.markercluster 1.5.3`
- `leaflet.heat 0.2.0`

지도 타일:

- `OpenStreetMap`

## 구조적 특징

이 서비스는 사실상 **단일 HTML 파일 안에 모든 것이 들어 있는 구조**로 보인다.

- 스타일이 `<style>` 태그에 인라인으로 포함됨
- 앱 로직이 `<script>` 태그에 인라인으로 포함됨
- 데이터셋 `RAW`, `STATS`, `CENSUS`, `SPOTS`도 모두 클라이언트 코드 안에 직접 선언됨
- 외부 API를 런타임에 `fetch`하는 구조가 아님

즉, clone coding 관점에서는 다음 구조로 보면 된다.

1. 정적 헤더/사이드바 UI
2. Leaflet 지도 초기화
3. 원시 좌표 데이터로 마커 생성
4. 마커 클러스터링
5. 히트맵 오버레이
6. 구별 필터와 리스트 렌더링
7. 팝업/파티클 같은 인터랙션

## 확인된 주요 기능

### 지도 기능

- 서울 중심 초기 지도 렌더링
- 벚꽃 나무 좌표 마커 표시
- 마커 클러스터링
- 히트맵 오버레이
- 구별 필터링
- 필터 적용 시 `fitBounds`로 지도 이동

### 데이터 보강 방식

- 좌표가 있는 개별 가로수 데이터 `RAW`
- 구별 통계 데이터 `CENSUS`
- 주요 벚꽃 명소 수동 큐레이션 `SPOTS`
- API 좌표가 없는 구는 중심 좌표에 보정 마커 표시

### UI/UX

- 좌측 사이드바
- 구 필터 버튼
- 구별 수량 리스트 및 막대 시각화
- 팝업 정보창
- 클릭 시 벚꽃 파티클 애니메이션
- 날짜 기반 개화 상태 문구 변경
- 모바일에서는 사이드바 숨김

## clone coding 시 필요한 기술

최소 구현 기준:

- `HTML5`
- `CSS3`
- `JavaScript ES6 수준`
- `Leaflet`
- `leaflet.markercluster`
- `leaflet.heat`

선택 사항:

- 데이터는 처음에는 JSON 파일로 분리하는 편이 유지보수에 유리함
- 원본처럼 빠르게 만들려면 단일 `index.html` 방식도 가능

## 원본 대비 추정 가능한 비기술 요소

- 별도 백엔드 없음
- 인증/로그인 없음
- 데이터베이스 없음
- 상태관리 라이브러리 없음
- 테스트 도구 흔적 없음
- 빌드 파이프라인 흔적 없음

## 재현 난이도

낮음에서 중간 정도.

이유:

- 앱 로직 자체는 단순한 편
- 복잡한 상태관리나 비동기 데이터 흐름이 없음
- 다만 대용량 좌표 데이터를 다루므로 렌더링 성능과 마커/히트맵 조합은 신경 써야 함

## 추천 재구성 방향

clone coding을 실제 프로젝트 형태로 정리하려면 아래 구조가 더 적절하다.

- `index.html`
- `styles/main.css`
- `scripts/app.js`
- `data/trees.json`
- `data/census.json`
- `data/spots.json`

원본은 빠른 제작에 적합한 구조이고, 재구현본은 데이터/스타일/로직을 분리하는 편이 좋다.
