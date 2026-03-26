/**
 * Advanced UI Module
 * Split Pane, QR Code Generator, Copy to Clipboard
 * @module modules/advanced-ui
 */

import { Security } from '../core/security.js';
import { Config } from '../core/config.js';

// ============================================
// SplitPane - 분할 패널
// ============================================

/**
 * SplitPane 클래스
 * 크기 조절 가능한 분할 패널
 */
class SplitPane {
  /** @type {Map<HTMLElement, SplitPane>} */
  static instances = new Map();

  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      direction: 'horizontal', // 'horizontal' | 'vertical'
      initialSizes: [50, 50],  // 퍼센트
      minSizes: [100, 100],    // 최소 크기 (px)
      maxSizes: [Infinity, Infinity], // 최대 크기 (px)
      gutterSize: 8,           // 구분선 크기 (px)
      snapOffset: 30,          // 스냅 오프셋 (px)
      collapsible: false,      // 접기 가능 여부
      onDragStart: null,       // () => {}
      onDrag: null,            // (sizes) => {}
      onDragEnd: null         // (sizes) => {}
    };
  }

  /**
   * @param {string|HTMLElement} selector
   * @param {Object} options
   */
  constructor(selector, options = {}) {
    this.container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this.container) {
      console.error('SplitPane: Container not found');
      return;
    }

    this.options = Config.getFor('splitPane', { ...SplitPane.defaults(), ...options });
    this._sizes = [...this.options.initialSizes];
    this._dragging = false;
    this._startPos = 0;
    this._startSizes = [];
    this._gutter = null;
    this._panes = [];

    // 이벤트 핸들러
    this._onMouseDown = null;
    this._onMouseMove = null;
    this._onMouseUp = null;
    this._onTouchStart = null;
    this._onTouchMove = null;
    this._onTouchEnd = null;

    this.init();
    SplitPane.instances.set(this.container, this);
  }

  init() {
    this._render();
    this._bindEvents();
    this._updateSizes();
  }

  _render() {
    const { direction, gutterSize } = this.options;

    this.container.classList.add('split-pane', `split-pane--${direction}`);

    // 기존 자식 요소를 panes로
    this._panes = Array.from(this.container.children).filter(
      child => !child.classList.contains('split-pane__gutter')
    );

    if (this._panes.length < 2) {
      console.error('SplitPane: At least 2 panes required');
      return;
    }

    // 첫 번째 pane 클래스 추가
    this._panes[0].classList.add('split-pane__panel', 'split-pane__panel--first');
    this._panes[1].classList.add('split-pane__panel', 'split-pane__panel--second');

    // 구분선 생성
    this._gutter = document.createElement('div');
    this._gutter.className = 'split-pane__gutter';
    this._gutter.setAttribute('role', 'separator');
    this._gutter.setAttribute('aria-orientation', direction);
    this._gutter.setAttribute('tabindex', '0');

    if (direction === 'horizontal') {
      this._gutter.style.width = `${gutterSize}px`;
    } else {
      this._gutter.style.height = `${gutterSize}px`;
    }

    // 구분선을 첫 번째와 두 번째 패널 사이에 삽입
    this._panes[0].after(this._gutter);
  }

  _bindEvents() {
    // 마우스 이벤트
    this._onMouseDown = (e) => this._startDrag(e);
    this._onMouseMove = (e) => this._onDrag(e);
    this._onMouseUp = () => this._endDrag();

    this._gutter.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);

    // 터치 이벤트
    this._onTouchStart = (e) => this._startDrag(e.touches[0]);
    this._onTouchMove = (e) => this._onDrag(e.touches[0]);
    this._onTouchEnd = () => this._endDrag();

    this._gutter.addEventListener('touchstart', this._onTouchStart, { passive: true });
    document.addEventListener('touchmove', this._onTouchMove, { passive: true });
    document.addEventListener('touchend', this._onTouchEnd);

    // 키보드 이벤트
    this._onKeydown = (e) => {
      const step = 5;
      const { direction } = this.options;

      if (direction === 'horizontal') {
        if (e.key === 'ArrowLeft') {
          this._sizes[0] = Math.max(this._sizes[0] - step, 0);
          this._sizes[1] = 100 - this._sizes[0];
          this._updateSizes();
        } else if (e.key === 'ArrowRight') {
          this._sizes[0] = Math.min(this._sizes[0] + step, 100);
          this._sizes[1] = 100 - this._sizes[0];
          this._updateSizes();
        }
      } else {
        if (e.key === 'ArrowUp') {
          this._sizes[0] = Math.max(this._sizes[0] - step, 0);
          this._sizes[1] = 100 - this._sizes[0];
          this._updateSizes();
        } else if (e.key === 'ArrowDown') {
          this._sizes[0] = Math.min(this._sizes[0] + step, 100);
          this._sizes[1] = 100 - this._sizes[0];
          this._updateSizes();
        }
      }
    };
    this._gutter.addEventListener('keydown', this._onKeydown);
  }

  _startDrag(e) {
    this._dragging = true;
    this._startPos = this.options.direction === 'horizontal' ? e.clientX : e.clientY;
    this._startSizes = [...this._sizes];

    this.container.classList.add('is-dragging');
    document.body.style.cursor = this.options.direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    if (this.options.onDragStart) {
      this.options.onDragStart();
    }
  }

  _onDrag(e) {
    if (!this._dragging) return;

    const { direction, gutterSize, minSizes, maxSizes } = this.options;
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const containerRect = this.container.getBoundingClientRect();
    const containerSize = direction === 'horizontal'
      ? containerRect.width - gutterSize
      : containerRect.height - gutterSize;

    const delta = currentPos - this._startPos;
    const deltaPercent = (delta / containerSize) * 100;

    let newSize0 = this._startSizes[0] + deltaPercent;
    let newSize1 = this._startSizes[1] - deltaPercent;

    // 최소/최대 크기 제한
    const minPercent0 = (minSizes[0] / containerSize) * 100;
    const minPercent1 = (minSizes[1] / containerSize) * 100;
    const maxPercent0 = Math.min((maxSizes[0] / containerSize) * 100, 100 - minPercent1);
    // maxPercent1은 newSize1 계산에 직접 사용되지 않음 (100 - newSize0으로 계산)

    newSize0 = Math.max(minPercent0, Math.min(maxPercent0, newSize0));
    newSize1 = 100 - newSize0;

    if (newSize1 < minPercent1) {
      newSize1 = minPercent1;
      newSize0 = 100 - newSize1;
    }

    this._sizes = [newSize0, newSize1];
    this._updateSizes();

    if (this.options.onDrag) {
      this.options.onDrag([...this._sizes]);
    }
  }

  _endDrag() {
    if (!this._dragging) return;

    this._dragging = false;
    this.container.classList.remove('is-dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    if (this.options.onDragEnd) {
      this.options.onDragEnd([...this._sizes]);
    }
  }

  _updateSizes() {
    const { direction, gutterSize } = this.options;
    const prop = direction === 'horizontal' ? 'width' : 'height';

    this._panes[0].style[prop] = `calc(${this._sizes[0]}% - ${gutterSize / 2}px)`;
    this._panes[1].style[prop] = `calc(${this._sizes[1]}% - ${gutterSize / 2}px)`;
  }

  /**
   * 크기 설정
   * @param {Array<number>} sizes - 퍼센트 배열 [first, second]
   */
  setSizes(sizes) {
    if (sizes.length !== 2 || sizes[0] + sizes[1] !== 100) {
      console.error('SplitPane: Sizes must add up to 100');
      return;
    }
    this._sizes = [...sizes];
    this._updateSizes();
  }

  /**
   * 현재 크기 반환
   * @returns {Array<number>}
   */
  getSizes() {
    return [...this._sizes];
  }

  /**
   * 첫 번째 패널 접기/펼치기
   */
  collapseFirst() {
    if (!this.options.collapsible) return;

    if (this._sizes[0] > 0) {
      this._prevSizes = [...this._sizes];
      this._sizes = [0, 100];
    } else if (this._prevSizes) {
      this._sizes = [...this._prevSizes];
    }
    this._updateSizes();
  }

  /**
   * 두 번째 패널 접기/펼치기
   */
  collapseSecond() {
    if (!this.options.collapsible) return;

    if (this._sizes[1] > 0) {
      this._prevSizes = [...this._sizes];
      this._sizes = [100, 0];
    } else if (this._prevSizes) {
      this._sizes = [...this._prevSizes];
    }
    this._updateSizes();
  }

  destroy() {
    if (this._gutter) {
      if (this._onMouseDown) this._gutter.removeEventListener('mousedown', this._onMouseDown);
      if (this._onTouchStart) this._gutter.removeEventListener('touchstart', this._onTouchStart);
      if (this._onKeydown) this._gutter.removeEventListener('keydown', this._onKeydown);
    }
    if (this._onMouseMove) {
      document.removeEventListener('mousemove', this._onMouseMove);
    }
    if (this._onMouseUp) {
      document.removeEventListener('mouseup', this._onMouseUp);
    }
    if (this._onTouchMove) {
      document.removeEventListener('touchmove', this._onTouchMove);
    }
    if (this._onTouchEnd) {
      document.removeEventListener('touchend', this._onTouchEnd);
    }

    if (this._gutter) {
      this._gutter.remove();
    }

    this.container.classList.remove('split-pane', 'split-pane--horizontal', 'split-pane--vertical');

    SplitPane.instances.delete(this.container);
    this.container = null;
    this._gutter = null;
    this._panes = null;
  }
}


