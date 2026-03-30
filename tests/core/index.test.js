/**
 * Core Index 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import IMCAT from '../../src/core/index.js';

describe('Core Index (IMCAT)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  describe('기본 정보', () => {
    it('버전 정보를 가져야 함', () => {
      // 빌드 전: '__IMCAT_VERSION__' 플레이스홀더, 빌드 후: 실제 semver 문자열
      expect(IMCAT.version).toMatch(/^(\d+\.\d+\.\d+|__IMCAT_VERSION__)$/);
    });

    it('함수로 호출 가능해야 함', () => {
      const el = IMCAT('#app');
      expect(el).toBeDefined();
      expect(el.length).toBe(1);
    });
  });

  describe('DOM API', () => {
    it('$(selector) - 요소를 선택해야 함', () => {
      const el = IMCAT('#app');
      expect(el.get(0).id).toBe('app');
    });

    it('create() - 요소를 생성해야 함', () => {
      const el = IMCAT.create('div', { class: 'test' });
      expect(el.hasClass('test')).toBe(true);
    });

    it('ready() - DOM 준비 완료 콜백을 실행해야 함', () => {
      const callback = vi.fn();
      IMCAT.ready(callback);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Module Loader API', () => {
    it('use() - 모듈을 로드해야 함', async () => {
      const MockModal = class Modal {};
      IMCAT.loader.modules.set('modal', MockModal);

      const Modal = await IMCAT.use('modal');
      expect(Modal).toBe(MockModal);
    });
  });

  describe('View Router API', () => {
    it('view 속성으로 라우터에 접근해야 함', () => {
      expect(IMCAT.view).toBeDefined();
      expect(IMCAT.view.constructor.name).toBe('ViewRouter');
    });

    it('라우터 메서드를 사용할 수 있어야 함', () => {
      expect(typeof IMCAT.view.navigate).toBe('function');
      expect(typeof IMCAT.view.params).toBe('function');
      expect(typeof IMCAT.view.current).toBe('function');
    });
  });

  describe('API Utility', () => {
    it('api 속성으로 API 유틸리티에 접근해야 함', () => {
      expect(IMCAT.api).toBeDefined();
    });

    it('API 메서드를 사용할 수 있어야 함', () => {
      const response = IMCAT.api.success({ id: 1 });
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(1);
    });
  });

  describe('Event Bus API', () => {
    it('on() - 이벤트를 구독해야 함', () => {
      const handler = vi.fn();
      IMCAT.on('test', handler);
      IMCAT.emit('test');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('once() - 일회성 이벤트를 구독해야 함', () => {
      const handler = vi.fn();
      IMCAT.once('test', handler);
      IMCAT.emit('test');
      IMCAT.emit('test');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('off() - 이벤트 구독을 취소해야 함', () => {
      const handler = vi.fn();
      IMCAT.on('test', handler);
      IMCAT.off('test', handler);
      IMCAT.emit('test');
      expect(handler).not.toHaveBeenCalled();
    });

    it('emit() - 이벤트를 발행해야 함', () => {
      const handler = vi.fn();
      IMCAT.on('test', handler);
      IMCAT.emit('test', 'arg1', 'arg2');
      expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('Loading Indicator API', () => {
    it('loading 속성으로 로딩 인디케이터에 접근해야 함', () => {
      expect(IMCAT.loading).toBeDefined();
    });

    it('로딩 메서드를 사용할 수 있어야 함', () => {
      expect(typeof IMCAT.loading.show).toBe('function');
      expect(typeof IMCAT.loading.hide).toBe('function');
    });
  });

  describe('Security API', () => {
    it('escape() - HTML을 이스케이프해야 함', () => {
      const result = IMCAT.escape('<script>alert(1)</script>');
      expect(result).toContain('&lt;');
      expect(result).not.toContain('<script>');
    });

    it('sanitize() - HTML을 새니타이징해야 함', () => {
      const result = IMCAT.sanitize('<script>alert(1)</script><p>Safe</p>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Safe</p>');
    });

    it('validatePath() - 경로를 검증해야 함', () => {
      expect(IMCAT.validatePath('views/home.html')).toBe(true);
      expect(IMCAT.validatePath('../etc/passwd')).toBe(false);
    });
  });

  describe('Utils API', () => {
    it('isString() - 문자열을 확인해야 함', () => {
      expect(IMCAT.isString('hello')).toBe(true);
      expect(IMCAT.isString(123)).toBe(false);
    });

    it('isNumber() - 숫자를 확인해야 함', () => {
      expect(IMCAT.isNumber(123)).toBe(true);
      expect(IMCAT.isNumber('123')).toBe(false);
    });

    it('isArray() - 배열을 확인해야 함', () => {
      expect(IMCAT.isArray([1, 2, 3])).toBe(true);
      expect(IMCAT.isArray({})).toBe(false);
    });

    it('isObject() - 객체를 확인해야 함', () => {
      expect(IMCAT.isObject({})).toBe(true);
      expect(IMCAT.isObject([])).toBe(false);
    });

    it('isFunction() - 함수를 확인해야 함', () => {
      expect(IMCAT.isFunction(() => {})).toBe(true);
      expect(IMCAT.isFunction({})).toBe(false);
    });

    it('extend() - 객체를 병합해야 함', () => {
      const result = IMCAT.extend({}, { a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('clone() - 깊은 복사를 수행해야 함', () => {
      const original = { a: { b: 1 } };
      const cloned = IMCAT.clone(original);
      cloned.a.b = 2;
      expect(original.a.b).toBe(1);
    });

    it('debounce() - 디바운스 함수를 생성해야 함', () => {
      const fn = vi.fn();
      const debounced = IMCAT.debounce(fn, 100);
      expect(typeof debounced).toBe('function');
    });

    it('throttle() - 스로틀 함수를 생성해야 함', () => {
      const fn = vi.fn();
      const throttled = IMCAT.throttle(fn, 100);
      expect(typeof throttled).toBe('function');
    });

    it('randomId() - 랜덤 ID를 생성해야 함', () => {
      const id = IMCAT.randomId('test');
      expect(id).toMatch(/^test-/);
    });
  });

  describe('전역 통합', () => {
    it('모든 주요 API가 접근 가능해야 함', () => {
      // DOM
      expect(typeof IMCAT).toBe('function');
      expect(typeof IMCAT.create).toBe('function');
      
      // Module Loader
      expect(typeof IMCAT.use).toBe('function');
      
      // View Router
      expect(IMCAT.view).toBeDefined();
      
      // API
      expect(IMCAT.api).toBeDefined();
      
      // Event Bus
      expect(typeof IMCAT.on).toBe('function');
      expect(typeof IMCAT.emit).toBe('function');
      
      // Loading
      expect(IMCAT.loading).toBeDefined();
      
      // Security
      expect(typeof IMCAT.escape).toBe('function');
      expect(typeof IMCAT.sanitize).toBe('function');
      
      // Utils
      expect(typeof IMCAT.isString).toBe('function');
      expect(typeof IMCAT.extend).toBe('function');
    });

    it('체이닝이 가능해야 함', () => {
      IMCAT('#app')
        .addClass('test')
        .text('Hello')
        .attr('data-test', 'value');

      const el = document.querySelector('#app');
      expect(el.classList.contains('test')).toBe(true);
      expect(el.textContent).toContain('Hello');
      expect(el.getAttribute('data-test')).toBe('value');
    });
  });

  describe('실전 시나리오', () => {
    it('완전한 애플리케이션 초기화', async () => {
      // DOM 조작
      IMCAT('#app').html('<button id="btn">Click</button>');
      
      // 이벤트 리스너
      const handler = vi.fn();
      IMCAT('#btn').on('click', handler);
      
      // 이벤트 발생
      document.querySelector('#btn').click();
      expect(handler).toHaveBeenCalled();
      
      // 전역 이벤트
      const globalHandler = vi.fn();
      IMCAT.on('app:init', globalHandler);
      IMCAT.emit('app:init', { ready: true });
      expect(globalHandler).toHaveBeenCalledWith({ ready: true });
    });

    it('모듈 로딩 및 사용', async () => {
      const MockModal = class Modal {
        constructor() {
          this.isOpen = false;
        }
        open() {
          this.isOpen = true;
        }
      };

      IMCAT.loader.modules.set('modal', MockModal);

      const Modal = await IMCAT.use('modal');
      const modal = new Modal();
      modal.open();
      
      expect(modal.isOpen).toBe(true);
    });

    it('API 통신', () => {
      const response = IMCAT.api.success({ users: [{ id: 1 }] });
      
      expect(response.success).toBe(true);
      expect(response.data.users.length).toBe(1);
      expect(response.statusCode).toBe(200);
    });

    it('보안 처리', () => {
      const userInput = '<script>alert("XSS")</script>';
      const safe = IMCAT.escape(userInput);
      
      IMCAT('#app').text(safe);
      
      const content = document.querySelector('#app').innerHTML;
      expect(content).not.toContain('<script>');
    });

    it('serverRender 모드에서 위험한 URL 차단', () => {
      // serverRender 모드 활성화 (Config 동적 참조 테스트)
      IMCAT.config.set('serverRender', true);

      // 위험한 URL을 가진 링크 생성
      const link = document.createElement('a');
      link.setAttribute('catui-href', 'javascript:alert(1)');
      document.body.appendChild(link);

      // 클릭 이벤트 시뮬레이션
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(clickEvent);

      // href가 설정되지 않아야 함 (위험한 URL 차단)
      expect(link.hasAttribute('href')).toBe(false);

      // 정리
      IMCAT.config.set('serverRender', false);
      link.remove();
    });

    it('serverRender 모드에서 href="#" 또는 href 없는 링크 직접 네비게이션', () => {
      // serverRender 모드 활성화
      IMCAT.config.set('serverRender', true);

      // href="#"이 있는 링크 (Catphp 실제 사용 패턴)
      const link1 = document.createElement('a');
      link1.setAttribute('href', '#');
      link1.setAttribute('catui-href', '/login');
      document.body.appendChild(link1);

      // href 없는 링크
      const link2 = document.createElement('a');
      link2.setAttribute('catui-href', '/register');
      document.body.appendChild(link2);

      // 클릭 시 preventDefault 호출 확인 (직접 네비게이션하므로 기본 동작 방지)
      const event1 = new MouseEvent('click', { bubbles: true, cancelable: true });
      link1.dispatchEvent(event1);
      expect(event1.defaultPrevented).toBe(true);

      const event2 = new MouseEvent('click', { bubbles: true, cancelable: true });
      link2.dispatchEvent(event2);
      expect(event2.defaultPrevented).toBe(true);

      // 이미 유효한 href가 있는 링크는 기본 동작 허용
      const link3 = document.createElement('a');
      link3.setAttribute('href', '/dashboard');
      link3.setAttribute('catui-href', '/dashboard');
      document.body.appendChild(link3);

      const event3 = new MouseEvent('click', { bubbles: true, cancelable: true });
      link3.dispatchEvent(event3);
      expect(event3.defaultPrevented).toBe(false);

      // 정리
      IMCAT.config.set('serverRender', false);
      link1.remove();
      link2.remove();
      link3.remove();
    });

    it('serverRender 모드에서 안전한 URL 허용', () => {
      // Security.isSafeUrl()이 절대 경로/URL을 허용하는지 확인
      expect(IMCAT.security.isSafeUrl('/about')).toBe(true);
      expect(IMCAT.security.isSafeUrl('/users/profile')).toBe(true);
      expect(IMCAT.security.isSafeUrl('https://example.com')).toBe(true);

      // 위험한 프로토콜 차단
      expect(IMCAT.security.isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(IMCAT.security.isSafeUrl('vbscript:run')).toBe(false);
    });
  });

  describe('autoInit getter', () => {
    it('AutoInit 객체를 반환해야 함', () => {
      expect(IMCAT.autoInit).toBeDefined();
      expect(typeof IMCAT.autoInit.destroy).toBe('function');
    });
  });

  describe('destroy()', () => {
    it('프레임워크 전체를 정리해야 함', () => {
      // destroy가 에러 없이 실행되는지 확인
      expect(() => IMCAT.destroy()).not.toThrow();
    });
  });
});
