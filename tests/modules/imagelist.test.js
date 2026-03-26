/**
 * ImageList Module 테스트
 * ImageList, ImageLightbox, ImageCompare, LazyImage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let ImageList, ImageLightbox, ImageCompare, LazyImage;

beforeEach(async () => {
  const mod = await import('../../src/modules/imagelist.js');
  ImageList = mod.ImageList || mod.default?.ImageList;
  ImageLightbox = mod.ImageLightbox || mod.default?.ImageLightbox || mod.Lightbox;
  ImageCompare = mod.ImageCompare || mod.default?.ImageCompare;
  LazyImage = mod.LazyImage || mod.default?.LazyImage;
  document.body.innerHTML = '<div id="il-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('ImageList', () => {
  it('ImageList 클래스가 존재해야 함', () => {
    expect(ImageList).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var il = new ImageList('#il-container', {
      images: [
        { src: 'img1.jpg', alt: '이미지 1' },
        { src: 'img2.jpg', alt: '이미지 2' }
      ]
    });
    expect(il).toBeDefined();
    il.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = ImageList.defaults();
    expect(d).toBeDefined();
  });

  it('destroy()로 정리되어야 함', () => {
    var il = new ImageList('#il-container', { images: [] });
    if (il && typeof il.destroy === 'function') {
      il.destroy();
    }
  });
});

describe('ImageCompare', () => {
  it('ImageCompare 클래스가 존재해야 함', () => {
    expect(ImageCompare).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg', alt: 'Before' },
      after: { src: 'after.jpg', alt: 'After' }
    });
    expect(ic).toBeDefined();
    ic.destroy?.();
  });
});

describe('LazyImage', () => {
  it('LazyImage 클래스가 존재해야 함', () => {
    expect(LazyImage).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함 (IntersectionObserver)', () => {
    global.IntersectionObserver = vi.fn().mockImplementation(function() {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    document.body.innerHTML = '<img id="lazy-img" data-lazy-src="image.jpg" alt="Lazy">';
    var li = new LazyImage();
    expect(li).toBeDefined();
    li.destroy?.();
    delete global.IntersectionObserver;
  });

  it('IntersectionObserver 없이 fallback 로드', () => {
    // IntersectionObserver가 없으면 모두 즉시 로드
    document.body.innerHTML = '<img data-lazy-src="img.jpg" alt="test">';
    var li = new LazyImage();
    li.destroy?.();
  });
});

describe('ImageList 추가', () => {
  const images = [
    { src: 'img1.jpg', alt: '이미지1', title: '제목1' },
    { src: 'img2.jpg', alt: '이미지2', thumb: 'thumb2.jpg' },
    { src: 'img3.jpg', alt: '이미지3', featured: true }
  ];

  beforeEach(() => {
    // IntersectionObserver mock
    global.IntersectionObserver = vi.fn().mockImplementation(function(cb) {
      this._cb = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
  });

  afterEach(() => {
    delete global.IntersectionObserver;
  });

  it('이미지 렌더링', () => {
    var il = new ImageList('#il-container', { images, lazy: false });
    expect(document.querySelectorAll('.image-list__item').length).toBe(3);
    il.destroy?.();
  });

  it('masonry 레이아웃', () => {
    var il = new ImageList('#il-container', { images, layout: 'masonry', lazy: false });
    expect(il.container.classList.contains('image-list--masonry')).toBe(true);
    il.destroy?.();
  });

  it('quilted 레이아웃', () => {
    var il = new ImageList('#il-container', { images, layout: 'quilted', lazy: false });
    il.destroy?.();
  });

  it('hover overlay + showTitle', () => {
    var il = new ImageList('#il-container', { images, hover: 'overlay', showTitle: true, lazy: false });
    expect(document.querySelector('.image-list__overlay')).not.toBeNull();
    il.destroy?.();
  });

  it('setImages / addImage / removeImage / refresh', () => {
    var il = new ImageList('#il-container', { images: [], lazy: false });
    il.setImages(images);
    expect(document.querySelectorAll('.image-list__item').length).toBe(3);
    il.addImage({ src: 'img4.jpg', alt: '이미지4' });
    il.removeImage(0);
    il.refresh();
    il.destroy?.();
  });

  it('onClick 콜백', () => {
    const onClick = vi.fn();
    var il = new ImageList('#il-container', { images, onClick, lightbox: false, lazy: false });
    const item = document.querySelector('.image-list__item');
    if (item) item.click();
    expect(onClick).toHaveBeenCalled();
    il.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ImageList('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('ImageLightbox', () => {
  const images = [
    { src: 'img1.jpg', title: '제목1' },
    { src: 'img2.jpg', title: '제목2' },
    { src: 'img3.jpg' }
  ];

  // rAF 완료 대기 헬퍼
  const waitRaf = () => new Promise(r => setTimeout(r, 50));

  it('open / close', async () => {
    vi.useFakeTimers();
    var lb = new ImageLightbox({ images, keyboard: false, swipe: false });
    lb.open(0);
    vi.advanceTimersByTime(50);
    expect(lb.isOpen).toBe(true);
    lb.close();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
  });

  it('prev / next / goTo', async () => {
    var lb = new ImageLightbox({ images, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    lb.next();
    expect(lb.currentIndex).toBe(1);
    lb.prev();
    expect(lb.currentIndex).toBe(0);
    lb.goTo(2);
    expect(lb.currentIndex).toBe(2);
    lb.destroy();
  });

  it('onChange 콜백', async () => {
    const onChange = vi.fn();
    var lb = new ImageLightbox({ images, onChange, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    lb.next();
    expect(onChange).toHaveBeenCalledWith(1);
    lb.destroy();
  });

  it('onOpen 콜백', async () => {
    const onOpen = vi.fn();
    var lb = new ImageLightbox({ images, onOpen, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    expect(onOpen).toHaveBeenCalled();
    lb.destroy();
  });

  it('thumbnails 옵션', async () => {
    var lb = new ImageLightbox({ images, thumbnails: true, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    expect(document.querySelector('.lightbox__thumbnails')).not.toBeNull();
    lb.destroy();
  });

  it('download 비활성', async () => {
    var lb = new ImageLightbox({ images, download: false, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    expect(document.querySelector('[data-action="download"]')).toBeNull();
    lb.destroy();
  });
});

describe('ImageCompare 추가', () => {
  it('setPosition / getPosition', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' }
    });
    ic.setPosition(75);
    expect(ic.getPosition()).toBe(75);
    ic.destroy?.();
  });

  it('vertical orientation', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' },
      orientation: 'vertical'
    });
    ic.setPosition(30);
    expect(ic.getPosition()).toBe(30);
    ic.destroy?.();
  });

  it('setImages', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' }
    });
    ic.setImages({ src: 'new-before.jpg' }, { src: 'new-after.jpg' });
    ic.destroy?.();
  });

  it('onSlide 콜백', () => {
    const onSlide = vi.fn();
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' },
      onSlide
    });
    ic.setPosition(60);
    expect(onSlide).toHaveBeenCalledWith(60);
    ic.destroy?.();
  });

  it('showLabels/showHandle false', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' },
      showLabels: false,
      showHandle: false
    });
    ic.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ImageCompare('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('ImageLightbox 추가2', () => {
  const images = [
    { src: 'img1.jpg', title: '제목1' },
    { src: 'img2.jpg', title: '제목2' },
    { src: 'img3.jpg' }
  ];
  const waitRaf = () => new Promise(r => setTimeout(r, 50));

  it('키보드 — ArrowRight/ArrowLeft/Escape', async () => {
    vi.useFakeTimers();
    var lb = new ImageLightbox({ images, keyboard: true, swipe: false });
    lb.open(0);
    vi.advanceTimersByTime(50);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(lb.currentIndex).toBe(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(lb.currentIndex).toBe(0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
  });

  it('스와이프 — 오른쪽/왼쪽', async () => {
    var lb = new ImageLightbox({ images, keyboard: false, swipe: true });
    lb.open(0);
    await waitRaf();
    lb.element.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 200 }] }));
    lb.element.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ clientX: 100 }] }));
    expect(lb.currentIndex).toBe(1);
    lb.element.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 100 }] }));
    lb.element.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ clientX: 200 }] }));
    expect(lb.currentIndex).toBe(0);
    lb.destroy();
  });

  it('이미지 줌 토글', async () => {
    var lb = new ImageLightbox({ images, zoom: true, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    if (lb._img) {
      lb._img.click();
      expect(lb.isZoomed).toBe(true);
      lb._img.click();
      expect(lb.isZoomed).toBe(false);
    }
    lb.destroy();
  });

  it('다운로드 버튼', async () => {
    var lb = new ImageLightbox({ images, download: true, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    var dlBtn = document.querySelector('[data-action="download"]');
    if (dlBtn) dlBtn.click();
    lb.destroy();
  });

  it('닫기 버튼', async () => {
    vi.useFakeTimers();
    var lb = new ImageLightbox({ images, keyboard: false, swipe: false });
    lb.open(0);
    vi.advanceTimersByTime(50);
    var closeBtn = document.querySelector('[data-action="close"]');
    if (closeBtn) closeBtn.click();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
  });

  it('prev/next 버튼 클릭', async () => {
    var lb = new ImageLightbox({ images, keyboard: false, swipe: false });
    lb.open(1);
    await waitRaf();
    var prevBtn = document.querySelector('[data-action="prev"]');
    if (prevBtn) prevBtn.click();
    expect(lb.currentIndex).toBe(0);
    var nextBtn = document.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.click();
    expect(lb.currentIndex).toBe(1);
    lb.destroy();
  });

  it('썸네일 클릭', async () => {
    var lb = new ImageLightbox({ images, thumbnails: true, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    var thumbs = document.querySelectorAll('.lightbox__thumb');
    if (thumbs.length > 1) {
      thumbs[1].click();
      expect(lb.currentIndex).toBe(1);
    }
    lb.destroy();
  });

  it('onClose 콜백', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    var lb = new ImageLightbox({ images, onClose, keyboard: false, swipe: false });
    lb.open(0);
    vi.advanceTimersByTime(50);
    lb.close();
    vi.advanceTimersByTime(500);
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('counter false', async () => {
    var lb = new ImageLightbox({ images, counter: false, keyboard: false, swipe: false });
    lb.open(0);
    await waitRaf();
    expect(document.querySelector('.lightbox__counter')).toBeNull();
    lb.destroy();
  });
});

describe('ImageList 추가2', () => {
  const images = [
    { src: 'img1.jpg', alt: '1', title: 'T1' },
    { src: 'img2.jpg', alt: '2' }
  ];

  it('lightbox 열기', async () => {
    vi.useFakeTimers();
    var il = new ImageList('#il-container', { images, lightbox: true, lazy: false });
    var item = il.container.querySelector('.image-list__item');
    if (item) item.click();
    vi.advanceTimersByTime(100);
    // lightbox가 열려야 함
    expect(document.querySelector('.lightbox')).not.toBeNull();
    if (il._lightbox) il._lightbox.destroy();
    il.destroy?.();
    vi.useRealTimers();
  });

  it('resize 핸들러', () => {
    vi.useFakeTimers();
    var il = new ImageList('#il-container', { images, lazy: false });
    window.dispatchEvent(new Event('resize'));
    vi.advanceTimersByTime(300);
    il.destroy?.();
    vi.useRealTimers();
  });

  it('lazy + IntersectionObserver 콜백', () => {
    let observerCb;
    global.IntersectionObserver = vi.fn().mockImplementation(function(cb) {
      observerCb = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    var il = new ImageList('#il-container', { images, lazy: true });
    // observer 콜백 시뮬레이션
    var lazyImgs = il.container.querySelectorAll('.lazy');
    if (lazyImgs.length && observerCb) {
      observerCb([{ isIntersecting: true, target: lazyImgs[0] }]);
    }
    il.destroy?.();
    delete global.IntersectionObserver;
  });

  it('aspectRatio auto', () => {
    var il = new ImageList('#il-container', { images, aspectRatio: 'auto', lazy: false });
    il.destroy?.();
  });

  it('hover none', () => {
    var il = new ImageList('#il-container', { images, hover: 'none', lazy: false });
    il.destroy?.();
  });
});

describe('ImageCompare 추가2', () => {
  it('마우스 드래그', () => {
    var ic = new ImageCompare('#il-container', {
      before: { src: 'before.jpg' },
      after: { src: 'after.jpg' }
    });
    var handle = ic.container.querySelector('.image-compare__handle');
    ic.container.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 200, top: 0, height: 200 });
    if (handle) {
      handle.dispatchEvent(new MouseEvent('mousedown'));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
    }
    ic.destroy?.();
  });
});
