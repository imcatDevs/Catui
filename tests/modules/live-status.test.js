/**
 * Live Status Module 테스트
 * OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus;

beforeEach(async () => {
  const mod = await import('../../src/modules/live-status.js');
  OnlineStatus = mod.OnlineStatus || mod.default?.OnlineStatus;
  TypingIndicator = mod.TypingIndicator || mod.default?.TypingIndicator;
  ActivityStatus = mod.ActivityStatus || mod.default?.ActivityStatus;
  LiveCounter = mod.LiveCounter || mod.default?.LiveCounter;
  ConnectionStatus = mod.ConnectionStatus || mod.default?.ConnectionStatus;
  document.body.innerHTML = '<div id="ls-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('OnlineStatus', () => {
  it('OnlineStatus 클래스가 존재해야 함', () => {
    expect(OnlineStatus).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online', name: '홍길동' });
    expect(os).toBeDefined();
    os.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online' });
    if (os && typeof os.destroy === 'function') {
      os.destroy();
    }
  });
});

describe('TypingIndicator', () => {
  it('TypingIndicator 클래스가 존재해야 함', () => {
    expect(TypingIndicator).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ti = new TypingIndicator('#ls-container');
    expect(ti).toBeDefined();
    ti.destroy?.();
  });
});

describe('ActivityStatus', () => {
  it('ActivityStatus 클래스가 존재해야 함', () => {
    expect(ActivityStatus).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var as = new ActivityStatus('#ls-container', { activity: '작업 중', icon: 'edit' });
    expect(as).toBeDefined();
    as.destroy?.();
  });
});

describe('LiveCounter', () => {
  it('LiveCounter 클래스가 존재해야 함', () => {
    expect(LiveCounter).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var lc = new LiveCounter('#ls-container', { value: 42 });
    expect(lc).toBeDefined();
    lc.destroy?.();
  });
});

describe('ConnectionStatus', () => {
  it('ConnectionStatus 클래스가 존재해야 함', () => {
    expect(ConnectionStatus).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var cs = new ConnectionStatus('#ls-container');
    expect(cs).toBeDefined();
    cs.destroy?.();
  });
});

describe('OnlineStatus 추가', () => {
  it('setStatus / getStatus', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online' });
    expect(os.getStatus()).toBe('online');
    os.setStatus('away');
    expect(os.getStatus()).toBe('away');
    os.destroy?.();
  });

  it('showLabel 옵션', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online', showLabel: true });
    expect(document.querySelector('.online-status__label')).not.toBeNull();
    os.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var os = new OnlineStatus('#ls-container', { status: 'online', onChange });
    os.setStatus('offline');
    expect(onChange).toHaveBeenCalledWith('offline');
    os.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new OnlineStatus('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('pulse 옵션', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online', pulse: true });
    expect(os.indicator.classList.contains('online-status--pulse')).toBe(true);
    os.setStatus('busy');
    expect(os.indicator.classList.contains('online-status--pulse')).toBe(false);
    os.destroy?.();
  });
});

describe('TypingIndicator 추가', () => {
  it('addUser / removeUser', () => {
    var ti = new TypingIndicator('#ls-container');
    ti.addUser('홍길동');
    expect(ti._users).toContain('홍길동');
    ti.removeUser('홍길동');
    expect(ti._users).not.toContain('홍길동');
    ti.destroy?.();
  });

  it('setUsers / clear', () => {
    var ti = new TypingIndicator('#ls-container');
    ti.setUsers(['A', 'B', 'C']);
    expect(ti._users.length).toBe(3);
    ti.clear();
    expect(ti._users.length).toBe(0);
    ti.destroy?.();
  });

  it('여러 사용자 표시', () => {
    var ti = new TypingIndicator('#ls-container', { maxDisplay: 2 });
    ti.setUsers(['A', 'B', 'C', 'D']);
    ti.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new TypingIndicator('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('hideAfter 옵션', () => {
    vi.useFakeTimers();
    var ti = new TypingIndicator('#ls-container', { hideAfter: 3000 });
    ti.addUser('테스트');
    vi.advanceTimersByTime(3100);
    expect(ti._users.length).toBe(0);
    ti.destroy?.();
    vi.useRealTimers();
  });
});

describe('LiveCounter 추가', () => {
  it('setValue / getValue', () => {
    var lc = new LiveCounter('#ls-container', { value: 10 });
    if (typeof lc.setValue === 'function') {
      lc.setValue(20);
      expect(lc.getValue()).toBe(20);
    }
    lc.destroy?.();
  });
});

describe('ActivityStatus 추가', () => {
  it('setLastActivity / updateNow', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(), updateInterval: 0 });
    if (typeof as.setLastActivity === 'function') {
      as.setLastActivity(new Date(Date.now() - 120000));
    }
    if (typeof as.updateNow === 'function') {
      as.updateNow();
    }
    as.destroy?.();
  });

  it('relative 포맷 — 방금 전', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(), format: 'relative', updateInterval: 0 });
    expect(as.container.textContent).toContain('방금 전');
    as.destroy?.();
  });

  it('relative 포맷 — 분 전', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(Date.now() - 300000), format: 'relative', updateInterval: 0 });
    expect(as.container.textContent).toContain('분 전');
    as.destroy?.();
  });

  it('relative 포맷 — 시간 전', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(Date.now() - 7200000), format: 'relative', updateInterval: 0 });
    expect(as.container.textContent).toContain('시간 전');
    as.destroy?.();
  });

  it('relative 포맷 — 일 전', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(Date.now() - 172800000), format: 'relative', updateInterval: 0 });
    expect(as.container.textContent).toContain('일 전');
    as.destroy?.();
  });

  it('absolute 포맷', () => {
    var as = new ActivityStatus('#ls-container', { lastActivity: new Date(), format: 'absolute', updateInterval: 0 });
    expect(as.container.textContent.length).toBeGreaterThan(0);
    as.destroy?.();
  });

  it('lastActivity null', () => {
    var as = new ActivityStatus('#ls-container', { updateInterval: 0 });
    expect(as.container.textContent).toBe('');
    as.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ActivityStatus('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('LiveCounter 추가2', () => {
  it('increment / decrement', () => {
    var lc = new LiveCounter('#ls-container', { value: 10, duration: 0 });
    lc.increment(5);
    expect(lc.getValue()).toBe(15);
    lc.decrement(3);
    expect(lc.getValue()).toBe(12);
    lc.destroy?.();
  });

  it('withAnimation false', () => {
    const onChange = vi.fn();
    var lc = new LiveCounter('#ls-container', { value: 10, onChange });
    lc.setValue(20, false);
    expect(lc.getValue()).toBe(20);
    expect(onChange).toHaveBeenCalledWith(20);
    lc.destroy?.();
  });

  it('prefix / suffix / separator', () => {
    var lc = new LiveCounter('#ls-container', { value: 1234, prefix: '$', suffix: '원', separator: ',' });
    expect(lc.container.textContent).toContain('$');
    expect(lc.container.textContent).toContain('원');
    lc.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new LiveCounter('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('ConnectionStatus 추가', () => {
  afterEach(() => {
    // 싱글톤 리셋
    if (ConnectionStatus) ConnectionStatus.instance = null;
  });

  it('isOnline()', () => {
    var cs = new ConnectionStatus();
    expect(typeof cs.isOnline()).toBe('boolean');
    cs.destroy?.();
  });

  it('offline 이벤트', () => {
    vi.useFakeTimers();
    var cs = new ConnectionStatus();
    window.dispatchEvent(new Event('offline'));
    expect(cs.isOnline()).toBe(false);
    cs.destroy?.();
    vi.useRealTimers();
  });

  it('online 이벤트 — showOnline true', () => {
    vi.useFakeTimers();
    var cs = new ConnectionStatus({ showOnline: true, autoHideDelay: 100 });
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));
    expect(cs.isOnline()).toBe(true);
    vi.advanceTimersByTime(500);
    cs.destroy?.();
    vi.useRealTimers();
  });

  it('onStatusChange 콜백', () => {
    const onStatusChange = vi.fn();
    var cs = new ConnectionStatus({ onStatusChange });
    window.dispatchEvent(new Event('offline'));
    expect(onStatusChange).toHaveBeenCalledWith(false);
    window.dispatchEvent(new Event('online'));
    expect(onStatusChange).toHaveBeenCalledWith(true);
    cs.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ConnectionStatus('#nonexistent');
    spy.mockRestore();
  });
});

describe('TypingIndicator 추가2', () => {
  it('showNames false', () => {
    var ti = new TypingIndicator('#ls-container', { showNames: false });
    ti.addUser('A');
    expect(ti.container.textContent).toContain('입력 중');
    ti.destroy?.();
  });

  it('show / hide', () => {
    var ti = new TypingIndicator('#ls-container');
    ti.show();
    expect(ti.container.style.display).toBe('flex');
    ti.hide();
    expect(ti.container.style.display).toBe('none');
    ti.destroy?.();
  });

  it('중복 사용자 무시', () => {
    var ti = new TypingIndicator('#ls-container');
    ti.addUser('A');
    ti.addUser('A');
    expect(ti._users.length).toBe(1);
    ti.destroy?.();
  });

  it('존재하지 않는 사용자 제거 무시', () => {
    var ti = new TypingIndicator('#ls-container');
    ti.removeUser('없는사람');
    expect(ti._users.length).toBe(0);
    ti.destroy?.();
  });
});

describe('OnlineStatus 추가2', () => {
  it('showLabel + setStatus 라벨 업데이트', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online', showLabel: true });
    os.setStatus('away');
    var label = os.indicator.querySelector('.online-status__label');
    expect(label.textContent).toContain('자리 비움');
    os.destroy?.();
  });

  it('다양한 상태 라벨', () => {
    var os = new OnlineStatus('#ls-container', { status: 'dnd', showLabel: true });
    expect(os.indicator.querySelector('.online-status__label').textContent).toContain('방해 금지');
    os.destroy?.();
  });

  it('size lg / position top-left', () => {
    var os = new OnlineStatus('#ls-container', { status: 'online', size: 'lg', position: 'top-left' });
    expect(os.indicator.classList.contains('online-status--lg')).toBe(true);
    expect(os.indicator.classList.contains('online-status--top-left')).toBe(true);
    os.destroy?.();
  });
});
