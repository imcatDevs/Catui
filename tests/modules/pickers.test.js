/**
 * Pickers Module 테스트
 * DatePicker, TimePicker, ColorPicker, Countdown, DDay
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let DatePicker, TimePicker, ColorPicker, Countdown, DDay;

beforeEach(async () => {
  const mod = await import('../../src/modules/pickers.js');
  DatePicker = mod.DatePicker || mod.default?.DatePicker;
  TimePicker = mod.TimePicker || mod.default?.TimePicker;
  ColorPicker = mod.ColorPicker || mod.default?.ColorPicker;
  Countdown = mod.Countdown || mod.default?.Countdown;
  DDay = mod.DDay || mod.default?.DDay;
  document.body.innerHTML = '<div id="picker-wrap"><input id="picker-input" type="text"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('DatePicker', () => {
  it('DatePicker 클래스가 존재해야 함', () => {
    expect(DatePicker).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var dp = new DatePicker('#picker-input');
    expect(dp).toBeDefined();
    dp.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = DatePicker.defaults();
    expect(d.format).toBe('YYYY-MM-DD');
    expect(d.locale).toBe('ko');
  });

  it('존재하지 않는 요소로는 생성되지 않아야 함', () => {
    var dp = new DatePicker('#nonexistent');
    expect(dp.element).toBeFalsy();
  });

  it('destroy()로 정리되어야 함', () => {
    var dp = new DatePicker('#picker-input');
    if (dp && typeof dp.destroy === 'function') {
      dp.destroy();
    }
  });
});

describe('TimePicker', () => {
  it('TimePicker 클래스가 존재해야 함', () => {
    expect(TimePicker).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var tp = new TimePicker('#picker-input');
    expect(tp).toBeDefined();
    tp.destroy?.();
  });
});

describe('ColorPicker', () => {
  it('ColorPicker 클래스가 존재해야 함', () => {
    expect(ColorPicker).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var cp = new ColorPicker('#picker-input', { value: '#ff0000' });
    expect(cp).toBeDefined();
    cp.destroy?.();
  });
});

describe('Countdown', () => {
  it('Countdown 클래스가 존재해야 함', () => {
    expect(Countdown).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<div id="cd-container"></div>';
    var future = new Date(Date.now() + 86400000);
    var cd = new Countdown('#cd-container', { targetDate: future.toISOString() });
    expect(cd).toBeDefined();
    cd.destroy?.();
  });
});

describe('DDay', () => {
  it('DDay 클래스가 존재해야 함', () => {
    expect(DDay).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<div id="dday-container"></div>';
    var future = new Date(Date.now() + 86400000 * 30);
    var dd = new DDay('#dday-container', { targetDate: future.toISOString(), title: '출시일' });
    expect(dd).toBeDefined();
    dd.destroy?.();
  });
});

describe('DatePicker 추가', () => {
  it('setValue / getValue', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.setValue('2025-06-15');
    expect(dp.getValue()).toBe('2025-06-15');
    dp.destroy?.();
  });

  it('open / close', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    expect(dp.isOpen).toBe(true);
    dp.close();
    expect(dp.isOpen).toBe(false);
    dp.destroy?.();
  });

  it('onChange 콜백', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    const onChange = vi.fn();
    var dp = new DatePicker('#pi', { onChange });
    dp.setValue('2025-01-01');
    expect(onChange).toHaveBeenCalledWith('2025-01-01');
    dp.destroy?.();
  });
});

describe('TimePicker 추가', () => {
  it('setValue / getValue', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var tp = new TimePicker('#pi');
    tp.setValue('14:30');
    expect(tp.getValue()).toBe('14:30');
    tp.destroy?.();
  });

  it('open / close', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var tp = new TimePicker('#pi');
    tp.open();
    expect(tp.isOpen).toBe(true);
    tp.close();
    expect(tp.isOpen).toBe(false);
    tp.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var tp = new TimePicker('#nonexistent');
    expect(tp.element).toBeFalsy();
  });
});

describe('ColorPicker 추가', () => {
  it('setValue / getValue', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var cp = new ColorPicker('#pi');
    cp.setValue('#00ff00');
    expect(cp.getValue()).toBe('#00ff00');
    cp.destroy?.();
  });

  it('open / close / toggle', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var cp = new ColorPicker('#pi');
    cp.open();
    expect(cp.isOpen).toBe(true);
    cp.close();
    expect(cp.isOpen).toBe(false);
    cp.toggle();
    expect(cp.isOpen).toBe(true);
    cp.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var cp = new ColorPicker('#nonexistent');
    expect(cp.element).toBeFalsy();
  });
});

describe('Countdown 추가', () => {
  it('존재하지 않는 컨테이너', () => {
    var cd = new Countdown('#nonexistent');
    expect(cd.container).toBeFalsy();
  });

  it('과거 날짜', () => {
    document.body.innerHTML = '<div id="cd2"></div>';
    var past = new Date(Date.now() - 86400000);
    var cd = new Countdown('#cd2', { targetDate: past.toISOString() });
    cd.destroy?.();
  });
});

describe('DatePicker 추가2', () => {
  it('날짜 클릭으로 선택', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var day = dp.picker.querySelector('.datepicker__day:not(.datepicker__day--empty)');
    if (day) day.click();
    expect(dp.getValue()).not.toBe('');
    dp.destroy?.();
  });

  it('prev / next 네비게이션', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var prevBtn = dp.picker.querySelector('[data-action="prev"]');
    if (prevBtn) prevBtn.click();
    var nextBtn = dp.picker.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.click();
    dp.destroy?.();
  });

  it('today 버튼', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var todayBtn = dp.picker.querySelector('[data-action="today"]');
    if (todayBtn) todayBtn.click();
    expect(dp.isOpen).toBe(false);
    dp.destroy?.();
  });

  it('years 뷰 — showYears → year 선택 → months 뷰 → month 선택', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    // showYears
    var yearTitle = dp.picker.querySelector('[data-action="showYears"]');
    if (yearTitle) yearTitle.click();
    // year 선택
    var yearItem = dp.picker.querySelector('.datepicker__year-item:not(.datepicker__year-item--other)');
    if (yearItem) yearItem.click();
    // month 선택
    var monthItem = dp.picker.querySelector('.datepicker__month-item');
    if (monthItem) monthItem.click();
    dp.destroy?.();
  });

  it('months 뷰 — showMonths', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var monthTitle = dp.picker.querySelector('[data-action="showMonths"]');
    if (monthTitle) monthTitle.click();
    dp.destroy?.();
  });

  it('prevDecade / nextDecade', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var yearTitle = dp.picker.querySelector('[data-action="showYears"]');
    if (yearTitle) yearTitle.click();
    var prevDecade = dp.picker.querySelector('[data-action="prevDecade"]');
    if (prevDecade) prevDecade.click();
    var nextDecade = dp.picker.querySelector('[data-action="nextDecade"]');
    if (nextDecade) nextDecade.click();
    dp.destroy?.();
  });

  it('prevYear / nextYear', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    var monthTitle = dp.picker.querySelector('[data-action="showMonths"]');
    if (monthTitle) monthTitle.click();
    var prevYear = dp.picker.querySelector('[data-action="prevYear"]');
    if (prevYear) prevYear.click();
    var nextYear = dp.picker.querySelector('[data-action="nextYear"]');
    if (nextYear) nextYear.click();
    dp.destroy?.();
  });

  it('외부 클릭으로 닫기', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var dp = new DatePicker('#pi');
    dp.open();
    expect(dp.isOpen).toBe(true);
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dp.isOpen).toBe(false);
    dp.destroy?.();
  });

  it('initial value', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text" value="2025-06-15"></div>';
    var dp = new DatePicker('#pi');
    expect(dp.getValue()).toBe('2025-06-15');
    dp.destroy?.();
  });
});

describe('TimePicker 추가2', () => {
  it('시간 옵션 클릭', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var tp = new TimePicker('#pi');
    tp.open();
    var option = tp.picker.querySelector('.timepicker__option');
    if (option) option.click();
    expect(tp.getValue()).not.toBe('');
    tp.destroy?.();
  });

  it('onChange 콜백', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    const onChange = vi.fn();
    var tp = new TimePicker('#pi', { onChange });
    tp.setValue('10:00');
    expect(onChange).toHaveBeenCalledWith('10:00');
    tp.destroy?.();
  });

  it('defaults()', () => {
    var d = TimePicker.defaults();
    expect(d.step).toBe(15);
  });

  it('외부 클릭으로 닫기', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var tp = new TimePicker('#pi');
    tp.open();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(tp.isOpen).toBe(false);
    tp.destroy?.();
  });
});

describe('ColorPicker 추가2', () => {
  it('프리셋 클릭', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var cp = new ColorPicker('#pi');
    cp.open();
    var preset = cp.picker.querySelector('.colorpicker__preset');
    if (preset) preset.click();
    expect(cp.getValue()).not.toBe('');
    cp.destroy?.();
  });

  it('네이티브 input 변경', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var cp = new ColorPicker('#pi');
    cp.nativeInput.value = '#123456';
    cp.nativeInput.dispatchEvent(new Event('input'));
    expect(cp.getValue()).toBe('#123456');
    cp.destroy?.();
  });

  it('onChange 콜백', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    const onChange = vi.fn();
    var cp = new ColorPicker('#pi', { onChange });
    cp.setValue('#abcdef');
    expect(onChange).toHaveBeenCalledWith('#abcdef');
    cp.destroy?.();
  });

  it('defaults()', () => {
    var d = ColorPicker.defaults();
    expect(d.presetColors.length).toBeGreaterThan(0);
  });

  it('외부 클릭으로 닫기', () => {
    document.body.innerHTML = '<div id="pw"><input id="pi" type="text"></div>';
    var cp = new ColorPicker('#pi');
    cp.open();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(cp.isOpen).toBe(false);
    cp.destroy?.();
  });
});

describe('Countdown 추가2', () => {
  it('onTick 콜백', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="cd"></div>';
    const onTick = vi.fn();
    var future = new Date(Date.now() + 86400000);
    var cd = new Countdown('#cd', { targetDate: future.toISOString(), onTick });
    vi.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalled();
    cd.destroy?.();
    vi.useRealTimers();
  });

  it('setTarget', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="cd"></div>';
    var future = new Date(Date.now() + 86400000);
    var cd = new Countdown('#cd', { targetDate: future.toISOString() });
    var newTarget = new Date(Date.now() + 172800000);
    cd.setTarget(newTarget.toISOString());
    cd.destroy?.();
    vi.useRealTimers();
  });

  it('defaults()', () => {
    var d = Countdown.defaults();
    expect(d.showSeconds).toBe(true);
    expect(d.separator).toBe(':');
  });

  it('showDays false — 시간에 일수 추가', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="cd"></div>';
    var future = new Date(Date.now() + 86400000 * 2);
    var cd = new Countdown('#cd', { targetDate: future.toISOString(), showDays: false });
    vi.advanceTimersByTime(1100);
    cd.destroy?.();
    vi.useRealTimers();
  });

  it('showLabels false', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="cd"></div>';
    var future = new Date(Date.now() + 86400000);
    var cd = new Countdown('#cd', { targetDate: future.toISOString(), showLabels: false });
    expect(cd.element.querySelector('.countdown__label')).toBeNull();
    cd.destroy?.();
    vi.useRealTimers();
  });
});

describe('DDay 추가', () => {
  it('setTarget / getDays', () => {
    document.body.innerHTML = '<div id="dd"></div>';
    var future = new Date(Date.now() + 86400000 * 10);
    var dd = new DDay('#dd', { targetDate: future.toISOString() });
    expect(dd.getDays()).toBeGreaterThan(0);
    var newTarget = new Date(Date.now() + 86400000 * 20);
    dd.setTarget(newTarget.toISOString(), '새 이벤트');
    expect(dd.getDays()).toBeGreaterThan(0);
    dd.destroy?.();
  });

  it('showPastDays false', () => {
    document.body.innerHTML = '<div id="dd"></div>';
    var past = new Date(Date.now() - 86400000 * 5);
    var dd = new DDay('#dd', { targetDate: past.toISOString(), showPastDays: false });
    expect(dd.element.innerHTML).toContain('지남');
    dd.destroy?.();
  });

  it('D-Day 당일', () => {
    document.body.innerHTML = '<div id="dd"></div>';
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var dd = new DDay('#dd', { targetDate: today.toISOString() });
    expect(dd.element.innerHTML).toContain('D-Day');
    dd.destroy?.();
  });

  it('onChange 콜백', () => {
    document.body.innerHTML = '<div id="dd"></div>';
    const onChange = vi.fn();
    var future = new Date(Date.now() + 86400000);
    var dd = new DDay('#dd', { targetDate: future.toISOString(), onChange });
    expect(onChange).toHaveBeenCalled();
    dd.destroy?.();
  });

  it('defaults()', () => {
    var d = DDay.defaults();
    expect(d.title).toBe('D-Day');
    expect(d.showPastDays).toBe(true);
  });

  it('존재하지 않는 컨테이너', () => {
    var dd = new DDay('#nonexistent');
    expect(dd.element).toBeFalsy();
  });
});
