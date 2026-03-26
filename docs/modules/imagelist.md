# ImageList

ImageList, ImageLightbox, ImageCompare, LazyImage — 이미지 갤러리 및 뷰어 컴포넌트를 제공합니다.

> 소스: `src/modules/imagelist.js`
>
> **이 문서의 핵심**: `IMCAT.use('imagelist')` → ImageList, ImageLightbox, ImageCompare, LazyImage.
> ImageList: 그리드/메이슨리 갤러리. ImageCompare: 전후 비교 슬라이더. LazyImage: 지연 로딩.

## 로드 방법

```javascript
const { ImageList, ImageLightbox, ImageCompare, LazyImage } = await IMCAT.use('imagelist');
```

## ImageList

```javascript
const { ImageList } = await IMCAT.use('imagelist');
new ImageList('#gallery', {
  items: [
    { src: 'img1.jpg', alt: '이미지 1', caption: '설명' },
    { src: 'img2.jpg', alt: '이미지 2' },
    { src: 'img3.jpg', alt: '이미지 3' }
  ],
  layout: 'masonry',
  columns: 3,
  gap: 8,
  lightbox: true,
  onClick: (item, index) => console.log('클릭:', index)
});
```

### ImageList 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` | array | `[]` | 이미지 배열 `{ src, alt, caption? }` |
| `layout` | string | `'grid'` | 레이아웃 (`'grid'`/`'masonry'`) |
| `columns` | number | `3` | 컬럼 수 |
| `gap` | number | `8` | 간격 (px) |
| `lightbox` | boolean | `true` | 클릭 시 확대 |

## ImageCompare

```javascript
const { ImageCompare } = await IMCAT.use('imagelist');
new ImageCompare('#compare', {
  before: { src: 'before.jpg', label: '이전' },
  after: { src: 'after.jpg', label: '이후' },
  orientation: 'horizontal'
});
```

## ImageLightbox

이미지 확대 뷰어입니다. ImageList의 `lightbox: true` 옵션과 연동됩니다.

```javascript
const { ImageLightbox } = await IMCAT.use('imagelist');
ImageLightbox.open({
  images: [
    { src: 'img1.jpg', alt: '이미지 1', caption: '설명' },
    { src: 'img2.jpg', alt: '이미지 2' }
  ],
  startIndex: 0
});
```

## LazyImage

이미지 지연 로딩 (Intersection Observer 기반) 컴포넌트입니다.

```javascript
const { LazyImage } = await IMCAT.use('imagelist');
new LazyImage({
  selector: 'img[data-src]',
  rootMargin: '200px',
  threshold: 0.1
});
```

## 관련 문서

- [Carousel](carousel.md) — 이미지 슬라이더
- [Media Viewer](media-viewer.md) — 비디오/이미지 뷰어
