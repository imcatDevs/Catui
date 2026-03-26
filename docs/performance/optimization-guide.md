# 고부하 성능 최적화 가이드

IMCAT UI 프레임워크를 사용한 대규모 애플리케이션의 성능 최적화 전략입니다.

> **이 문서의 핵심**: VirtualScroll로 10만건 리스트 렌더링, 동적 모듈 로딩으로 초기 번들 최소화,
> debounce/throttle/rAF로 이벤트 최적화, destroy 패턴으로 메모리 누수 방지.

---

## 1. 대량 데이터 렌더링

### VirtualScroll — 10만건 리스트

일반 DOM 렌더링은 1,000건 이상에서 눈에 띄게 느려집니다.
`VirtualScroll`은 화면에 보이는 아이템만 렌더링하여 10만건도 60fps를 유지합니다.

```javascript
const Scroll = await IMCAT.use('scroll');

const vs = new Scroll.VirtualScroll('#list', {
  items: largeDataset,       // 100,000건
  itemHeight: 48,            // 고정 높이 (px)
  bufferSize: 10,            // 상하 버퍼 아이템 수
  containerHeight: 600,
  renderItem: (item, index) => `
    <span class="item__name">${IMCAT.security.escape(item.name)}</span>
    <span class="item__value">${item.value}</span>
  `
});

// 데이터 갱신 시 전체 재렌더링 없이 업데이트
vs.setItems(updatedDataset);
```

| 아이템 수 | 일반 DOM | VirtualScroll |
| --------- | -------- | ------------- |
| 1,000 | ~200ms | ~5ms |
| 10,000 | ~2초 | ~5ms |
| 100,000 | ~20초+ | ~5ms |

### InfiniteScroll — 페이지네이션 대체

전체 데이터를 한 번에 로드하지 않고, 스크롤 시 `IntersectionObserver`로 자동 추가 로드합니다.

```javascript
const Scroll = await IMCAT.use('scroll');

new Scroll.InfiniteScroll('#feed', {
  threshold: 300,            // 하단 300px 전에 트리거
  loadMore: async () => {
    const res = await IMCAT.api.get(`/api/posts?page=${page++}`);
    return res.data;
  },
  renderItem: (post) => `
    <article class="card">
      <h3>${IMCAT.security.escape(post.title)}</h3>
      <p>${IMCAT.security.escape(post.excerpt)}</p>
    </article>
  `
});
```

---

## 2. 초기 로딩 최적화

### 동적 모듈 로딩 — 코드 분할

IMCAT UI는 코어(~15KB gzipped)만 초기 로드하고, 모듈은 필요 시 동적 import합니다.

```javascript
// ❌ 불필요한 모듈을 미리 로드
const Modal = await IMCAT.use('overlays');
const Chart = await IMCAT.use('data-viz');
const Gantt = await IMCAT.use('gantt');

// ✅ 필요한 시점에 로드 (사용자 액션 기반)
document.querySelector('#open-chart').addEventListener('click', async () => {
  const Chart = await IMCAT.use('data-viz');
  new Chart.SimpleChart('#chart', { /* ... */ });
});
```

### 이미지 지연 로딩

```javascript
const ImageList = await IMCAT.use('imagelist');

// IntersectionObserver 기반 lazy loading
new ImageList.LazyImage({
  selector: 'img[data-lazy-src]',
  rootMargin: '100px',       // 뷰포트 100px 전에 로드 시작
  placeholder: 'skeleton',   // 스켈레톤 UI 표시
  animation: 'fade'          // 페이드인 효과
});
```

```html
<!-- HTML: data-lazy-src 사용 -->
<img data-lazy-src="/images/photo-large.jpg"
     data-lazy-thumb="/images/photo-thumb.jpg"
     alt="사진" width="400" height="300">
```

### CSS 모듈별 분리 로딩

```javascript
// 설정: 모듈 CSS 자동 로드
IMCAT.config.set({ autoLoadModuleCSS: true });

// overlays 모듈 사용 시 dist/modules/overlays.css 자동 로드
const Overlay = await IMCAT.use('overlays');
```

| 로딩 전략 | 초기 CSS 크기 |
| --------- | ------------- |
| `imcat-ui.all.css` (전체) | ~120KB |
| `imcat-ui.css` (코어만) | ~35KB |
| 코어 + 자동 모듈 CSS | ~35KB + 필요분만 |

---

## 3. 이벤트 최적화

### debounce — 검색 입력

연속 입력 시 마지막 입력 후 일정 시간 대기 → API 호출 횟수 감소.

```javascript
const debouncedSearch = IMCAT.utils.debounce(async (query) => {
  const results = await IMCAT.api.get(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(results.data);
}, 300); // 300ms 대기

IMCAT('#search-input').on('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### throttle — 스크롤/리사이즈

일정 간격으로만 실행 → 초당 호출 횟수 제한.

```javascript
const throttledResize = IMCAT.utils.throttle(() => {
  recalculateLayout();
}, 100); // 100ms 간격

