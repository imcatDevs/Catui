# 모듈 CSS & 데모 상세 감사 리포트

> 감사일: 2026-03-14  
> 대상: 22개 확장 모듈 (JS / SCSS / 데모 HTML)

---

## 1. 전체 현황 요약

| 항목 | 수량 | 상태 |
| --- | --- | --- |
| JS 모듈 (`src/modules/`) | 22개 | ✅ |
| SCSS 파일 (`src/styles/modules/`) | 22개 | ⚠️ 불일치 있음 |
| 데모 HTML (`examples/views/03-modules/`) | 22개 | ⚠️ 누락 있음 |

**JS ↔ SCSS ↔ 데모 1:1:1 파일 매칭은 완벽하지만, 내부 컴포넌트 수준에서 불일치가 존재합니다.**

---

## 2. CSS 클래스 배치 불일치 (🔴 심각)

### 2-1. `_advanced-ui.scss` — 다른 모듈 CSS가 혼입됨

`advanced-ui.js`가 export하는 컴포넌트:

- SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker

`_advanced-ui.scss`에 실제 정의된 클래스:

- `.kanban` → **data-viz.js의 Kanban에 해당** ❌ 잘못된 위치
- `.qrcode` → ✅ QRCode
- `.image-compare` → **imagelist.js의 ImageCompare에 해당** ❌ 잘못된 위치
- `.gantt` → **gantt.js의 Gantt에 해당** ❌ 잘못된 위치

**누락된 CSS**:

- `.split-pane` — SplitPane용 스타일 없음
- `.code-block` — CodeBlock용 스타일 없음
- `.copy-clipboard` — CopyToClipboard용 스타일 없음
- `.simple-colorpicker` — SimpleColorPicker용 스타일 없음

### 2-2. `_data-viz.scss` — Masonry, Kanban, Calendar CSS 누락

`data-viz.js`가 export하는 컴포넌트:

- DataTable, Chart, Masonry, Kanban, Calendar

`_data-viz.scss`에 정의된 클래스:

- `.chart` → ✅ Chart
- `.datatable` → ✅ DataTable
- `.masonry` → ❌ **누락** (JS는 인라인 스타일로 처리 가능하나 SCSS 미정의)
- `.kanban` → ❌ **`_advanced-ui.scss`에 잘못 배치됨**
- `.calendar` → ❌ **누락**

### 2-3. `_imagelist.scss` — ImageCompare, Lightbox CSS 누락

`imagelist.js`가 export하는 컴포넌트:

- ImageList, ImageLightbox, ImageCompare, LazyImage

`_imagelist.scss`에 정의된 클래스:

- `.imagelist` → ✅ ImageList
- `.image-compare` → ❌ **`_advanced-ui.scss`에 잘못 배치됨**
- `.lightbox` → ❌ **`_carousel.scss`에 정의됨** (carousel.js의 Lightbox와 공유)
- `.lazy-image` → ❌ **누락** (JS가 인라인 처리 가능)

### 2-4. `_gantt.scss` — 클래스명 불일치

- `_gantt.scss`는 `.gantt-simple` 클래스를 정의
- `gantt.js`의 JS는 `.gantt__*` 클래스를 사용 (주석: "고급 간트는 `_advanced-ui.scss`에 정의")
- `.gantt` 클래스가 `_advanced-ui.scss`에 있어 **autoLoadModuleCSS: true** 시 `gantt.css`만 로드하면 스타일 누락

### 2-5. `_feedback.scss` — ProgressTracker, Skeleton CSS 누락

`feedback.js`가 export하는 컴포넌트:

- Toast, Notification, ProgressTracker, Skeleton

`_feedback.scss`에 정의된 클래스:

- `.toast` / `.toast-container` → ✅
- `.notification` / `.notification-container` → ✅
- `.progress-tracker` → ❌ **누락**
- `.skeleton` → ❌ **누락**

---

## 3. 데모 컴포넌트 커버리지

### ✅ 완전 커버 (모든 export 컴포넌트에 데모 존재)

