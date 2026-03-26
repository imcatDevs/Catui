# Scroll

VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop — 스크롤 관련 컴포넌트를 제공합니다.

> 소스: `src/modules/scroll.js`
>
> **이 문서의 핵심**: `IMCAT.use('scroll')` → VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop.
> VirtualScroll: 가상 스크롤. Scrollspy: 스크롤 위치 감지. InfiniteScroll: 무한 스크롤 로딩.
> SmoothScroll: 유틸리티 객체 (클래스 아님). BackToTop: 상단 이동 버튼 (싱글톤).

## 로드 방법

```javascript
const { VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop } = await IMCAT.use('scroll');
```

---

## VirtualScroll

대량 데이터를 가상 스크롤로 효율적으로 렌더링합니다. 보이는 영역만 DOM에 렌더링합니다.

```javascript
const { VirtualScroll } = await IMCAT.use('scroll');
new VirtualScroll('#list', {
  items: Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `항목 ${i}` })),
  itemHeight: 50,
  bufferSize: 5,
  containerHeight: 400,
  renderItem: (item, index) => `<div class="list__item">${item.text}</div>`,
  onScroll: (scrollTop, visibleRange) => console.log(visibleRange)
});
```

### VirtualScroll 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `itemHeight` | number | `50` | 아이템 높이 (px) |
| `bufferSize` | number | `5` | 버퍼 아이템 수 |
| `items` | array | `[]` | 데이터 배열 |
| `renderItem` | function | `null` | 아이템 렌더러 `(item, index) => html` |
| `containerHeight` | number | `400` | 컨테이너 높이 (px) |
| `onScroll` | function | `null` | 스크롤 콜백 `(scrollTop, visibleRange)` |

### VirtualScroll 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setItems(items)` | 데이터 배열 업데이트 |
| `.scrollToIndex(index, smooth?)` | 지정 인덱스로 스크롤 |
| `.getVisibleRange()` | 현재 보이는 범위 `{start, end}` 반환 |
| `.refresh()` | 화면 새로고침 |
| `.destroy()` | 인스턴스 제거 |

---

## Scrollspy

스크롤 위치에 따라 네비게이션을 자동 활성화합니다.

```javascript
const { Scrollspy } = await IMCAT.use('scroll');
new Scrollspy('#content', {
  target: '#sideNav',
  offset: 100,
  activeClass: 'is-active',
  smoothScroll: true,
  onChange: (activeId, prevId) => console.log('활성:', activeId)
});
```

### Scrollspy 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `target` | string | `null` | 네비게이션 컨테이너 선택자 |
| `sections` | array | `[]` | 섹션 선택자 배열 (비어있으면 네비게이션 링크에서 자동 감지) |
| `offset` | number | `100` | 활성화 오프셋 (px) |
| `activeClass` | string | `'is-active'` | 활성 클래스 |
| `smoothScroll` | boolean | `true` | 부드러운 스크롤 |
| `onChange` | function | `null` | 활성 섹션 변경 콜백 `(activeId, prevId)` |

### Scrollspy 메서드

| 메서드 | 설명 |
| --- | --- |
| `.scrollTo(id)` | 특정 섹션으로 스크롤 |
| `.getActive()` | 현재 활성 섹션 ID 반환 |
| `.refresh()` | 섹션 목록 새로고침 |
| `.destroy()` | 인스턴스 제거 |

---

## InfiniteScroll

스크롤 시 자동으로 콘텐츠를 로드합니다. IntersectionObserver 기반으로 동작합니다.

```javascript
const { InfiniteScroll } = await IMCAT.use('scroll');
new InfiniteScroll('#list', {
  threshold: 200,
  loadMore: async () => {
    const data = await IMCAT.api.get('/api/items');
    return data;  // 빈 배열 반환 시 종료
  },
  renderItem: (item, index) => `<div class="list__item">${item.name}</div>`,
  onLoad: (items, totalLoaded) => console.log(`${totalLoaded}개 로드됨`)
});
```

### InfiniteScroll 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `threshold` | number | `200` | 트리거 임계값 (px) |
| `loadMore` | function | `null` | 데이터 로드 함수 `async () => items` |
| `renderItem` | function | `null` | 아이템 렌더러 `(item, index) => html` |
| `hasMore` | boolean | `true` | 더 로드할 데이터 존재 여부 |
| `loadingHTML` | string | 스피너 HTML | 로딩 중 표시 HTML |
| `endHTML` | string | 종료 메시지 HTML | 모든 항목 로드 시 표시 HTML |
| `errorHTML` | string | 오류 + 재시도 HTML | 에러 발생 시 표시 HTML |
| `onLoad` | function | `null` | 로드 완료 콜백 `(items, totalLoaded)` |

### InfiniteScroll 메서드

| 메서드 | 설명 |
| --- | --- |
| `.loadMore()` | 수동으로 로드 트리거 |
| `.setHasMore(hasMore)` | 추가 로드 가능 여부 설정 |
| `.reset()` | 리스트 초기화 |
| `.appendItems(items)` | 아이템 수동 추가 |
| `.destroy()` | 인스턴스 제거 |

---

## SmoothScroll

부드러운 스크롤 유틸리티 **객체**입니다. 클래스가 아니므로 `new` 없이 직접 사용합니다.

```javascript
const { SmoothScroll } = await IMCAT.use('scroll');

// 특정 요소로 스크롤
SmoothScroll.to('#section2', { offset: 80, duration: 500 });

// 맨 위로 스크롤
SmoothScroll.toTop({ duration: 500 });

// 맨 아래로 스크롤
SmoothScroll.toBottom({ duration: 500 });
```

### SmoothScroll 메서드

| 메서드 | 설명 |
| --- | --- |
| `SmoothScroll.to(target, options?)` | 요소로 스크롤 (`offset`, `duration`, `easing`) |
| `SmoothScroll.toTop(options?)` | 맨 위로 스크롤 (`duration`, `easing`) |
| `SmoothScroll.toBottom(options?)` | 맨 아래로 스크롤 (`duration`, `easing`) |

**easing 옵션**: `'linear'`, `'easeInOutCubic'`(기본), `'easeOutQuad'`, `'easeInOutQuad'`

---

## BackToTop

맨 위로 이동 버튼입니다. **싱글톤**으로 동작합니다.

```javascript
const { BackToTop } = await IMCAT.use('scroll');
new BackToTop({
  threshold: 300,
  position: 'bottom-right',
  icon: 'arrow_upward',
  title: '맨 위로',
  smooth: true
});
```

### BackToTop 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `threshold` | number | `300` | 버튼 표시 임계값 (px) |
| `position` | string | `'bottom-right'` | 위치 (`'bottom-right'`/`'bottom-left'`) |
| `icon` | string | `'arrow_upward'` | Material Icons 아이콘명 |
| `title` | string | `'맨 위로'` | 버튼 title/aria-label |
| `smooth` | boolean | `true` | 부드러운 스크롤 사용 |

### BackToTop 메서드

| 메서드 | 설명 |
| --- | --- |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Pagination](pagination.md) — 페이지 기반 네비게이션
