# CSS 클래스 레퍼런스

IMCAT UI 프레임워크에 구현된 모든 CSS 클래스 목록입니다.

> 이 문서는 `node scripts/generate-css-docs.js`로 자동 생성됩니다.
> 마지막 생성: 2026-03-26 09:55

## 목차

- [아이콘 (Material Icons)](#아이콘-material-icons)
  - [fonts](#fonts) (20개)
- [베이스 (Base)](#베이스-base)
  - [typography](#typography) (435개)
- [컴포넌트 (Components)](#컴포넌트-components)
  - [alerts](#alerts) (30개)
  - [avatars](#avatars) (18개)
  - [badges](#badges) (36개)
  - [buttons](#buttons) (74개)
  - [cards](#cards) (49개)
  - [inputs](#inputs) (43개)
  - [lists](#lists) (38개)
  - [progress](#progress) (12개)
  - [ribbons](#ribbons) (3개)
  - [tables](#tables) (35개)
- [모듈 (Modules)](#모듈-modules)
  - [advanced-ui](#advanced-ui) (25개)
  - [carousel](#carousel) (32개)
  - [data-viz](#data-viz) (100개)
  - [dropdown](#dropdown) (15개)
  - [feedback](#feedback) (63개)
  - [forms](#forms) (41개)
  - [gantt](#gantt) (42개)
  - [imagelist](#imagelist) (26개)
  - [live-status](#live-status) (68개)
  - [media-viewer](#media-viewer) (57개)
  - [navigation](#navigation) (61개)
  - [overlays](#overlays) (39개)
  - [pagination](#pagination) (15개)
  - [pickers](#pickers) (63개)
  - [scroll](#scroll) (31개)
  - [security-input](#security-input) (24개)
  - [selectors](#selectors) (34개)
  - [social](#social) (63개)
  - [stepper](#stepper) (44개)
  - [text-editors](#text-editors) (25개)
  - [theme](#theme) (20개)
  - [tooltips](#tooltips) (21개)
- [JS 코어 모듈 (Core)](#js-코어-모듈-core)
  - [auto-init](#auto-init) (2개)
  - [loading](#loading) (8개)
  - [shortcuts](#shortcuts) (1개)
- [JS 확장 모듈 (Modules)](#js-확장-모듈-modules)
  - [advanced-ui](#advanced-ui) (26개)
  - [carousel](#carousel) (41개)
  - [data-viz](#data-viz) (113개)
  - [dropdown](#dropdown) (11개)
  - [feedback](#feedback) (32개)
  - [forms](#forms) (42개)
  - [gantt](#gantt) (35개)
  - [imagelist](#imagelist) (36개)
  - [live-status](#live-status) (15개)
  - [media-viewer](#media-viewer) (61개)
  - [navigation](#navigation) (35개)
  - [overlays](#overlays) (3개)
  - [pagination](#pagination) (19개)
  - [pickers](#pickers) (44개)
  - [scroll](#scroll) (17개)
  - [security-input](#security-input) (25개)
  - [selectors](#selectors) (28개)
  - [social](#social) (78개)
  - [stepper](#stepper) (36개)
  - [text-editors](#text-editors) (29개)
  - [theme](#theme) (3개)
  - [tooltips](#tooltips) (20개)

---

## 아이콘 (Material Icons)

내장 Material Icons 폰트 클래스 — `imcat-ui.css`에 포함, 별도 CDN 불필요

### fonts

IMCAT UI - Font Definitions

> 소스: `src/styles/abstracts/_fonts.scss` | 클래스: **20개**

#### Material Icons (Filled)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons` | 블록 | — |

#### Material Icons Outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### Material Icons 크기 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.mi-xs` | 블록 | — |
| `.mi-sm` | 블록 | — |
| `.mi-md` | 블록 | — |
| `.mi-lg` | 블록 | — |
| `.mi-xl` | 블록 | — |
| `.mi-2xl` | 블록 | — |

#### Material Icons 색상 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.mi-primary` | 블록 | — |
| `.mi-secondary` | 블록 | — |
| `.mi-success` | 블록 | — |
| `.mi-danger` | 블록 | — |
| `.mi-warning` | 블록 | — |
| `.mi-info` | 블록 | — |
| `.mi-light` | 블록 | — |
| `.mi-dark` | 블록 | — |
| `.mi-muted` | 블록 | — |

#### Material Icons 애니메이션

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.mi-spin` | 블록 | — |
| `.mi-pulse` | 블록 | — |

#### Icon Button 스타일

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.mi-btn` | 블록 | — |

## 베이스 (Base)

리셋, 타이포그래피, 유틸리티 클래스

### typography

IMCAT UI - Typography

> 소스: `src/styles/base/_typography.scss` | 클래스: **435개**

#### Display 헤딩 (큰 제목용)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.display-1` | 블록 | — |
| `.display-2` | 블록 | — |
| `.display-3` | 블록 | — |
| `.display-4` | 블록 | — |
| `.display-5` | 블록 | — |
| `.display-6` | 블록 | — |

#### 제목 스타일 (H1-H6)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.h1` | 블록 | — |
| `.h2` | 블록 | — |
| `.h3` | 블록 | — |
| `.h4` | 블록 | — |
| `.h5` | 블록 | — |
| `.h6` | 블록 | — |

#### 본문 텍스트

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.body1` | 블록 | Body 변형 |
| `.body2` | 블록 | — |
| `.caption` | 블록 | 캡션 (작은 텍스트) |
| `.overline` | 블록 | 오버라인 (대문자 소형 텍스트) |
| `.lead` | 블록 | 리드 (큰 도입 문단) |

#### 유틸리티 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-left` | 블록 | 텍스트 정렬 |
| `.text-center` | 블록 | — |
| `.text-right` | 블록 | — |
| `.text-justify` | 블록 | — |
| `.text-lowercase` | 블록 | 텍스트 변환 |
| `.text-uppercase` | 블록 | — |
| `.text-capitalize` | 블록 | — |
| `.font-light` | 블록 | 폰트 굵기 |
| `.font-regular` | 블록 | — |
| `.font-medium` | 블록 | — |
| `.font-semibold` | 블록 | — |
| `.font-bold` | 블록 | — |
| `.font-italic` | 블록 | 폰트 스타일 |
| `.font-normal` | 블록 | — |
| `.text-dark` | 블록 | 텍스트 색상 |
| `.text-primary` | 블록 | — |
| `.text-secondary` | 블록 | — |
| `.text-muted` | 블록 | — |
| `.text-disabled` | 블록 | — |
| `.text-success` | 블록 | — |
| `.text-danger` | 블록 | — |
| `.text-warning` | 블록 | — |
| `.text-info` | 블록 | — |
| `.text-ellipsis` | 블록 | 텍스트 말줄임 |
| `.text-ellipsis-2` | 블록 | — |
| `.text-ellipsis-3` | 블록 | — |
| `.line-height-tight` | 블록 | 줄 높이 |
| `.line-height-normal` | 블록 | — |
| `.line-height-relaxed` | 블록 | — |
| `.letter-spacing-tight` | 블록 | 글자 간격 |
| `.letter-spacing-normal` | 블록 | — |
| `.letter-spacing-wide` | 블록 | — |
| `.word-break` | 블록 | 단어 줄바꿈 |
| `.word-break-all` | 블록 | — |
| `.whitespace-normal` | 블록 | 공백 처리 |
| `.whitespace-nowrap` | 블록 | — |
| `.whitespace-pre` | 블록 | — |
| `.whitespace-pre-wrap` | 블록 | — |
| `.text-underline` | 블록 | 텍스트 장식 |
| `.text-line-through` | 블록 | — |
| `.text-no-underline` | 블록 | — |

#### Display 유틸리티 (Bootstrap 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.d-none` | 블록 | — |
| `.d-block` | 블록 | — |
| `.d-inline` | 블록 | — |
| `.d-inline-block` | 블록 | — |
| `.d-flex` | 블록 | — |
| `.d-inline-flex` | 블록 | — |
| `.d-grid` | 블록 | — |
| `.flex-row` | 블록 | Flex 유틸리티 |
| `.flex-column` | 블록 | — |
| `.flex-wrap` | 블록 | — |
| `.flex-nowrap` | 블록 | — |
| `.flex-fill` | 블록 | — |
| `.flex-grow-0` | 블록 | — |
| `.flex-grow-1` | 블록 | — |
| `.flex-shrink-0` | 블록 | — |
| `.justify-content-start` | 블록 | — |
| `.justify-content-end` | 블록 | — |
| `.justify-content-center` | 블록 | — |
| `.justify-content-between` | 블록 | — |
| `.justify-content-around` | 블록 | — |
| `.align-items-start` | 블록 | — |
| `.align-items-end` | 블록 | — |
| `.align-items-center` | 블록 | — |
| `.align-items-stretch` | 블록 | — |
| `.align-items-baseline` | 블록 | — |
| `.align-self-start` | 블록 | — |
| `.align-self-end` | 블록 | — |
| `.align-self-center` | 블록 | — |
| `.gap-0` | 블록 | — |
| `.gap-1` | 블록 | — |
| `.gap-2` | 블록 | — |
| `.gap-3` | 블록 | — |
| `.gap-4` | 블록 | — |
| `.gap-5` | 블록 | — |

#### Overflow 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.overflow-auto` | 블록 | — |
| `.overflow-hidden` | 블록 | — |
| `.overflow-visible` | 블록 | — |
| `.overflow-scroll` | 블록 | — |
| `.overflow-x-auto` | 블록 | — |
| `.overflow-y-auto` | 블록 | — |

#### Position 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.position-static` | 블록 | — |
| `.position-relative` | 블록 | — |
| `.position-absolute` | 블록 | — |
| `.position-fixed` | 블록 | — |
| `.position-sticky` | 블록 | — |

#### Visibility 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.visible` | 블록 | — |
| `.invisible` | 블록 | — |

#### Width / Height 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.w-25` | 블록 | — |
| `.w-50` | 블록 | — |
| `.w-75` | 블록 | — |
| `.w-100` | 블록 | — |
| `.w-auto` | 블록 | — |
| `.h-100` | 블록 | — |
| `.h-auto` | 블록 | — |
| `.mw-100` | 블록 | — |
| `.mh-100` | 블록 | — |

#### 간격 유틸리티 (p-*, m-*)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.m-0` | 블록 | — |
| `.m-1` | 블록 | — |
| `.m-2` | 블록 | — |
| `.m-3` | 블록 | — |
| `.m-4` | 블록 | — |
| `.m-5` | 블록 | — |
| `.m-auto` | 블록 | — |
| `.mx-0` | 블록 | — |
| `.mx-1` | 블록 | — |
| `.mx-2` | 블록 | — |
| `.mx-3` | 블록 | — |
| `.mx-4` | 블록 | — |
| `.mx-5` | 블록 | — |
| `.mx-auto` | 블록 | — |
| `.my-0` | 블록 | — |
| `.my-1` | 블록 | — |
| `.my-2` | 블록 | — |
| `.my-3` | 블록 | — |
| `.my-4` | 블록 | — |
| `.my-5` | 블록 | — |
| `.mt-0` | 블록 | — |
| `.mt-1` | 블록 | — |
| `.mt-2` | 블록 | — |
| `.mt-3` | 블록 | — |
| `.mt-4` | 블록 | — |
| `.mt-5` | 블록 | — |
| `.mb-0` | 블록 | — |
| `.mb-1` | 블록 | — |
| `.mb-2` | 블록 | — |
| `.mb-3` | 블록 | — |
| `.mb-4` | 블록 | — |
| `.mb-5` | 블록 | — |
| `.ms-0` | 블록 | — |
| `.ms-1` | 블록 | — |
| `.ms-2` | 블록 | — |
| `.ms-3` | 블록 | — |
| `.ms-4` | 블록 | — |
| `.ms-5` | 블록 | — |
| `.ms-auto` | 블록 | — |
| `.me-0` | 블록 | — |
| `.me-1` | 블록 | — |
| `.me-2` | 블록 | — |
| `.me-3` | 블록 | — |
| `.me-4` | 블록 | — |
| `.me-5` | 블록 | — |
| `.me-auto` | 블록 | — |
| `.p-0` | 블록 | — |
| `.p-1` | 블록 | — |
| `.p-2` | 블록 | — |
| `.p-3` | 블록 | — |
| `.p-4` | 블록 | — |
| `.p-5` | 블록 | — |
| `.px-0` | 블록 | — |
| `.px-1` | 블록 | — |
| `.px-2` | 블록 | — |
| `.px-3` | 블록 | — |
| `.px-4` | 블록 | — |
| `.px-5` | 블록 | — |
| `.py-0` | 블록 | — |
| `.py-1` | 블록 | — |
| `.py-2` | 블록 | — |
| `.py-3` | 블록 | — |
| `.py-4` | 블록 | — |
| `.py-5` | 블록 | — |
| `.pt-0` | 블록 | 방향별 패딩 (pt, pb, ps, pe) |
| `.pt-1` | 블록 | — |
| `.pt-2` | 블록 | — |
| `.pt-3` | 블록 | — |
| `.pt-4` | 블록 | — |
| `.pt-5` | 블록 | — |
| `.pb-0` | 블록 | — |
| `.pb-1` | 블록 | — |
| `.pb-2` | 블록 | — |
| `.pb-3` | 블록 | — |
| `.pb-4` | 블록 | — |
| `.pb-5` | 블록 | — |
| `.ps-0` | 블록 | — |
| `.ps-1` | 블록 | — |
| `.ps-2` | 블록 | — |
| `.ps-3` | 블록 | — |
| `.ps-4` | 블록 | — |
| `.ps-5` | 블록 | — |
| `.pe-0` | 블록 | — |
| `.pe-1` | 블록 | — |
| `.pe-2` | 블록 | — |
| `.pe-3` | 블록 | — |
| `.pe-4` | 블록 | — |
| `.pe-5` | 블록 | — |

#### Border 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.border` | 블록 | — |
| `.border-0` | 블록 | — |
| `.border-top` | 블록 | — |
| `.border-bottom` | 블록 | — |
| `.rounded` | 블록 | — |
| `.rounded-0` | 블록 | — |
| `.rounded-circle` | 블록 | — |
| `.rounded-pill` | 블록 | — |

#### Shadow 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.shadow-none` | 블록 | — |
| `.shadow-sm` | 블록 | — |
| `.shadow` | 블록 | — |
| `.shadow-lg` | 블록 | — |

#### 배경색 유틸리티 (Bootstrap/Ubold 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.bg-primary` | 블록 | — |
| `.bg-success` | 블록 | — |
| `.bg-info` | 블록 | — |
| `.bg-warning` | 블록 | — |
| `.bg-danger` | 블록 | — |
| `.bg-secondary` | 블록 | — |
| `.bg-dark` | 블록 | — |
| `.bg-light` | 블록 | — |
| `.bg-white` | 블록 | — |
| `.bg-transparent` | 블록 | — |

#### Color & Background (text-bg-* Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-bg-primary` | 블록 | — |
| `.text-bg-secondary` | 블록 | — |
| `.text-bg-success` | 블록 | — |
| `.text-bg-danger` | 블록 | — |
| `.text-bg-warning` | 블록 | — |
| `.text-bg-info` | 블록 | — |
| `.text-bg-light` | 블록 | — |
| `.text-bg-dark` | 블록 | — |

#### Background Opacity (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.bg-opacity-75` | 블록 | — |
| `.bg-opacity-50` | 블록 | — |
| `.bg-opacity-25` | 블록 | — |
| `.bg-opacity-10` | 블록 | — |

#### Text Opacity (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-opacity-75` | 블록 | — |
| `.text-opacity-50` | 블록 | — |
| `.text-opacity-25` | 블록 | — |

#### Opacity 유틸리티 (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.opacity-100` | 블록 | — |
| `.opacity-75` | 블록 | — |
| `.opacity-50` | 블록 | — |
| `.opacity-25` | 블록 | — |
| `.opacity-0` | 블록 | — |

#### 추가 텍스트 색상 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-white` | 블록 | — |
| `.text-light` | 블록 | — |
| `.text-body` | 블록 | — |

#### Bootstrap 호환 별칭 — 폰트 굵기

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.fw-light` | 블록 | — |
| `.fw-normal` | 블록 | — |
| `.fw-medium` | 블록 | — |
| `.fw-semibold` | 블록 | — |
| `.fw-bold` | 블록 | — |
| `.fst-italic` | 블록 | — |
| `.fst-normal` | 블록 | — |

#### Bootstrap 호환 별칭 — 폰트 크기

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.fs-1` | 블록 | — |
| `.fs-2` | 블록 | — |
| `.fs-3` | 블록 | — |
| `.fs-4` | 블록 | — |
| `.fs-5` | 블록 | — |
| `.fs-6` | 블록 | — |
| `.fs-sm` | 블록 | — |
| `.fs-xs` | 블록 | — |
| `.fs-lg` | 블록 | — |
| `.fs-xl` | 블록 | — |
| `.fs-xxl` | 블록 | — |

#### Bootstrap 호환 별칭 — 줄 높이

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lh-1` | 블록 | — |
| `.lh-sm` | 블록 | — |
| `.lh-base` | 블록 | — |
| `.lh-lg` | 블록 | — |

#### Bootstrap 호환 별칭 — 텍스트

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-start` | 블록 | — |
| `.text-end` | 블록 | — |
| `.text-truncate` | 블록 | — |
| `.text-wrap` | 블록 | — |
| `.text-nowrap` | 블록 | — |
| `.text-break` | 블록 | — |
| `.text-decoration-none` | 블록 | — |
| `.text-decoration-underline` | 블록 | — |
| `.text-decoration-line-through` | 블록 | — |

#### Border 추가 (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.border-start` | 블록 | — |
| `.border-end` | 블록 | — |
| `.border-dashed` | 블록 | — |
| `.rounded-top` | 블록 | Border Radius 방향별 (Ubold 참조) |
| `.rounded-end` | 블록 | — |
| `.rounded-bottom` | 블록 | — |
| `.rounded-start` | 블록 | — |
| `.rounded-1` | 블록 | Border Radius 크기별 (Ubold 참조) |
| `.rounded-2` | 블록 | — |
| `.rounded-3` | 블록 | — |
| `.rounded-4` | 블록 | — |
| `.rounded-5` | 블록 | — |

#### Pointer Events (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pe-none` | 블록 | — |
| `.pe-auto` | 블록 | — |

#### User Select (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.user-select-all` | 블록 | — |
| `.user-select-auto` | 블록 | — |
| `.user-select-none` | 블록 | — |

#### Position 엣지 (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.top-0` | 블록 | — |
| `.top-50` | 블록 | — |
| `.top-100` | 블록 | — |
| `.bottom-0` | 블록 | — |
| `.bottom-50` | 블록 | — |
| `.bottom-100` | 블록 | — |
| `.start-0` | 블록 | — |
| `.start-50` | 블록 | — |
| `.start-100` | 블록 | — |
| `.end-0` | 블록 | — |
| `.end-50` | 블록 | — |
| `.end-100` | 블록 | — |
| `.translate-middle` | 블록 | Translate 유틸리티 (Ubold 참조) |
| `.translate-middle-x` | 블록 | — |
| `.translate-middle-y` | 블록 | — |

#### Height 추가 (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.h-25` | 블록 | — |
| `.h-50` | 블록 | — |
| `.h-75` | 블록 | — |

#### Object Fit (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.object-fit-contain` | 블록 | — |
| `.object-fit-cover` | 블록 | — |
| `.object-fit-fill` | 블록 | — |
| `.object-fit-scale` | 블록 | — |
| `.object-fit-none` | 블록 | — |

#### Z-index (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.z-n1` | 블록 | — |
| `.z-0` | 블록 | — |
| `.z-1` | 블록 | — |
| `.z-2` | 블록 | — |
| `.z-3` | 블록 | — |

#### Flex 추가 (Ubold 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.flex-row-reverse` | 블록 | — |
| `.flex-column-reverse` | 블록 | — |
| `.justify-content-evenly` | 블록 | — |
| `.align-self-stretch` | 블록 | — |

#### 범용 닫기 버튼 (Bootstrap/Ubold 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn-close` | 블록 | — |

#### CSS Grid 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.grid` | 블록 | — |
| `.grid-cols-1` | 블록 | — |
| `.grid-cols-2` | 블록 | — |
| `.grid-cols-3` | 블록 | — |
| `.grid-cols-4` | 블록 | — |
| `.grid-cols-5` | 블록 | — |
| `.grid-cols-6` | 블록 | — |
| `.grid-cols-7` | 블록 | — |
| `.grid-cols-8` | 블록 | — |
| `.grid-cols-9` | 블록 | — |
| `.grid-cols-10` | 블록 | — |
| `.grid-cols-11` | 블록 | — |
| `.grid-cols-12` | 블록 | — |
| `.col-span-1` | 블록 | — |
| `.col-span-2` | 블록 | — |
| `.col-span-3` | 블록 | — |
| `.col-span-4` | 블록 | — |
| `.col-span-5` | 블록 | — |
| `.col-span-6` | 블록 | — |
| `.col-span-7` | 블록 | — |
| `.col-span-8` | 블록 | — |
| `.col-span-9` | 블록 | — |
| `.col-span-10` | 블록 | — |
| `.col-span-11` | 블록 | — |
| `.col-span-12` | 블록 | — |
| `.col-span-full` | 블록 | — |
| `.grid-rows-1` | 블록 | Grid Row 유틸리티 |
| `.grid-rows-2` | 블록 | — |
| `.grid-rows-3` | 블록 | — |
| `.grid-rows-4` | 블록 | — |
| `.grid-rows-5` | 블록 | — |
| `.grid-rows-6` | 블록 | — |
| `.row-span-1` | 블록 | — |
| `.row-span-2` | 블록 | — |
| `.row-span-3` | 블록 | — |
| `.row-span-4` | 블록 | — |
| `.row-span-5` | 블록 | — |
| `.row-span-6` | 블록 | — |
| `.row-span-full` | 블록 | — |

#### Border 색상 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.border-primary` | 블록 | — |
| `.border-success` | 블록 | — |
| `.border-info` | 블록 | — |
| `.border-warning` | 블록 | — |
| `.border-danger` | 블록 | — |
| `.border-secondary` | 블록 | — |
| `.border-light` | 블록 | — |
| `.border-dark` | 블록 | — |
| `.border-white` | 블록 | — |
| `.border-1` | 블록 | Border 두께 |
| `.border-2` | 블록 | — |
| `.border-3` | 블록 | — |
| `.border-4` | 블록 | — |
| `.border-5` | 블록 | — |

#### Shadow 확장 (변수 활용)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.shadow-md` | 블록 | — |
| `.shadow-xl` | 블록 | — |
| `.shadow-2xl` | 블록 | — |

#### Container (반응형 레이아웃)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.container` | 블록 | — |
| `.container-fluid` | 블록 | — |
| `.container-sm` | 블록 | — |
| `.container-md` | 블록 | — |
| `.container-lg` | 블록 | — |
| `.container-xl` | 블록 | — |

#### Viewport 크기 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.vw-100` | 블록 | — |
| `.vh-100` | 블록 | — |
| `.min-vw-100` | 블록 | — |
| `.min-vh-100` | 블록 | — |
| `.min-w-0` | 블록 | — |
| `.min-h-0` | 블록 | — |

#### Flex 확장

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.flex-shrink-1` | 블록 | — |
| `.order-0` | 블록 | — |
| `.order-1` | 블록 | — |
| `.order-2` | 블록 | — |
| `.order-3` | 블록 | — |
| `.order-4` | 블록 | — |
| `.order-5` | 블록 | — |
| `.order-first` | 블록 | — |
| `.order-last` | 블록 | — |

#### 접근성 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.visually-hidden` | 블록 | — |
| `.sr-only` | 블록 | — |
| `.visually-hidden-focusable` | 블록 | — |

#### Cursor 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.cursor-auto` | 블록 | — |
| `.cursor-default` | 블록 | — |
| `.cursor-pointer` | 블록 | — |
| `.cursor-wait` | 블록 | — |
| `.cursor-text` | 블록 | — |
| `.cursor-move` | 블록 | — |
| `.cursor-not-allowed` | 블록 | — |
| `.cursor-grab` | 블록 | — |
| `.cursor-grabbing` | 블록 | — |

#### Float 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.float-start` | 블록 | — |
| `.float-end` | 블록 | — |
| `.float-none` | 블록 | — |
| `.clearfix` | 블록 | — |

#### Vertical Align 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.align-baseline` | 블록 | — |
| `.align-top` | 블록 | — |
| `.align-middle` | 블록 | — |
| `.align-bottom` | 블록 | — |
| `.align-text-top` | 블록 | — |
| `.align-text-bottom` | 블록 | — |

#### Ratio (종횡비) 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.ratio` | 블록 | — |
| `.ratio-1x1` | 블록 | — |
| `.ratio-4x3` | 블록 | — |
| `.ratio-16x9` | 블록 | — |
| `.ratio-21x9` | 블록 | — |

#### Transition 유틸리티

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.transition-all` | 블록 | — |
| `.transition-none` | 블록 | — |

#### 추가 텍스트 색상

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.text-black` | 블록 | — |

## 컴포넌트 (Components)

코어 UI 컴포넌트 — `imcat-ui.css`에 포함

### alerts

Alerts Component SCSS

> 소스: `src/styles/components/_alerts.scss` | 클래스: **30개**

#### Base Alert

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert` | 블록 | — |
| `.alert__icon` | 요소 | — |
| `.alert__content` | 요소 | — |
| `.alert__title` | 요소 | — |
| `.alert__message` | 요소 | — |
| `.alert__close` | 요소 | — |

#### Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert--info` | 블록 | Info (default) |
| `.alert--success` | 블록 | Success |
| `.alert--warning` | 블록 | Warning |
| `.alert--danger` | 블록 | Danger / Error |
| `.alert--error` | 블록 | — |

#### Filled Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert--filled` | 블록 | — |

#### Outlined Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert--outlined` | 블록 | — |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert--sm` | 블록 | — |
| `.alert--lg` | 블록 | — |

#### With Actions

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert__actions` | 블록 | — |

#### Dismissible (animation)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert--dismissible` | 블록 | — |

#### Alert List (stacked alerts)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert-list` | 블록 | — |

#### Bootstrap 호환 alert 클래스 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert-primary` | 블록 | — |
| `.alert-secondary` | 블록 | — |
| `.alert-success` | 블록 | — |
| `.alert-danger` | 블록 | — |
| `.alert-warning` | 블록 | — |
| `.alert-info` | 블록 | — |
| `.alert-light` | 블록 | — |
| `.alert-dark` | 블록 | — |
| `.alert-link` | 블록 | alert-link (ubold 스타일) |

#### Bootstrap 추가 콘텐츠 패턴 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.alert-heading` | 블록 | — |
| `.alert` | 블록 | — |
| `.alert-dismissible` | 블록 | alert-dismissible (Bootstrap 호환) |

### avatars

Avatars (코어 컴포넌트)

> 소스: `src/styles/components/_avatars.scss` | 클래스: **18개**

#### Avatars (코어 컴포넌트)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.avatar-xs` | 블록 | 아바타 크기 (토큰 기반) |
| `.avatar-sm` | 블록 | — |
| `.avatar-md` | 블록 | — |
| `.avatar-lg` | 블록 | — |
| `.avatar-xl` | 블록 | — |
| `.avatar-2xl` | 블록 | — |
| `.avatar-title` | 블록 | 아바타 이니셜 (배경색 + 텍스트) |
| `.avatar-group` | 블록 | 아바타 그룹 (겹치기, 토큰 기반) |
| `.avatar-status` | 블록 | 아바타 온라인 상태 인디케이터 |
| `.avatar-status__indicator` | 요소 | — |
| `.img-fluid` | 블록 | 이미지 유틸리티 |
| `.img-thumbnail` | 블록 | — |
| `.flag-xs` | 블록 | NOTE: .rounded, .rounded-circle은 base/_typography.scss 유틸리티에서 정의 중복 정의하지 않음 플래그 아이콘 유틸리티 |
| `.flag-sm` | 블록 | — |
| `.flag-md` | 블록 | — |
| `.flag-lg` | 블록 | — |
| `.flag-xl` | 블록 | — |
| `.flag-badge` | 블록 | 플래그 배지 (아바타 우하단 국기 표시) |

### badges

Badges Component SCSS

> 소스: `src/styles/components/_badges.scss` | 클래스: **36개**

#### Base Badge

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge` | 블록 | — |

#### Variants (Filled - default)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge` | 블록 | Default (neutral) |
| `.badge--primary` | 블록 | Primary |
| `.badge--secondary` | 블록 | Secondary |
| `.badge--success` | 블록 | Success |
| `.badge--warning` | 블록 | Warning |
| `.badge--danger` | 블록 | Danger |
| `.badge--info` | 블록 | Info |

#### Soft Variants (light background)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge--soft` | 블록 | — |

#### Outlined Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge--outlined` | 블록 | — |

#### Shapes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge--pill` | 블록 | Pill (rounded) |
| `.badge--dot` | 블록 | Dot (indicator) |
| `.badge--circle` | 블록 | Circle (with number) |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge--sm` | 블록 | Small |
| `.badge--lg` | 블록 | Large |

#### With Remove Button

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge--removable` | 블록 | — |

#### Status Indicator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.status` | 블록 | — |
| `.status__dot` | 요소 | — |

#### Badge Group

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge-group` | 블록 | — |

#### Tag (alias with different style)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.tag` | 블록 | — |

#### Notification Badge (floating)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge-wrapper` | 블록 | — |
| `.badge-float` | 블록 | — |

#### Bootstrap 호환 배지 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.badge-soft-primary` | 블록 | bg-* 배지 (Contextual) Soft 배지 (badge-soft-*) |
| `.badge-soft-secondary` | 블록 | — |
| `.badge-soft-success` | 블록 | — |
| `.badge-soft-danger` | 블록 | — |
| `.badge-soft-warning` | 블록 | — |
| `.badge-soft-info` | 블록 | — |
| `.badge-soft-dark` | 블록 | — |
| `.badge-outline-primary` | 블록 | Outline 배지 (badge-outline-*) |
| `.badge-outline-secondary` | 블록 | — |
| `.badge-outline-success` | 블록 | — |
| `.badge-outline-danger` | 블록 | — |
| `.badge-outline-warning` | 블록 | — |
| `.badge-outline-info` | 블록 | — |
| `.badge-outline-dark` | 블록 | — |

### buttons

Buttons Component SCSS

> 소스: `src/styles/components/_buttons.scss` | 클래스: **74개**

#### Base Button

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn` | 블록 | — |
| `.is-disabled` | 상태 | — |

#### Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--primary` | 블록 | Primary |
| `.btn--secondary` | 블록 | Secondary |
| `.btn--outline` | 블록 | Outline |
| `.btn--outline-secondary` | 블록 | Outline Secondary |
| `.btn--ghost` | 블록 | Ghost (text only) |
| `.btn--link` | 블록 | Link |

#### Semantic Colors

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--success` | 블록 | Success |
| `.btn--danger` | 블록 | Danger |
| `.btn--warning` | 블록 | Warning |
| `.btn--info` | 블록 | Info |

#### Dark & Light

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--dark` | 블록 | — |
| `.btn--light` | 블록 | — |

#### Outline 색상 변형 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--outline-success` | 블록 | — |
| `.btn--outline-danger` | 블록 | — |
| `.btn--outline-warning` | 블록 | — |
| `.btn--outline-info` | 블록 | — |
| `.btn--outline-dark` | 블록 | — |

#### Soft 변형 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--soft-primary` | 블록 | — |
| `.btn--soft-success` | 블록 | — |
| `.btn--soft-danger` | 블록 | — |
| `.btn--soft-warning` | 블록 | — |
| `.btn--soft-info` | 블록 | — |
| `.btn--soft-dark` | 블록 | — |
| `.btn--soft-secondary` | 블록 | — |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--xs` | 블록 | Extra Small |
| `.btn--sm` | 블록 | Small |
| `.btn--lg` | 블록 | Large |

#### Shapes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--rounded` | 블록 | Rounded (pill) |
| `.btn--square` | 블록 | Square (no radius) |
| `.btn--icon` | 블록 | Icon only |

#### States

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--loading` | 블록 | Loading |

#### Full Width

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn--block` | 블록 | — |

#### Button Width (고정 최소 너비, ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.width-xs` | 블록 | — |
| `.width-sm` | 블록 | — |
| `.width-md` | 블록 | — |
| `.width-lg` | 블록 | — |
| `.width-xl` | 블록 | — |

#### Button Label (아이콘 라벨, ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn-label` | 블록 | — |
| `.btn-label-right` | 블록 | — |
| `.btn--rounded` | 블록 | Rounded 버튼에서 라벨 border-radius 보정 |

#### Bootstrap 호환 Alias (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn-primary` | 블록 | btn-primary, btn-outline-primary, btn-soft-primary 등 Default (Solid) — Bootstrap 단일 대시 |
| `.btn-success` | 블록 | — |
| `.btn-danger` | 블록 | — |
| `.btn-warning` | 블록 | — |
| `.btn-info` | 블록 | — |
| `.btn-dark` | 블록 | — |
| `.btn-light` | 블록 | — |
| `.btn-secondary` | 블록 | — |
| `.btn-link` | 블록 | — |
| `.btn-white` | 블록 | — |
| `.btn-outline-primary` | 블록 | Outline — Bootstrap 단일 대시 |
| `.btn-outline-success` | 블록 | — |
| `.btn-outline-danger` | 블록 | — |
| `.btn-outline-warning` | 블록 | — |
| `.btn-outline-info` | 블록 | — |
| `.btn-outline-dark` | 블록 | — |
| `.btn-outline-secondary` | 블록 | — |
| `.btn-outline-light` | 블록 | — |
| `.btn-soft-primary` | 블록 | Soft — Bootstrap 단일 대시 |
| `.btn-soft-success` | 블록 | — |
| `.btn-soft-danger` | 블록 | — |
| `.btn-soft-warning` | 블록 | — |
| `.btn-soft-info` | 블록 | — |
| `.btn-soft-dark` | 블록 | — |
| `.btn-soft-secondary` | 블록 | — |
| `.btn-lg` | 블록 | Sizes — Bootstrap 단일 대시 |
| `.btn-sm` | 블록 | — |
| `.btn-xs` | 블록 | — |
| `.button-list` | 블록 | .button-list (버튼 나열 레이아웃, ubold 스타일) |

#### Button Group

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn-group` | 블록 | — |
| `.btn-group--vertical` | 변형 | — |
| `.btn-group--attached` | 변형 | — |

### cards

Cards Component SCSS

> 소스: `src/styles/components/_cards.scss` | 클래스: **49개**

#### Base Card

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card` | 블록 | — |

#### BEM Card Parts (card__*)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card__header` | 블록 | Header |
| `.card__header--transparent` | 변형 | — |
| `.card__header--no-border` | 변형 | — |
| `.card__title` | 블록 | — |
| `.card__subtitle` | 블록 | — |
| `.card__actions` | 블록 | — |
| `.card__body` | 블록 | Body |
| `.card__footer` | 블록 | Footer |
| `.card__footer--transparent` | 변형 | — |
| `.card__footer--no-border` | 변형 | — |
| `.card__footer--between` | 변형 | — |
| `.card__footer--start` | 변형 | — |
| `.card__image` | 블록 | Image |
| `.card__image--square` | 변형 | — |
| `.card__image--portrait` | 변형 | — |
| `.card__image__overlay` | 요소 | — |

#### BEM Variants (card--*)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card--elevated` | 블록 | Elevated (with shadow, no border) |
| `.card--flat` | 블록 | Flat (no border, no shadow, transparent) |
| `.card--outlined` | 블록 | Outlined (just border) |
| `.card--filled` | 블록 | Filled (no border, subtle bg) |

#### BEM Sizes (card--sm, card--lg)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card--sm` | 블록 | — |
| `.card--lg` | 블록 | — |

#### BEM Horizontal Card

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card--horizontal` | 블록 | — |

#### Card Grid & Card List (레이아웃)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-grid` | 블록 | — |
| `.card-list` | 블록 | — |

#### Bootstrap 호환 클래스 (Ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-body` | 블록 | card-body |
| `.card-header` | 블록 | card-header |
| `.card-footer` | 블록 | card-footer |
| `.card-title` | 블록 | card-title / card-subtitle / card-text / card-link |
| `.card-subtitle` | 블록 | — |
| `.card-text` | 블록 | — |
| `.card-link` | 블록 | — |

#### Card Action Tools (Ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-action` | 블록 | — |
| `.card-action-item` | 블록 | — |

#### Card Images (Ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-img-top` | 블록 | — |
| `.card-img-bottom` | 블록 | — |
| `.card-img` | 블록 | — |
| `.card-img-overlay` | 블록 | — |

#### Background Color Cards (text-bg-* 패턴)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card` | 블록 | bg-* (기존 유틸리티) border 동기화 |

#### Border Color Cards (Ubold border-* 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card` | 블록 | — |

#### Card Bordered (좌측 액센트 보더, Ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-bordered` | 블록 | — |

#### Card Filled (Ubold 스타일, 연한 배경)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-filled` | 블록 | — |

#### Card Inverse (어두운 배경 위 밝은 텍스트)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-inverse` | 블록 | — |

#### Horizontal Card (Ubold row g-0 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-horizontal` | 블록 | — |

#### Code Body (Ubold 카드 내 코드 영역)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.code-body` | 블록 | — |

#### Card Header Tabs / Pills (Ubold Nav 통합)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-header-tabs` | 블록 | — |
| `.card-header-pills` | 블록 | — |

#### Card Group (Ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.card-group` | 블록 | — |

### inputs

Form Inputs Component SCSS

> 소스: `src/styles/components/_inputs.scss` | 클래스: **43개**

#### Form Group

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-group` | 블록 | — |

#### Form Label

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-label` | 블록 | — |

#### Base Input

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-input` | 블록 | — |
| `.form-control` | 블록 | — |
| `.is-disabled` | 상태 | — |

#### Select

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-select` | 블록 | — |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-input--sm` | 블록 | Small (BEM alias → Bootstrap 호환으로 통합) |
| `.form-control--sm` | 블록 | — |
| `.form-select--sm` | 블록 | — |
| `.form-input--lg` | 블록 | Large (BEM alias → Bootstrap 호환으로 통합) |
| `.form-control--lg` | 블록 | — |
| `.form-select--lg` | 블록 | — |

#### Validation Icons (입력 필드 내부 ✓/✗ 아이콘)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.has-validation-icon` | 블록 | .has-validation-icon 클래스를 부모에 추가하면 활성화 또는 .form-control-icon-validation 클래스를 input에 직접 추가 |

#### Help Text & Error Message

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-text` | 블록 | — |
| `.help-block` | 블록 | — |
| `.form-control-plaintext` | 블록 | Form Control Plaintext |
| `.form-error` | 블록 | — |
| `.invalid-feedback` | 블록 | — |
| `.form-success` | 블록 | — |
| `.valid-feedback` | 블록 | — |
| `.invalid-tooltip` | 블록 | Tooltip 변형 |
| `.valid-tooltip` | 블록 | — |
| `.was-validated` | 블록 | was-validated 폼 전체 검증 상태 |

#### Checkbox & Radio

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-check` | 블록 | — |
| `.form-check-input` | 블록 | — |
| `.form-check-label` | 블록 | — |
| `.form-check--inline` | 블록 | Inline checks |

#### Switch (form-switch 토글 — ubold/Bootstrap 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-switch` | 블록 | — |

#### Checkbox & Radio 래퍼 (form-checkbox, form-radio)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-checkbox` | 블록 | — |
| `.form-radio` | 블록 | — |

#### Form Helper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-helper` | 블록 | — |

#### Input Sizes (Bootstrap 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-control-sm` | 블록 | — |
| `.form-control-lg` | 블록 | — |

#### Input Group Text (Bootstrap 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.input-group-text` | 블록 | — |

#### Form Range

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-range` | 블록 | — |

#### Input Group

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.input-group` | 블록 | — |
| `.input-group__text` | 블록 | BEM alias → Bootstrap 호환 클래스로 통합 |
| `.input-group__btn` | 블록 | — |

#### Floating Labels (BEM + Bootstrap 표준 통합)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-floating` | 블록 | — |

#### Input Group Merge (비밀번호 표시/숨김, ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.input-group-merge` | 블록 | — |

#### Search Input

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-search` | 블록 | — |
| `.form-search__icon` | 요소 | — |
| `.form-search__clear` | 요소 | — |

### lists

Lists Component SCSS

> 소스: `src/styles/components/_lists.scss` | 클래스: **38개**

#### Base List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list` | 블록 | — |

#### List Item

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list__item` | 블록 | — |
| `.is-active` | 상태 | — |
| `.is-disabled` | 상태 | — |

#### List Item Parts

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list__icon` | 블록 | Icon/Avatar |
| `.list__content` | 블록 | Content |
| `.list__title` | 블록 | — |
| `.list__subtitle` | 블록 | — |
| `.list__meta` | 블록 | Meta (right side) |
| `.list__actions` | 블록 | Actions |

#### Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--bordered` | 블록 | Bordered |
| `.list--divided` | 블록 | Divided (lines between items) |
| `.list--flush` | 블록 | Flush (no padding on sides) |
| `.list--hoverable` | 블록 | Hoverable |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--sm` | 블록 | Small |
| `.list--lg` | 블록 | Large |

#### Inline List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--inline` | 블록 | — |

#### Ordered/Numbered List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--numbered` | 블록 | — |

#### Bullet List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--bullet` | 블록 | — |

#### Check List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list--check` | 블록 | — |

#### Description List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dl` | 블록 | — |
| `.dl--horizontal` | 블록 | Horizontal Description List |

#### List Group (Bootstrap/ubold 호환)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list-group` | 블록 | — |
| `.list-group-item` | 블록 | — |
| `.list-group-item-action` | 블록 | Action items (hover/click) |
| `.list-group-flush` | 블록 | Flush (no outer borders/radius) |
| `.list-group-horizontal` | 블록 | Horizontal |
| `.list-group-item-primary` | 블록 | Contextual colors (ubold 스타일) |
| `.list-group-item-success` | 블록 | — |
| `.list-group-item-danger` | 블록 | — |
| `.list-group-item-warning` | 블록 | — |
| `.list-group-item-info` | 블록 | — |
| `.list-group-item-dark` | 블록 | — |
| `.list-group-item-light` | 블록 | — |
| `.list-group-item-secondary` | 블록 | — |

#### List Group Numbered (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.list-group-numbered` | 블록 | — |
| `.list-group-item` | 블록 | 배지 포함 리스트 (d-flex, justify-content-between 등은 _typography.scss 전역 유틸리티 사용) |
| `.list-group-item` | 블록 | list-group 내 checkbox/radio |

### progress

Progress Bar (코어 컴포넌트)

> 소스: `src/styles/components/_progress.scss` | 클래스: **12개**

#### Progress Bar (코어 컴포넌트)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.progress` | 블록 | — |
| `.progress__bar` | 요소 | — |
| `.progress--xs` | 변형 | — |
| `.progress--sm` | 변형 | — |
| `.progress--lg` | 변형 | — |
| `.progress--xl` | 변형 | — |
| `.progress--xxl` | 변형 | — |
| `.progress--stacked` | 변형 | — |
| `.progress--vertical` | 변형 | — |
| `.progress--vertical-bottom` | 변형 | — |
| `.progress--indeterminate` | 변형 | — |
| `.progress--labeled` | 변형 | — |

### ribbons

Ribbons (코어 컴포넌트)

> 소스: `src/styles/components/_ribbons.scss` | 클래스: **3개**

#### Ribbons (코어 컴포넌트)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.ribbon-box` | 블록 | ubold bootstrap.min.css 원본 기반 리본 박스 컨테이너 |

#### 접힌 리본 (코너 배치) — ribbon-two

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.float-start` | 블록 | 독립 사용 유틸리티 (ribbon-box 밖에서 사용) |
| `.float-end` | 블록 | — |

### tables

Tables Component SCSS

> 소스: `src/styles/components/_tables.scss` | 클래스: **35개**

#### Table Wrapper (for responsive)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table-wrapper` | 블록 | — |

#### Base Table

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table` | 블록 | — |

#### Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table--striped` | 블록 | Striped rows |
| `.table--hover` | 블록 | Hover effect |
| `.table--bordered` | 블록 | Bordered (all borders) |
| `.table--borderless` | 블록 | Borderless |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table--sm` | 블록 | Small |
| `.table--lg` | 블록 | Large |

#### Vertical Alignment (테이블 전용)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.align-top` | 블록 | text-left/center/right는 _typography.scss 전역 유틸리티 사용 |
| `.align-middle` | 블록 | — |
| `.align-bottom` | 블록 | — |

#### Sortable Headers

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table__sortable` | 블록 | — |

#### Selectable Rows

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table--selectable` | 블록 | — |

#### Fixed Header

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table-fixed-header` | 블록 | — |

#### Row States

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table` | 블록 | — |

#### Cell Truncation

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table__truncate` | 블록 | — |

#### Actions Column

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table__actions` | 블록 | — |

#### Empty State

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table__empty` | 블록 | — |

#### Loading State

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table__loading` | 블록 | — |

#### Bootstrap 호환 테이블 클래스 (ubold 스타일)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.table-striped` | 블록 | table-striped |
| `.table-bordered` | 블록 | table-bordered |
| `.table-borderless` | 블록 | table-borderless |
| `.table-hover` | 블록 | table-hover |
| `.table-sm` | 블록 | table-sm (compact) |
| `.table-dark` | 블록 | table-dark |
| `.table-light` | 블록 | table-light (thead) |
| `.table-responsive` | 블록 | table-responsive (overflow wrapper) |
| `.table-active` | 블록 | 행/셀 색상 (Bootstrap 호환 table-* — tr, td, th 모두 적용) |
| `.table-primary` | 블록 | — |
| `.table-secondary` | 블록 | — |
| `.table-success` | 블록 | — |
| `.table-danger` | 블록 | — |
| `.table-warning` | 블록 | — |
| `.table-info` | 블록 | — |
| `.table-striped-columns` | 블록 | table-striped-columns (세로 줄무늬) |

## 모듈 (Modules)

확장 모듈 CSS — `IMCAT.use()` 시 자동 로드 또는 `dist/modules/*.css`

### advanced-ui

Advanced UI Module SCSS

> 소스: `src/styles/modules/_advanced-ui.scss` | 클래스: **25개**

#### SplitPane

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.split-pane` | 블록 | — |
| `.split-pane--vertical` | 변형 | — |
| `.split-pane__panel` | 요소 | — |
| `.split-pane__gutter` | 요소 | — |
| `.is-dragging` | 상태 | — |

#### QR Code

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.qrcode` | 블록 | — |
| `.qrcode__image` | 요소 | — |
| `.qrcode__label` | 요소 | — |
| `.qrcode__download` | 요소 | — |
| `.qrcode--logo` | 변형 | — |

#### CodeBlock

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.code-block` | 블록 | — |
| `.code-block__header` | 요소 | — |
| `.code-block__language` | 요소 | — |
| `.code-block__copy` | 요소 | — |
| `.code-block__pre` | 요소 | — |
| `.code-block__code` | 요소 | — |
| `.code-block__line-number` | 요소 | — |

#### CopyToClipboard (버튼에 적용되는 상태 클래스)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.copy-to-clipboard` | 블록 | — |
| `.is-copied` | 상태 | — |

#### SimpleColorPicker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.simple-color-picker` | 블록 | — |
| `.simple-color-picker__swatches` | 요소 | — |
| `.simple-color-picker__swatch` | 요소 | — |
| `.simple-color-picker__input-wrap` | 요소 | — |
| `.simple-color-picker__native` | 요소 | — |
| `.simple-color-picker__input` | 요소 | — |

### carousel

Carousel Module SCSS

> 소스: `src/styles/modules/_carousel.scss` | 클래스: **32개**

#### Carousel

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.carousel` | 블록 | — |
| `.carousel__track` | 요소 | — |
| `.carousel__slide` | 요소 | — |
| `.carousel__content` | 요소 | — |
| `.carousel--multiple` | 변형 | — |
| `.carousel__arrow` | 요소 | — |
| `.carousel--arrows-inside` | 변형 | — |
| `.carousel--arrows-outside` | 변형 | — |
| `.carousel__indicators` | 요소 | — |
| `.carousel__dots` | 요소 | — |
| `.carousel__indicator` | 요소 | — |
| `.carousel__dot` | 요소 | — |
| `.carousel--indicators-line` | 변형 | — |
| `.carousel--indicators-outside` | 변형 | — |
| `.carousel__thumbnails` | 요소 | — |
| `.carousel__thumbnail` | 요소 | — |
| `.carousel__progress` | 요소 | — |
| `.carousel--fade` | 변형 | — |

#### Lightbox

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lightbox` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.lightbox__close` | 요소 | — |
| `.lightbox__content` | 요소 | — |
| `.lightbox__image` | 요소 | — |
| `.lightbox__caption` | 요소 | — |
| `.lightbox__arrow` | 요소 | — |
| `.lightbox__counter` | 요소 | — |
| `.lightbox__thumbnails` | 요소 | — |
| `.lightbox__thumbnail` | 요소 | — |
| `.lightbox__zoom` | 요소 | — |

#### Gallery Grid (for lightbox trigger)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.gallery` | 블록 | — |
| `.gallery__item` | 요소 | — |
| `.gallery--masonry` | 변형 | — |

### data-viz

Data Visualization Module SCSS

> 소스: `src/styles/modules/_data-viz.scss` | 클래스: **100개**

#### Chart Wrapper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chart-wrapper` | 블록 | — |

#### Chart

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chart` | 블록 | — |
| `.chart__area` | 요소 | — |
| `.chart__grid-line` | 요소 | — |
| `.chart__grid-value` | 요소 | — |
| `.chart__bar` | 요소 | — |
| `.chart__bar-value` | 요소 | — |
| `.chart__hbar` | 요소 | — |
| `.chart__hbar-value` | 요소 | — |
| `.chart__y-labels` | 요소 | — |
| `.chart__y-label` | 요소 | — |
| `.chart__labels` | 요소 | — |
| `.chart__label` | 요소 | — |
| `.chart__line-svg` | 요소 | — |
| `.chart__line` | 요소 | — |
| `.chart__area-fill` | 요소 | — |
| `.chart__point` | 요소 | — |
| `.chart--pie` | 변형 | — |
| `.chart--doughnut` | 변형 | — |
| `.chart__pie-svg` | 요소 | — |
| `.chart__pie-segment` | 요소 | — |
| `.chart__doughnut-center` | 요소 | — |
| `.chart__doughnut-total` | 요소 | — |
| `.chart__doughnut-label` | 요소 | — |
| `.chart__legend` | 요소 | — |
| `.chart__legend-item` | 요소 | — |
| `.chart__legend-color` | 요소 | — |
| `.chart__tooltip` | 요소 | — |

#### Data Table

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.datatable` | 블록 | — |
| `.datatable__header` | 요소 | — |
| `.datatable__search` | 요소 | — |
| `.datatable__actions` | 요소 | — |
| `.datatable__action-btn` | 요소 | — |
| `.datatable__container` | 요소 | — |
| `.datatable__table` | 요소 | — |
| `.datatable__thead` | 요소 | — |
| `.datatable__sort` | 요소 | — |
| `.datatable__tbody` | 요소 | — |
| `.datatable__checkbox` | 요소 | — |
| `.datatable__footer` | 요소 | — |
| `.datatable__info` | 요소 | — |
| `.datatable__pagination` | 요소 | — |
| `.datatable__page-btn` | 요소 | — |
| `.datatable__per-page` | 요소 | — |
| `.datatable__loading` | 요소 | — |
| `.datatable__empty` | 요소 | — |
| `.datatable--responsive` | 변형 | — |
| `.datatable--striped` | 변형 | — |
| `.datatable--bordered` | 변형 | — |
| `.datatable--compact` | 변형 | — |

#### Kanban Board

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.kanban` | 블록 | — |
| `.kanban__column` | 요소 | — |
| `.kanban__column-header` | 요소 | — |
| `.kanban__column-title-group` | 요소 | — |
| `.kanban__column-dot` | 요소 | — |
| `.kanban__column-title` | 요소 | — |
| `.kanban__column-count` | 요소 | — |
| `.kanban__column-menu-btn` | 요소 | — |
| `.kanban__cards` | 요소 | — |
| `.kanban__card` | 요소 | — |
| `.kanban__card-header` | 요소 | — |
| `.kanban__card-delete` | 요소 | — |
| `.kanban__priority` | 요소 | — |
| `.kanban__card-body` | 요소 | — |
| `.kanban__card-check` | 요소 | — |
| `.kanban__card-content` | 요소 | — |
| `.kanban__card-title` | 요소 | — |
| `.kanban__card-desc` | 요소 | — |
| `.kanban__card-tags` | 요소 | — |
| `.kanban__tag` | 요소 | — |
| `.kanban__card-footer` | 요소 | — |
| `.kanban__card-date` | 요소 | — |
| `.kanban__card-assignees` | 요소 | — |
| `.kanban__avatar` | 요소 | — |
| `.kanban__add-card` | 요소 | — |

#### Calendar

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.calendar` | 블록 | — |
| `.calendar__header` | 요소 | — |
| `.calendar__nav` | 요소 | — |
| `.calendar__title` | 요소 | — |
| `.calendar__nav-btn` | 요소 | — |
| `.calendar__today-btn` | 요소 | — |
| `.calendar__view-toggle` | 요소 | — |
| `.calendar__view-btn` | 요소 | — |
| `.calendar__weekdays` | 요소 | — |
| `.calendar__weekday` | 요소 | — |
| `.calendar__grid` | 요소 | — |
| `.calendar__cell` | 요소 | — |
| `.calendar__day` | 요소 | — |
| `.calendar__events` | 요소 | — |
| `.calendar__event` | 요소 | — |
| `.calendar__more` | 요소 | — |
| `.calendar__week-view` | 요소 | — |
| `.calendar__week-day` | 요소 | — |
| `.calendar__week-day-header` | 요소 | — |
| `.calendar__week-day-name` | 요소 | — |
| `.calendar__week-day-num` | 요소 | — |
| `.calendar__week-day-events` | 요소 | — |

#### Masonry

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.masonry` | 블록 | — |
| `.masonry__item` | 요소 | — |
| `.masonry--animated` | 변형 | — |

### dropdown

Dropdown Module SCSS

> 소스: `src/styles/modules/_dropdown.scss` | 클래스: **15개**

#### Dropdown

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.dropdown--top` | 변형 | — |
| `.dropdown--full` | 변형 | — |
| `.dropdown--auto` | 변형 | — |

#### Dropdown Item

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown__item` | 블록 | — |
| `.dropdown__item--active` | 변형 | — |
| `.dropdown__item--disabled` | 변형 | — |
| `.dropdown__item--danger` | 변형 | — |

#### Dropdown Divider

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown__divider` | 블록 | — |

#### Dropdown Header

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown__header` | 블록 | — |

#### Dropdown Submenu

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown__submenu` | 블록 | — |

#### Dropdown Search

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown__search` | 블록 | — |

#### Dropdown Scrollable

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown--scrollable` | 블록 | — |

#### Context Menu (Right-click dropdown)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.context-menu` | 블록 | — |

### feedback

Feedback Module SCSS

> 소스: `src/styles/modules/_feedback.scss` | 클래스: **63개**

#### Toast Container

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.toast-container` | 블록 | — |
| `.toast-container--left` | 변형 | — |
| `.toast-container--top` | 변형 | — |
| `.toast-container--center` | 변형 | — |

#### Toast

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.toast` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.is-hiding` | 상태 | — |
| `.toast__icon` | 요소 | — |
| `.toast__message` | 요소 | — |
| `.toast__close` | 요소 | — |
| `.toast--success` | 변형 | — |
| `.toast--error` | 변형 | — |
| `.toast--warning` | 변형 | — |
| `.toast--info` | 변형 | — |

#### Notification Container

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.notification-container` | 블록 | — |
| `.notification-container--top-right` | 변형 | — |
| `.notification-container--top-left` | 변형 | — |
| `.notification-container--bottom-right` | 변형 | — |
| `.notification-container--bottom-left` | 변형 | — |
| `.notification-container--top-center` | 변형 | — |
| `.notification-container--bottom-center` | 변형 | — |

#### Notification

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.notification` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.is-hiding` | 상태 | — |
| `.notification__icon` | 요소 | — |
| `.notification__content` | 요소 | — |
| `.notification__title` | 요소 | — |
| `.notification__message` | 요소 | — |
| `.notification__actions` | 요소 | — |
| `.notification__action` | 요소 | — |
| `.notification__close` | 요소 | — |
| `.notification--success` | 변형 | — |
| `.notification--error` | 변형 | — |
| `.notification--warning` | 변형 | — |
| `.notification--info` | 변형 | — |

#### ProgressTracker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.progress-tracker` | 블록 | — |
| `.progress-tracker__step` | 요소 | — |
| `.progress-tracker__indicator` | 요소 | — |
| `.progress-tracker__label` | 요소 | — |
| `.progress-tracker--vertical` | 변형 | — |

#### Skeleton

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.skeleton-wrapper` | 블록 | — |
| `.skeleton` | 블록 | — |
| `.skeleton--pulse` | 변형 | — |
| `.skeleton--wave` | 변형 | — |
| `.skeleton--animated` | 변형 | — |
| `.skeleton--lg` | 변형 | — |
| `.skeleton--sm` | 변형 | — |
| `.skeleton--xs` | 변형 | — |
| `.skeleton--primary` | 변형 | — |
| `.skeleton--secondary` | 변형 | — |
| `.skeleton--success` | 변형 | — |
| `.skeleton--danger` | 변형 | — |
| `.skeleton--warning` | 변형 | — |
| `.skeleton--info` | 변형 | — |
| `.skeleton--dark` | 변형 | — |
| `.skeleton--text` | 변형 | — |
| `.skeleton--title` | 변형 | — |
| `.skeleton--avatar` | 변형 | — |
| `.skeleton--image` | 변형 | — |
| `.skeleton--card` | 변형 | — |
| `.skeleton--list-item` | 변형 | — |
| `.skeleton__body` | 요소 | — |
| `.skeleton__content` | 요소 | — |

### forms

Forms Module SCSS

> 소스: `src/styles/modules/_forms.scss` | 클래스: **41개**

#### File Upload

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.file-upload` | 블록 | — |
| `.file-upload__dropzone` | 요소 | — |
| `.file-upload__icon` | 요소 | — |
| `.file-upload__text` | 요소 | — |
| `.file-upload__input` | 요소 | — |
| `.file-upload__list` | 요소 | — |
| `.file-upload__item` | 요소 | — |
| `.file-upload__item-icon` | 요소 | — |
| `.file-upload__item-info` | 요소 | — |
| `.file-upload__item-name` | 요소 | — |
| `.file-upload__item-size` | 요소 | — |
| `.file-upload__item-progress` | 요소 | — |
| `.file-upload__item-actions` | 요소 | — |
| `.file-upload__item-btn` | 요소 | — |
| `.file-upload--compact` | 변형 | — |
| `.file-upload--avatar` | 변형 | — |

#### Rating

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.rating` | 블록 | — |
| `.rating__item` | 요소 | — |
| `.rating__icon` | 요소 | — |
| `.rating__value` | 요소 | — |
| `.rating__count` | 요소 | — |
| `.rating--readonly` | 변형 | — |

#### SignaturePad

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.signature-pad` | 블록 | — |
| `.signature-pad__canvas` | 요소 | — |
| `.signature-pad__toolbar` | 요소 | — |
| `.signature-pad__btn` | 요소 | — |

#### FormWizard

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-wizard` | 블록 | — |
| `.form-wizard__progress` | 요소 | — |
| `.form-wizard__step` | 요소 | — |
| `.form-wizard__step-number` | 요소 | — |
| `.form-wizard__step-title` | 요소 | — |
| `.form-wizard__content` | 요소 | — |
| `.form-wizard__panel` | 요소 | — |
| `.form-wizard__nav` | 요소 | — |
| `.form-wizard__btn` | 요소 | — |

#### Switch

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.switch` | 블록 | — |
| `.switch__input` | 요소 | — |
| `.switch__slider` | 요소 | — |
| `.switch__label` | 요소 | — |
| `.switch--sm` | 변형 | — |
| `.switch--lg` | 변형 | — |

### gantt

Gantt Module SCSS

> 소스: `src/styles/modules/_gantt.scss` | 클래스: **42개**

#### Gantt Chart (고급)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.gantt` | 블록 | — |
| `.gantt__header` | 요소 | — |
| `.gantt__controls` | 요소 | — |
| `.gantt__view-buttons` | 요소 | — |
| `.gantt__view-btn` | 요소 | — |
| `.gantt__today-btn` | 요소 | — |
| `.gantt__body` | 요소 | — |
| `.gantt__sidebar` | 요소 | — |
| `.gantt__sidebar-header` | 요소 | — |
| `.gantt__sidebar-content` | 요소 | — |
| `.gantt__task-row` | 요소 | — |
| `.gantt__task-name` | 요소 | — |
| `.gantt__task-title` | 요소 | — |
| `.gantt__task-assignee` | 요소 | — |
| `.gantt__task-bullet` | 요소 | — |
| `.gantt__collapse-btn` | 요소 | — |
| `.gantt__chart-wrapper` | 요소 | — |
| `.gantt__timeline` | 요소 | — |
| `.gantt__timeline-cells` | 요소 | — |
| `.gantt__timeline-cell` | 요소 | — |
| `.gantt__timeline-label` | 요소 | — |
| `.gantt__chart` | 요소 | — |
| `.gantt__bar-row` | 요소 | — |
| `.gantt__grid-cell` | 요소 | — |
| `.gantt__bar` | 요소 | — |
| `.gantt__bar-progress` | 요소 | — |
| `.gantt__bar-label` | 요소 | — |
| `.gantt__bar-handle` | 요소 | — |
| `.gantt__today-line` | 요소 | — |
| `.gantt__today-marker` | 요소 | — |
| `.gantt__dependencies` | 요소 | — |
| `.gantt__dependency-line` | 요소 | — |

#### Gantt Simple (간단한 간트 차트)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.gantt-simple` | 블록 | — |
| `.gantt-simple__header` | 요소 | — |
| `.gantt-simple__header-label` | 요소 | — |
| `.gantt-simple__header-dates` | 요소 | — |
| `.gantt-simple__header-date` | 요소 | — |
| `.gantt-simple__row` | 요소 | — |
| `.gantt-simple__row-label` | 요소 | — |
| `.gantt-simple__timeline` | 요소 | — |
| `.gantt-simple__bar` | 요소 | — |
| `.gantt-simple__today-line` | 요소 | — |

### imagelist

ImageList Module SCSS

> 소스: `src/styles/modules/_imagelist.scss` | 클래스: **26개**

#### ImageList - 이미지 그리드

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.image-list` | 블록 | — |
| `.image-list--masonry` | 변형 | — |
| `.image-list--quilted` | 변형 | — |
| `.image-list__item` | 요소 | — |
| `.image-list__img` | 요소 | — |
| `.image-list__overlay` | 요소 | — |
| `.image-list__title` | 요소 | — |

#### ImageLightbox - 이미지 확대 뷰어

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lightbox` | 블록 | — |
| `.lightbox__header` | 요소 | — |
| `.lightbox__counter` | 요소 | — |
| `.lightbox__actions` | 요소 | — |
| `.lightbox__btn` | 요소 | — |
| `.lightbox__main` | 요소 | — |
| `.lightbox__content` | 요소 | — |
| `.lightbox__img` | 요소 | — |
| `.lightbox__loading` | 요소 | — |
| `.lightbox__nav` | 요소 | — |
| `.lightbox__caption` | 요소 | — |
| `.lightbox__thumbnails` | 요소 | — |
| `.lightbox__thumb` | 요소 | — |

#### ImageCompare - Before/After 비교

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.image-compare` | 블록 | — |
| `.image-compare__label` | 요소 | — |
| `.image-compare__handle-icon` | 요소 | — |
| `.image-compare--vertical` | 변형 | — |

#### LazyImage - 지연 로딩

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lazy-loaded` | 블록 | — |
| `.lazy-error` | 블록 | — |

### live-status

Live Status Module SCSS

> 소스: `src/styles/modules/_live-status.scss` | 클래스: **68개**

#### OnlineStatus - 온라인 상태 인디케이터

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.online-status-wrapper` | 블록 | — |
| `.online-status` | 블록 | — |
| `.online-status--sm` | 변형 | — |
| `.online-status--md` | 변형 | — |
| `.online-status--lg` | 변형 | — |
| `.online-status--bottom-right` | 변형 | — |
| `.online-status--bottom-left` | 변형 | — |
| `.online-status--top-right` | 변형 | — |
| `.online-status--top-left` | 변형 | — |
| `.online-status--pulse` | 변형 | — |
| `.online-status__label` | 요소 | — |

#### TypingIndicator - 타이핑 인디케이터

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.typing-indicator` | 블록 | — |
| `.typing-indicator__dots` | 요소 | — |
| `.typing-indicator__dot` | 요소 | — |
| `.typing-indicator__text` | 요소 | — |

#### ActivityStatus - 마지막 활동 시간

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.activity-status` | 블록 | — |

#### LiveCounter - 실시간 카운터

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.live-counter` | 블록 | — |
| `.live-counter--sm` | 변형 | — |
| `.live-counter--lg` | 변형 | — |
| `.live-counter--xl` | 변형 | — |

#### ConnectionStatus - 연결 상태 배너

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.connection-status` | 블록 | — |
| `.connection-status--top` | 변형 | — |
| `.connection-status--bottom` | 변형 | — |
| `.connection-status--online` | 변형 | — |
| `.connection-status--offline` | 변형 | — |
| `.is-visible` | 상태 | — |

#### Progress Circle

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.progress-circle` | 블록 | — |
| `.progress-circle__svg` | 요소 | — |
| `.progress-circle__track` | 요소 | — |
| `.progress-circle__bar` | 요소 | — |
| `.progress-circle__label` | 요소 | — |
| `.progress-circle--sm` | 변형 | — |
| `.progress-circle--lg` | 변형 | — |

#### Skeleton

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.skeleton` | 블록 | — |
| `.skeleton--text` | 변형 | — |
| `.skeleton--title` | 변형 | — |
| `.skeleton--avatar` | 변형 | — |
| `.skeleton--thumbnail` | 변형 | — |
| `.skeleton--button` | 변형 | — |
| `.skeleton--circle` | 변형 | — |
| `.skeleton--card` | 변형 | — |
| `.skeleton--static` | 변형 | — |
| `.skeleton--wave` | 변형 | — |

#### Skeleton Layouts

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.skeleton-card` | 블록 | — |
| `.skeleton-card__image` | 요소 | — |
| `.skeleton-card__title` | 요소 | — |
| `.skeleton-card__text` | 요소 | — |
| `.skeleton-list-item` | 블록 | — |
| `.skeleton-list-item__avatar` | 요소 | — |
| `.skeleton-list-item__content` | 요소 | — |
| `.skeleton-list-item__title` | 요소 | — |
| `.skeleton-list-item__text` | 요소 | — |
| `.skeleton-table` | 블록 | — |
| `.skeleton-table__row` | 요소 | — |
| `.skeleton-table__cell` | 요소 | — |

#### Loading Spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.spinner` | 블록 | — |
| `.spinner--xs` | 변형 | — |
| `.spinner--sm` | 변형 | — |
| `.spinner--lg` | 변형 | — |
| `.spinner--xl` | 변형 | — |
| `.spinner--white` | 변형 | — |
| `.spinner--success` | 변형 | — |
| `.spinner--error` | 변형 | — |

#### Loading Dots

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.loading-dots` | 블록 | — |
| `.loading-dots__dot` | 요소 | — |

#### Loading Overlay

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.loading-overlay` | 블록 | — |
| `.loading-overlay__text` | 요소 | — |
| `.loading-overlay--fullscreen` | 변형 | — |

### media-viewer

Media Viewer Module SCSS

> 소스: `src/styles/modules/_media-viewer.scss` | 클래스: **57개**

#### Media Viewer Module SCSS

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.ratio` | 블록 | Ratio 유틸리티 / VideoPlayer / AudioPlayer / ImageViewer / Lightbox Ubold ui-videos.html 참조 ────────────────────────────────────────────── 1. Ratio 유틸리티 (반응형 임베드) Ubold: ratio ratio-21x9, ratio-16x9, ratio-4x3, ratio-1x1 ────────────────────────────────────────────── |
| `.embed-video` | 블록 | 비율 프리셋 커스텀 비율: --ratio 변수 사용 ────────────────────────────────────────────── 2. EmbedVideo 래퍼 ────────────────────────────────────────────── |
| `.embed-video--rounded` | 변형 | — |
| `.embed-video--shadow` | 변형 | — |
| `.video-player` | 블록 | ────────────────────────────────────────────── 3. VideoPlayer — 커스텀 HTML5 비디오 플레이어 ────────────────────────────────────────────── |
| `.video-player__wrapper` | 요소 | — |
| `.video-player__video` | 요소 | — |
| `.video-player__overlay` | 요소 | — |
| `.video-player__big-play` | 요소 | — |
| `.video-player__loading` | 요소 | — |
| `.video-player__spinner` | 요소 | — |
| `.video-player__controls` | 요소 | — |
| `.video-player__progress` | 요소 | — |
| `.video-player__progress-bar` | 요소 | — |
| `.video-player__progress-buffered` | 요소 | — |
| `.video-player__progress-played` | 요소 | — |
| `.video-player__progress-handle` | 요소 | — |
| `.video-player__controls-bar` | 요소 | — |
| `.video-player__controls-left` | 요소 | — |
| `.video-player__controls-right` | 요소 | — |
| `.video-player__btn` | 요소 | — |
| `.video-player__volume` | 요소 | — |
| `.video-player__volume-slider` | 요소 | — |
| `.video-player__volume-input` | 요소 | — |
| `.video-player__time` | 요소 | — |
| `.video-player__separator` | 요소 | — |
| `.audio-player` | 블록 | ────────────────────────────────────────────── 4. AudioPlayer — 커스텀 오디오 플레이어 ────────────────────────────────────────────── |
| `.audio-player__cover` | 요소 | — |
| `.audio-player__info` | 요소 | — |
| `.audio-player__title` | 요소 | — |
| `.audio-player__artist` | 요소 | — |
| `.audio-player__controls` | 요소 | — |
| `.audio-player__progress` | 요소 | — |
| `.audio-player__time` | 요소 | — |
| `.audio-player__progress-bar` | 요소 | — |
| `.audio-player__progress-fill` | 요소 | — |
| `.audio-player__buttons` | 요소 | — |
| `.audio-player__btn` | 요소 | — |
| `.audio-player__volume` | 요소 | — |
| `.audio-player__volume-slider` | 요소 | — |
| `.image-viewer` | 블록 | ────────────────────────────────────────────── 5. ImageViewer — 이미지 확대/회전/다운로드 ────────────────────────────────────────────── |
| `.image-viewer__wrapper` | 요소 | — |
| `.image-viewer__image` | 요소 | — |
| `.image-viewer__toolbar` | 요소 | — |
| `.image-viewer__btn` | 요소 | — |
| `.image-viewer__zoom-level` | 요소 | — |
| `.media-viewer` | 블록 | ────────────────────────────────────────────── 6. Lightbox 오버레이 (기존 유지) ────────────────────────────────────────────── |
| `.is-open` | 상태 | — |
| `.media-viewer__close` | 요소 | — |
| `.media-viewer__content` | 요소 | — |
| `.media-viewer__img` | 요소 | — |
| `.media-viewer__video` | 요소 | — |
| `.media-viewer__nav` | 요소 | — |
| `.media-viewer__caption` | 요소 | — |
| `.media-viewer__thumbnails` | 요소 | — |
| `.media-viewer__thumb` | 요소 | — |
| `.media-viewer__counter` | 요소 | — |

### navigation

Navigation Module SCSS

> 소스: `src/styles/modules/_navigation.scss` | 클래스: **61개**

#### Tabs

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.tabs` | 블록 | — |
| `.tabs--horizontal` | 변형 | — |
| `.tabs--vertical` | 변형 | — |
| `.tabs--pills` | 변형 | — |
| `.tabs--bordered` | 변형 | — |
| `.tabs--cards` | 변형 | — |
| `.tabs__list` | 블록 | Tab List |
| `.tabs__tab` | 블록 | Tab Item |
| `.is-active` | 상태 | — |
| `.tabs__content` | 블록 | Tab Content |
| `.tabs__panel` | 블록 | Tab Panel |
| `.is-active` | 상태 | — |

#### Accordion

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.accordion` | 블록 | — |
| `.accordion--flush` | 변형 | — |
| `.accordion--separated` | 변형 | — |
| `.accordion__item` | 블록 | Accordion Item |
| `.is-open` | 상태 | — |
| `.accordion__trigger` | 블록 | Accordion Trigger |
| `.accordion__content` | 블록 | Accordion Content |
| `.is-open` | 상태 | — |

#### Page Title Box (모든 데모 뷰 공통 레이아웃)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.page-title-box` | 블록 | — |
| `.page-title` | 블록 | — |
| `.page-desc` | 블록 | — |

#### Breadcrumb

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.breadcrumb` | 블록 | — |
| `.breadcrumb-item` | 블록 | — |
| `.breadcrumb--icons` | 블록 | Breadcrumb — 아이콘 구분자 변형 |

#### Sidebar (Ubold app-menu 패턴 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.sidebar` | 블록 | — |
| `.sidebar__logo` | 요소 | — |
| `.sidebar__logo-text` | 요소 | — |
| `.sidebar__user` | 요소 | — |
| `.sidebar__user-avatar` | 요소 | — |
| `.sidebar__user-info` | 요소 | — |
| `.sidebar__user-name` | 요소 | — |
| `.sidebar__user-role` | 요소 | — |
| `.sidebar__toggle` | 요소 | — |
| `.sidebar__nav` | 요소 | — |
| `.sidebar__menu` | 요소 | — |
| `.sidebar__menu-title` | 요소 | — |
| `.sidebar__menu-item` | 요소 | — |
| `.sidebar__menu-link` | 요소 | — |
| `.sidebar__menu-icon` | 요소 | — |
| `.sidebar__menu-text` | 요소 | — |
| `.sidebar__menu-arrow` | 요소 | — |
| `.sidebar__badge` | 요소 | — |
| `.sidebar__submenu` | 요소 | — |
| `.sidebar--expanded` | 변형 | — |
| `.sidebar--collapsed` | 변형 | — |
| `.sidebar--compact` | 변형 | — |

#### MegaMenu

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.megamenu` | 블록 | — |
| `.megamenu__item` | 요소 | — |
| `.megamenu__trigger` | 요소 | — |
| `.megamenu__panel` | 요소 | — |
| `.megamenu__columns` | 요소 | — |
| `.megamenu__column-title` | 요소 | — |
| `.megamenu__link` | 요소 | — |

#### TreeView

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.treeview` | 블록 | — |
| `.treeview__item` | 블록 | — |
| `.treeview__toggle` | 블록 | — |
| `.treeview__label` | 블록 | — |
| `.treeview__label--selected` | 변형 | — |
| `.treeview__children` | 블록 | — |

### overlays

Overlays Module SCSS

> 소스: `src/styles/modules/_overlays.scss` | 클래스: **39개**

#### Overlays Module SCSS

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.overlay-backdrop` | 블록 | Modal, Drawer, Offcanvas Variables Backdrop |
| `.is-visible` | 상태 | — |
| `.modal` | 블록 | Modal |
| `.is-visible` | 상태 | — |
| `.modal--sm` | 변형 | — |
| `.modal--lg` | 변형 | — |
| `.modal--xl` | 변형 | — |
| `.modal__header` | 요소 | — |
| `.modal__title` | 요소 | — |
| `.modal__close` | 요소 | — |
| `.modal__body` | 요소 | — |
| `.modal__footer` | 요소 | — |
| `.drawer` | 블록 | Drawer |
| `.drawer--left` | 변형 | — |
| `.drawer--right` | 변형 | — |
| `.drawer--top` | 변형 | — |
| `.drawer--bottom` | 변형 | — |
| `.drawer__header` | 요소 | — |
| `.drawer__title` | 요소 | — |
| `.drawer__close` | 요소 | — |
| `.drawer__body` | 요소 | — |
| `.drawer__footer` | 요소 | — |
| `.offcanvas` | 블록 | Offcanvas |
| `.offcanvas--left` | 변형 | — |
| `.offcanvas--right` | 변형 | — |
| `.offcanvas--top` | 변형 | — |
| `.offcanvas--bottom` | 변형 | — |
| `.offcanvas__header` | 요소 | — |
| `.offcanvas__title` | 요소 | — |
| `.offcanvas__close` | 요소 | — |
| `.offcanvas__body` | 요소 | — |
| `.offcanvas__footer` | 요소 | — |
| `.alert-dialog` | 블록 | Alert Dialog |
| `.is-visible` | 상태 | — |
| `.alert-dialog__icon` | 요소 | — |
| `.alert-dialog__title` | 요소 | — |
| `.alert-dialog__message` | 요소 | — |
| `.alert-dialog__input` | 요소 | — |
| `.alert-dialog__footer` | 요소 | — |

### pagination

Pagination Module SCSS

> 소스: `src/styles/modules/_pagination.scss` | 클래스: **15개**

#### Wrapper (정렬, 정보 텍스트 포함)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-wrapper` | 블록 | — |
| `.pagination-wrapper--center` | 변형 | — |
| `.pagination-wrapper--end` | 변형 | — |

#### Info Text ("1-10 / 200")

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-info` | 블록 | — |

#### Base Pagination

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination` | 블록 | — |

#### Pagination Item

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination__item` | 블록 | — |

#### Pagination Link (클릭 대상)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination__link` | 블록 | — |

#### Rounded (Ubold .pagination-rounded)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-rounded` | 블록 | — |

#### Sizes (Ubold .pagination-sm / .pagination-lg)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-sm` | 블록 | — |
| `.pagination-lg` | 블록 | — |

#### DataPaginator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.data-paginator` | 블록 | — |
| `.data-paginator__content` | 요소 | — |
| `.data-paginator__empty` | 요소 | — |
| `.data-paginator__item` | 요소 | — |
| `.data-paginator__pagination` | 요소 | — |

### pickers

Pickers Module SCSS

> 소스: `src/styles/modules/_pickers.scss` | 클래스: **63개**

#### Base Picker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.picker` | 블록 | — |
| `.is-visible` | 상태 | — |

#### Picker Wrappers (JS 생성 구조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.datepicker` | 블록 | — |
| `.timepicker` | 블록 | — |
| `.colorpicker` | 블록 | — |
| `.colorpicker__input` | 요소 | — |
| `.colorpicker__icon` | 요소 | — |
| `.colorpicker__dropdown` | 요소 | — |

#### DatePicker Calendar (드롭다운 내부)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.datepicker__dropdown` | 블록 | JS: .datepicker__dropdown > .datepicker__header, .datepicker__days 등 BEM 중첩 대신 독립 선택자 사용 (.datepicker__dropdown 안에 &__* 중첩 시 __dropdown__* 생성되므로) |
| `.datepicker__header` | 블록 | — |
| `.calendar__header` | 블록 | — |
| `.datepicker__title` | 블록 | — |
| `.calendar__title` | 블록 | — |
| `.datepicker__year` | 블록 | — |
| `.datepicker__month` | 블록 | — |
| `.datepicker__nav-btn` | 블록 | — |
| `.calendar__nav-btn` | 블록 | — |
| `.datepicker__weekdays` | 블록 | — |
| `.calendar__weekdays` | 블록 | — |
| `.datepicker__weekday` | 블록 | — |
| `.calendar__weekday` | 블록 | — |
| `.datepicker__days` | 블록 | — |
| `.calendar__days` | 블록 | — |
| `.datepicker__day` | 블록 | — |
| `.calendar__day` | 블록 | — |
| `.is-today` | 상태 | — |
| `.is-selected` | 상태 | — |
| `.is-range-start` | 상태 | — |
| `.is-range-end` | 상태 | — |
| `.is-in-range` | 상태 | — |
| `.is-outside` | 상태 | — |
| `.calendar__day--empty` | 변형 | — |
| `.datepicker__years` | 블록 | Years / Months grid |
| `.datepicker__months` | 블록 | — |
| `.datepicker__year-item` | 블록 | — |
| `.datepicker__month-item` | 블록 | — |
| `.datepicker__month-item--selected` | 변형 | — |
| `.datepicker__month-item--other` | 변형 | — |
| `.datepicker__footer` | 블록 | — |
| `.calendar__footer` | 블록 | — |
| `.datepicker__today-btn` | 블록 | — |
| `.calendar__today-btn` | 블록 | — |

#### TimePicker Dropdown List (JS 생성 구조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.timepicker__dropdown` | 블록 | — |
| `.timepicker__list` | 블록 | — |
| `.timepicker__option` | 블록 | — |
| `.is-selected` | 상태 | — |

#### ColorPicker Wrapper (JS 생성 구조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.colorpicker` | 블록 | — |
| `.colorpicker__preview` | 요소 | — |
| `.colorpicker__input` | 요소 | — |
| `.colorpicker__dropdown` | 요소 | — |
| `.colorpicker__presets` | 요소 | — |
| `.colorpicker__preset` | 요소 | — |
| `.colorpicker__custom` | 요소 | — |
| `.colorpicker__native` | 요소 | — |

#### Countdown (JS 생성 구조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.countdown` | 블록 | — |
| `.countdown__item` | 요소 | — |
| `.countdown__value` | 요소 | — |
| `.countdown__label` | 요소 | — |
| `.countdown__sep` | 요소 | — |

#### DDay (JS 생성 구조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dday` | 블록 | — |
| `.dday__title` | 요소 | — |
| `.dday__count` | 요소 | — |
| `.dday__date` | 요소 | — |

### scroll

Scroll Module SCSS

> 소스: `src/styles/modules/_scroll.scss` | 클래스: **31개**

#### Infinite Scroll

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.infinite-scroll` | 블록 | — |
| `.infinite-scroll__loader` | 요소 | — |
| `.infinite-scroll__spinner` | 요소 | — |
| `.infinite-scroll__end` | 요소 | — |
| `.infinite-scroll__error` | 요소 | — |

#### Back to Top Button

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.back-to-top` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.back-to-top--secondary` | 변형 | — |
| `.back-to-top--sm` | 변형 | — |
| `.back-to-top--lg` | 변형 | — |
| `.back-to-top--left` | 변형 | — |

#### Scroll Progress

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.scroll-progress` | 블록 | — |
| `.scroll-progress__bar` | 요소 | — |
| `.scroll-progress--bottom` | 변형 | — |
| `.scroll-progress--gradient` | 변형 | — |

#### Scroll Indicator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.scroll-indicator` | 블록 | — |
| `.scroll-indicator__dot` | 요소 | — |
| `.scroll-indicator--left` | 변형 | — |
| `.scroll-indicator--line` | 변형 | — |

#### Smooth Scroll Anchor

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.scroll-anchor` | 블록 | — |

#### Scroll Snap Container

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.scroll-snap` | 블록 | — |
| `.scroll-snap__section` | 요소 | — |
| `.scroll-snap--horizontal` | 변형 | — |
| `.scroll-snap--proximity` | 변형 | — |

#### Scrollbar Custom

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.custom-scrollbar` | 블록 | — |
| `.custom-scrollbar--thin` | 변형 | — |
| `.custom-scrollbar--hidden` | 변형 | — |

#### Pull to Refresh

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pull-to-refresh` | 블록 | — |
| `.pull-to-refresh__indicator` | 요소 | — |
| `.pull-to-refresh__spinner` | 요소 | — |
| `.pull-to-refresh__arrow` | 요소 | — |

### security-input

Security Input Module SCSS

> 소스: `src/styles/modules/_security-input.scss` | 클래스: **24개**

#### OTP Input (인증 코드 입력)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.otp-input` | 블록 | — |
| `.otp-input__fields` | 요소 | — |
| `.otp-input__field` | 요소 | — |
| `.otp-input__separator` | 요소 | — |
| `.otp-input__error` | 요소 | — |
| `.otp-input--disabled` | 변형 | — |

#### PIN Input (보안 PIN 입력)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pin-input` | 블록 | — |
| `.pin-input__wrapper` | 요소 | — |
| `.pin-input__fields` | 요소 | — |
| `.pin-input__field-wrapper` | 요소 | — |
| `.pin-input__field` | 요소 | — |
| `.pin-input__dot` | 요소 | — |
| `.pin-input__toggle` | 요소 | — |
| `.pin-input__error` | 요소 | — |
| `.pin-input--disabled` | 변형 | — |
| `.pin-input__keypad` | 요소 | — |
| `.pin-input__key` | 요소 | — |

#### Security Input (비밀번호 강도 표시)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.security-input` | 블록 | — |
| `.security-input__wrapper` | 요소 | — |
| `.security-input__field` | 요소 | — |
| `.security-input__toggle` | 요소 | — |
| `.security-input__strength` | 요소 | — |
| `.security-input__strength-bar` | 요소 | — |
| `.security-input__strength-label` | 요소 | — |

### selectors

Selectors Module SCSS

> 소스: `src/styles/modules/_selectors.scss` | 클래스: **34개**

#### Autocomplete

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.autocomplete` | 블록 | — |
| `.autocomplete__input` | 요소 | — |
| `.autocomplete__icon` | 요소 | — |
| `.autocomplete__clear` | 요소 | — |
| `.autocomplete__dropdown` | 요소 | — |
| `.autocomplete__item` | 요소 | — |
| `.autocomplete__no-results` | 요소 | — |
| `.autocomplete__loading` | 요소 | — |
| `.autocomplete__group-header` | 요소 | — |

#### MultiSelect

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.multiselect` | 블록 | — |
| `.multiselect__tags` | 요소 | — |
| `.multiselect__input` | 요소 | — |
| `.multiselect__tag` | 요소 | — |
| `.multiselect__icons` | 요소 | — |
| `.multiselect__clear` | 요소 | — |
| `.multiselect__toggle` | 요소 | — |
| `.multiselect__dropdown` | 요소 | — |
| `.multiselect__option` | 요소 | — |
| `.multiselect__no-options` | 요소 | — |
| `.multiselect__checkbox` | 요소 | — |

#### Transfer List

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.transfer` | 블록 | — |
| `.transfer__list` | 요소 | — |
| `.transfer__header` | 요소 | — |
| `.transfer__search` | 요소 | — |
| `.transfer__items` | 요소 | — |
| `.transfer__item` | 요소 | — |
| `.transfer__controls` | 요소 | — |
| `.transfer__btn` | 요소 | — |

#### Range Slider

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.range-slider` | 블록 | — |
| `.range-slider__track` | 요소 | — |
| `.range-slider__fill` | 요소 | — |
| `.range-slider__handle` | 요소 | — |
| `.range-slider__tooltip` | 요소 | — |
| `.range-slider__labels` | 요소 | — |

### social

Social Module SCSS

> 소스: `src/styles/modules/_social.scss` | 클래스: **63개**

#### ChatUI (Ubold chat.html 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chat-ui` | 블록 | — |
| `.chat-ui__messages` | 요소 | — |
| `.chat-ui__date-divider` | 요소 | — |
| `.chat-ui__message` | 요소 | — |
| `.chat-ui__avatar` | 요소 | — |
| `.chat-ui__bubble` | 요소 | — |
| `.chat-ui__sender` | 요소 | — |
| `.chat-ui__text` | 요소 | — |
| `.chat-ui__time` | 요소 | — |
| `.chat-ui__typing` | 요소 | — |
| `.chat-ui__typing-indicator` | 요소 | — |
| `.chat-ui__typing-dot` | 요소 | — |
| `.chat-ui__input-area` | 요소 | — |
| `.chat-ui__input-wrapper` | 요소 | — |
| `.chat-ui__input` | 요소 | — |
| `.chat-ui__btn` | 요소 | — |

#### Comments

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.comments` | 블록 | — |
| `.comments__header` | 요소 | — |
| `.comments__title` | 요소 | — |
| `.comments__count` | 요소 | — |
| `.comments__form` | 요소 | — |
| `.comments__input-area` | 요소 | — |
| `.comments__input` | 요소 | — |
| `.comments__form-actions` | 요소 | — |
| `.comments__avatar` | 요소 | — |
| `.comments__item` | 요소 | — |
| `.comments__content` | 요소 | — |
| `.comments__meta` | 요소 | — |
| `.comments__author` | 요소 | — |
| `.comments__date` | 요소 | — |
| `.comments__edited` | 요소 | — |
| `.comments__text` | 요소 | — |
| `.comments__actions` | 요소 | — |
| `.comments__action` | 요소 | — |
| `.comments__reply-form` | 요소 | — |
| `.comments__replies` | 요소 | — |

#### SocialFeed (Ubold social-feed.html 참조)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.social-feed` | 블록 | — |
| `.feed-post` | 블록 | — |
| `.feed-post__header` | 요소 | — |
| `.feed-post__avatar` | 요소 | — |
| `.feed-post__user-info` | 요소 | — |
| `.feed-post__user-name` | 요소 | — |
| `.feed-post__time` | 요소 | — |
| `.feed-post__body` | 요소 | — |
| `.feed-post__text` | 요소 | — |
| `.feed-post__images` | 요소 | — |
| `.feed-post__actions` | 요소 | — |
| `.feed-post__action-btn` | 요소 | — |
| `.feed-post__comments` | 요소 | — |
| `.feed-post__comment-input` | 요소 | — |
| `.feed-post__compose` | 요소 | — |
| `.feed-post__compose-actions` | 요소 | — |
| `.feed-post__compose-tools` | 요소 | — |
| `.feed-post__compose-tool` | 요소 | — |

#### Reactions

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.reactions` | 블록 | — |
| `.reactions__btn` | 요소 | — |
| `.reactions__emoji` | 요소 | — |
| `.reactions__count` | 요소 | — |

#### ShareButtons

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.share-buttons` | 블록 | — |
| `.share-buttons--vertical` | 변형 | — |
| `.share-buttons__btn` | 요소 | — |
| `.share-buttons__icon-text` | 요소 | — |
| `.share-buttons__label` | 요소 | — |

### stepper

Stepper Module SCSS

> 소스: `src/styles/modules/_stepper.scss` | 클래스: **44개**

#### Stepper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper` | 블록 | — |
| `.stepper__steps` | 요소 | — |
| `.stepper--horizontal` | 변형 | — |
| `.stepper--vertical` | 변형 | — |

#### Step

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__step` | 블록 | — |
| `.is-completed` | 상태 | — |
| `.is-active` | 상태 | — |
| `.is-error` | 상태 | — |
| `.is-disabled` | 상태 | — |

#### Indicator (circle with number/icon)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__indicator` | 블록 | — |
| `.stepper__number` | 블록 | Number / Check icon (indicator 내부) |
| `.stepper__check` | 블록 | — |
| `.stepper__label` | 블록 | Label (title + subtitle) |
| `.stepper__subtitle` | 블록 | — |

#### Content

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__content` | 블록 | — |
| `.stepper__title` | 블록 | — |
| `.stepper__description` | 블록 | — |

#### Connector (line between steps)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__connector` | 블록 | — |

#### Sizes

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper--sm` | 블록 | — |
| `.stepper--lg` | 블록 | — |

#### Variants

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper--dot` | 블록 | Dot style (small circles) |
| `.stepper--progress` | 블록 | Progress style (connected progress bar) |

#### Clickable Steps

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper--clickable` | 블록 | — |

#### Step Panel Content

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__content` | 블록 | — |
| `.is-changing` | 상태 | — |
| `.stepper__panel` | 블록 | — |
| `.is-active` | 상태 | — |

#### Navigation Buttons

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper__nav` | 블록 | — |

#### VerticalStepper (JS가 생성하는 vertical-stepper__* 클래스)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.vertical-stepper` | 블록 | — |
| `.vertical-stepper__item` | 블록 | — |
| `.is-completed` | 상태 | — |
| `.is-active` | 상태 | — |
| `.vertical-stepper__header` | 블록 | — |
| `.vertical-stepper__indicator` | 블록 | — |
| `.vertical-stepper__number` | 블록 | — |
| `.vertical-stepper__check` | 블록 | — |
| `.vertical-stepper__label` | 블록 | — |
| `.vertical-stepper__title` | 블록 | — |
| `.vertical-stepper__subtitle` | 블록 | — |
| `.vertical-stepper__edit` | 블록 | — |
| `.vertical-stepper__connector` | 블록 | — |
| `.vertical-stepper__content` | 블록 | — |
| `.vertical-stepper__body` | 블록 | — |
| `.vertical-stepper__actions` | 블록 | — |

### text-editors

Text Editors Module SCSS

> 소스: `src/styles/modules/_text-editors.scss` | 클래스: **25개**

#### RichTextEditor

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.rich-text-editor` | 블록 | — |
| `.is-focused` | 상태 | — |
| `.rich-text-editor__toolbar` | 요소 | — |
| `.rich-text-editor__btn` | 요소 | — |
| `.rich-text-editor__separator` | 요소 | — |
| `.rich-text-editor__content` | 요소 | — |
| `.rich-text-editor__footer` | 요소 | — |

#### MarkdownEditor

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.markdown-editor` | 블록 | — |
| `.markdown-editor__toolbar` | 요소 | — |
| `.markdown-editor__btn` | 요소 | — |
| `.markdown-editor__separator` | 요소 | — |
| `.markdown-editor__tabs` | 요소 | — |
| `.markdown-editor__tab` | 요소 | — |
| `.markdown-editor__body` | 요소 | — |
| `.markdown-editor__pane` | 요소 | — |
| `.markdown-editor__input` | 요소 | — |
| `.markdown-editor__preview` | 요소 | — |

#### 마크다운 렌더링 콘텐츠 (.markdown-content)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.markdown-content` | 블록 | — |

#### TextareaAutosize

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.textarea-autosize` | 블록 | — |
| `.is-focused` | 상태 | — |
| `.textarea-autosize__toolbar` | 요소 | — |
| `.textarea-autosize__btn` | 요소 | — |
| `.textarea-autosize__separator` | 요소 | — |
| `.textarea-autosize__input` | 요소 | — |
| `.textarea-autosize__footer` | 요소 | — |

### theme

Theme Module SCSS

> 소스: `src/styles/modules/_theme.scss` | 클래스: **20개**

#### Theme Switcher

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.theme-switcher` | 블록 | — |
| `.theme-switcher__button` | 요소 | — |
| `.theme-switcher--icons` | 변형 | — |
| `.theme-switcher--vertical` | 변형 | — |

#### Theme Toggle Button

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.theme-toggle` | 블록 | — |
| `.theme-toggle__icon-light` | 요소 | — |
| `.theme-toggle__icon-dark` | 요소 | — |

#### Theme Preview Cards

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.theme-preview` | 블록 | — |
| `.theme-preview__card` | 요소 | — |
| `.theme-preview__title` | 요소 | — |
| `.theme-preview__description` | 요소 | — |
| `.theme-preview__samples` | 요소 | — |
| `.theme-preview__sample` | 요소 | — |

#### Color Scheme Status Indicator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.color-scheme-indicator` | 블록 | — |
| `.color-scheme-indicator__icon` | 요소 | — |
| `.color-scheme-indicator__status` | 요소 | — |

#### Auto Theme Based on Time

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.auto-theme-schedule` | 블록 | — |
| `.auto-theme-schedule__row` | 요소 | — |
| `.auto-theme-schedule__label` | 요소 | — |
| `.auto-theme-schedule__time` | 요소 | — |

### tooltips

Tooltips Module SCSS

> 소스: `src/styles/modules/_tooltips.scss` | 클래스: **21개**

#### Tooltip

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.tooltip` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.tooltip__arrow` | 요소 | — |
| `.tooltip--top` | 변형 | — |
| `.tooltip--bottom` | 변형 | — |
| `.tooltip--left` | 변형 | — |
| `.tooltip--right` | 변형 | — |
| `.tooltip--light` | 변형 | — |

#### Popover

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.popover` | 블록 | — |
| `.is-visible` | 상태 | — |
| `.popover__arrow` | 요소 | — |
| `.popover--top` | 변형 | — |
| `.popover--bottom` | 변형 | — |
| `.popover--left` | 변형 | — |
| `.popover--right` | 변형 | — |
| `.popover__header` | 요소 | — |
| `.popover__title` | 요소 | — |
| `.popover__close` | 요소 | — |
| `.popover__body` | 요소 | — |
| `.popover__footer` | 요소 | — |

#### Hint (inline tooltip)

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.hint` | 블록 | — |

## JS 코어 모듈 (Core)

코어 JS에서 동적으로 생성/사용하는 CSS 클래스

### auto-init

> 소스: `src/core/auto-init.js` | 클래스: **2개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-hidden` | 블록 | — |
| `.is-visible` | 블록 | — |

### loading

> 소스: `src/core/loading.js` | 클래스: **8개**

#### imcat-loading

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading` | 블록 | — |

#### imcat-loading-bar

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-bar` | 블록 | — |

#### imcat-loading-bar-fill

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-bar-fill` | 블록 | — |

#### imcat-loading-dots

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-dots` | 블록 | — |

#### imcat-loading-message

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-message` | 블록 | — |

#### imcat-loading-show

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-show` | 블록 | — |

#### imcat-loading-spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-loading-spinner` | 블록 | — |

#### imcat-spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-spinner` | 블록 | — |

### shortcuts

> 소스: `src/core/shortcuts.js` | 클래스: **1개**

#### form-input

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-input` | 블록 | — |

## JS 확장 모듈 (Modules)

확장 모듈 JS에서 동적으로 생성/사용하는 CSS 클래스

### advanced-ui

> 소스: `src/modules/advanced-ui.js` | 클래스: **26개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-dragging` | 블록 | — |
| `.is-copied` | 블록 | — |
| `.is-active` | 블록 | — |

#### code-block

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.code-block` | 블록 | — |
| `.code-block__line-number` | 요소 | — |
| `.code-block__header` | 요소 | — |
| `.code-block__language` | 요소 | — |
| `.code-block__copy` | 요소 | — |
| `.code-block__pre` | 요소 | — |
| `.code-block__code` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### qr-code

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.qr-code` | 블록 | — |

#### simple-color-picker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.simple-color-picker` | 블록 | — |
| `.simple-color-picker__swatch` | 요소 | — |
| `.simple-color-picker__swatches` | 요소 | — |
| `.simple-color-picker__input-wrap` | 요소 | — |
| `.simple-color-picker__native` | 요소 | — |
| `.simple-color-picker__input` | 요소 | — |

#### spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.spinner` | 블록 | — |

#### split-pane

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.split-pane` | 블록 | — |
| `.split-pane__gutter` | 요소 | — |
| `.split-pane__panel` | 요소 | — |
| `.split-pane__panel--first` | 요소 | — |
| `.split-pane__panel--second` | 요소 | — |
| `.split-pane--horizontal` | 변형 | — |
| `.split-pane--vertical` | 변형 | — |

### carousel

> 소스: `src/modules/carousel.js` | 클래스: **41개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-active` | 블록 | — |
| `.is-open` | 블록 | — |
| `.is-loading` | 블록 | — |

#### carousel

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.carousel` | 블록 | — |
| `.carousel__track` | 요소 | — |
| `.carousel__slide` | 요소 | — |
| `.carousel__image` | 요소 | — |
| `.carousel__content` | 요소 | — |
| `.carousel__caption` | 요소 | — |
| `.carousel__title` | 요소 | — |
| `.carousel__description` | 요소 | — |
| `.carousel__slide--clone` | 요소 | — |
| `.carousel__arrow` | 요소 | — |
| `.carousel__arrow--prev` | 요소 | — |
| `.carousel__arrow--next` | 요소 | — |
| `.carousel__dots` | 요소 | — |
| `.carousel__dot` | 요소 | — |
| `.carousel__counter` | 요소 | — |
| `.carousel__current` | 요소 | — |
| `.carousel__total` | 요소 | — |
| `.carousel__thumbnails` | 요소 | — |
| `.carousel__thumbnail` | 요소 | — |
| `.carousel__track--jumping` | 요소 | — |
| `.carousel--slide` | 변형 | — |
| `.carousel--fade` | 변형 | — |
| `.carousel--scale` | 변형 | — |
| `.carousel--flip` | 변형 | — |
| `.carousel--cube` | 변형 | — |

#### lightbox

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lightbox` | 블록 | — |
| `.lightbox__backdrop` | 요소 | — |
| `.lightbox__container` | 요소 | — |
| `.lightbox__close` | 요소 | — |
| `.lightbox__arrow` | 요소 | — |
| `.lightbox__arrow--prev` | 요소 | — |
| `.lightbox__arrow--next` | 요소 | — |
| `.lightbox__content` | 요소 | — |
| `.lightbox__image` | 요소 | — |
| `.lightbox__footer` | 요소 | — |
| `.lightbox__caption` | 요소 | — |
| `.lightbox__counter` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

### data-viz

> 소스: `src/modules/data-viz.js` | 클래스: **113개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-selected` | 블록 | — |

#### calendar

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.calendar` | 블록 | — |
| `.calendar__header` | 요소 | — |
| `.calendar__nav` | 요소 | — |
| `.calendar__nav-btn` | 요소 | — |
| `.calendar__today-btn` | 요소 | — |
| `.calendar__title` | 요소 | — |
| `.calendar__view-toggle` | 요소 | — |
| `.calendar__view-btn` | 요소 | — |
| `.calendar__weekdays` | 요소 | — |
| `.calendar__weekday` | 요소 | — |
| `.calendar__grid` | 요소 | — |
| `.calendar__cell` | 요소 | — |
| `.calendar__day` | 요소 | — |
| `.calendar__events` | 요소 | — |
| `.calendar__event` | 요소 | — |
| `.calendar__more` | 요소 | — |
| `.calendar__week-view` | 요소 | — |
| `.calendar__week-day` | 요소 | — |
| `.calendar__week-day-header` | 요소 | — |
| `.calendar__week-day-name` | 요소 | — |
| `.calendar__week-day-num` | 요소 | — |
| `.calendar__week-day-events` | 요소 | — |

#### chart

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chart` | 블록 | — |
| `.chart__grid-line` | 요소 | — |
| `.chart__grid-line--vertical` | 요소 | — |
| `.chart__grid-value` | 요소 | — |
| `.chart__hbar` | 요소 | — |
| `.chart__hbar-value` | 요소 | — |
| `.chart__y-labels` | 요소 | — |
| `.chart__y-label` | 요소 | — |
| `.chart__area` | 요소 | — |
| `.chart__area--horizontal` | 요소 | — |
| `.chart__bar` | 요소 | — |
| `.chart__bar-value` | 요소 | — |
| `.chart__label` | 요소 | — |
| `.chart__labels` | 요소 | — |
| `.chart__area-fill` | 요소 | — |
| `.chart__line` | 요소 | — |
| `.chart__point` | 요소 | — |
| `.chart__line-svg` | 요소 | — |
| `.chart__pie-segment` | 요소 | — |
| `.chart__pie-svg` | 요소 | — |
| `.chart__doughnut-center` | 요소 | — |
| `.chart__doughnut-total` | 요소 | — |
| `.chart__doughnut-label` | 요소 | — |
| `.chart__legend` | 요소 | — |
| `.chart__legend-item` | 요소 | — |
| `.chart__legend-color` | 요소 | — |
| `.chart__legend-label` | 요소 | — |
| `.chart__tooltip` | 요소 | — |
| `.chart--horizontal-bar` | 변형 | — |
| `.chart--bar` | 변형 | — |

#### chart-wrapper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chart-wrapper` | 블록 | — |

#### datatable

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.datatable` | 블록 | — |
| `.datatable__header` | 요소 | — |
| `.datatable__search` | 요소 | — |
| `.datatable__actions` | 요소 | — |
| `.datatable__action-btn` | 요소 | — |
| `.datatable__container` | 요소 | — |
| `.datatable__table` | 요소 | — |
| `.datatable__thead` | 요소 | — |
| `.datatable__checkbox` | 요소 | — |
| `.datatable__select-all` | 요소 | — |
| `.datatable__sort` | 요소 | — |
| `.datatable__tbody` | 요소 | — |
| `.datatable__row-select` | 요소 | — |
| `.datatable__empty` | 요소 | — |
| `.datatable__empty-text` | 요소 | — |
| `.datatable__footer` | 요소 | — |
| `.datatable__per-page` | 요소 | — |
| `.datatable__info` | 요소 | — |
| `.datatable__pagination` | 요소 | — |
| `.datatable__page-btn` | 요소 | — |
| `.datatable--striped` | 변형 | — |
| `.datatable--bordered` | 변형 | — |
| `.datatable--compact` | 변형 | — |
| `.datatable--responsive` | 변형 | — |

#### drag-over

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.drag-over` | 블록 | — |

#### dragging

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dragging` | 블록 | — |

#### kanban

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.kanban` | 블록 | — |
| `.kanban__column` | 요소 | — |
| `.kanban__column-header` | 요소 | — |
| `.kanban__column-title-group` | 요소 | — |
| `.kanban__column-dot` | 요소 | — |
| `.kanban__column-title` | 요소 | — |
| `.kanban__column-count` | 요소 | — |
| `.kanban__column-menu-btn` | 요소 | — |
| `.kanban__cards` | 요소 | — |
| `.kanban__add-card` | 요소 | — |
| `.kanban__card` | 요소 | — |
| `.kanban__card-header` | 요소 | — |
| `.kanban__priority` | 요소 | — |
| `.kanban__card-delete` | 요소 | — |
| `.kanban__card-body` | 요소 | — |
| `.kanban__card-check` | 요소 | — |
| `.kanban__card-content` | 요소 | — |
| `.kanban__card-title` | 요소 | — |
| `.kanban__card-desc` | 요소 | — |
| `.kanban__card-tags` | 요소 | — |
| `.kanban__tag` | 요소 | — |
| `.kanban__card-footer` | 요소 | — |
| `.kanban__card-date` | 요소 | — |
| `.kanban__card-assignees` | 요소 | — |
| `.kanban__avatar` | 요소 | — |
| `.kanban__avatar--initial` | 요소 | — |
| `.kanban__avatar--more` | 요소 | — |
| `.kanban__card--done` | 요소 | — |
| `.kanban__column--over-wip` | 요소 | — |

#### masonry

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.masonry` | 블록 | — |
| `.masonry__item` | 요소 | — |
| `.masonry--animated` | 변형 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

### dropdown

> 소스: `src/modules/dropdown.js` | 클래스: **11개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |

#### dropdown

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dropdown` | 블록 | — |
| `.dropdown__divider` | 요소 | — |
| `.dropdown__header` | 요소 | — |
| `.dropdown__item` | 요소 | — |
| `.dropdown__item--disabled` | 요소 | — |
| `.dropdown__item--active` | 요소 | — |
| `.dropdown__item--danger` | 요소 | — |
| `.dropdown__item-icon` | 요소 | — |
| `.dropdown__item-text` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

### feedback

> 소스: `src/modules/feedback.js` | 클래스: **32개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |
| `.is-hiding` | 블록 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### notification

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.notification` | 블록 | — |
| `.notification__actions` | 요소 | — |
| `.notification__action` | 요소 | — |
| `.notification__icon` | 요소 | — |
| `.notification__content` | 요소 | — |
| `.notification__title` | 요소 | — |
| `.notification__message` | 요소 | — |
| `.notification__close` | 요소 | — |

#### notification-container

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.notification-container` | 블록 | — |

#### progress-tracker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.progress-tracker` | 블록 | — |
| `.progress-tracker__step` | 요소 | — |
| `.progress-tracker__indicator` | 요소 | — |
| `.progress-tracker__label` | 요소 | — |
| `.progress-tracker--vertical` | 변형 | — |

#### skeleton

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.skeleton` | 블록 | — |
| `.skeleton__body` | 요소 | — |
| `.skeleton__content` | 요소 | — |
| `.skeleton--avatar` | 변형 | — |
| `.skeleton--image` | 변형 | — |
| `.skeleton--card` | 변형 | — |
| `.skeleton--title` | 변형 | — |
| `.skeleton--text` | 변형 | — |
| `.skeleton--list-item` | 변형 | — |

#### skeleton-wrapper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.skeleton-wrapper` | 블록 | — |

#### toast

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.toast` | 블록 | — |
| `.toast__icon` | 요소 | — |
| `.toast__message` | 요소 | — |
| `.toast__close` | 요소 | — |

#### toast-container

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.toast-container` | 블록 | — |

### forms

> 소스: `src/modules/forms.js` | 클래스: **42개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-dragover` | 블록 | — |
| `.is-complete` | 블록 | — |
| `.is-filled` | 블록 | — |
| `.is-active` | 블록 | — |

#### active

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.active` | 블록 | — |

#### completed

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.completed` | 블록 | — |

#### file-upload

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.file-upload` | 블록 | — |
| `.file-upload__dropzone` | 요소 | — |
| `.file-upload__text` | 요소 | — |
| `.file-upload__hint` | 요소 | — |
| `.file-upload__input` | 요소 | — |
| `.file-upload__preview` | 요소 | — |
| `.file-upload__item` | 요소 | — |
| `.file-upload__progress` | 요소 | — |
| `.file-upload__progress-bar` | 요소 | — |
| `.file-upload__thumb` | 요소 | — |
| `.file-upload__info` | 요소 | — |
| `.file-upload__name` | 요소 | — |
| `.file-upload__size` | 요소 | — |
| `.file-upload__remove` | 요소 | — |
| `.file-upload__icon` | 요소 | — |

#### form-wizard

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.form-wizard` | 블록 | — |
| `.form-wizard__progress` | 요소 | — |
| `.form-wizard__step` | 요소 | — |
| `.form-wizard__step-number` | 요소 | — |
| `.form-wizard__step-title` | 요소 | — |
| `.form-wizard__content` | 요소 | — |
| `.form-wizard__panel` | 요소 | — |
| `.form-wizard__nav` | 요소 | — |
| `.form-wizard__btn` | 요소 | — |
| `.form-wizard__btn--prev` | 요소 | — |
| `.form-wizard__btn--next` | 요소 | — |
| `.form-wizard__btn--primary` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### rating

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.rating` | 블록 | — |
| `.rating__star` | 요소 | — |
| `.rating--readonly` | 변형 | — |

#### signature-pad

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.signature-pad` | 블록 | — |
| `.signature-pad__canvas` | 요소 | — |
| `.signature-pad__toolbar` | 요소 | — |
| `.signature-pad__btn` | 요소 | — |
| `.signature-pad__btn--primary` | 요소 | — |

### gantt

> 소스: `src/modules/gantt.js` | 클래스: **35개**

#### gantt

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.gantt` | 블록 | — |
| `.gantt__header` | 요소 | — |
| `.gantt__controls` | 요소 | — |
| `.gantt__view-buttons` | 요소 | — |
| `.gantt__view-btn` | 요소 | — |
| `.gantt__today-btn` | 요소 | — |
| `.gantt__body` | 요소 | — |
| `.gantt__sidebar` | 요소 | — |
| `.gantt__sidebar-header` | 요소 | — |
| `.gantt__sidebar-content` | 요소 | — |
| `.gantt__chart-wrapper` | 요소 | — |
| `.gantt__timeline` | 요소 | — |
| `.gantt__chart` | 요소 | — |
| `.gantt__timeline-cells` | 요소 | — |
| `.gantt__timeline-label` | 요소 | — |
| `.gantt__task-row` | 요소 | — |
| `.gantt__task-name` | 요소 | — |
| `.gantt__collapse-btn` | 요소 | — |
| `.gantt__task-bullet` | 요소 | — |
| `.gantt__task-title` | 요소 | — |
| `.gantt__task-assignee` | 요소 | — |
| `.gantt__bar-row` | 요소 | — |
| `.gantt__bar` | 요소 | — |
| `.gantt__bar-progress` | 요소 | — |
| `.gantt__bar-label` | 요소 | — |
| `.gantt__bar-handle` | 요소 | — |
| `.gantt__bar-handle--left` | 요소 | — |
| `.gantt__bar-handle--right` | 요소 | — |
| `.gantt__grid-cell` | 요소 | — |
| `.gantt__today-line` | 요소 | — |
| `.gantt__today-marker` | 요소 | — |
| `.gantt__dependencies` | 요소 | — |
| `.gantt__dependency-line` | 요소 | — |
| `.gantt__bar--dragging` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

### imagelist

> 소스: `src/modules/imagelist.js` | 클래스: **36개**

#### active

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.active` | 블록 | — |

#### image-compare

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.image-compare` | 블록 | — |
| `.image-compare__after` | 요소 | — |
| `.image-compare__label` | 요소 | — |
| `.image-compare__label--after` | 요소 | — |
| `.image-compare__before` | 요소 | — |
| `.image-compare__label--before` | 요소 | — |
| `.image-compare__handle` | 요소 | — |
| `.image-compare__handle-icon` | 요소 | — |

#### image-list

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.image-list` | 블록 | — |
| `.image-list__item` | 요소 | — |
| `.image-list__img` | 요소 | — |
| `.image-list__overlay` | 요소 | — |
| `.image-list__title` | 요소 | — |

#### lazy

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lazy` | 블록 | — |

#### lazy-error

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lazy-error` | 블록 | — |

#### lazy-loaded

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lazy-loaded` | 블록 | — |

#### lightbox

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.lightbox` | 블록 | — |
| `.lightbox__header` | 요소 | — |
| `.lightbox__counter` | 요소 | — |
| `.lightbox__actions` | 요소 | — |
| `.lightbox__btn` | 요소 | — |
| `.lightbox__main` | 요소 | — |
| `.lightbox__nav` | 요소 | — |
| `.lightbox__nav--prev` | 요소 | — |
| `.lightbox__content` | 요소 | — |
| `.lightbox__img` | 요소 | — |
| `.lightbox__loading` | 요소 | — |
| `.lightbox__nav--next` | 요소 | — |
| `.lightbox__thumbnails` | 요소 | — |
| `.lightbox__thumb` | 요소 | — |
| `.lightbox__caption` | 요소 | — |

#### loaded

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.loaded` | 블록 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.spinner` | 블록 | — |

#### zoomed

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.zoomed` | 블록 | — |

### live-status

> 소스: `src/modules/live-status.js` | 클래스: **15개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |

#### activity-status

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.activity-status` | 블록 | — |

#### connection-status

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.connection-status` | 블록 | — |
| `.connection-status--online` | 변형 | — |
| `.connection-status--offline` | 변형 | — |

#### live-counter

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.live-counter` | 블록 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### online-status

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.online-status` | 블록 | — |
| `.online-status__label` | 요소 | — |
| `.online-status--pulse` | 변형 | — |

#### online-status-wrapper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.online-status-wrapper` | 블록 | — |

#### typing-indicator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.typing-indicator` | 블록 | — |
| `.typing-indicator__dots` | 요소 | — |
| `.typing-indicator__dot` | 요소 | — |
| `.typing-indicator__text` | 요소 | — |

### media-viewer

> 소스: `src/modules/media-viewer.js` | 클래스: **61개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-playing` | 블록 | — |
| `.is-visible` | 블록 | — |

#### audio-player

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.audio-player` | 블록 | — |
| `.audio-player__cover` | 요소 | — |
| `.audio-player__info` | 요소 | — |
| `.audio-player__title` | 요소 | — |
| `.audio-player__artist` | 요소 | — |
| `.audio-player__controls` | 요소 | — |
| `.audio-player__progress` | 요소 | — |
| `.audio-player__time` | 요소 | — |
| `.audio-player__current` | 요소 | — |
| `.audio-player__progress-bar` | 요소 | — |
| `.audio-player__progress-fill` | 요소 | — |
| `.audio-player__duration` | 요소 | — |
| `.audio-player__buttons` | 요소 | — |
| `.audio-player__btn` | 요소 | — |
| `.audio-player__btn--prev` | 요소 | — |
| `.audio-player__btn--play` | 요소 | — |
| `.audio-player__btn--next` | 요소 | — |
| `.audio-player__volume` | 요소 | — |
| `.audio-player__btn--volume` | 요소 | — |
| `.audio-player__volume-slider` | 요소 | — |

#### controls-hidden

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.controls-hidden` | 블록 | — |

#### image-viewer

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.image-viewer` | 블록 | — |
| `.image-viewer__wrapper` | 요소 | — |
| `.image-viewer__image` | 요소 | — |
| `.image-viewer__toolbar` | 요소 | — |
| `.image-viewer__btn` | 요소 | — |
| `.image-viewer__zoom-level` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### ratio

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.ratio` | 블록 | — |

#### video-player

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.video-player` | 블록 | — |
| `.video-player__wrapper` | 요소 | — |
| `.video-player__video` | 요소 | — |
| `.video-player__overlay` | 요소 | — |
| `.video-player__big-play` | 요소 | — |
| `.video-player__loading` | 요소 | — |
| `.video-player__spinner` | 요소 | — |
| `.video-player__controls` | 요소 | — |
| `.video-player__progress` | 요소 | — |
| `.video-player__progress-bar` | 요소 | — |
| `.video-player__progress-buffered` | 요소 | — |
| `.video-player__progress-played` | 요소 | — |
| `.video-player__progress-handle` | 요소 | — |
| `.video-player__controls-bar` | 요소 | — |
| `.video-player__controls-left` | 요소 | — |
| `.video-player__btn` | 요소 | — |
| `.video-player__btn--play` | 요소 | — |
| `.video-player__volume` | 요소 | — |
| `.video-player__btn--volume` | 요소 | — |
| `.video-player__volume-slider` | 요소 | — |
| `.video-player__volume-input` | 요소 | — |
| `.video-player__time` | 요소 | — |
| `.video-player__current` | 요소 | — |
| `.video-player__separator` | 요소 | — |
| `.video-player__duration` | 요소 | — |
| `.video-player__controls-right` | 요소 | — |
| `.video-player__speed` | 요소 | — |
| `.video-player__btn--speed` | 요소 | — |
| `.video-player__btn--pip` | 요소 | — |
| `.video-player__btn--fullscreen` | 요소 | — |

### navigation

> 소스: `src/modules/navigation.js` | 클래스: **35개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-active` | 블록 | — |
| `.is-open` | 블록 | — |
| `.has-submenu` | 블록 | — |
| `.is-active-parent` | 블록 | — |

#### accordion

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.accordion__trigger` | 블록 | — |
| `.accordion__trigger-icon` | 블록 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### megamenu

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.megamenu__item--active` | 블록 | — |

#### sidebar

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.sidebar` | 블록 | — |
| `.sidebar__logo` | 요소 | — |
| `.sidebar__logo-text` | 요소 | — |
| `.sidebar__user` | 요소 | — |
| `.sidebar__user-avatar` | 요소 | — |
| `.sidebar__user-avatar--initial` | 요소 | — |
| `.sidebar__user-info` | 요소 | — |
| `.sidebar__user-name` | 요소 | — |
| `.sidebar__user-role` | 요소 | — |
| `.sidebar__toggle` | 요소 | — |
| `.sidebar__nav` | 요소 | — |
| `.sidebar__menu` | 요소 | — |
| `.sidebar__menu-title` | 요소 | — |
| `.sidebar__menu-item` | 요소 | — |
| `.sidebar__menu-link` | 요소 | — |
| `.sidebar__menu-icon` | 요소 | — |
| `.sidebar__menu-text` | 요소 | — |
| `.sidebar__badge` | 요소 | — |
| `.sidebar__menu-arrow` | 요소 | — |
| `.sidebar__submenu` | 요소 | — |

#### tabs

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.tabs` | 블록 | — |
| `.tabs__list` | 요소 | — |
| `.tabs__tab` | 요소 | — |
| `.tabs__panel` | 요소 | — |
| `.tabs__content` | 요소 | — |

#### treeview

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.treeview__item--expanded` | 블록 | — |
| `.treeview__label--selected` | 블록 | — |

### overlays

> 소스: `src/modules/overlays.js` | 클래스: **3개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### offcanvas

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.offcanvas` | 블록 | — |

### pagination

> 소스: `src/modules/pagination.js` | 클래스: **19개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-disabled` | 블록 | — |
| `.is-active` | 블록 | — |

#### data-paginator

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.data-paginator` | 블록 | — |
| `.data-paginator__content` | 요소 | — |
| `.data-paginator__pagination` | 요소 | — |
| `.data-paginator__empty` | 요소 | — |
| `.data-paginator__item` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### pagination

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination` | 블록 | — |
| `.pagination__item` | 요소 | — |
| `.pagination__link` | 요소 | — |
| `.pagination__item--dots` | 요소 | — |

#### pagination-info

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-info` | 블록 | — |

#### pagination-lg

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-lg` | 블록 | — |

#### pagination-rounded

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-rounded` | 블록 | — |

#### pagination-sm

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-sm` | 블록 | — |

#### pagination-wrapper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pagination-wrapper` | 블록 | — |
| `.pagination-wrapper--center` | 변형 | — |
| `.pagination-wrapper--end` | 변형 | — |

### pickers

> 소스: `src/modules/pickers.js` | 클래스: **44개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |
| `.is-selected` | 블록 | — |

#### colorpicker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.colorpicker` | 블록 | — |
| `.colorpicker__input` | 요소 | — |
| `.colorpicker__preview` | 요소 | — |
| `.colorpicker__dropdown` | 요소 | — |
| `.colorpicker__presets` | 요소 | — |
| `.colorpicker__preset` | 요소 | — |
| `.colorpicker__custom` | 요소 | — |
| `.colorpicker__native` | 요소 | — |

#### countdown

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.countdown` | 블록 | — |
| `.countdown__item` | 요소 | — |
| `.countdown__value` | 요소 | — |
| `.countdown__label` | 요소 | — |
| `.countdown__sep` | 요소 | — |
| `.countdown--complete` | 변형 | — |

#### datepicker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.datepicker` | 블록 | — |
| `.datepicker__input` | 요소 | — |
| `.datepicker__icon` | 요소 | — |
| `.datepicker__dropdown` | 요소 | — |
| `.datepicker__header` | 요소 | — |
| `.datepicker__nav-btn` | 요소 | — |
| `.datepicker__title` | 요소 | — |
| `.datepicker__year` | 요소 | — |
| `.datepicker__month` | 요소 | — |
| `.datepicker__weekdays` | 요소 | — |
| `.datepicker__weekday` | 요소 | — |
| `.datepicker__days` | 요소 | — |
| `.datepicker__footer` | 요소 | — |
| `.datepicker__today-btn` | 요소 | — |
| `.datepicker__years` | 요소 | — |
| `.datepicker__months` | 요소 | — |
| `.datepicker__day` | 요소 | — |
| `.datepicker__day--empty` | 요소 | — |

#### dday

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.dday` | 블록 | — |
| `.dday__title` | 요소 | — |
| `.dday__date` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### timepicker

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.timepicker` | 블록 | — |
| `.timepicker__input` | 요소 | — |
| `.timepicker__icon` | 요소 | — |
| `.timepicker__dropdown` | 요소 | — |
| `.timepicker__list` | 요소 | — |
| `.timepicker__option` | 요소 | — |

### scroll

> 소스: `src/modules/scroll.js` | 클래스: **17개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |

#### back-to-top

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.back-to-top` | 블록 | — |

#### infinite-scroll

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.infinite-scroll` | 블록 | — |
| `.infinite-scroll__loading` | 요소 | — |
| `.infinite-scroll__end` | 요소 | — |
| `.infinite-scroll__error` | 요소 | — |
| `.infinite-scroll__retry` | 요소 | — |
| `.infinite-scroll__items` | 요소 | — |
| `.infinite-scroll__sentinel` | 요소 | — |
| `.infinite-scroll__status` | 요소 | — |
| `.infinite-scroll__item` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### spinner

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.spinner` | 블록 | — |

#### virtual-scroll

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.virtual-scroll` | 블록 | — |
| `.virtual-scroll__spacer` | 요소 | — |
| `.virtual-scroll__content` | 요소 | — |
| `.virtual-scroll__item` | 요소 | — |

### security-input

> 소스: `src/modules/security-input.js` | 클래스: **25개**

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### otp-input

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.otp-input` | 블록 | — |
| `.otp-input__fields` | 요소 | — |
| `.otp-input__separator` | 요소 | — |
| `.otp-input__field` | 요소 | — |
| `.otp-input__error` | 요소 | — |
| `.otp-input--error` | 변형 | — |
| `.otp-input--disabled` | 변형 | — |
| `.otp-input--success` | 변형 | — |

#### pin-input

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.pin-input` | 블록 | — |
| `.pin-input__wrapper` | 요소 | — |
| `.pin-input__fields` | 요소 | — |
| `.pin-input__field-wrapper` | 요소 | — |
| `.pin-input__field` | 요소 | — |
| `.pin-input__dot` | 요소 | — |
| `.pin-input__toggle` | 요소 | — |
| `.pin-input__error` | 요소 | — |
| `.pin-input__keypad` | 요소 | — |
| `.pin-input__key` | 요소 | — |
| `.pin-input__key--empty` | 요소 | — |
| `.pin-input__key--backspace` | 요소 | — |
| `.pin-input__dot--hidden` | 요소 | — |
| `.pin-input--error` | 변형 | — |
| `.pin-input--disabled` | 변형 | — |
| `.pin-input--success` | 변형 | — |

### selectors

> 소스: `src/modules/selectors.js` | 클래스: **28개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-loading` | 블록 | — |
| `.is-selected` | 블록 | — |
| `.is-visible` | 블록 | — |
| `.is-dragging` | 블록 | — |

#### autocomplete

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.autocomplete` | 블록 | — |
| `.autocomplete__input` | 요소 | — |
| `.autocomplete__dropdown` | 요소 | — |
| `.autocomplete__no-results` | 요소 | — |
| `.autocomplete__item` | 요소 | — |

#### multiselect

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.multiselect` | 블록 | — |
| `.multiselect__tags` | 요소 | — |
| `.multiselect__dropdown` | 요소 | — |
| `.multiselect__tag` | 요소 | — |
| `.multiselect__tag-remove` | 요소 | — |
| `.multiselect__input` | 요소 | — |
| `.multiselect__option` | 요소 | — |
| `.multiselect__option--create` | 요소 | — |
| `.multiselect__no-options` | 요소 | — |

#### range-slider

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.range-slider` | 블록 | — |
| `.range-slider__track` | 요소 | — |
| `.range-slider__fill` | 요소 | — |
| `.range-slider__handle` | 요소 | — |
| `.range-slider__handle--min` | 요소 | — |
| `.range-slider__tooltip` | 요소 | — |
| `.range-slider__handle--max` | 요소 | — |
| `.range-slider__labels` | 요소 | — |
| `.range-slider__label--min` | 요소 | — |
| `.range-slider__label--max` | 요소 | — |

### social

> 소스: `src/modules/social.js` | 클래스: **78개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |
| `.is-copied` | 블록 | — |

#### btn

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn` | 블록 | — |
| `.btn--primary` | 변형 | — |
| `.btn--sm` | 변형 | — |
| `.btn--outline-secondary` | 변형 | — |

#### chat-ui

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.chat-ui` | 블록 | — |
| `.chat-ui__messages` | 요소 | — |
| `.chat-ui__typing` | 요소 | — |
| `.chat-ui__input-area` | 요소 | — |
| `.chat-ui__btn` | 요소 | — |
| `.chat-ui__btn--attach` | 요소 | — |
| `.chat-ui__input-wrapper` | 요소 | — |
| `.chat-ui__input` | 요소 | — |
| `.chat-ui__btn--emoji` | 요소 | — |
| `.chat-ui__btn--send` | 요소 | — |
| `.chat-ui__date-divider` | 요소 | — |
| `.chat-ui__message` | 요소 | — |
| `.chat-ui__avatar` | 요소 | — |
| `.chat-ui__bubble` | 요소 | — |
| `.chat-ui__sender` | 요소 | — |
| `.chat-ui__text` | 요소 | — |
| `.chat-ui__time` | 요소 | — |
| `.chat-ui__typing-indicator` | 요소 | — |
| `.chat-ui__typing-dot` | 요소 | — |

#### comments

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.comments` | 블록 | — |
| `.comments__header` | 요소 | — |
| `.comments__title` | 요소 | — |
| `.comments__count` | 요소 | — |
| `.comments__form` | 요소 | — |
| `.comments__form--main` | 요소 | — |
| `.comments__avatar` | 요소 | — |
| `.comments__input-area` | 요소 | — |
| `.comments__input` | 요소 | — |
| `.comments__form-actions` | 요소 | — |
| `.comments__submit` | 요소 | — |
| `.comments__list` | 요소 | — |
| `.comments__replies` | 요소 | — |
| `.comments__item` | 요소 | — |
| `.comments__content` | 요소 | — |
| `.comments__meta` | 요소 | — |
| `.comments__author` | 요소 | — |
| `.comments__date` | 요소 | — |
| `.comments__edited` | 요소 | — |
| `.comments__text` | 요소 | — |
| `.comments__actions` | 요소 | — |
| `.comments__action` | 요소 | — |
| `.comments__action--like` | 요소 | — |
| `.comments__reply-form` | 요소 | — |
| `.comments__input--reply` | 요소 | — |
| `.comments__cancel` | 요소 | — |
| `.comments__reply-submit` | 요소 | — |

#### feed-post

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.feed-post` | 블록 | — |
| `.feed-post__compose` | 요소 | — |
| `.feed-post__compose-actions` | 요소 | — |
| `.feed-post__compose-tools` | 요소 | — |
| `.feed-post__compose-tool` | 요소 | — |
| `.feed-post__submit` | 요소 | — |
| `.feed-post__images` | 요소 | — |
| `.feed-post__actions` | 요소 | — |
| `.feed-post__action-btn` | 요소 | — |
| `.feed-post__header` | 요소 | — |
| `.feed-post__avatar` | 요소 | — |
| `.feed-post__user-info` | 요소 | — |
| `.feed-post__user-name` | 요소 | — |
| `.feed-post__time` | 요소 | — |
| `.feed-post__body` | 요소 | — |
| `.feed-post__text` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### reactions

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.reactions` | 블록 | — |
| `.reactions__btn` | 요소 | — |
| `.reactions__emoji` | 요소 | — |
| `.reactions__count` | 요소 | — |

#### share-buttons

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.share-buttons` | 블록 | — |
| `.share-buttons__btn` | 요소 | — |
| `.share-buttons__icon-text` | 요소 | — |
| `.share-buttons__label` | 요소 | — |

#### social-feed

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.social-feed` | 블록 | — |

### stepper

> 소스: `src/modules/stepper.js` | 클래스: **36개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-active` | 블록 | — |
| `.is-completed` | 블록 | — |
| `.is-disabled` | 블록 | — |
| `.is-changing` | 블록 | — |

#### btn

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.btn` | 블록 | — |
| `.btn--outline-secondary` | 변형 | — |
| `.btn--primary` | 변형 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### stepper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.stepper` | 블록 | — |
| `.stepper__steps` | 요소 | — |
| `.stepper__content` | 요소 | — |
| `.stepper__step` | 요소 | — |
| `.stepper__indicator` | 요소 | — |
| `.stepper__number` | 요소 | — |
| `.stepper__check` | 요소 | — |
| `.stepper__connector` | 요소 | — |
| `.stepper__connector-line` | 요소 | — |
| `.stepper__label` | 요소 | — |
| `.stepper__title` | 요소 | — |
| `.stepper__subtitle` | 요소 | — |
| `.stepper__panel` | 요소 | — |
| `.stepper--clickable` | 변형 | — |

#### vertical-stepper

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.vertical-stepper` | 블록 | — |
| `.vertical-stepper__item` | 요소 | — |
| `.vertical-stepper__header` | 요소 | — |
| `.vertical-stepper__indicator` | 요소 | — |
| `.vertical-stepper__number` | 요소 | — |
| `.vertical-stepper__check` | 요소 | — |
| `.vertical-stepper__label` | 요소 | — |
| `.vertical-stepper__title` | 요소 | — |
| `.vertical-stepper__subtitle` | 요소 | — |
| `.vertical-stepper__edit` | 요소 | — |
| `.vertical-stepper__connector` | 요소 | — |
| `.vertical-stepper__content` | 요소 | — |
| `.vertical-stepper__body` | 요소 | — |
| `.vertical-stepper__actions` | 요소 | — |

### text-editors

> 소스: `src/modules/text-editors.js` | 클래스: **29개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-focused` | 블록 | — |
| `.is-active` | 블록 | — |
| `.is-over` | 블록 | — |

#### markdown-content

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.markdown-content` | 블록 | — |

#### markdown-editor

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.markdown-editor` | 블록 | — |
| `.markdown-editor__toolbar` | 요소 | — |
| `.markdown-editor__tabs` | 요소 | — |
| `.markdown-editor__tab` | 요소 | — |
| `.markdown-editor__body` | 요소 | — |
| `.markdown-editor__input` | 요소 | — |
| `.markdown-editor__preview` | 요소 | — |
| `.markdown-editor__pane` | 요소 | — |
| `.markdown-editor__pane--edit` | 요소 | — |
| `.markdown-editor__pane--preview` | 요소 | — |
| `.markdown-editor__separator` | 요소 | — |
| `.markdown-editor__btn` | 요소 | — |

#### material-icons-outlined

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.material-icons-outlined` | 블록 | — |

#### rich-text-editor

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.rich-text-editor` | 블록 | — |
| `.rich-text-editor__toolbar` | 요소 | — |
| `.rich-text-editor__content` | 요소 | — |
| `.rich-text-editor__separator` | 요소 | — |
| `.rich-text-editor__btn` | 요소 | — |

#### task-item

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.task-item` | 블록 | — |

#### textarea-autosize

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.textarea-autosize` | 블록 | — |
| `.textarea-autosize__input` | 요소 | — |
| `.textarea-autosize__toolbar` | 요소 | — |
| `.textarea-autosize__footer` | 요소 | — |
| `.textarea-autosize__separator` | 요소 | — |
| `.textarea-autosize__btn` | 요소 | — |

### theme

> 소스: `src/modules/theme.js` | 클래스: **3개**

#### imcat-theme-transition-overlay

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.imcat-theme-transition-overlay` | 블록 | — |

#### theme-dark

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.theme-dark` | 블록 | — |

#### theme-light

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.theme-light` | 블록 | — |

### tooltips

> 소스: `src/modules/tooltips.js` | 클래스: **20개**

#### 공통 상태 클래스

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.is-visible` | 블록 | — |

#### popover

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.popover` | 블록 | — |
| `.popover__arrow` | 요소 | — |
| `.popover__header` | 요소 | — |
| `.popover__title` | 요소 | — |
| `.popover__close` | 요소 | — |
| `.popover__body` | 요소 | — |
| `.popover--animated` | 변형 | — |
| `.popover--top` | 변형 | — |
| `.popover--bottom` | 변형 | — |
| `.popover--left` | 변형 | — |
| `.popover--right` | 변형 | — |

#### tooltip

| 클래스 | 유형 | 설명 |
| --- | --- | --- |
| `.tooltip` | 블록 | — |
| `.tooltip__arrow` | 요소 | — |
| `.tooltip__content` | 요소 | — |
| `.tooltip--animated` | 변형 | — |
| `.tooltip--top` | 변형 | — |
| `.tooltip--bottom` | 변형 | — |
| `.tooltip--left` | 변형 | — |
| `.tooltip--right` | 변형 | — |

---

## 통계

| 항목 | 수 |
| --- | --- |
| **전체 클래스** | 2462개 |
| 아이콘 (Material Icons) | 20개 |
| 베이스 (Base) | 435개 |
| 컴포넌트 (Components) | 338개 |
| 모듈 (Modules) | 909개 |
| JS 코어 모듈 (Core) | 11개 |
| JS 확장 모듈 (Modules) | 749개 |

> 빌드된 `dist/imcat-ui.css`에서 추출된 고유 클래스: **851개**
