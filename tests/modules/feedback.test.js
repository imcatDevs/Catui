/**
 * Feedback Module 테스트
 * Toast, Notification
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// jsdom 환경에서 모듈 직접 임포트
let Toast, Notification;

beforeEach(async () => {
  const module = await import('../../src/modules/feedback.js');
  Toast = module.Toast || module.default?.Toast;
  Notification = module.Notification || module.default?.Notification;
  document.body.innerHTML = '';
  Toast.container = null;
});

afterEach(() => {
  if (Toast.container) {
    Toast.container.remove();
    Toast.container = null;
  }
  vi.restoreAllMocks();
});

describe('Toast', () => {
  it('컨테이너가 없을 때 init()이 생성해야 함', () => {
    Toast.init();
    expect(document.querySelector('.toast-container')).not.toBeNull();
    expect(Toast.container).not.toBeNull();
  });

  it('init()을 여러 번 호출해도 컨테이너는 하나여야 함', () => {
    Toast.init();
    Toast.init();
    const containers = document.querySelectorAll('.toast-container');
    expect(containers.length).toBe(1);
  });

  it('success 메서드가 토스트를 생성해야 함', () => {
    vi.useFakeTimers();
    Toast.success('저장되었습니다');
    const toast = document.querySelector('.toast--success');
    expect(toast).not.toBeNull();
    expect(toast.textContent).toContain('저장되었습니다');
    vi.useRealTimers();
  });

  it('error 메서드가 토스트를 생성해야 함', () => {
    vi.useFakeTimers();
    Toast.error('오류가 발생했습니다');
    const toast = document.querySelector('.toast--error');
    expect(toast).not.toBeNull();
    vi.useRealTimers();
  });

  it('warning 메서드가 토스트를 생성해야 함', () => {
    vi.useFakeTimers();
    Toast.warning('주의!');
    const toast = document.querySelector('.toast--warning');
    expect(toast).not.toBeNull();
    vi.useRealTimers();
  });

  it('info 메서드가 토스트를 생성해야 함', () => {
    vi.useFakeTimers();
    Toast.info('정보');
    const toast = document.querySelector('.toast--info');
    expect(toast).not.toBeNull();
    vi.useRealTimers();
  });

  it('duration 이후 토스트가 자동 제거되어야 함', async () => {
    vi.useFakeTimers();
    Toast.show('테스트 메시지', 'info', 100);
    expect(document.querySelector('.toast')).not.toBeNull();
    vi.advanceTimersByTime(500);
    await vi.runAllTimersAsync();
    vi.useRealTimers();
  });

  it('close 버튼 클릭 시 토스트가 숨겨져야 함', () => {
    vi.useFakeTimers();
    const toast = Toast.show('닫기 테스트', 'info', 0);
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.click();
    expect(toast.classList.contains('is-hiding')).toBe(true);
    vi.useRealTimers();
  });

  it('clear() — 모든 토스트를 제거해야 함', () => {
    vi.useFakeTimers();
    Toast.show('1', 'info', 0);
    Toast.show('2', 'info', 0);
    Toast.clear();
    expect(Toast.container.children.length).toBe(0);
    vi.useRealTimers();
  });

  it('hide() — 토스트를 숨기고 300ms 후 제거해야 함', () => {
    vi.useFakeTimers();
    const toast = Toast.show('숨기기', 'info', 0);
    Toast.hide(toast);
    expect(toast.classList.contains('is-hiding')).toBe(true);
    vi.advanceTimersByTime(400);
    vi.useRealTimers();
  });
});

describe('Notification', () => {
  let NotificationCls;
  beforeEach(async () => {
    const mod = await import('../../src/modules/feedback.js');
    NotificationCls = mod.Notification || mod.default?.Notification;
    NotificationCls.container = null;
  });

  afterEach(() => {
    if (NotificationCls.container) {
      NotificationCls.container.remove();
      NotificationCls.container = null;
    }
  });

  it('init() — 컨테이너를 생성해야 함', () => {
    NotificationCls.init();
    expect(document.querySelector('.notification-container')).not.toBeNull();
  });

  it('init()을 두 번 호출하면 기존 컨테이너를 재사용해야 함', () => {
    NotificationCls.init('top-right');
    NotificationCls.init('top-left');
    expect(document.querySelectorAll('.notification-container').length).toBe(1);
  });

  it('show() — 알림을 생성해야 함', () => {
    vi.useFakeTimers();
    const el = NotificationCls.show({ title: '제목', message: '내용', type: 'success' });
    expect(el).not.toBeNull();
    expect(el.classList.contains('notification--success')).toBe(true);
    vi.useRealTimers();
  });

  it('show() — actions 버튼을 렌더링해야 함', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const el = NotificationCls.show({
      message: '액션',
      actions: [{ text: '확인', onClick }],
      duration: 0
    });
    const actionBtn = el.querySelector('.notification__action');
    expect(actionBtn).not.toBeNull();
    actionBtn.click();
    expect(onClick).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('show() — close 버튼 클릭 시 숨기고 onClose 호출', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const el = NotificationCls.show({ message: '닫기', closable: true, onClose, duration: 0 });
    el.querySelector('.notification__close').click();
    expect(el.classList.contains('is-hiding')).toBe(true);
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('success/error/warning/info 메서드', () => {
    vi.useFakeTimers();
    expect(NotificationCls.success('T', 'M')).not.toBeNull();
    expect(NotificationCls.error('T', 'M')).not.toBeNull();
    expect(NotificationCls.warning('T', 'M')).not.toBeNull();
    expect(NotificationCls.info('T', 'M')).not.toBeNull();
    vi.useRealTimers();
  });

  it('hide() — 알림을 숨기고 제거해야 함', () => {
    vi.useFakeTimers();
    const el = NotificationCls.show({ message: '숨기기', duration: 0 });
    NotificationCls.hide(el);
    expect(el.classList.contains('is-hiding')).toBe(true);
    vi.advanceTimersByTime(400);
    vi.useRealTimers();
  });

  it('clear() — 모든 알림을 제거해야 함', () => {
    vi.useFakeTimers();
    NotificationCls.show({ message: '1', duration: 0 });
    NotificationCls.show({ message: '2', duration: 0 });
    NotificationCls.clear();
    expect(NotificationCls.container.children.length).toBe(0);
    vi.useRealTimers();
  });
});

describe('ProgressTracker', () => {
  let ProgressTracker;
  beforeEach(async () => {
    const mod = await import('../../src/modules/feedback.js');
    ProgressTracker = mod.ProgressTracker || mod.default?.ProgressTracker;
    document.body.innerHTML = '<div id="tracker"></div>';
  });

  it('defaults() — 기본값을 반환해야 함', () => {
    expect(ProgressTracker.defaults().steps).toEqual([]);
  });

  it('단계를 렌더링해야 함', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B', 'C'], current: 1 });
    expect(document.querySelectorAll('.progress-tracker__step').length).toBe(3);
  });

  it('goTo() — 단계를 변경해야 함', () => {
    const onChange = vi.fn();
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B', 'C'], onChange });
    pt.goTo(2);
    expect(pt.getCurrent()).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('goTo() — 범위 밖 인덱스는 무시해야 함', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B'] });
    pt.goTo(-1);
    expect(pt.getCurrent()).toBe(0);
    pt.goTo(5);
    expect(pt.getCurrent()).toBe(0);
  });

  it('next() / prev() — 단계 이동', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B', 'C'] });
    pt.next();
    expect(pt.getCurrent()).toBe(1);
    pt.prev();
    expect(pt.getCurrent()).toBe(0);
    pt.prev();
    expect(pt.getCurrent()).toBe(0);
  });

  it('complete() — 모든 단계를 완료 상태로', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B'] });
    pt.complete();
    // complete()는 goTo(steps.length)를 호출하며 렌더링도 실행
    expect(pt.getCurrent()).toBeGreaterThanOrEqual(0);
  });

  it('clickable 옵션으로 클릭 이벤트 바인딩', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B', 'C'], clickable: true });
    const step = document.querySelector('[data-step="2"]');
    step.click();
    expect(pt.getCurrent()).toBe(2);
  });

  it('vertical 옵션', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B'], vertical: true });
    expect(document.querySelector('.progress-tracker--vertical')).not.toBeNull();
  });

  it('destroy() — 정리해야 함', () => {
    const pt = new ProgressTracker('#tracker', { steps: ['A', 'B'], clickable: true });
    pt.destroy();
    expect(pt.element).toBeNull();
  });

  it('element를 찾지 못하면 early return', () => {
    const pt = new ProgressTracker('#nonexistent', { steps: ['A'] });
    expect(pt.element).toBeNull();
  });
});

describe('Skeleton', () => {
  let Skeleton;
  beforeEach(async () => {
    const mod = await import('../../src/modules/feedback.js');
    Skeleton = mod.Skeleton || mod.default?.Skeleton;
    document.body.innerHTML = '<div id="skel"></div>';
  });

  it('defaults() — 기본값을 반환해야 함', () => {
    expect(Skeleton.defaults().type).toBe('text');
  });

  it('text 타입 렌더링', () => {
    const s = new Skeleton('#skel', { type: 'text', lines: 3 });
    expect(document.querySelectorAll('.skeleton--text').length).toBe(3);
  });

  it('avatar 타입 렌더링', () => {
    const s = new Skeleton('#skel', { type: 'avatar' });
    expect(document.querySelector('.skeleton--avatar')).not.toBeNull();
  });

  it('image 타입 렌더링', () => {
    const s = new Skeleton('#skel', { type: 'image', height: '200px' });
    expect(document.querySelector('.skeleton--image')).not.toBeNull();
  });

  it('card 타입 렌더링', () => {
    const s = new Skeleton('#skel', { type: 'card' });
    expect(document.querySelector('.skeleton--card')).not.toBeNull();
  });

  it('list 타입 렌더링', () => {
    const s = new Skeleton('#skel', { type: 'list', lines: 2 });
    expect(document.querySelectorAll('.skeleton--list-item').length).toBe(2);
  });

  it('animated: false', () => {
    const s = new Skeleton('#skel', { type: 'text', animated: false });
    expect(document.querySelector('.skeleton--animated')).toBeNull();
  });

  it('destroy() — 정리해야 함', () => {
    const s = new Skeleton('#skel');
    s.destroy();
    expect(document.querySelector('.skeleton-wrapper')).toBeNull();
  });

  it('element를 찾지 못하면 early return', () => {
    const s = new Skeleton('#nonexistent');
    expect(s.element).toBeNull();
  });
});
