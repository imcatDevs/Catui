# Utilities

CSS 유틸리티 클래스 — spacing, display, position, sizing, shadow, border-radius, opacity 등을 제공합니다.

> 소스: `src/styles/base/_typography.scss` (유틸리티 섹션)
>
> **이 문서의 핵심**: `.m-*`/`.p-*` spacing, `.d-flex`/`.d-grid` display, `.shadow-*` 그림자,
> `.rounded-*` 테두리, `.text-bg-*` 배경+텍스트. 모두 `!important` 적용.

## Spacing (마진 & 패딩)

`{속성}{방향}-{크기}` 형식. 크기: 0~5.

| 접두사 | 설명 |
| --- | --- |
| `m` | margin |
| `p` | padding |

| 방향 | 설명 |
| --- | --- |
| `t` | top |
| `b` | bottom |
| `s` | start (left) |
| `e` | end (right) |
| `x` | left + right |
| `y` | top + bottom |
| (없음) | 전체 |

| 크기 | 값 |
| --- | --- |
| `0` | 0 |
| `1` | 0.25rem |
| `2` | 0.5rem |
| `3` | 1rem |
| `4` | 1.5rem |
| `5` | 3rem |

```html
<div class="mt-3 mb-2 px-4">spacing 예시</div>
<div class="p-3 mx-auto" style="max-width:400px">가운데 정렬 컨테이너</div>
```

## Display

| 클래스 | 설명 |
| --- | --- |
| `.d-none` | 숨기기 |
| `.d-block` | block |
| `.d-inline` | inline |
| `.d-inline-block` | inline-block |
| `.d-flex` | flex |
| `.d-inline-flex` | inline-flex |
| `.d-grid` | grid |

## Shadow

| 클래스 | 설명 |
| --- | --- |
| `.shadow-none` | 그림자 없음 |
| `.shadow-sm` | 작은 그림자 |
| `.shadow` | 기본 그림자 |
| `.shadow-md` | 중간 그림자 |
| `.shadow-lg` | 큰 그림자 |
| `.shadow-xl` | 더 큰 그림자 |
| `.shadow-2xl` | 최대 그림자 |

## Border Radius

| 클래스 | 설명 |
| --- | --- |
| `.rounded` | 기본 둥근 모서리 |
| `.rounded-0` ~ `.rounded-5` | 크기별 (0=없음, 5=최대) |
| `.rounded-top` | 상단만 |
| `.rounded-end` | 오른쪽만 |
| `.rounded-bottom` | 하단만 |
| `.rounded-start` | 왼쪽만 |
| `.rounded-circle` | 원형 (50%) |
| `.rounded-pill` | 알약형 |

## Position

| 클래스 | 설명 |
| --- | --- |
| `.position-relative` | relative |
| `.position-absolute` | absolute |
| `.position-fixed` | fixed |
| `.position-sticky` | sticky |
| `.top-0`, `.top-50`, `.top-100` | top 위치 |
| `.bottom-0` | bottom: 0 |
| `.start-0`, `.start-50`, `.start-100` | left 위치 |
| `.end-0` | right: 0 |
| `.translate-middle` | transform: translate(-50%, -50%) |
| `.translate-middle-x` | X축만 중앙 |
| `.translate-middle-y` | Y축만 중앙 |

```html
<div class="position-relative" style="height:100px">
  <div class="position-absolute top-50 start-50 translate-middle">중앙</div>
</div>
```

## Sizing

| 클래스 | 설명 |
| --- | --- |
| `.w-25`, `.w-50`, `.w-75`, `.w-100` | width (%) |
| `.w-auto` | width: auto |
| `.h-25`, `.h-50`, `.h-75`, `.h-100` | height (%) |
| `.h-auto` | height: auto |
| `.mw-100` | max-width: 100% |
| `.mh-100` | max-height: 100% |
| `.vw-100` | width: 100vw |
| `.vh-100` | height: 100vh |
| `.min-vh-100` | min-height: 100vh |
| `.min-vw-100` | min-width: 100vw |
| `.min-w-0` | min-width: 0 |
| `.min-h-0` | min-height: 0 |

## Opacity

| 클래스 | 설명 |
| --- | --- |
| `.opacity-100` | 불투명 |
| `.opacity-75` | 75% |
| `.opacity-50` | 50% |
| `.opacity-25` | 25% |

## Background + Text

| 클래스 | 설명 |
| --- | --- |
| `.text-bg-primary` | Primary 배경 + 대비 텍스트 |
| `.text-bg-secondary` | Secondary 배경 |
| `.text-bg-success` | Success 배경 |
| `.text-bg-danger` | Danger 배경 |
| `.text-bg-warning` | Warning 배경 |
| `.text-bg-info` | Info 배경 |
| `.text-bg-light` | Light 배경 |
| `.text-bg-dark` | Dark 배경 |

