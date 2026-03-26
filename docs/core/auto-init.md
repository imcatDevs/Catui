# Auto Init

`data-imcat` HTML 속성으로 JavaScript 없이 컴포넌트를 선언적으로 초기화합니다.

> 소스: `src/core/auto-init.js`
>
> **이 문서의 핵심**: `<div data-imcat="dropdown">` → 자동 Dropdown 생성.
> 옵션: `data-*` 속성 (JSON, boolean, number 자동 파싱). MutationObserver 동적 감지.

## 기본 사용법

HTML 속성만으로 컴포넌트가 초기화됩니다.

```html
<!-- 드롭다운 -->
<button data-imcat="dropdown"
        data-items='[{"text":"수정","icon":"edit"},{"text":"삭제","icon":"delete"}]'
        class="btn btn--outline">
  메뉴
</button>

<!-- 툴팁 -->
<span data-imcat="tooltip" data-content="도움말입니다">호버하세요</span>

<!-- 모달 트리거 -->
<button data-imcat="modal" data-title="안내" data-content="모달 내용" class="btn btn--primary">
  모달 열기
</button>
```

## 지원 컴포넌트

| `data-imcat` 값 | 컴포넌트 | 주요 data-* 옵션 |
| --- | --- | --- |
| `dropdown` | Dropdown | `data-items`, `data-position` |
| `modal` | Modal | `data-title`, `data-content`, `data-size` |
| `drawer` | Drawer | `data-title`, `data-position`, `data-width` |
| `offcanvas` | Offcanvas | `data-title`, `data-position` |
| `tooltip` | Tooltip | `data-content`, `data-position` |
| `popover` | Popover | `data-title`, `data-content` |
| `tabs` | Tabs | `data-animation` |
| `accordion` | Accordion | `data-multiple` |
| `carousel` | Carousel | `data-autoplay`, `data-interval` |
| `confirm` | Confirm | `data-message`, `data-on-confirm` |
| `copy` | Copy | `data-text` |
| `scroll-top` | ScrollToTop | — |
| `scroll-to` | ScrollTo | `data-target` |
| `toggle` | ToggleClass | `data-target`, `data-class` |

## 옵션 전달 규칙

`data-*` 속성 값은 자동으로 타입 파싱됩니다.

| 형식 | 파싱 결과 | 예시 |
| --- | --- | --- |
| `"true"` / `"false"` | boolean | `data-closable="true"` → `true` |
| 숫자 | number | `data-offset="8"` → `8` |
| JSON | object/array | `data-items='[...]'` → Array |
| 문자열 | string | `data-position="bottom"` → `"bottom"` |

## 동적 요소 감지

MutationObserver가 DOM에 추가된 요소도 자동 감지합니다.

```javascript
// JS로 동적 추가해도 자동 초기화
const btn = document.createElement('button');
btn.setAttribute('data-imcat', 'tooltip');
btn.setAttribute('data-content', '동적 툴팁');
document.body.appendChild(btn);
// → 자동으로 Tooltip 생성됨
```

## 커스텀 컴포넌트 등록

```javascript
IMCAT.autoInit.register('my-widget', (element, options) => {
  return new MyWidget(element, options);
});
```

```html
<div data-imcat="my-widget" data-color="red">커스텀 위젯</div>
```

## 인스턴스 접근

```javascript
const instance = IMCAT.autoInit.getInstance(element);
// 또는
const instance = element._imcatInstance;
```

## ⚠️ 주의사항

- ❌ `data-imcat` 값에 존재하지 않는 컴포넌트명 → 무시됨 (에러 없음)
- ❌ data-* JSON에 작은따옴표 사용 → ✅ `data-items='[{"text":"항목"}]'` (속성은 작은따옴표, JSON은 큰따옴표)

## 관련 문서

- [Router](router.md) — 뷰 전환 시 자동 초기화
- [Dropdown 모듈](../modules/dropdown.md) — Dropdown JS API