// ============================================
// QRCode - QR 코드 생성기
// ============================================

/**
 * QRCode 클래스
 * QR 코드 생성 (QR Server API 사용 - 실제 스캔 가능)
 */
class QRCode {
  /** @type {Map<HTMLElement, QRCode>} */
  static instances = new Map();

  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      text: '',
      size: 200,
      colorDark: '000000',      // hex without #
      colorLight: 'ffffff',     // hex without #
      correctLevel: 'M',        // 'L' | 'M' | 'Q' | 'H'
      margin: 4,                // 여백 (모듈 단위)
      format: 'png'            // 'png' | 'svg'
    };
  }

  /**
   * @param {string|HTMLElement} selector
   * @param {Object} options
   */
  constructor(selector, options = {}) {
    this.container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this.container) {
      console.error('QRCode: Container not found');
      return;
    }

    this.options = Config.getFor('qrCode', { ...QRCode.defaults(), ...options });
    this.image = null;
    this._imageUrl = '';

    this.init();
    QRCode.instances.set(this.container, this);
  }

  init() {
    this._render();
  }

  _render() {
    const { text, size, colorDark, colorLight, correctLevel, margin, format } = this.options;

    if (!text) {
      this.container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-tertiary);">텍스트를 입력하세요</div>';
      return;
    }

    // QR Server API 사용 (무료, 제한 없음)
    const darkColor = colorDark.replace('#', '');
    const lightColor = colorLight.replace('#', '');

    this._imageUrl = 'https://api.qrserver.com/v1/create-qr-code/?' +
      `data=${encodeURIComponent(text)}` +
      `&size=${size}x${size}` +
      `&color=${darkColor}` +
      `&bgcolor=${lightColor}` +
      `&ecc=${correctLevel}` +
      `&margin=${margin}` +
      `&format=${format}`;

    // 이미지 생성
    this.image = document.createElement('img');
    this.image.src = this._imageUrl;
    this.image.alt = 'QR Code';
    this.image.className = 'qr-code';
    this.image.style.cssText = 'max-width: 100%; height: auto; border-radius: 4px;';
    this.image.crossOrigin = 'anonymous';

    // 로딩 표시
    this.container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><div class="spinner"></div></div>';

    this.image.onload = () => {
      this.container.innerHTML = '';
      this.container.appendChild(this.image);
    };

    this.image.onerror = () => {
      this.container.innerHTML = '<div style="color: var(--danger-color); text-align: center;">QR 코드 생성 실패</div>';
    };
  }

  /**
   * 텍스트 변경
   * @param {string} text
   */
  setText(text) {
    this.options.text = text;
    this._render();
  }

  /**
   * 색상 변경
   * @param {string} dark - 전경색 (hex)
   * @param {string} light - 배경색 (hex)
   */
  setColors(dark, light) {
    this.options.colorDark = dark.replace('#', '');
    this.options.colorLight = light.replace('#', '');
    this._render();
  }

  /**
   * 크기 변경
   * @param {number} size
   */
  setSize(size) {
    this.options.size = size;
    this._render();
  }

  /**
   * 이미지 URL 반환
   * @returns {string}
   */
  getImageUrl() {
    return this._imageUrl;
  }

  /**
   * 이미지 데이터 URL 반환 (Canvas로 변환)
   * @returns {Promise<string>}
   */
  async toDataURL() {
    if (!this.image) return '';

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.options.size;
      canvas.height = this.options.size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.image, 0, 0, this.options.size, this.options.size);
      resolve(canvas.toDataURL('image/png'));
    });
  }

  /**
   * 이미지 다운로드
   * @param {string} [filename='qrcode.png']
   */
  async download(filename = 'qrcode.png') {
    const dataUrl = await this.toDataURL();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  destroy() {
    QRCode.instances.delete(this.container);

    if (this.container) {
      this.container.innerHTML = '';
    }

    this.container = null;
    this.image = null;
  }
}


