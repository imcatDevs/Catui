/**
 * AutoInit 테스트
 * - 보안: new Function() 제거 회귀 테스트
 * - confirm 컴포넌트 CustomEvent dispatch 검증
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AutoInit } from '../../src/core/auto-init.js';

describe('AutoInit', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    AutoInit.destroy();
  });

  afterEach(() => {
    AutoInit.destroy();
    vi.restoreAllMocks();
  });

  describe('register()', () => {
    it('컴포넌트를 등록할 수 있어야 함', () => {
      const initializer = vi.fn().mockResolvedValue({});
      AutoInit.register('test-component', initializer);
      expect(AutoInit._components['test-component']).toBe(initializer);
    });
  });

  describe('refresh()', () => {
    it('data-imcat 요소가 없으면 아무것도 초기화하지 않아야 함', async () => {
      const mockImcat = { use: vi.fn(), view: { registerInstance: vi.fn() } };
      AutoInit._imcat = mockImcat;
      await AutoInit.refresh();
      expect(mockImcat.use).not.toHaveBeenCalled();
    });
  });

  describe('보안: new Function() 제거 회귀 테스트', () => {
    it('confirm 컴포넌트가 new Function()을 사용하지 않아야 함', async () => {
      const confirmInitializer = AutoInit._components['confirm'];
      const src = confirmInitializer?.toString() || '';
      expect(src).not.toContain('new Function');
      expect(src).not.toContain('eval(');
    });

    it('confirm 확인 시 imcat:confirmed CustomEvent를 dispatch해야 함', async () => {
      const btn = document.createElement('button');
      btn.setAttribute('data-imcat', 'confirm');
      document.body.appendChild(btn);

      const dispatchedEvents = [];
      btn.addEventListener('imcat:confirmed', (e) => {
        dispatchedEvents.push(e);
      });

      const mockImcat = {
        use: vi.fn(),
        view: { registerInstance: vi.fn() },
        confirm: vi.fn().mockResolvedValue(true)
      };

      const confirmInit = AutoInit._components['confirm'];
      if (!confirmInit) return;

      await confirmInit(btn, { message: '삭제하시겠습니까?', onConfirm: 'deleteItem' }, mockImcat);

      btn.click();
      await vi.waitFor(() => expect(mockImcat.confirm).toHaveBeenCalled());
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dispatchedEvents.length).toBe(1);
      expect(dispatchedEvents[0].detail.action).toBe('deleteItem');
    });

    it('confirm 취소 시 CustomEvent가 dispatch되지 않아야 함', async () => {
      const btn = document.createElement('button');
      document.body.appendChild(btn);

      const dispatchedEvents = [];
      btn.addEventListener('imcat:confirmed', (e) => dispatchedEvents.push(e));

      const mockImcat = {
        use: vi.fn(),
        view: { registerInstance: vi.fn() },
        confirm: vi.fn().mockResolvedValue(false)
      };

      const confirmInit = AutoInit._components['confirm'];
      if (!confirmInit) return;

      await confirmInit(btn, { message: '취소 테스트' }, mockImcat);

      btn.click();
      await vi.waitFor(() => expect(mockImcat.confirm).toHaveBeenCalled());
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dispatchedEvents.length).toBe(0);
    });
  });

  describe('_parseOptions()', () => {
    it('data 속성에서 옵션을 파싱해야 함', () => {
      const el = document.createElement('div');
      el.setAttribute('data-imcat', 'tooltip');
      el.setAttribute('data-content', '도움말');
      el.setAttribute('data-position', 'top');

      const options = AutoInit._parseOptions(el);
      expect(options.content).toBe('도움말');
      expect(options.position).toBe('top');
    });
  });

  describe('destroy()', () => {
    it('MutationObserver를 정리해야 함', () => {
      const mockObserver = { disconnect: vi.fn() };
      AutoInit._observer = mockObserver;
      AutoInit.destroy();
      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect(AutoInit._observer).toBeNull();
    });

    it('destroyable 인스턴스의 destroy()를 호출해야 함', () => {
      const inst1 = { destroy: vi.fn() };
      const inst2 = { destroy: vi.fn() };
      AutoInit._destroyables = new Set([inst1, inst2]);
      AutoInit.destroy();
      expect(inst1.destroy).toHaveBeenCalled();
      expect(inst2.destroy).toHaveBeenCalled();
    });

    it('인스턴스 destroy 에러를 격리해야 함', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const badInst = { destroy: () => { throw new Error('fail'); } };
      AutoInit._destroyables = new Set([badInst]);
      expect(() => AutoInit.destroy()).not.toThrow();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('상태를 초기화해야 함', () => {
      AutoInit._initialized = true;
      AutoInit.destroy();
      expect(AutoInit._initialized).toBe(false);
      expect(AutoInit._imcat).toBeNull();
    });
  });
});
