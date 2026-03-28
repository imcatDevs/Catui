# 문서 ↔ 소스 코드 심층 감사 보고서

> 생성일: 2025-01-20
> 대상: `docs/modules/*.md` 22개 vs `src/modules/*.js` 22개
> 심각도: 🔴 높음 / 🟡 중간 / 🟢 낮음 / ✅ 일치

---

## 요약

| # | 모듈 | 심각도 | 주요 이슈 |
|---|------|--------|-----------|
| 1 | media-viewer | 🔴 | VideoPlayer 6개 옵션 누락, AudioPlayer 옵션표 전무, EmbedVideo `responsive` 존재하지 않는 옵션 |
| 2 | advanced-ui | 🔴 | QRCode 옵션명 불일치, SimpleColorPicker `defaultColor`→`value`, 5개 컴포넌트 옵션표 전무 |
| 3 | carousel | 🟡 | 13개 옵션 누락, Lightbox 옵션표 전무, `onPlay`/`onPause` 이벤트 소스에 없음 |
| 4 | live-status | 🟡 | TypingIndicator `text` 옵션 존재하지 않음, 4개 컴포넌트 옵션표 전무 |
| 5 | stepper | 🟡 | 7개 옵션 누락, VerticalStepper `current`→`currentStep` 불일치 |
| 6 | pickers | 🟡 | TimePicker `format:'24h'`→`'HH:mm'`, ColorPicker 기본값 불일치, 3개 옵션표 전무 |
| 7 | forms | 🟢 | FileUpload 옵션표 전무 (예제는 정확) |
| 8 | scroll | 🔴 | 전체 옵션표 전무, SmoothScroll 객체를 `new` 생성자처럼 기술, `offset`→`threshold` 불일치 |
| 9 | selectors | 🟢 | MultiSelect/RangeSlider 옵션표 전무 |
| 10 | imagelist | 🟡 | LazyImage `selector` 불일치, ImageLightbox `open()` vs `new` 불일치 |
| 11 | navigation | 🟢 | TreeView/Sidebar/Collapse/MegaMenu 옵션표 전무 |
| 12 | overlays | ✅ | 대체로 일치 |
| 13 | dropdown | ✅ | 대체로 일치 |
| 14 | tooltips | ✅ | 대체로 일치 |
| 15 | feedback | ✅ | 대체로 일치 |
| 16 | social | 🔴 | Comments `data`→`comments`, Reactions 구조 완전 불일치, SocialFeed `items`→`posts` |
| 17 | data-viz | 🟢 | DataTable 일치, 나머지 4개 옵션표 전무 |
| 18 | gantt | 🟡 | 12개 옵션 누락 |
| 19 | pagination | 🟡 | 9개 옵션 누락 |
| 20 | theme | 🟡 | `transition` 기본값 `'fade'`→`'none'`, `transitionDuration` `300`→`800` |
| 21 | security-input | 🟢 | OTPInput 일치, PinInput 10개 옵션 누락 |
| 22 | text-editors | 🟡 | RichTextEditor `height`→`minHeight` 불일치, MarkdownEditor 옵션표 전무 |

---

## 상세 분석

### 1. media-viewer.md 🔴

#### VideoPlayer

**누락 옵션** (소스에 있지만 문서에 없음):

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `customControls` | boolean | `true` | 커스텀 컨트롤 사용 |
| `muted` | boolean | `false` | 음소거 |
| `volume` | number | `1` | 볼륨 (0~1) |
| `onEnded` | function | `null` | 재생 종료 콜백 |
| `onTimeUpdate` | function | `null` | 시간 업데이트 콜백 |
| `onError` | function | `null` | 에러 콜백 |

**누락 메서드**:
`togglePlay()`, `seek(time)`, `setVolume(volume)`, `toggleMute()`, `setPlaybackRate(rate)`, `togglePIP()`, `toggleFullscreen()`, `setSrc(src, poster)`, `getCurrentTime()`, `getDuration()`

#### AudioPlayer

- **옵션 테이블 전무**
- 소스 옵션: `src`, `title`, `artist`, `cover`, `autoplay`, `loop`, `volume`, `onPlay`, `onPause`, `onEnded`
- 누락 메서드: `togglePlay()`, `setTrack(src, title, artist, cover)`

#### ImageViewer

