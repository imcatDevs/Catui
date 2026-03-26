# IMCAT UI 치트시트

AI 어시스턴트와 개발자가 빠르게 참조할 수 있는 전체 프레임워크 요약입니다.

> 이 파일 하나만 읽으면 IMCAT UI 기반 코드를 생성할 수 있습니다.

## 기본 로드

```html
<!-- CSS 1개 + JS 1개만 로드 (Material Icons 내장, 별도 CDN 불필요) -->
<link rel="stylesheet" href="dist/imcat-ui.css">
<script src="dist/imcat-ui.min.js"></script>
```

## CSS 클래스 전체 목록

### 타이포그래피

| 클래스 | 설명 |
| --- | --- |
| `.display-1` ~ `.display-6` | 대형 디스플레이 제목 |
| `.h1` ~ `.h6` | 제목 스타일 (태그 무관) |
| `.body1`, `.body2` | 본문 크기 변형 |
| `.caption` | 캡션 (작은 텍스트) |
| `.overline` | 오버라인 (대문자 소형) |
| `.lead` | 리드 (큰 도입 문단) |
| `.text-left`, `.text-center`, `.text-right` | 텍스트 정렬 |
| `.text-uppercase`, `.text-lowercase`, `.text-capitalize` | 텍스트 변환 |
| `.text-primary`, `.text-secondary`, `.text-muted` | 텍스트 색상 |
| `.text-success`, `.text-danger`, `.text-warning`, `.text-info` | 상태 색상 |
| `.fw-bold`, `.fw-semibold`, `.fw-normal`, `.fw-light` | 폰트 굵기 |
| `.text-truncate` | 말줄임 (한 줄) |

### 버튼

| 클래스 | 설명 |
| --- | --- |
| `.btn` | 기본 버튼 |
| `.btn--primary`, `--success`, `--info`, `--warning`, `--danger`, `--dark`, `--secondary`, `--light`, `--link` | 색상 변형 |
| `.btn--outline`, `--outline-success`, `--outline-danger`, `--outline-warning`, `--outline-info`, `--outline-dark`, `--outline-secondary` | 아웃라인 |
| `.btn--soft-primary`, `--soft-success`, `--soft-danger`, `--soft-warning`, `--soft-info`, `--soft-dark`, `--soft-secondary` | Soft 변형 |
| `.btn--xs`, `.btn--sm`, `.btn--lg` | 크기 |
| `.btn--rounded` | 둥근 모서리 (pill) |
| `.btn--square` | 직각 (radius 0) |
| `.btn--icon` | 아이콘 전용 (정사각) |
| `.btn--ghost` | 투명 배경 |
| `.btn--block` | 전체 너비 |
| `.btn--loading` | 로딩 상태 (스피너) |
| `.btn-label`, `.btn-label-right` | 아이콘 라벨 |
| `.width-xs`~`.width-xl` | 고정 최소 너비 |
| `.btn-group`, `.btn-group--attached`, `.btn-group--vertical` | 버튼 그룹 (gap / 연결 / 세로) |
| `.button-list` | 버튼 나열 레이아웃 (flex-wrap) |

### 카드

| 클래스 | 설명 |
| --- | --- |
| `.card` | 기본 카드 |
| `.card__header`, `__body`, `__footer` | 영역 |
| `.card__title`, `__subtitle`, `__actions` | 제목, 액션 |
| `.card--outlined`, `--elevated`, `--flat`, `--filled` | 변형 |
| `.card--sm`, `--lg` | 크기 |
| `.card--horizontal` | 가로 레이아웃 |
| `.card--primary`, `--success`, `--warning`, `--danger`, `--info` | 시맨틱 색상 |
| `.card-img-top`, `.card-img-overlay` | 이미지 (Bootstrap 호환) |
| `.card-grid`, `.card-list`, `.card-group` | 레이아웃 |

### 폼

| 클래스 | 설명 |
| --- | --- |
| `.form-group` | 폼 그룹 (label + input 래퍼) |
| `.form-label` | 라벨 |
| `.form-control` / `.form-input` | 텍스트 입력 (Bootstrap 호환 / BEM alias) |
| `.form-select` | 셀렉트 |
| `.form-check` + `.form-check-input` + `.form-check-label` | 체크박스/라디오 |
| `.form-switch` | 스위치 토글 (`.form-check`와 함께) |
| `.form-control-sm`, `.form-control-lg` | 입력 크기 (Bootstrap 호환) |
| `.is-valid`, `.is-invalid` | 검증 상태 |
| `.valid-feedback`, `.invalid-feedback` | 검증 메시지 |
| `.was-validated` | 폼 전체 검증 |
| `.form-helper` / `.form-text` | 도움말 텍스트 |
| `.input-group` + `.input-group-text` | 입력 그룹 |
| `.form-floating` | 플로팅 라벨 |
| `.form-range` | 레인지 슬라이더 |

