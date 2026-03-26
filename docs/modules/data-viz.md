# Data Viz

DataTable, Chart, Masonry, Kanban, Calendar — 데이터 시각화 컴포넌트를 제공합니다.

> 소스: `src/modules/data-viz.js` (어그리게이터) → `src/modules/data-viz/*.js`
>
> **이 문서의 핵심**: `IMCAT.use('data-viz')` → { DataTable, Chart, Masonry, Kanban, Calendar }.
> 하위 모듈 로딩: `IMCAT.use('data-viz/datatable')` 등.

## 로드 방법

```javascript
const { DataTable, Chart, Masonry, Kanban, Calendar } = await IMCAT.use('data-viz');
```

---

## DataTable

정렬, 검색, 페이지네이션, 행 선택, CSV 내보내기, 커스텀 툴바를 지원합니다.

```javascript
const { DataTable } = await IMCAT.use('data-viz');
const table = new DataTable('#myTable', {
  columns: [
    { key: 'id', title: 'ID', width: '60px', sortable: true },
    { key: 'name', title: '이름', sortable: true },
    { key: 'email', title: '이메일' },
    { key: 'status', title: '상태', render: (val) =>
      `<span class="badge badge--${val === 'active' ? 'success' : 'danger'}">${val}</span>`
    }
  ],
  data: [
    { id: 1, name: '홍길동', email: 'hong@test.com', status: 'active' },
    { id: 2, name: '김철수', email: 'kim@test.com', status: 'inactive' }
  ],
  sortable: true,
  searchable: true,
  paginate: true,
  pageSize: 10,
  selectable: true,
  exportable: true,
  onRowClick: (row) => console.log(row)
});
```

### DataTable 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `data` | array | `[]` | 데이터 배열 |
| `columns` | array | `[]` | 컬럼 정의 |
| `sortable` | boolean | `true` | 정렬 기능 |
| `searchable` | boolean | `true` | 검색 기능 |
| `searchPlaceholder` | string | `'검색...'` | 검색 플레이스홀더 |
| `paginate` | boolean | `true` | 페이지네이션 |
| `pageSize` | number | `10` | 페이지당 행 수 |
| `pageSizeOptions` | array | `[5, 10, 25, 50]` | 페이지 크기 선택지 |
| `striped` | boolean | `false` | 스트라이프 |
| `bordered` | boolean | `false` | 테두리 |
| `compact` | boolean | `false` | 컴팩트 |
| `responsive` | boolean | `false` | 반응형 |
| `emptyIcon` | string | `'inbox'` | 빈 상태 아이콘 |
| `emptyTitle` | string | `'데이터가 없습니다'` | 빈 상태 제목 |
| `emptyDescription` | string | `'표시할 데이터가 없습니다.'` | 빈 상태 설명 |
| `showInfo` | boolean | `true` | 정보 표시 (건수 등) |
| `selectable` | boolean | `false` | 행 선택 (체크박스) |
| `toolbar` | object | `null` | 커스텀 툴바 `{ buttons: [{ text, icon, class, onClick }] }` |
| `exportable` | boolean | `false` | CSV 내보내기 버튼 |
| `onRowClick` | function | `null` | 행 클릭 콜백 |
| `onSort` | function | `null` | 정렬 콜백 |
| `onFilter` | function | `null` | 필터 콜백 |
| `onSelect` | function | `null` | 선택 콜백 |
| `onSearch` | function | `null` | 검색 콜백 |

### columns 객체

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `key` | string | 데이터 키 |
| `title` | string | 컬럼 제목 |
| `width` | string | 너비 |
| `sortable` | boolean | 정렬 가능 (컬럼별 오버라이드) |
| `render` | function(value, row) | 커스텀 렌더링 |

### DataTable 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setData(data)` | 데이터 교체 |
| `.addRow(row)` | 행 추가 |
| `.search(term)` | 검색어 설정 |
| `.exportCSV(filename?)` | CSV 내보내기 (기본 `'data.csv'`) |
| `.getSelectedRows()` | 선택된 행 데이터 배열 |
| `.getSelectedIndices()` | 선택된 행 인덱스 배열 |
| `.selectRow(index)` | 행 선택 |
| `.deselectRow(index)` | 행 선택 해제 |
| `.selectAll()` | 전체 선택 |
| `.clearSelection()` | 선택 초기화 |
| `.refresh()` | 다시 렌더링 |
| `.destroy()` | 인스턴스 제거 |

---

## Chart

bar, horizontalBar, line, area, pie, doughnut 차트를 지원합니다. 툴팁, 그리드, 레전드 포함.

```javascript
const { Chart } = await IMCAT.use('data-viz');
new Chart('#myChart', {
  type: 'bar',
  data: {
    labels: ['1월', '2월', '3월'],
    datasets: [{ label: '매출', data: [100, 200, 150] }]
  },
  colors: ['#667eea', '#22c55e', '#f59e0b'],
  height: 300,
  showLegend: true,
  showValues: false,
  showGrid: true,
  showTooltip: true,
  gridLines: 5,
  animate: true,
  barRadius: 4
});
```

### Chart 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `type` | string | `'bar'` | 차트 유형 (`'bar'`/`'horizontalBar'`/`'line'`/`'area'`/`'pie'`/`'doughnut'`) |
| `data` | object | `{ labels: [], datasets: [] }` | 데이터 |
| `colors` | array | `['#667eea',...]` | 색상 팔레트 (8색) |
| `height` | number | `300` | 차트 높이 (px) |
| `showLegend` | boolean | `true` | 레전드 |
| `showValues` | boolean | `false` | 값 표시 |
| `showGrid` | boolean | `true` | 그리드 라인 |
| `showTooltip` | boolean | `true` | 마우스 오버 툴팁 |
| `gridLines` | number | `5` | 그리드 라인 수 |
| `animate` | boolean | `true` | 애니메이션 |
| `barRadius` | number | `4` | 바 차트 모서리 반경 |

