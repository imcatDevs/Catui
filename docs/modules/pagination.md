# Pagination

페이지네이션 컴포넌트를 제공합니다.

> 소스: `src/modules/pagination.js`
>
> **이 문서의 핵심**: `IMCAT.use('pagination')` → Pagination.
> `total`, `pageSize`, `current` 기반 페이지 네비게이션.

## 로드 방법

```javascript
const { Pagination } = await IMCAT.use('pagination');
```

## 기본 사용

```javascript
const { Pagination } = await IMCAT.use('pagination');
const pager = new Pagination('#pager', {
  total: 100,
  pageSize: 10,
  current: 1,
  onChange: (page) => {
    console.log('페이지:', page);
    loadData(page);
  }
});
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `total` | number | `0` | 전체 아이템 수 |
| `pageSize` | number | `10` | 페이지당 아이템 수 |
| `current` | number | `1` | 현재 페이지 |
| `maxButtons` | number | `5` | 표시할 최대 페이지 버튼 수 |
| `showFirst` | boolean | `true` | 처음 버튼 |
| `showLast` | boolean | `true` | 마지막 버튼 |
| `showPrev` | boolean | `true` | 이전 버튼 |
| `showNext` | boolean | `true` | 다음 버튼 |
| `onChange` | function | `null` | 페이지 변경 콜백 |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setPage(page)` | 특정 페이지로 |
| `.setTotal(total)` | 전체 수 변경 |
| `.destroy()` | 제거 |

## 관련 문서

- [Data Viz](data-viz.md) — DataTable 내장 페이지네이션
- [Scroll](scroll.md) — 무한 스크롤
