# Tooltips

Tooltip, Popover — 호버/클릭 시 표시되는 팝업 컴포넌트를 제공합니다.

> 소스: `src/modules/tooltips.js`
>
> **이 문서의 핵심**: `IMCAT.use('tooltips')` → Tooltip, Popover.
> 단축: `IMCAT.tooltip(el, content)`, `IMCAT.popover(el, {title, content})`.

## 로드 방법

```javascript
const { Tooltip, Popover } = await IMCAT.use('tooltips');
```

## Tooltip

```javascript
const { Tooltip } = await IMCAT.use('tooltips');
new Tooltip('#myBtn', {
  content: '저장합니다',
  placement: 'top'
});

// 선언적
// <button data-imcat="tooltip" data-content="도움말">호버</button>
```

### Tooltip 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `content` | string | `''` | 툴팁 내용 |
| `placement` | string | `'top'` | 위치 (`'top'`/`'bottom'`/`'left'`/`'right'`) |
| `trigger` | string | `'hover'` | 트리거 (`'hover'`/`'click'`/`'focus'`/`'manual'`) |
| `delay` | object | `{ show: 0, hide: 100 }` | 표시/숨김 지연 (ms) |
| `offset` | number | `8` | 요소로부터 거리 (px) |
| `html` | boolean | `false` | HTML 콘텐츠 허용 |
| `animation` | boolean | `true` | 애니메이션 |

## Popover

제목과 내용이 있는 풍선 도움말입니다.

```javascript
const { Popover } = await IMCAT.use('tooltips');
new Popover('#helpBtn', {
  title: '도움말',
  content: '이 기능은 데이터를 자동 저장합니다.',
  placement: 'bottom',
  trigger: 'click'
});
```

### Popover 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 팝오버 제목 |
| `content` | string | `''` | 팝오버 내용 |
| `placement` | string | `'top'` | 위치 (`'top'`/`'bottom'`/`'left'`/`'right'`) |
| `trigger` | string | `'click'` | 트리거 (`'click'`/`'hover'`/`'focus'`/`'manual'`) |
| `dismissible` | boolean | `true` | 외부 클릭 닫기 + 닫기 버튼 |

## 메서드 (공통)

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 표시 |
| `.hide()` | 숨김 |
| `.toggle()` | 토글 |
| `.destroy()` | 제거 |

## 관련 문서

- [Dropdown](dropdown.md) — 메뉴형 팝업
- [Auto Init](../core/auto-init.md) — 선언적 초기화
