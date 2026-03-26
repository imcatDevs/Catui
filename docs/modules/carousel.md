# Carousel

이미지/콘텐츠 슬라이더 컴포넌트를 제공합니다.

> 소스: `src/modules/carousel.js`
>
> **이 문서의 핵심**: `IMCAT.use('carousel')` → Carousel, Lightbox.
> 자동 재생, 인디케이터, 네비게이션 화살표, 터치 스와이프 지원.

## 로드 방법

```javascript
const { Carousel, Lightbox } = await IMCAT.use('carousel');
```

## 기본 사용

```javascript
const { Carousel } = await IMCAT.use('carousel');
const carousel = new Carousel('#myCarousel', {
  autoplay: true,
  interval: 3000,
  indicators: true,
  arrows: true,
  loop: true
});
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `autoplay` | boolean | `false` | 자동 재생 |
| `interval` | number | `3000` | 자동 전환 간격 (ms) |
| `indicators` | boolean | `true` | 하단 인디케이터 |
| `arrows` | boolean | `true` | 좌우 화살표 |
| `loop` | boolean | `true` | 무한 반복 |
| `animation` | string | `'slide'` | 전환 효과 (`'slide'`/`'fade'`) |
| `pauseOnHover` | boolean | `true` | 호버 시 일시정지 |
| `onChange` | function | `null` | 슬라이드 변경 콜백 (index) |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 슬라이드 |
| `.prev()` | 이전 슬라이드 |
| `.goTo(index)` | 특정 슬라이드로 |
| `.play()` | 자동 재생 시작 |
| `.pause()` | 일시정지 |
| `.destroy()` | 제거 |

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onChange` | `(index)` | 슬라이드 변경 시 |
| `onPlay` | `()` | 자동 재생 시작 시 |
| `onPause` | `()` | 일시정지 시 |

## Lightbox

이미지 확대 뷰어입니다. Carousel과 유사하지만 오버레이 모달로 표시됩니다.

```javascript
const { Lightbox } = await IMCAT.use('carousel');
new Lightbox('#gallery', {
  images: [
    { src: 'img1.jpg', caption: '이미지 1' },
    { src: 'img2.jpg', caption: '이미지 2' }
  ]
});
```

## 관련 문서

- [ImageList](imagelist.md) — 이미지 갤러리
