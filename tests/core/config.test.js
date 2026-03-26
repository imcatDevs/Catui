/**
 * Config Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Config } from '../../src/core/config.js';

describe('Config', () => {

  beforeEach(() => {
    Config.destroy();
    Config.clearListeners();
  });

  afterEach(() => {
    Config.destroy();
    Config.clearListeners();
  });

  // ============================================
  // get() / set() 기본
  // ============================================
  describe('get()', () => {
    it('전체 설정 객체 반환', () => {
      const settings = Config.get();
      expect(settings).toBeTypeOf('object');
      expect(settings.animation).toBeDefined();
      expect(settings.theme).toBeDefined();
    });

    it('단일 키 조회', () => {
      expect(Config.get('animation')).toBe(true);
      expect(Config.get('theme')).toBe('system');
    });

    it('중첩 키 조회 (dot notation)', () => {
      expect(Config.get('zIndex.modal')).toBe(1050);
      expect(Config.get('toast.duration')).toBe(3000);
    });

    it('없는 키는 defaultValue 반환', () => {
      expect(Config.get('nonexistent', 'fallback')).toBe('fallback');
    });

    it('없는 키의 기본 defaultValue는 undefined', () => {
      expect(Config.get('nonexistent')).toBeUndefined();
    });
  });

  describe('set()', () => {
    it('단일 키 설정', () => {
      Config.set('animation', false);
      expect(Config.get('animation')).toBe(false);
    });

    it('객체로 여러 설정 변경', () => {
      Config.set({ animation: false, theme: 'dark' });
      expect(Config.get('animation')).toBe(false);
      expect(Config.get('theme')).toBe('dark');
    });

    it('중첩 키 설정 (dot notation)', () => {
      Config.set('zIndex.modal', 2000);
      expect(Config.get('zIndex.modal')).toBe(2000);
    });

    it('설정 후 현재 설정 객체 반환', () => {
      const result = Config.set('animation', false);
      expect(result).toBeTypeOf('object');
      expect(result.animation).toBe(false);
    });

    it('중첩 객체 깊은 병합', () => {
      Config.set({ toast: { duration: 5000 } });
      expect(Config.get('toast.duration')).toBe(5000);
      expect(Config.get('toast.position')).toBe('top-right');
    });
  });

  // ============================================
  // reset()
  // ============================================
  describe('reset()', () => {
    it('전체 설정 기본값으로 복원', () => {
      Config.set('animation', false);
      Config.reset();
      expect(Config.get('animation')).toBe(true);
    });

    it('특정 키만 초기화', () => {
      Config.set('animation', false);
      Config.set('theme', 'dark');
      Config.reset('animation');
      expect(Config.get('animation')).toBe(true);
      expect(Config.get('theme')).toBe('dark');
    });

    it('존재하지 않는 키 reset은 아무 동작 안 함', () => {
      expect(() => Config.reset('nonexistent')).not.toThrow();
    });
  });

  // ============================================
  // onChange()
  // ============================================
  describe('onChange()', () => {
    it('설정 변경 시 콜백 호출', () => {
      const changes = [];
      Config.onChange((ch) => changes.push(ch));
      Config.set('animation', false);
      expect(changes).toHaveLength(1);
      expect(changes[0].animation).toBe(false);
    });

    it('반환된 함수로 구독 해제', () => {
      const calls = [];
      const unsubscribe = Config.onChange((ch) => calls.push(ch));
      Config.set('animation', false);
      unsubscribe();
      Config.set('animation', true);
      expect(calls).toHaveLength(1);
    });

    it('리스너 내부 에러는 다른 리스너에 영향 없음', () => {
      const goodCalls = [];
      Config.onChange(() => { throw new Error('test error'); });
      Config.onChange((ch) => goodCalls.push(ch));
      Config.set('animation', false);
      expect(goodCalls).toHaveLength(1);
    });
  });

  // ============================================
  // getLocale()
  // ============================================
  describe('getLocale()', () => {
    it('locale이 "system"이면 navigator.language 반환', () => {
      Config.set('locale', 'system');
      const locale = Config.getLocale();
      expect(typeof locale).toBe('string');
      expect(locale.length).toBeGreaterThan(0);
    });

    it('locale을 직접 설정하면 해당 값 반환', () => {
      Config.set('locale', 'en-US');
      expect(Config.getLocale()).toBe('en-US');
    });

    it('locale을 ko-KR로 설정', () => {
      Config.set('locale', 'ko-KR');
      expect(Config.getLocale()).toBe('ko-KR');
    });
  });

  // ============================================
  // getCurrency()
  // ============================================
  describe('getCurrency()', () => {
    it('currency를 직접 설정하면 해당 값 반환', () => {
      Config.set('currency', 'EUR');
      expect(Config.getCurrency()).toBe('EUR');
    });

    it('currency가 "system"이고 locale이 "ko"이면 KRW 반환', () => {
      Config.set('currency', 'system');
      Config.set('locale', 'ko-KR');
      expect(Config.getCurrency()).toBe('KRW');
    });

    it('currency가 "system"이고 locale이 "en-US"이면 USD 반환', () => {
      Config.set('currency', 'system');
      Config.set('locale', 'en-US');
      expect(Config.getCurrency()).toBe('USD');
    });

    it('매핑 없는 로케일은 USD 폴백', () => {
      Config.set('currency', 'system');
      Config.set('locale', 'xx-XX');
      expect(Config.getCurrency()).toBe('USD');
    });
  });

  // ============================================
  // getFor()
  // ============================================
  describe('getFor()', () => {
    it('컴포넌트 기본값과 전역 옵션 병합', () => {
      const opts = Config.getFor('toast');
      expect(opts.duration).toBe(3000);
      expect(opts.animation).toBe(true);
    });

    it('사용자 옵션이 기본값을 덮어씀', () => {
      const opts = Config.getFor('modal', { size: 'lg' });
      expect(opts.size).toBe('lg');
    });

    it('존재하지 않는 컴포넌트는 전역 옵션만 반환', () => {
      const opts = Config.getFor('unknown');
      expect(opts.animation).toBeDefined();
    });
  });

  // ============================================
  // extend()
  // ============================================
  describe('extend()', () => {
    it('기본값 확장', () => {
      Config.extend({ myPlugin: { enabled: true } });
      expect(Config.get('myPlugin.enabled')).toBe(true);
    });
  });

  // ============================================
  // clearListeners() / destroy()
  // ============================================
  describe('clearListeners() / destroy()', () => {
    it('clearListeners — 모든 리스너 제거', () => {
      const calls = [];
      Config.onChange(() => calls.push(1));
      Config.clearListeners();
      Config.set('animation', false);
      expect(calls).toHaveLength(0);
    });

    it('destroy — settings null 초기화 후 get()은 defaults 반환', () => {
      Config.set('animation', false);
      Config.destroy();
      expect(Config.get('animation')).toBe(true);
    });
  });

  describe('중첩 경로 설정', () => {
    it('존재하지 않는 중간 경로를 자동 생성해야 함', () => {
      Config.set('deep.nested.value', 42);
      expect(Config.get('deep.nested.value')).toBe(42);
    });
  });
});
