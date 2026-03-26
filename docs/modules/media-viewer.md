# Media Viewer

VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo — 미디어 재생/뷰어 컴포넌트를 제공합니다.

> 소스: `src/modules/media-viewer.js`
>
> **이 문서의 핵심**: `IMCAT.use('media-viewer')` → VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo.
> VideoPlayer: 커스텀 비디오 플레이어. AudioPlayer: 커스텀 오디오 플레이어.
> ImageViewer: 확대/축소/회전 뷰어. EmbedVideo: YouTube/Vimeo 반응형 임베드.

## 로드 방법

```javascript
const { VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo } = await IMCAT.use('media-viewer');
```

---

## VideoPlayer

커스텀 컨트롤을 가진 비디오 플레이어입니다. PIP 모드, 전체 화면, 재생 속도 조절, 키보드 단축키를 지원합니다.

```javascript
const { VideoPlayer } = await IMCAT.use('media-viewer');
new VideoPlayer('#video', {
  src: 'video.mp4',
  poster: 'thumbnail.jpg',
  controls: true,
  customControls: true,
  autoplay: false,
  muted: false,
  loop: false,
  volume: 1,
  onPlay: () => console.log('재생'),
  onPause: () => console.log('정지'),
  onEnded: () => console.log('종료'),
  onTimeUpdate: (time) => console.log('현재:', time),
  onError: () => console.log('에러')
});
```

### VideoPlayer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `src` | string | `''` | 비디오 URL |
| `poster` | string | `''` | 포스터 이미지 |
| `autoplay` | boolean | `false` | 자동 재생 |
| `muted` | boolean | `false` | 음소거 |
| `loop` | boolean | `false` | 반복 재생 |
| `controls` | boolean | `true` | 컨트롤 표시 |
| `customControls` | boolean | `true` | 커스텀 컨트롤 사용 (`false`면 브라우저 기본) |
| `playbackRates` | array | `[0.5, 0.75, 1, 1.25, 1.5, 2]` | 재생 속도 목록 |
| `volume` | number | `1` | 초기 볼륨 (0~1) |
| `onPlay` | function | `null` | 재생 콜백 |
| `onPause` | function | `null` | 일시정지 콜백 |
| `onEnded` | function | `null` | 재생 종료 콜백 |
| `onTimeUpdate` | function | `null` | 시간 업데이트 콜백 `(currentTime)` |
| `onError` | function | `null` | 에러 콜백 |

### VideoPlayer 메서드

| 메서드 | 설명 |
| --- | --- |
| `.play()` | 재생 |
| `.pause()` | 일시정지 |
| `.togglePlay()` | 재생/일시정지 토글 |
| `.seek(time)` | 지정 시간으로 이동 (초) |
| `.setVolume(volume)` | 볼륨 설정 (0~1) |
| `.toggleMute()` | 음소거 토글 |
| `.setPlaybackRate(rate)` | 재생 속도 설정 |
| `.togglePIP()` | PIP(화면 속 화면) 모드 토글 |
| `.toggleFullscreen()` | 전체 화면 토글 |
| `.setSrc(src, poster?)` | 비디오 소스 변경 |
| `.getCurrentTime()` | 현재 재생 시간 반환 |
| `.getDuration()` | 전체 재생 시간 반환 |
| `.destroy()` | 인스턴스 제거 |

### 키보드 단축키

| 키 | 동작 |
| --- | --- |
| `Space` / `K` | 재생/일시정지 토글 |
| `←` / `→` | 10초 뒤로/앞으로 |
| `↑` / `↓` | 볼륨 +/- 0.1 |
| `M` | 음소거 토글 |
| `F` | 전체 화면 토글 |

---

## AudioPlayer

커스텀 오디오 플레이어입니다. 커버 이미지, 아티스트 정보, 볼륨/진행 바를 지원합니다.

```javascript
const { AudioPlayer } = await IMCAT.use('media-viewer');
new AudioPlayer('#audio', {
  src: 'music.mp3',
  title: '음악 제목',
  artist: '아티스트',
  cover: 'cover.jpg',
  volume: 0.8,
  onPlay: () => console.log('재생'),
  onEnded: () => console.log('종료')
});
```

