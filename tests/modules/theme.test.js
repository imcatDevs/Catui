/**
 * Theme Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Theme;

beforeEach(async () => {
  const mod = await import('../../src/modules/theme.js');
  Theme = mod.Theme || mod.default?.Theme || mod.default;
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Theme', () => {
  it('Theme 클래스가 존재해야 함', () => {
    expect(Theme).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const theme = new Theme();
    expect(theme).toBeDefined();
    theme.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    const defaults = Theme.defaults();
    expect(defaults.defaultTheme).toBe('system');
    expect(defaults.storageKey).toBe('imcat-theme');
    expect(defaults.transition).toBe('none');
    expect(defaults.transitionDuration).toBe(800);
  });

  it('TRANSITIONS 상수가 정의되어야 함', () => {
    expect(Theme.TRANSITIONS).toBeDefined();
    expect(Theme.TRANSITIONS.NONE).toBe('none');
    expect(Theme.TRANSITIONS.FADE).toBe('fade');
    expect(Theme.TRANSITIONS.CIRCLE).toBe('circle');
  });

  it('set()으로 테마를 변경할 수 있어야 함', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    theme.destroy?.();
  });

  it('toggle()로 테마를 전환할 수 있어야 함', () => {
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('light');
    theme.toggle();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    theme.toggle();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    theme.destroy?.();
  });

  it('get()으로 현재 테마를 조회할 수 있어야 함', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.get()).toBe('dark');
    theme.destroy?.();
  });

  it('getTheme()으로 현재 테마를 조회할 수 있어야 함 (레거시)', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.getTheme()).toBe('dark');
    theme.destroy?.();
  });

  it('getResolved()가 실제 적용 테마를 반환해야 함', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.getResolved()).toBe('dark');
    theme.destroy?.();
  });

  it('localStorage에 테마를 저장해야 함', () => {
    const theme = new Theme({ transition: 'none', storageKey: 'test-theme' });
    theme.set('dark');
    expect(localStorage.getItem('test-theme')).toBe('dark');
    theme.destroy?.();
  });

  it('onChange 콜백이 호출되어야 함', () => {
    var called = false;
    var receivedTheme = null;
    const theme = new Theme({
      transition: 'none',
      onChange: function(t) { called = true; receivedTheme = t; }
    });
    theme.set('dark');
    expect(called).toBe(true);
    expect(receivedTheme).toBe('dark');
    theme.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    const theme = new Theme({ transition: 'none' });
    expect(typeof theme.destroy).toBe('function');
    theme.destroy();
  });

  it('커스텀 옵션을 적용할 수 있어야 함', () => {
    const theme = new Theme({
      transition: 'fade',
      transitionDuration: 500
    });
    expect(theme.options.transition).toBe('fade');
    expect(theme.options.transitionDuration).toBe(500);
    theme.destroy?.();
  });

  it('setTheme() — 레거시 호환', () => {
    const theme = new Theme({ transition: 'none' });
    const result = theme.setTheme('dark');
    expect(theme.get()).toBe('dark');
    expect(result).toBe(theme);
    theme.destroy?.();
  });

  it('toggleTheme() — 레거시 호환', () => {
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('light');
    const result = theme.toggleTheme();
    expect(theme.getResolved()).toBe('dark');
    expect(result).toBe(theme);
    theme.destroy?.();
  });

  it('getActualTheme() — 레거시 호환', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.getActualTheme()).toBe('dark');
    theme.destroy?.();
  });

  it('getSystemTheme() — 시스템 테마 반환', () => {
    const theme = new Theme({ transition: 'none' });
    const sys = theme.getSystemTheme();
    expect(['light', 'dark']).toContain(sys);
    theme.destroy?.();
  });

  it('isDark() / isLight()', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.isDark()).toBe(true);
    expect(theme.isLight()).toBe(false);
    theme.set('light');
    expect(theme.isDark()).toBe(false);
    expect(theme.isLight()).toBe(true);
    theme.destroy?.();
  });

  it('setTransition() — 전환 효과 변경', () => {
    const theme = new Theme({ transition: 'none' });
    theme.setTransition('fade', 500);
    expect(theme.options.transition).toBe('fade');
    expect(theme.options.transitionDuration).toBe(500);
    theme.destroy?.();
  });

  it('onChange() — 리스너 등록 및 해제', () => {
    const theme = new Theme({ transition: 'none' });
    const listener = vi.fn();
    const unsubscribe = theme.onChange(listener);
    theme.set('dark');
    expect(listener).toHaveBeenCalled();
    unsubscribe();
    listener.mockClear();
    theme.set('light');
    expect(listener).not.toHaveBeenCalled();
    theme.destroy?.();
  });

  it('register() / registerCustomTheme() — 커스텀 테마 등록', () => {
    const theme = new Theme({ transition: 'none' });
    theme.register('ocean', { '--bg-primary': '#0077be' });
    expect(theme.options.themes.ocean).toBeDefined();
    const result = theme.registerCustomTheme('forest', { '--bg-primary': '#228b22' });
    expect(result).toBe(theme);
    theme.destroy?.();
  });

  it('reset() — 기본 테마로 리셋', () => {
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('dark');
    const result = theme.reset();
    expect(result).toBe(theme);
    theme.destroy?.();
  });

  it('유효하지 않은 테마 설정 시 경고', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const theme = new Theme({ transition: 'none' });
    theme.set('invalid-theme');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    theme.destroy?.();
  });

  it('fade 전환 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'fade', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('slide 전환 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'slide', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle 전환 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('toggleWithEvent() — 이벤트 기반 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('light');
    theme.toggleWithEvent({ clientX: 100, clientY: 200 });
    vi.advanceTimersByTime(100);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('setWithCircleAt()', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('light');
    theme.setWithCircleAt('dark', 100, 200);
    vi.advanceTimersByTime(1000);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_getCircleOrigin — 각 위치', () => {
    const theme = new Theme({ transition: 'none' });
    expect(theme._getCircleOrigin('top-left')).toEqual({ x: 0, y: 0 });
    expect(theme._getCircleOrigin('center').x).toBeGreaterThanOrEqual(0);
    theme.destroy?.();
  });

  it('_updateMetaThemeColor — meta 태그 생성', () => {
    const theme = new Theme({ transition: 'none' });
    theme._updateMetaThemeColor('dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta).not.toBeNull();
    expect(meta.content).toBe('#111827');
    theme.destroy?.();
  });
});

describe('Theme 전환 효과 변형', () => {
  it('circle-top-left 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-top-left', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-top-right 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-top-right', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-bottom-left 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-bottom-left', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-bottom-right 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-bottom-right', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-center 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-center', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });
});

describe('Theme 추가', () => {
  it('system 테마 설정', () => {
    const theme = new Theme({ transition: 'none', defaultTheme: 'system' });
    expect(theme.get()).toBe('system');
    const resolved = theme.getResolved();
    expect(['light', 'dark']).toContain(resolved);
    theme.destroy?.();
  });

  it('커스텀 테마 적용', () => {
    const theme = new Theme({ transition: 'none' });
    theme.register('ocean', { '--bg-primary': '#0077be', '--text-primary': '#ffffff' });
    theme.set('ocean');
    expect(theme.get()).toBe('ocean');
    theme.destroy?.();
  });

  it('_getCircleOrigin — 나머지 위치', () => {
    const theme = new Theme({ transition: 'none' });
    expect(theme._getCircleOrigin('top-right').y).toBe(0);
    expect(theme._getCircleOrigin('bottom-left').x).toBe(0);
    expect(theme._getCircleOrigin('bottom-right').x).toBeGreaterThanOrEqual(0);
    expect(theme._getCircleOrigin('unknown').x).toBeGreaterThanOrEqual(0);
    theme.destroy?.();
  });

  it('toggleWithEvent — touch 이벤트', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none', defaultTheme: 'light' });
    theme.set('light');
    theme.toggleWithEvent({ touches: [{ clientX: 50, clientY: 50 }] });
    vi.advanceTimersByTime(100);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('set — 동일 테마 재설정은 무시', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    const listener = vi.fn();
    theme.onChange(listener);
    theme.set('dark');
    expect(listener).not.toHaveBeenCalled();
    theme.destroy?.();
  });

  it('_updateMetaThemeColor — light', () => {
    const theme = new Theme({ transition: 'none' });
    theme._updateMetaThemeColor('light');
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta.content).toBe('#ffffff');
    theme.destroy?.();
  });

  it('_notifyListeners — 리스너 에러 처리', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const theme = new Theme({ transition: 'none' });
    theme.onChange(() => { throw new Error('test'); });
    theme.set('dark');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    theme.destroy?.();
  });

  it('_dispatchEvent', () => {
    const theme = new Theme({ transition: 'none' });
    const handler = vi.fn();
    document.addEventListener('imcat:themechange', handler);
    theme.set('dark');
    expect(handler).toHaveBeenCalled();
    document.removeEventListener('imcat:themechange', handler);
    theme.destroy?.();
  });

  it('저장된 테마 복원', () => {
    localStorage.setItem('imcat-theme', 'dark');
    const theme = new Theme({ transition: 'none' });
    expect(theme.get()).toBe('dark');
    theme.destroy?.();
  });
});

describe('Theme 추가2', () => {
  let Theme;

  beforeEach(async () => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('class');
    localStorage.clear();
    const mod = await import('../../src/modules/theme.js');
    Theme = mod.default.Theme;
  });

  it('fade 전환 폴백 (startViewTransition 없음)', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'fade', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('slide 전환 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'slide', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle 전환 폴백 — bottom-right', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-top-left 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-top-left', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-top-right 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-top-right', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-bottom-left 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-bottom-left', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('circle-center 전환', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'circle-center', transitionDuration: 100 });
    theme.set('dark');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('setWithCircleAt 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme.setWithCircleAt('dark', 100, 100, 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('toggleWithEvent — 마우스', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme.toggleWithEvent({ clientX: 50, clientY: 50 });
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('toggleWithEvent — 터치', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme.toggleWithEvent({ touches: [{ clientX: 50, clientY: 50 }] });
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('setTransition', () => {
    const theme = new Theme({ transition: 'none' });
    theme.setTransition('fade', 500);
    expect(theme.options.transition).toBe('fade');
    expect(theme.options.transitionDuration).toBe(500);
    theme.destroy?.();
  });

  it('레거시 — setTheme / toggleTheme / getTheme / getActualTheme', () => {
    const theme = new Theme({ transition: 'none' });
    theme.setTheme('dark', false);
    expect(theme.getTheme()).toBe('dark');
    expect(theme.getActualTheme()).toBe('dark');
    theme.toggleTheme();
    expect(theme.get()).toBe('light');
    theme.destroy?.();
  });

  it('isDark / isLight', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark');
    expect(theme.isDark()).toBe(true);
    expect(theme.isLight()).toBe(false);
    theme.set('light');
    expect(theme.isDark()).toBe(false);
    expect(theme.isLight()).toBe(true);
    theme.destroy?.();
  });

  it('registerCustomTheme (레거시)', () => {
    const theme = new Theme({ transition: 'none' });
    theme.registerCustomTheme('ocean', { '--primary': 'blue' });
    expect(theme.options.themes.ocean).toBeDefined();
    theme.set('ocean');
    expect(theme.get()).toBe('ocean');
    theme.destroy?.();
  });

  it('무효 테마 경고', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const theme = new Theme({ transition: 'none' });
    theme.set('invalid-theme');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    theme.destroy?.();
  });

  it('onChange 구독 해제', () => {
    const theme = new Theme({ transition: 'none' });
    const fn = vi.fn();
    const unsub = theme.onChange(fn);
    theme.set('dark');
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    theme.set('light');
    expect(fn).toHaveBeenCalledTimes(1);
    theme.destroy?.();
  });

  it('레거시 onChange 옵션 콜백', () => {
    const onChange = vi.fn();
    const theme = new Theme({ transition: 'none', onChange });
    theme.set('dark');
    expect(onChange).toHaveBeenCalled();
    theme.destroy?.();
  });

  it('system 테마', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('system');
    expect(theme.get()).toBe('system');
    expect(['light', 'dark']).toContain(theme.getResolved());
    theme.destroy?.();
  });

  it('커스텀 테마 변수 적용', () => {
    const theme = new Theme({ transition: 'none', themes: { ocean: { '--bg': '#0077be' } } });
    theme.set('ocean');
    theme.destroy?.();
  });

  it('set — save false', () => {
    const theme = new Theme({ transition: 'none' });
    theme.set('dark', false);
    expect(localStorage.getItem('imcat-theme')).toBeNull();
    theme.destroy?.();
  });

  it('_transitionFadeFallback 직접 호출', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme._transitionFadeFallback('dark', 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_transitionSlideFallback 직접 호출', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme._transitionSlideFallback('dark', 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_transitionCircleFallback 직접 호출', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme._transitionCircleFallback('dark', 100, 50, 50);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_setWithCircleAtFallback 직접 호출', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    theme._setWithCircleAtFallback('dark', 'dark', 100, 100, 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_getCircleOrigin — 모든 origin', () => {
    const theme = new Theme({ transition: 'none' });
    expect(theme._getCircleOrigin('top-left')).toEqual({ x: 0, y: 0 });
    expect(theme._getCircleOrigin('top-right').x).toBe(window.innerWidth);
    expect(theme._getCircleOrigin('bottom-left').y).toBe(window.innerHeight);
    expect(theme._getCircleOrigin('bottom-right').x).toBe(window.innerWidth);
    expect(theme._getCircleOrigin('center').x).toBe(window.innerWidth / 2);
    expect(theme._getCircleOrigin('unknown').x).toBe(window.innerWidth);
    theme.destroy?.();
  });

  it('_createOverlay', () => {
    const theme = new Theme({ transition: 'none' });
    const overlay = theme._createOverlay();
    expect(overlay).toBeInstanceOf(HTMLElement);
    expect(overlay.className).toBe('imcat-theme-transition-overlay');
    theme.destroy?.();
  });

  it('_applyTheme — animate true + transition none', () => {
    const theme = new Theme({ transition: 'none' });
    theme._applyTheme('dark', true);
    theme.destroy?.();
  });

  it('_transitionFade — startViewTransition 없을 때 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    delete document.startViewTransition;
    theme._transitionFade('dark', 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_transitionSlide — startViewTransition 없을 때 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    delete document.startViewTransition;
    theme._transitionSlide('dark', 100);
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('_transitionCircle — startViewTransition 없을 때 폴백', () => {
    vi.useFakeTimers();
    const theme = new Theme({ transition: 'none' });
    delete document.startViewTransition;
    theme._transitionCircle('dark', 100, 'center');
    vi.advanceTimersByTime(200);
    theme.destroy?.();
    vi.useRealTimers();
  });

  it('getSystemTheme', () => {
    const theme = new Theme({ transition: 'none' });
    const result = theme.getSystemTheme();
    expect(['light', 'dark']).toContain(result);
    theme.destroy?.();
  });

  it('_applyThemeImmediate — 커스텀 테마 변수 적용', () => {
    const theme = new Theme({ transition: 'none', themes: { ocean: { '--bg': 'blue' } } });
    theme._applyThemeImmediate('ocean');
    expect(document.documentElement.dataset.theme).toBe('ocean');
    theme.destroy?.();
  });

  it('_applyWithTransition — 전환 중 중복 호출 방지', () => {
    const theme = new Theme({ transition: 'fade', transitionDuration: 100 });
    theme._isTransitioning = true;
    theme._applyTheme('dark', true);
    // _isTransitioning이 true이면 _applyThemeImmediate로 폴백
    theme.destroy?.();
  });

  it('destroy — removeListener 폴백', () => {
    const theme = new Theme({ transition: 'none' });
    if (theme._mediaQuery) {
      // removeEventListener이 없는 경우를 시뮬레이션
      const original = theme._mediaQuery.removeEventListener;
      theme._mediaQuery.removeEventListener = undefined;
      theme._mediaQuery.removeListener = vi.fn();
      theme.destroy();
      expect(theme._mediaQuery).toBeNull();
    } else {
      theme.destroy?.();
    }
  });
});

describe('Theme 팩토리', () => {
  let mod;
  beforeEach(async () => {
    mod = await import('../../src/modules/theme.js');
  });

  it('initTheme() — 싱글톤 초기화', () => {
    const instance = mod.default.initTheme({ transition: 'none' });
    expect(instance).toBeDefined();
    instance.destroy?.();
  });

  it('createTheme() / getTheme()', () => {
    const instance = mod.default.initTheme({ transition: 'none' });
    const got = mod.default.getTheme();
    expect(got).toBe(instance);
    instance.destroy?.();
  });
});
