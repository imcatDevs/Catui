/**
 * Security Input Module 테스트
 * OTPInput, PinInput
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let OTPInput, PinInput;

beforeEach(async () => {
  const mod = await import('../../src/modules/security-input.js');
  OTPInput = mod.OTPInput || mod.default?.OTPInput;
  PinInput = mod.PinInput || mod.default?.PinInput;
  document.body.innerHTML = '<div id="otp-container"></div><div id="pin-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('OTPInput', () => {
  it('OTPInput 클래스가 존재해야 함', () => {
    expect(OTPInput).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    expect(otp).toBeDefined();
    otp.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = OTPInput.defaults();
    expect(d).toBeDefined();
    expect(d.length).toBeDefined();
  });

  it('DOM에 입력 필드를 렌더링해야 함', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false });
    var inputs = document.querySelectorAll('#otp-container input');
    expect(inputs.length).toBeGreaterThan(0);
    otp.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    if (otp && typeof otp.destroy === 'function') {
      otp.destroy();
    }
  });
});

describe('PinInput', () => {
  it('PinInput 클래스가 존재해야 함', () => {
    expect(PinInput).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    expect(pin).toBeDefined();
    pin.destroy?.();
  });

  it('DOM에 입력 필드를 렌더링해야 함', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    var inputs = document.querySelectorAll('#pin-container input');
    expect(inputs.length).toBeGreaterThan(0);
    pin.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new PinInput('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('OTPInput 추가', () => {
  it('setValue / getValue', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.setValue('123456');
    expect(otp.getValue()).toBe('123456');
    otp.destroy?.();
  });

  it('clear()', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.setValue('123456');
    otp.clear();
    expect(otp.getValue()).toBe('');
    otp.destroy?.();
  });

  it('focus()', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.focus();
    otp.destroy?.();
  });

  it('setError / clearError', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.setError('잘못된 코드');
    expect(document.querySelector('.otp-input--error')).not.toBeNull();
    otp.clearError();
    expect(document.querySelector('.otp-input--error')).toBeNull();
    // 두 번째 setError (기존 errorEl이 없을 때)
    otp.setError('새 에러');
    otp.destroy?.();
  });

  it('setSuccess / clearSuccess', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.setSuccess();
    expect(document.querySelector('.otp-input--success')).not.toBeNull();
    otp.clearSuccess();
    expect(document.querySelector('.otp-input--success')).toBeNull();
    otp.destroy?.();
  });

  it('disable / enable', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    otp.disable();
    expect(otp.options.disabled).toBe(true);
    otp.enable();
    expect(otp.options.disabled).toBe(false);
    otp.destroy?.();
  });

  it('separator 옵션', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false, separator: true, separatorPosition: 3 });
    expect(document.querySelector('.otp-input__separator')).not.toBeNull();
    otp.destroy?.();
  });

  it('mask 옵션', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false, mask: true });
    var input = document.querySelector('.otp-input__field');
    expect(input.type).toBe('password');
    otp.destroy?.();
  });

  it('error/errorMessage 옵션', () => {
    var otp = new OTPInput('#otp-container', { length: 6, autoFocus: false, error: true, errorMessage: '에러!' });
    expect(document.querySelector('.otp-input--error')).not.toBeNull();
    expect(document.querySelector('.otp-input__error').textContent).toBe('에러!');
    otp.destroy?.();
  });

  it('size sm 옵션', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, size: 'sm' });
    expect(document.querySelector('.otp-input--sm')).not.toBeNull();
    otp.destroy?.();
  });

  it('입력 시 다음 필드로 이동 및 onComplete', () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, onComplete, onChange });
    otp.inputs.forEach((input, i) => {
      input.value = String(i + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onComplete).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    otp.destroy?.();
  });

  it('Backspace 키 — 이전 필드로 이동', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false });
    otp.inputs[1].focus();
    otp.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    otp.destroy?.();
  });

  it('ArrowLeft/ArrowRight 키', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false });
    otp.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    otp.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    otp.destroy?.();
  });

  it('숫자가 아닌 입력 거부 (number 타입)', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, type: 'number' });
    otp.inputs[0].value = 'a';
    otp.inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(otp.inputs[0].value).toBe('');
    otp.destroy?.();
  });

  it('중복 인스턴스 교체', () => {
    var otp1 = new OTPInput('#otp-container', { length: 4, autoFocus: false });
    var otp2 = new OTPInput('#otp-container', { length: 6, autoFocus: false });
    expect(otp2.options.length).toBe(6);
    otp2.destroy?.();
  });

  it('onFocus / onBlur 콜백', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, onFocus, onBlur });
    otp.inputs[0].dispatchEvent(new Event('focus'));
    expect(onFocus).toHaveBeenCalled();
    otp.inputs[0].dispatchEvent(new Event('blur'));
    expect(onBlur).toHaveBeenCalled();
    otp.destroy?.();
  });

  it('paste 이벤트', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, type: 'number' });
    var pasteEvent = new Event('paste', { bubbles: true });
    pasteEvent.clipboardData = { getData: () => '1234' };
    otp.inputs[0].dispatchEvent(pasteEvent);
    expect(otp.getValue()).toBe('1234');
    otp.destroy?.();
  });

  it('paste — 숫자 필터링', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, type: 'number' });
    var pasteEvent = new Event('paste', { bubbles: true });
    pasteEvent.clipboardData = { getData: () => 'a1b2c3d4' };
    otp.inputs[0].dispatchEvent(pasteEvent);
    expect(otp.getValue()).toBe('1234');
    otp.destroy?.();
  });

  it('text 타입 입력', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, type: 'text' });
    otp.inputs[0].value = 'a';
    otp.inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(otp.inputs[0].value).toBe('a');
    otp.destroy?.();
  });

  it('disabled 옵션', () => {
    var otp = new OTPInput('#otp-container', { length: 4, autoFocus: false, disabled: true });
    expect(otp.container.classList.contains('otp-input--disabled')).toBe(true);
    otp.destroy?.();
  });
});

describe('PinInput 추가', () => {
  it('setValue / getValue / clear', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.setValue('1234');
    expect(pin.getValue()).toBe('1234');
    pin.clear();
    expect(pin.getValue()).toBe('');
    pin.destroy?.();
  });

  it('setError / clearError', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.setError('잘못된 PIN');
    expect(document.querySelector('.pin-input--error')).not.toBeNull();
    pin.clearError();
    expect(document.querySelector('.pin-input--error')).toBeNull();
    pin.destroy?.();
  });

  it('setSuccess / clearSuccess', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.setSuccess();
    expect(document.querySelector('.pin-input--success')).not.toBeNull();
    pin.clearSuccess();
    expect(document.querySelector('.pin-input--success')).toBeNull();
    pin.destroy?.();
  });

  it('disable / enable', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.disable();
    expect(pin.options.disabled).toBe(true);
    pin.enable();
    expect(pin.options.disabled).toBe(false);
    pin.destroy?.();
  });

  it('toggle 보이기/숨기기', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, showToggle: true, mask: true });
    var toggle = pin.container.querySelector('.pin-input__toggle');
    if (toggle) toggle.click();
    expect(pin.isVisible).toBe(true);
    if (toggle) toggle.click();
    expect(pin.isVisible).toBe(false);
    pin.destroy?.();
  });

  it('keypad 옵션', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, keypad: true });
    expect(document.querySelector('.pin-input__keypad')).not.toBeNull();
    // 키패드 숫자 클릭
    var key1 = pin.container.querySelector('[data-key="1"]');
    if (key1) key1.click();
    var key2 = pin.container.querySelector('[data-key="2"]');
    if (key2) key2.click();
    expect(pin.getValue().length).toBeGreaterThan(0);
    // backspace
    var backKey = pin.container.querySelector('[data-key="backspace"]');
    if (backKey) backKey.click();
    pin.destroy?.();
  });

  it('shuffleKeypad 옵션', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, keypad: true, shuffleKeypad: true });
    pin.shuffleKeypad();
    pin.destroy?.();
  });

  it('입력 시 다음 필드로 이동 및 onComplete', () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, onComplete, onChange });
    pin.inputs.forEach((input, i) => {
      input.value = String(i + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onComplete).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    pin.destroy?.();
  });

  it('Backspace 키 — 이전 필드로 이동', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.inputs[1].focus();
    pin.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    pin.destroy?.();
  });

  it('ArrowLeft/ArrowRight 키', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    pin.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    pin.inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    pin.destroy?.();
  });

  it('paste 이벤트', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false });
    var pasteEvent = new Event('paste', { bubbles: true });
    pasteEvent.clipboardData = { getData: () => '5678' };
    pin.inputs[0].dispatchEvent(pasteEvent);
    expect(pin.getValue()).toBe('5678');
    pin.destroy?.();
  });

  it('size sm', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, size: 'sm' });
    expect(pin.container.classList.contains('pin-input--sm')).toBe(true);
    pin.destroy?.();
  });

  it('error/errorMessage 초기 옵션', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, error: true, errorMessage: '에러!' });
    expect(document.querySelector('.pin-input--error')).not.toBeNull();
    pin.destroy?.();
  });

  it('중복 인스턴스 교체', () => {
    var pin1 = new PinInput('#pin-container', { length: 4, autoFocus: false });
    var pin2 = new PinInput('#pin-container', { length: 6, autoFocus: false });
    expect(pin2.options.length).toBe(6);
    pin2.destroy?.();
  });

  it('숫자가 아닌 입력 거부', () => {
    var pin = new PinInput('#pin-container', { length: 4, autoFocus: false, numeric: true });
    pin.inputs[0].value = 'a';
    pin.inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(pin.inputs[0].value).toBe('');
    pin.destroy?.();
  });
});
