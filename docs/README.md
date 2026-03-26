# IMCAT UI 개발 가이드

경량 제로빌드 ES6+ 웹 프레임워크 — 동적 모듈 로딩, SPA 라우팅, XSS 자동 방어

> **버전**: 1.1.2 | **라이선스**: MIT | **홈페이지**: [imcat.dev](https://imcat.dev) | **데모**: [catui.imcat.dev](https://catui.imcat.dev/)

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| CSS 클래스 | BEM | `.btn`, `.btn__icon`, `.btn--primary` |
| JS 옵션 | camelCase | `closeOnClick`, `animationDuration` |
| JS 이벤트 | camelCase | `onShow`, `onChange`, `onDestroy` |
| HTML 속성 | kebab-case | `data-imcat`, `catui-href`, `catui-target` |

## 문서 구조

### 시작하기

- [시작하기 (설치 ~ 첫 페이지)](getting-started.md)

### Core API

| 문서 | 설명 |
| --- | --- |
| [DOM](core/dom.md) | jQuery 스타일 DOM 조작, 체이닝, 자동 XSS 방어 |
| [Router](core/router.md) | SPA 라우팅, `catui-href` 속성, 뷰 관리 |
| [Events](core/events.md) | EventBus (글로벌) + EventEmitterMixin (컴포넌트) |
| [State](core/state.md) | Proxy 기반 리액티브 상태 관리 |
| [Storage](core/storage.md) | localStorage/sessionStorage + TTL |
| [Template](core/template.md) | 머스태시 템플릿 엔진, 자동 이스케이프 |
| [Formatters](core/formatters.md) | 숫자, 날짜, 통화, 전화번호 포맷 |
| [API](core/api.md) | HTTP 클라이언트 (fetch 래퍼, 인터셉터) |
| [Config](core/config.md) | 글로벌 설정, 컴포넌트별 기본값 |
| [Auto Init](core/auto-init.md) | `data-imcat` 선언적 초기화 |

### CSS 클래스

| 문서 | 설명 |
| --- | --- |
| [Typography](css/typography.md) | 제목, 본문, 인라인 텍스트 스타일 |
| [Buttons](css/buttons.md) | 버튼 색상, 크기, 형태 변형 |
| [Cards](css/cards.md) | 카드 레이아웃, 변형, 미디어 |
| [Forms](css/forms.md) | 입력 필드, 셀렉트, 체크박스, 스위치 |
| [Tables](css/tables.md) | 테이블 스타일, 스트라이프, 호버 |
| [Alerts](css/alerts.md) | 알림 메시지 색상, 아이콘, 닫기 |
| [Badges](css/badges.md) | 배지, 라벨, 도트 |
| [Lists](css/lists.md) | 리스트 컴포넌트, 구분선 |
| [Progress](css/progress.md) | 프로그레스 바, 색상, 애니메이션 |
| [Avatars](css/avatars.md) | 아바타 크기, 형태, 그룹 |
| [Flags](css/flags.md) | SVG 국기 아이콘, 크기, 배지 |
| [Grid & Layout](css/grid-layout.md) | CSS Grid, Flexbox, 반응형 |
| [Utilities](css/utilities.md) | spacing, display, shadow, border-radius 등 |

### 확장 모듈 (22개)

| 문서 | 모듈명 | 컴포넌트 |
| --- | --- | --- |
| [Overlays](modules/overlays.md) | `overlays` | Modal, Drawer, Offcanvas |
| [Dropdown](modules/dropdown.md) | `dropdown` | Dropdown |
| [Tooltips](modules/tooltips.md) | `tooltips` | Tooltip, Popover |
| [Navigation](modules/navigation.md) | `navigation` | Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar |
| [Feedback](modules/feedback.md) | `feedback` | Toast, Notification, ProgressTracker, Skeleton |
| [Carousel](modules/carousel.md) | `carousel` | Carousel, Lightbox |
| [Pickers](modules/pickers.md) | `pickers` | DatePicker, TimePicker, ColorPicker, Countdown, DDay |
| [Selectors](modules/selectors.md) | `selectors` | Autocomplete, MultiSelect, RangeSlider |
| [Forms](modules/forms.md) | `forms` | FileUpload, Rating, SignaturePad, FormWizard |
| [Data Viz](modules/data-viz.md) | `data-viz` | DataTable, Chart, Masonry, Kanban, Calendar |
| [Stepper](modules/stepper.md) | `stepper` | Stepper, VerticalStepper |
| [Scroll](modules/scroll.md) | `scroll` | VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop |
| [Pagination](modules/pagination.md) | `pagination` | Pagination |
| [Theme](modules/theme.md) | `theme` | Theme, createTheme, initTheme |
| [Advanced UI](modules/advanced-ui.md) | `advanced-ui` | SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker |
| [Social](modules/social.md) | `social` | ChatUI, Comments, Reactions, SocialFeed, ShareButtons |
| [ImageList](modules/imagelist.md) | `imagelist` | ImageList, ImageLightbox, ImageCompare, LazyImage |
| [Gantt](modules/gantt.md) | `gantt` | Gantt |
| [Live Status](modules/live-status.md) | `live-status` | OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus |
| [Security Input](modules/security-input.md) | `security-input` | OTPInput, PinInput |
| [Text Editors](modules/text-editors.md) | `text-editors` | RichTextEditor, MarkdownEditor, TextareaAutosize |
| [Media Viewer](modules/media-viewer.md) | `media-viewer` | VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo |

### 성능, 보안, 커뮤니티, 영어 문서

- [성능 최적화 가이드](performance/optimization-guide.md) — VirtualScroll, 무한 스크롤, 캐싱, 압축
- [보안 가이드](security/csp-guide.md) — CSP, XSS, CSRF, 보안 업데이트
- [커뮤니티 가이드](community/plugin-guide.md) — 플러그인 개발, 커뮤니티 참여
- [영어 문서](../README.en.md) — 프로젝트 개요, 시작하기

### AI / 레퍼런스

- [치트시트 (전체 요약)](CHEATSHEET.md) — AI가 하나만 읽어도 코드 생성 가능
- [구현 패턴 모음](PATTERNS.md) — CRUD, 폼 검증, SPA 레이아웃 등 완전한 코드

### API 레퍼런스

- [JSDoc API 문서](jsdoc/index.html) — 자동 생성 상세 API 레퍼런스