| 모듈 | 컴포넌트 | 데모 |
| --- | --- | --- |
| **carousel** | Carousel, Lightbox | Carousel 4종 데모 (기본/Fade/멀티/썸네일) |
| **dropdown** | Dropdown | 3종 (기본/Hover+위치/Context Menu) |
| **feedback** | Toast, Notification, ProgressTracker, Skeleton | 4종 모두 데모 |
| **forms** | FileUpload, Rating, SignaturePad, FormWizard | 4종 모두 데모 |
| **live-status** | OnlineStatus, TypingIndicator, LiveCounter, ConnectionStatus | 4종 데모 |
| **media-viewer** | VideoPlayer, AudioPlayer, ImageViewer | 3종 모두 데모 |
| **overlays** | Modal, Drawer, Offcanvas, Lightbox | 4종 + 이벤트 문서 |
| **pickers** | DatePicker, TimePicker, ColorPicker, Countdown | 4종 모두 데모 |
| **scroll** | VirtualScroll, Scrollspy, InfiniteScroll, BackToTop | 4종 (InfiniteScroll/Scrollspy는 코드만) |
| **security-input** | OTPInput, PinInput | 2종 모두 데모 |
| **selectors** | Autocomplete, MultiSelect, RangeSlider | 3종 모두 데모 |
| **social** | ChatUI, Comments, ShareButtons, Reactions | 4종 모두 데모 |
| **stepper** | Stepper, VerticalStepper | 2종 모두 데모 |
| **text-editors** | RichTextEditor, MarkdownEditor, TextareaAutosize | 3종 모두 데모 |
| **theme** | Theme | 2종 (자동/수동 전환) |
| **tooltips** | Tooltip, Popover | 3종 (방향/HTML+트리거/Popover) |
| **gantt** | Gantt | 1종 기본 데모 |

### ⚠️ 부분 커버

| 모듈 | 누락 컴포넌트 | 상세 |
| --- | --- | --- |
| **advanced-ui** | SimpleColorPicker | QRCode, SplitPane, CodeBlock, CopyToClipboard는 있으나 **SimpleColorPicker 데모 없음** |
| **data-viz** | Masonry | DataTable, Chart, Kanban, Calendar는 있으나 **Masonry 데모 없음** |
| **imagelist** | ImageLightbox | ImageList, ImageCompare는 있으나 **ImageLightbox(단독) 데모 없음** (ImageList의 lightbox 옵션으로만 사용) |
| **live-status** | ActivityStatus | OnlineStatus, TypingIndicator, LiveCounter, ConnectionStatus는 있으나 **ActivityStatus 데모 없음** |
| **navigation** | MegaMenu | Tabs, Accordion, Collapse, TreeView는 있으나 **MegaMenu 데모 없음** |
| **pagination** | — | Pagination, DataPaginator 데모 있음. 다만 `DataPaginator`는 JS module export에 없음 (pagination.js 내부 확인 필요) |
| **pickers** | DDay | DatePicker, TimePicker, ColorPicker, Countdown 데모만 있고 **DDay 데모 없음** |
| **scroll** | SmoothScroll | VirtualScroll, InfiniteScroll, Scrollspy, BackToTop만 있고 **SmoothScroll 데모 없음** |

---

## 4. CSS 네이밍 일관성 점검

### BEM 준수 현황

모든 SCSS가 **BEM(Block__Element--Modifier)** 패턴을 따르고 있으나 약간의 변형이 존재:

| 패턴 | 사용처 | 평가 |
| --- | --- | --- |
| `.block__element--modifier` | 대부분의 모듈 | ✅ 표준 BEM |
| `.block__element.is-state` | Carousel, Dropdown, Toast 등 | ✅ 상태 클래스 분리 (좋은 패턴) |
| `.block--variant` | Toast, Notification, Carousel | ✅ |
| `&-suffix` (대시 연결) | `.dropdown__item-icon`, `.dropdown__item-label` | ⚠️ BEM에서는 `__`가 표준이나 일관성 있게 사용 중 |

### 변수 사용

