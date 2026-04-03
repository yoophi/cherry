# Cherry

서울 벚꽃 위치 데이터를 기반으로 만든 지도 프로젝트입니다.  
React + Vite + TypeScript + Tailwind CSS v4 조합으로 구성되어 있고, 실제 데이터는 `public/data/cherry-trees.json`을 사용합니다. 지도 공급자는 환경변수로 `osm` 또는 `kakao`를 선택할 수 있습니다.

## Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS v4
- Leaflet
- `leaflet.markercluster`
- `leaflet.heat`
- Kakao Maps JavaScript SDK

## Run

```bash
npm install
npm run dev
```

환경변수 설정:

```bash
cp .env.example .env
```

사용 가능한 환경변수:

- `VITE_MAP_PROVIDER=osm | kakao`
- `VITE_KAKAO_MAPS_APP_KEY=...`

기본 개발 서버:

- `http://localhost:5173`

## Build

```bash
npm run build
```

GitHub Pages용 빌드:

```bash
npm run build:pages
```

## Data

실제 위치 데이터:

- `public/data/cherry-trees.json`

데이터 필드:

- `id`
- `lat`
- `lng`
- `district`
- `roadAddress`
- `heightM`
- `diameterCm`

## Project Structure

현재 구조는 FSD 스타일을 따릅니다.

```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

핵심 파일:

- 앱 엔트리: `src/app/App.tsx`
- 홈 페이지: `src/pages/home/ui/home-page.tsx`
- 지도 위젯: `src/widgets/cherry-map/ui/cherry-map.tsx`
- OSM 구현: `src/widgets/cherry-map/providers/osm/ui/osm-cherry-map.tsx`
- Kakao 구현: `src/widgets/cherry-map/providers/kakao/ui/kakao-cherry-map.tsx`
- 사이드바 위젯: `src/widgets/cherry-overview/ui/cherry-overview.tsx`
- 데이터 로더: `src/entities/cherry-tree/model/use-cherry-trees.ts`
- 공급자 설정: `src/shared/config/map-provider.ts`

## GitHub Pages Deployment

이 저장소는 GitHub Actions로 GitHub Pages에 배포되도록 설정되어 있습니다.

배포 URL:

- `https://yoophi.github.io/cherry/`

동작 방식:

1. `main` 브랜치에 push
2. GitHub Actions가 `npm ci` → `npm run build`
3. `dist/`를 GitHub Pages에 배포

필요한 GitHub 설정:

1. GitHub 저장소 `Settings`
2. `Pages`
3. `Source`를 `GitHub Actions`로 설정

워크플로 파일:

- `.github/workflows/deploy.yml`
