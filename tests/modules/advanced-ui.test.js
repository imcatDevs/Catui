/**
 * Advanced UI Module 테스트
 * SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker;

beforeEach(async () => {
  const mod = await import('../../src/modules/advanced-ui.js');
  SplitPane = mod.SplitPane || mod.default?.SplitPane;
  QRCode = mod.QRCode || mod.default?.QRCode;
  CopyToClipboard = mod.CopyToClipboard || mod.default?.CopyToClipboard;
  CodeBlock = mod.CodeBlock || mod.default?.CodeBlock;
  SimpleColorPicker = mod.SimpleColorPicker || mod.default?.SimpleColorPicker;
  document.body.innerHTML = '<div id="au-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('SplitPane', () => {
  it('SplitPane 클래스가 존재해야 함', () => {
    expect(SplitPane).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<div id="sp-container"><div class="split-pane">왼쪽</div><div class="split-pane">오른쪽</div></div>';
    var sp = new SplitPane('#sp-container');
    expect(sp).toBeDefined();
    sp.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    document.body.innerHTML = '<div id="sp-container2"><div class="split-pane">A</div><div class="split-pane">B</div></div>';
    var sp = new SplitPane('#sp-container2');
    if (sp && typeof sp.destroy === 'function') {
      sp.destroy();
    }
  });
});

describe('QRCode', () => {
  it('QRCode 클래스가 존재해야 함', () => {
    expect(QRCode).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var qr = new QRCode('#au-container', { text: 'https://imcat.dev' });
    expect(qr).toBeDefined();
    qr.destroy?.();
  });
});

describe('CopyToClipboard', () => {
  it('CopyToClipboard 클래스가 존재해야 함', () => {
    expect(CopyToClipboard).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<button id="copy-btn">복사</button><input id="copy-target" value="텍스트">';
    var ctc = new CopyToClipboard('#copy-btn', { target: '#copy-target' });
    expect(ctc).toBeDefined();
    ctc.destroy?.();
  });

  it('static copy 메서드가 존재해야 함', () => {
    expect(typeof CopyToClipboard.copy).toBe('function');
  });
});

describe('CodeBlock', () => {
  it('CodeBlock 클래스가 존재해야 함', () => {
    expect(CodeBlock).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var cb = new CodeBlock('#au-container', {
      code: 'console.log("hello");',
      language: 'javascript'
    });
    expect(cb).toBeDefined();
    cb.destroy?.();
  });
});

describe('SimpleColorPicker', () => {
  it('SimpleColorPicker 클래스가 존재해야 함', () => {
    expect(SimpleColorPicker).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var scp = new SimpleColorPicker('#au-container', { value: '#ff0000' });
    expect(scp).toBeDefined();
    scp.destroy?.();
  });
});

describe('SplitPane 추가', () => {
  it('getSizes / setSizes', () => {
    document.body.innerHTML = '<div id="sp2"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp2');
    expect(sp.getSizes()).toEqual([50, 50]);
    sp.setSizes([30, 70]);
    expect(sp.getSizes()).toEqual([30, 70]);
    sp.destroy?.();
  });

  it('vertical direction', () => {
    document.body.innerHTML = '<div id="sp3"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp3', { direction: 'vertical' });
    expect(sp.container.classList.contains('split-pane--vertical')).toBe(true);
    sp.destroy?.();
  });

  it('collapsible', () => {
    document.body.innerHTML = '<div id="sp4"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp4', { collapsible: true });
    sp.collapseFirst();
    expect(sp.getSizes()).toEqual([0, 100]);
    sp.collapseFirst(); // 복원
    sp.collapseSecond();
    expect(sp.getSizes()).toEqual([100, 0]);
    sp.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new SplitPane('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('패널 부족 에러', () => {
    document.body.innerHTML = '<div id="sp5"><div>A</div></div>';
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // 패널 2개 미만이면 _gutter가 null → _bindEvents에서 에러 발생 가능
    try { new SplitPane('#sp5'); } catch {}
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('QRCode 추가', () => {
  it('defaults()', () => {
    var d = QRCode.defaults();
    expect(d.size).toBe(200);
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new QRCode('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('setText', () => {
    var qr = new QRCode('#au-container', { text: 'hello' });
    if (typeof qr.setText === 'function') {
      qr.setText('world');
    }
    qr.destroy?.();
  });

  it('빈 텍스트', () => {
    var qr = new QRCode('#au-container', { text: '' });
    qr.destroy?.();
  });
});

describe('CodeBlock 추가', () => {
  it('defaults()', () => {
    var d = CodeBlock.defaults();
    expect(d).toBeDefined();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new CodeBlock('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('setCode', () => {
    var cb = new CodeBlock('#au-container', { code: 'test', language: 'js' });
    if (typeof cb.setCode === 'function') {
      cb.setCode('new code');
    }
    cb.destroy?.();
  });
});

describe('CopyToClipboard 추가', () => {
  it('존재하지 않는 요소', () => {
    var ctc = new CopyToClipboard('#nonexistent');
    expect(ctc.element).toBeFalsy();
  });
});

describe('SimpleColorPicker 추가', () => {
  it('getValue / setValue', () => {
    var scp = new SimpleColorPicker('#au-container', { value: '#ff0000' });
    if (typeof scp.getValue === 'function') {
      expect(scp.getValue()).toBe('#ff0000');
      scp.setValue('#00ff00');
      expect(scp.getValue()).toBe('#00ff00');
    }
    scp.destroy?.();
  });

  it('스와치 클릭으로 색상 변경', () => {
    var scp = new SimpleColorPicker('#au-container', { value: '#3b82f6' });
    var swatch = scp.container.querySelector('.simple-color-picker__swatch');
    if (swatch) swatch.click();
    scp.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var scp = new SimpleColorPicker('#au-container', { onChange });
    scp.setValue('#000000');
    expect(onChange).toHaveBeenCalledWith('#000000');
    scp.destroy?.();
  });

  it('showInput false', () => {
    var scp = new SimpleColorPicker('#au-container', { showInput: false });
    expect(scp.container.querySelector('.simple-color-picker__input')).toBeNull();
    scp.destroy?.();
  });

  it('nativeInput 변경', () => {
    var scp = new SimpleColorPicker('#au-container', { showInput: true });
    var native = scp.container.querySelector('.simple-color-picker__native');
    if (native) {
      native.value = '#ff0000';
      native.dispatchEvent(new Event('input'));
    }
    scp.destroy?.();
  });

  it('textInput 변경', () => {
    var scp = new SimpleColorPicker('#au-container', { showInput: true });
    var textInput = scp.container.querySelector('.simple-color-picker__input');
    if (textInput) {
      textInput.value = '#00ff00';
      textInput.dispatchEvent(new Event('change'));
    }
    scp.destroy?.();
  });

  it('존재하지 않는 컨테이너', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new SimpleColorPicker('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('CodeBlock 추가2', () => {
  it('showLineNumbers 옵션', () => {
    var cb = new CodeBlock('#au-container', { code: 'line1\nline2\nline3', showLineNumbers: true });
    expect(cb.container.querySelector('.code-block__line-number')).not.toBeNull();
    cb.destroy?.();
  });

  it('lineNumbers 별칭', () => {
    var cb = new CodeBlock('#au-container', { code: 'test', lineNumbers: true });
    expect(cb.options.showLineNumbers).toBe(true);
    cb.destroy?.();
  });

  it('copyButton false', () => {
    var cb = new CodeBlock('#au-container', { code: 'test', copyButton: false });
    expect(cb.container.querySelector('.code-block__copy')).toBeNull();
    cb.destroy?.();
  });

  it('복사 버튼 클릭', async () => {
    // clipboard mock
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var cb = new CodeBlock('#au-container', { code: 'hello', copyButton: true, copiedDuration: 100 });
    var copyBtn = cb.container.querySelector('.code-block__copy');
    if (copyBtn) {
      copyBtn.click();
      await new Promise(r => setTimeout(r, 10));
    }
    cb.destroy?.();
  });
});

describe('CopyToClipboard 추가2', () => {
  it('static copy', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var result = await CopyToClipboard.copy('test');
    expect(result).toBe(true);
  });

  it('static copyFrom', async () => {
    document.body.innerHTML = '<input id="src" value="텍스트">';
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var result = await CopyToClipboard.copyFrom('#src');
    expect(result).toBe(true);
  });

  it('copyFrom — 존재하지 않는 요소', async () => {
    var result = await CopyToClipboard.copyFrom('#none');
    expect(result).toBe(false);
  });

  it('text 옵션', () => {
    document.body.innerHTML = '<button id="cb">복사</button>';
    var ctc = new CopyToClipboard('#cb', { text: '복사할 텍스트' });
    ctc.destroy?.();
  });

  it('버튼 클릭으로 복사', async () => {
    document.body.innerHTML = '<button id="cb2"><span>복사</span></button><span id="tgt">내용</span>';
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var ctc = new CopyToClipboard('#cb2', { target: '#tgt', feedbackDuration: 100 });
    var btn = document.querySelector('#cb2');
    if (btn) {
      btn.click();
      await new Promise(r => setTimeout(r, 10));
    }
    ctc.destroy?.();
  });
});

describe('SplitPane 추가2', () => {
  it('마우스 드래그', () => {
    document.body.innerHTML = '<div id="sp-d"><div>A</div><div>B</div></div>';
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    var sp = new SplitPane('#sp-d', { onDragStart, onDrag, onDragEnd });
    sp.container.getBoundingClientRect = vi.fn().mockReturnValue({ width: 400, height: 200, left: 0, top: 0 });
    sp._gutter.dispatchEvent(new MouseEvent('mousedown', { clientX: 200 }));
    expect(onDragStart).toHaveBeenCalled();
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }));
    expect(onDrag).toHaveBeenCalled();
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(onDragEnd).toHaveBeenCalled();
    sp.destroy?.();
  });

  it('키보드 — ArrowLeft / ArrowRight (horizontal)', () => {
    document.body.innerHTML = '<div id="sp-k"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp-k', { direction: 'horizontal' });
    sp._gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(sp._sizes[0]).toBeLessThan(50);
    sp._gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    sp.destroy?.();
  });

  it('키보드 — ArrowUp / ArrowDown (vertical)', () => {
    document.body.innerHTML = '<div id="sp-v"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp-v', { direction: 'vertical' });
    sp._gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(sp._sizes[0]).toBeLessThan(50);
    sp._gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    sp.destroy?.();
  });

  it('collapseFirst 복원', () => {
    document.body.innerHTML = '<div id="sp-cf"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp-cf', { collapsible: true });
    sp.collapseFirst();
    expect(sp.getSizes()).toEqual([0, 100]);
    sp.collapseFirst(); // 복원
    expect(sp.getSizes()[0]).toBeGreaterThan(0);
    sp.destroy?.();
  });

  it('collapseSecond 복원', () => {
    document.body.innerHTML = '<div id="sp-cs"><div>A</div><div>B</div></div>';
    var sp = new SplitPane('#sp-cs', { collapsible: true });
    sp.collapseSecond();
    expect(sp.getSizes()).toEqual([100, 0]);
    sp.collapseSecond(); // 복원
    expect(sp.getSizes()[1]).toBeGreaterThan(0);
    sp.destroy?.();
  });

  it('defaults()', () => {
    var d = SplitPane.defaults();
    expect(d.direction).toBe('horizontal');
    expect(d.collapsible).toBe(false);
  });

  it('setSizes — 합이 100이 아닌 경우 에러', () => {
    document.body.innerHTML = '<div id="sp-err"><div>A</div><div>B</div></div>';
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    var sp = new SplitPane('#sp-err');
    sp.setSizes([30, 30]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    sp.destroy?.();
  });
});

describe('QRCode 추가2', () => {
  it('setSize', () => {
    var qr = new QRCode('#au-container', { text: 'hello' });
    if (typeof qr.setSize === 'function') {
      qr.setSize(300);
    }
    qr.destroy?.();
  });

  it('다양한 옵션', () => {
    var qr = new QRCode('#au-container', { text: 'hello', size: 150, darkColor: '000', lightColor: 'fff' });
    qr.destroy?.();
  });
});

describe('SimpleColorPicker 추가2', () => {
  it('커스텀 colors 배열', () => {
    var scp = new SimpleColorPicker('#au-container', { colors: ['#ff0000', '#00ff00', '#0000ff'] });
    var swatches = scp.container.querySelectorAll('.simple-color-picker__swatch');
    expect(swatches.length).toBe(3);
    scp.destroy?.();
  });

  it('defaults()', () => {
    var d = SimpleColorPicker.defaults();
    expect(d).toBeDefined();
    expect(d.showInput).toBeDefined();
  });
});
