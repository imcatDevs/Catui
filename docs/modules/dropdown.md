# Dropdown

드롭다운 메뉴 컴포넌트를 제공합니다.

> 소스: `src/modules/dropdown.js`
>
> **이 문서의 핵심**: `IMCAT.use('dropdown')` → Dropdown.
> items 배열: `{ text, icon, action, divider }`. 키보드 네비게이션 지원.

## 로드 방법

```javascript
const Dropdown = await IMCAT.use('dropdown');
```

## 기본 사용

```javascript
const Dropdown = await IMCAT.use('dropdown');
const dd = new Dropdown('#menuBtn', {
  items: [
    { text: '수정', icon: 'edit', action: () => edit() },
    { text: '복사', icon: 'content_copy', action: () => copy() },
    { divider: true },
    { text: '삭제', icon: 'delete', action: () => remove(), className: 'text-danger' }
  ]
});
```

## 선언적 초기화

```html
<button data-imcat="dropdown"
        data-items='[{"text":"수정","icon":"edit"},{"text":"삭제","icon":"delete"}]'
        data-position="bottom"
        class="btn btn--outline">
  메뉴 <i class="material-icons-outlined" style="font-size:16px">expand_more</i>
</button>
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` | array | `[]` | 메뉴 아이템 배열 |
| `position` | string | `'bottom'` | 위치 (`'top'`/`'bottom'`/`'left'`/`'right'`) |
| `align` | string | `'start'` | 정렬 (`'start'`/`'center'`/`'end'`) |
| `offset` | number | `4` | 트리거로부터 거리 (px) |
| `closeOnClick` | boolean | `true` | 아이템 클릭 시 닫기 |
| `closeOnOutside` | boolean | `true` | 외부 클릭 시 닫기 |
| `openOnHover` | boolean | `false` | 호버 시 열기 |
| `hoverDelay` | number | `200` | 호버 지연 (ms) |
| `keyboard` | boolean | `true` | 키보드 네비게이션 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `200` | 애니메이션 시간 (ms) |
| `onShow` | function | `null` | 표시 콜백 |
| `onHide` | function | `null` | 숨김 콜백 |
| `onSelect` | function | `null` | 아이템 선택 콜백 |
| `onDestroy` | function | `null` | 제거 콜백 |

## items 배열 구조

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `text` | string | 메뉴 텍스트 |
| `icon` | string | Material Icon 이름 |
| `action` | function | 클릭 콜백 |
| `divider` | boolean | 구분선 (`true` 시 다른 키 무시) |
| `header` | string | 섹션 헤더 텍스트 |
| `disabled` | boolean | 비활성 상태 |
| `active` | boolean | 활성 상태 (하이라이트) |
| `danger` | boolean | 위험 색상 표시 |
| `className` | string | 추가 CSS 클래스 |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.show()` | 드롭다운 열기 |
| `.hide()` | 드롭다운 닫기 |
| `.toggle()` | 토글 |
| `.destroy()` | 제거 + 메모리 정리 |

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onShow` | `()` | 드롭다운 열림 후 |
| `onHide` | `()` | 드롭다운 닫힘 후 |
| `onSelect` | `(item, index)` | 아이템 선택 시 |

## 관련 문서

- [Auto Init](../core/auto-init.md) — `data-imcat="dropdown"` 선언적 사용
- [Tooltips](tooltips.md) — 유사한 팝업 UI
