# HANDOFF

이 문서는 이후 다시 작업할 때 현재까지의 결정과 작업 흐름을 빠르게 복원하기 위한 메모입니다.

## 현재 목표

- 서울 벚꽃 위치 데이터를 지도에 시각화
- 원본 사이트의 인상은 유지하되, 구현은 React/Vite/FSD 구조로 정리
- GitHub Pages에서 정적 배포 가능하게 유지

## 현재 기술 스택

- React + Vite + TypeScript
- Tailwind CSS v4
- Leaflet
- `leaflet.markercluster`
- `leaflet.heat`

## 아키텍처 원칙

- FSD 스타일 유지
- `pages`는 조합만 담당
- `widgets`는 화면 블록
- `features`는 사용자 액션/상태
- `entities`는 도메인 타입/selector/data loader
- `shared`는 공통 유틸/설정

현재 `features`에는 `district-filter`만 존재합니다.

## 현재 파일 구조 핵심

- `src/app/App.tsx`
- `src/pages/home/ui/home-page.tsx`
- `src/widgets/cherry-map/ui/*`
- `src/widgets/cherry-overview/ui/*`
- `src/features/district-filter/*`
- `src/entities/cherry-tree/model/*`
- `src/shared/lib/map/*`

## 데이터 관련

- 실제 데이터 소스는 `public/data/cherry-trees.json`
- 배포 페이지의 `RAW` 배열에서 추출한 데이터
- 현재 사용 필드:
  - `id`
  - `lat`
  - `lng`
  - `district`
  - `roadAddress`
  - `heightM`
  - `diameterCm`

주의:

- 원본 화면 문구의 총 개수와 실제 `RAW` 배열 개수는 다를 수 있다.
- 현재 앱은 실제 추출 JSON을 기준으로 렌더링한다.

## 지도 구현 상태

- OSM 타일 사용
- 타일은 grayscale + brightness 필터 적용
- 히트맵은 원본 팔레트 적용
- 클러스터는 원형 + 숫자 형태
- 개별 마커는 작은 핑크 원 + 흰색 테두리
- 구 필터는 FSD `features/district-filter`로 분리됨
- 사이드바에는 구별 리스트와 막대 그래프가 있음

## 디자인 관련 결정

- 전체 레이아웃은 full-screen 2열
- 왼쪽은 고정 폭 사이드바
- 오른쪽은 지도 전체 영역
- 지도 상단 설명 헤더는 제거
- 사이드바는 원본 톤에 가까운 연핑크 배경

## 마커 관련 히스토리

- 원형 마커 → SVG 꽃잎 마커 시도
- SVG가 큰 아트보드 기반이라 실제 표시가 잘리지 않도록 다듬는 비용이 큼
- 사용성/안정성 문제로 다시 원형 마커로 복귀
- 현재는 단순 원형 마커 유지

다시 SVG 마커를 시도하려면:

- path만 쓰지 말고 개별 shape에 맞는 정확한 viewBox를 먼저 잘라야 함
- 클러스터 마커는 숫자 가독성이 중요해서 원형 유지가 더 적절함

## 배포 관련

- `vite.config.ts`에서 build 시 `base`를 `/cherry/`로 설정
- GitHub Pages는 GitHub Actions로 배포
- 워크플로 파일: `.github/workflows/deploy.yml`

배포 절차:

1. `main`에 push
2. GitHub Actions 실행
3. `dist/`를 Pages에 배포

GitHub 설정 확인:

- `Settings > Pages > Source = GitHub Actions`

## 자주 쓸 명령

```bash
npm run dev
npm run build
git status
git log --oneline --decorate -10
```

## 다음 작업 후보

- 구 필터 버튼과 리스트를 원본과 더 가깝게 다듬기
- 명소 마커 추가
- 통계 보정 마커 추가
- 팝업 스타일 개선
- 모바일 레이아웃 튜닝
- 지도 성능 최적화

## 작업 시 주의

- 마커/클러스터/히트맵 로직은 서로 시각적으로 겹치므로 한 번에 하나씩 수정하고 바로 확인하는 편이 안전함
- 원본 재현보다 구조 개선이 우선일 때는 `widgets`에 화면 조합을 몰아넣지 말고 `entities/features`에 계산 로직을 먼저 이동
- GitHub Pages 경로 문제를 피하려면 asset 경로는 항상 Vite `base`를 고려해야 함