### Chart 메서드

| 메서드 | 설명 |
| --- | --- |
| `.update(data)` | 데이터 업데이트 후 다시 렌더링 |
| `.destroy()` | 인스턴스 제거 |

---

## Masonry

CSS Grid 기반 타일 레이아웃입니다. 카테고리 필터, 애니메이션을 지원합니다.

```javascript
const { Masonry } = await IMCAT.use('data-viz');
new Masonry('#grid', {
  columnWidth: 300,
  gap: 16,
  items: [...],
  render: (item, index) => `<div class="card">${item.title}</div>`,
  filterKey: 'category',
  animate: true
});
```

### Masonry 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `columnWidth` | number | `300` | 컬럼 너비 (px) |
| `gap` | number | `16` | 간격 (px) |
| `items` | array | `[]` | 아이템 데이터 |
| `render` | function | `null` | 렌더링 함수 `(item, index) → html` |
| `filterKey` | string | `null` | 필터용 데이터 키 |
| `animate` | boolean | `true` | 애니메이션 |

### Masonry 메서드

| 메서드 | 설명 |
| --- | --- |
| `.filter(category)` | 카테고리 필터 |
| `.clearFilter()` | 필터 해제 |
| `.getCategories()` | 카테고리 목록 반환 |
| `.addItem(item)` | 아이템 추가 |
| `.removeItem(index)` | 아이템 제거 |
| `.destroy()` | 인스턴스 제거 |

---

## Kanban

드래그 앤 드롭 칸반 보드입니다. 우선순위 배지, 담당자 아바타, WIP 제한을 지원합니다.

```javascript
const { Kanban } = await IMCAT.use('data-viz');
new Kanban('#board', {
  columns: [
    { id: 'todo', title: '할 일', color: '#667eea', wipLimit: 5,
      cards: [{ id: '1', title: '작업 1', priority: 'high', assignee: { name: '홍길동' } }] },
    { id: 'doing', title: '진행 중', cards: [] },
    { id: 'done', title: '완료', cards: [] }
  ],
  allowAddCard: true,
  showColumnMenu: true,
  onMove: (card, from, to) => console.log(`${card.title}: ${from} → ${to}`),
  onCardClick: (card) => console.log(card),
  onCardAdd: (columnId, card) => console.log('추가:', card),
  onCardDelete: (cardId) => console.log('삭제:', cardId)
});
```

### Kanban 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `columns` | array | `[]` | 컬럼 `{ id, title, color?, wipLimit?, cards }` |
| `allowAddCard` | boolean | `true` | 카드 추가 버튼 |
| `showColumnMenu` | boolean | `true` | 컬럼 메뉴 버튼 |
| `onMove` | function | `null` | 카드 이동 콜백 `(card, from, to)` |
| `onCardClick` | function | `null` | 카드 클릭 콜백 |
| `onCardAdd` | function | `null` | 카드 추가 콜백 |
| `onCardDelete` | function | `null` | 카드 삭제 콜백 |

### Kanban 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addCard(columnId, card)` | 카드 추가 |
| `.removeCard(cardId)` | 카드 제거 |
| `.destroy()` | 인스턴스 제거 |

---

## Calendar

월/주간 뷰 캘린더입니다. 이벤트 카테고리, today 버튼을 지원합니다.

```javascript
const { Calendar } = await IMCAT.use('data-viz');
new Calendar('#calendar', {
  events: [
    { id: '1', title: '미팅', date: '2025-01-15', category: 'primary' },
    { id: '2', title: '마감일', date: '2025-01-20', category: 'danger' }
  ],
  view: 'month',
  weekStart: 0,
  showToday: true,
  maxEventsPerCell: 2,
  onDateClick: (date) => console.log('클릭:', date),
  onEventClick: (event) => console.log('이벤트:', event),
  onMonthChange: (date) => console.log('월 변경:', date),
  onEventAdd: (event) => console.log('추가:', event)
});
```

### Calendar 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `events` | array | `[]` | 이벤트 `{ id, title, date, category? }` |
| `categories` | array | `[]` | 카테고리 목록 |
| `defaultDate` | Date | `new Date()` | 초기 날짜 |
| `view` | string | `'month'` | 뷰 (`'month'`/`'week'`) |
| `weekStart` | number | `0` | 주 시작 요일 (0=일요일) |
| `showToday` | boolean | `true` | today 버튼 |
| `maxEventsPerCell` | number | `2` | 셀당 최대 이벤트 수 |
| `onDateClick` | function | `null` | 날짜 클릭 콜백 |
| `onEventClick` | function | `null` | 이벤트 클릭 콜백 |
| `onMonthChange` | function | `null` | 월 변경 콜백 |
| `onEventAdd` | function | `null` | 이벤트 추가 콜백 |

### Calendar 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setView(view)` | 뷰 변경 (`'month'`/`'week'`) |
| `.goToDate(date)` | 특정 날짜로 이동 |
| `.today()` | 오늘로 이동 |
| `.addEvent(event)` | 이벤트 추가 |
| `.removeEvent(eventId)` | 이벤트 제거 |
| `.getEvents(date)` | 특정 날짜 이벤트 반환 |
| `.getAllEvents()` | 전체 이벤트 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Tables CSS](../css/tables.md) — 테이블 스타일
- [구현 패턴](../PATTERNS.md) — CRUD 테이블 패턴
