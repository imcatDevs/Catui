# Media Viewer

VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo — 미디어 재생/뷰어 컴포넌트를 제공합니다.

> 소스: `src/modules/media-viewer.js`
>
> **이 문서의 핵심**: `IMCAT.use('media-viewer')` → VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo.
> VideoPlayer: 커스텀 비디오 플레이어. ImageViewer: 확대/축소 뷰어. EmbedVideo: YouTube/Vimeo 임베드.

## 로드 방법

```javascript
const { VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo } = await IMCAT.use('media-viewer');
```

## VideoPlayer

```javascript
const { VideoPlayer } = await IMCAT.use('media-viewer');
new VideoPlayer('#video', {
  src: 'video.mp4',
  poster: 'thumbnail.jpg',
  controls: true,
  autoplay: false,
  loop: false,
  onPlay: () => console.log('재생'),
  onPause: () => console.log('정지')
});
```

### VideoPlayer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `src` | string | `''` | 비디오 URL |
| `poster` | string | `''` | 포스터 이미지 |
| `controls` | boolean | `true` | 컨트롤 표시 |
| `autoplay` | boolean | `false` | 자동 재생 |
| `loop` | boolean | `false` | 반복 재생 |
| `playbackRates` | array | `[0.5, 1, 1.5, 2]` | 재생 속도 |
| `onPlay` | function | `null` | 재생 콜백 |
| `onPause` | function | `null` | 정지 콜백 |

## AudioPlayer

```javascript
const { AudioPlayer } = await IMCAT.use('media-viewer');
new AudioPlayer('#audio', {
  src: 'music.mp3',
  controls: true,
  waveform: true
});
```

## ImageViewer

확대/축소, 회전이 가능한 이미지 뷰어입니다.

```javascript
const { ImageViewer } = await IMCAT.use('media-viewer');
new ImageViewer('#viewer', {
  src: 'photo.jpg',
  zoom: true,
  rotate: true,
  download: true,
  maxZoom: 5
});
```

## 메서드 (공통)

| 메서드 | 설명 |
| --- | --- |
| `.play()` | 재생 (Video/Audio) |
| `.pause()` | 일시정지 |
| `.destroy()` | 제거 |

## EmbedVideo

YouTube, Vimeo 등 외부 비디오를 임베드합니다.

```javascript
const { EmbedVideo } = await IMCAT.use('media-viewer');
new EmbedVideo('#embed', {
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  responsive: true
});
```

## 관련 문서

- [ImageList](imagelist.md) — 이미지 갤러리
- [Carousel](carousel.md) — 이미지 슬라이더