window.addEventListener('resize', throttledResize);
```

### requestAnimationFrame — 애니메이션

브라우저 렌더링 주기에 맞춰 실행 → 60fps 보장.

```javascript
function smoothScroll(target) {
  const start = window.scrollY;
  const end = target.offsetTop;
  const duration = 500;
  let startTime;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = IMCAT.animation.easings.easeOutCubic(progress);
    window.scrollTo(0, start + (end - start) * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
```

---

## 4. 메모리 관리

### destroy 패턴 — 메모리 누수 방지

모든 IMCAT UI 컴포넌트는 `destroy()` 메서드를 제공합니다.
SPA 뷰 전환 시 반드시 호출하세요.

```javascript
let currentComponents = [];

// 뷰 진입 시 컴포넌트 생성
function onViewEnter() {
  const chart = new Chart.SimpleChart('#chart', { /* ... */ });
  const modal = new Overlay.Modal({ /* ... */ });
  currentComponents.push(chart, modal);
}

// 뷰 이탈 시 정리
function onViewLeave() {
  currentComponents.forEach(c => c.destroy());
  currentComponents = [];
}

// 라우터에 연결
IMCAT.router.on('beforeChange', onViewLeave);
```

### registerInstance — 자동 정리

`IMCAT.registerInstance()`로 등록된 컴포넌트는 뷰 전환 시 자동 destroy됩니다.

```javascript
const chart = new Chart.SimpleChart('#chart', { /* ... */ });
IMCAT.registerInstance(chart); // 뷰 전환 시 자동 정리
```

### 이벤트 리스너 정리 체크리스트

```javascript
class MyComponent {
  constructor() {
    // ✅ 참조를 보관하여 나중에 제거 가능하게
    this._onResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  destroy() {
    // ✅ 이벤트 리스너 제거
    window.removeEventListener('resize', this._onResize);

    // ✅ Observer 해제
    if (this._observer) this._observer.disconnect();

    // ✅ Timer 해제
    if (this._timer) clearInterval(this._timer);

    // ✅ AbortController 중단
    if (this._abortController) this._abortController.abort();

    // ✅ DOM 참조 해제
    this.container = null;
  }
}
```

---

## 5. 네트워크 최적화

### API 요청 중복 방지

```javascript
// AbortController로 이전 요청 취소
let controller = null;

async function fetchData(query) {
  if (controller) controller.abort(); // 이전 요청 취소
  controller = new AbortController();

  try {
    const res = await IMCAT.api.get(`/api/data?q=${query}`, {
      signal: controller.signal
    });
    return res.data;
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
}
```

### 모듈 프리로드

사용자 행동을 예측하여 모듈을 미리 로드합니다.

```javascript
// 마우스 호버 시 모듈 프리로드
document.querySelector('#chart-tab').addEventListener('mouseenter', () => {
  IMCAT.use('data-viz'); // 캐싱되므로 클릭 시 즉시 사용 가능
}, { once: true });
```

---

## 6. 렌더링 최적화

### DocumentFragment 배치 DOM 조작

```javascript
// ❌ 매번 DOM 접근 (리플로우 반복)
items.forEach(item => {
  const div = document.createElement('div');
  div.textContent = item.name;
  container.appendChild(div); // 매번 리플로우
});

// ✅ Fragment로 한 번에 삽입
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const div = document.createElement('div');
  div.textContent = item.name;
  fragment.appendChild(div);
});
container.appendChild(fragment); // 리플로우 1회
```

### GPU 가속 애니메이션

```javascript
// ✅ GPU 가속 속성 사용 (transform, opacity)
await IMCAT.animation.animate('#panel').slideDown(300);

// ❌ 레이아웃 트리거 속성 피하기 (width, height, top, left)
element.style.top = '100px';   // 리플로우 발생
element.style.transform = 'translateY(100px)'; // ✅ GPU 가속
```

---

## 성능 측정 체크리스트

- [ ] Lighthouse Performance 점수 90+ 확인
- [ ] 1,000건 이상 리스트에 VirtualScroll 적용
- [ ] 이미지에 LazyImage 적용
- [ ] 모듈 CSS 분리 로딩 (`autoLoadModuleCSS: true`)
- [ ] 검색/필터에 debounce 적용 (300ms)
- [ ] 스크롤/리사이즈에 throttle 적용 (100ms)
- [ ] 뷰 전환 시 모든 컴포넌트 `destroy()` 호출
- [ ] Chrome DevTools Memory 탭으로 누수 확인
- [ ] Network 탭에서 불필요한 중복 요청 확인

---

## 관련 문서

- [Scroll 모듈](../modules/scroll.md) — VirtualScroll, InfiniteScroll, Scrollspy
- [ImageList 모듈](../modules/imagelist.md) — LazyImage, Masonry
- [Events](../core/events.md) — EventBus, EventEmitterMixin
- [Config](../core/config.md) — autoLoadModuleCSS 설정
