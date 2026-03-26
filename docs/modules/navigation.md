# Navigation

Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar — 네비게이션 컴포넌트를 제공합니다.

> 소스: `src/modules/navigation.js` (어그리게이터) → `src/modules/navigation/*.js`
>
> **이 문서의 핵심**: `IMCAT.use('navigation')` → { Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar }.
> 하위 모듈 로딩: `IMCAT.use('navigation/tabs')` 등.

## 로드 방법

```javascript
const { Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar } = await IMCAT.use('navigation');
const Tabs = await IMCAT.use('navigation/tabs');  // 하위 모듈
```

---

## Tabs

HTML `role="tablist"` / `role="tab"` / `role="tabpanel"` 구조 기반. ARIA, 키보드 탐색 지원.

```javascript
const { Tabs } = await IMCAT.use('navigation');
const tabs = new Tabs('#myTabs', {
  activeIndex: 0,
  orientation: 'horizontal',
  keyboard: true,
  animation: true,
  animationDuration: 300,
  onChange: (index, tab, panel) => console.log('탭:', index),
  onDestroy: null
});
```

### Tabs 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `activeIndex` | number | `0` | 초기 활성 탭 |
| `orientation` | string | `'horizontal'` | 방향 (`'horizontal'`/`'vertical'`) |
| `keyboard` | boolean | `true` | 키보드 탐색 |
| `animation` | boolean | `true` | 전환 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onChange` | function | `null` | 변경 콜백 `(index, tab, panel)` |
| `onDestroy` | function | `null` | 정리 콜백 |

### Tabs 메서드

| 메서드 | 설명 |
| --- | --- |
| `.select(index)` | 특정 탭 활성화 |
| `.getActiveIndex()` | 현재 활성 탭 인덱스 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## Accordion

`.accordion__item` > `.accordion__trigger` + `.accordion__content` 구조 기반. ARIA 지원.

```javascript
const { Accordion } = await IMCAT.use('navigation');
new Accordion('#myAccordion', {
  multiple: false,
  expandFirst: true,
  animation: true,
  animationDuration: 300,
  onChange: (index, isOpen, item) => console.log(index, isOpen),
  onDestroy: null
});
```

### Accordion 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `multiple` | boolean | `false` | 동시 다중 열기 |
| `expandFirst` | boolean | `true` | 첫 번째 패널 자동 열기 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onChange` | function | `null` | 변경 콜백 `(index, isOpen, item)` |
| `onDestroy` | function | `null` | 정리 콜백 |

### Accordion 메서드

| 메서드 | 설명 |
| --- | --- |
| `.toggle(index)` | 특정 패널 토글 |
| `.expand(index)` | 특정 패널 열기 |
| `.collapse(index)` | 특정 패널 닫기 |
| `.expandAll()` | 모든 패널 열기 |
| `.collapseAll()` | 모든 패널 닫기 |
| `.destroy()` | 인스턴스 제거 |

---

## Collapse

단일 접기/펼치기 요소입니다.

```javascript
const { Collapse } = await IMCAT.use('navigation');
const collapse = new Collapse('#details', {
  expanded: false,
  animation: true,
  animationDuration: 300,
  onChange: (isExpanded) => console.log(isExpanded),
  onDestroy: null
});
collapse.toggle();
```

### Collapse 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `expanded` | boolean | `false` | 초기 펼침 상태 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onChange` | function | `null` | 변경 콜백 `(isExpanded)` |
| `onDestroy` | function | `null` | 정리 콜백 |

### Collapse 메서드

| 메서드 | 설명 |
| --- | --- |
| `.toggle()` | 토글 |
| `.expand()` | 펼치기 |
| `.collapse()` | 접기 |
| `.destroy()` | 인스턴스 제거 |

---

## MegaMenu

대형 드롭다운 메뉴입니다. `.megamenu__item` > `.megamenu__trigger` + `.megamenu__panel` 구조 기반.

```javascript
const { MegaMenu } = await IMCAT.use('navigation');
new MegaMenu('#mainNav', {
  trigger: 'hover',
  hoverDelay: 200,
  animation: true,
  animationDuration: 300,
  closeOnOutside: true,
  onChange: null,
  onDestroy: null
});
```

