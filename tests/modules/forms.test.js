/**
 * Forms Module 테스트
 * FileUpload, Rating, SignaturePad, FormWizard
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let FileUpload, Rating, SignaturePad, FormWizard;

beforeEach(async () => {
  const mod = await import('../../src/modules/forms.js');
  FileUpload = mod.FileUpload || mod.default?.FileUpload;
  Rating = mod.Rating || mod.default?.Rating;
  SignaturePad = mod.SignaturePad || mod.default?.SignaturePad;
  FormWizard = mod.FormWizard || mod.default?.FormWizard;
  document.body.innerHTML = '<div id="form-container"><input id="file-input" type="file"><div id="rating-container"></div><canvas id="sig-pad"></canvas></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('FileUpload', () => {
  it('FileUpload 클래스가 존재해야 함', () => {
    expect(FileUpload).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var fu = new FileUpload('#file-input');
    expect(fu).toBeDefined();
    fu.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = FileUpload.defaults();
    expect(d).toBeDefined();
    expect(d.multiple).toBeDefined();
  });

  it('destroy()로 정리되어야 함', () => {
    var fu = new FileUpload('#file-input');
    if (fu && typeof fu.destroy === 'function') {
      fu.destroy();
    }
  });
});

describe('Rating', () => {
  it('Rating 클래스가 존재해야 함', () => {
    expect(Rating).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var r = new Rating('#rating-container', { maxRating: 5, value: 3 });
    expect(r).toBeDefined();
    r.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Rating.defaults();
    expect(d.max).toBeDefined();
  });

  it('destroy()로 정리되어야 함', () => {
    var r = new Rating('#rating-container');
    if (r && typeof r.destroy === 'function') {
      r.destroy();
    }
  });
});

describe('SignaturePad', () => {
  it('SignaturePad 클래스가 존재해야 함', () => {
    expect(SignaturePad).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    // jsdom에 canvas 2d context 미구현 — prototype mock
    var mockCtx = {
      lineCap: '', lineJoin: '', lineWidth: 1, strokeStyle: '', fillStyle: '',
      beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
      clearRect: vi.fn(), fillRect: vi.fn(), save: vi.fn(), restore: vi.fn(),
      arc: vi.fn(), fill: vi.fn(), getImageData: vi.fn().mockReturnValue({ data: [] }),
      putImageData: vi.fn(), drawImage: vi.fn(), toDataURL: vi.fn().mockReturnValue('')
    };
    var origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
    var sp = new SignaturePad('#sig-pad');
    expect(sp).toBeDefined();
    sp.destroy?.();
    HTMLCanvasElement.prototype.getContext = origGetContext;
  });
});

describe('FormWizard', () => {
  it('FormWizard 클래스가 존재해야 함', () => {
    expect(FormWizard).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    document.body.innerHTML = '<div id="wizard-container"></div>';
    var fw = new FormWizard('#wizard-container', {
      steps: [
        { title: '단계 1', content: '<p>내용 1</p>' },
        { title: '단계 2', content: '<p>내용 2</p>' }
      ]
    });
    expect(fw).toBeDefined();
    fw.destroy?.();
  });
});

describe('FileUpload 추가', () => {
  it('getFiles / clear', () => {
    var fu = new FileUpload('#file-input');
    expect(fu.getFiles()).toEqual([]);
    fu.clear();
    expect(fu.getFiles()).toEqual([]);
    fu.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var fu = new FileUpload('#nonexistent');
    expect(fu.element).toBeFalsy();
  });

  it('dropzone false', () => {
    var fu = new FileUpload('#file-input', { dropzone: false });
    expect(fu.dropzone).toBeFalsy();
    fu.destroy?.();
  });

  it('preview false', () => {
    var fu = new FileUpload('#file-input', { preview: false });
    expect(fu.previewContainer).toBeFalsy();
    fu.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var fu = new FileUpload('#file-input', { onChange });
    fu.clear();
    fu.destroy?.();
  });
});

describe('FileUpload 파일 처리', () => {
  it('파일 추가 및 프리뷰', () => {
    var fu = new FileUpload('#file-input', { preview: true, showProgress: true });
    var mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(mockFile, 'size', { value: 100 });
    fu._handleFiles([mockFile]);
    expect(fu.getFiles().length).toBe(1);
    fu.destroy?.();
  });

  it('파일 타입 거부', () => {
    const onError = vi.fn();
    var fu = new FileUpload('#file-input', { accept: '.pdf', onError });
    var mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    fu._handleFiles([mockFile]);
    expect(onError).toHaveBeenCalled();
    expect(fu.getFiles().length).toBe(0);
    fu.destroy?.();
  });

  it('파일 크기 초과', () => {
    const onError = vi.fn();
    var fu = new FileUpload('#file-input', { maxSize: 10, onError });
    var mockFile = new File(['a'.repeat(100)], 'big.txt', { type: 'text/plain' });
    Object.defineProperty(mockFile, 'size', { value: 99999 });
    fu._handleFiles([mockFile]);
    expect(onError).toHaveBeenCalled();
    fu.destroy?.();
  });

  it('최대 파일 수 제한', () => {
    const onError = vi.fn();
    var fu = new FileUpload('#file-input', { maxFiles: 1, onError });
    var f1 = new File(['a'], 'a.txt', { type: 'text/plain' });
    var f2 = new File(['b'], 'b.txt', { type: 'text/plain' });
    Object.defineProperty(f1, 'size', { value: 1 });
    Object.defineProperty(f2, 'size', { value: 1 });
    fu._handleFiles([f1, f2]);
    expect(fu.getFiles().length).toBe(1);
    fu.destroy?.();
  });

  it('_isValidFileType — MIME 와일드카드', () => {
    var fu = new FileUpload('#file-input', { accept: 'image/*' });
    var imgFile = new File([''], 'img.png', { type: 'image/png' });
    expect(fu._isValidFileType(imgFile)).toBe(true);
    var txtFile = new File([''], 't.txt', { type: 'text/plain' });
    expect(fu._isValidFileType(txtFile)).toBe(false);
    fu.destroy?.();
  });

  it('_isValidFileType — 정확한 MIME', () => {
    var fu = new FileUpload('#file-input', { accept: 'application/pdf' });
    var pdfFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
    expect(fu._isValidFileType(pdfFile)).toBe(true);
    fu.destroy?.();
  });

  it('_removeFile', () => {
    const onRemove = vi.fn();
    var fu = new FileUpload('#file-input', { onRemove });
    var mockFile = new File(['a'], 'a.txt', { type: 'text/plain' });
    Object.defineProperty(mockFile, 'size', { value: 1 });
    fu._handleFiles([mockFile]);
    fu._removeFile('a.txt');
    expect(fu.getFiles().length).toBe(0);
    expect(onRemove).toHaveBeenCalledWith('a.txt');
    fu.destroy?.();
  });

  it('_formatSize', () => {
    var fu = new FileUpload('#file-input');
    expect(fu._formatSize(500)).toContain('B');
    expect(fu._formatSize(5000)).toContain('KB');
    expect(fu._formatSize(5000000)).toContain('MB');
    fu.destroy?.();
  });

  it('setProgress', () => {
    var fu = new FileUpload('#file-input', { preview: true, showProgress: true });
    var mockFile = new File(['a'], 'a.txt', { type: 'text/plain' });
    Object.defineProperty(mockFile, 'size', { value: 1 });
    fu._handleFiles([mockFile]);
    fu.setProgress('a.txt', 50);
    fu.setProgress('a.txt', 100);
    fu.destroy?.();
  });

  it('이미지 파일 프리뷰', () => {
    var fu = new FileUpload('#file-input', { preview: true });
    var imgFile = new File(['img'], 'img.png', { type: 'image/png' });
    Object.defineProperty(imgFile, 'size', { value: 100 });
    fu._handleFiles([imgFile]);
    fu.destroy?.();
  });

  it('dropzone 드래그 이벤트', () => {
    var fu = new FileUpload('#file-input', { dropzone: true });
    if (fu.dropzone) {
      fu.dropzone.dispatchEvent(new Event('dragover', { cancelable: true }));
      fu.dropzone.dispatchEvent(new Event('dragleave'));
    }
    fu.destroy?.();
  });
});

describe('Rating 추가', () => {
  it('getValue / setValue', () => {
    var r = new Rating('#rating-container', { value: 3 });
    expect(r.getValue()).toBe(3);
    r.setValue(5);
    expect(r.getValue()).toBe(5);
    r.destroy?.();
  });

  it('readonly 모드', () => {
    var r = new Rating('#rating-container', { value: 2, readonly: true });
    expect(r.element.classList.contains('rating--readonly')).toBe(true);
    r.destroy?.();
  });

  it('별 클릭으로 값 변경', () => {
    var r = new Rating('#rating-container', { value: 0 });
    var star = r.element.querySelector('[data-value="3"]');
    if (star) star.click();
    expect(r.getValue()).toBe(3);
    r.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var r = new Rating('#nonexistent');
    expect(r.element).toBeFalsy();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var r = new Rating('#rating-container', { onChange });
    r.setValue(4);
    expect(onChange).toHaveBeenCalledWith(4);
    r.destroy?.();
  });

  it('size sm', () => {
    var r = new Rating('#rating-container', { size: 'sm' });
    expect(r.element.classList.contains('rating--sm')).toBe(true);
    r.destroy?.();
  });

  it('mouseover / mouseout 하이라이트', () => {
    var r = new Rating('#rating-container', { value: 0 });
    var star = r.element.querySelector('[data-value="4"]');
    if (star) {
      star.dispatchEvent(new Event('mouseover', { bubbles: true }));
    }
    r.element.dispatchEvent(new Event('mouseout', { bubbles: true }));
    r.destroy?.();
  });

  it('setValue 범위 제한', () => {
    var r = new Rating('#rating-container', { max: 5 });
    r.setValue(10);
    expect(r.getValue()).toBe(5);
    r.setValue(-1);
    expect(r.getValue()).toBe(0);
    r.destroy?.();
  });
});

describe('SignaturePad 추가', () => {
  var mockCtx;
  var origGetContext;

  beforeEach(() => {
    mockCtx = {
      lineCap: '', lineJoin: '', lineWidth: 1, strokeStyle: '', fillStyle: '',
      beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
      clearRect: vi.fn(), fillRect: vi.fn(), save: vi.fn(), restore: vi.fn(),
      arc: vi.fn(), fill: vi.fn(), getImageData: vi.fn().mockReturnValue({ data: [] }),
      putImageData: vi.fn(), drawImage: vi.fn()
    };
    origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,xxx');
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = origGetContext;
  });

  it('isEmpty / clear', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    expect(sp.isEmpty()).toBe(true);
    sp.clear();
    expect(sp.isEmpty()).toBe(true);
    sp.destroy?.();
  });

  it('toDataURL', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    var url = sp.toDataURL();
    expect(url).toContain('data:image');
    sp.destroy?.();
  });

  it('마우스 드로잉 시뮬레이션', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    sp.canvas.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, top: 0 });
    sp.canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true }));
    expect(sp.isDrawing).toBe(true);
    sp.canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20, bubbles: true }));
    sp.canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(sp.isDrawing).toBe(false);
    expect(sp.isEmpty()).toBe(false);
    sp.destroy?.();
  });

  it('툴바 — clear 버튼', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    var clearBtn = sp.toolbar.querySelector('[data-action="clear"]');
    if (clearBtn) clearBtn.click();
    expect(sp.isEmpty()).toBe(true);
    sp.destroy?.();
  });

  it('툴바 — save 버튼', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    var saveBtn = sp.toolbar.querySelector('[data-action="save"]');
    if (saveBtn) saveBtn.click();
    sp.destroy?.();
  });

  it('onBegin / onEnd 콜백', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    const onBegin = vi.fn();
    const onEnd = vi.fn();
    var sp = new SignaturePad('#sp-wrap', { onBegin, onEnd });
    sp.canvas.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, top: 0 });
    sp.canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 5, clientY: 5, bubbles: true }));
    expect(onBegin).toHaveBeenCalled();
    sp.canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(onEnd).toHaveBeenCalled();
    sp.destroy?.();
  });

  it('mouseleave로 드로잉 중지', () => {
    document.body.innerHTML = '<div id="sp-wrap"><canvas id="sp-canvas"></canvas></div>';
    var sp = new SignaturePad('#sp-wrap');
    sp.canvas.getBoundingClientRect = vi.fn().mockReturnValue({ left: 0, top: 0 });
    sp.canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 5, clientY: 5, bubbles: true }));
    sp.canvas.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(sp.isDrawing).toBe(false);
    sp.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var sp = new SignaturePad('#nonexistent');
    expect(sp.element).toBeFalsy();
  });
});

describe('FormWizard 추가', () => {
  it('next / prev / getCurrentStep', async () => {
    document.body.innerHTML = '<div id="wz"></div>';
    var fw = new FormWizard('#wz', {
      steps: [
        { title: '1단계', content: '<p>1</p>' },
        { title: '2단계', content: '<p>2</p>' },
        { title: '3단계', content: '<p>3</p>' }
      ]
    });
    expect(fw.getCurrentStep()).toBe(0);
    await fw.next();
    expect(fw.getCurrentStep()).toBe(1);
    fw.prev();
    expect(fw.getCurrentStep()).toBe(0);
    fw.destroy?.();
  });

  it('goToStep', () => {
    document.body.innerHTML = '<div id="wz"></div>';
    var fw = new FormWizard('#wz', {
      steps: [{ title: '1', content: '' }, { title: '2', content: '' }]
    });
    fw.goToStep(1);
    expect(fw.getCurrentStep()).toBe(1);
    fw.destroy?.();
  });

  it('onStepChange 콜백', async () => {
    document.body.innerHTML = '<div id="wz"></div>';
    const onStepChange = vi.fn();
    var fw = new FormWizard('#wz', {
      steps: [{ title: '1', content: '' }, { title: '2', content: '' }],
      onStepChange
    });
    await fw.next();
    expect(onStepChange).toHaveBeenCalled();
    fw.destroy?.();
  });

  it('onComplete 콜백 (submit)', async () => {
    document.body.innerHTML = '<div id="wz"></div>';
    const onComplete = vi.fn();
    var fw = new FormWizard('#wz', {
      steps: [
        { title: '1', content: '<input name="field1" value="val1">' },
        { title: '2', content: '<input name="field2" value="val2">' }
      ],
      onComplete
    });
    await fw.next();
    await fw._submit();
    expect(onComplete).toHaveBeenCalled();
    fw.destroy?.();
  });

  it('validate 실패 시 이동 불가', async () => {
    document.body.innerHTML = '<div id="wz"></div>';
    const onValidationError = vi.fn();
    var fw = new FormWizard('#wz', {
      steps: [
        { title: '1', content: '', validate: () => false },
        { title: '2', content: '' }
      ],
      onValidationError
    });
    await fw.next();
    expect(fw.getCurrentStep()).toBe(0);
    expect(onValidationError).toHaveBeenCalled();
    fw.destroy?.();
  });

  it('showProgress false / showNavigation false', () => {
    document.body.innerHTML = '<div id="wz"></div>';
    var fw = new FormWizard('#wz', {
      steps: [{ title: '1', content: '' }],
      showProgress: false,
      showNavigation: false
    });
    fw.destroy?.();
  });

  it('존재하지 않는 요소', () => {
    var fw = new FormWizard('#nonexistent');
    expect(fw.element).toBeFalsy();
  });
});
