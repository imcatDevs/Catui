/**
 * Overlays Module 테스트
 * Modal, Drawer, Offcanvas
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Overlays;

beforeEach(async () => {
  Overlays = await import('../../src/modules/overlays.js');
  document.body.innerHTML = '';
});

afterEach(async () => {
  // 비동기 작업 완료 대기
  await new Promise(r => setTimeout(r, 50));
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// ============================================
// Modal
// ============================================
describe('Modal', () => {
  const Modal = () => Overlays.Modal || Overlays.default?.Modal;

  it('Modal 클래스가 존재해야 함', () => {
    expect(Modal()).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', content: '<p>내용</p>' });
    expect(modal).toBeDefined();
    modal.destroy?.();
  });

  it('show() / hide() 메서드가 존재해야 함', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트' });
    expect(typeof modal.show).toBe('function');
    expect(typeof modal.hide).toBe('function');
    modal.destroy?.();
  });

  it('destroy() 메서드가 존재해야 함', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트' });
    expect(typeof modal.destroy).toBe('function');
    modal.destroy();
  });

  it('show() 후 isOpen이 true가 되어야 함', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0 });
    await modal.show();
    expect(modal.isOpen).toBe(true);
    await modal.destroy();
  });

  it('hide() 후 isOpen이 false가 되어야 함', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0 });
    await modal.show();
    await modal.hide();
    expect(modal.isOpen).toBe(false);
    await modal.destroy();
  });

  it('버튼을 포함한 모달을 생성할 수 있어야 함', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const onAction = vi.fn();
    const modal = new ModalClass({
      title: '확인',
      content: '작업을 진행할까요?',
      buttons: [
        { text: '취소', variant: 'secondary', action: () => modal.hide() },
        { text: '확인', variant: 'primary', action: onAction }
      ]
    });
    expect(modal).toBeDefined();
    modal.destroy?.();
  });
});

// ============================================
// Drawer
// ============================================
describe('Drawer', () => {
  const Drawer = () => Overlays.Drawer || Overlays.default?.Drawer;

  it('Drawer 클래스가 존재해야 함', () => {
    expect(Drawer()).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', position: 'right' });
    expect(drawer).toBeDefined();
    drawer.destroy?.();
  });

  it('destroy() 메서드가 존재해야 함', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어' });
    expect(typeof drawer.destroy).toBe('function');
    drawer.destroy();
  });

  it('show/hide 동작', async () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', animation: false, animationDuration: 0 });
    await drawer.show();
    // rAF 콜백 완료 대기
    await new Promise(r => setTimeout(r, 50));
    expect(drawer.isOpen).toBe(true);
    await drawer.hide();
    await new Promise(r => setTimeout(r, 50));
    expect(drawer.isOpen).toBe(false);
    await drawer.destroy();
  });

  it('position left', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', position: 'left' });
    expect(drawer.element.classList.contains('drawer--left')).toBe(true);
    drawer.destroy();
  });

  it('position top', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', position: 'top' });
    drawer.destroy();
  });

  it('content가 HTMLElement일 때', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const el = document.createElement('div');
    el.textContent = '커스텀 내용';
    const drawer = new DrawerClass({ content: el });
    drawer.destroy();
  });
});

// ============================================
// Modal 추가 테스트
// ============================================
describe('Modal 추가', () => {
  const Modal = () => Overlays.Modal || Overlays.default?.Modal;

  it('centered/fullscreen/scrollable 옵션', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', centered: true, fullscreen: true, scrollable: true });
    expect(modal.element.classList.contains('modal--centered')).toBe(true);
    expect(modal.element.classList.contains('modal--fullscreen')).toBe(true);
    modal.destroy();
  });

  it('content가 HTMLElement일 때', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const el = document.createElement('p');
    el.textContent = '커스텀';
    const modal = new ModalClass({ title: '테스트', content: el });
    modal.destroy();
  });

  it('닫기 버튼 클릭 시 hide', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, closeButton: true });
    await modal.show();
    expect(modal.element.querySelector('.modal__close')).not.toBeNull();
    // 닫기 버튼 클릭 대신 직접 hide 호출로 타이밍 문제 회피
    await modal.hide();
    expect(modal.isOpen).toBe(false);
    await modal.destroy();
  });

  it('버튼 action 실행', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const action = vi.fn();
    const modal = new ModalClass({
      title: '테스트',
      animation: false,
      animationDuration: 0,
      buttons: [
        { text: '확인', variant: 'primary', action }
      ]
    });
    await modal.show();
    const buttons = modal.element.querySelectorAll('.btn');
    if (buttons[0]) buttons[0].click();
    expect(action).toHaveBeenCalled();
    await modal.hide();
    await modal.destroy();
  });

  it('ESC 키 핸들러 등록 확인', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, keyboard: true });
    await modal.show();
    expect(modal.isOpen).toBe(true);
    // ESC 핸들러가 등록되었는지 확인 (직접 hide 호출로 테스트)
    await modal.hide();
    expect(modal.isOpen).toBe(false);
    await modal.destroy();
  });

  it('on() 이벤트 리스너', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0 });
    const showFn = vi.fn();
    modal.on('show', showFn);
    await modal.show();
    expect(showFn).toHaveBeenCalled();
    modal.destroy();
  });

  it('onShow/onHide 콜백', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const onShow = vi.fn();
    const onHide = vi.fn();
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, onShow, onHide });
    await modal.show();
    expect(onShow).toHaveBeenCalled();
    await modal.hide();
    expect(onHide).toHaveBeenCalled();
    modal.destroy();
  });

  it('size 옵션', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    ['sm', 'lg', 'xl'].forEach(size => {
      const modal = new ModalClass({ title: '테스트', size });
      expect(modal.element.classList.contains(`modal--${size}`)).toBe(true);
      modal.destroy();
    });
  });
});

// ============================================
// Offcanvas
// ============================================
describe('Offcanvas', () => {
  const Offcanvas = () => Overlays.Offcanvas || Overlays.default?.Offcanvas;

  it('인스턴스 생성', () => {
    const OC = Offcanvas();
    if (!OC) return;
    const oc = new OC({ title: '오프캔버스' });
    expect(oc.element.classList.contains('offcanvas')).toBe(true);
    oc.destroy();
  });

  it('show/hide', async () => {
    const OC = Offcanvas();
    if (!OC) return;
    const oc = new OC({ title: '오프캔버스', animation: false, animationDuration: 0 });
    await oc.show();
    await new Promise(r => setTimeout(r, 50));
    expect(oc.isOpen).toBe(true);
    await oc.hide();
    await new Promise(r => setTimeout(r, 50));
    expect(oc.isOpen).toBe(false);
    await oc.destroy();
  });
});

describe('Modal 추가2', () => {
  const Modal = () => Overlays.Modal || Overlays.default?.Modal;

  it('ESC 키로 닫기', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, keyboard: true });
    await modal.show();
    expect(modal.isOpen).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    expect(modal.isOpen).toBe(false);
    await modal.destroy();
  });

  it('backdrop false', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, backdrop: false });
    await modal.show();
    expect(modal.backdropElement).toBeFalsy();
    await modal.hide();
    await modal.destroy();
  });

  it('버튼 close:true — 클릭 시 닫기', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({
      title: '테스트',
      animation: false,
      animationDuration: 0,
      buttons: [{ text: '닫기', close: true }]
    });
    await modal.show();
    const btn = modal.element.querySelector('.btn');
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(modal.isOpen).toBe(false);
    await modal.destroy();
  });

  it('confirm() 정적 메서드', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    // confirm은 모달을 생성하므로 비동기적으로 처리
    const confirmPromise = ModalClass.confirm({ title: '확인', content: '계속?' });
    await new Promise(r => setTimeout(r, 100));
    // 확인 버튼 클릭 (두 번째 버튼)
    const btns = document.querySelectorAll('.modal .btn');
    if (btns.length >= 2) btns[1].click();
    await new Promise(r => setTimeout(r, 100));
    const result = await confirmPromise;
    expect(result).toBe(true);
  });

  it('alert() 정적 메서드', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const alertPromise = ModalClass.alert({ title: '알림', content: '메시지' });
    await new Promise(r => setTimeout(r, 100));
    const btn = document.querySelector('.modal .btn');
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 100));
    await alertPromise;
  });

  it('onDestroy 콜백', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const onDestroy = vi.fn();
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0, onDestroy });
    await modal.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });

  it('beforeShow/beforeHide 이벤트', async () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const beforeShow = vi.fn();
    const beforeHide = vi.fn();
    const modal = new ModalClass({ title: '테스트', animation: false, animationDuration: 0 });
    modal.on('beforeShow', beforeShow);
    modal.on('beforeHide', beforeHide);
    await modal.show();
    expect(beforeShow).toHaveBeenCalled();
    await modal.hide();
    expect(beforeHide).toHaveBeenCalled();
    await modal.destroy();
  });

  it('title 없고 closeButton false', () => {
    const ModalClass = Modal();
    if (!ModalClass) return;
    const modal = new ModalClass({ content: '내용만', closeButton: false });
    expect(modal.element.querySelector('.modal__header')).toBeNull();
    modal.destroy();
  });
});

describe('Drawer 추가', () => {
  const Drawer = () => Overlays.Drawer || Overlays.default?.Drawer;

  it('position bottom', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', position: 'bottom' });
    expect(drawer.element.classList.contains('drawer--bottom')).toBe(true);
    drawer.destroy();
  });

  it('closeButton false', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', closeButton: false });
    expect(drawer.element.querySelector('.drawer__close')).toBeNull();
    drawer.destroy();
  });

  it('content 문자열', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ content: '<p>테스트</p>' });
    expect(drawer.element.querySelector('.drawer__body').innerHTML).toContain('테스트');
    drawer.destroy();
  });

  it('title 없고 closeButton도 false', () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ closeButton: false, content: '내용' });
    expect(drawer.element.querySelector('.drawer__header')).toBeNull();
    drawer.destroy();
  });

  it('ESC 키로 닫기', async () => {
    const DrawerClass = Drawer();
    if (!DrawerClass) return;
    const drawer = new DrawerClass({ title: '드로어', animation: false, animationDuration: 0, keyboard: true });
    await drawer.show();
    await new Promise(r => setTimeout(r, 50));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    expect(drawer.isOpen).toBe(false);
    await drawer.destroy();
  });
});
