# ImageList

ImageList, ImageLightbox, ImageCompare, LazyImage — 이미지 갤러리 및 뷰어 컴포넌트를 제공합니다.

> 소스: `src/modules/imagelist.js`
>
> **이 문서의 핵심**: `IMCAT.use('imagelist')` → ImageList, ImageLightbox, ImageCompare, LazyImage.
> ImageList: 그리드/메이슨리/퀼트 갤러리. ImageLightbox: 확대 뷰어 (싱글톤).
> ImageCompare: Before/After 비교 슬라이더. LazyImage: 지연 로딩 (싱글톤).

## 로드 방법

```javascript
const { ImageList, ImageLightbox, ImageCompare, LazyImage } = await IMCAT.use('imagelist');
```

---

## ImageList

다양한 레이아웃의 이미지 그리드입니다. 반응형, 지연 로딩, 라이트박스를 지원합니다.

```javascript
const { ImageList } = await IMCAT.use('imagelist');
new ImageList('#gallery', {
  images: [
    { src: 'img1.jpg', thumb: 'thumb1.jpg', alt: '이미지 1', title: '설명' },
    { src: 'img2.jpg', alt: '이미지 2', featured: true }
  ],
  layout: 'masonry',
  columns: 4,
  gap: 8,
  aspectRatio: '1:1',
  hover: 'zoom',
  lightbox: true,
  lazy: true,
  rounded: 8,
  showTitle: false,
  responsive: { 768: 3, 480: 2 },
  onClick: (item, index, e) => console.log('클릭:', index),
  onLoad: (img) => console.log('로드:', img)
});
```

### ImageList 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `images` | array | `[]` | 이미지 배열 `{ src, thumb?, title?, alt?, width?, height?, featured? }` |
| `layout` | string | `'grid'` | 레이아웃 (`'grid'`/`'masonry'`/`'quilted'`) |
| `columns` | number | `4` | 컬럼 수 |
| `gap` | number | `8` | 간격 (px) |
| `aspectRatio` | string | `'1:1'` | 비율 (`'1:1'`/`'4:3'`/`'16:9'`/`'auto'`) |
| `hover` | string | `'zoom'` | 호버 효과 (`'zoom'`/`'fade'`/`'overlay'`/`'none'`) |
| `lightbox` | boolean | `true` | 클릭 시 라이트박스 열기 |
| `lazy` | boolean | `true` | 지연 로딩 |
| `rounded` | number | `8` | 테두리 반경 (px) |
| `showTitle` | boolean | `false` | 타이틀 오버레이 표시 |
| `responsive` | object | `{ 768: 3, 480: 2 }` | 반응형 컬럼 설정 (breakpoint: columns) |
| `onClick` | function | `null` | 클릭 콜백 `(item, index, event)` |
| `onLoad` | function | `null` | 이미지 로드 콜백 `(img)` |

### ImageList 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setImages(images)` | 이미지 배열 교체 |
| `.addImage(image)` | 이미지 추가 |
| `.removeImage(index)` | 이미지 제거 |
| `.refresh()` | 레이아웃 새로고침 |
| `.destroy()` | 인스턴스 제거 |

---

## ImageLightbox

이미지 확대 뷰어입니다. **싱글톤**으로 동작합니다. ImageList의 `lightbox: true`와 자동 연동됩니다.

```javascript
const { ImageLightbox } = await IMCAT.use('imagelist');
const lb = new ImageLightbox({
  images: [
    { src: 'img1.jpg', alt: '이미지 1', title: '캡션 1' },
    { src: 'img2.jpg', alt: '이미지 2' }
  ],
  startIndex: 0,
  zoom: true,
  download: true,
  counter: true,
  thumbnails: false,
  keyboard: true,
  swipe: true,
  closeOnBackdrop: true,
  animation: 'fade',
  onOpen: (index) => console.log('열림:', index),
  onClose: () => console.log('닫힘'),
  onChange: (index) => console.log('변경:', index)
});
lb.open(0);
```

### ImageLightbox 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `images` | array | `[]` | 이미지 배열 `{ src, thumb?, title?, alt? }` |
| `startIndex` | number | `0` | 시작 인덱스 |
| `zoom` | boolean | `true` | 줌 기능 |
| `download` | boolean | `true` | 다운로드 버튼 |
| `counter` | boolean | `true` | 카운터 표시 |
| `thumbnails` | boolean | `false` | 썸네일 표시 |
| `keyboard` | boolean | `true` | 키보드 네비게이션 |
| `swipe` | boolean | `true` | 터치 스와이프 |
| `closeOnBackdrop` | boolean | `true` | 배경 클릭 시 닫기 |
| `animation` | string | `'fade'` | 애니메이션 (`'fade'`/`'zoom'`) |
| `backdropColor` | string | `'rgba(0,0,0,0.95)'` | 배경 색상 |
| `onOpen` | function | `null` | 열림 콜백 `(index)` |
| `onClose` | function | `null` | 닫힘 콜백 |
| `onChange` | function | `null` | 변경 콜백 `(index)` |