### 테이블

| 클래스 | 설명 |
| --- | --- |
| `.table` | 기본 테이블 |
| `.table--striped` | 스트라이프 |
| `.table--bordered` | 테두리 |
| `.table--borderless` | 테두리 없음 |
| `.table--hover` | 행 호버 |
| `.table--sm`, `--lg` | 크기 |
| `.table--selectable` | 행 클릭 가능 |
| `.table-responsive` / `.table-wrapper` | 반응형 래퍼 |
| `.table__sortable`, `__truncate`, `__actions`, `__empty`, `__loading` | 기능 |

### 알림

| 클래스 | 설명 |
| --- | --- |
| `.alert` | 기본 알림 |
| `.alert--info`, `--success`, `--warning`, `--danger`, `--error` | BEM 색상 |
| `.alert--filled`, `--outlined` | 스타일 변형 |
| `.alert--sm`, `--lg` | 크기 |
| `.alert__icon`, `__content`, `__title`, `__message`, `__close`, `__actions` | 구조 |
| `.alert--dismissible` | 닫기 애니메이션 |
| `.alert-list` | 알림 스택 |
| `.alert-primary`~`-dark` | Bootstrap 호환 색상 |

### 배지

| 클래스 | 설명 |
| --- | --- |
| `.badge` | 기본 배지 |
| `.badge--primary`, `--success`, `--warning`, `--danger`, `--info`, `--secondary` | 색상 (dark/light는 `.bg-dark`/`.bg-light` 사용) |
| `.badge--soft`, `--outlined` | 스타일 변형 |
| `.badge--pill`, `--dot`, `--circle` | 형태 |
| `.badge--sm`, `--lg` | 크기 |
| `.badge--removable` + `.badge__remove` | 삭제 가능 |
| `.badge-wrapper` + `.badge-float` | 플로팅 배지 |
| `.badge-group` | 배지 그룹 |
| `.tag` | 태그 (배지 alias) |
| `.status` > `.status__dot` + `--online/away/busy/offline` | 상태 인디케이터 (dot 필수) |

### 리스트

| 클래스 | 설명 |
| --- | --- |
| `.list` > `.list__item` | 리스트 구조 |
| `.list__icon`, `__content`, `__title`, `__subtitle`, `__meta`, `__actions` | 구조 요소 |
| `.list--divided`, `--bordered`, `--flush`, `--hoverable` | 변형 |
| `.list--sm`, `--lg` | 크기 |
| `.list--inline`, `--numbered`, `--bullet`, `--check` | 특수 리스트 |
| `.dl`, `.dl--horizontal` | 설명 목록 |
| `.list-group` > `.list-group-item` | Bootstrap 호환 |

### 프로그레스

| 클래스 | 설명 |
| --- | --- |
| `.progress` > `.progress__bar` | 프로그레스 구조 (width 필수) |
| `.progress--xs`~`--xxl` | 크기 (xs/sm/기본/lg/xl/xxl) |
| `.progress--success`/`warning`/`danger`/`error`/`info`/`secondary` | 색상 (**컨테이너**에 적용) |
| `.progress--striped`, `--animated` | 스트라이프 (**컨테이너**에 적용) |
| `.progress--indeterminate` | 무한 로딩 |
| `.progress--labeled` + `.progress__label` | 라벨 |
| `.progress--stacked` | 다중 바 |
| `.progress--vertical`, `--vertical-bottom` | 수직 |

### 아바타

| 클래스 | 설명 |
| --- | --- |
| `.avatar-xs` ~ `.avatar-2xl` | 크기 (xs/sm/md/lg/xl/2xl) |
| `.avatar-title` | 이니셜 텍스트 (배경색 + 흰색 텍스트) |
| `.avatar-group` > `.avatar-group__item` | 그룹 겹침 |
| `.avatar-status` > `__indicator--online/away/busy/offline` | 상태 표시 |

### 플래그

| 클래스 | 설명 |
| --- | --- |
| `.flag-xs` ~ `.flag-xl` | 크기 (xs: 14px / sm: 18px / md: 24px / lg: 32px / xl: 48px) |
| `.flag-badge` | 아바타 우하단 국기 배지 (position: absolute + 흰색 테두리) |

```html
<img src="assets/images/flags/kr.svg" alt="한국" class="flag-sm rounded">
```

### 유틸리티

