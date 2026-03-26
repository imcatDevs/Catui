# Overlays

Modal, Drawer, Offcanvas — 오버레이 UI 컴포넌트를 제공합니다. 모두 `OverlayBase`를 상속합니다.

> 소스: `src/modules/overlays.js`
>
> **이 문서의 핵심**: `IMCAT.use('overlays')` → { Modal, Drawer, Offcanvas }.
> 단축: `IMCAT.modal({...})`, `IMCAT.alert()`, `IMCAT.confirm()`, `IMCAT.drawer({...})`.
> 반드시 `destroy()` 호출하여 메모리 정리.

## 로드 방법

```javascript
const { Modal, Drawer, Offcanvas } = await IMCAT.use('overlays');

// 하위 모듈 로딩
const Modal = await IMCAT.use('overlays/modal');
```

---

## Modal

### 기본 사용

```javascript
const { Modal } = await IMCAT.use('overlays');
const modal = new Modal({
  title: '확인',
  content: '<p>저장하시겠습니까?</p>',
  size: 'md',
  centered: false,
  scrollable: false,
  fullscreen: false,
  closeButton: true,
  buttons: [
    { text: '취소', variant: 'secondary', close: true },
    { text: '저장', variant: 'primary', action: () => save(), close: true }
  ],
  backdrop: true,
  backdropClose: true,
  keyboard: true,
  animation: true,
  animationDuration: 300,
  onShow: () => console.log('표시'),
  onHide: () => console.log('숨김'),
  onDestroy: () => console.log('제거')
});
modal.show();
```

### 단축 API

```javascript
await IMCAT.alert('알림 메시지');
const ok = await IMCAT.confirm('삭제하시겠습니까?');
const name = await IMCAT.prompt('이름을 입력하세요:', '기본값');
await IMCAT.modal({ title: '제목', content: '내용' });
```

### Modal 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 모달 제목 |
| `content` | string/HTMLElement | `''` | 모달 내용 (HTML 문자열 또는 DOM 요소) |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`/`'xl'`) |
| `centered` | boolean | `false` | 수직 중앙 정렬 |
| `scrollable` | boolean | `false` | 내용 스크롤 허용 |
| `fullscreen` | boolean | `false` | 전체 화면 |
| `closeButton` | boolean | `true` | X 버튼 |
| `buttons` | array | `[]` | 버튼 배열 |
| `backdrop` | boolean | `true` | 백드롭 |
| `backdropClose` | boolean | `true` | 백드롭 클릭 닫기 |
| `keyboard` | boolean | `true` | ESC 키 닫기 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onShow` | function | `null` | 표시 콜백 |
| `onHide` | function | `null` | 숨김 콜백 |
| `onDestroy` | function | `null` | 제거 콜백 |

### 버튼 객체

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `text` | string | 버튼 텍스트 |
| `variant`/`type` | string | 색상 (`'primary'`/`'secondary'`/`'danger'` 등) |
| `action` | function/`'close'` | 클릭 콜백 또는 `'close'`로 자동 닫기 |
| `close` | boolean | 클릭 시 모달 닫기 |

### Modal 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 모달 표시 (async) |
| `.hide()` | 모달 숨김 (async) |
| `.setContent(content)` | 내용 변경 (string/HTMLElement) |
| `.setTitle(title)` | 제목 변경 |
| `.on(event, handler)` | 이벤트 구독 (`'beforeShow'`/`'show'`/`'beforeHide'`/`'hide'`) |
| `.destroy()` | 제거 + 메모리 정리 (async) |

### Modal 정적 메서드

| 메서드 | 설명 |
| --- | --- |
| `Modal.confirm(options)` | 확인 다이얼로그 → `Promise<boolean>` |
| `Modal.alert(options)` | 알림 다이얼로그 → `Promise<void>` |

---

## Drawer

사이드에서 슬라이드되는 패널입니다. `OverlayBase`를 상속합니다.

```javascript
const { Drawer } = await IMCAT.use('overlays');
const drawer = new Drawer({
  title: '설정',
  content: '<p>설정 내용</p>',
  position: 'right',
  width: '400px',
  closeButton: true,
  backdrop: true,
  backdropClose: true,
  keyboard: true,
  animation: true,
  animationDuration: 300,
  onShow: null,
  onHide: null,
  onDestroy: null
});
drawer.show();
```

### Drawer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 제목 |
| `content` | string/HTMLElement | `''` | 내용 |
| `position` | string | `'right'` | 위치 (`'left'`/`'right'`/`'top'`/`'bottom'`) |
| `width` | string | `'320px'` | 너비 (left/right 시) |
| `height` | string | `'100%'` | 높이 (top/bottom 시) |
| `closeButton` | boolean | `true` | X 버튼 |
| `backdrop` | boolean | `true` | 백드롭 |
| `backdropClose` | boolean | `true` | 백드롭 클릭 닫기 |
| `keyboard` | boolean | `true` | ESC 키 닫기 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onShow` | function | `null` | 표시 콜백 |
| `onHide` | function | `null` | 숨김 콜백 |
| `onDestroy` | function | `null` | 제거 콜백 |

### Drawer 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 드로어 표시 (async) |
| `.hide()` | 드로어 숨김 (async) |
| `.on(event, handler)` | 이벤트 구독 |
| `.destroy()` | 제거 + 메모리 정리 (async) |

---

## Offcanvas

`Drawer`의 변형입니다. 동일한 옵션/메서드를 사용하며, `offcanvas` CSS 클래스가 추가됩니다.

```javascript
const { Offcanvas } = await IMCAT.use('overlays');
new Offcanvas({
  title: '메뉴',
  content: '<nav>...</nav>',
  position: 'top',
  height: '300px'
}).show();
```

---

## 포커스 트랩

Modal/Drawer가 열리면 **포커스가 내부에 갇힙니다** (접근성).

- Tab 키를 누르면 내부 요소 사이에서만 이동
- 닫히면 이전 포커스 위치로 자동 복원
- 백드롭/ESC 닫기도 포커스 복원 적용

## 주의사항

- `content`에 사용자 입력 직접 전달 금지 → `Security.escape()` 처리 후 전달
- 뷰 전환 시 모달 미정리 방지 → `IMCAT.view.registerInstance(modal)` 사용

## 관련 문서

- [Buttons CSS](../css/buttons.md) — 모달 내 버튼 스타일
- [구현 패턴](../PATTERNS.md) — 모달 확인 다이얼로그 패턴