### AudioPlayer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `src` | string | `''` | 오디오 URL |
| `title` | string | `''` | 트랙 제목 |
| `artist` | string | `''` | 아티스트 이름 |
| `cover` | string | `''` | 커버 이미지 URL |
| `autoplay` | boolean | `false` | 자동 재생 |
| `loop` | boolean | `false` | 반복 재생 |
| `volume` | number | `1` | 초기 볼륨 (0~1) |
| `onPlay` | function | `null` | 재생 콜백 |
| `onPause` | function | `null` | 일시정지 콜백 |
| `onEnded` | function | `null` | 재생 종료 콜백 |

### AudioPlayer 메서드

| 메서드 | 설명 |
| --- | --- |
| `.play()` | 재생 |
| `.pause()` | 일시정지 |
| `.togglePlay()` | 재생/일시정지 토글 |
| `.setTrack(src, title?, artist?, cover?)` | 트랙 변경 |
| `.destroy()` | 인스턴스 제거 |

---

## ImageViewer

확대/축소, 회전, 다운로드가 가능한 이미지 뷰어입니다. 마우스 휠 줌을 지원합니다.

```javascript
const { ImageViewer } = await IMCAT.use('media-viewer');
new ImageViewer('#viewer', {
  src: 'photo.jpg',
  alt: '사진 설명',
  zoomable: true,
  rotatable: true,
  downloadable: true,
  minZoom: 0.5,
  maxZoom: 3,
  zoomStep: 0.25
});
```

### ImageViewer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `src` | string | `''` | 이미지 URL |
| `alt` | string | `''` | 대체 텍스트 |
| `zoomable` | boolean | `true` | 확대/축소 활성화 |
| `rotatable` | boolean | `true` | 회전 활성화 |
| `downloadable` | boolean | `true` | 다운로드 버튼 표시 |
| `minZoom` | number | `0.5` | 최소 줌 배율 |
| `maxZoom` | number | `3` | 최대 줌 배율 |
| `zoomStep` | number | `0.25` | 줌 단계 |

### ImageViewer 메서드

| 메서드 | 설명 |
| --- | --- |
| `.zoomIn()` | 확대 (`zoomStep`만큼) |
| `.zoomOut()` | 축소 (`zoomStep`만큼) |
| `.setZoom(level)` | 줌 배율 직접 설정 |
| `.rotate(degrees)` | 지정 각도만큼 회전 (예: `90`, `-90`) |
| `.reset()` | 줌/회전 초기화 |
| `.download()` | 이미지 다운로드 |
| `.setSrc(src, alt?)` | 이미지 소스 변경 |
| `.destroy()` | 인스턴스 제거 |

---

## EmbedVideo

YouTube, Vimeo 등 외부 비디오를 반응형으로 임베드합니다. 일반 URL을 자동으로 임베드 URL로 변환합니다.

```javascript
const { EmbedVideo } = await IMCAT.use('media-viewer');
new EmbedVideo('#embed', {
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  ratio: '16x9',
  allowFullscreen: true,
  autoplay: false,
  muted: false,
  rounded: true,
  shadow: true
});
```

### EmbedVideo 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `url` | string | `''` | 비디오 URL (YouTube/Vimeo 일반 URL 자동 변환) |
| `ratio` | string | `'16x9'` | 비율 (`'21x9'`/`'16x9'`/`'4x3'`/`'1x1'`) |
| `allowFullscreen` | boolean | `true` | 전체 화면 허용 |
| `autoplay` | boolean | `false` | 자동 재생 |
| `muted` | boolean | `false` | 음소거 |
| `rounded` | boolean | `false` | 둥근 모서리 |
| `shadow` | boolean | `false` | 그림자 효과 |
| `title` | string | `'임베드 비디오'` | iframe 제목 (접근성) |
| `allow` | string | `'accelerometer; autoplay; ...'` | iframe allow 속성 |
| `loading` | string | `'lazy'` | 로딩 방식 (`'lazy'`/`'eager'`) |

### EmbedVideo 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setSrc(url)` | 비디오 URL 변경 |
| `.setRatio(ratio)` | 비율 변경 (`'21x9'`/`'16x9'`/`'4x3'`/`'1x1'`) |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [ImageList](imagelist.md) — 이미지 갤러리
- [Carousel](carousel.md) — 이미지 슬라이더
