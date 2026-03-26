# Carousel

이미지/콘텐츠 슬라이더 컴포넌트를 제공합니다.

> 소스: `src/modules/carousel.js`
>
> **이 문서의 핵심**: `IMCAT.use('carousel')` → Carousel, Lightbox.
> Carousel: 이미지/콘텐츠 슬라이더 (5가지 전환 효과, 터치/드래그, 반응형).
> Lightbox: 이미지 라이트박스 (싱글톤, data-lightbox 속성 기반 갤러리).

## 로드 방법

```javascript
const { Carousel, Lightbox } = await IMCAT.use('carousel');
```

---

## Carousel

```javascript
const { Carousel } = await IMCAT.use('carousel');
const carousel = new Carousel('#myCarousel', {
  items: [
    { src: 'img1.jpg', alt: '이미지 1', title: '제목 1' },
    { src: 'img2.jpg', alt: '이미지 2', title: '제목 2' }
  ],
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  arrows: true,
  loop: true,
  effect: 'slide',
  onSlideChange: (current, prev) => console.log(current, prev)
});
```

### Carousel 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` | array | `[]` | 슬라이드 아이템 배열 `[{src, alt, title, description}]` |
| `startIndex` | number | `0` | 시작 인덱스 |
| `arrows` | boolean | `true` | 좌우 화살표 |
| `dots` | boolean | `true` | 하단 도트 인디케이터 |
| `counter` | boolean | `false` | 현재/전체 카운터 |
| `thumbnails` | boolean | `false` | 썸네일 네비게이션 |
| `autoplay` | boolean | `false` | 자동 재생 |
| `autoplaySpeed` | number | `3000` | 자동 재생 간격 (ms) |
| `pauseOnHover` | boolean | `true` | 호버 시 일시정지 |
| `loop` | boolean | `true` | 무한 루프 (클론 기반) |
| `slidesToShow` | number | `1` | 한 번에 보여줄 슬라이드 수 |
| `slidesToScroll` | number | `1` | 한 번에 스크롤할 슬라이드 수 |
| `speed` | number | `300` | 전환 속도 (ms) |
| `easing` | string | `'easeOutCubic'` | 전환 이징 |
| `effect` | string | `'slide'` | 전환 효과 (`'slide'`/`'fade'`/`'scale'`/`'flip'`/`'cube'`) |
| `draggable` | boolean | `true` | 드래그 가능 |
| `swipeThreshold` | number | `50` | 스와이프 인식 임계값 (px) |
| `responsive` | array | `null` | 반응형 설정 `[{breakpoint, settings}]` |
| `onSlideChange` | function | `null` | 슬라이드 변경 콜백 `(currentIndex, prevIndex)` |
| `onInit` | function | `null` | 초기화 완료 콜백 `(carousel)` |
| `ariaLabel` | string | `'캐러셀'` | 접근성 라벨 |

### Carousel 메서드

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 슬라이드 |
| `.prev()` | 이전 슬라이드 |
| `.goTo(index)` | 특정 슬라이드로 이동 |
| `.play()` | 자동 재생 시작 |
| `.pause()` | 자동 재생 일시정지 |
| `.getCurrentIndex()` | 현재 슬라이드 인덱스 반환 |
| `.getSlideCount()` | 전체 슬라이드 수 반환 |
| `.destroy()` | 인스턴스 제거 |

### HTML data 속성

HTML에서 직접 옵션을 설정할 수 있습니다:

```html
<div class="carousel" data-autoplay="true" data-speed="5000" data-loop="true" data-arrows="true" data-dots="true">
  <div>슬라이드 1</div>
  <div>슬라이드 2</div>
</div>
```

---

## Lightbox

이미지 라이트박스입니다. **싱글톤** 패턴으로 동작하며, `data-lightbox` 속성으로 자동 갤러리를 구성합니다.

```javascript
const { Lightbox } = await IMCAT.use('carousel');

// 싱글톤 초기화 (옵션 설정)
new Lightbox({
  selector: 'a[data-lightbox], img[data-lightbox]',
  loop: true,
  showCounter: true,
  showCaption: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  onOpen: (lb) => console.log('열림'),
  onClose: (lb) => console.log('닫힘'),
  onChange: (index, prevIndex) => console.log('변경:', index)
});
```

### HTML 사용 (자동 갤러리)

```html
<!-- 같은 data-lightbox 값 → 하나의 갤러리 -->
<a href="big1.jpg" data-lightbox="gallery1" data-caption="사진 1">
  <img src="thumb1.jpg" alt="사진 1">
</a>
<a href="big2.jpg" data-lightbox="gallery1" data-caption="사진 2">
  <img src="thumb2.jpg" alt="사진 2">
</a>
```

### Lightbox 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `gallery` | string/element | `null` | 갤러리 요소/셀렉터 |
| `selector` | string | `'a[data-lightbox], img[data-lightbox]'` | 트리거 요소 셀렉터 |
| `startIndex` | number | `0` | 시작 인덱스 |
| `loop` | boolean | `true` | 무한 루프 |
| `showCounter` | boolean | `true` | 카운터 표시 |
| `showCaption` | boolean | `true` | 캡션 표시 |
| `showThumbnails` | boolean | `false` | 썸네일 표시 |
| `closeOnBackdrop` | boolean | `true` | 배경 클릭 시 닫기 |
| `closeOnEscape` | boolean | `true` | ESC 키로 닫기 |
| `swipeToClose` | boolean | `true` | 스와이프로 닫기 |
| `zoom` | boolean | `false` | 줌 기능 |
| `animation` | boolean | `true` | 애니메이션 사용 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `onOpen` | function | `null` | 열림 콜백 `(lightbox)` |
| `onClose` | function | `null` | 닫힘 콜백 `(lightbox)` |
| `onChange` | function | `null` | 슬라이드 변경 콜백 `(index, prevIndex)` |

### Lightbox 메서드

| 메서드 | 설명 |
| --- | --- |
| `.open(index?)` | 라이트박스 열기 |
| `.close()` | 라이트박스 닫기 |
| `.next()` | 다음 이미지 |
| `.prev()` | 이전 이미지 |
| `.destroy()` | 인스턴스 제거 |

### 키보드 단축키

| 키 | 동작 |
| --- | --- |
| `ESC` | 닫기 |
| `←` | 이전 이미지 |
| `→` | 다음 이미지 |

---

## 관련 문서

- [ImageList](imagelist.md) — 이미지 갤러리