// ============================================
// CopyToClipboard - 클립보드 복사
// ============================================

/**
 * CopyToClipboard 클래스
 * 버튼에 바인딩하여 대상 요소의 텍스트를 클립보드에 복사
 * 또는 static 메서드로 직접 복사
 */
class CopyToClipboard {
  /** @type {Map<HTMLElement, CopyToClipboard>} */
  static instances = new Map();

  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      target: null,           // 복사 대상 셀렉터 또는 요소
      text: '',               // 직접 복사할 텍스트 (target보다 우선)
      feedbackText: '복사됨!',
      feedbackDuration: 2000,
      onSuccess: null,        // (text) => {}
      onError: null           // (error) => {}
    };
  }

  /**
   * @param {string|HTMLElement} selector - 트리거 버튼
   * @param {Object} options
   */
  constructor(selector, options = {}) {
    this.trigger = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this.trigger) {
      console.error('CopyToClipboard: Trigger not found');
      return;
    }

    this.options = Config.getFor('copyToClipboard', { ...CopyToClipboard.defaults(), ...options });
    this._originalText = this.trigger.textContent;
    this._feedbackTimer = null;
    this._onClick = null;

    this.init();
    CopyToClipboard.instances.set(this.trigger, this);
  }

  init() {
    this._onClick = async () => {
      const text = await this._getText();
      const success = await CopyToClipboard.copy(text);

      if (success) {
        this._showFeedback();
        if (this.options.onSuccess) this.options.onSuccess(text);
      } else {
        if (this.options.onError) this.options.onError(new Error('복사 실패'));
      }
    };
    this.trigger.addEventListener('click', this._onClick);
  }

  async _getText() {
    if (this.options.text) return this.options.text;

    const { target } = this.options;
    if (!target) return this.trigger.textContent || '';

    const el = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!el) return '';
    return el.value || el.textContent || '';
  }

  _showFeedback() {
    const { feedbackText, feedbackDuration } = this.options;
    this.trigger.classList.add('is-copied');

    const span = this.trigger.querySelector('span');
    if (span) span.textContent = feedbackText;

    if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
    this._feedbackTimer = setTimeout(() => {
      this.trigger.classList.remove('is-copied');
      if (span) span.textContent = this._originalText;
    }, feedbackDuration);
  }

  /**
   * 텍스트 복사 (static 유틸리티)
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  static async copy(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      return success;
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  }

  /**
   * 요소의 텍스트 복사 (static 유틸리티)
   * @param {string|HTMLElement} selector
   * @returns {Promise<boolean>}
   */
  static async copyFrom(selector) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!element) return false;

    const text = element.value || element.textContent || '';
    return CopyToClipboard.copy(text);
  }

  destroy() {
    if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
    if (this._onClick && this.trigger) {
      this.trigger.removeEventListener('click', this._onClick);
    }
    CopyToClipboard.instances.delete(this.trigger);
    this.trigger = null;
  }
}