- 대부분의 SCSS가 `@use '../abstracts/variables' as *` 사용 ✅
- 디자인 토큰 변수(`$component-*`)와 CSS 커스텀 프로퍼티(`var(--xxx, $fallback)`) 이중 폴백 사용 ✅
- `_gantt.scss`만 하드코딩 값 사용 (예: `#e5e7eb`, `#f9fafb`) ⚠️ 변수 미사용

---

## 5. 데모 품질 점검

### 구조 일관성 ✅

모든 데모 HTML이 동일한 구조를 따름:
1. `.page-title-box` — 브레드크럼 + 타이틀
2. `.doc-layout` > `.doc-main` + `.doc-toc` — 2컬럼 레이아웃
3. `.demo-card` — 각 컴포넌트별 데모 카드 (헤더/바디/코드)
4. `<script>` — 하단 초기화 코드

### 코드 예시 품질

| 평가 | 상세 |
| --- | --- |
| ✅ 양호 | 모든 데모에 인라인 코드 예시 + 실행 가능한 script 포함 |
| ✅ 양호 | `IMCAT.use()` 패턴 일관성 있게 사용 |
| ⚠️ 개선 | `scroll.html`의 InfiniteScroll, Scrollspy는 코드 예시만 있고 **라이브 데모 없음** |
| ⚠️ 개선 | `imagelist.html`의 LazyImage는 코드 예시만 있고 **라이브 데모 없음** |

### 외부 리소스 의존

- 이미지: `picsum.photos` 외부 서비스 사용 (오프라인 시 데모 깨짐)
- 비디오/오디오: `w3schools.com` 외부 리소스 사용
- 권장: `examples/assets/` 내 로컬 리소스 활용 또는 placeholder 대체

---

## 6. 우선순위별 수정 제안

### 🔴 즉시 수정 (CSS 배치 오류)

| ID | 내용 | 영향 |
| --- | --- | --- |
| **CSS-1** | `.kanban` 스타일을 `_advanced-ui.scss` → `_data-viz.scss`로 이동 | Kanban autoLoadModuleCSS 시 스타일 누락 |
| **CSS-2** | `.image-compare` 스타일을 `_advanced-ui.scss` → `_imagelist.scss`로 이동 | ImageCompare 스타일 누락 |
| **CSS-3** | `.gantt` 스타일을 `_advanced-ui.scss` → `_gantt.scss`로 이동 (`.gantt-simple` 통합 또는 병존) | Gantt autoLoadModuleCSS 시 스타일 누락 |

### 🟡 단기 수정 (CSS 누락)

| ID | 내용 |
| --- | --- |
| **CSS-4** | `_advanced-ui.scss`에 SplitPane, CodeBlock, CopyToClipboard, SimpleColorPicker CSS 추가 |
| **CSS-5** | `_data-viz.scss`에 Calendar CSS 추가 |
| **CSS-6** | `_feedback.scss`에 ProgressTracker, Skeleton CSS 추가 |
| **CSS-7** | `_gantt.scss` 하드코딩 값을 디자인 토큰 변수로 교체 |

### 🟢 장기 개선 (데모 보완)

| ID | 내용 |
| --- | --- |
| **DEMO-1** | advanced-ui.html에 SimpleColorPicker 데모 추가 |
| **DEMO-2** | data-viz.html에 Masonry 데모 추가 |
| **DEMO-3** | navigation.html에 MegaMenu 데모 추가 |
| **DEMO-4** | pickers.html에 DDay 데모 추가 |
| **DEMO-5** | live-status.html에 ActivityStatus 데모 추가 |
| **DEMO-6** | scroll.html에 SmoothScroll 데모 추가 + InfiniteScroll/Scrollspy 라이브 데모 추가 |
| **DEMO-7** | imagelist.html에 LazyImage 라이브 데모 + ImageLightbox 단독 데모 추가 |
| **DEMO-8** | 외부 이미지(picsum.photos) 의존을 로컬 에셋으로 대체 검토 |

---

## 7. 모듈별 상세 매트릭스

