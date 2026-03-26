# Pagination

Pagination, DataPaginator — 페이지네이션 컴포넌트를 제공합니다.

> 소스: `src/modules/pagination.js`
>
> **이 문서의 핵심**: `IMCAT.use('pagination')` → { Pagination, DataPaginator, create }.
> Pagination: UI 페이지네이션. DataPaginator: JSON 데이터 + 페이지네이션 통합.

## 로드 방법

```javascript
const { Pagination, DataPaginator } = await IMCAT.use('pagination');
```

---

## Pagination

```javascript
const { Pagination } = await IMCAT.use('pagination');
const pager = new Pagination('#pager', {
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 1,
  maxVisiblePages: 5,
  showFirstLast: true,
  showPrevNext: true,
  showEllipsis: true,
  showInfo: false,
  size: 'default',
  rounded: false,
  align: 'center',
  icons: true,
  onChange: (pageData, prevPage) => {
    console.log('페이지:', pageData.currentPage);
    loadData(pageData.startIndex, pageData.endIndex);
  }
});
```

### Pagination 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `totalItems` | number | `0` | 전체 아이템 수 |
| `itemsPerPage` | number | `10` | 페이지당 아이템 수 |
| `currentPage` | number | `1` | 현재 페이지 |
| `maxVisiblePages` | number | `5` | 표시할 최대 페이지 수 |
| `showFirstLast` | boolean | `true` | 처음/마지막 버튼 |
| `showPrevNext` | boolean | `true` | 이전/다음 버튼 |
| `showEllipsis` | boolean | `true` | 생략 부호(...) 표시 |
| `showInfo` | boolean | `false` | 정보 텍스트 표시 ("1-10 / 100") |
| `size` | string | `'default'` | 크기 (`'sm'`/`'default'`/`'lg'`) |
| `rounded` | boolean | `false` | 원형 스타일 |
| `align` | string | `'start'` | 정렬 (`'start'`/`'center'`/`'end'`) |
| `icons` | boolean | `true` | 아이콘 사용 |
| `labels` | object | `{ first, prev, next, last, ...Text }` | 버튼 라벨/아이콘 |
| `infoTemplate` | string | `'{{start}}-{{end}} / {{total}}'` | 정보 텍스트 템플릿 |
| `onChange` | function | `null` | 페이지 변경 콜백 `(pageData, prevPage)` |
| `onInit` | function | `null` | 초기화 콜백 `(pagination)` |
| `onDestroy` | function | `null` | 정리 콜백 |

### Pagination 메서드

| 메서드 | 설명 |
| --- | --- |
| `.goToPage(page)` | 특정 페이지로 이동 |
| `.setTotalItems(total, resetPage?)` | 전체 수 변경 (resetPage: 리셋 페이지, null이면 유지) |
| `.setItemsPerPage(count)` | 페이지당 수 변경 |
| `.updateOptions(options)` | 옵션 업데이트 |
| `.getPageData()` | 현재 페이지 데이터 반환 |
| `.refresh()` | UI 새로고침 |
| `.destroy()` | 인스턴스 제거 |

### getPageData() 반환값

```javascript
{
  currentPage: 1,
  totalPages: 10,
  totalItems: 100,
  itemsPerPage: 10,
  startIndex: 0,      // 0-indexed
  endIndex: 10,
  startNumber: 1,     // 1-indexed
  endNumber: 10,
  isFirstPage: true,
  isLastPage: false
}
```

---

## DataPaginator

JSON 데이터 배열과 페이지네이션을 통합합니다. 필터링, 정렬, 검색을 내장합니다.

```javascript
const { DataPaginator } = await IMCAT.use('pagination');
const dp = new DataPaginator({
  container: '#dataList',
  data: [{ name: '항목1' }, { name: '항목2' }, ...],
  itemsPerPage: 10,
  currentPage: 1,
  renderItem: (item, index, pageData) => `<div class="item">${item.name}</div>`,
  emptyMessage: '데이터가 없습니다.',
  paginationOptions: { showInfo: true, align: 'center' },
  onPageChange: (pageData, prevPage, items) => console.log('페이지:', pageData),
  onDataLoad: (items, pageData) => console.log('로드:', items.length)
});

dp.search('검색어', ['name']);
dp.filter(item => item.active);
dp.sort((a, b) => a.name.localeCompare(b.name));
dp.resetFilter();
```

### DataPaginator 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `container` | string/element | — | 컨테이너 (필수) |
| `data` | array | `[]` | 원본 데이터 배열 |
| `itemsPerPage` | number | `10` | 페이지당 아이템 수 |
| `currentPage` | number | `1` | 시작 페이지 |
| `renderItem` | function | `null` | 아이템 렌더링 `(item, index, pageData) → html/element` |
| `emptyMessage` | string | `'데이터가 없습니다.'` | 빈 데이터 메시지 |
| `paginationOptions` | object | `{}` | Pagination 컴포넌트 옵션 |
| `onPageChange` | function | `null` | 페이지 변경 콜백 `(pageData, prevPage, items)` |
| `onDataLoad` | function | `null` | 데이터 로드 콜백 `(items, pageData)` |

### DataPaginator 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setData(data, resetPage?)` | 데이터 교체 |
| `.filter(filterFn)` | 필터링 |
| `.sort(compareFn)` | 정렬 |
| `.search(query, fields?)` | 검색 (fields 미지정 시 전체 필드) |
| `.resetFilter()` | 필터 초기화 |
| `.getCurrentPageData()` | 현재 페이지 데이터 배열 반환 |
| `.getFilteredData()` | 필터된 전체 데이터 반환 |
| `.goToPage(page)` | 페이지 이동 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Data Viz](data-viz.md) — DataTable 내장 페이지네이션
- [Scroll](scroll.md) — 무한 스크롤