// ============================================
// CodeBlock - 코드 블록 (복사 기능 포함)
// ============================================

/**
 * CodeBlock 클래스
 * 복사 버튼이 있는 코드 블록
 */
class CodeBlock {
  /** @type {Map<HTMLElement, CodeBlock>} */
  static instances = new Map();

  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      code: '',
      language: 'javascript',
      showLineNumbers: false,
      lineNumbers: false,      // showLineNumbers 별칭
      copyButton: true,
      copyText: '복사',
      copiedText: '복사됨!',
      copiedDuration: 2000
    };
  }

  /**
   * @param {string|HTMLElement} selector
   * @param {Object} options
   */
  constructor(selector, options = {}) {
    this.container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this.container) {
      console.error('CodeBlock: Container not found');
      return;
    }

    this.options = Config.getFor('codeBlock', { ...CodeBlock.defaults(), ...options });
    // lineNumbers 별칭 지원
    if (this.options.lineNumbers && !this.options.showLineNumbers) {
      this.options.showLineNumbers = true;
    }
    this._copyTimer = null;
    this._onCopy = null;

    this.init();
    CodeBlock.instances.set(this.container, this);
  }

  init() {
    this._render();
    this._bindEvents();
  }

  _render() {
    const { code, language, showLineNumbers, copyButton, copyText } = this.options;

    this.container.className = 'code-block';

    let codeContent = code;
    if (showLineNumbers) {
      const lines = code.split('\n');
      codeContent = lines.map((line, i) =>
        `<span class="code-block__line-number">${i + 1}</span>${this._escapeHtml(line)}`
      ).join('\n');
    } else {
      codeContent = this._escapeHtml(code);
    }

    this.container.innerHTML = `
      <div class="code-block__header">
        <span class="code-block__language">${Security.escape(language)}</span>
        ${copyButton ? `
          <button class="code-block__copy" type="button">
            <i class="material-icons-outlined">content_copy</i>
            <span>${Security.escape(copyText)}</span>
          </button>
        ` : ''}
      </div>
      <pre class="code-block__pre"><code class="code-block__code">${codeContent}</code></pre>
    `;

    this._copyBtn = this.container.querySelector('.code-block__copy');
  }

  _escapeHtml(text) {
    return Security.escape(text);
  }

  _bindEvents() {
    if (this._copyBtn) {
      this._onCopy = async () => {
        const success = await CopyToClipboard.copy(this.options.code);

        if (success) {
          const span = this._copyBtn.querySelector('span');
          const icon = this._copyBtn.querySelector('i');

          span.textContent = this.options.copiedText;
          icon.textContent = 'check';
          this._copyBtn.classList.add('is-copied');

          if (this._copyTimer) clearTimeout(this._copyTimer);
          this._copyTimer = setTimeout(() => {
            span.textContent = this.options.copyText;
            icon.textContent = 'content_copy';
            this._copyBtn.classList.remove('is-copied');
          }, this.options.copiedDuration);
        }
      };

      this._copyBtn.addEventListener('click', this._onCopy);
    }
  }

  /**
   * 코드 변경
   * @param {string} code
   */
  setCode(code) {
    this.options.code = code;
    this._render();
    this._bindEvents();
  }

  destroy() {
    if (this._copyTimer) {
      clearTimeout(this._copyTimer);
    }

    if (this._onCopy && this._copyBtn) {
      this._copyBtn.removeEventListener('click', this._onCopy);
    }

    CodeBlock.instances.delete(this.container);

    if (this.container) {
      this.container.innerHTML = '';
    }

    this.container = null;
    this._copyBtn = null;
  }
}


