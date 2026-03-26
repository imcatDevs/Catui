/**
 * Stepper Module 테스트
 * Stepper, VerticalStepper
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Stepper, VerticalStepper;

beforeEach(async () => {
  const mod = await import('../../src/modules/stepper.js');
  Stepper = mod.Stepper || mod.default?.Stepper;
  VerticalStepper = mod.VerticalStepper || mod.default?.VerticalStepper;
  document.body.innerHTML = '<div id="stepper-container"></div>';
  Stepper.instances?.clear?.();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

var sampleSteps = [
  { title: '정보 입력', subtitle: '기본 정보' },
  { title: '검증', subtitle: '데이터 확인' },
  { title: '완료', subtitle: '처리 완료' }
];

describe('Stepper', () => {
  it('Stepper 클래스가 존재해야 함', () => {
    expect(Stepper).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    expect(s).toBeDefined();
    expect(s.container).toBeTruthy();
    s.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Stepper.defaults();
    expect(d.currentStep).toBe(0);
    expect(d.orientation).toBe('horizontal');
    expect(d.clickable).toBe(true);
    expect(d.linear).toBe(false);
  });

  it('존재하지 않는 컨테이너는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new Stepper('#nonexistent', { steps: sampleSteps });
    expect(spy).toHaveBeenCalled();
  });

  it('goTo()로 특정 단계로 이동할 수 있어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    s.goTo(1);
    expect(s.options.currentStep).toBe(1);
    s.destroy?.();
  });

  it('next()로 다음 단계로 이동할 수 있어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, currentStep: 0 });
    s.next();
    expect(s.options.currentStep).toBe(1);
    s.destroy?.();
  });

  it('prev()로 이전 단계로 이동할 수 있어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, currentStep: 2 });
    s.prev();
    expect(s.options.currentStep).toBe(1);
    s.destroy?.();
  });

  it('onChange 콜백이 호출되어야 함', () => {
    var called = false;
    var s = new Stepper('#stepper-container', {
      steps: sampleSteps,
      currentStep: 0,
      onChange: function() { called = true; }
    });
    s.next();
    expect(called).toBe(true);
    s.destroy?.();
  });

  it('DOM에 단계 요소를 렌더링해야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    var container = document.getElementById('stepper-container');
    expect(container.children.length).toBeGreaterThan(0);
    s.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    expect(typeof s.destroy).toBe('function');
    s.destroy();
    var container = document.getElementById('stepper-container');
    expect(container.innerHTML).toBe('');
  });

  it('size 옵션을 적용할 수 있어야 함', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, size: 'lg' });
    expect(s.options.size).toBe('lg');
    s.destroy?.();
  });
});

describe('VerticalStepper', () => {
  it('VerticalStepper 클래스가 존재해야 함', () => {
    expect(VerticalStepper).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps });
    expect(vs).toBeDefined();
    vs.destroy?.();
  });
});

describe('Stepper 추가', () => {
  it('complete / uncomplete', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    s.complete(0);
    expect(s._completedSteps.has(0)).toBe(true);
    s.uncomplete(0);
    expect(s._completedSteps.has(0)).toBe(false);
    s.destroy?.();
  });

  it('reset', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, currentStep: 2 });
    s.complete(0);
    s.complete(1);
    s.reset();
    expect(s.options.currentStep).toBe(0);
    expect(s._completedSteps.size).toBe(0);
    s.destroy?.();
  });

  it('linear 모드 — 이전 단계 미완료 시 이동 불가', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, linear: true });
    var result = s.goTo(2);
    expect(result).toBe(false);
    s.destroy?.();
  });

  it('onComplete 콜백', () => {
    const onComplete = vi.fn();
    var s = new Stepper('#stepper-container', { steps: sampleSteps, onComplete });
    s.complete(0);
    s.complete(1);
    s.complete(2);
    expect(onComplete).toHaveBeenCalled();
    s.destroy?.();
  });

  it('content 옵션으로 콘텐츠 렌더링', () => {
    vi.useFakeTimers();
    var s = new Stepper('#stepper-container', {
      steps: [
        { title: '1단계', content: '<p>내용1</p>' },
        { title: '2단계', content: '<p>내용2</p>' }
      ]
    });
    vi.advanceTimersByTime(200);
    s.destroy?.();
    vi.useRealTimers();
  });

  it('vertical orientation', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, orientation: 'vertical' });
    expect(s.container.classList.contains('stepper--vertical')).toBe(true);
    s.destroy?.();
  });

  it('connector none', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, connector: 'none' });
    s.destroy?.();
  });

  it('clickable false', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps, clickable: false });
    s.destroy?.();
  });

  it('goTo 범위 밖 인덱스', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    expect(s.goTo(-1)).toBe(false);
    expect(s.goTo(99)).toBe(false);
    s.destroy?.();
  });

  it('addStep / removeStep', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    s.addStep({ title: '추가 단계' });
    expect(s.options.steps.length).toBe(4);
    s.removeStep(3);
    expect(s.options.steps.length).toBe(3);
    s.destroy?.();
  });

  it('getCurrentStep / getCompletedSteps / isComplete', () => {
    var s = new Stepper('#stepper-container', { steps: sampleSteps });
    expect(s.getCurrentStep()).toBe(0);
    s.complete(0);
    s.complete(1);
    expect(s.getCompletedSteps()).toContain(0);
    expect(s.getCompletedSteps()).toContain(1);
    expect(s.isComplete()).toBe(false);
    s.complete(2);
    expect(s.isComplete()).toBe(true);
    s.destroy?.();
  });

  it('content를 함수로 전달', () => {
    vi.useFakeTimers();
    var s = new Stepper('#stepper-container', {
      steps: [
        { title: '1', content: (idx) => `<p>Step ${idx}</p>` },
        { title: '2', content: '<p>2</p>' }
      ],
      animated: true
    });
    vi.advanceTimersByTime(200);
    s.destroy?.();
    vi.useRealTimers();
  });

  it('animated false + content', () => {
    var s = new Stepper('#stepper-container', {
      steps: [
        { title: '1', content: '<p>내용</p>' },
        { title: '2', content: '<p>내용2</p>' }
      ],
      animated: false
    });
    s.destroy?.();
  });

  it('존재하지 않는 컨테이너', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new Stepper('#nonexistent', { steps: sampleSteps });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('VerticalStepper 추가', () => {
  it('next / prev / goTo', () => {
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps });
    vs.next();
    expect(vs.getCurrentStep()).toBe(1);
    vs.prev();
    expect(vs.getCurrentStep()).toBe(0);
    vs.goTo(2);
    expect(vs.getCurrentStep()).toBe(2);
    vs.destroy?.();
  });

  it('complete / reset / isComplete / getCompletedSteps', () => {
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps });
    vs.complete(0);
    vs.complete(1);
    vs.complete(2);
    expect(vs.isComplete()).toBe(true);
    expect(vs.getCompletedSteps().length).toBe(3);
    vs.reset();
    expect(vs.getCurrentStep()).toBe(0);
    vs.destroy?.();
  });

  it('존재하지 않는 컨테이너', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new VerticalStepper('#nonexistent', { steps: sampleSteps });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('onComplete 콜백', () => {
    const onComplete = vi.fn();
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps, onComplete });
    vs.goTo(2);
    vs._handleComplete();
    expect(onComplete).toHaveBeenCalled();
    vs.destroy?.();
  });

  it('next 버튼 클릭', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: [
        { title: '1', content: '<p>내용1</p>' },
        { title: '2', content: '<p>내용2</p>' },
        { title: '3', content: '<p>내용3</p>' }
      ]
    });
    var nextBtn = vs.container.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.click();
    expect(vs.getCurrentStep()).toBe(1);
    vs.destroy?.();
  });

  it('prev 버튼 클릭', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: [
        { title: '1', content: '<p>내용1</p>' },
        { title: '2', content: '<p>내용2</p>' }
      ],
      currentStep: 1
    });
    var prevBtn = vs.container.querySelector('[data-action="prev"]');
    if (prevBtn) prevBtn.click();
    expect(vs.getCurrentStep()).toBe(0);
    vs.destroy?.();
  });

  it('complete 버튼 클릭', () => {
    const onComplete = vi.fn();
    var vs = new VerticalStepper('#stepper-container', {
      steps: [{ title: '1', content: '<p>내용</p>' }],
      onComplete
    });
    var completeBtn = vs.container.querySelector('[data-action="complete"]');
    if (completeBtn) completeBtn.click();
    expect(onComplete).toHaveBeenCalled();
    vs.destroy?.();
  });

  it('헤더 클릭으로 expandable 토글', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: sampleSteps,
      expandable: true
    });
    vs.complete(0);
    vs.goTo(1);
    // re-render 후 completed 단계의 헤더 클릭
    var headers = vs.container.querySelectorAll('.vertical-stepper__header');
    if (headers[0]) headers[0].click();
    vs.destroy?.();
  });

  it('편집 버튼 클릭 — _uncompleteAndGoTo', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: sampleSteps,
      editable: true
    });
    vs.complete(0);
    vs.goTo(1);
    // re-render 후 편집 버튼 찾기
    var editBtn = vs.container.querySelector('.vertical-stepper__edit');
    if (editBtn) editBtn.click();
    vs.destroy?.();
  });

  it('expandable false', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: sampleSteps,
      expandable: false
    });
    vs.complete(0);
    vs.goTo(1);
    var headers = vs.container.querySelectorAll('.vertical-stepper__header');
    if (headers[0]) headers[0].click();
    vs.destroy?.();
  });

  it('키보드 Enter — 헤더 클릭', () => {
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps });
    var header = vs.container.querySelector('.vertical-stepper__header');
    if (header) {
      header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    }
    vs.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var vs = new VerticalStepper('#stepper-container', { steps: sampleSteps, onChange });
    vs.next();
    expect(onChange).toHaveBeenCalled();
    vs.destroy?.();
  });

  it('icon 옵션', () => {
    var vs = new VerticalStepper('#stepper-container', {
      steps: [
        { title: '1', icon: 'home' },
        { title: '2', icon: 'settings' }
      ]
    });
    expect(vs.container.querySelector('.material-icons-outlined')).not.toBeNull();
    vs.destroy?.();
  });
});
