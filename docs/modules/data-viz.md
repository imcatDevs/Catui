# Data Viz

DataTable, Chart, Masonry, Kanban, Calendar — 데이터 시각화 컴포넌트를 제공합니다.

> 소스: `src/modules/data-viz.js`
>
> **이 문서의 핵심**: `IMCAT.use('data-viz')` → DataTable, Chart, Masonry, Kanban, Calendar.
> DataTable: columns + data + pagination + search + sort + export.

## 로드 방법

```javascript
const { DataTable, Chart, Masonry, Kanban, Calendar } = await IMCAT.use('data-viz');
```

## DataTable

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
  pagination: true,
  pageSize: 10,
  search: true,
  selection: true,
  emptyState: { title: '데이터 없음', description: '표시할 데이터가 없습니다.' }
});
```

### DataTable 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `columns` | array | `[]` | 컬럼 정의 |
| `data` | array | `[]` | 데이터 배열 |
| `pagination` | boolean | `true` | 페이지네이션 |
| `pageSize` | number | `10` | 페이지당 행 수 |
| `search` | boolean | `false` | 검색 기능 |
| `selection` | boolean | `false` | 행 선택 (체크박스) |
| `sortable` | boolean | `false` | 정렬 기능 (컬럼별 설정 우선) |
| `striped` | boolean | `false` | 스트라이프 |
| `bordered` | boolean | `false` | 테두리 |
| `compact` | boolean | `false` | 컴팩트 |
| `responsive` | boolean | `true` | 반응형 |
| `emptyState` | object | `{}` | 빈 상태 메시지 |

### columns 객체

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `key` | string | 데이터 키 |
| `title` | string | 컬럼 제목 |
| `width` | string | 너비 |
| `sortable` | boolean | 정렬 가능 |
| `render` | function(value, row) | 커스텀 렌더링 |

### DataTable 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setData(data)` | 데이터 교체 |
| `.addRow(row)` | 행 추가 |
| `.removeRow(index)` | 행 삭제 |
| `.getSelected()` | 선택된 행 배열 |
| `.exportCSV()` | CSV 내보내기 |
| `.refresh()` | 다시 렌더링 |
| `.destroy()` | 제거 |

## Chart

```javascript
const { Chart } = await IMCAT.use('data-viz');
new Chart('#myChart', {
  type: 'bar',
  data: {
    labels: ['1월', '2월', '3월'],
    datasets: [{ label: '매출', data: [100, 200, 150] }]
  }
});
```

## Masonry

메이슨리 레이아웃을 제공합니다.

```javascript
const { Masonry } = await IMCAT.use('data-viz');
new Masonry('#grid', {
  columns: 3,
  gap: 16,
  items: document.querySelectorAll('.card')
});
```

## Kanban

```javascript
const { Kanban } = await IMCAT.use('data-viz');
new Kanban('#board', {
  columns: [
    { id: 'todo', title: '할 일', cards: [{ id: '1', title: '작업 1' }] },
    { id: 'doing', title: '진행 중', cards: [] },
    { id: 'done', title: '완료', cards: [] }
  ],
  onMove: (card, from, to) => console.log(`${card.title}: ${from} → ${to}`)
});
```

## Calendar

```javascript
const { Calendar } = await IMCAT.use('data-viz');
new Calendar('#calendar', {
  events: [
    { title: '미팅', date: '2025-01-15', color: 'primary' },
    { title: '마감일', date: '2025-01-20', color: 'danger' }
  ],
  onDateClick: (date) => console.log('클릭:', date),
  onEventClick: (event) => console.log('이벤트:', event)
});
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onSort` (DataTable) | `(column, direction)` | 정렬 변경 시 |
| `onSearch` (DataTable) | `(query)` | 검색 시 |
| `onPageChange` (DataTable) | `(page)` | 페이지 변경 시 |
| `onSelect` (DataTable) | `(selectedRows)` | 행 선택 시 |
| `onMove` (Kanban) | `(card, fromCol, toCol)` | 카드 이동 시 |
| `onDateClick` (Calendar) | `(date)` | 날짜 클릭 시 |
| `onEventClick` (Calendar) | `(event)` | 이벤트 클릭 시 |

## 관련 문서

- [Tables CSS](../css/tables.md) — 테이블 스타일
- [구현 패턴](../PATTERNS.md) — CRUD 테이블 패턴
