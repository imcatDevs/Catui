# Navigation

Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar — 네비게이션 컴포넌트를 제공합니다.

> 소스: `src/modules/navigation.js`
>
> **이 문서의 핵심**: `IMCAT.use('navigation')` → Tabs, Accordion 등.
> Tabs: `role="tablist"` + `role="tab"` + `role="tabpanel"` 구조.

## 로드 방법

```javascript
const { Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar } = await IMCAT.use('navigation');
const Tabs = await IMCAT.use('navigation/tabs');  // 하위 모듈
```

## Tabs

```html
<div id="myTabs">
  <div role="tablist">
    <button role="tab">탭 1</button>
    <button role="tab">탭 2</button>
  </div>
  <div role="tabpanel"><p>탭 1 내용</p></div>
  <div role="tabpanel"><p>탭 2 내용</p></div>
</div>
```

```javascript
const { Tabs } = await IMCAT.use('navigation');
const tabs = new Tabs('#myTabs', {
  animation: true,
  orientation: 'horizontal',
  onChange: (index) => console.log('탭:', index)
});
```

### Tabs 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `animation` | boolean | `true` | 전환 애니메이션 |
| `orientation` | string | `'horizontal'` | 방향 (`'horizontal'`/`'vertical'`) |
| `activeIndex` | number | `0` | 초기 활성 탭 |
| `onChange` | function | `null` | 탭 변경 콜백 (index) |

### Tabs 메서드

| 메서드 | 설명 |
| --- | --- |
| `.activate(index)` | 특정 탭 활성화 |
| `.destroy()` | 제거 |

## Accordion

```javascript
const { Accordion } = await IMCAT.use('navigation');
new Accordion('#myAccordion', {
  multiple: false,
  animation: true
});
```

### Accordion 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `multiple` | boolean | `false` | 동시 다중 열기 허용 |
| `expandFirst` | boolean | `true` | 첫 번째 패널 자동 열기 |
| `animation` | boolean | `true` | 애니메이션 |

## Collapse

단일 접기/펼치기 요소입니다.

```javascript
const { Collapse } = await IMCAT.use('navigation');
const collapse = new Collapse('#details', { animation: true });
collapse.toggle();
```

## MegaMenu

대형 드롭다운 메뉴입니다.

```javascript
const { MegaMenu } = await IMCAT.use('navigation');
new MegaMenu('#mainNav', {
  items: [
    { text: '제품', content: '<div class="grid grid-cols-3 gap-3">...</div>' },
    { text: '서비스', content: '...' }
  ]
});
```

## TreeView

계층 구조 데이터를 트리 형태로 표시합니다.

```javascript
const { TreeView } = await IMCAT.use('navigation');
new TreeView('#tree', {
  data: [
    { label: '문서', children: [
      { label: 'README.md' },
      { label: 'CHANGELOG.md' }
    ]},
    { label: '소스', children: [
      { label: 'index.js' },
      { label: 'utils.js' }
    ]}
  ],
  selectable: true,
  onSelect: (node) => console.log('선택:', node.label)
});
```

## Sidebar

접기 가능한 사이드바 네비게이션입니다.

```javascript
const { Sidebar } = await IMCAT.use('navigation');
new Sidebar('#sidebar', {
  mode: 'expanded',       // 'expanded' / 'collapsed' / 'compact'
  collapsedWidth: 64,     // collapsed 모드 너비 (px)
  compactWidth: 180,      // compact 모드 너비 (px)
  expandedWidth: 260,     // expanded 모드 너비 (px)
  closeOthers: true,      // 서브메뉴 열 때 다른 서브메뉴 닫기
  onItemClick: (item) => console.log(item),
  onModeChange: (mode) => console.log(mode)
});
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onChange` (Tabs) | `(index)` | 탭 변경 시 |
| `onToggle` (Accordion) | `(index, isOpen)` | 패널 토글 시 |
| `onToggle` (Collapse) | `(isOpen)` | 접기/펼치기 시 |
| `onCollapse` (Sidebar) | `(isCollapsed)` | 사이드바 접기 시 |

## 관련 문서

- [Lists CSS](../css/lists.md) — 리스트 스타일
- [구현 패턴](../PATTERNS.md) — 탭 네비게이션 패턴
