/**
 * Scroll Module 테스트
 * VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop;

beforeEach(async () => {
  const mod = await import('../../src/modules/scroll.js');
  VirtualScroll = mod.VirtualScroll || mod.default?.VirtualScroll;
  Scrollspy = mod.Scrollspy || mod.default?.Scrollspy;
  InfiniteScroll = mod.InfiniteScroll || mod.default?.InfiniteScroll;
  SmoothScroll = mod.SmoothScroll || mod.default?.SmoothScroll;
  BackToTop = mod.BackToTop || mod.default?.BackToTop;
  document.body.innerHTML = '<div id="scroll-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('VirtualScroll', () => {
  it('VirtualScroll 클래스가 존재해야 함', () => {
    expect(VirtualScroll).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: Array.from({ length: 100 }, function(_, i) { return '항목 ' + i; }),
      itemHeight: 30,
      containerHeight: 200,
      renderItem: function(item) { return '<div>' + item + '</div>'; }
    });
    expect(vs).toBeDefined();
    expect(vs.container).toBeTruthy();
    vs.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = VirtualScroll.defaults();
    expect(d.itemHeight).toBe(50);
    expect(d.bufferSize).toBe(5);
    expect(d.containerHeight).toBe(400);
  });

  it('존재하지 않는 컨테이너는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new VirtualScroll('#nonexistent', { items: [] });
    expect(spy).toHaveBeenCalled();
  });

  it('destroy()로 정리되어야 함', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: ['a', 'b', 'c'],
      itemHeight: 30,
      renderItem: function(item) { return '<div>' + item + '</div>'; }
    });
    expect(typeof vs.destroy).toBe('function');
    vs.destroy();
  });
});

describe('Scrollspy', () => {
  it('Scrollspy 클래스가 존재해야 함', () => {
    expect(Scrollspy).toBeDefined();
  });
});

describe('InfiniteScroll', () => {
  it('InfiniteScroll 클래스가 존재해야 함', () => {
    expect(InfiniteScroll).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    // jsdom에 IntersectionObserver가 없으므로 mock
    global.IntersectionObserver = vi.fn().mockImplementation(function() {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    var is = new InfiniteScroll('#scroll-container', {
      loadMore: async function() { return []; },
      renderItem: function(item) { return '<div>' + item + '</div>'; }
    });
    expect(is).toBeDefined();
    is.destroy?.();
    delete global.IntersectionObserver;
  });
});

describe('SmoothScroll', () => {
  it('SmoothScroll 클래스가 존재해야 함', () => {
    expect(SmoothScroll).toBeDefined();
  });
});

describe('BackToTop', () => {
  it('BackToTop 클래스가 존재해야 함', () => {
    expect(BackToTop).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    BackToTop.instance = null;
    var btt = new BackToTop();
    expect(btt).toBeDefined();
    btt.destroy?.();
  });

  it('show / hide', () => {
    BackToTop.instance = null;
    var btt = new BackToTop();
    btt.show();
    expect(btt.button.classList.contains('is-visible')).toBe(true);
    btt.hide();
    expect(btt.button.classList.contains('is-visible')).toBe(false);
    btt.destroy?.();
  });

  it('싱글톤 패턴', () => {
    BackToTop.instance = null;
    var btt1 = new BackToTop();
    var btt2 = new BackToTop();
    expect(btt1).toBe(btt2);
    btt1.destroy?.();
  });
});

describe('VirtualScroll 추가', () => {
  it('setItems', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: ['a', 'b'],
      itemHeight: 30,
      renderItem: (item) => `<div>${item}</div>`
    });
    vs.setItems(['x', 'y', 'z']);
    expect(vs.options.items.length).toBe(3);
    vs.destroy?.();
  });

  it('scrollToIndex', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: Array.from({ length: 50 }, (_, i) => `항목${i}`),
      itemHeight: 30,
      renderItem: (item) => `<div>${item}</div>`
    });
    // jsdom에서 scrollTo 미구현이므로 mock
    vs.container.scrollTo = vi.fn();
    vs.scrollToIndex(10);
    vs.scrollToIndex(5, false);
    vs.destroy?.();
  });

  it('getVisibleRange', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: ['a', 'b', 'c'],
      itemHeight: 30,
      renderItem: (item) => `<div>${item}</div>`
    });
    var range = vs.getVisibleRange();
    expect(range).toHaveProperty('start');
    expect(range).toHaveProperty('end');
    vs.destroy?.();
  });

  it('refresh', () => {
    var vs = new VirtualScroll('#scroll-container', {
      items: ['a'],
      itemHeight: 30,
      renderItem: (item) => `<div>${item}</div>`
    });
    vs.refresh();
    vs.destroy?.();
  });

  it('renderItem 없으면 빈 콘텐츠', () => {
    var vs = new VirtualScroll('#scroll-container', { items: ['a', 'b'] });
    vs.destroy?.();
  });
});

describe('Scrollspy 추가', () => {
  it('인스턴스 생성 및 destroy', () => {
    document.body.innerHTML = `
      <div id="scroll-container" style="height:200px;overflow:auto;">
        <div id="sec1" style="height:300px;">섹션1</div>
        <div id="sec2" style="height:300px;">섹션2</div>
      </div>
      <nav id="spy-nav"><a href="#sec1">1</a><a href="#sec2">2</a></nav>
    `;
    var spy = new Scrollspy('#scroll-container', { target: '#spy-nav' });
    expect(spy).toBeDefined();
    expect(spy.getActive()).toBeDefined();
    spy.refresh();
    spy.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new Scrollspy('#nonexistent');
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});

describe('InfiniteScroll 추가', () => {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(function(cb) {
      this._cb = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
  });

  afterEach(() => {
    delete global.IntersectionObserver;
  });

  it('setHasMore / reset', () => {
    var is = new InfiniteScroll('#scroll-container', {
      loadMore: async () => [],
      renderItem: (item) => `<div>${item}</div>`
    });
    is.setHasMore(false);
    expect(is._hasMore).toBe(false);
    is.reset();
    expect(is._hasMore).toBe(true);
    is.destroy?.();
  });

  it('appendItems', () => {
    var is = new InfiniteScroll('#scroll-container', {
      loadMore: async () => [],
      renderItem: (item) => `<div>${item}</div>`
    });
    is.appendItems(['a', 'b']);
    expect(is._totalLoaded).toBe(2);
    is.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new InfiniteScroll('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('SmoothScroll 추가', () => {
  it('to() 호출', () => {
    document.body.innerHTML = '<div id="target" style="height:500px;">타겟</div>';
    SmoothScroll.to('#target');
    SmoothScroll.to('#nonexistent');
  });

  it('toTop() 호출', () => {
    SmoothScroll.toTop();
  });

  it('toBottom() 호출', () => {
    window.scrollTo = vi.fn();
    SmoothScroll.toBottom();
  });

  it('easing 옵션', () => {
    document.body.innerHTML = '<div id="target" style="height:500px;">타겟</div>';
    SmoothScroll.to('#target', { easing: 'linear', duration: 100 });
    SmoothScroll.to('#target', { easing: 'easeOutQuad', duration: 100 });
  });

  it('toTop() duration 0', () => {
    SmoothScroll.toTop({ duration: 0 });
  });

  it('toBottom() duration 0', () => {
    window.scrollTo = vi.fn();
    SmoothScroll.toBottom({ duration: 0 });
  });
});

describe('VirtualScroll 추가2', () => {
  it('onScroll 콜백', () => {
    const onScroll = vi.fn();
    var vs = new VirtualScroll('#scroll-container', {
      items: Array.from({ length: 50 }, (_, i) => `항목${i}`),
      itemHeight: 30,
      renderItem: (item) => `<div>${item}</div>`,
      onScroll
    });
    // 스크롤 이벤트 시뮬레이션
    Object.defineProperty(vs.container, 'scrollTop', { value: 100, writable: true });
    vs.container.dispatchEvent(new Event('scroll'));
    expect(onScroll).toHaveBeenCalled();
    vs.destroy?.();
  });
});

describe('Scrollspy 추가2', () => {
  it('scrollTo', () => {
    document.body.innerHTML = `
      <div id="sc" style="height:200px;overflow:auto;">
        <div id="s1" style="height:300px;">섹션1</div>
        <div id="s2" style="height:300px;">섹션2</div>
      </div>
      <nav id="sn"><a href="#s1">1</a><a href="#s2">2</a></nav>
    `;
    var sc = document.getElementById('sc');
    sc.scrollTo = vi.fn();
    var spy = new Scrollspy('#sc', { target: '#sn' });
    spy.scrollTo('s1');
    spy.scrollTo('nonexistent');
    spy.destroy?.();
  });

  it('네비 클릭으로 스크롤', () => {
    document.body.innerHTML = `
      <div id="sc" style="height:200px;overflow:auto;">
        <div id="s1" style="height:300px;">섹션1</div>
        <div id="s2" style="height:300px;">섹션2</div>
      </div>
      <nav id="sn"><a href="#s1">1</a><a href="#s2">2</a></nav>
    `;
    var sc = document.getElementById('sc');
    sc.scrollTo = vi.fn();
    var spy = new Scrollspy('#sc', { target: '#sn', smoothScroll: true });
    spy.scrollTo('s2');
    spy.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    document.body.innerHTML = `
      <div id="sc" style="height:200px;overflow:auto;">
        <div id="s1" style="height:300px;">섹션1</div>
      </div>
      <nav id="sn"><a href="#s1">1</a></nav>
    `;
    var spy = new Scrollspy('#sc', { target: '#sn', onChange });
    spy.destroy?.();
  });

  it('sections 명시 옵션', () => {
    document.body.innerHTML = `
      <div id="sc" style="height:200px;overflow:auto;">
        <div id="s1" style="height:300px;">섹션1</div>
      </div>
    `;
    var spy = new Scrollspy('#sc', { sections: ['#s1'] });
    expect(spy._sections.length).toBe(1);
    spy.destroy?.();
  });

  it('defaults()', () => {
    var d = Scrollspy.defaults();
    expect(d.offset).toBe(100);
  });
});

describe('InfiniteScroll 추가2', () => {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(function(cb) {
      this._cb = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
  });

  afterEach(() => {
    delete global.IntersectionObserver;
  });

  it('_loadMore 성공', async () => {
    const loadMore = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const onLoad = vi.fn();
    var is = new InfiniteScroll('#scroll-container', {
      loadMore,
      renderItem: (item) => `<div>${item.id}</div>`,
      onLoad
    });
    await is._loadMore();
    expect(onLoad).toHaveBeenCalled();
    expect(is._totalLoaded).toBe(2);
    is.destroy?.();
  });

  it('_loadMore 빈 결과', async () => {
    const loadMore = vi.fn().mockResolvedValue([]);
    var is = new InfiniteScroll('#scroll-container', {
      loadMore,
      renderItem: (item) => `<div>${item}</div>`
    });
    await is._loadMore();
    expect(is._hasMore).toBe(false);
    is.destroy?.();
  });

  it('_loadMore 에러', async () => {
    var errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loadMore = vi.fn().mockRejectedValue(new Error('test'));
    var is = new InfiniteScroll('#scroll-container', {
      loadMore,
      renderItem: (item) => `<div>${item}</div>`
    });
    // _statusEl 참조 보존을 위해 destroy 전에 await
    await is._loadMore();
    expect(errSpy).toHaveBeenCalled();
    // 재시도 버튼 클릭
    var retryBtn = is._statusEl?.querySelector('.infinite-scroll__retry');
    if (retryBtn) retryBtn.click();
    errSpy.mockRestore();
    is.destroy?.();
  });

  it('loadMore() 수동 호출', async () => {
    const loadMore = vi.fn().mockResolvedValue([{ id: 1 }]);
    const onLoad = vi.fn();
    var is = new InfiniteScroll('#scroll-container', {
      loadMore,
      renderItem: (item) => `<div>${item.id}</div>`,
      onLoad
    });
    await is._loadMore();
    is.destroy?.();
  });

  it('defaults()', () => {
    var d = InfiniteScroll.defaults();
    expect(d.threshold).toBe(200);
  });
});

describe('BackToTop 추가', () => {
  it('클릭 — smooth', () => {
    BackToTop.instance = null;
    var btt = new BackToTop({ smooth: true });
    btt.button.click();
    btt.destroy?.();
  });

  it('클릭 — smooth false', () => {
    BackToTop.instance = null;
    window.scrollTo = vi.fn();
    var btt = new BackToTop({ smooth: false });
    btt.button.click();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    btt.destroy?.();
  });

  it('defaults()', () => {
    var d = BackToTop.defaults();
    expect(d.threshold).toBe(300);
    expect(d.smooth).toBe(true);
  });

  it('position bottom-left', () => {
    BackToTop.instance = null;
    var btt = new BackToTop({ position: 'bottom-left' });
    expect(btt.button.classList.contains('back-to-top--bottom-left')).toBe(true);
    btt.destroy?.();
  });
});