| 클래스 | 설명 |
| --- | --- |
| `.m-0` ~ `.m-5`, `.m-auto`, `.mt-*`, `.mb-*`, `.ms-*`, `.me-*`, `.mx-*`, `.my-*` | 마진 (0~5) |
| `.p-0` ~ `.p-5`, `.pt-*`, `.pb-*`, `.ps-*`, `.pe-*`, `.px-*`, `.py-*` | 패딩 (0~5) |
| `.d-none`, `.d-block`, `.d-flex`, `.d-inline-flex`, `.d-grid` | 디스플레이 |
| `.flex-row`, `.flex-column`, `.flex-wrap` | Flex 방향 |
| `.align-items-start`, `center`, `end` | Flex 정렬 |
| `.justify-content-start`, `center`, `end`, `between`, `around` | Flex 배치 |
| `.gap-0` ~ `.gap-5` | 갭 |
| `.w-25`, `.w-50`, `.w-75`, `.w-100`, `.w-auto` | 너비 |
| `.h-25`, `.h-50`, `.h-75`, `.h-100` | 높이 |
| `.position-relative`, `absolute`, `fixed`, `sticky` | 위치 |
| `.top-0`, `.top-50`, `.top-100`, `.start-0`, `.end-0` | 좌표 |
| `.translate-middle`, `-middle-x`, `-middle-y` | 중앙 변환 |
| `.shadow-none`, `.shadow-sm`, `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`, `.shadow-2xl` | 그림자 |
| `.rounded`, `.rounded-circle`, `.rounded-pill`, `.rounded-0` ~ `.rounded-5` | 테두리 |
| `.opacity-25`, `.opacity-50`, `.opacity-75`, `.opacity-100` | 투명도 |
| `.overflow-hidden`, `.overflow-auto`, `.overflow-visible`, `.overflow-x-auto`, `.overflow-y-auto` | 오버플로 |
| `.text-bg-primary`, `secondary`, `success`, `danger`, `warning`, `info` | 배경+텍스트 |
| `.bg-primary`, `.bg-success`, `.bg-opacity-75`, `.bg-opacity-50` | 배경 |
| `.border-primary`, `success`, `danger`, `warning`, `info`, `light`, `dark` | 테두리 색상 |
| `.border-1` ~ `.border-5` | 테두리 두께 |
| `.container`, `.container-fluid`, `.container-sm/md/lg/xl` | 반응형 컨테이너 |
| `.vh-100`, `.vw-100`, `.min-vh-100`, `.min-w-0` | 뷰포트 크기 |
| `.order-0` ~ `.order-5`, `.order-first`, `.order-last` | Flex 순서 |
| `.visually-hidden`, `.sr-only` | 접근성 숨김 |
| `.cursor-pointer`, `default`, `not-allowed`, `grab` | 커서 |
| `.float-start`, `.float-end`, `.float-none`, `.clearfix` | 플로트 |
| `.align-top`, `.align-middle`, `.align-bottom` | 수직 정렬 |
| `.ratio`, `.ratio-1x1`, `.ratio-4x3`, `.ratio-16x9`, `.ratio-21x9` | 종횡비 |
| `.transition-all`, `.transition-none` | 트랜지션 |
| `.stretched-link` | 전체 클릭 영역 |

### 그리드

| 클래스 | 설명 |
| --- | --- |
| `.grid` | CSS Grid 컨테이너 |
| `.grid-cols-1` ~ `.grid-cols-12` | 컬럼 수 |
| `.col-span-1` ~ `.col-span-12` | 컬럼 병합 |
| `.col-span-full` | 전체 너비 |
| `.grid-rows-1` ~ `.grid-rows-6` | 행 수 |
| `.row-span-1` ~ `.row-span-6`, `.row-span-full` | 행 병합 |
| `.card-grid` | 카드 자동 배치 (`auto-fill, minmax(280px, 1fr)`) |

## Core API 시그니처

