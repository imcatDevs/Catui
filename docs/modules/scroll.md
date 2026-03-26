# Scroll

VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop — 스크롤 관련 컴포넌트를 제공합니다.

> 소스: `src/modules/scroll.js`
>
> **이 문서의 핵심**: `IMCAT.use('scroll')` → VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop.
> InfiniteScroll: 무한 스크롤 로딩. BackToTop: 상단 이동 버튼. VirtualScroll: 가상 스크롤.

## 로드 방법

```javascript
const { VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop } = await IMCAT.use('scroll');
```

## VirtualScroll

대량 데이터를 가상 스크롤로 효율적으로 렌더링합니다.

```javascript
const { VirtualScroll } = await IMCAT.use('scroll');
new VirtualScroll('#list', {
  items: Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `항목 ${i}` })),
  itemHeight: 40,
  renderItem: (item) => `<div class="list__item">${item.text}</div>`
});
```

## Scrollspy

스크롤 위치에 따라 네비게이션을 자동 활성화합니다.

```javascript
const { Scrollspy } = await IMCAT.use('scroll');
new Scrollspy('#content', {
  nav: '#sideNav',
  offset: 100,
  onChange: (activeId) => console.log('활성:', activeId)
});
```

## InfiniteScroll

```javascript
const { InfiniteScroll } = await IMCAT.use('scroll');
new InfiniteScroll('#list', {
  threshold: 200,
  onLoad: async (page) => {
    const data = await IMCAT.api.get(`/api/items?page=${page}`);
    return data;  // 빈 배열 반환 시 종료
  },
  render: (item) => `<div class="list__item">${item.name}</div>`
});
```

## BackToTop

```javascript
const { BackToTop } = await IMCAT.use('scroll');
new BackToTop({ offset: 300, animation: true });
```

## SmoothScroll

부드러운 스크롤 애니메이션을 제공합니다.

```javascript
const { SmoothScroll } = await IMCAT.use('scroll');
new SmoothScroll({ duration: 600, easing: 'easeInOutCubic' });
```

## 관련 문서

- [Pagination](pagination.md) — 페이지 기반 네비게이션
