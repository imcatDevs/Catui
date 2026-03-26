# Overlays

Modal, Drawer, Offcanvas — 오버레이 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/overlays.js`
>
> **이 문서의 핵심**: `IMCAT.use('overlays')` → Modal, Drawer, Offcanvas.
> 단축: `IMCAT.modal({...})`, `IMCAT.alert()`, `IMCAT.confirm()`, `IMCAT.drawer({...})`.
> 반드시 `destroy()` 호출하여 메모리 정리.

## 로드 방법

```javascript
const { Modal, Drawer, Offcanvas } = await IMCAT.use('overlays');

// 하위 모듈 로딩
const Modal = await IMCAT.use('overlays/modal');
```

## Modal

### 기본 사용

```javascript
const { Modal } = await IMCAT.use('overlays');
const modal = new Modal({
  title: '확인',
  content: '<p>저장하시겠습니까?</p>',
  buttons: [
    { text: '취소', variant: 'secondary', close: true },
    { text: '저장', variant: 'primary', action: () => save(), close: true }
  ]
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
| `content` | string | `''` | 모달 내용 (HTML) |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`/`'xl'`) |
| `buttons` | array | `[]` | 버튼 배열 |
| `closeButton` | boolean | `true` | X 버튼 표시 |
| `backdrop` | boolean | `true` | 백드롭 표시 |
| `backdropClose` | boolean | `true` | 백드롭 클릭 닫기 |
| `keyboard` | boolean | `true` | ESC 키 닫기 |
| `centered` | boolean | `false` | 수직 중앙 정렬 |
| `scrollable` | boolean | `false` | 내용 스크롤 허용 |
| `fullscreen` | boolean | `false` | 전체 화면 모달 |
| `animation` | boolean | `true` | 애니메이션 활성화 |
| `onShow` | function | `null` | 표시 콜백 |
| `onHide` | function | `null` | 숨김 콜백 |
| `onDestroy` | function | `null` | 삭제 콜백 |

### 버튼 객체

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `text` | string | 버튼 텍스트 |
| `variant` | string | 색상 (`'primary'`/`'secondary'`/`'danger'` 등) |
| `action` | function | 클릭 콜백 |
| `close` | boolean | 클릭 시 모달 닫기 |

### Modal 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 모달 표시 |
| `.hide()` | 모달 숨김 |
| `.destroy()` | 모달 제거 + 메모리 정리 |

## Drawer

사이드에서 슬라이드되는 패널입니다.

```javascript
const { Drawer } = await IMCAT.use('overlays');
const drawer = new Drawer({
  title: '설정',
  content: '<p>설정 내용</p>',
  position: 'right',
  width: '400px'
});
drawer.show();

// 단축 API
await IMCAT.drawer({ title: '필터', content: '필터 내용', position: 'left' });
```

### Drawer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 제목 |
| `content` | string | `''` | 내용 (HTML) |
| `position` | string | `'right'` | 위치 (`'left'`/`'right'`/`'top'`/`'bottom'`) |
| `width` | string | `'320px'` | 너비 (left/right 시) |
| `height` | string | `'100%'` | 높이 (top/bottom 시) |
| `closeButton` | boolean | `true` | X 버튼 |
| `backdrop` | boolean | `true` | 백드롭 |
| `backdropClose` | boolean | `true` | 백드롭 클릭 닫기 |
| `keyboard` | boolean | `true` | ESC 키 닫기 |

## Offcanvas

전체 너비/높이 오프캔버스 패널입니다.

```javascript
const { Offcanvas } = await IMCAT.use('overlays');
new Offcanvas({
  title: '메뉴',
  content: '<nav>...</nav>',
  position: 'top',
  height: '300px'
}).show();
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onShow` | `()` | 모달/드로어/오프캔버스 표시 후 |
| `onHide` | `()` | 숨김 후 |
| `onDestroy` | `()` | DOM 제거 후 |

## 포커스 트랩

Modal이 열리면 **포커스가 모달 내부에 갇힙니다** (접근성).

- Tab 키를 누르면 모달 내부 요소 사이에서만 이동
- 모달이 닫히면 이전 포커스 위치로 자동 복원
- 백드롭/ESC 닫기도 포커스 복원 적용

## ⚠️ 주의사항

- ❌ `content`에 사용자 입력 직접 전달 → ✅ `Security.escape()` 처리 후 전달
- ❌ 뷰 전환 시 모달 미정리 → ✅ `IMCAT.view.registerInstance(modal)` 사용

## 관련 문서

- [Buttons CSS](../css/buttons.md) — 모달 내 버튼 스타일
- [구현 패턴](../PATTERNS.md) — 모달 확인 다이얼로그 패턴
