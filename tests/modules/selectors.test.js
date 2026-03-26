/**
 * Selectors Module 테스트
 * Autocomplete, MultiSelect, RangeSlider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Autocomplete, MultiSelect, RangeSlider;

beforeEach(async () => {
  const mod = await import('../../src/modules/selectors.js');
  Autocomplete = mod.Autocomplete || mod.default?.Autocomplete;
  MultiSelect = mod.MultiSelect || mod.default?.MultiSelect;
  RangeSlider = mod.RangeSlider || mod.default?.RangeSlider;
  document.body.innerHTML = '<div id="sel-wrap"><input id="sel-input" type="text"><select id="sel-select"><option value="1">One</option><option value="2">Two</option></select><div id="slider-container"></div></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Autocomplete', () => {
  it('Autocomplete 클래스가 존재해야 함', () => {
    expect(Autocomplete).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나', '딸기'] });
    expect(ac).toBeDefined();
    ac.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Autocomplete.defaults();
    expect(d.minLength).toBe(1);
    expect(d.delay).toBe(300);
    expect(d.maxResults).toBe(10);
  });

  it('존재하지 않는 요소로는 생성되지 않아야 함', () => {
    var ac = new Autocomplete('#nonexistent');
    expect(ac.element).toBeFalsy();
  });

  it('destroy()로 정리되어야 함', () => {
    var ac = new Autocomplete('#sel-input', { source: ['a', 'b'] });
    if (ac && typeof ac.destroy === 'function') {
      ac.destroy();
    }
  });
});

describe('MultiSelect', () => {
  it('MultiSelect 클래스가 존재해야 함', () => {
    expect(MultiSelect).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ms = new MultiSelect('#sel-select');
    expect(ms).toBeDefined();
    ms.destroy?.();
  });
});

describe('RangeSlider', () => {
  it('RangeSlider 클래스가 존재해야 함', () => {
    expect(RangeSlider).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50 });
    expect(rs).toBeDefined();
    rs.destroy?.();
  });

  it('range 모드 getValue / setValue', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: [20, 80], range: true });
    expect(rs.getValue()).toEqual([20, 80]);
    rs.setValue([10, 90]);
    expect(rs.getValue()).toEqual([10, 90]);
    rs.destroy?.();
  });

  it('single 모드 getValue / setValue', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false });
    expect(rs.getValue()).toBe(50);
    rs.setValue(75);
    expect(rs.getValue()).toBe(75);
    rs.destroy?.();
  });

  it('showTooltip false / showLabels false', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false, showTooltip: false, showLabels: false });
    rs.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: [20, 80], range: true, onChange });
    rs.setValue([30, 70]);
    rs.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var rs = new RangeSlider('#nonexistent');
    expect(rs.element).toBeFalsy();
  });
});

describe('Autocomplete 추가', () => {
  it('setValue / getValue', () => {
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나'] });
    ac.setValue('사과');
    expect(ac.getValue()).toBe('사과');
    ac.destroy?.();
  });

  it('clear()', () => {
    var ac = new Autocomplete('#sel-input', { source: ['사과'] });
    ac.setValue('사과');
    ac.clear();
    expect(ac.getValue()).toBe('');
    ac.destroy?.();
  });

  it('입력으로 검색 트리거', async () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나', '딸기'], delay: 100 });
    ac.element.value = '사과';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(200);
    expect(ac.isOpen).toBe(true);
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('minLength 미만 입력 시 닫힘', () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', { source: ['사과'], minLength: 2 });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(400);
    expect(ac.isOpen).toBe(false);
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('async source 함수', async () => {
    vi.useFakeTimers();
    const source = vi.fn().mockResolvedValue(['결과1', '결과2']);
    var ac = new Autocomplete('#sel-input', { source, delay: 50 });
    ac.element.value = '검색';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    await vi.runAllTimersAsync();
    expect(source).toHaveBeenCalled();
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('키보드 네비게이션 (ArrowDown, Enter, Escape)', () => {
    vi.useFakeTimers();
    // jsdom에서 scrollIntoView 미구현
    Element.prototype.scrollIntoView = vi.fn();
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나'] });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(400);
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    ac.destroy?.();
    vi.useRealTimers();
  });
});

describe('MultiSelect 추가', () => {
  it('getValue / setValue', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }],
      selected: ['1']
    });
    expect(ms.getValue()).toEqual(['1']);
    ms.setValue(['2']);
    expect(ms.getValue()).toEqual(['2']);
    ms.destroy?.();
  });

  it('clear()', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }],
      selected: ['1']
    });
    ms.clear();
    expect(ms.getValue()).toEqual([]);
    ms.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var ms = new MultiSelect('#nonexistent');
    expect(ms.element).toBeFalsy();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }],
      onChange
    });
    ms.setValue(['1']);
    expect(onChange).toHaveBeenCalled();
    ms.destroy?.();
  });

  it('태그 제거 버튼 클릭', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }],
      selected: ['1', '2']
    });
    var removeBtn = ms.tagsContainer.querySelector('.multiselect__tag-remove');
    if (removeBtn) removeBtn.click();
    expect(ms.getValue().length).toBe(1);
    ms.destroy?.();
  });

  it('검색 입력', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }],
      searchable: true
    });
    ms.searchInput.value = 'One';
    ms.searchInput.dispatchEvent(new Event('input'));
    ms.destroy?.();
  });

  it('Backspace로 마지막 태그 제거', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }],
      selected: ['1']
    });
    ms.searchInput.value = '';
    ms.searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    expect(ms.getValue().length).toBe(0);
    ms.destroy?.();
  });

  it('Escape로 드롭다운 닫기', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }]
    });
    ms.tagsContainer.click();
    ms.searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(ms.isOpen).toBe(false);
    ms.destroy?.();
  });

  it('allowCreate', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [],
      allowCreate: true
    });
    ms.searchInput.value = '새항목';
    ms.searchInput.dispatchEvent(new Event('input'));
    var createOpt = ms.dropdown.querySelector('.multiselect__option--create');
    if (createOpt) createOpt.click();
    ms.destroy?.();
  });

  it('maxItems 제한', () => {
    var ms = new MultiSelect('#sel-select', {
      options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }, { value: '3', label: 'Three' }],
      maxItems: 1
    });
    var opt = ms.dropdown.querySelector('.multiselect__option');
    if (opt) opt.click();
    expect(ms.getValue().length).toBe(1);
    var opt2 = ms.dropdown.querySelector('.multiselect__option');
    if (opt2) opt2.click();
    expect(ms.getValue().length).toBe(1);
    ms.destroy?.();
  });
});

describe('Autocomplete 추가2', () => {
  it('항목 클릭으로 선택', () => {
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = vi.fn();
    const onSelect = vi.fn();
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나'], onSelect, delay: 50 });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    var item = ac.dropdown.querySelector('.autocomplete__item');
    if (item) item.click();
    expect(onSelect).toHaveBeenCalled();
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('결과 없음 표시', () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', { source: ['사과'], delay: 50 });
    ac.element.value = 'xyz';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    expect(ac.dropdown.querySelector('.autocomplete__no-results')).not.toBeNull();
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('renderItem 커스텀', () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', {
      source: [{ label: '사과', value: 'apple' }],
      renderItem: (item, hl) => `<b>${hl}</b>`,
      delay: 50
    });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('focus로 드롭다운 열기', () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', { source: ['사과'], delay: 50 });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    ac.element.dispatchEvent(new Event('focus'));
    expect(ac.isOpen).toBe(true);
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('ArrowUp 키보드', () => {
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = vi.fn();
    var ac = new Autocomplete('#sel-input', { source: ['사과', '바나나'], delay: 50 });
    ac.element.value = '과';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    ac.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    ac.destroy?.();
    vi.useRealTimers();
  });

  it('외부 클릭으로 닫기', () => {
    vi.useFakeTimers();
    var ac = new Autocomplete('#sel-input', { source: ['사과'], delay: 50 });
    ac.element.value = '사';
    ac.element.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(100);
    document.body.click();
    expect(ac.isOpen).toBe(false);
    ac.destroy?.();
    vi.useRealTimers();
  });
});

describe('RangeSlider 추가2', () => {
  it('트랙 클릭 (range)', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: [20, 80], range: true });
    rs.track.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    rs.track.dispatchEvent(new MouseEvent('click', { clientX: 50 }));
    rs.destroy?.();
  });

  it('트랙 클릭 (single)', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false });
    rs.track.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    rs.track.dispatchEvent(new MouseEvent('click', { clientX: 30 }));
    rs.destroy?.();
  });

  it('핸들 드래그', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false });
    var handle = rs.element.querySelector('[data-handle="single"]');
    rs.track.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    handle.dispatchEvent(new MouseEvent('mousedown', { preventDefault: vi.fn() }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 70 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    rs.destroy?.();
  });

  it('onDragEnd 콜백', () => {
    const onDragEnd = vi.fn();
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false, onDragEnd });
    var handle = rs.element.querySelector('[data-handle="single"]');
    rs.track.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, width: 100 });
    handle.dispatchEvent(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(onDragEnd).toHaveBeenCalled();
    rs.destroy?.();
  });

  it('formatValue', () => {
    var rs = new RangeSlider('#slider-container', {
      min: 0, max: 100, value: 50, range: false,
      formatValue: (v) => v + '%'
    });
    rs.destroy?.();
  });

  it('step 옵션', () => {
    var rs = new RangeSlider('#slider-container', { min: 0, max: 100, value: 50, range: false, step: 10 });
    rs.setValue(55);
    rs.destroy?.();
  });
});
