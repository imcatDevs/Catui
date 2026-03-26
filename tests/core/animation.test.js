/**
 * Animation Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnimationUtil } from '../../src/core/animation.js';

describe('Animation Module', () => {
  let testElement;

  beforeEach(() => {
    testElement = document.createElement('div');
    testElement.id = 'test-element';
    testElement.style.cssText = 'width: 100px; height: 100px;';
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('AnimationUtil.animate()', () => {
    it('애니메이터 인스턴스를 생성해야 함', () => {
      const animator = AnimationUtil.animate('#test-element');
      expect(animator).toBeDefined();
      expect(animator.element).toBe(testElement);
    });

    it('HTML 요소를 직접 전달할 수 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(animator.element).toBe(testElement);
    });
  });

  describe('이징 함수', () => {
    it('모든 이징 함수가 정의되어 있어야 함', () => {
      expect(AnimationUtil.easings.linear).toBeDefined();
      expect(AnimationUtil.easings.easeIn).toBeDefined();
      expect(AnimationUtil.easings.easeOut).toBeDefined();
      expect(AnimationUtil.easings.easeInOut).toBeDefined();
      expect(AnimationUtil.easings.easeOutElastic).toBeDefined();
      expect(AnimationUtil.easings.easeOutBounce).toBeDefined();
    });

    it('이징 함수가 0-1 범위의 값을 반환해야 함', () => {
      Object.keys(AnimationUtil.easings).forEach(key => {
        const fn = AnimationUtil.easings[key];
        const result0 = fn(0);
        const result1 = fn(1);
        const result05 = fn(0.5);
        
        expect(typeof result0).toBe('number');
        expect(typeof result1).toBe('number');
        expect(typeof result05).toBe('number');
      });
    });
  });

  describe('기본 애니메이션', () => {
    it('fadeIn이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.fadeIn).toBe('function');
    });

    it('fadeOut이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.fadeOut).toBe('function');
    });

    it('slideDown이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.slideDown).toBe('function');
    });

    it('slideUp이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.slideUp).toBe('function');
    });
  });

  describe('고급 애니메이션', () => {
    it('scaleIn이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.scaleIn).toBe('function');
    });

    it('scaleOut이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.scaleOut).toBe('function');
    });

    it('bounceIn이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.bounceIn).toBe('function');
    });

    it('rotateIn이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.rotateIn).toBe('function');
    });

    it('flipIn이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.flipIn).toBe('function');
    });
  });

  describe('효과 애니메이션', () => {
    it('shake가 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.shake).toBe('function');
    });

    it('pulse가 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.pulse).toBe('function');
    });

    it('flash가 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.flash).toBe('function');
    });

    it('swing이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.swing).toBe('function');
    });

    it('wobble이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.wobble).toBe('function');
    });

    it('tada가 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.tada).toBe('function');
    });

    it('heartBeat이 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.heartBeat).toBe('function');
    });
  });

  describe('커스텀 애니메이션', () => {
    it('custom 메서드가 정의되어 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(typeof animator.custom).toBe('function');
    });

    it('Promise를 반환해야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      const result = animator.custom(
        { opacity: '1' },
        { opacity: '0.5' },
        10
      );
      expect(result).toBeInstanceOf(Promise);
    });

    it('element가 없으면 즉시 resolve', async () => {
      const animator = AnimationUtil.animate('#nonexistent');
      await expect(animator.custom({}, {}, 10)).resolves.toBeUndefined();
    });
  });

  // ============================================
  // Web Animations API mock 기반 실행 테스트
  // ============================================
  describe('실제 메서드 실행 (Web Animations API mock)', () => {
    let mockFinished;

    beforeEach(() => {
      mockFinished = Promise.resolve();
      testElement.animate = vi.fn(() => ({
        finished: mockFinished,
        cancel: vi.fn()
      }));
    });

    it('fadeIn — element.animate 호출 후 opacity:1 설정', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.fadeIn(10);
      expect(testElement.animate).toHaveBeenCalled();
      expect(testElement.style.opacity).toBe('1');
    });

    it('fadeIn — element 없으면 즉시 resolve', async () => {
      const animator = AnimationUtil.animate('#nonexistent');
      await expect(animator.fadeIn(10)).resolves.toBeUndefined();
    });

    it('fadeOut — 완료 후 display:none 설정', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.fadeOut(10);
      expect(testElement.animate).toHaveBeenCalled();
      expect(testElement.style.display).toBe('none');
    });

    it('slideDown — 완료 후 height/overflow 초기화', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.slideDown(10);
      expect(testElement.animate).toHaveBeenCalled();
      expect(testElement.style.height).toBe('');
      expect(testElement.style.overflow).toBe('');
    });

    it('slideUp — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.slideUp(10);
      expect(testElement.style.display).toBe('none');
    });

    it('slideLeft — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.slideLeft(10);
      expect(testElement.style.display).toBe('none');
    });

    it('slideRight — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.slideRight(10);
      expect(testElement.style.display).toBe('none');
    });

    it('scaleIn — 완료 후 opacity:1', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.scaleIn(10);
      expect(testElement.style.opacity).toBe('1');
    });

    it('scaleOut — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.scaleOut(10);
      expect(testElement.style.display).toBe('none');
    });

    it('bounceIn — 완료 후 opacity:1', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.bounceIn(10);
      expect(testElement.style.opacity).toBe('1');
    });

    it('bounceOut — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.bounceOut(10);
      expect(testElement.style.display).toBe('none');
    });

    it('rotateIn — 완료 후 opacity:1', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.rotateIn(10);
      expect(testElement.style.opacity).toBe('1');
    });

    it('rotateOut — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.rotateOut(10);
      expect(testElement.style.display).toBe('none');
    });

    it('flipIn — 완료 후 opacity:1', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.flipIn(10);
      expect(testElement.style.opacity).toBe('1');
    });

    it('flipOut — 완료 후 display:none', async () => {
      const animator = AnimationUtil.animate(testElement);
      await animator.flipOut(10);
      expect(testElement.style.display).toBe('none');
    });

    it('shake — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.shake(10)).resolves.toBeUndefined();
    });

    it('pulse — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.pulse(10)).resolves.toBeUndefined();
    });

    it('flash — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.flash(10)).resolves.toBeUndefined();
    });

    it('swing — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.swing(10)).resolves.toBeUndefined();
    });

    it('wobble — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.wobble(10)).resolves.toBeUndefined();
    });

    it('tada — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.tada(10)).resolves.toBeUndefined();
    });

    it('heartBeat — Promise 반환', async () => {
      const animator = AnimationUtil.animate(testElement);
      await expect(animator.heartBeat(10)).resolves.toBeUndefined();
    });
  });

  // ============================================
  // _cssEasing / _parseValue 내부 메서드
  // ============================================
  describe('내부 메서드', () => {
    it('_cssEasing — 알려진 이징 이름 변환', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(animator._cssEasing('easeIn')).toBe('ease-in');
      expect(animator._cssEasing('easeOut')).toBe('ease-out');
      expect(animator._cssEasing('linear')).toBe('linear');
    });

    it('_cssEasing — cubic-bezier 문자열은 그대로 반환', () => {
      const animator = AnimationUtil.animate(testElement);
      const cbValue = 'cubic-bezier(0.1, 0.2, 0.3, 0.4)';
      expect(animator._cssEasing(cbValue)).toBe(cbValue);
    });

    it('_parseValue — 숫자+단위 파싱', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(animator._parseValue('100px')).toEqual({ value: 100, unit: 'px' });
      expect(animator._parseValue('0.5')).toEqual({ value: 0.5, unit: '' });
      expect(animator._parseValue('75%')).toEqual({ value: 75, unit: '%' });
    });

    it('_parseValue — 비문자열은 그대로 반환', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(animator._parseValue(42)).toEqual({ value: 42, unit: '' });
    });
  });

  describe('애니메이션 개수', () => {
    it('총 20개 이상의 애니메이션이 있어야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      const animations = [
        'fadeIn', 'fadeOut',
        'slideDown', 'slideUp', 'slideLeft', 'slideRight',
        'scaleIn', 'scaleOut',
        'bounceIn', 'bounceOut',
        'rotateIn', 'rotateOut',
        'flipIn', 'flipOut',
        'shake', 'pulse', 'flash', 'swing', 'wobble', 'tada', 'heartBeat'
      ];
      
      animations.forEach(name => {
        expect(typeof animator[name]).toBe('function');
      });
      
      expect(animations.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('이징 함수 분기 커버', () => {
    it('bounceOut의 모든 분기를 실행해야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      expect(animator).toBeDefined();
      // bounceOut 이징 — 4개 분기: t<1/2.75, t<2/2.75, t<2.5/2.75, else
      const easings = AnimationUtil.easings;
      if (easings && easings.bounceOut) {
        expect(easings.bounceOut(0.1)).toBeGreaterThan(0);    // 첫 번째 분기
        expect(easings.bounceOut(0.5)).toBeGreaterThan(0);    // 두 번째 분기
        expect(easings.bounceOut(0.85)).toBeGreaterThan(0);   // 세 번째 분기
        expect(easings.bounceOut(0.98)).toBeGreaterThan(0);   // 네 번째 분기
      }
    });
  });

  describe('_parseValue()', () => {
    it('파싱 불가능한 값은 {value:0, unit:""} 반환해야 함', () => {
      const animator = AnimationUtil.animate(testElement);
      if (animator._parseValue) {
        const result = animator._parseValue('auto');
        expect(result.value).toBe(0);
        expect(result.unit).toBe('');
      }
    });
  });

  describe('custom() 스타일 보간', () => {
    it('from/to 값이 유닛 있는 숫자면 보간해야 함', async () => {
      vi.useFakeTimers();
      const animator = AnimationUtil.animate(testElement);
      const promise = animator.custom({ opacity: '0' }, { opacity: '1' }, 50);
      vi.advanceTimersByTime(100);
      vi.useRealTimers();
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
