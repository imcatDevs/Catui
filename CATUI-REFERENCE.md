# CATUI (IMCAT UI) 프레임워크 완전 레퍼런스

> **이 파일 하나로 IMCAT UI 기반 코드를 작성할 수 있습니다.**
> 새 프로젝트의 루트에 복사하면 AI 어시스턴트가 자동으로 참조합니다.
>
> - 홈페이지: <https://imcat.dev>
> - 패키지: `@imcat-ckim/catui`
> - 라이선스: MIT

---

## 목차

1. [기본 로드](#1-기본-로드)
2. [코어 API](#2-코어-api)
3. [CSS 클래스 전체 목록](#3-css-클래스-전체-목록)
4. [CSS 커스텀 속성 (테마)](#4-css-커스텀-속성-테마)
5. [HTML 속성](#5-html-속성)
6. [모듈 목록 및 로드](#6-모듈-목록-및-로드)
7. [모듈별 옵션·메서드·이벤트 상세](#7-모듈별-옵션메서드이벤트-상세)
8. [실전 구현 패턴](#8-실전-구현-패턴)
9. [보일러플레이트](#9-보일러플레이트)
10. [금지사항 및 보안](#10-금지사항-및-보안)

---

## 1. 기본 로드

```html
<!-- CSS (코어만) -->
<link rel="stylesheet" href="dist/imcat-ui.css">
<!-- 또는 코어 + 모든 모듈 CSS -->
<link rel="stylesheet" href="dist/imcat-ui.all.css">

<!-- JS (body 끝) -->
<script src="dist/imcat-ui.min.js"></script>
```

npm 설치:

```bash
npm install @imcat-ckim/catui
```

ESM 사용:

```javascript
import IMCAT from '@imcat-ckim/catui';
```

> **모듈 CSS 자동 로드**: `IMCAT.use('모듈명')` 호출 시 `dist/modules/모듈명.css`가 자동으로 로드됩니다 (`autoLoadModuleCSS: true` 기본값).

---

## 2. 코어 API

### 2.1 DOM 조작 (jQuery 스타일 체이닝)

```javascript
IMCAT('#selector')                     // → DOMWrapper (체이닝 가능)
  // 클래스
  .addClass('name').removeClass('name').toggleClass('name').hasClass('name')
  // 콘텐츠 (html()은 자동 XSS 이스케이프)
  .text('value').html('value').rawHtml('trustedHtml')
  // 속성
  .attr('name', 'value').removeAttr('name').data('key', 'value')
  // 스타일
  .css('prop', 'value').css({ prop: 'value' })
  // 이벤트 (이벤트 위임 지원)
  .on('event', handler).on('event', '.child', handler).off('event', handler)
  // 표시
  .show().hide().toggle()
  // DOM 조작
  .append(el).prepend(el).appendTo(parent).remove().empty()
  // 탐색
  .find('.child').parent().closest('.wrap').siblings().next().prev()
  // 접근
  .first().last().eq(0).get(0)
  // 반복
  .each((el, i) => {})
```

### 2.2 단축 API (모듈 자동 로드)

```javascript
await IMCAT.alert('메시지')                         // → void
await IMCAT.confirm('질문?')                        // → boolean
await IMCAT.prompt('입력:', '기본값')                // → string | null
await IMCAT.modal({ title, content, buttons, size }) // → Modal 인스턴스
await IMCAT.drawer({ title, content, position })     // → Drawer 인스턴스
IMCAT.toast.success(msg)   // .error(msg) .warning(msg) .info(msg)
IMCAT.loading.show('텍스트')
IMCAT.loading.hide()
```

### 2.3 모듈 로드

```javascript
const { Modal, Drawer } = await IMCAT.use('overlays')
const Modal = await IMCAT.use('overlays/modal')       // 하위 모듈 직접 로드
```

### 2.4 이벤트 버스

```javascript
IMCAT.on('eventName', callback)       // 구독 (구독 취소 함수 반환)
IMCAT.emit('eventName', data)          // 발행
IMCAT.off('eventName', callback)       // 구독 취소
IMCAT.once('eventName', callback)      // 일회성 구독

// 구독 취소 패턴
const unsubscribe = IMCAT.on('user:login', (user) => { ... });
unsubscribe();  // 구독 취소
```

### 2.5 상태 관리

```javascript
const state = IMCAT.state.create({ count: 0 })
state.watch('count', (newVal, oldVal) => {})
state.compute('double', () => state.count * 2)
state.batch(() => { state.a = 1; state.b = 2; })  // 일괄 변경 (이벤트 1회)
state.destroy()
```

### 2.6 라우터 (SPA)

```javascript
IMCAT.view.navigate('views/page.html')
IMCAT.view.afterLoad((path) => { /* 뷰 로드 후 처리 */ })
```

```html
<a catui-href="views/page.html">이동</a>
<div catui-target="main"></div>
```

### 2.7 스토리지 (TTL 지원)

```javascript
IMCAT.storage.set('key', value, { expires: 3600 })  // TTL 초 단위
IMCAT.storage.get('key')                // → 값 또는 null (만료 시 자동 삭제)
IMCAT.storage.remove('key')
```

### 2.8 포맷터

```javascript
IMCAT.format.number(1234567)           // → "1,234,567"
IMCAT.format.currency(50000)           // → "₩50,000"
IMCAT.format.date(new Date())          // → "2025. 1. 1."
IMCAT.format.time(new Date())          // → "오후 2:30"
IMCAT.format.phone('01012345678')      // → "010-1234-5678"
IMCAT.format.bytes(1048576)            // → "1 MB"
IMCAT.format.relative(pastDate)        // → "3일 전"
```

### 2.9 템플릿

```javascript
IMCAT.template.render('Hello {{name}}!', { name: 'World' })     // 자동 이스케이프
IMCAT.template.render('{{{rawHtml}}}', { rawHtml: '<b>굵게</b>' }) // 비이스케이프
```

### 2.10 설정

```javascript
IMCAT.config.set('animation', false)
IMCAT.config.get('animationDuration')    // → 300
IMCAT.config.set('autoLoadModuleCSS', true)
```

### 2.11 HTTP API

```javascript
const data = await IMCAT.api.get('/api/users')
await IMCAT.api.post('/api/users', { name: '홍길동' })
await IMCAT.api.put('/api/users/1', { name: '수정' })
await IMCAT.api.delete('/api/users/1')
```

### 2.12 유틸리티

```javascript
IMCAT.utils.debounce(fn, 300)
IMCAT.utils.throttle(fn, 100)
IMCAT.utils.randomId('prefix')          // → "prefix_a1b2c3"
IMCAT.utils.clone(obj)
IMCAT.utils.isEmpty(val)
IMCAT.utils.isString(val)
IMCAT.utils.isFunction(val)
```

### 2.13 보안

```javascript
IMCAT.security.escape(userInput)         // HTML 이스케이프
IMCAT.security.sanitize(htmlString)      // 허용 태그만 남기기
IMCAT.security.sanitizeCSS(cssValue)     // CSS 인젝션 방어
```

---

## 3. CSS 클래스 전체 목록

### 3.1 타이포그래피

| 클래스 | 설명 |
|--------|------|
| `.display-1` ~ `.display-6` | 대형 디스플레이 제목 |
| `.h1` ~ `.h6` | 제목 스타일 (태그 무관) |
| `.body1`, `.body2` | 본문 크기 변형 |
| `.text-left`, `.text-center`, `.text-right`, `.text-justify` | 텍스트 정렬 |
| `.text-uppercase`, `.text-lowercase`, `.text-capitalize` | 텍스트 변환 |
| `.text-primary`, `.text-secondary`, `.text-muted`, `.text-disabled` | 텍스트 색상 |
| `.text-success`, `.text-danger`, `.text-warning`, `.text-info` | 상태 색상 |
| `.text-white`, `.text-light`, `.text-dark`, `.text-body` | 추가 텍스트 색상 |
| `.text-truncate` | 말줄임 (한 줄) |
| `.text-ellipsis-2`, `.text-ellipsis-3` | 다중 행 말줄임 |
| `.text-underline`, `.text-line-through`, `.text-no-underline` | 텍스트 장식 |
| `.text-nowrap`, `.text-wrap`, `.text-break` | 줄바꿈 |
| `.fw-light`, `.fw-normal`, `.fw-medium`, `.fw-semibold`, `.fw-bold` | 폰트 굵기 |
| `.fs-1` ~ `.fs-6`, `.fs-sm`, `.fs-xs`, `.fs-lg`, `.fs-xl` | 폰트 크기 |
| `.lh-1`, `.lh-sm`, `.lh-base`, `.lh-lg` | 줄 높이 |

### 3.2 버튼

| 클래스 | 설명 |
|--------|------|
| `.btn` | 기본 버튼 (필수) |
| `.btn--primary`, `--secondary`, `--success`, `--danger`, `--warning`, `--info`, `--dark`, `--light`, `--link` | 색상 변형 |
| `.btn--outline`, `--outline-success`, `--outline-danger`, `--outline-warning`, `--outline-info`, `--outline-dark` | 아웃라인 변형 |
| `.btn--soft-primary`, `--soft-success`, `--soft-danger`, `--soft-warning`, `--soft-info`, `--soft-dark` | Soft 변형 |
| `.btn--ghost` | 투명 배경 (호버 시 배경) |
| `.btn--xs`, `.btn--sm`, `.btn--lg` | 크기 |
| `.btn--rounded` | 둥근 모서리 (pill) |
| `.btn--square` | 직각 (radius 0) |
| `.btn--icon` | 아이콘 전용 (정사각) |
| `.btn--block` | 전체 너비 |
| `.btn--loading` | 로딩 상태 (스피너 자동) |
| `.btn-label`, `.btn-label-right` | 아이콘 라벨 영역 |
| `.width-xs` ~ `.width-xl` | 고정 최소 너비 (80~200px) |
| `.btn-group`, `.btn-group--attached`, `.btn-group--vertical` | 버튼 그룹 |

> **Bootstrap 호환**: `.btn-primary`, `.btn-outline-primary`, `.btn-soft-primary`, `.btn-sm`, `.btn-lg` 모두 사용 가능

### 3.3 카드

| 클래스 | 설명 |
|--------|------|
| `.card` | 기본 카드 |
| `.card__header`, `__body`, `__footer` | BEM 영역 |
| `.card__title`, `__subtitle`, `__actions` | BEM 제목/액션 |
| `.card--outlined`, `--elevated`, `--flat`, `--filled` | 스타일 변형 |
| `.card--primary`, `--success`, `--warning`, `--danger`, `--info` | 시맨틱 색상 |
| `.card--sm`, `--lg` | 크기 |
| `.card--horizontal` | 가로 레이아웃 |
| `.card-body`, `.card-header`, `.card-footer`, `.card-title` | Bootstrap 호환 |
| `.card-img-top`, `.card-img-overlay` | 이미지 |
| `.card-grid`, `.card-list`, `.card-group` | 레이아웃 |
| `.card-bordered` | 좌측 액센트 보더 |

### 3.4 폼

| 클래스 | 설명 |
|--------|------|
| `.form-group` | 폼 그룹 (label + input 래퍼) |
| `.form-label` | 라벨 |
| `.form-control` / `.form-input` | 텍스트 입력 |
| `.form-select` | 셀렉트 |
| `.form-check` + `.form-check-input` + `.form-check-label` | 체크박스/라디오 |
| `.form-switch` | 스위치 토글 |
| `.form-control-sm`, `.form-control-lg` | 입력 크기 |
| `.is-valid`, `.is-invalid` | 검증 상태 |
| `.valid-feedback`, `.invalid-feedback` | 검증 메시지 |
| `.form-helper` / `.form-text` | 도움말 텍스트 |
| `.input-group` + `.input-group-text` | 입력 그룹 |
| `.form-floating` | 플로팅 라벨 |
| `.form-range` | 레인지 슬라이더 |

### 3.5 테이블

| 클래스 | 설명 |
|--------|------|
| `.table` | 기본 테이블 |
| `.table--striped`, `--bordered`, `--borderless`, `--hover` | 스타일 변형 |
| `.table--sm`, `--lg` | 크기 |
| `.table--selectable` | 행 클릭 가능 |
| `.table-responsive` / `.table-wrapper` | 반응형 래퍼 |

### 3.6 알림

| 클래스 | 설명 |
|--------|------|
| `.alert` | 기본 알림 |
| `.alert--info`, `--success`, `--warning`, `--danger`, `--error` | BEM 색상 |
| `.alert--filled`, `--outlined` | 스타일 변형 |
| `.alert--sm`, `--lg` | 크기 |
| `.alert__icon`, `__content`, `__title`, `__message`, `__close`, `__actions` | 구조 |
| `.alert--dismissible` | 닫기 가능 |

### 3.7 배지

| 클래스 | 설명 |
|--------|------|
| `.badge` | 기본 배지 |
| `.badge--primary`, `--success`, `--warning`, `--danger`, `--info`, `--secondary` | 색상 (dark/light는 `.bg-dark`/`.bg-light`) |
| `.badge--soft`, `--outlined` | 스타일 변형 |
| `.badge--pill`, `--dot`, `--circle` | 형태 |
| `.badge--sm`, `--lg` | 크기 |
| `.badge--removable` + `.badge__remove` | 삭제 가능 |
| `.badge-wrapper` + `.badge-float` | 플로팅 배지 |
| `.status` > `.status__dot` + `--online/away/busy/offline` | 상태 인디케이터 (dot 필수) |

### 3.8 리스트

| 클래스 | 설명 |
|--------|------|
| `.list` > `.list__item` | 리스트 구조 |
| `.list__icon`, `__content`, `__title`, `__subtitle`, `__meta`, `__actions` | 구조 요소 |
| `.list--divided`, `--bordered`, `--flush`, `--hoverable` | 변형 |
| `.list--sm`, `--lg` | 크기 |
| `.list--inline`, `--numbered`, `--bullet`, `--check` | 특수 리스트 |
| `.list-group` > `.list-group-item` | Bootstrap 호환 |

### 3.9 프로그레스

| 클래스 | 설명 |
|--------|------|
| `.progress` > `.progress__bar` | 프로그레스 구조 (`width` 필수) |
| `.progress--xs` ~ `--xxl` | 크기 |
| `.progress--success`, `--warning`, `--danger`, `--info` | 색상 (**컨테이너**에 적용) |
| `.progress--striped`, `--animated` | 스트라이프 |
| `.progress--indeterminate` | 무한 로딩 |
| `.progress--labeled` + `.progress__label` | 라벨 |
| `.progress--vertical` | 수직 |

### 3.10 아바타

| 클래스 | 설명 |
|--------|------|
| `.avatar-xs` ~ `.avatar-2xl` | 크기 (xs/sm/md/lg/xl/2xl) |
| `.avatar-title` | 이니셜 텍스트 |
| `.avatar-group` > `.avatar-group__item` | 그룹 겹침 |
| `.avatar-status` > `__indicator--online/away/busy` | 상태 표시 |

### 3.11 그리드

| 클래스 | 설명 |
|--------|------|
| `.grid` | CSS Grid 컨테이너 (`display: grid`) |
| `.d-grid` | `.grid` 별칭 |
| `.grid-cols-1` ~ `.grid-cols-12` | 컬럼 수 (`repeat(N, 1fr)`) |
| `.col-span-1` ~ `.col-span-12` | 컬럼 병합 (`grid-column: span N`) |
| `.col-span-full` | 전체 너비 (`grid-column: 1 / -1`) |
| `.gap-0` ~ `.gap-5` | 갭 (0 ~ 3rem) |
| `.grid-rows-1` ~ `.grid-rows-6` | 행 수 |
| `.row-span-1` ~ `.row-span-6`, `.row-span-full` | 행 병합 |
| `.card-grid` | 카드 자동 배치 (`auto-fill, minmax(280px, 1fr)`) |

### 3.12 유틸리티

| 카테고리 | 클래스 |
|----------|--------|
| **디스플레이** | `.d-none`, `.d-block`, `.d-flex`, `.d-inline-flex`, `.d-grid`, `.d-inline-block` |
| **Flex 방향** | `.flex-row`, `.flex-column`, `.flex-wrap`, `.flex-nowrap`, `.flex-row-reverse` |
| **Flex 정렬** | `.align-items-start/center/end/stretch`, `.justify-content-start/center/end/between/around/evenly` |
| **갭** | `.gap-0`(0) ~ `.gap-5`(3rem) |
| **마진** | `.m-0`~`.m-5`, `.mt-*`, `.mb-*`, `.ms-*`, `.me-*`, `.mx-*`, `.my-*` (0~5), `.m-auto`, `.mx-auto`, `.ms-auto`, `.me-auto` |
| **패딩** | `.p-0`~`.p-5`, `.pt-*`, `.pb-*`, `.ps-*`, `.pe-*`, `.px-*`, `.py-*` (0~5) |
| **너비** | `.w-25`, `.w-50`, `.w-75`, `.w-100`, `.w-auto` |
| **높이** | `.h-25`, `.h-50`, `.h-75`, `.h-100`, `.h-auto` |
| **위치** | `.position-static/relative/absolute/fixed/sticky` |
| **좌표** | `.top-0/50/100`, `.bottom-0`, `.start-0/50`, `.end-0/50` |
| **변환** | `.translate-middle`, `.translate-middle-x`, `.translate-middle-y` |
| **그림자** | `.shadow-none`, `.shadow-sm`, `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`, `.shadow-2xl` |
| **보더** | `.border`, `.border-0`, `.border-top/bottom/start/end`, `.border-dashed` |
| **보더 색상** | `.border-primary/success/danger/warning/info/light/dark/white` |
| **보더 두께** | `.border-1` ~ `.border-5` |
| **라운딩** | `.rounded`, `.rounded-0`~`.rounded-5`, `.rounded-circle`, `.rounded-pill`, `.rounded-top/end/bottom/start` |
| **투명도** | `.opacity-0`, `.opacity-25`, `.opacity-50`, `.opacity-75`, `.opacity-100` |
| **오버플로** | `.overflow-auto`, `.overflow-hidden`, `.overflow-visible`, `.overflow-x-auto`, `.overflow-y-auto` |
| **배경** | `.bg-primary`, `.bg-success`, `.bg-info`, `.bg-warning`, `.bg-danger`, `.bg-dark`, `.bg-light`, `.bg-white` |
| **배경+텍스트** | `.text-bg-primary`, `.text-bg-success`, `.text-bg-danger`, `.text-bg-warning`, `.text-bg-info` |
| **오브젝트** | `.object-fit-contain/cover/fill/scale/none` |
| **컨테이너** | `.container`, `.container-fluid`, `.container-sm/md/lg/xl` |
| **뷰포트** | `.vh-100`, `.vw-100`, `.min-vh-100`, `.min-w-0`, `.min-h-0` |
| **Flex 확장** | `.flex-shrink-1`, `.order-0`~`5`, `.order-first/last` |
| **접근성** | `.visually-hidden`, `.sr-only`, `.visually-hidden-focusable` |
| **커서** | `.cursor-pointer/default/not-allowed/grab/text/move/wait` |
| **플로트** | `.float-start/end/none`, `.clearfix` |
| **수직 정렬** | `.align-baseline/top/middle/bottom/text-top/text-bottom` |
| **종횡비** | `.ratio`, `.ratio-1x1/4x3/16x9/21x9` |
| **트랜지션** | `.transition-all`, `.transition-none` |
| **기타** | `.pe-none/auto`, `.user-select-none/auto/all`, `.z-0`~`.z-3`, `.text-black`, `.stretched-link` |

---

## 4. CSS 커스텀 속성 (테마)

```css
/* 모든 컴포넌트가 아래 변수를 참조합니다 */
var(--primary)           /* 기본 브랜드 색상 */
var(--primary-color)     /* = --primary */
var(--primary-hover)     /* 호버 시 */
var(--secondary-color)
var(--success-color), var(--danger-color), var(--warning-color), var(--info-color)

var(--bg-primary)        /* 메인 배경 */
var(--bg-secondary)      /* 보조 배경 (사이드바 등) */
var(--bg-tertiary)       /* 3차 배경 (호버 등) */
var(--bg-elevated)       /* 떠오른 요소 배경 */

var(--text-primary)      /* 기본 텍스트 */
var(--text-secondary)    /* 보조 텍스트 */
var(--text-disabled)     /* 비활성 텍스트 */

var(--border-color)      /* 기본 테두리 */
var(--border-light)      /* 연한 테두리 */
var(--divider-color)     /* 구분선 */

var(--shadow-sm/md/lg/xl) /* 그림자 */
var(--color-scheme)      /* light | dark */
```

테마 전환: `<html data-theme="light">` 또는 `<html data-theme="dark">`

---

## 5. HTML 속성

| 속성 | 용도 | 예시 |
|------|------|------|
| `data-imcat="컴포넌트"` | 선언적 자동 초기화 | `<div data-imcat="dropdown">` |
| `catui-href="경로"` | SPA 네비게이션 | `<a catui-href="views/page.html">` |
| `catui-target="id"` | 렌더 타겟 | `<div catui-target="main">` |
| `data-*` | 컴포넌트 옵션 전달 | `data-position="bottom"` |

---

## 6. 모듈 목록 및 로드

| 모듈명 | 로드 코드 | 주요 클래스 |
|--------|----------|------------|
| `overlays` | `IMCAT.use('overlays')` | Modal, Drawer, Offcanvas |
| `dropdown` | `IMCAT.use('dropdown')` | Dropdown |
| `tooltips` | `IMCAT.use('tooltips')` | Tooltip, Popover |
| `navigation` | `IMCAT.use('navigation')` | Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar |
| `feedback` | `IMCAT.use('feedback')` | Toast, Notification, ProgressTracker, Skeleton |
| `carousel` | `IMCAT.use('carousel')` | Carousel, Lightbox |
| `pickers` | `IMCAT.use('pickers')` | DatePicker, TimePicker, ColorPicker, Countdown, DDay |
| `selectors` | `IMCAT.use('selectors')` | Autocomplete, MultiSelect, RangeSlider |
| `forms` | `IMCAT.use('forms')` | FileUpload, Rating, SignaturePad, FormWizard |
| `data-viz` | `IMCAT.use('data-viz')` | DataTable, Chart, Masonry, Kanban, Calendar |
| `stepper` | `IMCAT.use('stepper')` | Stepper, VerticalStepper |
| `scroll` | `IMCAT.use('scroll')` | VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop |
| `pagination` | `IMCAT.use('pagination')` | Pagination |
| `theme` | `IMCAT.use('theme')` | Theme (createTheme, initTheme) |
| `advanced-ui` | `IMCAT.use('advanced-ui')` | SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker |
| `social` | `IMCAT.use('social')` | ChatUI, Comments, Reactions, SocialFeed, ShareButtons |
| `imagelist` | `IMCAT.use('imagelist')` | ImageList, ImageLightbox, ImageCompare, LazyImage |
| `gantt` | `IMCAT.use('gantt')` | Gantt |
| `live-status` | `IMCAT.use('live-status')` | OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus |
| `security-input` | `IMCAT.use('security-input')` | OTPInput, PinInput |
| `text-editors` | `IMCAT.use('text-editors')` | RichTextEditor, MarkdownEditor, TextareaAutosize |
| `media-viewer` | `IMCAT.use('media-viewer')` | VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo |

---

## 7. 모듈별 옵션·메서드·이벤트 상세

### 7.1 Modal (overlays)

```javascript
const { Modal } = await IMCAT.use('overlays');
const modal = new Modal(options);
modal.show();
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | string | `''` | 모달 제목 |
| `content` | string | `''` | 모달 본문 (HTML) |
| `size` | string | `'md'` | `sm`, `md`, `lg`, `xl` |
| `closeButton` | boolean | `true` | 닫기 버튼 표시 |
| `backdropClose` | boolean | `true` | 배경 클릭 시 닫기 |
| `keyboard` | boolean | `true` | ESC 키 닫기 |
| `centered` | boolean | `false` | 수직 중앙 정렬 |
| `scrollable` | boolean | `false` | 내용 스크롤 허용 |
| `fullscreen` | boolean | `false` | 전체 화면 |
| `buttons` | array | `[]` | `[{ text, variant, close, action }]` |
| `animation` | boolean | `true` | 애니메이션 |

| 메서드 | 설명 |
|--------|------|
| `show()` | 표시 |
| `hide()` | 숨기기 |
| `destroy()` | 완전 제거 |
| `setContent(html)` | 본문 변경 |
| `setTitle(text)` | 제목 변경 |

| 정적 메서드 | 설명 |
|-------------|------|
| `Modal.confirm(message)` | → `Promise<boolean>` |
| `Modal.alert(message)` | → `Promise<void>` |

| 이벤트 | 데이터 |
|--------|--------|
| `show` | — |
| `hide` | — |
| `destroy` | — |

### 7.2 Drawer / Offcanvas (overlays)

```javascript
const { Drawer } = await IMCAT.use('overlays');
new Drawer({ title: '메뉴', content: '...', position: 'right', width: '300px' }).show();
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | string | `''` | 제목 |
| `content` | string | `''` | 본문 |
| `position` | string | `'left'` | `left`, `right`, `top`, `bottom` |
| `width` | string | `'320px'` | 좌/우 위치 시 너비 |
| `height` | string | `'320px'` | 상/하 위치 시 높이 |
| `closeButton` | boolean | `true` | 닫기 버튼 |
| `backdropClose` | boolean | `true` | 배경 클릭 닫기 |
| `keyboard` | boolean | `true` | ESC 닫기 |

### 7.3 Dropdown

```javascript
const { Dropdown } = await IMCAT.use('dropdown');
new Dropdown(triggerElement, options);
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `items` | array | `[]` | `[{ text, icon?, action?, divider?, disabled? }]` |
| `position` | string | `'bottom'` | `top`, `bottom`, `left`, `right` |
| `align` | string | `'start'` | `start`, `end`, `center` |
| `offset` | number | `4` | 오프셋 (px) |
| `closeOnClick` | boolean | `true` | 항목 클릭 시 닫기 |
| `closeOnOutside` | boolean | `true` | 외부 클릭 시 닫기 |
| `openOnHover` | boolean | `false` | 호버 시 열기 |

| 메서드 | 설명 |
|--------|------|
| `show()` / `hide()` / `toggle()` | 표시/숨김 |
| `updateItems(items)` | 항목 갱신 |
| `destroy()` | 제거 |

### 7.4 Tooltip / Popover (tooltips)

```javascript
const { Tooltip, Popover } = await IMCAT.use('tooltips');
new Tooltip(element, { content: '설명', placement: 'top' });
new Popover(element, { title: '제목', content: '본문', dismissible: true });
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `content` | string | `''` | 텍스트 |
| `placement` | string | `'top'` | `top`, `right`, `bottom`, `left` |
| `trigger` | string | `'hover'` | `hover`, `focus`, `click`, `manual` |
| `delay` | object | `{ show: 0, hide: 100 }` | 표시/숨김 지연 (ms) |
| `offset` | number | `8` | 오프셋 (px) |
| `html` | boolean | `false` | HTML 허용 |

### 7.5 Toast / Notification (feedback)

```javascript
const { Toast, Notification } = await IMCAT.use('feedback');
// Toast는 정적 메서드로 사용
Toast.success('완료!');
Toast.error('오류');
Toast.show('메시지', 'info', 3000);  // message, type, duration
Toast.clear();
// Notification
Notification.show({ title: '알림', message: '내용', type: 'info', duration: 5000 });
Notification.success('성공', '저장됨');
Notification.clear();
```

**Toast 메서드**: `Toast.show(msg, type, duration)`, `.success()`, `.error()`, `.warning()`, `.info()`, `.clear()`

**Notification 옵션**:

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | string | `''` | 제목 |
| `message` | string | `''` | 메시지 |
| `type` | string | `'info'` | `success`, `error`, `warning`, `info` |
| `duration` | number | `5000` | 표시 시간 (ms) |
| `closable` | boolean | `true` | 닫기 버튼 |
| `actions` | array | `[]` | `[{ text, onClick }]` 액션 버튼 |
| `onClose` | function | `null` | 닫힘 콜백 |

### 7.6 Tabs / Accordion / Collapse (navigation)

```javascript
const { Tabs, Accordion, Collapse } = await IMCAT.use('navigation');
```

**Tabs**:

```javascript
new Tabs('#myTabs', {
  activeIndex: 0,
  animation: true,
  orientation: 'horizontal',  // 'vertical'
  onChange: (index) => {}
});
```

**Accordion**:

```javascript
new Accordion('#myAccordion', {
  multiple: false,      // 여러 패널 동시 확장
  expandFirst: true,    // 첫 번째 패널 자동 열기
  animation: true,
  onChange: (index, isOpen) => {}
});
```

**Collapse**:

```javascript
new Collapse('#myElement', { animation: true });
// .expand() .collapse() .toggle()
```

### 7.7 DataTable (data-viz)

```javascript
const { DataTable } = await IMCAT.use('data-viz');
const table = new DataTable('#container', options);
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `columns` | array | `[]` | `[{ key, title, width?, sortable?, render? }]` |
| `data` | array | `[]` | 행 데이터 배열 |
| `pagination` | boolean | `true` | 페이지네이션 |
| `pageSize` | number | `10` | 페이지 당 행 수 |
| `search` | boolean | `false` | 검색 표시 |
| `selectable` | boolean | `false` | 행 선택 |
| `emptyText` | string | `'데이터 없음'` | 빈 상태 텍스트 |

| 메서드 | 설명 |
|--------|------|
| `setData(data)` | 데이터 교체 |
| `addRow(row)` | 행 추가 |
| `removeRow(index)` | 행 삭제 |
| `getSelected()` | 선택된 행 반환 |
| `exportCSV(filename)` | CSV 내보내기 |
| `destroy()` | 제거 |

### 7.8 Chart (data-viz)

```javascript
const { Chart } = await IMCAT.use('data-viz');
new Chart('#container', {
  type: 'bar',              // bar, line, pie, doughnut, area, horizontalBar
  data: {
    labels: ['1월', '2월', '3월'],
    datasets: [{ label: '매출', data: [100, 200, 150] }]
  },
  height: 300
});
```

### 7.9 Theme

```javascript
const TM = await IMCAT.use('theme');
const theme = TM.createTheme({
  defaultTheme: 'system',          // 'light', 'dark', 'system'
  transition: 'fade',              // 'fade', 'slide', 'circle', 'none'
  transitionDuration: 300,
  onChange: (resolved) => {}        // 'light' | 'dark'
});
```

| 메서드 | 설명 |
|--------|------|
| `theme.toggle()` | 라이트 ↔ 다크 전환 |
| `theme.set('dark')` | 특정 테마 설정 |
| `theme.getResolved()` | 현재 적용 테마 (`'light'` or `'dark'`) |
| `theme.getCurrent()` | 현재 설정 값 (`'light'`, `'dark'`, `'system'`) |
| `theme.toggleWithEvent(e)` | 클릭 위치 기반 원형 전환 |

### 7.10 Carousel

```javascript
const { Carousel } = await IMCAT.use('carousel');
new Carousel('#container', {
  items: [
    { image: 'img1.jpg', title: '슬라이드 1' },
    { image: 'img2.jpg', title: '슬라이드 2' }
  ],
  autoplay: true,
  interval: 5000,
  effect: 'slide',          // slide, fade, scale, flip, cube
  loop: true,
  arrows: true,
  dots: true,
  thumbnails: false
});
```

| 메서드 | 설명 |
|--------|------|
| `goTo(index)` | 특정 슬라이드 이동 |
| `next()` / `prev()` | 다음/이전 |
| `play()` / `pause()` | 자동 재생 |
| `destroy()` | 제거 |

### 7.11 FileUpload (forms)

```javascript
const { FileUpload } = await IMCAT.use('forms');
new FileUpload('#container', {
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024,   // 5MB
  multiple: true,
  preview: true,
  onUpload: (files) => {},
  onError: (error) => {}
});
```

### 7.12 Rating (forms)

```javascript
const { Rating } = await IMCAT.use('forms');
new Rating('#container', {
  value: 3,
  max: 5,
  size: 'md',
  readonly: false,
  onChange: (value) => {}
});
```

### 7.13 FormWizard (forms)

```javascript
const { FormWizard } = await IMCAT.use('forms');
new FormWizard('#container', {
  steps: [
    { title: '기본정보', content: '<div>...</div>', validate: () => true },
    { title: '상세정보', content: '<div>...</div>' },
    { title: '완료', content: '<div>완료!</div>' }
  ],
  onComplete: (data) => {},
  onChange: (step) => {}
});
```

### 7.14 Pagination

```javascript
const { Pagination } = await IMCAT.use('pagination');
const pager = new Pagination('#container', {
  total: 100,
  pageSize: 10,
  currentPage: 1,
  onChange: (page) => {}
});
// pager.setPage(3), pager.setTotal(200), pager.destroy()
```

### 7.15 Stepper

```javascript
const { Stepper } = await IMCAT.use('stepper');
new Stepper('#container', {
  steps: [
    { title: '주문', description: '상품 선택' },
    { title: '결제', description: '결제 정보' },
    { title: '완료', description: '주문 확인' }
  ],
  currentStep: 0,
  clickable: true,
  onChange: (step) => {}
});
```

### 7.16 기타 주요 모듈

**Autocomplete / MultiSelect** (selectors):

```javascript
const { Autocomplete, MultiSelect } = await IMCAT.use('selectors');
new Autocomplete('#input', {
  source: ['항목1', '항목2'],  // 또는 async 함수
  minLength: 1,
  onSelect: (item) => {}
});
new MultiSelect('#select', {
  options: [{ value: '1', label: '항목1' }],
  placeholder: '선택...',
  searchable: true,
  onChange: (selected) => {}
});
```

**DatePicker / TimePicker** (pickers):

```javascript
const { DatePicker, TimePicker } = await IMCAT.use('pickers');
new DatePicker('#input', { format: 'YYYY-MM-DD', onChange: (date) => {} });
new TimePicker('#input', { format: '24h', onChange: (time) => {} });
```

**VirtualScroll / InfiniteScroll** (scroll):

```javascript
const { VirtualScroll, InfiniteScroll, BackToTop } = await IMCAT.use('scroll');
new VirtualScroll('#container', { items: [...], itemHeight: 40, renderItem: (item) => `<div>...</div>` });
new InfiniteScroll('#container', { loadMore: async () => { ... }, threshold: 200 });
new BackToTop({ threshold: 300 });
```

**ChatUI / Comments** (social):

```javascript
const { ChatUI, Comments } = await IMCAT.use('social');
new ChatUI('#container', { messages: [...], onSend: (msg) => {} });
new Comments('#container', { comments: [...], onSubmit: (text) => {} });
```

---

## 8. 실전 구현 패턴

### 패턴 1: 확인 다이얼로그

```javascript
async function deleteItem(id) {
  if (!await IMCAT.confirm('정말 삭제하시겠습니까?')) return;
  try {
    await IMCAT.api.delete(`/api/items/${id}`);
    IMCAT.toast.success('삭제되었습니다.');
  } catch (e) {
    IMCAT.toast.error('삭제 실패: ' + e.message);
  }
}
```

### 패턴 2: CRUD 테이블

```javascript
const { DataTable } = await IMCAT.use('data-viz');
const table = new DataTable('#table', {
  columns: [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'name', title: '이름' },
    { key: 'email', title: '이메일' },
    { key: 'actions', title: '관리', width: '120px',
      render: (val, row) => `
        <button class="btn btn--outline btn--sm" onclick="edit(${row.id})">수정</button>
        <button class="btn btn--outline-danger btn--sm" onclick="del(${row.id})">삭제</button>`
    }
  ],
  data: [...],
  pagination: true,
  search: true
});
```

### 패턴 3: SPA 레이아웃

```html
<div class="app" style="display:flex;min-height:100vh;">
  <aside style="width:240px;background:var(--bg-secondary);border-right:1px solid var(--border-color);padding:1rem;">
    <a catui-href="views/home.html" class="nav-link">홈</a>
    <a catui-href="views/users.html" class="nav-link">사용자</a>
  </aside>
  <main catui-target="content" style="flex:1;padding:2rem;">
    <div id="content"><h1>홈</h1></div>
  </main>
</div>

<script src="dist/imcat-ui.min.js"></script>
<script>
IMCAT.view.afterLoad((path) => {
  IMCAT('.nav-link').each(l => l.classList.remove('is-active'));
  IMCAT(`[catui-href="${path}"]`).addClass('is-active');
});
</script>
```

### 패턴 4: 테마 전환

```javascript
(async () => {
  const TM = await IMCAT.use('theme');
  const theme = TM.createTheme({ defaultTheme: 'system', transition: 'fade' });
  IMCAT('#themeBtn').on('click', () => theme.toggle());
})();
```

### 패턴 5: 리액티브 상태 → DOM

```javascript
const state = IMCAT.state.create({ count: 0 });
state.watch('count', (v) => IMCAT('#display').text(`카운트: ${v}`));
IMCAT('#incBtn').on('click', () => state.count++);
IMCAT('#resetBtn').on('click', () => state.count = 0);
```

### 패턴 6: 데이터 로딩

```javascript
async function loadData() {
  IMCAT.loading.show('로딩 중...');
  try {
    const data = await IMCAT.api.get('/api/data');
    render(data);
  } catch (e) {
    IMCAT.toast.error('로드 실패');
  } finally {
    IMCAT.loading.hide();
  }
}
```

### 패턴 7: 선언적 초기화 (HTML만)

```html
<button data-imcat="tooltip" data-content="도움말" class="btn btn--primary">호버</button>
<button data-imcat="dropdown" data-items='[{"text":"수정"},{"text":"삭제"}]' class="btn btn--outline">메뉴</button>
```

---

## 9. 보일러플레이트

새 프로젝트 시작 시 아래를 복사하세요:

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="dist/imcat-ui.css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
</head>
<body>

  <div class="p-4">
    <h1>Hello IMCAT UI</h1>
    <button class="btn btn--primary" id="testBtn">
      <i class="material-icons-outlined">check</i> 테스트
    </button>
  </div>

  <script src="dist/imcat-ui.min.js"></script>
  <script>
    IMCAT('#testBtn').on('click', async () => {
      await IMCAT.alert('IMCAT UI가 정상 동작합니다!');
    });
  </script>
</body>
</html>
```

---

## 10. 금지사항 및 보안

| 금지 | 대안 |
|------|------|
| `innerHTML`에 사용자 입력 직접 삽입 | `IMCAT('#el').html(value)` (자동 이스케이프) 또는 `Security.escape()` |
| `.rawHtml()`에 사용자 입력 전달 | 신뢰 소스 전용 — 사용자 입력 절대 불가 |
| `eval()`, `new Function()` | 사용 금지 |
| 모듈 JS 파일 직접 `<script>` import | `IMCAT.use('모듈명')` 사용 |
| CSS `style` 속성에 사용자 입력 | `Security.sanitizeCSS(value)` 사용 |

### 컴포넌트 메모리 관리

- 모든 컴포넌트는 `destroy()` 메서드를 제공합니다.
- SPA에서 뷰 전환 시 반드시 `destroy()` 호출하여 이벤트 리스너와 DOM을 정리하세요.

```javascript
let modal;
// 생성
modal = new Modal({ title: '제목', content: '내용' });
// 정리
modal.destroy();
modal = null;
```
