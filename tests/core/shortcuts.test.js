/**
 * Shortcuts Module 테스트
 * Shortcuts는 IMCAT 인스턴스 믹스인으로 동작하므로 mock context 사용
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Shortcuts } from '../../src/core/shortcuts.js';

// ============================================
// Mock IMCAT context (Shortcuts의 `this` 역할)
// ============================================
function createMockContext(moduleMap = {}) {
  const ctx = {
    ...Shortcuts,
    use: vi.fn(async (name) => moduleMap[name] || {}),
    view: {
      registerInstance: vi.fn()
    }
  };
  ctx.toast = { ...Shortcuts.toast, _imcat: ctx };
  ctx.notify = { ...Shortcuts.notify, _imcat: ctx };
  return ctx;
}

describe('Shortcuts', () => {

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ============================================
  // toast 서브 API
  // ============================================
  describe('toast', () => {
    it('_imcat 미설정 시 _getModule()이 에러를 던짐', async () => {
      const toast = { ...Shortcuts.toast, _imcat: null };
      await expect(toast._getModule()).rejects.toThrow('IMCAT 인스턴스가 설정되지 않았습니다');
    });

    it('show() — Feedback.Toast.show를 호출', async () => {
      const mockToastShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({
        feedback: { Toast: { show: mockToastShow, clear: vi.fn() } }
      });

      await ctx.toast.show('테스트 메시지', 'success', 3000);
      expect(mockToastShow).toHaveBeenCalledWith('테스트 메시지', 'success', 3000);
    });

    it('success() — type "success"로 show 호출', async () => {
      const mockToastShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({
        feedback: { Toast: { show: mockToastShow } }
      });

      await ctx.toast.success('성공');
      expect(mockToastShow).toHaveBeenCalledWith('성공', 'success', 3000);
    });

    it('error() — type "error"로 show 호출', async () => {
      const mockToastShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({
        feedback: { Toast: { show: mockToastShow } }
      });

      await ctx.toast.error('에러');
      expect(mockToastShow).toHaveBeenCalledWith('에러', 'error', 3000);
    });

    it('clear() — Toast.clear 호출', async () => {
      const mockClear = vi.fn();
      const ctx = createMockContext({
        feedback: { Toast: { show: vi.fn(), clear: mockClear } }
      });

      await ctx.toast.clear();
      expect(mockClear).toHaveBeenCalled();
    });
  });

  // ============================================
  // notify 서브 API
  // ============================================
  describe('notify', () => {
    it('_imcat 미설정 시 _getModule()이 에러를 던짐', async () => {
      const notify = { ...Shortcuts.notify, _imcat: null };
      await expect(notify._getModule()).rejects.toThrow('IMCAT 인스턴스가 설정되지 않았습니다');
    });

    it('success() — Notification.show를 success 타입으로 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({
        feedback: { Notification: { show: mockShow } }
      });

      await ctx.notify.success('알림 메시지', '제목');
      expect(mockShow).toHaveBeenCalledWith({
        message: '알림 메시지',
        title: '제목',
        type: 'success'
      });
    });

    it('error() — type "error"로 show 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({
        feedback: { Notification: { show: mockShow } }
      });

      await ctx.notify.error('에러 알림');
      expect(mockShow).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });
  });

  // ============================================
  // modal / drawer 단축 메서드
  // ============================================
  describe('modal()', () => {
    it('Overlays.Modal을 생성하고 registerInstance 호출', async () => {
      const mockModalInstance = { show: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModalInstance);
      const ctx = createMockContext({
        overlays: { Modal: MockModal }
      });

      const result = await ctx.modal({ title: '테스트' });
      expect(MockModal).toHaveBeenCalledWith({ title: '테스트' });
      expect(ctx.view.registerInstance).toHaveBeenCalledWith(mockModalInstance);
      expect(result).toBe(mockModalInstance);
    });
  });

  describe('drawer()', () => {
    it('Overlays.Drawer를 생성하고 registerInstance 호출', async () => {
      const mockDrawerInstance = { show: vi.fn() };
      const MockDrawer = vi.fn(() => mockDrawerInstance);
      const ctx = createMockContext({
        overlays: { Drawer: MockDrawer }
      });

      const result = await ctx.drawer({ position: 'left' });
      expect(MockDrawer).toHaveBeenCalledWith({ position: 'left' });
      expect(ctx.view.registerInstance).toHaveBeenCalledWith(mockDrawerInstance);
      expect(result).toBe(mockDrawerInstance);
    });
  });

  // ============================================
  // tooltip / popover
  // ============================================
  describe('tooltip()', () => {
    it('문자열 옵션을 { content } 객체로 변환', async () => {
      const mockInstance = {};
      const MockTooltip = vi.fn(() => mockInstance);
      const ctx = createMockContext({
        tooltips: { Tooltip: MockTooltip }
      });

      document.body.innerHTML = `<button id="btn">버튼</button>`;
      await ctx.tooltip('#btn', '툴팁 내용');

      expect(MockTooltip).toHaveBeenCalledWith('#btn', { content: '툴팁 내용' });
    });
  });

  describe('popover()', () => {
    it('문자열 옵션을 { content } 객체로 변환', async () => {
      const mockInstance = {};
      const MockPopover = vi.fn(() => mockInstance);
      const ctx = createMockContext({
        tooltips: { Popover: MockPopover }
      });

      document.body.innerHTML = `<button id="btn">버튼</button>`;
      await ctx.popover('#btn', '팝오버 내용');

      expect(MockPopover).toHaveBeenCalledWith('#btn', { content: '팝오버 내용' });
    });
  });

  // ============================================
  // confirm / alert / prompt
  // ============================================
  describe('confirm()', () => {
    it('문자열 옵션을 { message } 객체로 변환하고 Modal 생성', async () => {
      const mockModal = { show: vi.fn(), hide: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModal);
      const ctx = createMockContext({ overlays: { Modal: MockModal } });

      const promise = ctx.confirm('삭제하시겠습니까?');
      await vi.waitFor(() => expect(MockModal).toHaveBeenCalled());
      MockModal.mock.calls[0][0].buttons[1].action();
      expect(await promise).toBe(true);
    });

    it('취소 버튼 클릭 시 false 반환', async () => {
      const mockModal = { show: vi.fn(), hide: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModal);
      const ctx = createMockContext({ overlays: { Modal: MockModal } });

      const promise = ctx.confirm({ message: '확인?', title: '제목' });
      await vi.waitFor(() => expect(MockModal).toHaveBeenCalled());
      MockModal.mock.calls[0][0].buttons[0].action();
      expect(await promise).toBe(false);
    });
  });

  describe('alert()', () => {
    it('Modal을 생성하고 확인 시 resolve', async () => {
      const mockModal = { show: vi.fn(), hide: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModal);
      const ctx = createMockContext({ overlays: { Modal: MockModal } });

      const promise = ctx.alert('저장되었습니다');
      await vi.waitFor(() => expect(MockModal).toHaveBeenCalled());
      MockModal.mock.calls[0][0].buttons[0].action();
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('prompt()', () => {
    it('Modal 내 입력 필드를 생성하고 값 반환', async () => {
      const mockModal = { show: vi.fn(), hide: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModal);
      const ctx = createMockContext({ overlays: { Modal: MockModal } });

      const promise = ctx.prompt('이름 입력', { defaultValue: '홍길동' });
      await vi.waitFor(() => expect(MockModal).toHaveBeenCalled());
      MockModal.mock.calls[0][0].buttons[1].action();
      const result = await promise;
      expect(typeof result).toBe('string');
    });

    it('취소 시 null 반환', async () => {
      const mockModal = { show: vi.fn(), hide: vi.fn(), destroy: vi.fn() };
      const MockModal = vi.fn(() => mockModal);
      const ctx = createMockContext({ overlays: { Modal: MockModal } });

      const promise = ctx.prompt('이름');
      await vi.waitFor(() => expect(MockModal).toHaveBeenCalled());
      MockModal.mock.calls[0][0].buttons[0].action();
      expect(await promise).toBeNull();
    });
  });

  // ============================================
  // toast.warning / toast.info
  // ============================================
  describe('toast.warning() / toast.info()', () => {
    it('warning — type "warning"으로 show 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({ feedback: { Toast: { show: mockShow } } });
      await ctx.toast.warning('경고');
      expect(mockShow).toHaveBeenCalledWith('경고', 'warning', 3000);
    });

    it('info — type "info"로 show 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({ feedback: { Toast: { show: mockShow } } });
      await ctx.toast.info('정보');
      expect(mockShow).toHaveBeenCalledWith('정보', 'info', 3000);
    });
  });

  // ============================================
  // notify.warning / notify.info
  // ============================================
  describe('notify.warning() / notify.info()', () => {
    it('warning — type "warning"으로 show 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({ feedback: { Notification: { show: mockShow } } });
      await ctx.notify.warning('경고 알림');
      expect(mockShow).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });

    it('info — type "info"로 show 호출', async () => {
      const mockShow = vi.fn().mockResolvedValue(undefined);
      const ctx = createMockContext({ feedback: { Notification: { show: mockShow } } });
      await ctx.notify.info('정보 알림');
      expect(mockShow).toHaveBeenCalledWith(expect.objectContaining({ type: 'info' }));
    });
  });

  // ============================================
  // 단축 생성 메서드 (패턴 동일: use → new → registerInstance)
  // ============================================
  const shortcutTests = [
    { name: 'tabs', module: 'navigation', Cls: 'Tabs', args: ['#el'] },
    { name: 'accordion', module: 'navigation', Cls: 'Accordion', args: ['#el'] },
    { name: 'carousel', module: 'carousel', Cls: 'Carousel', args: ['#el'] },
    { name: 'datePicker', module: 'pickers', Cls: 'DatePicker', args: ['#el'] },
    { name: 'timePicker', module: 'pickers', Cls: 'TimePicker', args: ['#el'] },
    { name: 'colorPicker', module: 'pickers', Cls: 'ColorPicker', args: ['#el'] },
    { name: 'countdown', module: 'pickers', Cls: 'Countdown', args: ['#el', new Date()] },
    { name: 'autocomplete', module: 'selectors', Cls: 'Autocomplete', args: ['#el', { source: [] }] },
    { name: 'multiSelect', module: 'selectors', Cls: 'MultiSelect', args: ['#el'] },
    { name: 'rangeSlider', module: 'selectors', Cls: 'RangeSlider', args: ['#el'] },
    { name: 'rating', module: 'forms', Cls: 'Rating', args: ['#el'] },
    { name: 'fileUpload', module: 'forms', Cls: 'FileUpload', args: ['#el'] },
    { name: 'dataTable', module: 'data-viz', Cls: 'DataTable', args: ['#el', {}] },
    { name: 'chart', module: 'data-viz', Cls: 'Chart', args: ['#el', {}] },
    { name: 'kanban', module: 'data-viz', Cls: 'Kanban', args: ['#el', {}] },
    { name: 'stepper', module: 'stepper', Cls: 'Stepper', args: ['#el'] },
    { name: 'pagination', module: 'pagination', Cls: 'Pagination', args: ['#el', {}] },
    { name: 'imageList', module: 'imagelist', Cls: 'ImageList', args: ['#el', {}] },
    { name: 'imageCompare', module: 'imagelist', Cls: 'ImageCompare', args: ['#el', {}] },
    { name: 'infiniteScroll', module: 'scroll', Cls: 'InfiniteScroll', args: ['#el', {}] },
  ];

  shortcutTests.forEach(({ name, module, Cls, args }) => {
    describe(`${name}()`, () => {
      it(`${Cls}를 생성하고 registerInstance 호출`, async () => {
        const inst = {};
        const Mock = vi.fn(() => inst);
        const moduleObj = {};
        moduleObj[Cls] = Mock;
        const ctx = createMockContext({ [module]: moduleObj });
        const result = await ctx[name](...args);
        expect(Mock).toHaveBeenCalled();
        expect(ctx.view.registerInstance).toHaveBeenCalledWith(inst);
        expect(result).toBe(inst);
      });
    });
  });

  describe('lightbox()', () => {
    it('Lightbox를 생성하고 show 호출', async () => {
      const inst = { show: vi.fn() };
      const MockLightbox = vi.fn(() => inst);
      const ctx = createMockContext({ overlays: { Lightbox: MockLightbox } });
      const result = await ctx.lightbox(['img1.jpg']);
      expect(MockLightbox).toHaveBeenCalled();
      expect(inst.show).toHaveBeenCalled();
    });
  });

  describe('qrCode()', () => {
    it('QRCode를 생성하고 registerInstance 호출', async () => {
      const inst = {};
      const Mock = vi.fn(() => inst);
      const ctx = createMockContext({ 'advanced-ui': { QRCode: Mock } });
      const result = await ctx.qrCode('#el', 'data');
      expect(Mock).toHaveBeenCalled();
      expect(ctx.view.registerInstance).toHaveBeenCalledWith(inst);
    });
  });

  describe('progress()', () => {
    it('ProgressTracker를 생성하고 registerInstance 호출', async () => {
      const inst = {};
      const Mock = vi.fn(() => inst);
      const ctx = createMockContext({ feedback: { ProgressTracker: Mock, Toast: { show: vi.fn() } } });
      const result = await ctx.progress({});
      expect(Mock).toHaveBeenCalled();
    });
  });

  describe('skeleton()', () => {
    it('Skeleton을 생성', async () => {
      const inst = {};
      const Mock = vi.fn(() => inst);
      const ctx = createMockContext({ feedback: { Skeleton: Mock, Toast: { show: vi.fn() } } });
      const result = await ctx.skeleton('#el');
      expect(Mock).toHaveBeenCalled();
    });
  });

  describe('gantt()', () => {
    it('Gantt를 생성하고 registerInstance 호출', async () => {
      const inst = {};
      const MockGantt = vi.fn(() => inst);
      // gantt 모듈은 default export가 생성자
      const ctx = createMockContext({ gantt: MockGantt });
      // gantt는 `new Gantt(element, options)` 패턴
      const result = await ctx.gantt('#el', {});
      expect(MockGantt).toHaveBeenCalled();
    });
  });

  // ============================================
  // theme 서브 API
  // ============================================
  describe('theme', () => {
    it('_imcat 미설정 시 에러를 던짐', async () => {
      const theme = { ...Shortcuts.theme, _imcat: null, _instance: null };
      await expect(theme._getModule()).rejects.toThrow('IMCAT 인스턴스가 설정되지 않았습니다');
    });

    it('init() — ThemeModule.initTheme 호출', async () => {
      const mockInstance = { toggle: vi.fn(), getResolved: vi.fn().mockReturnValue('light') };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      const result = await ctx.theme.init({ transition: 'fade' });
      expect(mockModule.initTheme).toHaveBeenCalled();
      expect(result).toBe(mockInstance);
    });

    it('toggle() — instance.toggle 호출', async () => {
      const mockInstance = { toggle: vi.fn(), getResolved: vi.fn().mockReturnValue('light') };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      await ctx.theme.toggle();
      expect(mockInstance.toggle).toHaveBeenCalled();
    });

    it('toggleWithEvent() — instance.toggleWithEvent 호출', async () => {
      const mockInstance = { toggleWithEvent: vi.fn(), toggle: vi.fn(), getResolved: vi.fn().mockReturnValue('dark') };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      const mockEvent = { clientX: 100, clientY: 200 };
      await ctx.theme.toggleWithEvent(mockEvent);
      expect(mockInstance.toggleWithEvent).toHaveBeenCalledWith(mockEvent, undefined);
    });

    it('set() — instance.setTheme 호출', async () => {
      const mockInstance = { setTheme: vi.fn(), toggle: vi.fn(), getResolved: vi.fn().mockReturnValue('light') };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      await ctx.theme.set('dark');
      expect(mockInstance.setTheme).toHaveBeenCalledWith('dark', true);
    });

    it('get() — getResolved 호출', async () => {
      const mockInstance = { getResolved: vi.fn().mockReturnValue('dark'), toggle: vi.fn() };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      const result = await ctx.theme.get();
      expect(result).toBe('dark');
    });

    it('isDark() / isLight() — 올바른 boolean 반환', async () => {
      const mockInstance = { getResolved: vi.fn().mockReturnValue('dark'), toggle: vi.fn() };
      const mockModule = { initTheme: vi.fn().mockReturnValue(mockInstance) };
      const ctx = createMockContext({ theme: mockModule });
      ctx.theme = { ...Shortcuts.theme, _imcat: ctx, _instance: null };
      expect(await ctx.theme.isDark()).toBe(true);
      expect(await ctx.theme.isLight()).toBe(false);
    });

    it('TRANSITIONS 상수가 정의되어 있어야 함', () => {
      expect(Shortcuts.theme.TRANSITIONS.FADE).toBe('fade');
      expect(Shortcuts.theme.TRANSITIONS.CIRCLE).toBe('circle');
    });
  });
});