- 소스에 `src`, `alt`, `minZoom` (0.5), `zoomStep` (0.25) 옵션이 있으나 문서에 없음
- 누락 메서드: `zoomIn()`, `zoomOut()`, `setZoom(level)`, `rotate(degrees)`, `reset()`, `download()`, `setSrc(src, alt)`

#### EmbedVideo

- **문서 예제 `responsive: true` → 소스에 `responsive` 옵션 없음**
- 실제 옵션: `url`, `ratio` ('16x9'), `allowFullscreen`, `autoplay`, `muted`, `rounded`, `shadow`, `title`, `allow`, `loading`
- 옵션 테이블 전무, 메서드 테이블 전무
- 누락 메서드: `setSrc(url)`, `setRatio(ratio)`

---

### 2. advanced-ui.md 🔴

#### QRCode

- **예제 옵션명 불일치**: `color: '#000000'` → `colorDark: '000000'`, `background: '#FFFFFF'` → `colorLight: 'ffffff'` (# 접두사도 다름)
- 옵션 테이블 전무
- 소스 옵션: `text`, `size` (200), `colorDark` ('000000'), `colorLight` ('ffffff'), `correctLevel` ('M'), `margin` (4), `format` ('png')
- 누락 메서드: `setText(text)`, `setColors(dark, light)`, `setSize(size)`, `getImageUrl()`, `toDataURL()`, `download(filename)`

#### SimpleColorPicker

- **예제 `defaultColor: '#3B82F6'` → 소스 `value: '#3B82F6'`** (옵션명 불일치)
- 옵션 테이블 전무
- 소스 옵션: `colors` (배열), `value` ('#3b82f6'), `showInput` (true), `onChange`
- 누락 메서드: `setValue(color)`, `getValue()`

#### SplitPane

- 누락 옵션: `maxSizes`, `snapOffset`, `collapsible`, `onDragStart`, `onDragEnd`
- 누락 메서드: `setSizes(sizes)`, `getSizes()`, `collapseFirst()`, `collapseSecond()`

#### CopyToClipboard

- 옵션 테이블 전무
- 소스 옵션: `target`, `text`, `feedbackText` ('복사됨!'), `feedbackDuration` (2000), `onSuccess`, `onError`
- 누락 static 메서드: `CopyToClipboard.copy(text)`, `CopyToClipboard.copyFrom(selector)`

#### CodeBlock

- 옵션 테이블 전무
- 소스 옵션: `code`, `language` ('javascript'), `showLineNumbers` (false), `lineNumbers` (false), `copyButton` (true), `copyText` ('복사'), `copiedText` ('복사됨!'), `copiedDuration` (2000)
- 누락 메서드: `setCode(code)`

---

### 3. carousel.md 🟡

#### Carousel

**누락 옵션**:

| 옵션 | 타입 | 기본값 |
|------|------|--------|
| `items` | array | `[]` |
| `startIndex` | number | `0` |
| `counter` | boolean | `false` |
| `thumbnails` | boolean | `false` |
| `slidesToShow` | number | `1` |
| `slidesToScroll` | number | `1` |
| `speed` | number | `300` |
| `easing` | string | `'easeOutCubic'` |
| `draggable` | boolean | `true` |
| `swipeThreshold` | number | `50` |
| `responsive` | array | `null` |
| `onInit` | function | `null` |
| `ariaLabel` | string | `'캐러셀'` |

**잘못된 이벤트**: 문서에 `onPlay`/`onPause` 이벤트가 기재되어 있으나, 소스 Carousel defaults에 해당 콜백 옵션 없음

#### Lightbox

- 문서 예제에서 `images` 배열로 생성하지만, 소스는 싱글톤 + 옵션 객체로 생성 (`gallery`, `selector` 등)
- 옵션 테이블 전무
- 소스 옵션: `gallery`, `selector`, `startIndex`, `loop`, `showCounter`, `showCaption`, `showThumbnails`, `closeOnBackdrop`, `closeOnEscape`, `swipeToClose`, `zoom`, `animation`, `animationDuration`, `onOpen`, `onClose`, `onChange`

---

### 4. live-status.md 🟡

#### OnlineStatus ✅ 일치

#### TypingIndicator

- **문서 예제 `text: '상대방이 입력 중...'` → 소스에 `text` 옵션 없음**
- 실제 옵션: `users` (배열), `maxDisplay` (3), `showNames` (true), `hideAfter` (0)
- 핵심 API 누락: `addUser(userName)`, `removeUser(userName)`, `setUsers(users)`, `clear()`

#### ActivityStatus

- 옵션 테이블 전무
- 누락 옵션: `locale` ('ko-KR'), `prefix` ('마지막 활동: ')
- 누락 메서드: `setLastActivity(time)`, `updateNow()`

#### LiveCounter

- 누락 옵션: `prefix`, `decimals` (0), `easing` ('easeOutExpo'), `onChange`
- 누락 메서드: `getValue()`

#### ConnectionStatus

- 누락 옵션: `autoHideDelay` (3000), `onlineMessage`, `offlineMessage`
- 누락 메서드: `isOnline()`

---

### 5. stepper.md 🟡

#### Stepper

- 누락 옵션: `linear` (false), `showStepNumber` (true), `animated` (true), `connector` ('line'), `size` ('md'), `variant` ('default'), `onComplete`
- steps 객체: 문서 `{ title, icon?, description? }` → 소스 `{ title, subtitle, icon, content }`

#### VerticalStepper

- **옵션명 불일치**: 문서 `current: 0` → 소스 `currentStep: 0`
- 옵션 테이블 전무
- 누락 옵션: `expandable` (true), `editable` (true), `animated` (true), `onChange`, `onComplete`
- 누락 메서드: `getCurrentStep()`, `getCompletedSteps()`, `isComplete()`

---

### 6. pickers.md 🟡

#### DatePicker ✅ 일치

#### TimePicker

- **문서 예제 `format: '24h'` → 소스 `format: 'HH:mm'`** (기본값 불일치)
- 옵션 테이블 전무
- 소스 옵션: `format` ('HH:mm'), `step` (15), `placeholder` ('시간 선택'), `onChange`

#### ColorPicker

- **문서 예제 `defaultColor: '#3B82F6'` → 소스 `defaultColor: '#667eea'`** (기본값 불일치)
- 옵션 테이블 전무
- 소스 옵션: `defaultColor` ('#667eea'), `presetColors` (12색), `onChange`

#### Countdown

- 누락 옵션: `showDays` (true), `showHours` (true), `showMinutes` (true), `showSeconds` (true), `onTick`
- 옵션 테이블 전무
- 누락 메서드: `start()`, `stop()`, `reset()`

#### DDay

- 누락 옵션: `showPastDays` (true), `onChange`
- 옵션 테이블 전무
- 누락 메서드: `setTarget(date, title)`, `getDays()`

---

### 7. forms.md 🟢

#### FileUpload

- 옵션 테이블 전무 (예제는 정확)
- 소스 옵션: `accept` ('*/*'), `multiple` (false), `maxSize` (5MB), `maxFiles` (10), `dropzone` (true), `preview` (true), `showProgress` (true), `dropzoneText`, `onChange`, `onRemove`, `onError`, `onUploadStart`, `onUploadProgress`, `onUploadComplete`
- 누락 메서드: `getFiles()`, `clear()`, `setProgress(fileName, percent)`, `simulateUpload(duration)`

#### Rating ✅ 일치 (이전 수정 반영됨)

#### SignaturePad ✅ 일치

#### FormWizard ✅ 일치

---

### 8. scroll.md 🔴

**전체 모듈에 옵션 테이블 전무**

#### VirtualScroll

- 소스 옵션: `itemHeight` (50), `bufferSize` (5), `items` ([]), `renderItem`, `containerHeight` (400), `onScroll`
- 메서드: `setItems(items)`, `scrollToIndex(index)`, `refresh()`

#### Scrollspy

- **문서 예제 `nav: '#sideNav'` → 소스 `target: null`** (옵션명 불일치)
- 소스 옵션: `target`, `sections`, `offset` (100), `activeClass` ('is-active'), `smoothScroll` (true), `onChange`
- 누락 메서드: `scrollTo(id)`, `getActive()`, `refresh()`

#### InfiniteScroll

- 소스 옵션: `threshold` (200), `loadMore`, `renderItem`, `hasMore` (true), `loadingHTML`, `endHTML`, `errorHTML`, `onLoad`
- 누락 메서드: `loadMore()`, `setHasMore(hasMore)`, `reset()`, `appendItems(items)`

#### SmoothScroll

- **문서에서 `new SmoothScroll({...})` 인스턴스 생성 → 소스는 객체 리터럴 (`const SmoothScroll = {...}`)**
- 실제 API: `SmoothScroll.to(target, options)`, `SmoothScroll.toTop(options)`, `SmoothScroll.toBottom(options)`

#### BackToTop

- **문서 예제 `{ offset: 300, animation: true }` → 소스 `{ threshold: 300, smooth: true }`** (옵션명 불일치)
- 소스 옵션: `threshold` (300), `position` ('bottom-right'), `icon` ('arrow_upward'), `title` ('맨 위로'), `smooth` (true)

---

### 9. selectors.md 🟢

#### Autocomplete ✅ 일치 (이전 `delay` 수정 반영됨)

#### MultiSelect

- 옵션 테이블 전무
- 누락 옵션: `selected`, `searchable` (true), `searchPlaceholder`, `allowCreate` (false)

#### RangeSlider

- 옵션 테이블 전무
- 누락 옵션: `showTooltip` (true), `showLabels` (true), `formatValue`, `onDragEnd`

---

### 10. imagelist.md 🟡

#### ImageList ✅ 일치 (이전 수정 반영됨)

#### ImageLightbox

- **문서 예제 `ImageLightbox.open({...})` → 소스 `new ImageLightbox(options)` + 별도 `open()` 메서드 호출 필요** (사용 패턴 불일치)
- 옵션 테이블 전무
- 소스 옵션: `images`, `startIndex`, `zoom` (true), `download` (true), `counter` (true), `thumbnails` (false), `keyboard` (true), `swipe` (true), `closeOnBackdrop` (true), `animation` ('fade'), `backdropColor`, `onOpen`, `onClose`, `onChange`

#### ImageCompare

- 옵션 테이블 전무
- 누락 옵션: `initialPosition` (50), `showLabels` (true), `showHandle` (true), `handleSize` (40), `handleColor` ('#fff'), `lineWidth` (3), `lineColor` ('#fff'), `onSlide`

#### LazyImage

- **문서 예제 `selector: 'img[data-src]'` → 소스 `selector: '[data-lazy-src]'`** (셀렉터 불일치)
- 옵션 테이블 전무
- 누락 옵션: `root`, `placeholder` ('blur'), `placeholderColor`, `animation` ('fade'), `animationDuration` (300), `onLoad`, `onError`

---

### 11. navigation.md 🟢

#### Tabs ✅ 대체로 일치

#### Accordion ✅ 대체로 일치

#### Collapse, MegaMenu, TreeView, Sidebar

- 옵션 테이블 전무 (예제만 있음)

---

### 12. overlays.md ✅ 일치

- Modal, Drawer 옵션 테이블 정확
- `animationDuration` (OverlayBase에서 상속, 300) 옵션은 문서에 없으나 minor

---

### 13. dropdown.md ✅ 일치

---

### 14. tooltips.md ✅ 일치

---

### 15. feedback.md ✅ 일치

- Skeleton `height` 옵션 누락 (minor)

---

### 16. social.md 🔴

#### ChatUI

- 옵션 테이블 전무
- 소스 옵션: `messages`, `currentUser` ({id, name, avatar}), 기타 확인 필요

#### Comments

- **문서 예제 `data` → 소스 `comments`** (옵션명 불일치)
- **문서 `allowReply: true` → 소스 `allowReplies: true`** (옵션명 불일치)
- 누락 옵션: `currentUser`, `allowEdit` (true), `allowDelete` (true), `maxDepth` (3), `placeholder`, `onEdit`, `onDelete`, `onLike`

#### Reactions

- **구조 완전 불일치**: 문서 `reactions: ['👍', '❤️', ...]` (문자열 배열) → 소스 `reactions: [{ emoji, label, count, active }]` (객체 배열)
- **문서 `counts: { '👍': 12 }` → 소스에 `counts` 옵션 없음** (count는 reactions 객체 내부)
- **콜백 인자 불일치**: 문서 `onReact: (emoji, count)` → 소스 `onReact: (emoji, active)`

#### SocialFeed

- **문서 예제 `items` → 소스 `posts`** (옵션명 불일치)
- **문서 `infiniteScroll`, `onLoadMore` → 소스에 없는 옵션**
- 누락 옵션: `currentUser`, `showCompose` (true), `composePlaceholder`, `showActions` (true), `onPost`, `onLike`, `onComment`, `onShare`

#### ShareButtons

- 옵션 테이블 전무
- 누락 옵션: `description`, `image`, `layout` ('horizontal'), `size` ('md'), `showLabels` (false), `onShare`

---

### 17. data-viz.md 🟢

#### DataTable ✅ 대체로 일치

#### Chart, Masonry, Kanban, Calendar

- 옵션 테이블 전무 (예제만 있음)

---

### 18. gantt.md 🟡

- 누락 옵션 12개: `todayLine` (true), `weekends` (true), `taskHeight` (36), `rowHeight` (48), `headerHeight` (60), `sidebarWidth` (280), `showProgress` (true), `showDependencies` (true), `colors` (객체), `locale` ('ko-KR'), `dateFormat` (객체), `onViewChange`

---

### 19. pagination.md 🟡

- 누락 옵션 9개: `containerClass`, `buttonClass`, `activeClass` ('is-active'), `disabledClass` ('is-disabled'), `ellipsisHTML` ('...'), `prevHTML`, `nextHTML`, `firstHTML`, `lastHTML`

---

### 20. theme.md 🟡

- **기본값 불일치**: 문서 `transition: 'fade'` → 소스 `transition: 'none'`
- **기본값 불일치**: 문서 `transitionDuration: 300` → 소스 `transitionDuration: 800`
- 문서 transition 옵션에 `'circle'`, `'circle-*'` 변형 누락
- 누락 옵션: `themes` (커스텀 테마 정의 객체)
- 누락 메서드: `toggleWithEvent(event)` (클릭 위치 기반 전환)

---

### 21. security-input.md 🟢

#### OTPInput ✅ 대체로 일치

- `onFocus`, `onBlur` 옵션 누락 (minor)

#### PinInput

- 누락 옵션 10개: `showToggle` (true), `numeric` (true), `autoFocus` (true), `autoSubmit` (true), `disabled` (false), `error` (false), `errorMessage` (''), `keypad` (false), `shuffleKeypad` (false), `onChange`

---

### 22. text-editors.md 🟡

#### RichTextEditor

- **옵션명 불일치**: 문서 `height: '200px'` → 소스 `minHeight: 200` (단위도 다름)
- **문서에 `maxLength: 0` → 소스 defaults에 없음** (소스에는 `maxHeight: 600` 있음)
- 누락 옵션: `maxHeight` (600), `onFocus`, `onBlur`

#### MarkdownEditor

- 옵션 테이블 전무
- 소스 옵션: `value` (''), `placeholder`, `preview` (true), `splitView` (true), `toolbar` (배열), `minHeight` (300), `onChange`

#### TextareaAutosize

- 옵션 테이블 전무
- 소스 옵션: `minRows` (2), `maxRows` (10), `toolbar` (null), `showCount` (false), `maxLength` (0), `onChange`

---

## 통계

| 구분 | 수량 |
|------|------|
| 🔴 심각 불일치 | 4개 (media-viewer, advanced-ui, scroll, social) |
| 🟡 중간 불일치 | 8개 (carousel, live-status, stepper, pickers, imagelist, gantt, pagination, theme, text-editors) |
| 🟢 경미/옵션표 누락 | 6개 (forms, selectors, navigation, data-viz, security-input) |
| ✅ 일치 | 4개 (overlays, dropdown, tooltips, feedback) |

### 불일치 유형별 분류

- **존재하지 않는 옵션 사용**: 5건 (EmbedVideo `responsive`, TypingIndicator `text`, SocialFeed `infiniteScroll`/`onLoadMore`, Reactions `counts`)
- **옵션명 불일치**: 12건 (QRCode `color`/`background`, SimpleColorPicker `defaultColor`, Comments `data`/`allowReply`, SocialFeed `items`, Scrollspy `nav`, BackToTop `offset`/`animation`, VerticalStepper `current`, TimePicker `format`, RichTextEditor `height`)
- **기본값 불일치**: 3건 (theme `transition`/`transitionDuration`, ColorPicker `defaultColor`)
- **구조 불일치**: 2건 (Reactions `reactions` 배열 구조, SmoothScroll 객체 vs 클래스)
- **옵션 테이블 전무**: 약 30개 컴포넌트
- **메서드 테이블 누락/불완전**: 약 20개 컴포넌트