```html
<span class="text-bg-primary p-2 rounded">Primary</span>
<span class="text-bg-danger p-2 rounded">Danger</span>
```

## Background Opacity

| 클래스 | 설명 |
| --- | --- |
| `.bg-opacity-75` | 배경 75% 투명도 |
| `.bg-opacity-50` | 배경 50% 투명도 |
| `.bg-opacity-25` | 배경 25% 투명도 |
| `.bg-opacity-10` | 배경 10% 투명도 |

```html
<div class="bg-primary bg-opacity-25 p-3 rounded">25% Primary 배경</div>
```

## Overflow

| 클래스 | 설명 |
| --- | --- |
| `.overflow-hidden` | 숨기기 |
| `.overflow-auto` | 자동 스크롤 |
| `.overflow-visible` | 표시 |
| `.overflow-x-auto` | 가로 스크롤 |
| `.overflow-y-auto` | 세로 스크롤 |

## Object Fit

| 클래스 | 설명 |
| --- | --- |
| `.object-fit-contain` | 비율 유지, 맞춤 |
| `.object-fit-cover` | 비율 유지, 채움 |
| `.object-fit-fill` | 늘리기 |
| `.object-fit-none` | 원본 크기 |

## Border 색상

| 클래스 | 설명 |
| --- | --- |
| `.border-primary` | Primary 색 테두리 |
| `.border-success` | Success 색 |
| `.border-danger` | Danger 색 |
| `.border-warning` | Warning 색 |
| `.border-info` | Info 색 |
| `.border-light` | Light 색 |
| `.border-dark` | Dark 색 |
| `.border-white` | White 색 |
| `.border-1` ~ `.border-5` | 테두리 두께 (1px~5px) |

## Container

| 클래스 | 설명 |
| --- | --- |
| `.container` | 반응형 컨테이너 (브레이크포인트별 max-width) |
| `.container-fluid` | 전체 너비 컨테이너 |
| `.container-sm/md/lg/xl` | 특정 브레이크포인트 고정 컨테이너 |

## Flex 확장

| 클래스 | 설명 |
| --- | --- |
| `.flex-shrink-1` | flex-shrink: 1 |
| `.order-0` ~ `.order-5` | 순서 |
| `.order-first` | 가장 앞 (-1) |
| `.order-last` | 가장 뒤 (999) |

## 접근성

| 클래스 | 설명 |
| --- | --- |
| `.visually-hidden`, `.sr-only` | 스크린 리더용 숨김 |
| `.visually-hidden-focusable` | 포커스 시 보임 |

## Cursor

| 클래스 | 설명 |
| --- | --- |
| `.cursor-pointer` | 포인터 |
| `.cursor-default` | 기본 |
| `.cursor-not-allowed` | 금지 |
| `.cursor-grab` | 잡기 |
| `.cursor-text` | 텍스트 |
| `.cursor-move` | 이동 |
| `.cursor-wait` | 대기 |

## Float

| 클래스 | 설명 |
| --- | --- |
| `.float-start` | 좌측 플로트 |
| `.float-end` | 우측 플로트 |
| `.float-none` | 플로트 해제 |
| `.clearfix` | 플로트 클리어 |

## Vertical Align

| 클래스 | 설명 |
| --- | --- |
| `.align-baseline` | baseline |
| `.align-top` | top |
| `.align-middle` | middle |
| `.align-bottom` | bottom |
| `.align-text-top` | text-top |
| `.align-text-bottom` | text-bottom |

## Ratio (종횡비)

| 클래스 | 설명 |
| --- | --- |
| `.ratio` | 종횡비 컨테이너 |
| `.ratio-1x1` | 1:1 (정사각형) |
| `.ratio-4x3` | 4:3 (사진) |
| `.ratio-16x9` | 16:9 (동영상) |
| `.ratio-21x9` | 21:9 (와이드스크린) |

```html
<div class="ratio ratio-16x9">
  <iframe src="https://www.youtube.com/embed/..." allowfullscreen></iframe>
</div>
```

## Transition

| 클래스 | 설명 |
| --- | --- |
| `.transition-all` | 모든 속성 트랜지션 |
| `.transition-none` | 트랜지션 없음 |

## 기타

| 클래스 | 설명 |
| --- | --- |
| `.text-black` | 검정 텍스트 |
| `.stretched-link` | 카드 등에서 전체 클릭 영역 |

## 관련 문서

- [Typography](typography.md) — 텍스트 관련 유틸리티
- [Grid & Layout](grid-layout.md) — Flex/Grid 레이아웃
- [치트시트](../CHEATSHEET.md) — 전체 클래스 한눈에 보기