### ImageLightbox 메서드

| 메서드 | 설명 |
| --- | --- |
| `.open(index?)` | 라이트박스 열기 |
| `.close()` | 라이트박스 닫기 |
| `.next()` | 다음 이미지 |
| `.prev()` | 이전 이미지 |
| `.goTo(index)` | 특정 이미지로 이동 |
| `.destroy()` | 인스턴스 제거 |

---

## ImageCompare

Before/After 이미지 비교 슬라이더입니다. 마우스/터치 드래그를 지원합니다.

```javascript
const { ImageCompare } = await IMCAT.use('imagelist');
new ImageCompare('#compare', {
  before: { src: 'before.jpg', label: '이전' },
  after: { src: 'after.jpg', label: '이후' },
  orientation: 'horizontal',
  initialPosition: 50,
  showLabels: true,
  showHandle: true,
  handleSize: 40,
  handleColor: '#fff',
  lineWidth: 3,
  lineColor: '#fff',
  onSlide: (position) => console.log('위치:', position)
});
```

### ImageCompare 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `before` | object | `{ src: '', label: 'Before' }` | 이전 이미지 |
| `after` | object | `{ src: '', label: 'After' }` | 이후 이미지 |
| `orientation` | string | `'horizontal'` | 방향 (`'horizontal'`/`'vertical'`) |
| `initialPosition` | number | `50` | 초기 위치 (0-100) |
| `showLabels` | boolean | `true` | 라벨 표시 |
| `showHandle` | boolean | `true` | 핸들 표시 |
| `handleSize` | number | `40` | 핸들 크기 (px) |
| `handleColor` | string | `'#fff'` | 핸들 색상 |
| `lineWidth` | number | `3` | 구분선 너비 (px) |
| `lineColor` | string | `'#fff'` | 구분선 색상 |
| `onSlide` | function | `null` | 슬라이드 콜백 `(position)` |

### ImageCompare 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setPosition(pos)` | 위치 설정 (0-100) |
| `.getPosition()` | 현재 위치 반환 |
| `.setImages(before, after)` | 이미지 교체 |
| `.destroy()` | 인스턴스 제거 |

---

## LazyImage

이미지 지연 로딩 (Intersection Observer 기반) 컴포넌트입니다. **싱글톤**으로 동작합니다.

```javascript
const { LazyImage } = await IMCAT.use('imagelist');
new LazyImage({
  selector: '[data-lazy-src]',
  rootMargin: '50px',
  threshold: 0.1,
  placeholder: 'blur',
  placeholderColor: '#e5e7eb',
  animation: 'fade',
  animationDuration: 300,
  onLoad: (img) => console.log('로드:', img),
  onError: (img) => console.log('에러:', img)
});
```

### HTML 사용

```html
<img data-lazy-src="image.jpg" data-lazy-thumb="thumb.jpg" alt="설명">
```

### LazyImage 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `selector` | string | `'[data-lazy-src]'` | 대상 요소 셀렉터 |
| `root` | element | `null` | IntersectionObserver root |
| `rootMargin` | string | `'50px'` | 미리 로드 마진 |
| `threshold` | number | `0.1` | 교차 비율 |
| `placeholder` | string | `'blur'` | 플레이스홀더 (`'blur'`/`'skeleton'`/`'color'`/`'none'`) |
| `placeholderColor` | string | `'#e5e7eb'` | 플레이스홀더 색상 |
| `animation` | string | `'fade'` | 로드 애니메이션 (`'fade'`/`'none'`) |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onLoad` | function | `null` | 로드 완료 콜백 `(img)` |
| `onError` | function | `null` | 로드 실패 콜백 `(img)` |

### LazyImage 메서드

| 메서드 | 설명 |
| --- | --- |
| `.observe(element)` | 새 요소 관찰 시작 |
| `.refresh()` | 미로드 이미지 재스캔 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Carousel](carousel.md) — 이미지 슬라이더
- [Media Viewer](media-viewer.md) — 비디오/이미지 뷰어