```javascript
// DOM 조작 (jQuery 스타일)
IMCAT('#selector')                     // → DOMElement (체이닝 가능)
  .addClass('name').removeClass('name').toggleClass('name').hasClass('name')
  .text('value').html('value')         // html()은 자동 XSS 이스케이프
  .rawHtml('trustedHtml')              // 신뢰 소스 전용 (이스케이프 없음)
  .attr('name', 'value').removeAttr('name').data('key', 'value')
  .css('prop', 'value').css({prop: 'value'})
  .on('event', handler).on('event', '.child', handler).off('event', handler)
  .show().hide().toggle()
  .append(el).prepend(el).appendTo(parent).remove().empty()
  .find('.child').parent().closest('.wrap').siblings().next().prev()
  .first().last().eq(0).get(0)
  .each((el, i) => {})

// 단축 API (모듈 자동 로드)
await IMCAT.alert('메시지')
await IMCAT.confirm('질문?')           // → boolean
await IMCAT.prompt('입력:', '기본값')   // → string|null
await IMCAT.modal({title, content, buttons, size})
await IMCAT.drawer({title, content, position, width})
IMCAT.toast.success(msg)  / .error(msg) / .warning(msg) / .info(msg)

// 모듈 로드
const { Modal, Drawer } = await IMCAT.use('overlays')
const Tabs = await IMCAT.use('navigation/tabs')  // 하위 모듈

// 이벤트 버스 (IMCAT 객체에 직접 노출)
IMCAT.on('eventName', callback)       // 구독 (구독 취소 함수 반환)
IMCAT.emit('eventName', data)          // 발행
IMCAT.off('eventName', callback)       // 구독 취소
IMCAT.once('eventName', callback)      // 일회성 구독

// 상태 관리
const state = IMCAT.state.create({ count: 0 })
state.watch('count', (newVal, oldVal) => {})
state.compute('double', () => state.count * 2)
state.batch(() => { state.a = 1; state.b = 2; })
state.destroy()

// 라우터
IMCAT.view.navigate('views/page.html')
IMCAT.view.afterLoad((path) => {})
// HTML: <a catui-href="views/page.html">이동</a>
// 타겟: <div catui-target="main"></div> 또는 body

// 스토리지 (TTL 지원)
IMCAT.storage.set('key', value, { expires: 3600 })  // TTL 초
IMCAT.storage.get('key')                // → 값 또는 null (만료 시 자동 삭제)
IMCAT.storage.remove('key')

// 포맷터
IMCAT.format.number(1234567)           // → "1,234,567"
IMCAT.format.currency(50000)           // → "₩50,000"
IMCAT.format.date(new Date())          // → "2025-01-01"
IMCAT.format.phone('01012345678')      // → "010-1234-5678"

// 템플릿
IMCAT.template.render('Hello {{name}}!', {name: 'World'})  // 자동 이스케이프
IMCAT.template.render('{{{rawHtml}}}', {rawHtml: '<b>굵게</b>'})  // 비이스케이프

// 설정
IMCAT.config.set('animation', false)
IMCAT.config.get('animationDuration')  // → 300

// API (HTTP)
const data = await IMCAT.api.get('/api/users')
await IMCAT.api.post('/api/users', {name: '홍길동'})

// 유틸리티
IMCAT.utils.debounce(fn, 300)
IMCAT.utils.throttle(fn, 100)
IMCAT.utils.randomId('prefix')
IMCAT.utils.clone(obj)
```

## 모듈 로드 방법 + 주요 클래스

| 모듈명 | 로드 | 주요 클래스 |
| --- | --- | --- |
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
| `theme` | `IMCAT.use('theme')` | Theme, createTheme, initTheme |
| `advanced-ui` | `IMCAT.use('advanced-ui')` | SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker |
| `social` | `IMCAT.use('social')` | ChatUI, Comments, Reactions, SocialFeed, ShareButtons |
| `imagelist` | `IMCAT.use('imagelist')` | ImageList, ImageLightbox, ImageCompare, LazyImage |
| `gantt` | `IMCAT.use('gantt')` | Gantt |
| `live-status` | `IMCAT.use('live-status')` | OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus |
| `security-input` | `IMCAT.use('security-input')` | OTPInput, PinInput |
| `text-editors` | `IMCAT.use('text-editors')` | RichTextEditor, MarkdownEditor, TextareaAutosize |
| `media-viewer` | `IMCAT.use('media-viewer')` | VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo |

## HTML 속성

| 속성 | 용도 | 예시 |
| --- | --- | --- |
| `data-imcat="컴포넌트"` | 자동 초기화 | `<div data-imcat="dropdown">` |
| `catui-href="경로"` | SPA 네비게이션 | `<a catui-href="views/page.html">` |
| `catui-target="id"` | 렌더 타겟 | `<div catui-target="main">` |
| `data-*` | 컴포넌트 옵션 | `data-position="bottom"` |

## 금지사항

- ❌ `innerHTML`에 사용자 입력 직접 삽입 → ✅ `IMCAT('#el').html(value)` 또는 `Security.escape()`
- ❌ `eval()`, `new Function()` 사용 금지
- ❌ 모듈 JS 파일 직접 import → ✅ `IMCAT.use('모듈명')`
- ❌ `.rawHtml()`에 사용자 입력 전달 금지 → 신뢰 소스 전용
