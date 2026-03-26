/**
 * Tooltips Module 테스트
 * Tooltip, Popover
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Tooltip, Popover;

beforeEach(async () => {
  const mod = await import('../../src/modules/tooltips.js');
  Tooltip = mod.Tooltip || mod.default?.Tooltip;
  Popover = mod.Popover || mod.default?.Popover;
  document.body.innerHTML = '';
  Tooltip.instances?.clear?.();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Tooltip', () => {
  it('Tooltip 클래스가 존재해야 함', () => {
    expect(Tooltip).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<button id="t1" data-tooltip="테스트">버튼</button>';
    var tip = new Tooltip('#t1');
    expect(tip).toBeDefined();
    expect(tip.element).toBeTruthy();
    tip.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Tooltip.defaults();
    expect(d.placement).toBe('top');
    expect(d.trigger).toBe('hover');
    expect(d.offset).toBe(8);
  });

  it('존재하지 않는 요소는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new Tooltip('#nonexistent');
    expect(spy).toHaveBeenCalled();
  });

  it('show() / hide() 메서드가 존재해야 함', () => {
    document.body.innerHTML = '<span id="t2" data-tooltip="힌트">텍스트</span>';
    var tip = new Tooltip('#t2');
    expect(typeof tip.show).toBe('function');
    expect(typeof tip.hide).toBe('function');
    tip.destroy?.();
  });

  it('show()로 툴팁이 DOM에 추가되어야 함', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="t3" data-tooltip="보여요">텍스트</span>';
    var tip = new Tooltip('#t3', { content: '보여요', delay: { show: 0, hide: 100 } });
    tip.show();
    vi.advanceTimersByTime(10);
    var tooltipEl = document.querySelector('.tooltip');
    expect(tooltipEl).not.toBeNull();
    tip.hide();
    vi.advanceTimersByTime(300);
    tip.destroy?.();
    vi.useRealTimers();
  });

  it('data-tooltip 속성에서 내용을 읽어야 함', () => {
    document.body.innerHTML = '<span id="t4" data-tooltip="자동 내용">텍스트</span>';
    var tip = new Tooltip('#t4');
    expect(tip.options.content).toBe('자동 내용');
    tip.destroy?.();
  });

  it('title 속성에서 내용을 읽고 제거해야 함', () => {
    document.body.innerHTML = '<span id="t5" title="타이틀 내용">텍스트</span>';
    var tip = new Tooltip('#t5');
    expect(tip.options.content).toBe('타이틀 내용');
    expect(document.getElementById('t5').getAttribute('title')).toBeNull();
    tip.destroy?.();
  });

  it('같은 요소에 중복 인스턴스를 생성하지 않아야 함', () => {
    document.body.innerHTML = '<span id="t6" data-tooltip="내용">텍스트</span>';
    var tip1 = new Tooltip('#t6');
    var tip2 = new Tooltip('#t6');
    // 두 번째 호출은 기존 인스턴스를 반환
    expect(Tooltip.instances.size).toBe(1);
    tip1.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    document.body.innerHTML = '<span id="t7" data-tooltip="정리">텍스트</span>';
    var tip = new Tooltip('#t7');
    expect(typeof tip.destroy).toBe('function');
    tip.destroy();
  });

  it('placement 옵션을 적용할 수 있어야 함', () => {
    document.body.innerHTML = '<span id="t8" data-tooltip="위치">텍스트</span>';
    var tip = new Tooltip('#t8', { placement: 'bottom' });
    expect(tip.options.placement).toBe('bottom');
    tip.destroy?.();
  });
});

describe('Popover', () => {
  it('Popover 클래스가 존재해야 함', () => {
    expect(Popover).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<button id="p1">팝오버</button>';
    var pop = new Popover('#p1', { title: '제목', content: '<p>내용</p>' });
    expect(pop).toBeDefined();
    pop.destroy?.();
  });

  it('show() / hide() 메서드가 존재해야 함', () => {
    document.body.innerHTML = '<button id="p2">팝오버</button>';
    var pop = new Popover('#p2', { title: '제목', content: '내용' });
    expect(typeof pop.show).toBe('function');
    expect(typeof pop.hide).toBe('function');
    pop.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    document.body.innerHTML = '<button id="p3">팝오버</button>';
    var pop = new Popover('#p3', { title: '제목', content: '내용' });
    expect(typeof pop.destroy).toBe('function');
    pop.destroy();
  });

  it('show/hide/toggle 동작', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="p4">팝오버</button>';
    Popover.instances?.clear?.();
    var pop = new Popover('#p4', { title: '제목', content: '내용', trigger: 'manual' });
    pop.show();
    vi.advanceTimersByTime(10);
    // popover DOM이 생성되었는지 확인
    expect(pop.popover).not.toBeNull();
    pop.hide();
    vi.advanceTimersByTime(300);
    pop.toggle();
    vi.advanceTimersByTime(10);
    pop.toggle();
    vi.advanceTimersByTime(300);
    pop.destroy();
    vi.useRealTimers();
  });

  it('setContent / setTitle', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="p5">팝오버</button>';
    Popover.instances?.clear?.();
    var pop = new Popover('#p5', { title: '제목', content: '내용', trigger: 'manual' });
    pop.show();
    vi.advanceTimersByTime(10);
    pop.setContent('새 내용');
    expect(pop.options.content).toBe('새 내용');
    pop.setTitle('새 제목');
    expect(pop.options.title).toBe('새 제목');
    pop.destroy();
    vi.useRealTimers();
  });

  it('placement bottom/left/right', () => {
    vi.useFakeTimers();
    ['bottom', 'left', 'right'].forEach(p => {
      document.body.innerHTML = `<button id="pp-${p}">팝</button>`;
      Popover.instances?.clear?.();
      var pop = new Popover(`#pp-${p}`, { title: '제목', content: '내용', trigger: 'manual', placement: p });
      pop.show();
      vi.advanceTimersByTime(10);
      pop.destroy();
    });
    vi.useRealTimers();
  });

  it('click 트리거 및 외부 클릭 닫기', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="p6">팝</button>';
    Popover.instances?.clear?.();
    var pop = new Popover('#p6', { title: '제목', content: '내용', trigger: 'click', dismissible: true });
    document.querySelector('#p6').click();
    vi.advanceTimersByTime(10);
    // popover DOM이 생성되었는지 확인
    expect(pop.popover).not.toBeNull();
    // 외부 클릭
    document.body.click();
    vi.advanceTimersByTime(300);
    pop.destroy();
    vi.useRealTimers();
  });

  it('존재하지 않는 요소 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new Popover('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Tooltip 추가', () => {
  beforeEach(() => {
    Tooltip.instances?.clear?.();
  });

  it('click 트리거', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="tc1" data-tooltip="클릭">텍스트</span>';
    var tip = new Tooltip('#tc1', { trigger: 'click', delay: { show: 0, hide: 0 } });
    document.querySelector('#tc1').click();
    vi.advanceTimersByTime(10);
    tip.destroy();
    vi.useRealTimers();
  });

  it('focus 트리거', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<input id="tc2" data-tooltip="포커스">';
    var tip = new Tooltip('#tc2', { trigger: 'focus', delay: { show: 0, hide: 0 } });
    document.querySelector('#tc2').dispatchEvent(new Event('focus'));
    vi.advanceTimersByTime(10);
    document.querySelector('#tc2').dispatchEvent(new Event('blur'));
    vi.advanceTimersByTime(300);
    tip.destroy();
    vi.useRealTimers();
  });

  it('toggle()', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="tc3" data-tooltip="토글">텍스트</span>';
    var tip = new Tooltip('#tc3', { trigger: 'manual', delay: { show: 0, hide: 0 } });
    tip.toggle();
    vi.advanceTimersByTime(10);
    tip.toggle();
    vi.advanceTimersByTime(300);
    tip.destroy();
    vi.useRealTimers();
  });

  it('setContent()', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="tc4" data-tooltip="원본">텍스트</span>';
    var tip = new Tooltip('#tc4', { delay: { show: 0, hide: 0 } });
    tip.show();
    vi.advanceTimersByTime(10);
    tip.setContent('변경됨');
    expect(tip.options.content).toBe('변경됨');
    tip.destroy();
    vi.useRealTimers();
  });

  it('html 옵션', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="tc5">텍스트</span>';
    var tip = new Tooltip('#tc5', { content: '<b>HTML</b>', html: true, delay: { show: 0, hide: 0 } });
    tip.show();
    vi.advanceTimersByTime(10);
    tip.destroy();
    vi.useRealTimers();
  });

  it('placement bottom/left/right', () => {
    vi.useFakeTimers();
    ['bottom', 'left', 'right'].forEach(p => {
      document.body.innerHTML = `<span id="tp-${p}" data-tooltip="위치">텍스트</span>`;
      Tooltip.instances?.clear?.();
      var tip = new Tooltip(`#tp-${p}`, { placement: p, delay: { show: 0, hide: 0 } });
      tip.show();
      vi.advanceTimersByTime(10);
      tip.destroy();
    });
    vi.useRealTimers();
  });

  it('initAll()', () => {
    document.body.innerHTML = '<span data-tooltip="자동1">A</span><span title="자동2">B</span>';
    Tooltip.instances?.clear?.();
    Tooltip.initAll();
    expect(Tooltip.instances.size).toBe(2);
  });

  it('data-placement / data-trigger 속성 읽기', () => {
    document.body.innerHTML = '<span id="tc6" data-tooltip="내용" data-placement="right" data-trigger="click">텍스트</span>';
    var tip = new Tooltip('#tc6');
    expect(tip.options.placement).toBe('right');
    expect(tip.options.trigger).toBe('click');
    tip.destroy();
  });
});

describe('Tooltips 통합 모듈', () => {
  let mod;
  beforeEach(async () => {
    mod = await import('../../src/modules/tooltips.js');
    Tooltip.instances?.clear?.();
    Popover.instances?.clear?.();
  });

  it('create() — tooltip', () => {
    document.body.innerHTML = '<span id="tc7" data-tooltip="팩토리">텍스트</span>';
    var tip = mod.default.create('tooltip', '#tc7');
    expect(tip).toBeDefined();
    tip.destroy();
  });

  it('create() — popover', () => {
    document.body.innerHTML = '<button id="tc8">팝</button>';
    var pop = mod.default.create('popover', '#tc8', { title: 't', content: 'c' });
    expect(pop).toBeDefined();
    pop.destroy();
  });

  it('destroyAll()', () => {
    document.body.innerHTML = '<span id="tc9" data-tooltip="정리">텍스트</span><button id="tc10">팝</button>';
    new Tooltip('#tc9');
    new Popover('#tc10', { title: 't', content: 'c' });
    mod.default.destroyAll();
    expect(Tooltip.instances.size).toBe(0);
    expect(Popover.instances.size).toBe(0);
  });

  it('initAll()', () => {
    document.body.innerHTML = '<span data-tooltip="a">A</span><button data-popover-content="b">B</button>';
    Tooltip.instances?.clear?.();
    Popover.instances?.clear?.();
    mod.default.initAll();
    expect(Tooltip.instances.size).toBeGreaterThan(0);
  });

  it('create — unknown type', () => {
    expect(() => mod.default.create('unknown', '#x')).toThrow();
  });
});

describe('Tooltip 추가2', () => {
  beforeEach(() => { Tooltip.instances?.clear?.(); });

  it('hover mouseenter/mouseleave', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="th1" data-tooltip="호버">텍스트</span>';
    var tip = new Tooltip('#th1', { trigger: 'hover', delay: { show: 0, hide: 0 } });
    document.querySelector('#th1').dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(10);
    // rAF 내부에서 isVisible 설정되므로 tooltip DOM 생성 확인
    expect(tip.tooltip).not.toBeNull();
    document.querySelector('#th1').dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(500);
    tip.destroy();
    vi.useRealTimers();
  });

  it('animation false', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span id="th2" data-tooltip="내용">텍스트</span>';
    var tip = new Tooltip('#th2', { animation: false, delay: { show: 0, hide: 0 } });
    tip.show();
    vi.advanceTimersByTime(10);
    tip.destroy();
    vi.useRealTimers();
  });

  it('content 없을 때 title에서 읽기', () => {
    document.body.innerHTML = '<span id="th3" title="타이틀">텍스트</span>';
    var tip = new Tooltip('#th3');
    expect(tip.options.content).toBe('타이틀');
    tip.destroy();
  });
});

describe('Popover 추가2', () => {
  beforeEach(() => { Popover.instances?.clear?.(); });

  it('hover 트리거', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="ph1">팝</button>';
    var pop = new Popover('#ph1', { title: '제목', content: '내용', trigger: 'hover' });
    document.querySelector('#ph1').dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(10);
    // rAF 내부에서 isVisible 설정되므로 popover DOM 생성 확인
    expect(pop.popover).not.toBeNull();
    // popover에 mouseenter/mouseleave
    if (pop.popover) {
      pop.popover.dispatchEvent(new MouseEvent('mouseenter'));
      pop.popover.dispatchEvent(new MouseEvent('mouseleave'));
    }
    document.querySelector('#ph1').dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(500);
    pop.destroy();
    vi.useRealTimers();
  });

  it('focus 트리거', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<input id="ph2">';
    var pop = new Popover('#ph2', { title: '제목', content: '내용', trigger: 'focus' });
    document.querySelector('#ph2').dispatchEvent(new Event('focus'));
    vi.advanceTimersByTime(10);
    document.querySelector('#ph2').dispatchEvent(new Event('blur'));
    vi.advanceTimersByTime(500);
    pop.destroy();
    vi.useRealTimers();
  });

  it('닫기 버튼', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="ph3">팝</button>';
    var pop = new Popover('#ph3', { title: '제목', content: '내용', trigger: 'manual', dismissible: true });
    pop.show();
    vi.advanceTimersByTime(10);
    var closeBtn = pop.popover?.querySelector('.popover__close');
    if (closeBtn) closeBtn.click();
    vi.advanceTimersByTime(500);
    pop.destroy();
    vi.useRealTimers();
  });

  it('data 속성 읽기', () => {
    document.body.innerHTML = '<button id="ph4" data-popover-title="DT" data-popover-content="DC" data-placement="left" data-trigger="manual">팝</button>';
    var pop = new Popover('#ph4');
    expect(pop.options.title).toBe('DT');
    expect(pop.options.content).toBe('DC');
    expect(pop.options.placement).toBe('left');
    expect(pop.options.trigger).toBe('manual');
    pop.destroy();
  });

  it('animation false', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="ph5">팝</button>';
    var pop = new Popover('#ph5', { title: '제목', content: '내용', trigger: 'manual', animation: false });
    pop.show();
    vi.advanceTimersByTime(10);
    pop.destroy();
    vi.useRealTimers();
  });

  it('title 없는 popover', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="ph6">팝</button>';
    var pop = new Popover('#ph6', { content: '내용만', trigger: 'manual' });
    pop.show();
    vi.advanceTimersByTime(10);
    expect(pop.popover.querySelector('.popover__header')).toBeNull();
    pop.destroy();
    vi.useRealTimers();
  });

  it('중복 인스턴스 방지', () => {
    document.body.innerHTML = '<button id="ph7">팝</button>';
    var pop1 = new Popover('#ph7', { title: 't', content: 'c' });
    var pop2 = new Popover('#ph7', { title: 't', content: 'c' });
    expect(Popover.instances.size).toBe(1);
    pop1.destroy();
  });

  it('다른 팝오버 닫기', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button id="pa1">A</button><button id="pa2">B</button>';
    var pop1 = new Popover('#pa1', { title: 't', content: 'c', trigger: 'manual' });
    var pop2 = new Popover('#pa2', { title: 't', content: 'c', trigger: 'manual' });
    pop1.show();
    vi.advanceTimersByTime(10);
    pop2.show();
    vi.advanceTimersByTime(10);
    pop1.destroy();
    pop2.destroy();
    vi.useRealTimers();
  });
});