### MegaMenu 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `trigger` | string | `'hover'` | 트리거 (`'hover'`/`'click'`) |
| `hoverDelay` | number | `200` | 호버 지연 (ms) |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `closeOnOutside` | boolean | `true` | 외부 클릭 시 닫기 |
| `onChange` | function | `null` | 변경 콜백 |
| `onDestroy` | function | `null` | 정리 콜백 |

### MegaMenu 메서드

| 메서드 | 설명 |
| --- | --- |
| `.toggle(index)` | 특정 메뉴 토글 |
| `.open(index)` | 특정 메뉴 열기 |
| `.close(index)` | 특정 메뉴 닫기 |
| `.destroy()` | 인스턴스 제거 |

---

## TreeView

계층 구조 데이터를 트리 형태로 표시합니다. `.treeview__item` > `.treeview__toggle` + `.treeview__label` + `.treeview__children` 구조 기반.

```javascript
const { TreeView } = await IMCAT.use('navigation');
new TreeView('#tree', {
  expandIcon: 'expand_more',
  collapseIcon: 'chevron_right',
  animation: true,
  animationDuration: 300,
  multipleSelect: false,
  onNodeClick: (node) => console.log('클릭:', node),
  onNodeToggle: (node, isExpanded) => console.log('토글:', isExpanded),
  onDestroy: null
});
```

### TreeView 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `expandIcon` | string | `'expand_more'` | 펼침 아이콘 |
| `collapseIcon` | string | `'chevron_right'` | 접힘 아이콘 |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `multipleSelect` | boolean | `false` | 다중 선택 |
| `onNodeClick` | function | `null` | 노드 클릭 콜백 |
| `onNodeToggle` | function | `null` | 노드 토글 콜백 |
| `onDestroy` | function | `null` | 정리 콜백 |

### TreeView 메서드

| 메서드 | 설명 |
| --- | --- |
| `.expandAll()` | 모든 노드 펼치기 |
| `.collapseAll()` | 모든 노드 접기 |
| `.selectNode(node)` | 노드 선택/해제 |
| `.destroy()` | 인스턴스 제거 |

---

## Sidebar

접기 가능한 사이드바 네비게이션입니다. JSON 데이터 렌더링 또는 기존 DOM 파싱을 지원합니다.

```javascript
const { Sidebar } = await IMCAT.use('navigation');
new Sidebar('#sidebar', {
  mode: 'expanded',
  collapsedWidth: 64,
  compactWidth: 180,
  expandedWidth: 260,
  animation: true,
  animationDuration: 250,
  closeOthers: true,
  activeItem: null,
  showUserBox: false,
  user: null,
  items: null,
  onItemClick: (item) => console.log(item),
  onModeChange: (mode) => console.log(mode),
  onDestroy: null
});
```

### Sidebar 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `mode` | string | `'expanded'` | 모드 (`'expanded'`/`'collapsed'`/`'compact'`) |
| `collapsedWidth` | number | `64` | collapsed 너비 (px) |
| `compactWidth` | number | `180` | compact 너비 (px) |
| `expandedWidth` | number | `260` | expanded 너비 (px) |
| `animation` | boolean | `true` | 애니메이션 |
| `animationDuration` | number | `250` | 애니메이션 시간 (ms) |
| `closeOthers` | boolean | `true` | 서브메뉴 열 때 다른 닫기 |
| `activeItem` | string | `null` | 초기 활성 항목 |
| `showUserBox` | boolean | `false` | 사용자 정보 박스 |
| `user` | object | `null` | 사용자 데이터 |
| `items` | array | `null` | 메뉴 데이터 (JSON 렌더링) |
| `onItemClick` | function | `null` | 항목 클릭 콜백 |
| `onModeChange` | function | `null` | 모드 변경 콜백 |
| `onDestroy` | function | `null` | 정리 콜백 |

### Sidebar 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setMode(mode)` | 모드 변경 |
| `.setActive(idOrHref)` | 활성 항목 설정 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Lists CSS](../css/lists.md) — 리스트 스타일
- [구현 패턴](../PATTERNS.md) — 탭 네비게이션 패턴
