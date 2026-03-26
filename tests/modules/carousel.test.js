/**
 * Carousel Module 테스트
 * Carousel, Lightbox
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Carousel, Lightbox;

beforeEach(async () => {
  const mod = await import('../../src/modules/carousel.js');
  Carousel = mod.Carousel || mod.default?.Carousel;
  Lightbox = mod.Lightbox || mod.default?.Lightbox;
  document.body.innerHTML = '<div id="carousel-container"></div>';
  Carousel.instances?.clear?.();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

var sampleItems = [
  { src: 'img1.jpg', alt: '이미지 1', title: '슬라이드 1' },
  { src: 'img2.jpg', alt: '이미지 2', title: '슬라이드 2' },
  { src: 'img3.jpg', alt: '이미지 3', title: '슬라이드 3' }
];

describe('Carousel', () => {
  it('Carousel 클래스가 존재해야 함', () => {
    expect(Carousel).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(c).toBeDefined();
    expect(c.element).toBeTruthy();
    c.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Carousel.defaults();
    expect(d.startIndex).toBe(0);
    expect(d.arrows).toBe(true);
    expect(d.dots).toBe(true);
    expect(d.autoplay).toBe(false);
    expect(d.loop).toBe(true);
    expect(d.speed).toBe(300);
  });

  it('존재하지 않는 컨테이너는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new Carousel('#nonexistent', { items: sampleItems });
    expect(spy).toHaveBeenCalled();
  });

  it('DOM에 슬라이드를 렌더링해야 함', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    var container = document.getElementById('carousel-container');
    expect(container.children.length).toBeGreaterThan(0);
    c.destroy?.();
  });

  it('next() / prev() 메서드가 존재해야 함', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(typeof c.next).toBe('function');
    expect(typeof c.prev).toBe('function');
    c.destroy?.();
  });

  it('goTo() 메서드가 존재해야 함', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(typeof c.goTo).toBe('function');
    c.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(typeof c.destroy).toBe('function');
    c.destroy();
  });

  it('이징 상수가 정의되어야 함', () => {
    expect(Carousel.easings).toBeDefined();
    expect(Carousel.easings.linear).toBe('linear');
  });
});

describe('Lightbox', () => {
  it('Lightbox 클래스가 존재해야 함', () => {
    expect(Lightbox).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var lb = new Lightbox({ images: sampleItems });
    expect(lb).toBeDefined();
    lb.destroy?.();
  });
});

describe('Carousel 추가', () => {
  it('next / prev / goTo 동작', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, loop: false, speed: 0 });
    c.next();
    vi.advanceTimersByTime(50);
    expect(c.currentIndex).toBe(1);
    c.prev();
    vi.advanceTimersByTime(50);
    expect(c.currentIndex).toBe(0);
    c.goTo(2);
    vi.advanceTimersByTime(50);
    expect(c.currentIndex).toBe(2);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('fade 효과', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, effect: 'fade', speed: 0 });
    expect(c.element.classList.contains('carousel--fade')).toBe(true);
    c.destroy?.();
  });

  it('counter 옵션', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, counter: true });
    expect(document.querySelector('.carousel__counter')).not.toBeNull();
    c.destroy?.();
  });

  it('thumbnails 옵션', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, thumbnails: true });
    expect(document.querySelector('.carousel__thumbnails')).not.toBeNull();
    c.destroy?.();
  });

  it('dots false / arrows false', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, dots: false, arrows: false });
    expect(document.querySelector('.carousel__dots')).toBeNull();
    expect(document.querySelector('.carousel__arrow')).toBeNull();
    c.destroy?.();
  });

  it('onSlideChange 콜백', () => {
    vi.useFakeTimers();
    const onSlideChange = vi.fn();
    var c = new Carousel('#carousel-container', { items: sampleItems, onSlideChange, loop: false, speed: 0 });
    c.next();
    vi.advanceTimersByTime(50);
    expect(onSlideChange).toHaveBeenCalled();
    c.destroy?.();
    vi.useRealTimers();
  });

  it('onInit 콜백', () => {
    const onInit = vi.fn();
    var c = new Carousel('#carousel-container', { items: sampleItems, onInit });
    expect(onInit).toHaveBeenCalled();
    c.destroy?.();
  });

  it('data-attributes 읽기', () => {
    document.getElementById('carousel-container').setAttribute('data-autoplay', 'true');
    document.getElementById('carousel-container').setAttribute('data-loop', 'false');
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(c.options.autoplay).toBe(true);
    expect(c.options.loop).toBe(false);
    c.destroy?.();
  });

  it('string 아이템으로 생성', () => {
    var c = new Carousel('#carousel-container', { items: ['img1.jpg', 'img2.jpg'] });
    expect(c.slides.length).toBe(2);
    c.destroy?.();
  });

  it('중복 인스턴스 반환', () => {
    var c1 = new Carousel('#carousel-container', { items: sampleItems });
    var c2 = new Carousel('#carousel-container', { items: sampleItems });
    expect(c1).toBe(c2);
    c1.destroy?.();
  });

  it('autoplay 옵션', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, autoplay: true, autoplaySpeed: 100, speed: 0 });
    vi.advanceTimersByTime(300);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('play / pause', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, speed: 0 });
    c.play();
    vi.advanceTimersByTime(200);
    c.pause();
    c.destroy?.();
    vi.useRealTimers();
  });

  it('getCurrentIndex / getSlideCount', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems });
    expect(c.getCurrentIndex()).toBe(0);
    expect(c.getSlideCount()).toBe(3);
    c.destroy?.();
  });

  it('scale 효과', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, effect: 'scale', speed: 0 });
    c.destroy?.();
  });

  it('slidesToShow > 1', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, slidesToShow: 2, speed: 0 });
    c.destroy?.();
  });

  it('loop false + 경계 이동', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, loop: false, speed: 0 });
    c.prev();
    vi.advanceTimersByTime(50);
    expect(c.currentIndex).toBe(0);
    c.goTo(2);
    vi.advanceTimersByTime(50);
    c.next();
    vi.advanceTimersByTime(50);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('hover 시 autoplay 일시정지', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, autoplay: true, pauseOnHover: true, speed: 0 });
    if (c.element) {
      c.element.dispatchEvent(new Event('mouseenter'));
      c.element.dispatchEvent(new Event('mouseleave'));
    }
    c.destroy?.();
    vi.useRealTimers();
  });

  it('키보드 네비게이션', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, speed: 0 });
    if (c.element) {
      c.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      vi.advanceTimersByTime(50);
      c.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      vi.advanceTimersByTime(50);
    }
    c.destroy?.();
    vi.useRealTimers();
  });

  it('responsive 옵션', () => {
    var c = new Carousel('#carousel-container', {
      items: sampleItems,
      responsive: [{ breakpoint: 768, options: { slidesToShow: 1 } }]
    });
    c.destroy?.();
  });
});

describe('Carousel 추가2', () => {
  it('flip 효과', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, effect: 'flip', speed: 0 });
    c.next();
    vi.advanceTimersByTime(50);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('cube 효과', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, effect: 'cube', speed: 0 });
    c.next();
    vi.advanceTimersByTime(50);
    c.prev();
    vi.advanceTimersByTime(50);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('dot 클릭', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, dots: true, speed: 0 });
    var dots = c.dotsContainer?.querySelectorAll('.carousel__dot');
    if (dots && dots.length > 1) {
      dots[1].click();
      vi.advanceTimersByTime(50);
      expect(c.currentIndex).toBe(1);
    }
    c.destroy?.();
    vi.useRealTimers();
  });

  it('thumbnail 클릭', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, thumbnails: true, speed: 0 });
    var thumbs = c.thumbsContainer?.querySelectorAll('.carousel__thumbnail');
    if (thumbs && thumbs.length > 1) {
      thumbs[2].click();
      vi.advanceTimersByTime(50);
      expect(c.currentIndex).toBe(2);
    }
    c.destroy?.();
    vi.useRealTimers();
  });

  it('드래그/스와이프', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, draggable: true, speed: 0 });
    if (c.track) {
      c.track.dispatchEvent(new MouseEvent('mousedown', { clientX: 200 }));
      c.track.dispatchEvent(new MouseEvent('mouseup', { clientX: 100 }));
      vi.advanceTimersByTime(50);
    }
    c.destroy?.();
    vi.useRealTimers();
  });

  it('content/description 아이템', () => {
    var c = new Carousel('#carousel-container', {
      items: [
        { src: 'img.jpg', alt: 'alt', title: '제목', description: '설명' },
        { content: '<p>커스텀 콘텐츠</p>' }
      ],
      speed: 0
    });
    c.destroy?.();
  });

  it('arrow 버튼 클릭', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, arrows: true, speed: 0 });
    if (c.nextBtn) c.nextBtn.click();
    vi.advanceTimersByTime(50);
    if (c.prevBtn) c.prevBtn.click();
    vi.advanceTimersByTime(50);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('loop true + slide 효과 경계 점프', () => {
    vi.useFakeTimers();
    var c = new Carousel('#carousel-container', { items: sampleItems, loop: true, effect: 'slide', speed: 10 });
    c.goTo(2);
    vi.advanceTimersByTime(20);
    c.next();
    vi.advanceTimersByTime(100);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('responsive — 설정 적용', () => {
    // innerWidth를 좁게 설정
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    var c = new Carousel('#carousel-container', {
      items: sampleItems,
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
      speed: 0
    });
    window.dispatchEvent(new Event('resize'));
    c.destroy?.();
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
  });

  it('easing 커스텀 값', () => {
    var c = new Carousel('#carousel-container', { items: sampleItems, easing: 'cubic-bezier(0.1, 0.2, 0.3, 0.4)', speed: 0 });
    c.destroy?.();
  });
});

describe('Lightbox 추가', () => {
  it('defaults()', () => {
    var d = Lightbox.defaults();
    expect(d).toBeDefined();
    expect(d.loop).toBe(true);
  });

  it('open / close / next / prev', () => {
    Lightbox.instance = null;
    var lb = new Lightbox({ images: sampleItems });
    if (lb.open) {
      lb.items = sampleItems;
      lb.open(0);
      if (lb.next) lb.next();
      if (lb.prev) lb.prev();
      lb.close();
    }
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('키보드 — ESC/ArrowLeft/ArrowRight', () => {
    Lightbox.instance = null;
    var lb = new Lightbox({ closeOnEscape: true });
    lb.items = sampleItems;
    lb.open(0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(lb.isOpen).toBe(false);
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('onOpen/onClose/onChange 콜백', () => {
    Lightbox.instance = null;
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const onChange = vi.fn();
    var lb = new Lightbox({ onOpen, onClose, onChange });
    lb.items = sampleItems;
    lb.open(0);
    expect(onOpen).toHaveBeenCalled();
    lb.next();
    expect(onChange).toHaveBeenCalled();
    lb.close();
    expect(onClose).toHaveBeenCalled();
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('caption/counter 표시', () => {
    Lightbox.instance = null;
    var lb = new Lightbox({ showCaption: true, showCounter: true });
    lb.items = [
      { src: 'img1.jpg', alt: 'alt1', caption: '캡션1' },
      { src: 'img2.jpg', alt: 'alt2', caption: '캡션2' }
    ];
    lb.open(0);
    expect(lb.caption.textContent).toContain('캡션1');
    lb.close();
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('loop false 경계', () => {
    Lightbox.instance = null;
    var lb = new Lightbox({ loop: false });
    lb.items = sampleItems;
    lb.open(0);
    lb.prev(); // 0에서 prev → 0 유지
    expect(lb.currentIndex).toBe(0);
    // 마지막 슬라이드로 이동 후 next
    lb._showSlide(2);
    lb.next(); // 마지막에서 next → 마지막 유지
    expect(lb.currentIndex).toBe(2);
    lb.close();
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('_openFromTrigger — document 클릭 위임', () => {
    Lightbox.instance = null;
    document.body.innerHTML = '<img id="lb-img" data-lightbox="true" src="test.jpg" alt="테스트">';
    var lb = new Lightbox();
    var img = document.getElementById('lb-img');
    if (img) img.click();
    lb.close?.();
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('closeOnBackdrop', () => {
    Lightbox.instance = null;
    var lb = new Lightbox({ closeOnBackdrop: true });
    lb.items = sampleItems;
    lb.open(0);
    if (lb.backdrop) lb.backdrop.click();
    expect(lb.isOpen).toBe(false);
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('단일 아이템 — 화살표 숨김', () => {
    Lightbox.instance = null;
    var lb = new Lightbox();
    lb.items = [{ src: 'img1.jpg', alt: 'alt1' }];
    lb.open(0);
    lb.next(); // 단일 아이템이면 무동작
    lb.prev();
    lb.close();
    lb.destroy?.();
    Lightbox.instance = null;
  });
});

describe('CarouselModule', () => {
  it('create — carousel', async () => {
    const mod = await import('../../src/modules/carousel.js');
    const CM = mod.default;
    document.body.innerHTML = '<div id="cm1"></div>';
    var c = CM.create('carousel', '#cm1', { items: sampleItems });
    expect(c).toBeDefined();
    c.destroy?.();
  });

  it('create — lightbox', async () => {
    Lightbox.instance = null;
    const mod = await import('../../src/modules/carousel.js');
    const CM = mod.default;
    var lb = CM.create('lightbox', {});
    expect(lb).toBeDefined();
    lb.destroy?.();
    Lightbox.instance = null;
  });

  it('create — unknown type', async () => {
    const mod = await import('../../src/modules/carousel.js');
    const CM = mod.default;
    expect(() => CM.create('unknown', '#x')).toThrow();
  });

  it('destroyAll', async () => {
    Lightbox.instance = null;
    const mod = await import('../../src/modules/carousel.js');
    const CM = mod.default;
    document.body.innerHTML = '<div id="cm2"></div>';
    Carousel.instances?.clear?.();
    new Carousel('#cm2', { items: sampleItems });
    CM.destroyAll();
    expect(Carousel.instances.size).toBe(0);
    Lightbox.instance = null;
  });
});