// ============================================
// ColorPicker (Simple) - 간단한 색상 선택기
// ============================================

/**
 * SimpleColorPicker 클래스
 * 프리셋 색상 선택기
 */
class SimpleColorPicker {
  /** @type {Map<HTMLElement, SimpleColorPicker>} */
  static instances = new Map();

  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      colors: [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e', '#64748b', '#1f2937', '#000000'
      ],
      value: '#3b82f6',
      showInput: true,
      onChange: null
    };
  }

  /**
   * @param {string|HTMLElement} selector
   * @param {Object} options
   */
  constructor(selector, options = {}) {
    this.container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this.container) {
      console.error('SimpleColorPicker: Container not found');
      return;
    }

    this.options = Config.getFor('simpleColorPicker', { ...SimpleColorPicker.defaults(), ...options });
    this._value = this.options.value;
    this._onSwatchClick = null;
    this._onInputChange = null;

    this.init();
    SimpleColorPicker.instances.set(this.container, this);
  }

  init() {
    this._render();
    this._bindEvents();
  }

  _render() {
    const { colors, showInput } = this.options;

    this.container.className = 'simple-color-picker';

    const swatches = colors.map(color => {
      const safe = Security.validateColor(color) || '#000000';
      return `
      <button 
        type="button" 
        class="simple-color-picker__swatch ${color === this._value ? 'is-active' : ''}" 
        data-color="${Security.escape(safe)}"
        style="background: ${Security.sanitizeCSS(safe)};"
        aria-label="${Security.escape(safe)}"
      ></button>
    `;
    }).join('');

    this.container.innerHTML = `
      <div class="simple-color-picker__swatches">${swatches}</div>
      ${showInput ? `
        <div class="simple-color-picker__input-wrap">
          <input 
            type="color" 
            class="simple-color-picker__native" 
            value="${this._value}"
          >
          <input 
            type="text" 
            class="simple-color-picker__input" 
            value="${this._value}"
            maxlength="7"
          >
        </div>
      ` : ''}
    `;

    this._swatches = this.container.querySelectorAll('.simple-color-picker__swatch');
    this._nativeInput = this.container.querySelector('.simple-color-picker__native');
    this._textInput = this.container.querySelector('.simple-color-picker__input');
  }

  _bindEvents() {
    // 스와치 클릭
    this._onSwatchClick = (e) => {
      const swatch = e.target.closest('.simple-color-picker__swatch');
      if (!swatch) return;

      this._setValue(swatch.dataset.color);
    };

    this.container.addEventListener('click', this._onSwatchClick);

    // 입력 변경 (참조 보관하여 destroy 시 제거)
    if (this._nativeInput) {
      this._onNativeInput = (e) => {
        this._setValue(e.target.value);
      };
      this._nativeInput.addEventListener('input', this._onNativeInput);
    }

    if (this._textInput) {
      this._onTextChange = (e) => {
        const value = e.target.value;
        if (Security.validateColor(value)) {
          this._setValue(value);
        }
      };
      this._textInput.addEventListener('change', this._onTextChange);
    }
  }

  _setValue(color) {
    const safe = Security.validateColor(color) || this.options.value;
    this._value = safe;

    // 스와치 업데이트
    this._swatches.forEach(swatch => {
      swatch.classList.toggle('is-active', swatch.dataset.color === safe);
    });

    // 입력 업데이트
    if (this._nativeInput) this._nativeInput.value = safe;
    if (this._textInput) this._textInput.value = safe;

    if (this.options.onChange) {
      this.options.onChange(safe);
    }
  }

  /**
   * 색상 설정
   * @param {string} color
   */
  setValue(color) {
    this._setValue(color);
  }

  /**
   * 현재 색상 반환
   * @returns {string}
   */
  getValue() {
    return this._value;
  }

  destroy() {
    if (this._onSwatchClick) {
      this.container.removeEventListener('click', this._onSwatchClick);
    }
    if (this._onNativeInput && this._nativeInput) {
      this._nativeInput.removeEventListener('input', this._onNativeInput);
    }
    if (this._onTextChange && this._textInput) {
      this._textInput.removeEventListener('change', this._onTextChange);
    }

    SimpleColorPicker.instances.delete(this.container);

    if (this.container) {
      this.container.innerHTML = '';
    }

    this.container = null;
  }
}


// ============================================
// Export
// ============================================

export { SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker };
export default { SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker };
