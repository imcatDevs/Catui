/**
 * Dropdown Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Dropdown;

beforeEach(async () => {
  const module = await import('../../src/modules/dropdown.js');
  Dropdown = module.Dropdown || module.default?.Dropdown || module.default;
  document.body.innerHTML = `
    <button id="trigger">열기</button>
  `;
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Dropdown', () => {
  it('Dropdown 클래스가 존재해야 함', () => {
    expect(Dropdown).toBeDefined();
    expect(typeof Dropdown).toBe('function');
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const dropdown = new Dropdown('#trigger', {
      items: [
        { label: '편집', onClick: vi.fn() },
        { label: '삭제', onClick: vi.fn() }
      ]
    });
    expect(dropdown).toBeDefined();
    dropdown.destroy?.();
  });

  it('항목이 없어도 생성되어야 함', () => {
    const dropdown = new Dropdown('#trigger', { items: [] });
    expect(dropdown).toBeDefined();
    dropdown.destroy?.();
  });

  it('destroy() 메서드가 존재해야 함', () => {
    const dropdown = new Dropdown('#trigger', { items: [] });
    expect(typeof dropdown.destroy).toBe('function');
    dropdown.destroy();
  });

  it('show/hide 메서드가 존재해야 함', () => {
    const dropdown = new Dropdown('#trigger', { items: [] });
    expect(typeof dropdown.show).toBe('function');
    expect(typeof dropdown.hide).toBe('function');
    dropdown.destroy?.();
  });

  it('존재하지 않는 트리거는 에러 로그', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dropdown = new Dropdown('#nonexistent', { items: [] });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('show/hide/toggle 동작', () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const onHide = vi.fn();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: '편집', action: vi.fn() }],
      animation: false,
      onShow,
      onHide
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    expect(dropdown.isOpen).toBe(true);
    expect(onShow).toHaveBeenCalled();
    dropdown.show(); // 중복 호출 무시
    dropdown.hide();
    expect(dropdown.isOpen).toBe(false);
    expect(onHide).toHaveBeenCalled();
    dropdown.hide(); // 중복 호출 무시
    dropdown.toggle();
    vi.advanceTimersByTime(10);
    expect(dropdown.isOpen).toBe(true);
    dropdown.toggle();
    expect(dropdown.isOpen).toBe(false);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('아이템 렌더링 — divider, header, disabled, active, danger, icon', () => {
    const dropdown = new Dropdown('#trigger', {
      items: [
        { text: '일반', action: vi.fn() },
        { divider: true },
        { header: '섹션' },
        { text: '비활성', disabled: true },
        { text: '활성', active: true, action: vi.fn() },
        { text: '위험', danger: true, icon: 'delete', action: vi.fn() }
      ],
      animation: false
    });
    expect(dropdown.menu.querySelector('.dropdown__divider')).not.toBeNull();
    expect(dropdown.menu.querySelector('.dropdown__header')).not.toBeNull();
    expect(dropdown.menu.querySelector('.dropdown__item--disabled')).not.toBeNull();
    expect(dropdown.menu.querySelector('.dropdown__item--active')).not.toBeNull();
    expect(dropdown.menu.querySelector('.dropdown__item--danger')).not.toBeNull();
    expect(dropdown.menu.querySelector('.dropdown__item-icon')).not.toBeNull();
    dropdown.destroy();
  });

  it('아이템 클릭 — action 및 onSelect 콜백', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const onSelect = vi.fn();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: '클릭', action }],
      animation: false,
      onSelect,
      closeOnClick: true
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    const item = dropdown.menu.querySelector('.dropdown__item');
    item.click();
    expect(action).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalled();
    expect(dropdown.isOpen).toBe(false);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('트리거 클릭으로 토글', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false
    });
    document.querySelector('#trigger').click();
    vi.advanceTimersByTime(10);
    expect(dropdown.isOpen).toBe(true);
    document.querySelector('#trigger').click();
    expect(dropdown.isOpen).toBe(false);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('키보드 네비게이션 — ArrowDown/ArrowUp/Home/End/Escape/Tab', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [
        { text: 'A', action: vi.fn() },
        { text: 'B', action: vi.fn() },
        { text: 'C', action: vi.fn() }
      ],
      animation: false,
      keyboard: true
    });
    dropdown.show();
    vi.advanceTimersByTime(10);

    // ArrowDown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(dropdown.currentIndex).toBe(1);
    // ArrowUp
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(dropdown.currentIndex).toBe(0);
    // ArrowUp 래핑
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(dropdown.currentIndex).toBe(2);
    // Home
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(dropdown.currentIndex).toBe(0);
    // End
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(dropdown.currentIndex).toBe(2);
    // Tab — 닫기
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(dropdown.isOpen).toBe(false);

    dropdown.show();
    vi.advanceTimersByTime(10);
    // Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(dropdown.isOpen).toBe(false);

    dropdown.destroy();
    vi.useRealTimers();
  });

  it('외부 클릭 시 닫기', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      closeOnOutside: true
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    document.body.click();
    expect(dropdown.isOpen).toBe(false);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('updateItems() — 아이템 교체', () => {
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'Old', action: vi.fn() }],
      animation: false
    });
    dropdown.updateItems([{ text: 'New', action: vi.fn() }]);
    expect(dropdown.menu.querySelector('.dropdown__item-text').textContent).toBe('New');
    dropdown.destroy();
  });

  it('hover 모드 — mouseenter로 열기', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      openOnHover: true,
      hoverDelay: 100
    });
    const trigger = document.querySelector('#trigger');
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(dropdown.isOpen).toBe(true);
    // 직접 hide로 닫기 (mouseleave는 getBoundingClientRect가 jsdom에서 0 반환하므로 skip)
    dropdown.hide();
    expect(dropdown.isOpen).toBe(false);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('hover 모드 — mouseleave 핸들러 호출', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      openOnHover: true,
      hoverDelay: 100
    });
    // 열기
    dropdown.show();
    vi.advanceTimersByTime(10);
    // mouseleave — clientX/clientY를 범위 밖으로 설정
    const trigger = document.querySelector('#trigger');
    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, clientX: -999, clientY: -999 }));
    vi.advanceTimersByTime(200);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('position top 옵션', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      position: 'top'
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('position left 옵션', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      position: 'left'
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('position right 옵션', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      position: 'right'
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('align center 옵션', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      align: 'center'
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('align end 옵션', () => {
    vi.useFakeTimers();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      align: 'end'
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    vi.useRealTimers();
  });

  it('destroy — onDestroy 콜백, 열린 상태에서 destroy', () => {
    vi.useFakeTimers();
    const onDestroy = vi.fn();
    const dropdown = new Dropdown('#trigger', {
      items: [{ text: 'A', action: vi.fn() }],
      animation: false,
      openOnHover: true,
      onDestroy
    });
    dropdown.show();
    vi.advanceTimersByTime(10);
    dropdown.destroy();
    expect(onDestroy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