| 모듈 | JS 컴포넌트 | SCSS 루트 클래스 | 데모 커버 | CSS 정합성 |
| --- | --- | --- | --- | --- |
| advanced-ui | SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker (5) | `.kanban`❌ `.qrcode`✅ `.image-compare`❌ `.gantt`❌ | 4/5 (SimpleColorPicker 누락) | 🔴 3개 오배치 + 4개 누락 |
| carousel | Carousel, Lightbox (2) | `.carousel`✅ `.lightbox`✅ `.gallery`✅ | 2/2 | ✅ |
| data-viz | DataTable, Chart, Masonry, Kanban, Calendar (5) | `.chart`✅ `.datatable`✅ | 4/5 (Masonry 누락) | 🔴 Kanban/Calendar/Masonry 누락 |
| dropdown | Dropdown (1) | `.dropdown`✅ `.context-menu`✅ | 1/1 | ✅ |
| feedback | Toast, Notification, ProgressTracker, Skeleton (4) | `.toast`✅ `.notification`✅ | 4/4 | 🟡 ProgressTracker/Skeleton 누락 |
| forms | FileUpload, Rating, SignaturePad, FormWizard (4) | `.file-upload`✅ `.rating`✅ `.switch` | 4/4 | 🟡 SignaturePad/FormWizard 누락 |
| gantt | Gantt (1) | `.gantt-simple` (`.gantt`는 advanced-ui에) | 1/1 | 🔴 클래스명 불일치 |
| imagelist | ImageList, ImageLightbox, ImageCompare, LazyImage (4) | `.imagelist`✅ | 3/4 (ImageLightbox 단독 누락) | 🔴 ImageCompare/Lightbox 타 모듈 |
| live-status | OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus (5) | `.progress`✅ `.progress-circle`✅ `.skeleton`✅ `.spinner`✅ `.loading-dots`✅ | 4/5 (ActivityStatus 누락) | ⚠️ SCSS 주석/내용이 JS export와 불일치 |
| media-viewer | VideoPlayer, AudioPlayer, ImageViewer (3) | `.media-viewer`✅ | 3/3 | ✅ |
| navigation | Tabs, Accordion, Collapse, MegaMenu, TreeView (5) | `.tabs`✅ `.accordion`✅ `.breadcrumb`✅ | 4/5 (MegaMenu 누락) | 🟡 TreeView/MegaMenu/Collapse CSS 확인필요 |
| overlays | Modal, Drawer, Offcanvas, Lightbox (4) | `.modal`✅ `.drawer`✅ `.offcanvas`✅ `.overlay-backdrop`✅ `.alert-dialog`✅ | 4/4 | ✅ |
| pagination | Pagination, DataPaginator (2) | 확인필요 | 2/2 | — |
| pickers | DatePicker, TimePicker, ColorPicker, Countdown, DDay (5) | `.picker`✅ `.datepicker`✅ `.timepicker`✅ `.colorpicker`✅ `.calendar`✅ | 4/5 (DDay 누락) | ✅ |
| scroll | VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop (5) | `.infinite-scroll`✅ `.back-to-top`✅ `.scroll-progress`✅ `.scroll-snap`✅ | 4/5 (SmoothScroll 누락) | 🟡 VirtualScroll/Scrollspy CSS 확인필요 |
| security-input | OTPInput, PinInput (2) | `.security-input`✅ | 2/2 | ✅ |
| selectors | Autocomplete, MultiSelect, RangeSlider (3) | `.autocomplete`✅ `.multiselect`✅ `.range-slider`✅ `.transfer`✅ | 3/3 | ✅ |
| social | ChatUI, Comments, ShareButtons, Reactions (4) | `.reactions`✅ `.share-buttons`✅ | 4/4 | 🟡 ChatUI/Comments CSS 확인필요 |
| stepper | Stepper, VerticalStepper (2) | `.stepper`✅ `.vertical-stepper`✅ | 2/2 | ✅ |
| text-editors | RichTextEditor, MarkdownEditor, TextareaAutosize (3) | `.text-editor`✅ | 3/3 | 🟡 단일 클래스로 3개 커버 |
| theme | Theme (1) | `.theme-switcher`✅ `.theme-toggle`✅ `.theme-preview`✅ | 1/1 | ✅ |
| tooltips | Tooltip, Popover (2) | 확인필요 | 2/2 | — |
