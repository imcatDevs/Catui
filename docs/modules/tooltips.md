# Tooltips

Tooltip, Popover — 호버/클릭 시 표시되는 팝업 컴포넌트를 제공합니다.

> 소스: `src/modules/tooltips.js`
>
> **이 문서의 핵심**: `IMCAT.use('tooltips')` → { Tooltip, Popover }.
> 단축: `IMCAT.tooltip(el, content)`, `IMCAT.popover(el, {title, content})`.

## 로드 방법

```javascript
const { Tooltip, Popover } = await IMCAT.use('tooltips');
```

---

## Tooltip

간단한 텍스트 힌트입니다. `data-tooltip` 또는 `title` 속성에서 자동으로 내용을 읽습니다.

```javascript
const { Tooltip } = await IMCAT.use('tooltips');
new Tooltip('#myBtn', {
  content: '저장합니다',
  placement: 'top',
  trigger: 'hover',
  delay: { show: 0, hide: 100 },
  offset: 8,
  html: false,
  animation: true,
  container: document.body
});

// 선언적
// <button data-tooltip="도움말" data-placement="top">호버</button>
```

### Tooltip 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `content` | string | *(data-tooltip/title에서 읽음)* | 툴팁 내용 |
| `placement` | string | `'top'` | 위치 (`'top'`/`'bottom'`/`'left'`/`'right'`) |
| `trigger` | string | `'hover'` | 트리거 (`'hover'`/`'click'`/`'focus'`/`'manual'`, 공백 구분 복수) |
| `delay` | object | `{ show: 0, hide: 100 }` | 표시/숨김 지연 (ms) |
| `offset` | number | `8` | 요소로부터 거리 (px) |
| `html` | boolean | `false` | HTML 콘텐츠 허용 (`Security.sanitize()` 적용) |
| `animation` | boolean | `true` | 애니메이션 |
| `container` | HTMLElement | `document.body` | 툴팁 삽입 컨테이너 |

### Tooltip 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 표시 |
| `.hide()` | 숨김 |
| `.toggle()` | 토글 |
| `.setContent(content)` | 내용 변경 |
| `.destroy()` | 인스턴스 제거 |

### Tooltip 정적 메서드

| 메서드 | 설명 |
| --- | --- |
| `Tooltip.initAll(selector?)` | `[data-tooltip]`, `[title]` 자동 초기화 |

---

## Popover

제목과 내용이 있는 풍선 도움말입니다. 한 번에 하나만 표시됩니다.

```javascript
const { Popover } = await IMCAT.use('tooltips');
new Popover('#helpBtn', {
  title: '도움말',
  content: '이 기능은 데이터를 자동 저장합니다.',
  placement: 'bottom',
  trigger: 'click',
  html: true,
  offset: 10,
  animation: true,
  dismissible: true,
  container: document.body
});
```

### Popover 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 팝오버 제목 |
| `content` | string | `''` | 팝오버 내용 |
| `placement` | string | `'top'` | 위치 (`'top'`/`'bottom'`/`'left'`/`'right'`) |
| `trigger` | string | `'click'` | 트리거 (`'click'`/`'hover'`/`'focus'`/`'manual'`) |
| `html` | boolean | `true` | HTML 콘텐츠 허용 (`Security.sanitize()` 적용) |
| `offset` | number | `10` | 요소로부터 거리 (px) |
| `animation` | boolean | `true` | 애니메이션 |
| `dismissible` | boolean | `true` | 외부 클릭 닫기 + 닫기 버튼 |
| `container` | HTMLElement | `document.body` | 팝오버 삽입 컨테이너 |

### Popover 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 표시 |
| `.hide()` | 숨김 |
| `.toggle()` | 토글 |
| `.setContent(content)` | 내용 변경 |
| `.setTitle(title)` | 제목 변경 |
| `.destroy()` | 인스턴스 제거 |

### Popover 정적 메서드

| 메서드 | 설명 |
| --- | --- |
| `Popover.initAll(selector?)` | `[data-popover-content]`, `[data-content]` 자동 초기화 |

---

## 관련 문서

- [Dropdown](dropdown.md) — 메뉴형 팝업
- [Auto Init](../core/auto-init.md) — 선언적 초기화
