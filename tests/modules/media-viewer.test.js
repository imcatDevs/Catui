/**
 * Media Viewer Module 테스트
 * VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo;

beforeEach(async () => {
  const mod = await import('../../src/modules/media-viewer.js');
  VideoPlayer = mod.VideoPlayer || mod.default?.VideoPlayer;
  AudioPlayer = mod.AudioPlayer || mod.default?.AudioPlayer;
  ImageViewer = mod.ImageViewer || mod.default?.ImageViewer;
  EmbedVideo = mod.EmbedVideo || mod.default?.EmbedVideo;
  document.body.innerHTML = '<div id="mv-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('VideoPlayer', () => {
  it('VideoPlayer 클래스가 존재해야 함', () => {
    expect(VideoPlayer).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    expect(vp).toBeDefined();
    vp.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    if (vp && typeof vp.destroy === 'function') {
      vp.destroy();
    }
  });
});

describe('AudioPlayer', () => {
  it('AudioPlayer 클래스가 존재해야 함', () => {
    expect(AudioPlayer).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    // jsdom에 HTMLMediaElement.pause 미구현 — mock
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    expect(ap).toBeDefined();
    ap.destroy?.();
  });
});

describe('ImageViewer', () => {
  it('ImageViewer 클래스가 존재해야 함', () => {
    expect(ImageViewer).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var iv = new ImageViewer('#mv-container', { src: 'image.jpg' });
    expect(iv).toBeDefined();
    iv.destroy?.();
  });
});

describe('EmbedVideo', () => {
  it('EmbedVideo 클래스가 존재해야 함', () => {
    expect(EmbedVideo).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://youtube.com/watch?v=test' });
    expect(ev).toBeDefined();
    ev.destroy?.();
  });
});

describe('VideoPlayer 추가', () => {
  beforeEach(() => {
    // jsdom에서 HTMLMediaElement 메서드 미구현
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
  });

  it('defaults()', () => {
    var d = VideoPlayer.defaults();
    expect(d.autoplay).toBe(false);
    expect(d.volume).toBe(1);
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new VideoPlayer('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('play / pause / togglePlay', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.play();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    vp.pause();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    vp.togglePlay();
    vp.destroy?.();
  });

  it('setVolume / toggleMute', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.setVolume(0.5);
    expect(vp.video.volume).toBeCloseTo(0.5);
    vp.toggleMute();
    vp.destroy?.();
  });

  it('customControls false', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4', customControls: false });
    vp.destroy?.();
  });
});

describe('AudioPlayer 추가', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
  });

  it('defaults()', () => {
    var d = AudioPlayer.defaults();
    expect(d).toBeDefined();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new AudioPlayer('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('play / pause / togglePlay', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    ap.play();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    ap.pause();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    ap.togglePlay();
    ap.destroy?.();
  });

  it('setTrack', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    ap.setTrack('new.mp3', '새 제목', '아티스트', 'cover.jpg');
    expect(ap.audio.src).toContain('new.mp3');
    ap.destroy?.();
  });

  it('setTrack 커버 없음', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    ap.setTrack('new.mp3', '제목', '', '');
    ap.destroy?.();
  });

  it('cover 옵션', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3', cover: 'cover.jpg', title: '제목' });
    ap.destroy?.();
  });
});

describe('ImageViewer 추가', () => {
  it('defaults()', () => {
    var d = ImageViewer.defaults();
    expect(d).toBeDefined();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ImageViewer('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('zoomIn / zoomOut', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    iv.zoomIn();
    expect(iv._zoom).toBeGreaterThan(1);
    iv.zoomOut();
    iv.zoomOut();
    iv.destroy?.();
  });

  it('setZoom', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    iv.setZoom(2);
    expect(iv._zoom).toBe(2);
    iv.destroy?.();
  });

  it('rotate / reset', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    iv.rotate(90);
    expect(iv._rotation).toBe(90);
    iv.rotate(-90);
    expect(iv._rotation).toBe(0);
    iv.reset();
    expect(iv._zoom).toBe(1);
    iv.destroy?.();
  });

  it('setSrc', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    iv.setSrc('new.jpg', '새 이미지');
    expect(iv.image.src).toContain('new.jpg');
    iv.destroy?.();
  });

  it('download', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    iv.download();
    iv.destroy?.();
  });

  it('툴바 버튼 클릭', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    var zoomInBtn = iv.container.querySelector('[data-action="zoom-in"]');
    if (zoomInBtn) zoomInBtn.click();
    var zoomOutBtn = iv.container.querySelector('[data-action="zoom-out"]');
    if (zoomOutBtn) zoomOutBtn.click();
    var rotLeftBtn = iv.container.querySelector('[data-action="rotate-left"]');
    if (rotLeftBtn) rotLeftBtn.click();
    var rotRightBtn = iv.container.querySelector('[data-action="rotate-right"]');
    if (rotRightBtn) rotRightBtn.click();
    var resetBtn = iv.container.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.click();
    iv.destroy?.();
  });

  it('zoomable/rotatable/downloadable false', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg', zoomable: false, rotatable: false, downloadable: false });
    iv.destroy?.();
  });
});

describe('EmbedVideo 추가', () => {
  it('defaults()', () => {
    var d = EmbedVideo.defaults();
    expect(d).toBeDefined();
  });

  it('Vimeo URL', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://vimeo.com/123456' });
    ev.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new EmbedVideo('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('setSrc', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://youtube.com/watch?v=test' });
    ev.setSrc('https://youtube.com/watch?v=new');
    ev.destroy?.();
  });

  it('setRatio', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://youtube.com/watch?v=test' });
    ev.setRatio('4x3');
    expect(ev.options.ratio).toBe('4x3');
    ev.destroy?.();
  });

  it('autoplay / muted 옵션', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://youtube.com/watch?v=test', autoplay: true, muted: true });
    ev.destroy?.();
  });

  it('rounded / shadow 옵션', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://youtube.com/watch?v=test', rounded: true, shadow: true });
    ev.destroy?.();
  });

  it('Vimeo autoplay / muted', () => {
    var ev = new EmbedVideo('#mv-container', { url: 'https://vimeo.com/123', autoplay: true, muted: true });
    ev.destroy?.();
  });
});

describe('VideoPlayer 추가2', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
  });

  it('seek', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    Object.defineProperty(vp.video, 'duration', { value: 100, writable: true });
    vp.seek(50);
    expect(vp.video.currentTime).toBe(50);
    vp.destroy?.();
  });

  it('setSrc', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.setSrc('new.mp4', 'poster.jpg');
    vp.destroy?.();
  });

  it('getCurrentTime / getDuration', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    expect(vp.getCurrentTime()).toBe(0);
    expect(vp.getDuration()).toBeDefined();
    vp.destroy?.();
  });

  it('setPlaybackRate / _cycleSpeed', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.setPlaybackRate(1.5);
    expect(vp.video.playbackRate).toBe(1.5);
    var speedBtn = vp.controls.querySelector('.video-player__btn--speed');
    if (speedBtn) speedBtn.click();
    vp.destroy?.();
  });

  it('비디오 이벤트 — play/pause/ended', () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onEnded = vi.fn();
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4', onPlay, onPause, onEnded });
    vp.video.dispatchEvent(new Event('play'));
    expect(onPlay).toHaveBeenCalled();
    vp.video.dispatchEvent(new Event('pause'));
    expect(onPause).toHaveBeenCalled();
    vp.video.dispatchEvent(new Event('ended'));
    expect(onEnded).toHaveBeenCalled();
    vp.destroy?.();
  });

  it('비디오 이벤트 — timeupdate', () => {
    const onTimeUpdate = vi.fn();
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4', onTimeUpdate });
    Object.defineProperty(vp.video, 'duration', { value: 100, writable: true });
    vp.video.dispatchEvent(new Event('timeupdate'));
    expect(onTimeUpdate).toHaveBeenCalled();
    vp.destroy?.();
  });

  it('비디오 이벤트 — waiting/canplay', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.video.dispatchEvent(new Event('waiting'));
    expect(vp.loading.classList.contains('is-visible')).toBe(true);
    vp.video.dispatchEvent(new Event('canplay'));
    expect(vp.loading.classList.contains('is-visible')).toBe(false);
    vp.destroy?.();
  });

  it('비디오 이벤트 — error', () => {
    const onError = vi.fn();
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4', onError });
    vp.video.dispatchEvent(new Event('error'));
    expect(onError).toHaveBeenCalled();
    vp.destroy?.();
  });

  it('비디오 이벤트 — loadedmetadata', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.video.dispatchEvent(new Event('loadedmetadata'));
    vp.destroy?.();
  });

  it('프로그레스 바 클릭 — _seekTo', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    Object.defineProperty(vp.video, 'duration', { value: 100, writable: true });
    var progressBar = vp.controls.querySelector('.video-player__progress-bar');
    progressBar.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    progressBar.dispatchEvent(new MouseEvent('click', { clientX: 50 }));
    vp.destroy?.();
  });

  it('볼륨 입력', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    var volumeInput = vp.controls.querySelector('.video-player__volume-input');
    volumeInput.value = 0.3;
    volumeInput.dispatchEvent(new Event('input'));
    vp.destroy?.();
  });

  it('오버레이 재생 버튼', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    var bigPlay = vp.overlay.querySelector('.video-player__big-play');
    if (bigPlay) bigPlay.click();
    vp.destroy?.();
  });

  it('비디오 클릭 토글', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.video.click();
    vp.destroy?.();
  });

  it('볼륨 UI — volume_off / volume_down', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.setVolume(0);
    var icon = vp.controls.querySelector('.video-player__btn--volume i');
    expect(icon.textContent).toBe('volume_off');
    vp.setVolume(0.3);
    expect(icon.textContent).toBe('volume_down');
    vp.setVolume(0.8);
    expect(icon.textContent).toBe('volume_up');
    vp.destroy?.();
  });

  it('mousemove / mouseleave 컨트롤 자동 숨김', () => {
    vi.useFakeTimers();
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp._isPlaying = true;
    vp.container.dispatchEvent(new Event('mousemove'));
    vp.container.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(4000);
    vp.destroy?.();
    vi.useRealTimers();
  });

  it('poster / muted / loop 옵션', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4', poster: 'poster.jpg', muted: true, loop: true });
    vp.destroy?.();
  });

  it('toggleFullscreen', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.container.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    vp.toggleFullscreen();
    vp.destroy?.();
  });

  it('togglePIP', async () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.video.requestPictureInPicture = vi.fn().mockResolvedValue(undefined);
    await vp.togglePIP();
    vp.destroy?.();
  });

  it('toggleMute — 음소거 해제', () => {
    var vp = new VideoPlayer('#mv-container', { src: 'video.mp4' });
    vp.toggleMute();
    expect(vp._isMuted).toBe(true);
    vp.toggleMute();
    expect(vp._isMuted).toBe(false);
    vp.destroy?.();
  });
});

describe('AudioPlayer 추가2', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
  });

  it('오디오 이벤트 — play/pause/ended', () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onEnded = vi.fn();
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3', onPlay, onPause, onEnded });
    ap.audio.dispatchEvent(new Event('play'));
    expect(onPlay).toHaveBeenCalled();
    ap.audio.dispatchEvent(new Event('pause'));
    expect(onPause).toHaveBeenCalled();
    ap.audio.dispatchEvent(new Event('ended'));
    expect(onEnded).toHaveBeenCalled();
    ap.destroy?.();
  });

  it('오디오 이벤트 — timeupdate', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    Object.defineProperty(ap.audio, 'duration', { value: 120, writable: true });
    ap.audio.dispatchEvent(new Event('timeupdate'));
    ap.destroy?.();
  });

  it('오디오 이벤트 — loadedmetadata', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    Object.defineProperty(ap.audio, 'duration', { value: 120, writable: true });
    ap.audio.dispatchEvent(new Event('loadedmetadata'));
    ap.destroy?.();
  });

  it('프로그레스 바 클릭', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    Object.defineProperty(ap.audio, 'duration', { value: 120, writable: true });
    var progressBar = ap.container.querySelector('.audio-player__progress-bar');
    progressBar.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    progressBar.dispatchEvent(new MouseEvent('click', { clientX: 50 }));
    ap.destroy?.();
  });

  it('볼륨 슬라이더', () => {
    var ap = new AudioPlayer('#mv-container', { src: 'audio.mp3' });
    var slider = ap.container.querySelector('.audio-player__volume-slider');
    slider.value = 0.5;
    slider.dispatchEvent(new Event('input'));
    expect(ap.audio.volume).toBe(0.5);
    ap.destroy?.();
  });
});

describe('ImageViewer 추가2', () => {
  it('마우스 휠 줌 — zoomIn', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    var wrapper = iv.container.querySelector('.image-viewer__wrapper');
    wrapper.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
    expect(iv._zoom).toBeGreaterThan(1);
    iv.destroy?.();
  });

  it('마우스 휠 줌 — zoomOut', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    var wrapper = iv.container.querySelector('.image-viewer__wrapper');
    wrapper.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
    expect(iv._zoom).toBeLessThan(1);
    iv.destroy?.();
  });

  it('download 버튼 클릭', () => {
    var iv = new ImageViewer('#mv-container', { src: 'img.jpg' });
    var dlBtn = iv.container.querySelector('[data-action="download"]');
    if (dlBtn) dlBtn.click();
    iv.destroy?.();
  });
});
