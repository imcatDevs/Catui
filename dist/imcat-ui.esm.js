function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * XSS 보안 필터
 * @module core/security
 */

/**
 * 보안 유틸리티
 * @class
 * @description XSS 공격 방지, HTML 새니타이징, 경로 검증 등의 보안 기능을 제공합니다.
 * 모든 사용자 입력은 자동으로 이스케이프됩니다.
 *
 * @example
 * const safe = Security.escape('<script>alert("XSS")</script>');
 * const clean = Security.sanitize(userHtml);
 */
// escape() 성능 최적화: 매 호출마다 객체 재생성 방지
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};
const ESCAPE_REGEX = /[&<>"'/]/g;
class Security {
  /**
   * HTML 이스케이프
   * @param {string} str - 이스케이프할 문자열
   * @returns {string} 이스케이프된 문자열
   *
   * @example
   * Security.escape('<script>alert("XSS")</script>');
   * // '&lt;script&gt;alert("XSS")&lt;/script&gt;'
   */
  static escape(str) {
    if (typeof str !== 'string') return str;
    return str.replace(ESCAPE_REGEX, char => ESCAPE_MAP[char]);
  }

  /**
   * HTML 새니타이징 (위험한 요소 및 속성 제거)
   * @param {string} html - 새니타이징할 HTML
   * @returns {string} 새니타이징된 HTML
   *
   * @example
   * Security.sanitize('<script>alert()</script><p>안전</p>');
   * // '<p>안전</p>'
   */
  static sanitize(html) {
    if (typeof html !== 'string') return '';

    // DOMParser 싱글톤 사용 (성능 최적화)
    if (!Security._parser) {
      Security._parser = new DOMParser();
    }
    const parser = Security._parser;
    const doc = parser.parseFromString(html, 'text/html');

    // 위험한 요소 제거
    this._removeDangerousElements(doc.body);

    // 위험한 속성 제거
    this._removeDangerousAttributes(doc.body);
    return doc.body.innerHTML;
  }

  /**
   * 위험한 요소 제거
   * @private
   * @param {HTMLElement} element - 대상 요소
   */
  static _removeDangerousElements(element) {
    const dangerous = ['script', 'iframe', 'object', 'embed', 'link', 'style'];
    dangerous.forEach(tag => {
      const elements = element.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });
  }

  /**
   * 위험한 속성 제거
   * @private
   * @param {HTMLElement} element - 대상 요소
   */
  static _removeDangerousAttributes(element) {
    const all = element.querySelectorAll('*');
    all.forEach(el => {
      // on* 이벤트 핸들러 제거
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }

        // javascript: URL 제거
        if (attr.value && attr.value.trim().toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }

        // data: URL (이미지만 허용)
        if (attr.name === 'src' || attr.name === 'href') {
          if (attr.value && attr.value.trim().toLowerCase().startsWith('data:')) {
            // 이미지 data URL만 허용
            if (!attr.value.trim().toLowerCase().startsWith('data:image/')) {
              el.removeAttribute(attr.name);
            }
          }
        }
      });
    });
  }

  /**
   * 경로 검증 (경로 순회 공격 방지)
   * @param {string} path - 검증할 경로
   * @returns {boolean} 안전한 경로 여부
   *
   * @description
   * views/ 폴더 및 그 하위 폴더의 뷰 파일만 허용합니다.
   * 경로 순회 공격(..), 절대 경로, null byte 등을 차단합니다.
   *
   * @example
   * Security.validatePath('views/home.html'); // true
   * Security.validatePath('views/products.html?id=1'); // true
   * Security.validatePath('views/admin/dashboard.html'); // true (하위 폴더)
   * Security.validatePath('views/user/profile/edit.html'); // true (깊은 하위 폴더)
   * Security.validatePath('../etc/passwd'); // false
   * Security.validatePath('/etc/passwd'); // false
   * Security.validatePath('templates/page.html'); // false (views/ 외부)
   */
  static validatePath(path) {
    if (typeof path !== 'string' || !path) return false;

    // 쿼리 스트링 분리
    const [pathOnly] = path.split('?');

    // ../ 포함 차단 (상위 디렉토리 접근)
    if (pathOnly.includes('../') || pathOnly.includes('..\\')) {
      return false;
    }

    // 절대 경로 차단 (/ 로 시작)
    if (pathOnly.startsWith('/')) {
      return false;
    }

    // views/ 폴더 및 하위 폴더만 허용 (views/로 시작하는 모든 경로)
    if (!pathOnly.startsWith('views/')) {
      return false;
    }

    // null byte 포함 차단
    if (pathOnly.includes('\0') || pathOnly.includes('%00')) {
      return false;
    }

    // URL 인코딩 우회 시도 탐지
    const decoded = decodeURIComponent(pathOnly);
    if (decoded.includes('../') || decoded.includes('..\\')) {
      return false;
    }

    // .html, .php 확장자만 허용
    if (!pathOnly.endsWith('.html') && !pathOnly.endsWith('.php')) {
      return false;
    }

    // 안전한 문자만 허용 (영문, 숫자, 하이픈, 언더스코어, 슬래시, 점)
    const safePattern = /^[a-zA-Z0-9\-_/.]+$/;
    if (!safePattern.test(pathOnly)) {
      return false;
    }

    // 경로 정규화 후 재검증
    const normalized = pathOnly.replace(/\/+/g, '/');
    if (normalized !== pathOnly) {
      return false;
    }
    return true;
  }

  /**
   * 안전한 파일명 검증
   * @param {string} filename - 검증할 파일명
   * @returns {boolean} 안전한 파일명 여부
   *
   * @example
   * Security.isSafeFilename('document.pdf'); // true
   * Security.isSafeFilename('../../../etc/passwd'); // false
   */
  static isSafeFilename(filename) {
    if (typeof filename !== 'string' || !filename) return false;

    // 경로 구분자 포함 차단
    if (filename.includes('/') || filename.includes('\\')) {
      return false;
    }

    // ..를 포함하는 파일명 차단
    if (filename.includes('..')) {
      return false;
    }

    // null byte 차단
    if (filename.includes('\0') || filename.includes('%00')) {
      return false;
    }

    // 안전한 문자만 허용
    const safePattern = /^[a-zA-Z0-9\-_.]+$/;
    if (!safePattern.test(filename)) {
      return false;
    }

    // 파일명 길이 제한 (최대 255자)
    if (filename.length > 255) {
      return false;
    }
    return true;
  }

  /**
   * URL 안전성 검증
   * @param {string} url - 검증할 URL
   * @returns {boolean} 안전한 URL 여부
   *
   * @example
   * Security.isSafeUrl('https://example.com'); // true
   * Security.isSafeUrl('javascript:alert(1)'); // false
   */
  static isSafeUrl(url) {
    if (typeof url !== 'string' || !url) return false;
    const lower = url.trim().toLowerCase();

    // javascript: 프로토콜 차단
    if (lower.startsWith('javascript:')) {
      return false;
    }

    // data: 프로토콜 차단 (이미지 제외)
    if (lower.startsWith('data:') && !lower.startsWith('data:image/')) {
      return false;
    }

    // vbscript: 프로토콜 차단
    if (lower.startsWith('vbscript:')) {
      return false;
    }

    // file: 프로토콜 차단
    if (lower.startsWith('file:')) {
      return false;
    }
    return true;
  }

  /**
   * 색상값 검증 (CSS 인젝션 방지)
   * @param {string} value - 색상값
   * @returns {string} 유효한 색상값 또는 빈 문자열
   *
   * @example
   * Security.validateColor('#ff0000'); // '#ff0000'
   * Security.validateColor('rgb(255,0,0)'); // 'rgb(255,0,0)'
   * Security.validateColor('red'); // 'red'
   * Security.validateColor('url(javascript:alert(1))'); // ''
   */
  static validateColor(value) {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();

    // hex: #RGB, #RRGGBB, #RRGGBBAA
    if (/^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)) {
      return trimmed;
    }

    // rgb/rgba: rgb(r,g,b) 또는 rgba(r,g,b,a) — 숫자/공백/쉼표/슬래시/퍼센트만 허용
    if (/^rgba?\(\s*[\d\s,./%]+\)$/i.test(trimmed)) {
      return trimmed;
    }

    // hsl/hsla: hsl(h,s%,l%) 또는 hsla(h,s%,l%,a)
    if (/^hsla?\(\s*[\d\s,./%deg]+\)$/i.test(trimmed)) {
      return trimmed;
    }

    // CSS 명명 색상: 영문 소문자만 허용 (transparent, currentColor 포함)
    if (/^[a-zA-Z]{1,24}$/.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  /**
   * CSS 값 새니타이징 (CSS 인젝션 방지)
   * @param {string} value - CSS 값
   * @returns {string} 새니타이징된 CSS 값
   *
   * @example
   * Security.sanitizeCSS('red'); // 'red'
   * Security.sanitizeCSS('red; background: url(javascript:...)'); // 'red'
   */
  static sanitizeCSS(value) {
    if (typeof value !== 'string') return '';

    // 세미콜론/중괄호로 추가 속성 주입 차단 — 첫 번째 값만 허용
    let sanitized = value.split(/[;{}]/)[0];

    // expression(), url(javascript:), import 등 위험한 패턴 제거
    const dangerous = [/expression\s*\(/gi, /javascript:/gi, /vbscript:/gi, /@import/gi, /behavior:/gi, /url\s*\(/gi];
    dangerous.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    return sanitized.trim();
  }

  /**
   * 파라미터 새니타이징 (SQL 인젝션, XSS 방지)
   * @param {*} value - 새니타이징할 값
   * @returns {*} 새니타이징된 값
   *
   * @example
   * Security.sanitizeParam("'; DROP TABLE users--"); // " DROP TABLE users--"
   */
  static sanitizeParam(value) {
    if (typeof value !== 'string') return value;

    // SQL 인젝션 패턴 제거
    let sanitized = value.replace(/['";\\]/g, '');

    // HTML 이스케이프
    sanitized = this.escape(sanitized);
    return sanitized;
  }
}
// DOMParser 싱글톤 캐싱 (sanitize 성능 최적화)
_defineProperty(Security, "_parser", null);

/**
 * DOM 조작 유틸리티
 * @module core/dom
 */


/**
 * DOM Element Wrapper
 * @class
 * @description jQuery 스타일의 체이닝 가능한 DOM 조작 API를 제공하는 래퍼 클래스입니다.
 * 하나 또는 여러 개의 DOM 요소를 감싸서 편리한 메서드 체이닝을 제공합니다.
 *
 * @example
 * // jQuery 스타일 체이닝
 * new DOMElement(element)
 *   .addClass('active')
 *   .text('Hello')
 *   .on('click', handler);
 */
class DOMElement {
  /**
   * DOMElement 생성자
   * @constructor
   * @param {HTMLElement|HTMLElement[]} elements - DOM 요소 또는 요소 배열
   *
   * @example
   * const elem = new DOMElement(document.getElementById('app'));
   *
   * @example
   * const elems = new DOMElement(document.querySelectorAll('.item'));
   */
  constructor(elements) {
    this.elements = Array.isArray(elements) ? elements : [elements];
    this.length = this.elements.length;
  }

  /**
   * 각 요소에 대해 함수 실행
   * @param {Function} callback - 콜백 함수 (element, index)
   * @returns {DOMElement} 체이닝을 위한 this
   */
  each(callback) {
    this.elements.forEach((el, index) => callback.call(el, el, index));
    return this;
  }

  /**
   * 클래스 추가
   * @param {string} className - CSS 클래스 이름
   * @returns {DOMElement}
   */
  addClass(className) {
    return this.each(el => el.classList.add(className));
  }

  /**
   * 클래스 제거
   * @param {string} className - CSS 클래스 이름
   * @returns {DOMElement}
   */
  removeClass(className) {
    return this.each(el => el.classList.remove(className));
  }

  /**
   * 클래스 토글
   * @param {string} className - CSS 클래스 이름
   * @returns {DOMElement}
   */
  toggleClass(className) {
    return this.each(el => el.classList.toggle(className));
  }

  /**
   * 클래스 포함 여부
   * @param {string} className - CSS 클래스 이름
   * @returns {boolean}
   */
  hasClass(className) {
    return this.elements.some(el => el.classList.contains(className));
  }

  /**
   * 텍스트 설정/조회
   * @param {string} [value] - 설정할 텍스트
   * @returns {string|DOMElement}
   *
   * @note textContent는 브라우저에서 자동으로 안전하게 처리됨
   * (HTML 태그가 텍스트로 표시됨, XSS 위험 없음)
   */
  text(value) {
    if (value === undefined) {
      var _this$elements$;
      return ((_this$elements$ = this.elements[0]) === null || _this$elements$ === void 0 ? void 0 : _this$elements$.textContent) || '';
    }
    // textContent는 자동으로 안전함 (HTML 파싱 안 함)
    return this.each(el => el.textContent = value);
  }

  /**
   * HTML 설정/조회 (자동 새니타이징)
   * @param {string} [value] - 설정할 HTML
   * @returns {string|DOMElement}
   */
  html(value) {
    if (value === undefined) {
      var _this$elements$2;
      return ((_this$elements$2 = this.elements[0]) === null || _this$elements$2 === void 0 ? void 0 : _this$elements$2.innerHTML) || '';
    }
    // 자동 새니타이징
    const sanitized = Security.sanitize(value);
    return this.each(el => el.innerHTML = sanitized);
  }

  /**
   * 원본 HTML 설정 (새니타이징 없음)
   * 주의: 신뢰할 수 있는 소스에서만 사용!
   * @param {string} value - HTML
   * @returns {DOMElement}
   */
  rawHtml(value) {
    return this.each(el => el.innerHTML = value);
  }

  /**
   * 속성 설정/조회 (자동 이스케이프)
   * @param {string} name - 속성 이름
   * @param {string} [value] - 속성 값
   * @returns {string|DOMElement}
   */
  attr(name, value) {
    if (value === undefined) {
      var _this$elements$3;
      return (_this$elements$3 = this.elements[0]) === null || _this$elements$3 === void 0 ? void 0 : _this$elements$3.getAttribute(name);
    }
    // 자동 이스케이프
    const escaped = Security.escape(value);
    return this.each(el => el.setAttribute(name, escaped));
  }

  /**
   * 속성 제거
   * @param {string} name - 속성 이름
   * @returns {DOMElement}
   */
  removeAttr(name) {
    return this.each(el => el.removeAttribute(name));
  }

  /**
   * 데이터 속성 설정/조회
   * @param {string} key - 데이터 키
   * @param {*} [value] - 데이터 값
   * @returns {*|DOMElement}
   */
  data(key, value) {
    if (value === undefined) {
      var _this$elements$4;
      return (_this$elements$4 = this.elements[0]) === null || _this$elements$4 === void 0 ? void 0 : _this$elements$4.dataset[key];
    }
    return this.each(el => el.dataset[key] = value);
  }

  /**
   * CSS 스타일 설정/조회
   * @param {string|Object} property - CSS 속성 이름 또는 속성 객체
   * @param {string} [value] - CSS 값
   * @returns {string|DOMElement}
   */
  css(property, value) {
    if (typeof property === 'object') {
      // 여러 속성 설정
      return this.each(el => {
        Object.entries(property).forEach(_ref => {
          let [prop, val] = _ref;
          el.style[prop] = Security.sanitizeCSS(val);
        });
      });
    }
    if (value === undefined) {
      return getComputedStyle(this.elements[0])[property];
    }

    // 위험한 CSS 값 필터링
    const sanitized = Security.sanitizeCSS(value);
    return this.each(el => el.style[property] = sanitized);
  }

  /**
   * 이벤트 리스너 추가
   * @param {string} event - 이벤트 이름
   * @param {string|Function} selector - 선택자 또는 핸들러
   * @param {Function} [handler] - 핸들러
   * @returns {DOMElement}
   *
   * @example
   * // 직접 바인딩
   * IMCAT('#button').on('click', (e) => console.log('clicked'));
   *
   * @example
   * // 이벤트 위임 (권장: 동적 요소에 유리)
   * IMCAT('#list').on('click', '.item', (e) => console.log('item clicked'));
   *
   * @performance
   * - 이벤트 위임 사용 시 메모리 효율적 (리스너 1개로 여러 요소 처리)
   * - _delegates Map으로 off() 시 정확한 cleanup 보장
   */
  on(event, selector, handler) {
    // 인자 처리
    if (typeof selector === 'function') {
      handler = selector;
      selector = null;
    }
    return this.each(el => {
      if (selector) {
        // 이벤트 위임
        const delegateHandler = e => {
          const target = e.target.closest(selector);
          if (target && el.contains(target)) {
            handler.call(target, e);
          }
        };
        el.addEventListener(event, delegateHandler);
        // 나중에 제거할 수 있도록 저장
        if (!el._delegates) el._delegates = new Map();
        if (!el._delegates.has(handler)) {
          el._delegates.set(handler, new Map());
        }
        el._delegates.get(handler).set(event, delegateHandler);
      } else {
        el.addEventListener(event, handler);
      }
    });
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} event - 이벤트 이름
   * @param {Function} handler - 핸들러
   * @returns {DOMElement}
   */
  off(event, handler) {
    return this.each(el => {
      var _el$_delegates;
      if ((_el$_delegates = el._delegates) !== null && _el$_delegates !== void 0 && _el$_delegates.has(handler)) {
        const eventMap = el._delegates.get(handler);
        if (eventMap.has(event)) {
          el.removeEventListener(event, eventMap.get(event));
          eventMap.delete(event);
          if (eventMap.size === 0) {
            el._delegates.delete(handler);
          }
        }
      } else {
        el.removeEventListener(event, handler);
      }
    });
  }

  /**
   * 보이기
   * @returns {DOMElement}
   */
  show() {
    return this.each(el => el.style.display = '');
  }

  /**
   * 숨기기
   * @returns {DOMElement}
   */
  hide() {
    return this.each(el => el.style.display = 'none');
  }

  /**
   * 토글
   * @returns {DOMElement}
   */
  toggle() {
    return this.each(el => {
      el.style.display = el.style.display === 'none' ? '' : 'none';
    });
  }

  /**
   * 자식 요소 추가
   * @param {string|HTMLElement|DOMElement} content - 추가할 내용
   * @returns {DOMElement}
   */
  append(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        const sanitized = Security.sanitize(content);
        el.insertAdjacentHTML('beforeend', sanitized);
      } else if (content instanceof DOMElement) {
        content.elements.forEach(child => el.appendChild(child.cloneNode(true)));
      } else if (content instanceof HTMLElement) {
        el.appendChild(content.cloneNode(true));
      }
    });
  }

  /**
   * 자식 요소 앞에 추가
   * @param {string|HTMLElement|DOMElement} content - 추가할 내용
   * @returns {DOMElement}
   */
  prepend(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        const sanitized = Security.sanitize(content);
        el.insertAdjacentHTML('afterbegin', sanitized);
      } else if (content instanceof DOMElement) {
        content.elements.forEach(child => el.insertBefore(child.cloneNode(true), el.firstChild));
      } else if (content instanceof HTMLElement) {
        el.insertBefore(content.cloneNode(true), el.firstChild);
      }
    });
  }

  /**
   * 부모 요소에 추가
   * @param {string|HTMLElement} parent - 부모 선택자 또는 요소
   * @returns {DOMElement}
   */
  appendTo(parent) {
    const parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (parentEl) {
      this.elements.forEach(el => parentEl.appendChild(el));
    }
    return this;
  }

  /**
   * 요소 제거
   * @returns {DOMElement}
   */
  remove() {
    return this.each(el => el.remove());
  }

  /**
   * 내용 비우기
   * @returns {DOMElement}
   */
  empty() {
    return this.each(el => el.innerHTML = '');
  }

  /**
   * 하위 요소 검색
   * @param {string} selector - CSS 선택자
   * @returns {DOMElement}
   */
  find(selector) {
    const found = [];
    this.each(el => {
      found.push(...el.querySelectorAll(selector));
    });
    return new DOMElement(found);
  }

  /**
   * 부모 요소 검색
   * @returns {DOMElement}
   */
  parent() {
    const parents = this.elements.map(el => el.parentElement).filter(Boolean);
    return new DOMElement(parents);
  }

  /**
   * 가장 가까운 조상 요소 검색
   * @param {string} selector - CSS 선택자
   * @returns {DOMElement}
   */
  closest(selector) {
    const found = this.elements.map(el => el.closest(selector)).filter(Boolean);
    return new DOMElement(found);
  }

  /**
   * 형제 요소 검색
   * @returns {DOMElement}
   */
  siblings() {
    const siblings = [];
    this.each(el => {
      const parent = el.parentElement;
      if (parent) {
        Array.from(parent.children).forEach(child => {
          if (child !== el && !siblings.includes(child)) {
            siblings.push(child);
          }
        });
      }
    });
    return new DOMElement(siblings);
  }

  /**
   * 다음 형제 요소
   * @returns {DOMElement}
   */
  next() {
    const next = this.elements.map(el => el.nextElementSibling).filter(Boolean);
    return new DOMElement(next);
  }

  /**
   * 이전 형제 요소
   * @returns {DOMElement}
   */
  prev() {
    const prev = this.elements.map(el => el.previousElementSibling).filter(Boolean);
    return new DOMElement(prev);
  }

  /**
   * 첫 번째 요소
   * @returns {DOMElement}
   */
  first() {
    return new DOMElement(this.elements[0] || []);
  }

  /**
   * 마지막 요소
   * @returns {DOMElement}
   */
  last() {
    return new DOMElement(this.elements[this.elements.length - 1] || []);
  }

  /**
   * 특정 인덱스 요소
   * @param {number} index - 인덱스
   * @returns {DOMElement}
   */
  eq(index) {
    return new DOMElement(this.elements[index] || []);
  }

  /**
   * 원본 DOM 요소 가져오기
   * @param {number} [index] - 인덱스 (없으면 전체 배열)
   * @returns {HTMLElement|HTMLElement[]}
   */
  get(index) {
    return index === undefined ? this.elements : this.elements[index];
  }

  /**
   * input/select/textarea 값 설정/조회
   * @param {string|number} [value] - 설정할 값
   * @returns {string|DOMElement}
   */
  val(value) {
    if (value === undefined) {
      var _this$elements$5;
      return ((_this$elements$5 = this.elements[0]) === null || _this$elements$5 === void 0 ? void 0 : _this$elements$5.value) ?? '';
    }
    return this.each(el => {
      el.value = value;
    });
  }

  /**
   * 요소 앞에 콘텐츠 삽입
   * @param {string|HTMLElement|DOMElement} content - 삽입할 콘텐츠
   * @returns {DOMElement}
   */
  before(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        const sanitized = Security.sanitize(content);
        el.insertAdjacentHTML('beforebegin', sanitized);
      } else if (content instanceof DOMElement) {
        content.elements.forEach(child => {
          var _el$parentNode;
          return (_el$parentNode = el.parentNode) === null || _el$parentNode === void 0 ? void 0 : _el$parentNode.insertBefore(child.cloneNode(true), el);
        });
      } else if (content instanceof HTMLElement) {
        var _el$parentNode2;
        (_el$parentNode2 = el.parentNode) === null || _el$parentNode2 === void 0 || _el$parentNode2.insertBefore(content.cloneNode(true), el);
      }
    });
  }

  /**
   * 요소 뒤에 콘텐츠 삽입
   * @param {string|HTMLElement|DOMElement} content - 삽입할 콘텐츠
   * @returns {DOMElement}
   */
  after(content) {
    return this.each(el => {
      if (typeof content === 'string') {
        const sanitized = Security.sanitize(content);
        el.insertAdjacentHTML('afterend', sanitized);
      } else if (content instanceof DOMElement) {
        content.elements.forEach(child => {
          var _el$parentNode3;
          return (_el$parentNode3 = el.parentNode) === null || _el$parentNode3 === void 0 ? void 0 : _el$parentNode3.insertBefore(child.cloneNode(true), el.nextSibling);
        });
      } else if (content instanceof HTMLElement) {
        var _el$parentNode4;
        (_el$parentNode4 = el.parentNode) === null || _el$parentNode4 === void 0 || _el$parentNode4.insertBefore(content.cloneNode(true), el.nextSibling);
      }
    });
  }

  /**
   * 요소 복제
   * @param {boolean} [deep=true] - 자식 포함 여부
   * @returns {DOMElement}
   */
  clone() {
    let deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    const cloned = this.elements.map(el => el.cloneNode(deep));
    return new DOMElement(cloned);
  }

  /**
   * 자식 요소 조회
   * @param {string} [selector] - 필터 선택자
   * @returns {DOMElement}
   */
  children(selector) {
    const children = [];
    this.each(el => {
      Array.from(el.children).forEach(child => {
        if (!selector || child.matches(selector)) {
          children.push(child);
        }
      });
    });
    return new DOMElement(children);
  }

  /**
   * 모든 조상 요소 조회
   * @param {string} [selector] - 필터 선택자
   * @returns {DOMElement}
   */
  parents(selector) {
    const parents = [];
    this.each(el => {
      let current = el.parentElement;
      while (current) {
        if (!selector || current.matches(selector)) {
          if (!parents.includes(current)) {
            parents.push(current);
          }
        }
        current = current.parentElement;
      }
    });
    return new DOMElement(parents);
  }

  /**
   * 요소의 문서 기준 좌표
   * @returns {{ top: number, left: number }}
   */
  offset() {
    const el = this.elements[0];
    if (!el) return {
      top: 0,
      left: 0
    };
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }

  /**
   * 요소의 오프셋 부모 기준 좌표
   * @returns {{ top: number, left: number }}
   */
  position() {
    const el = this.elements[0];
    if (!el) return {
      top: 0,
      left: 0
    };
    return {
      top: el.offsetTop,
      left: el.offsetLeft
    };
  }

  /**
   * 요소 너비 반환
   * @returns {number}
   */
  width() {
    const el = this.elements[0];
    return el ? el.offsetWidth : 0;
  }

  /**
   * 요소 높이 반환
   * @returns {number}
   */
  height() {
    const el = this.elements[0];
    return el ? el.offsetHeight : 0;
  }

  /**
   * 커스텀 이벤트 트리거
   * @param {string} event - 이벤트 이름
   * @param {*} [data] - 이벤트 데이터
   * @returns {DOMElement}
   */
  trigger(event, data) {
    const evt = new CustomEvent(event, {
      bubbles: true,
      detail: data
    });
    return this.each(el => el.dispatchEvent(evt));
  }
}

/**
 * DOM 유틸리티 클래스
 * @class
 * @description DOM 선택, 요소 생성 등의 유틸리티 메서드를 제공합니다.
 * IMCAT() 함수의 기본 구현체입니다.
 *
 * @example
 * // 요소 선택
 * const element = DOM.select('#app');
 *
 * @example
 * // 요소 생성
 * const div = DOM.create('div', { class: 'container' });
 */
class DOM {
  /**
   * 요소 선택
   * @param {string|HTMLElement|DOMElement} selector - 선택자
   * @returns {DOMElement}
   */
  static select(selector) {
    if (!selector) return new DOMElement([]);
    if (typeof selector === 'string') {
      const elements = Array.from(document.querySelectorAll(selector));
      return new DOMElement(elements);
    }
    if (selector instanceof HTMLElement) {
      return new DOMElement([selector]);
    }
    if (selector instanceof DOMElement) {
      return selector;
    }
    return new DOMElement([]);
  }

  /**
   * 새 요소 생성
   * @param {string} tagName - HTML 태그 이름
   * @param {Object} [attributes] - 속성 객체
   * @returns {DOMElement}
   */
  static create(tagName) {
    let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const el = document.createElement(tagName);
    Object.entries(attributes).forEach(_ref2 => {
      let [key, value] = _ref2;
      if (key === 'class') {
        el.className = value;
      } else if (key === 'html') {
        el.innerHTML = Security.sanitize(value);
      } else if (key === 'text') {
        el.textContent = value;
      } else {
        el.setAttribute(key, Security.escape(value));
      }
    });
    return new DOMElement([el]);
  }

  /**
   * DOM 준비 완료 시 실행
   * @param {Function} callback - 콜백 함수
   */
  static ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
}

/**
 * 이벤트 시스템
 * @module core/event
 */

/**
 * 이벤트 버스
 * @class
 * @description 전역 이벤트 버스를 통한 publish-subscribe 패턴을 제공합니다.
 * 컴포넌트 간 느슨한 결합으로 통신할 수 있습니다.
 *
 * @example
 * const bus = new EventBus();
 * bus.on('user:login', (data) => console.log(data));
 * bus.emit('user:login', { username: 'John' });
 */
class EventBus {
  /**
   * EventBus 생성자
   * @constructor
   */
  constructor() {
    this.events = new Map();
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 이름
   * @param {Function} handler - 이벤트 핸들러
   * @returns {Function} 구독 취소 함수
   *
   * @example
   * const unsubscribe = eventBus.on('user:login', (user) => {
   *   console.log('User logged in:', user);
   * });
   * // 구독 취소
   * unsubscribe();
   */
  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(handler);

    // 구독 취소 함수 반환
    return () => this.off(event, handler);
  }

  /**
   * 일회성 이벤트 리스너 등록
   * @param {string} event - 이벤트 이름
   * @param {Function} handler - 이벤트 핸들러
   * @returns {Function} 구독 취소 함수
   *
   * @example
   * eventBus.once('data:loaded', () => {
   *   console.log('Data loaded - this runs only once');
   * });
   */
  once(event, handler) {
    var _this = this;
    const wrapper = function () {
      handler(...arguments);
      _this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} event - 이벤트 이름
   * @param {Function} [handler] - 이벤트 핸들러 (없으면 모든 핸들러 제거)
   *
   * @example
   * eventBus.off('user:login', handler); // 특정 핸들러 제거
   * eventBus.off('user:login'); // 모든 핸들러 제거
   */
  off(event, handler) {
    if (!this.events.has(event)) return;
    if (handler) {
      const handlers = this.events.get(event);
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
      // 핸들러가 없으면 이벤트 자체를 제거
      if (handlers.length === 0) {
        this.events.delete(event);
      }
    } else {
      // 핸들러가 지정되지 않으면 모든 핸들러 제거
      this.events.delete(event);
    }
  }

  /**
   * 이벤트 발생
   * @param {string} event - 이벤트 이름
   * @param {...*} args - 핸들러에 전달할 인자들
   *
   * @example
   * eventBus.emit('user:login', { id: 1, name: 'John' });
   * eventBus.emit('data:updated', data, timestamp);
   */
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (!this.events.has(event)) return;

    // 핸들러 배열 복사 (순회 중 변경 방지)
    const handlers = [...this.events.get(event)];
    handlers.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }

  /**
   * 모든 리스너 제거
   *
   * @example
   * eventBus.clear(); // 모든 이벤트 리스너 제거
   */
  clear() {
    this.events.clear();
  }

  /**
   * 등록된 이벤트 목록 조회
   * @returns {string[]} 이벤트 이름 배열
   */
  getEvents() {
    return Array.from(this.events.keys());
  }

  /**
   * 특정 이벤트의 리스너 수 조회
   * @param {string} event - 이벤트 이름
   * @returns {number} 리스너 수
   */
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }

  /**
   * 이벤트에 리스너가 있는지 확인
   * @param {string} event - 이벤트 이름
   * @returns {boolean}
   */
  hasListeners(event) {
    return this.events.has(event) && this.events.get(event).length > 0;
  }
}

/**
 * 기본 유틸리티
 * @module core/utils
 */

/**
 * @class
 * @description 다양한 유틸리티 함수를 제공하는 클래스입니다.
 * 타입 체크, 객체 조작, 디바운스/스로틀 등의 기능을 포함합니다.
 *
 * @example
 * Utils.isString('hello'); // true
 * Utils.debounce(fn, 300);
 */
class Utils {
  /**
   * 타입 체크 - 문자열
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isString(value) {
    return typeof value === 'string';
  }

  /**
   * 타입 체크 - 숫자
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * 타입 체크 - 불리언
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  /**
   * 타입 체크 - 객체
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * 타입 체크 - 배열
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * 타입 체크 - 함수
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * 타입 체크 - null
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isNull(value) {
    return value === null;
  }

  /**
   * 타입 체크 - undefined
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isUndefined(value) {
    return value === undefined;
  }

  /**
   * 타입 체크 - null 또는 undefined
   * @param {*} value - 검사할 값
   * @returns {boolean}
   */
  static isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  /**
   * 객체 병합 (깊은 병합)
   * @param {Object} target - 대상 객체
   * @param {...Object} sources - 소스 객체들
   * @returns {Object} 병합된 객체
   *
   * @example
   * Utils.extend({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
   */
  static extend(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }
    sources.forEach(source => {
      if (this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key]) && this.isObject(target[key])) {
            target[key] = this.extend({}, target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        });
      }
    });
    return target;
  }

  /**
   * 깊은 복사
   * @param {*} obj - 복사할 객체
   * @returns {*} 복사된 객체
   *
   * @example
   * const copy = Utils.clone({ a: { b: 1 } });
   *
   * @note
   * - 일반 객체 및 배열만 지원
   * - Date, RegExp, Map, Set, Function 등 특수 객체는 참조로 복사됨
   * - 순환 참조는 처리하지 않음 (스택 오버플로우 발생 가능)
   * - 복잡한 객체는 lodash.cloneDeep 사용 권장
   */
  static clone(obj) {
    if (this.isNullOrUndefined(obj)) return obj;
    if (this.isArray(obj)) return obj.map(item => this.clone(item));
    if (this.isObject(obj)) {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.clone(obj[key]);
      });
      return cloned;
    }
    return obj;
  }

  /**
   * 배열 중복 제거
   * @param {Array} array - 배열
   * @returns {Array} 중복이 제거된 배열
   *
   * @example
   * Utils.unique([1, 2, 2, 3]); // [1, 2, 3]
   */
  static unique(array) {
    return [...new Set(array)];
  }

  /**
   * 배열 평탄화
   * @param {Array} array - 배열
   * @returns {Array} 평탄화된 배열
   *
   * @example
   * Utils.flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]
   */
  static flatten(array) {
    return array.flat(Infinity);
  }

  /**
   * 디바운스 함수 생성
   * @param {Function} func - 디바운스할 함수
   * @param {number} wait - 대기 시간 (ms)
   * @returns {Function} 디바운스된 함수
   *
   * @example
   * const debouncedSearch = Utils.debounce(search, 300);
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      const context = this; // this 컨텍스트 유지
      const later = () => {
        clearTimeout(timeout);
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 스로틀 함수 생성
   * @param {Function} func - 스로틀할 함수
   * @param {number} limit - 제한 시간 (ms)
   * @returns {Function} 스로틀된 함수
   *
   * @example
   * const throttledScroll = Utils.throttle(onScroll, 100);
   */
  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const context = this; // this 컨텍스트 유지
      if (!inThrottle) {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 랜덤 ID 생성
   * @param {string} prefix - 접두사 (기본: 'id')
   * @returns {string} 랜덤 ID
   *
   * @example
   * Utils.randomId('user'); // 'user-abc123xyz'
   */
  static randomId() {
    let prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint8Array(8);
      crypto.getRandomValues(arr);
      const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
      return `${prefix}-${hex}`;
    }
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 랜덤 정수 생성
   * @param {number} min - 최소값
   * @param {number} max - 최대값
   * @returns {number} 랜덤 정수
   *
   * @example
   * Utils.randomInt(1, 100); // 1~100 사이의 랜덤 정수
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 배열 청크 분할
   * @param {Array} array - 배열
   * @param {number} size - 청크 크기
   * @returns {Array[]} 청크 배열
   *
   * @example
   * Utils.chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
   */
  static chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 배열 범위 생성
   * @param {number} start - 시작값
   * @param {number} end - 종료값
   * @param {number} step - 증가값 (기본: 1)
   * @returns {Array} 범위 배열
   *
   * @example
   * Utils.range(1, 5); // [1, 2, 3, 4, 5]
   * Utils.range(0, 10, 2); // [0, 2, 4, 6, 8, 10]
   */
  static range(start, end) {
    let step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (!step || step <= 0) {
      console.error('Utils.range: step은 0보다 커야 합니다.');
      return [];
    }
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }

  /**
   * 문자열 자르기 (말줄임표)
   * @param {string} str - 문자열
   * @param {number} maxLength - 최대 길이
   * @param {string} suffix - 접미사 (기본: '...')
   * @returns {string} 잘린 문자열
   *
   * @example
   * Utils.truncate('Hello World', 8); // 'Hello...'
   */
  static truncate(str, maxLength) {
    let suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';
    if (!this.isString(str)) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * 카멜케이스 변환
   * @param {string} str - 문자열
   * @returns {string} 카멜케이스 문자열
   *
   * @example
   * Utils.camelCase('hello-world'); // 'helloWorld'
   * Utils.camelCase('hello_world'); // 'helloWorld'
   */
  static camelCase(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * 케밥케이스 변환
   * @param {string} str - 문자열
   * @returns {string} 케밥케이스 문자열
   *
   * @example
   * Utils.kebabCase('helloWorld'); // 'hello-world'
   */
  static kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * 첫 글자 대문자
   * @param {string} str - 문자열
   * @returns {string} 첫 글자가 대문자인 문자열
   *
   * @example
   * Utils.capitalize('hello'); // 'Hello'
   */
  static capitalize(str) {
    if (!this.isString(str) || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 지연 실행 (Promise)
   * @param {number} ms - 지연 시간 (ms)
   * @returns {Promise<void>}
   *
   * @example
   * await Utils.sleep(1000); // 1초 대기
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 객체에서 특정 키만 선택
   * @param {Object} obj - 객체
   * @param {string[]} keys - 선택할 키 배열
   * @returns {Object} 선택된 키만 포함하는 객체
   *
   * @example
   * Utils.pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
   */
  static pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * 객체에서 특정 키 제거
   * @param {Object} obj - 객체
   * @param {string[]} keys - 제거할 키 배열
   * @returns {Object} 키가 제거된 객체
   *
   * @example
   * Utils.omit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }
   */
  static omit(obj, keys) {
    const result = {
      ...obj
    };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }
}

/**
 * 글로벌 설정 관리자
 * @class
 */
class Config {
  /**
   * 설정 초기화
   * @private
   */
  static _init() {
    if (Config._settings === null) {
      Config._settings = Utils.clone(Config._defaults);
    }
  }

  /**
   * 설정 값 설정
   * @param {Object|string} keyOrOptions - 설정 키 또는 옵션 객체
   * @param {*} [value] - 설정 값 (키를 문자열로 전달한 경우)
   * @returns {Object} 현재 설정
   *
   * @example
   * // 객체로 여러 설정 변경
   * IMCAT.config({
   *   animation: false,
   *   theme: 'dark',
   *   locale: 'en-US'
   * });
   *
   * // 단일 설정 변경
   * IMCAT.config('animation', false);
   *
   * // 중첩 설정 변경
   * IMCAT.config('zIndex.modal', 2000);
   */
  static set(keyOrOptions, value) {
    Config._init();
    let changes = {};
    if (typeof keyOrOptions === 'string') {
      // 단일 키 설정
      Config._setNestedValue(Config._settings, keyOrOptions, value);
      changes[keyOrOptions] = value;
    } else if (typeof keyOrOptions === 'object') {
      // 객체로 여러 설정
      Config._settings = Config._deepMerge(Config._settings, keyOrOptions);
      changes = keyOrOptions;
    }

    // 변경 이벤트 발생
    Config._notifyListeners(changes);
    return Config._settings;
  }

  /**
   * 설정 값 조회
   * @param {string} [key] - 설정 키 (없으면 전체 반환)
   * @param {*} [defaultValue] - 기본값
   * @returns {*} 설정 값
   *
   * @example
   * // 전체 설정 조회
   * const settings = IMCAT.config.get();
   *
   * // 단일 설정 조회
   * const animation = IMCAT.config.get('animation');
   *
   * // 중첩 설정 조회
   * const modalZIndex = IMCAT.config.get('zIndex.modal');
   *
   * // 기본값과 함께 조회
   * const custom = IMCAT.config.get('customKey', 'default');
   */
  static get(key, defaultValue) {
    Config._init();
    if (!key) {
      return Utils.clone(Config._settings);
    }
    const value = Config._getNestedValue(Config._settings, key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * 실제 로케일 문자열 반환 ('system'이면 navigator.language 기반 자동감지)
   * @returns {string} 로케일 문자열 (예: 'ko-KR', 'en-US')
   */
  static getLocale() {
    const locale = Config.get('locale', 'system');
    if (locale === 'system') {
      return typeof navigator !== 'undefined' && navigator.language || 'en-US';
    }
    return locale;
  }

  /**
   * 실제 통화 코드 반환 ('system'이면 로케일 기반 자동감지)
   * @returns {string} ISO 4217 통화 코드 (예: 'KRW', 'USD')
   */
  static getCurrency() {
    const currency = Config.get('currency', 'system');
    if (currency === 'system') {
      const locale = Config.getLocale();
      const regionCurrencyMap = {
        'ko': 'KRW',
        'ja': 'JPY',
        'zh': 'CNY',
        'en-US': 'USD',
        'en-GB': 'GBP',
        'en-AU': 'AUD',
        'de': 'EUR',
        'fr': 'EUR',
        'es': 'EUR',
        'it': 'EUR',
        'pt-BR': 'BRL',
        'ru': 'RUB',
        'in': 'INR',
        'id': 'IDR'
      };
      const lang = locale.split('-')[0];
      return regionCurrencyMap[locale] || regionCurrencyMap[lang] || 'USD';
    }
    return currency;
  }

  /**
   * 특정 컴포넌트의 설정 조회 (기본값과 병합)
   * @param {string} component - 컴포넌트 이름
   * @param {Object} [options] - 사용자 옵션
   * @returns {Object} 병합된 옵션
   */
  static getFor(component) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Config._init();
    const globalOptions = {
      animation: Config._settings.animation,
      animationDuration: Config._settings.animationDuration,
      backdrop: Config._settings.backdrop,
      backdropClose: Config._settings.backdropClose,
      escapeClose: Config._settings.escapeClose
    };
    const componentOptions = Config._settings[component] || {};
    return Utils.extend({}, globalOptions, componentOptions, options);
  }

  /**
   * 설정 초기화 (기본값으로 복원)
   * @param {string} [key] - 특정 키만 초기화 (없으면 전체)
   *
   * @example
   * // 전체 초기화
   * IMCAT.config.reset();
   *
   * // 특정 설정만 초기화
   * IMCAT.config.reset('animation');
   */
  static reset(key) {
    Config._init(); // null 체크

    if (key) {
      const defaultValue = Config._getNestedValue(Config._defaults, key);
      if (defaultValue !== undefined) {
        Config._setNestedValue(Config._settings, key, Utils.clone(defaultValue));
        Config._notifyListeners({
          [key]: defaultValue
        });
      }
    } else {
      Config._settings = Utils.clone(Config._defaults);
      Config._notifyListeners(Config._settings);
    }
  }

  /**
   * 설정 변경 리스너 등록
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   *
   * @example
   * const unsubscribe = IMCAT.config.onChange((changes) => {
   *   console.log('설정 변경:', changes);
   * });
   *
   * // 구독 해제
   * unsubscribe();
   */
  static onChange(callback) {
    Config._listeners.push(callback);
    return () => {
      const index = Config._listeners.indexOf(callback);
      if (index > -1) {
        Config._listeners.splice(index, 1);
      }
    };
  }

  /**
   * 기본값 확장 (플러그인용)
   * @param {Object} defaults - 추가할 기본값
   *
   * @example
   * // 플러그인에서 기본값 추가
   * IMCAT.config.extend({
   *   myPlugin: {
   *     option1: true,
   *     option2: 'value'
   *   }
   * });
   */
  static extend(defaults) {
    Config._defaults = Config._deepMerge(Config._defaults, defaults);
    Config._settings = Config._deepMerge(Config._settings || {}, defaults);
  }

  /**
   * 모든 리스너 정리 (메모리 누수 방지)
   */
  static clearListeners() {
    Config._listeners = [];
  }

  /**
   * 전체 정리 (destroy)
   */
  static destroy() {
    Config._settings = null;
    Config._listeners = [];
  }

  /**
   * 중첩 값 설정
   * @private
   */
  static _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  /**
   * 중첩 값 조회
   * @private
   */
  static _getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }

  /**
   * 깊은 병합
   * @private
   */
  static _deepMerge(target, source) {
    let _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    // 깊이 제한: 무한 재귀 및 과도한 중첩 객체 병합 방지
    if (_depth > 10) {
      return Utils.clone(source);
    }
    const result = Utils.clone(target);
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
          result[key] = Config._deepMerge(result[key], source[key], _depth + 1);
        } else {
          result[key] = Utils.clone(source[key]);
        }
      }
    }
    return result;
  }

  /**
   * 리스너에게 변경 알림
   * @private
   */
  static _notifyListeners(changes) {
    Config._listeners.forEach(callback => {
      try {
        callback(changes, Config._settings);
      } catch (error) {
        console.error('Config change listener error:', error);
      }
    });
  }
}
/**
 * 기본 설정값
 * @private
 */
_defineProperty(Config, "_defaults", {
  // 애니메이션 설정
  animation: true,
  animationDuration: 300,
  // 모듈 CSS 자동 로드 (IMCAT.use() 시 해당 모듈 CSS도 자동 로드)
  autoLoadModuleCSS: true,
  // 서버 렌더링 모드 (true면 catui-href가 일반 링크처럼 동작)
  // Catphp 등 서버 사이드 라우터 사용 시 true로 설정
  serverRender: false,
  // 오버레이 설정
  backdrop: true,
  backdropClose: true,
  escapeClose: true,
  // 테마 설정
  theme: 'system',
  // 'light' | 'dark' | 'system'

  // 로케일 설정 ('system'이면 navigator.language 자동감지)
  locale: 'system',
  currency: 'system',
  // z-index 설정 (src/styles/abstracts/_variables.scss $z-index-* 변수와 동기화 필수)
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    drawer: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
    notification: 1080,
    loading: 9999
  },
  // 토스트 설정
  toast: {
    duration: 3000,
    position: 'top-right',
    // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
    maxCount: 5
  },
  // 알림 설정
  notification: {
    duration: 5000,
    position: 'top-right',
    closable: true
  },
  // 모달 설정
  modal: {
    size: 'md',
    // 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
    closeButton: true,
    animation: 'fade' // 'fade' | 'zoom' | 'slide'
  },
  // 드로어 설정
  drawer: {
    position: 'right',
    // 'left' | 'right' | 'top' | 'bottom'
    width: '320px',
    closeButton: true
  },
  // 드롭다운 설정
  dropdown: {
    position: 'bottom',
    align: 'start',
    offset: 8,
    closeOnClick: true,
    closeOnOutside: true
  },
  // 툴팁 설정
  tooltip: {
    position: 'top',
    delay: 200,
    offset: 8
  },
  // API 설정
  api: {
    baseURL: '',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  // 폼 검증 설정
  form: {
    validateOnBlur: true,
    validateOnInput: false,
    showErrorMessage: true
  },
  // 날짜 형식
  dateFormat: {
    date: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  },
  // 디버그 모드
  debug: false
});
/**
 * 현재 설정값
 * @private
 */
_defineProperty(Config, "_settings", null);
/**
 * 설정 변경 리스너들
 * @private
 */
_defineProperty(Config, "_listeners", []);

/**
 * 모듈 로더
 * @module core/loader
 */


/**
 * 모듈 로더 클래스
 * @class
 * @description JavaScript 모듈과 CSS를 동적으로 로드하는 클래스입니다.
 * 중복 로드를 방지하고 모듈을 캐싱합니다.
 *
 * @example
 * const loader = new ModuleLoader();
 * await loader.load('/modules/chart.js', '/modules/chart.css');
 */
class ModuleLoader {
  /**
   * ModuleLoader 생성자
   * @constructor
   * @param {Object} options - 로더 옵션
   * @param {string} options.distPath - dist 폴더 경로 (기본: 자동 감지)
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.modules = new Map();
    this.loadedCSS = new Set();
    this._pendingCSS = new Map();

    // dist 폴더 경로 설정 (옵션 또는 자동 감지)
    this.distPath = options.distPath || this._detectDistPath();

    // 모듈 base path (distPath 기준)
    this.basePath = `${this.distPath}/modules`;
  }

  /**
   * dist 폴더 경로 자동 감지
   * @private
   * @returns {string} dist 폴더 경로
   */
  _detectDistPath() {
    // 1. script 태그에서 imcat-ui 경로 감지 (IIFE 번들)
    if (typeof document !== 'undefined') {
      const scripts = document.getElementsByTagName('script');
      for (const script of scripts) {
        const src = script.src;
        if (src && src.includes('imcat-ui')) {
          const match = src.match(/(.*)\/imcat-ui(\.min)?\.js/);
          if (match) {
            return match[1];
          }
        }
      }
    }

    // 2. import.meta.url 폴백 (ESM 번들러/CDN 환경)
    try {
      if (typeof import.meta !== 'undefined' && import.meta.url) {
        const url = new URL(import.meta.url);
        // core/loader.js → dist/ (한 단계 상위)
        return url.href.replace(/\/core\/loader\.js.*$/, '');
      }
    } catch (_e) {
      // import.meta 미지원 환경
    }

    // 3. 기본값: 현재 위치 기준 상대 경로
    return './dist';
  }

  /**
   * 모듈 로드
   * @param {...string} moduleNames - 모듈 이름들
   * @returns {Promise<*>} 단일 또는 배열로 모듈 반환
   *
   * @example
   * // 단일 모듈
   * const Modal = await loader.use('modal');
   *
   * // 여러 모듈
   * const [Modal, Dropdown] = await loader.use('modal', 'dropdown');
   */
  async use() {
    for (var _len = arguments.length, moduleNames = new Array(_len), _key = 0; _key < _len; _key++) {
      moduleNames[_key] = arguments[_key];
    }
    // 단일 모듈
    if (moduleNames.length === 1) {
      return this._loadModule(moduleNames[0]);
    }

    // 여러 모듈
    const modules = await Promise.all(moduleNames.map(name => this._loadModule(name)));
    return modules;
  }

  /**
   * 모듈 사전 로드 (캐싱)
   * @param {...string} moduleNames - 모듈 이름들
   * @returns {Promise<void>}
   *
   * @example
   * await loader.preload('modal', 'dropdown', 'tooltip');
   */
  async preload() {
    for (var _len2 = arguments.length, moduleNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      moduleNames[_key2] = arguments[_key2];
    }
    await Promise.all(moduleNames.map(name => this._loadModule(name)));
  }

  /**
   * 모듈 로드 (내부)
   * @private
   * @param {string} moduleName - 모듈 이름
   * @returns {Promise<*>} 모듈
   */
  async _loadModule(moduleName) {
    // 캐시된 모듈 반환
    if (this.modules.has(moduleName)) {
      return this.modules.get(moduleName);
    }

    // 하위 모듈 지원: 'navigation/tabs' → 부모='navigation', 하위='Tabs'
    let parentName = moduleName;
    let subModuleName = null;
    if (moduleName.includes('/')) {
      const parts = moduleName.split('/');
      parentName = parts[0];
      subModuleName = parts[1];
    }
    try {
      // CSS 자동 로드 (설정에 따라) — 부모 모듈 기준
      if (Config.get('autoLoadModuleCSS')) {
        await this._loadModuleCSS(parentName);
      }

      // JS 모듈 로드 (dist/modules/모듈명.js) — 부모 모듈 기준
      let parentExport;
      if (this.modules.has(parentName)) {
        parentExport = this.modules.get(parentName);
      } else {
        const modulePath = `${this.basePath}/${parentName}.js`;
        const module = await import(modulePath);
        parentExport = module.default || module[this._toPascalCase(parentName)];
        if (!parentExport) {
          throw new Error(`Module "${parentName}" does not have a default or named export`);
        }
        // 부모 모듈 캐시
        this.modules.set(parentName, parentExport);
      }

      // 하위 모듈 추출: IMCAT.use('navigation/tabs') → Tabs 클래스 반환
      if (subModuleName) {
        const subKey = this._toPascalCase(subModuleName);
        const subExport = parentExport[subKey] || parentExport[subModuleName];
        if (!subExport) {
          throw new Error(`Sub-module "${subModuleName}" not found in "${parentName}". Available: ${Object.keys(parentExport).join(', ')}`);
        }
        // 하위 모듈도 캐시
        this.modules.set(moduleName, subExport);
        return subExport;
      }
      return parentExport;
    } catch (error) {
      console.error(`Failed to load module "${moduleName}":`, error);
      throw new Error(`Module "${moduleName}" not found`);
    }
  }

  /**
   * 모듈 CSS 로드
   * @private
   * @param {string} moduleName - 모듈 이름
   */
  async _loadModuleCSS(moduleName) {
    const cssPath = `${this.basePath}/${moduleName}.css`;

    // 이미 로드된 CSS는 스킵
    if (this.loadedCSS.has(cssPath)) {
      return;
    }

    // 로딩 중인 CSS는 기존 Promise 재사용 (중복 <link> 방지)
    if (this._pendingCSS.has(cssPath)) {
      return this._pendingCSS.get(cssPath);
    }
    const promise = this.loadCSS(cssPath).then(() => {
      this.loadedCSS.add(cssPath);
      // 브라우저 스타일 적용 보장
      return new Promise(resolve => requestAnimationFrame(resolve));
    }).catch(() => {
      // CSS가 없으면 무시 (선택적 파일)
    }).finally(() => {
      this._pendingCSS.delete(cssPath);
    });
    this._pendingCSS.set(cssPath, promise);
    return promise;
  }

  /**
   * CSS 파일 로드
   * @param {string} url - CSS 파일 URL
   * @returns {Promise<void>}
   *
   * @example
   * await loader.loadCSS('./styles/custom.css');
   */
  loadCSS(url) {
    return new Promise((resolve, reject) => {
      // 이미 로드된 CSS 확인
      if (this.loadedCSS.has(url)) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => {
        this.loadedCSS.add(url);
        resolve();
      };
      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${url}`));
      };
      document.head.appendChild(link);
    });
  }

  /**
   * 로드된 모듈 가져오기
   * @param {string} moduleName - 모듈 이름
   * @returns {*|null} 모듈 또는 null
   *
   * @example
   * const Modal = loader.getModule('modal');
   */
  getModule(moduleName) {
    return this.modules.get(moduleName) || null;
  }

  /**
   * 모듈 로드 여부 확인
   * @param {string} moduleName - 모듈 이름
   * @returns {boolean}
   *
   * @example
   * if (loader.hasModule('modal')) {
   *   console.log('Modal already loaded');
   * }
   */
  hasModule(moduleName) {
    return this.modules.has(moduleName);
  }

  /**
   * 기본 경로 설정
   * @param {string} path - 모듈 기본 경로
   *
   * @example
   * loader.setBasePath('./custom/modules');
   */
  setBasePath(path) {
    this.basePath = path;
  }

  /**
   * 모듈 캐시 초기화
   * @param {string} [moduleName] - 특정 모듈만 초기화 (선택)
   *
   * @example
   * loader.clearCache(); // 전체 초기화
   * loader.clearCache('modal'); // 특정 모듈만
   */
  clearCache(moduleName) {
    if (moduleName) {
      this.modules.delete(moduleName);
    } else {
      this.modules.clear();
    }
  }

  /**
   * 로드된 모듈 목록
   * @returns {string[]} 모듈 이름 배열
   */
  getLoadedModules() {
    return Array.from(this.modules.keys());
  }

  /**
   * 로드된 CSS 목록
   * @returns {string[]} CSS URL 배열
   */
  getLoadedCSS() {
    return Array.from(this.loadedCSS);
  }

  /**
   * 첫 글자 대문자 변환
   * @private
   * @param {string} str - 문자열
   * @returns {string}
   */
  _toPascalCase(str) {
    return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  }

  /**
   * 모듈 로더 정리 (메모리 누수 방지)
   * 모듈 캐시를 정리합니다. CSS는 DOM에 유지됩니다.
   *
   * @example
   * // 애플리케이션 종료 시
   * loader.destroy();
   */
  destroy() {
    // 모듈 캐시 정리
    this.modules.clear();

    // CSS는 DOM에 남겨둠 (제거 시 스타일 깨짐)
    // 필요시 별도로 CSS 정리 가능
    // this.loadedCSS.clear();
  }
}

/**
 * SPA 뷰 라우터
 * @module core/router
 */


/**
 * 뷰 라우터
 * @class
 * @description SPA(Single Page Application) 라우팅을 처리하는 클래스입니다.
 * History API를 사용하여 페이지 전환을 관리하고, views/ 폴더 하위 경로를 지원합니다.
 *
 * @example
 * const router = new ViewRouter();
 * router.navigate('views/home.html');
 */
class ViewRouter {
  /**
   * ViewRouter 생성자
   * @constructor
   */
  constructor() {
    this.container = '#app';
    this.currentPath = '';
    this.hooks = {
      beforeLoad: [],
      afterLoad: [],
      onError: []
    };
    // 인스턴스 관리
    this.instances = new Map();
    this.currentViewInstances = [];
    this.loading = null;
    this._popstateHandler = null;

    // History API 사용 여부 (기본값: true)
    this.useHistory = true;

    // 서버 렌더링 모드 (기본값: false)
    // true면 catui-href가 일반 링크처럼 동작하여 서버 라우터가 처리
    this.serverRender = false;
  }

  /**
   * 초기화
   * @param {Object} [options] - 옵션
   * @param {Object} [options.loading] - 로딩 인디케이터 인스턴스
   * @param {boolean} [options.autoNavigate=true] - 초기 hash 경로 자동 로드 여부
   * @param {boolean} [options.useHistory=true] - History API 사용 여부 (false면 URL 변경 안함)
   * @param {boolean} [options.serverRender=false] - 서버 렌더링 모드 (true면 catui-href가 일반 링크처럼 동작)
   */
  init() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (options.loading) {
      this.loading = options.loading;
    }

    // History API 사용 여부 설정
    if ('useHistory' in options) {
      this.useHistory = options.useHistory;
    }

    // 서버 렌더링 모드 설정
    if ('serverRender' in options) {
      this.serverRender = options.serverRender;
    }

    // History API 이벤트 리스너 (useHistory가 true일 때만)
    if (this.useHistory) {
      this._popstateHandler = e => {
        var _e$state;
        if ((_e$state = e.state) !== null && _e$state !== void 0 && _e$state.path) {
          this._loadView(e.state.path, false);
        }
      };
      window.addEventListener('popstate', this._popstateHandler);
    }

    // 초기 경로 자동 로드 (useHistory가 true일 때만)
    const autoNavigate = 'autoNavigate' in options ? options.autoNavigate : true;
    if (autoNavigate && this.useHistory) {
      const initialPath = window.location.hash.slice(1) || '';
      if (initialPath) {
        this.navigate(initialPath, true);
      }
    }
  }

  /**
   * 페이지 이동
   * @param {string} path - 페이지 경로
   * @param {boolean} [replace=false] - 히스토리 교체 여부
   * @returns {Promise<void>}
   *
   * @example
   * router.navigate('views/home.html');
   * router.navigate('views/login.html', true); // 히스토리 교체
   */
  async navigate(path) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // 경로 보안 검증
    if (!Security.validatePath(path)) {
      console.error('Invalid path:', path);
      await this._emitHook('onError', new Error('Invalid path'));
      return;
    }
    await this._loadView(path, !replace);
  }

  /**
   * 뷰 로드
   * @private
   * @param {string} path - 경로 (쿼리 스트링 포함 가능)
   * @param {boolean} [pushState=true] - pushState 사용 여부
   *
   * @security
   * 이 메서드는 views/ 폴더의 HTML을 **sanitize 없이** innerHTML에 삽입합니다.
   * 이는 뷰 파일이 개발자가 작성한 신뢰 가능한 정적 파일이라는 전제 하에 동작합니다.
   *
   * **방어 계층:**
   * 1. `Security.validatePath()` — views/ 외부 경로, 경로 순회(../), 절대 경로, null byte 차단
   * 2. `_executeScripts()` — 뷰 내 script 태그를 재생성하여 실행 (신뢰 파일에 한함)
   *
   * **⚠️ 뷰 개발자 필수 규칙:**
   * - 사용자 입력을 DOM에 삽입할 때 반드시 `IMCAT.escape()` 또는 `textContent` 사용
   * - `innerHTML`에 사용자 입력을 직접 삽입하지 말 것
   * - URL 파라미터(`router.params()`)는 이스케이프되지 않은 원본이므로 DOM 삽입 시 이스케이프 필수
   * - 서버에서 동적으로 생성된 HTML을 views/에 저장하지 말 것
   */
  async _loadView(path) {
    let pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const from = this.currentPath;
    try {
      // 이전 뷰의 인스턴스 정리
      this._cleanupCurrentView();

      // beforeLoad 훅
      await this._emitHook('beforeLoad', path, from);

      // 로딩 표시
      if (this.loading) {
        this.loading.show('페이지 로딩 중...');
      }

      // 쿼리 스트링 분리 (fetch는 파일 경로만 필요)
      const [filePath] = path.split('?');

      // HTML 파일 가져오기
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const html = await response.text();

      // 뷰 파일 렌더링 — sanitize를 건너뜁니다.
      // @security 참조: 위 JSDoc의 보안 정책 및 개발자 필수 규칙을 반드시 준수하세요.

      // 컨테이너에 렌더링
      const container = document.querySelector(this.container);
      if (container) {
        container.innerHTML = html;

        // 스크립트 실행
        this._executeScripts(container);
      }

      // History API 업데이트 (useHistory가 true일 때만)
      if (pushState && this.useHistory) {
        window.history.pushState({
          path
        }, '', `#${path}`);
      }
      this.currentPath = path;

      // afterLoad 훅
      await this._emitHook('afterLoad', path);
    } catch (error) {
      console.error('Failed to load view:', error);
      await this._emitHook('onError', error);
    } finally {
      // 로딩 숨김
      if (this.loading) {
        this.loading.hide();
      }
    }
  }

  /**
   * 스크립트 실행
   * @private
   * @param {HTMLElement} container - 컨테이너
   */
  _executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');

      // 속성 복사
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // 내용 복사
      newScript.textContent = oldScript.textContent;

      // 기존 스크립트 교체
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  /**
   * URL 파라미터 조회
   * @returns {Object} 파라미터 객체
   *
   * @warning 반환값은 이스케이프되지 않은 원본입니다.
   * innerHTML에 삽입 시 반드시 Security.escape()로 처리하세요.
   *
   * @example
   * // URL: #views/product.html?id=123&color=red
   * const params = router.params();
   * console.log(params.id); // '123'
   *
   * // ⚠️ DOM 삽입 시 반드시 이스케이프
   * element.textContent = params.id; // 안전 (textContent)
   * element.innerHTML = IMCAT.escape(params.id); // 안전 (escape)
   */
  params() {
    const hash = window.location.hash.slice(1);
    const [, queryString] = hash.split('?');
    if (!queryString) return {};
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams) {
      // 원본 값 반환 — DOM 삽입 시 Security.escape() 필수
      params[key] = value;
    }
    return params;
  }

  /**
   * 뒤로 가기
   *
   * @example
   * router.back();
   */
  back() {
    window.history.back();
  }

  /**
   * 앞으로 가기
   *
   * @example
   * router.forward();
   */
  forward() {
    window.history.forward();
  }

  /**
   * 현재 경로
   * @returns {string} 현재 경로
   *
   * @example
   * const path = router.current(); // 'views/home.html'
   */
  current() {
    return this.currentPath;
  }

  /**
   * 컨테이너 설정
   * @param {string} selector - CSS 선택자
   *
   * @example
   * router.setContainer('#main-content');
   */
  setContainer(selector) {
    this.container = selector;
  }

  /**
   * 인스턴스 등록 (메모리 누수 방지)
   * @param {Object} instance - destroy() 메서드를 가진 인스턴스
   * @returns {Object} 등록된 인스턴스
   *
   * @example
   * const modal = new Modal();
   * router.registerInstance(modal);
   * // 뷰 전환 시 modal.destroy() 자동 호출됨
   */
  registerInstance(instance) {
    if (instance && typeof instance.destroy === 'function') {
      this.currentViewInstances.push(instance);
      return instance;
    }
    console.warn('Instance must have destroy() method');
    return instance;
  }

  /**
   * 현재 뷰의 모든 인스턴스 정리
   * @private
   */
  _cleanupCurrentView() {
    // 현재 뷰의 모든 인스턴스 정리
    this.currentViewInstances.forEach(instance => {
      try {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      } catch (error) {
        console.error('Error destroying instance:', error);
      }
    });

    // 인스턴스 배열 초기화
    this.currentViewInstances = [];
  }

  /**
   * beforeLoad 훅 등록
   * @param {Function} handler - 핸들러 (path, from) => {}
   * @returns {Function} 구독 취소 함수
   *
   * @example
   * const unsubscribe = router.beforeLoad((path, from) => {
   *   console.log(`${from} → ${path}`);
   * });
   */
  beforeLoad(handler) {
    this.hooks.beforeLoad.push(handler);
    return () => this._removeHook('beforeLoad', handler);
  }

  /**
   * afterLoad 훅 등록
   * @param {Function} handler - 핸들러 (path) => {}
   * @returns {Function} 구독 취소 함수
   *
   * @example
   * router.afterLoad((path) => {
   *   console.log('로드 완료:', path);
   * });
   */
  afterLoad(handler) {
    this.hooks.afterLoad.push(handler);
    return () => this._removeHook('afterLoad', handler);
  }

  /**
   * onError 훅 등록
   * @param {Function} handler - 핸들러 (error) => {}
   * @returns {Function} 구독 취소 함수
   *
   * @example
   * router.onError((error) => {
   *   console.error('로드 실패:', error);
   * });
   */
  onError(handler) {
    this.hooks.onError.push(handler);
    return () => this._removeHook('onError', handler);
  }

  /**
   * 훅 실행
   * @private
   * @param {string} name - 훅 이름
   * @param {...*} args - 인자
   */
  async _emitHook(name) {
    const handlers = this.hooks[name] || [];
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    for (const handler of handlers) {
      try {
        await handler(...args);
      } catch (error) {
        console.error(`Error in ${name} hook:`, error);
      }
    }
  }

  /**
   * 훅 제거
   * @private
   * @param {string} name - 훅 이름
   * @param {Function} handler - 핸들러
   */
  _removeHook(name, handler) {
    const handlers = this.hooks[name];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * 모든 훅 제거
   */
  clearHooks() {
    this.hooks.beforeLoad = [];
    this.hooks.afterLoad = [];
    this.hooks.onError = [];
  }

  /**
   * 등록된 인스턴스 수
   * @returns {number}
   */
  getInstanceCount() {
    return this.currentViewInstances.length;
  }

  /**
   * 라우터 정리 (메모리 누수 방지)
   * 이벤트 리스너와 인스턴스 모두 정리
   */
  destroy() {
    // popstate 이벤트 리스너 제거
    if (this._popstateHandler) {
      window.removeEventListener('popstate', this._popstateHandler);
      this._popstateHandler = null;
    }

    // 현재 뷰의 인스턴스 정리
    this._cleanupCurrentView();

    // 모든 훅 제거
    this.clearHooks();

    // 로딩 인디케이터 정리
    if (this.loading && typeof this.loading.forceHide === 'function') {
      this.loading.forceHide();
    }

    // 상태 초기화
    this.currentPath = '';
    this.instances.clear();
  }
}

/**
 * 로딩 인디케이터
 * @module core/loading
 */


/**
 * 로딩 인디케이터 클래스
 * @class
 * @description 로딩 스피너를 표시하고 숨기는 기능을 제공합니다.
 * 다양한 스타일(spinner, progress)을 지원합니다.
 *
 * @example
 * const loading = new LoadingIndicator();
 * loading.show('로딩 중...');
 */
class LoadingIndicator {
  /**
   * LoadingIndicator 생성자
   * @constructor
   */
  constructor() {
    this.element = null;
    this.config = {
      style: 'spinner',
      // 'spinner', 'bar', 'dots'
      color: '#007bff',
      position: 'center',
      // 'center', 'top'
      delay: 200 // ms
    };
    this.showTimer = null;
    this.hideTimer = null;
    this.isShowing = false;
  }

  /**
   * 로딩 표시
   * @param {string} [message=''] - 로딩 메시지
   *
   * @example
   * loading.show('데이터 로딩 중...');
   */
  show() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    // 이미 표시 중이면 무시
    if (this.isShowing) return;

    // 기존 타이머 취소
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    // delay 후에 표시 (빠른 로딩은 표시 안함)
    this.showTimer = setTimeout(() => {
      this._createElement(message);
      this._show();
      this.isShowing = true;
    }, this.config.delay);
  }

  /**
   * 로딩 숨김
   *
   * @example
   * loading.hide();
   */
  hide() {
    // 타이머 취소
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (!this.isShowing) return;

    // 부드러운 페이드아웃
    this.hideTimer = setTimeout(() => {
      this._hide();
      this.isShowing = false;
    }, 100);
  }

  /**
   * 진행률 설정 (프로그레스 바)
   * @param {number} percent - 진행률 (0-100)
   *
   * @example
   * loading.progress(50); // 50%
   */
  progress(percent) {
    if (!this.element) return;
    const bar = this.element.querySelector('.imcat-loading-bar-fill');
    if (bar) {
      bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }
  }

  /**
   * 설정 변경
   * @param {Object} options - 설정 옵션
   * @param {string} [options.style] - 스타일 ('spinner', 'bar', 'dots')
   * @param {string} [options.color] - 색상
   * @param {string} [options.position] - 위치 ('center', 'top')
   * @param {number} [options.delay] - 지연 시간 (ms)
   *
   * @example
   * loading.setConfig({
   *   style: 'bar',
   *   color: '#ff0000',
   *   position: 'top',
   *   delay: 300
   * });
   */
  setConfig(options) {
    Object.assign(this.config, options);
  }

  /**
   * 엘리먼트 생성
   * @private
   * @param {string} message - 메시지
   */
  _createElement(message) {
    if (this.element) return;
    this.element = document.createElement('div');
    this.element.className = `imcat-loading imcat-loading-${this.config.position}`;
    let innerHTML = '';
    if (this.config.style === 'spinner') {
      innerHTML = `
        <div class="imcat-loading-spinner">
          <div class="imcat-spinner"></div>
          ${message ? `<div class="imcat-loading-message">${Security.escape(String(message))}</div>` : ''}
        </div>
      `;
    } else if (this.config.style === 'bar') {
      innerHTML = `
        <div class="imcat-loading-bar">
          <div class="imcat-loading-bar-fill"></div>
        </div>
      `;
    } else if (this.config.style === 'dots') {
      innerHTML = `
        <div class="imcat-loading-dots">
          <span></span><span></span><span></span>
          ${message ? `<div class="imcat-loading-message">${Security.escape(String(message))}</div>` : ''}
        </div>
      `;
    }
    this.element.innerHTML = innerHTML;

    // CSS 변수 적용
    this.element.style.setProperty('--imcat-loading-color', this.config.color);

    // 기본 스타일 추가
    this._addDefaultStyles();
  }

  /**
   * 기본 스타일 추가
   * @private
   */
  _addDefaultStyles() {
    if (document.getElementById('imcat-loading-styles')) return;
    const style = document.createElement('style');
    style.id = 'imcat-loading-styles';
    style.textContent = `
      .imcat-loading {
        position: fixed;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .imcat-loading-center {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      
      .imcat-loading-top {
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: transparent;
      }
      
      .imcat-loading-show {
        opacity: 1;
      }
      
      .imcat-loading-spinner {
        text-align: center;
      }
      
      .imcat-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: var(--imcat-loading-color, #007bff);
        border-radius: 50%;
        animation: imcat-spin 1s linear infinite;
      }
      
      @keyframes imcat-spin {
        to { transform: rotate(360deg); }
      }
      
      .imcat-loading-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
      }
      
      .imcat-loading-bar-fill {
        height: 100%;
        background: var(--imcat-loading-color, #007bff);
        transition: width 0.3s ease;
        width: 0%;
      }
      
      .imcat-loading-dots {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-direction: column;
      }
      
      .imcat-loading-dots > span {
        width: 12px;
        height: 12px;
        background: var(--imcat-loading-color, #007bff);
        border-radius: 50%;
        display: inline-block;
        animation: imcat-bounce 1.4s infinite ease-in-out both;
      }
      
      .imcat-loading-dots > span:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      .imcat-loading-dots > span:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      @keyframes imcat-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
      
      .imcat-loading-message {
        margin-top: 15px;
        color: white;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 표시
   * @private
   */
  _show() {
    if (!this.element) return;
    document.body.appendChild(this.element);

    // 애니메이션을 위한 다음 프레임 대기 (offsetHeight reflow 대신 rAF 사용)
    requestAnimationFrame(() => {
      if (!this.element) return;
      this.element.classList.add('imcat-loading-show');
    });
  }

  /**
   * 숨김
   * @private
   */
  _hide() {
    if (!this.element) return;
    this.element.classList.remove('imcat-loading-show');
    setTimeout(() => {
      var _this$element;
      (_this$element = this.element) === null || _this$element === void 0 || _this$element.remove();
      this.element = null;
    }, 300);
  }

  /**
   * 현재 표시 상태
   * @returns {boolean}
   */
  isVisible() {
    return this.isShowing;
  }

  /**
   * 강제로 즉시 숨김 (타이머 무시)
   */
  forceHide() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    this.isShowing = false;
  }

  /**
   * 로딩 인디케이터 정리 (메모리 누수 방지)
   * 모든 타이머와 DOM 요소를 정리합니다.
   *
   * @example
   * // 애플리케이션 종료 시
   * LoadingIndicator.destroy();
   */
  destroy() {
    // 모든 타이머 정리
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    // DOM 요소 제거
    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    // 상태 초기화
    this.isShowing = false;
  }
}

// 싱글톤 인스턴스 (기본 사용, 클래스는 export class로 이미 내보냄)
var LoadingIndicator$1 = new LoadingIndicator();

var _APIUtil;
/**
 * API 유틸리티
 * @module core/api
 */

/**
 * API 유틸리티 클래스
 * @class
 * @description HTTP 요청을 위한 fetch API 래퍼 클래스입니다.
 * 표준화된 응답 형식, 인터셉터, 에러 처리 등을 제공합니다.
 *
 * @example
 * // GET 요청
 * const response = await APIUtil.get('/api/users');
 *
 * @example
 * // POST 요청
 * const response = await APIUtil.post('/api/users', { name: 'John' });
 */
class APIUtil {
  /**
   * 성공 응답 생성
   * @param {*} data - 응답 데이터
   * @param {string} [message='Success'] - 메시지
   * @param {number} [statusCode=200] - HTTP 상태 코드
   * @returns {Object} 표준 응답 객체
   *
   * @example
   * const response = APIUtil.success({ id: 1, name: 'John' }, 'User created', 201);
   */
  static success(data) {
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Success';
    let statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    return {
      success: true,
      statusCode,
      data,
      message,
      error: null,
      timestamp: Date.now()
    };
  }

  /**
   * 에러 응답 생성
   * @param {string} message - 에러 메시지
   * @param {number} [statusCode=400] - HTTP 상태 코드
   * @param {Object} [error=null] - 에러 상세
   * @returns {Object} 표준 에러 객체
   *
   * @example
   * const response = APIUtil.error('User not found', 404);
   */
  static error(message) {
    let statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
    let error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return {
      success: false,
      statusCode,
      data: null,
      message,
      error: error ? {
        message: error.message || message,
        name: error.name,
        type: error.type
      } : {
        message
      },
      timestamp: Date.now()
    };
  }

  /**
   * 페이지네이션 응답 생성
   * @param {Array} items - 아이템 배열
   * @param {Object} pagination - 페이지 정보
   * @param {number} pagination.page - 현재 페이지
   * @param {number} pagination.limit - 페이지당 아이템 수
   * @param {number} pagination.total - 전체 아이템 수
   * @returns {Object} 페이지네이션 응답
   *
   * @example
   * const response = APIUtil.paginated(items, {
   *   page: 1,
   *   limit: 10,
   *   total: 100
   * });
   */
  static paginated(items, pagination) {
    const {
      page,
      limit,
      total
    } = pagination;
    const totalPages = Math.ceil(total / limit);
    return this.success({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  }

  /**
   * HTTP 요청 (기본)
   * @param {string} url - 요청 URL
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.request('/api/users', {
   *   method: 'POST',
   *   body: JSON.stringify({ name: 'John' })
   * });
   */
  static async request(url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    try {
      var _response$headers, _response$headers$get;
      // 기본 헤더 설정 (GET/HEAD 요청에는 Content-Type 불필요)
      const method = (options.method || 'GET').toUpperCase();
      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
      const headers = {
        // FormData일 경우 Content-Type을 설정하지 않음 (브라우저가 boundary 자동 설정)
        ...(method !== 'GET' && method !== 'HEAD' && !isFormData ? {
          'Content-Type': 'application/json'
        } : {}),
        ...options.headers
      };

      // FormData일 때 사용자가 Content-Type을 직접 설정했으면 제거 (boundary 충돌 방지)
      if (isFormData && headers['Content-Type']) {
        delete headers['Content-Type'];
      }
      let config = {
        ...options,
        headers,
        url // URL도 config에 포함
      };

      // 요청 인터셉터 실행
      for (const interceptor of this._requestInterceptors) {
        if (interceptor && interceptor.onFulfilled) {
          try {
            config = await interceptor.onFulfilled(config);
          } catch (error) {
            if (interceptor.onRejected) {
              config = await interceptor.onRejected(error);
            } else {
              throw error;
            }
          }
        }
      }

      // URL 추출 (인터셉터에서 변경되었을 수 있음)
      const finalUrl = config.url || url;
      delete config.url; // fetch에 전달하지 않음

      // AbortController 타임아웃 (기본 30초)
      const timeout = config.timeout ?? 30000;
      delete config.timeout; // fetch에 전달하지 않음
      let controller = null;
      let timeoutId = null;
      if (timeout > 0 && typeof AbortController !== 'undefined') {
        controller = new AbortController();
        if (!config.signal) {
          config.signal = controller.signal;
        } else {
          // 사용자 signal과 타임아웃 signal 병합
          const userSignal = config.signal;
          if (typeof AbortSignal.any === 'function') {
            config.signal = AbortSignal.any([userSignal, controller.signal]);
          } else {
            // AbortSignal.any 미지원 브라우저 폴백: 사용자 signal abort 시 타임아웃도 중단
            userSignal.addEventListener('abort', () => controller.abort(), {
              once: true
            });
            config.signal = controller.signal;
          }
        }
        timeoutId = setTimeout(() => controller.abort(), timeout);
      }
      let response;
      try {
        response = await fetch(finalUrl, config);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }

      // JSON 파싱 (실패 시 텍스트로 처리)
      let data;
      const contentType = (_response$headers = response.headers) === null || _response$headers === void 0 || (_response$headers$get = _response$headers.get) === null || _response$headers$get === void 0 ? void 0 : _response$headers$get.call(_response$headers, 'content-type');
      if (contentType && !contentType.includes('application/json')) {
        // 명시적으로 JSON이 아닌 경우에만 text() 사용
        try {
          var _response$text, _response;
          const text = await ((_response$text = (_response = response).text) === null || _response$text === void 0 ? void 0 : _response$text.call(_response));
          data = {
            message: text || 'Non-JSON response'
          };
        } catch {
          data = {
            message: 'Non-JSON response'
          };
        }
      } else {
        // content-type 없거나 application/json → json() 우선 시도
        try {
          data = await response.json();
        } catch (_parseError) {
          data = {
            message: 'Invalid JSON response'
          };
        }
      }
      let result;
      if (!response.ok) {
        result = this.error(data.message || 'Request failed', response.status, data.error);
      } else {
        // 서버가 표준 형식을 반환하면 그대로 사용
        if (data.success !== undefined) {
          result = data;
        } else {
          // 아니면 표준 형식으로 래핑
          result = this.success(data);
        }
      }

      // 응답 인터셉터 실행
      for (const interceptor of this._responseInterceptors) {
        if (interceptor) {
          if (result.success && interceptor.onFulfilled) {
            result = await interceptor.onFulfilled(result);
          } else if (!result.success && interceptor.onRejected) {
            result = await interceptor.onRejected(result);
          }
        }
      }
      return result;
    } catch (error) {
      // 타임아웃 또는 네트워크 오류
      const isTimeout = error.name === 'AbortError';
      let result = this.error(isTimeout ? 'Request timeout' : error.message || 'Network error', isTimeout ? 408 : 0,
      // 408 = Request Timeout, 0 = 네트워크 오류
      error);

      // 에러에 대한 응답 인터셉터 실행
      for (const interceptor of this._responseInterceptors) {
        if (interceptor && interceptor.onRejected) {
          try {
            result = await interceptor.onRejected(result);
          } catch (_e) {
            // 인터셉터에서 에러가 발생하면 원래 에러 반환
            break;
          }
        }
      }
      return result;
    }
  }

  /**
   * GET 요청
   * @param {string} url - 요청 URL
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.get('/api/users');
   * if (response.success) {
   *   console.log(response.data);
   * }
   */
  static async get(url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.request(url, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * POST 요청
   * @param {string} url - 요청 URL
   * @param {Object} body - 요청 바디
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.post('/api/users', {
   *   name: 'John',
   *   email: 'john@example.com'
   * });
   */
  static async post(url, body) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(url, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  /**
   * PUT 요청
   * @param {string} url - 요청 URL
   * @param {Object} body - 요청 바디
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.put('/api/users/123', {
   *   name: 'Jane'
   * });
   */
  static async put(url, body) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  /**
   * PATCH 요청
   * @param {string} url - 요청 URL
   * @param {Object} body - 요청 바디
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.patch('/api/users/123', {
   *   age: 31
   * });
   */
  static async patch(url, body) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body)
    });
  }

  /**
   * DELETE 요청
   * @param {string} url - 요청 URL
   * @param {Object} [options={}] - fetch 옵션
   * @returns {Promise<Object>} API 응답
   *
   * @example
   * const response = await APIUtil.delete('/api/users/123');
   */
  static async delete(url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.request(url, {
      ...options,
      method: 'DELETE'
    });
  }

  /**
   * 여러 요청을 병렬로 실행
   * @param {...Promise} requests - 요청 프로미스들
   * @returns {Promise<Array>} 모든 응답 배열
   *
   * @example
   * const [users, posts, comments] = await APIUtil.all(
   *   APIUtil.get('/api/users'),
   *   APIUtil.get('/api/posts'),
   *   APIUtil.get('/api/comments')
   * );
   */
  static async all() {
    for (var _len = arguments.length, requests = new Array(_len), _key = 0; _key < _len; _key++) {
      requests[_key] = arguments[_key];
    }
    return Promise.all(requests);
  }

  /**
   * 여러 요청 중 가장 빠른 것만 반환
   * @param {...Promise} requests - 요청 프로미스들
   * @returns {Promise<Object>} 가장 빠른 응답
   *
   * @example
   * const response = await APIUtil.race(
   *   APIUtil.get('/api/server1/data'),
   *   APIUtil.get('/api/server2/data')
   * );
   */
  static async race() {
    for (var _len2 = arguments.length, requests = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      requests[_key2] = arguments[_key2];
    }
    return Promise.race(requests);
  }
}
_APIUtil = APIUtil;
// 인터셉터 저장소
_defineProperty(APIUtil, "_requestInterceptors", []);
_defineProperty(APIUtil, "_responseInterceptors", []);
/**
 * 인터셉터 객체
 */
_defineProperty(APIUtil, "interceptors", {
  /**
   * 요청 인터셉터
   */
  request: {
    /**
     * 요청 인터셉터 추가
     * @param {Function} onFulfilled - 성공 핸들러
     * @param {Function} [onRejected] - 실패 핸들러
     * @returns {number} 인터셉터 ID
     *
     * @example
     * const id = APIUtil.interceptors.request.use(
     *   (config) => {
     *     config.headers['Authorization'] = `Bearer ${token}`;
     *     return config;
     *   }
     * );
     */
    use(onFulfilled, onRejected) {
      _APIUtil._requestInterceptors.push({
        onFulfilled,
        onRejected
      });
      return _APIUtil._requestInterceptors.length - 1;
    },
    /**
     * 요청 인터셉터 제거
     * @param {number} id - 인터셉터 ID
     */
    eject(id) {
      if (_APIUtil._requestInterceptors[id]) {
        _APIUtil._requestInterceptors[id] = null;
      }
    },
    /**
     * 모든 요청 인터셉터 제거
     */
    clear() {
      _APIUtil._requestInterceptors = [];
    }
  },
  /**
   * 응답 인터셉터
   */
  response: {
    /**
     * 응답 인터셉터 추가
     * @param {Function} onFulfilled - 성공 핸들러
     * @param {Function} [onRejected] - 실패 핸들러
     * @returns {number} 인터셉터 ID
     *
     * @example
     * APIUtil.interceptors.response.use(
     *   (response) => response,
     *   (error) => {
     *     if (error.statusCode === 401) {
     *       // 로그아웃 처리
     *     }
     *     return Promise.reject(error);
     *   }
     * );
     */
    use(onFulfilled, onRejected) {
      _APIUtil._responseInterceptors.push({
        onFulfilled,
        onRejected
      });
      return _APIUtil._responseInterceptors.length - 1;
    },
    /**
     * 응답 인터셉터 제거
     * @param {number} id - 인터셉터 ID
     */
    eject(id) {
      if (_APIUtil._responseInterceptors[id]) {
        _APIUtil._responseInterceptors[id] = null;
      }
    },
    /**
     * 모든 응답 인터셉터 제거
     */
    clear() {
      _APIUtil._responseInterceptors = [];
    }
  },
  /**
   * 모든 인터셉터 제거
   */
  clear() {
    _APIUtil._requestInterceptors = [];
    _APIUtil._responseInterceptors = [];
  }
});

/**
 * 템플릿 엔진
 * @module core/template
 */


/**
 * 간단하고 빠른 템플릿 엔진
 * @class
 * @description {{key}} 문법을 사용하는 간단한 템플릿 엔진입니다.
 * 자동 XSS 방어(이스케이프)를 제공하며, 조건부/리스트 렌더링을 지원합니다.
 *
 * @example
 * const html = Template.render('Hello {{name}}!', { name: 'John' });
 */
class Template {
  /**
   * 템플릿 렌더링 (자동 XSS 방어)
   * @param {string} template - 템플릿 문자열 ({{key}} 형식)
   * @param {Object} [data={}] - 데이터 객체
   * @returns {string} 렌더링된 HTML
   *
   * @example
   * const html = Template.render('Hello {{name}}!', { name: 'John' });
   * // 'Hello John!'
   *
   * @example
   * // XSS 자동 방어
   * const html = Template.render('{{userInput}}', {
   *   userInput: '<script>alert("XSS")</script>'
   * });
   * // '&lt;script&gt;alert("XSS")&lt;/script&gt;'
   */
  static render(template) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (typeof template !== 'string') {
      return '';
    }
    let result = template;

    // 1. 섹션 블록: {{#key}}...{{/key}} (truthy / 배열 반복)
    result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, inner) => {
      const value = data[key];

      // 배열이면 반복 렌더링
      if (Array.isArray(value)) {
        return value.map(item => {
          if (item !== null && typeof item === 'object') {
            return this.render(inner, item);
          }
          // 원시값이면 {{.}} 치환 후 나머지 렌더링
          return this.render(inner.replace(/\{\{\.\}\}/g, this._escape(String(item))), data);
        }).join('');
      }

      // truthy면 내부 렌더링
      return value ? this.render(inner, data) : '';
    });

    // 2. 반전 블록: {{^key}}...{{/key}} (falsy)
    result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, inner) => {
      const value = data[key];
      if (!value || Array.isArray(value) && value.length === 0) {
        return this.render(inner, data);
      }
      return '';
    });

    // 3. {{key}} 단순 치환
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = data[key];

      // undefined/null은 빈 문자열로
      if (value === undefined || value === null) {
        return '';
      }

      // 자동 이스케이프 (XSS 방어)
      return this._escape(String(value));
    });
    return result;
  }

  /**
   * 안전하지 않은 렌더링 (이스케이프 없음)
   * 신뢰할 수 있는 HTML만 사용!
   *
   * @security ⛔ 사용자 입력을 data에 직접 전달하지 마세요.
   * 서버 렌더링 HTML 등 신뢰할 수 있는 소스 전용입니다.
   * 불가피한 경우 Security.sanitize()로 감싸세요.
   *
   * @param {string} template - 템플릿 문자열
   * @param {Object} [data={}] - 데이터 객체
   * @returns {string} 렌더링된 HTML
   *
   * @example
   * // ✅ 서버 렌더링 HTML (신뢰 소스)
   * const html = Template.renderRaw('{{content}}', {
   *   content: '<b>Bold</b>'
   * });
   *
   * @example
   * // ✅ 불가피한 경우 sanitize로 감싸기
   * const html = Template.renderRaw('{{content}}', {
   *   content: Security.sanitize(userInput)
   * });
   *
   * @example
   * // ❌ 금지: 사용자 입력 직접 전달
   * // Template.renderRaw('{{name}}', { name: userInput });
   */
  static renderRaw(template) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (typeof template !== 'string') {
      return '';
    }
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = data[key];
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  /**
   * 조건부 렌더링
   * @param {boolean} condition - 조건
   * @param {string} template - 템플릿 문자열
   * @param {Object} [data={}] - 데이터 객체
   * @returns {string} 렌더링된 HTML 또는 빈 문자열
   *
   * @example
   * const html = Template.if(user.isAdmin, '<button>Admin Panel</button>', user);
   *
   * @example
   * const html = Template.if(false, '<button>Hidden</button>');
   * // ''
   */
  static if(condition, template) {
    let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return condition ? this.render(template, data) : '';
  }

  /**
   * 리스트 렌더링
   * @param {Array} items - 아이템 배열
   * @param {string} template - 각 아이템의 템플릿
   * @returns {string} 렌더링된 HTML
   *
   * @example
   * const users = [
   *   { name: 'John', age: 30 },
   *   { name: 'Jane', age: 25 }
   * ];
   *
   * const html = Template.each(users, '<li>{{name}} ({{age}})</li>');
   * // '<li>John (30)</li><li>Jane (25)</li>'
   */
  static each(items, template) {
    if (!Array.isArray(items) || items.length === 0) {
      return '';
    }
    return items.map(item => this.render(template, item)).join('');
  }

  /**
   * 템플릿 컴파일 (재사용을 위한 함수 생성)
   * @param {string} template - 템플릿 문자열
   * @returns {Function} 렌더링 함수
   *
   * @example
   * const greeting = Template.compile('Hello {{name}}!');
   * greeting({ name: 'John' }); // 'Hello John!'
   * greeting({ name: 'Jane' }); // 'Hello Jane!'
   *
   * @performance
   * - 같은 템플릿을 여러 번 사용할 경우 compile()로 최적화
   * - 정규표현식이 매번 실행되지만, 간단한 패턴이므로 충분히 빠름
   * - 복잡한 템플릿 엔진이 필요하면 Handlebars, Mustache 권장
   */
  static compile(template) {
    var _this = this;
    return function () {
      let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _this.render(template, data);
    };
  }

  /**
   * HTML 이스케이프 (내부용)
   * @private
   * @param {string} str - 문자열
   * @returns {string} 이스케이프된 문자열
   */
  static _escape(str) {
    return Security.escape(str);
  }
}

/**
 * Storage Module - localStorage/sessionStorage 래퍼
 * @module core/storage
 */

/**
 * Storage 유틸리티
 * @class
 * @description localStorage/sessionStorage를 편리하게 사용할 수 있는 래퍼 클래스입니다.
 * 자동 직렬화/역직렬화, TTL(만료 시간) 지원을 제공합니다.
 *
 * @example
 * Storage.set('user', { name: 'John' });
 * const user = Storage.get('user');
 */
class Storage {
  /**
   * 값 저장
   * @param {string} key - 키
   * @param {*} value - 값 (자동으로 JSON 직렬화)
   * @param {Object} [options={}] - 옵션
   * @param {number} [options.expires] - 만료 시간 (초)
   * @param {string} [options.storage='local'] - 'local' 또는 'session'
   * @returns {boolean} 성공 여부
   *
   * @example
   * Storage.set('user', { id: 1, name: 'John' });
   * Storage.set('token', 'abc123', { expires: 3600 }); // 1시간 후 만료
   * Storage.set('temp', 'data', { storage: 'session' }); // sessionStorage
   */
  static set(key, value) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!key || typeof key !== 'string') {
      console.error('Storage.set: key must be a non-empty string');
      return false;
    }
    try {
      const storage = options.storage === 'session' ? sessionStorage : localStorage;
      const data = {
        value,
        timestamp: Date.now()
      };

      // 만료 시간 설정
      if (options.expires && typeof options.expires === 'number') {
        data.expires = Date.now() + options.expires * 1000;
      }
      storage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  }

  /**
   * 값 가져오기
   * @param {string} key - 키
   * @param {*} [defaultValue] - 기본값 (없거나 만료된 경우 반환)
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {*} 저장된 값 또는 기본값
   *
   * @example
   * const user = Storage.get('user');
   * const count = Storage.get('count', 0); // 없으면 0 반환
   */
  static get(key) {
    let defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let storage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'local';
    if (!key || typeof key !== 'string') {
      return defaultValue;
    }
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      const item = storageObj.getItem(key);
      if (!item) {
        return defaultValue;
      }
      const data = JSON.parse(item);

      // 만료 확인
      if (data.expires && Date.now() > data.expires) {
        this.remove(key, storage);
        return defaultValue;
      }
      return data.value;
    } catch (error) {
      console.error('Storage.get error:', error);
      return defaultValue;
    }
  }

  /**
   * 값 존재 확인
   * @param {string} key - 키
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {boolean} 존재 여부
   *
   * @example
   * if (Storage.has('token')) {
   *   // 토큰이 있음
   * }
   */
  static has(key) {
    let storage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'local';
    if (!key || typeof key !== 'string') {
      return false;
    }
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      const item = storageObj.getItem(key);
      if (!item) {
        return false;
      }
      const data = JSON.parse(item);

      // 만료 확인
      if (data.expires && Date.now() > data.expires) {
        this.remove(key, storage);
        return false;
      }
      return true;
    } catch (_error) {
      return false;
    }
  }

  /**
   * 값 제거
   * @param {string} key - 키
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {boolean} 성공 여부
   *
   * @example
   * Storage.remove('token');
   */
  static remove(key) {
    let storage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'local';
    if (!key || typeof key !== 'string') {
      return false;
    }
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      storageObj.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  }

  /**
   * 모든 값 제거
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {boolean} 성공 여부
   *
   * @example
   * Storage.clear(); // localStorage 전체 삭제
   * Storage.clear('session'); // sessionStorage 전체 삭제
   */
  static clear() {
    let storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      storageObj.clear();
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  }

  /**
   * 모든 키 목록 가져오기
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {string[]} 키 배열
   *
   * @example
   * const keys = Storage.keys(); // ['user', 'token', ...]
   */
  static keys() {
    let storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      return Object.keys(storageObj);
    } catch (error) {
      console.error('Storage.keys error:', error);
      return [];
    }
  }

  /**
   * 스토리지 크기 확인 (대략적)
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {number} 사용 중인 바이트 수 (근사값)
   *
   * @example
   * const size = Storage.size(); // 1024 (bytes)
   */
  static size() {
    let storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      let total = 0;
      for (let i = 0; i < storageObj.length; i++) {
        const key = storageObj.key(i);
        const value = storageObj.getItem(key);
        if (key && value) {
          total += key.length + value.length;
        }
      }
      return total * 2; // UTF-16이므로 2배
    } catch (error) {
      console.error('Storage.size error:', error);
      return 0;
    }
  }

  /**
   * 만료된 항목 제거
   * @param {string} [storage='local'] - 'local' 또는 'session'
   * @returns {number} 제거된 항목 수
   *
   * @example
   * const removed = Storage.cleanExpired(); // 만료된 항목 삭제
   */
  static cleanExpired() {
    let storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
    try {
      const storageObj = storage === 'session' ? sessionStorage : localStorage;
      const keys = Object.keys(storageObj);
      let removed = 0;
      keys.forEach(key => {
        try {
          const item = storageObj.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.expires && Date.now() > data.expires) {
              storageObj.removeItem(key);
              removed++;
            }
          }
        } catch (_e) {
          // JSON 파싱 실패는 무시
        }
      });
      return removed;
    } catch (error) {
      console.error('Storage.cleanExpired error:', error);
      return 0;
    }
  }
}

/**
 * URL & Query String 유틸리티
 * @module core/url
 */

/**
 * URL 파싱 및 빌딩 유틸리티
 * @class
 * @description URL 과 쿠리 스트링을 파싱하고 조작하는 유틸리티 클래스입니다.
 * URLSearchParams를 래핑하여 편리한 API를 제공합니다.
 *
 * @example
 * const params = URLUtil.parse('?id=1&name=John');
 * const query = URLUtil.stringify({ id: 1, name: 'John' });
 */
class URLUtil {
  /**
   * 쿼리 스트링 파싱
   * @param {string} [queryString] - 쿼리 스트링 (없으면 현재 URL 사용)
   * @returns {Object} 파싱된 객체
   *
   * @example
   * const params = URLUtil.parseQuery('?page=1&sort=name');
   * // { page: '1', sort: 'name' }
   *
   * @example
   * const params = URLUtil.parseQuery(); // 현재 URL의 쿼리 파싱
   */
  static parseQuery(queryString) {
    const query = queryString !== undefined ? queryString : typeof window !== 'undefined' ? window.location.search : '';
    if (!query) return {};
    const params = {};
    const searchParams = new URLSearchParams(query);
    searchParams.forEach((value, key) => {
      // 배열 처리 (key[])
      if (key.endsWith('[]')) {
        const arrayKey = key.slice(0, -2);
        if (!params[arrayKey]) params[arrayKey] = [];
        params[arrayKey].push(value);
      } else {
        params[key] = value;
      }
    });
    return params;
  }

  /**
   * 쿼리 스트링 빌딩
   * @param {Object} params - 파라미터 객체
   * @param {boolean} [includeQuestion=true] - ? 포함 여부
   * @returns {string} 쿼리 스트링
   *
   * @example
   * const query = URLUtil.buildQuery({ page: 2, sort: 'name' });
   * // '?page=2&sort=name'
   *
   * @example
   * const query = URLUtil.buildQuery({ tags: ['js', 'css'] });
   * // '?tags[]=js&tags[]=css'
   */
  static buildQuery(params) {
    let includeQuestion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (!params || typeof params !== 'object') {
      return includeQuestion ? '?' : '';
    }
    const pairs = [];
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === null || value === undefined) {
        return; // skip
      }
      if (Array.isArray(value)) {
        // 배열 처리
        value.forEach(item => {
          pairs.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
        });
      } else {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    const query = pairs.join('&');
    return query ? (includeQuestion ? '?' : '') + query : '';
  }

  /**
   * URL과 쿼리 파라미터 결합
   * @param {string} url - 기본 URL
   * @param {Object} params - 파라미터 객체
   * @returns {string} 결합된 URL
   *
   * @example
   * const url = URLUtil.buildURL('/api/users', { page: 1, limit: 10 });
   * // '/api/users?page=1&limit=10'
   */
  static buildURL(url, params) {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    const query = this.buildQuery(params, false);
    if (!query) return url;

    // 이미 쿼리 스트링이 있는 경우
    if (url.includes('?')) {
      return `${url}&${query}`;
    }
    return `${url}?${query}`;
  }

  /**
   * 현재 URL에 파라미터 추가/업데이트 (히스토리 없이)
   * @param {Object} params - 추가할 파라미터
   * @param {boolean} [replace=false] - replace 모드 (기존 파라미터 유지 여부)
   *
   * @example
   * // 현재 URL: /page?foo=bar
   * URLUtil.updateQuery({ page: 2 });
   * // 결과: /page?foo=bar&page=2
   *
   * @example
   * URLUtil.updateQuery({ page: 2 }, true); // replace 모드
   * // 결과: /page?page=2
   */
  static updateQuery(params) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const currentParams = replace ? {} : this.parseQuery();
    const newParams = {
      ...currentParams,
      ...params
    };
    const query = this.buildQuery(newParams);
    const newURL = window.location.pathname + query;
    window.history.replaceState({}, '', newURL);
  }

  /**
   * 특정 쿼리 파라미터 가져오기
   * @param {string} key - 파라미터 키
   * @param {*} [defaultValue] - 기본값
   * @returns {*} 파라미터 값
   *
   * @example
   * // 현재 URL: /page?id=123&name=John
   * const id = URLUtil.getParam('id'); // '123'
   * const age = URLUtil.getParam('age', 0); // 0 (기본값)
   */
  static getParam(key) {
    let defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const params = this.parseQuery();
    return params[key] !== undefined ? params[key] : defaultValue;
  }

  /**
   * 특정 쿼리 파라미터 제거
   * @param {string|string[]} keys - 제거할 키 (배열 가능)
   *
   * @example
   * // 현재 URL: /page?id=123&name=John&age=30
   * URLUtil.removeParam('age');
   * // 결과: /page?id=123&name=John
   *
   * @example
   * URLUtil.removeParam(['id', 'age']);
   * // 결과: /page?name=John
   */
  static removeParam(keys) {
    const params = this.parseQuery();
    const keysToRemove = Array.isArray(keys) ? keys : [keys];
    keysToRemove.forEach(key => {
      delete params[key];
    });
    const query = this.buildQuery(params);
    const newURL = window.location.pathname + query;
    window.history.replaceState({}, '', newURL);
  }

  /**
   * 모든 쿼리 파라미터 제거
   *
   * @example
   * // 현재 URL: /page?id=123&name=John
   * URLUtil.clearQuery();
   * // 결과: /page
   */
  static clearQuery() {
    window.history.replaceState({}, '', window.location.pathname);
  }

  /**
   * URL 파싱 (전체)
   * @param {string} [url] - 파싱할 URL (없으면 현재 URL)
   * @returns {Object} 파싱된 URL 정보
   *
   * @example
   * const info = URLUtil.parse('https://example.com:8080/path?id=1#section');
   * // {
   * //   protocol: 'https:',
   * //   host: 'example.com:8080',
   * //   hostname: 'example.com',
   * //   port: '8080',
   * //   pathname: '/path',
   * //   search: '?id=1',
   * //   hash: '#section',
   * //   query: { id: '1' }
   * // }
   */
  static parse(url) {
    const urlObj = url ? new URL(url, window.location.origin) : window.location;
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      query: this.parseQuery(urlObj.search)
    };
  }
}

/**
 * State Management - 리액티브 상태 관리
 * @module core/state
 */

/**
 * 리액티브 상태 관리 클래스
 * @class
 * @description 리액티브 상태 관리를 제공하는 클래스입니다.
 * watch, computed 등의 기능으로 상태 변화를 감지하고 자동 UI 업데이트를 지원합니다.
 *
 * @example
 * const manager = new StateManager();
 * const state = manager.create({ count: 0 });
 */
class StateManager {
  /**
   * 상태 스토어 생성
   * @param {Object} initialState - 초기 상태
   * @returns {Proxy} 리액티브 상태 객체
   *
   * @example
   * const store = StateManager.create({
   *   count: 0,
   *   user: null
   * });
   *
   * // 상태 변경 감지
   * store.watch('count', (newValue, oldValue) => {
   *   console.log(`count: ${oldValue} -> ${newValue}`);
   * });
   *
   * store.count++; // 자동으로 감지됨
   */
  static create() {
    let initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const state = new StateStore(initialState);
    return state.getProxy();
  }
}

/**
 * 상태 스토어 내부 클래스
 * @class
 * @private
 * @description 상태를 저장하고 관리하는 내부 클래스입니다.
 */
class StateStore {
  /**
   * StateStore 생성자
   * @constructor
   * @param {Object} initialState - 초기 상태
   */
  constructor(initialState) {
    this._initialState = {
      ...initialState
    };
    this._state = {
      ...initialState
    };
    this._proxy = null; // Proxy 참조 (getProxy() 후 설정)
    this._watchers = new Map(); // key -> [callback, callback, ...]
    this._computedCache = new Map();
    this._computedDeps = new Map();
    this._isUpdating = false;
    this._batchedUpdates = [];
    this._destroyed = false;
  }

  /**
   * 리액티브 프록시 생성
   */
  getProxy() {
    const self = this;
    const proxy = new Proxy(this._state, {
      get(target, property) {
        // 내부 메서드 접근
        if (property === '_store') return self;
        if (property === 'watch') return self.watch.bind(self);
        if (property === 'unwatch') return self.unwatch.bind(self);
        if (property === 'compute') return self.compute.bind(self);
        if (property === 'batch') return self.batch.bind(self);
        if (property === 'getState') return self.getState.bind(self);
        if (property === 'setState') return self.setState.bind(self);
        if (property === 'reset') return self.reset.bind(self);
        if (property === 'destroy') return self.destroy.bind(self);

        // destroy 후 접근 경고
        if (self._destroyed) {
          console.error(`StateStore: 이미 destroy된 상태 스토어에 접근하고 있습니다 (key: ${String(property)})`);
          return undefined;
        }
        return target[property];
      },
      set(target, property, value) {
        // destroy 후 변경 경고
        if (self._destroyed) {
          console.error(`StateStore: 이미 destroy된 상태 스토어를 변경하려 합니다 (key: ${String(property)})`);
          return true;
        }
        const oldValue = target[property];

        // 값이 같으면 무시
        if (oldValue === value) return true;

        // 상태 업데이트
        target[property] = value;

        // 배치 모드가 아니면 즉시 알림
        if (!self._isUpdating) {
          self._notifyWatchers(property, value, oldValue);
        } else {
          // 배치 모드면 대기열에 추가
          self._batchedUpdates.push({
            property,
            value,
            oldValue
          });
        }
        return true;
      }
    });

    // Proxy 참조 저장 (setState 등 내부 메서드에서 Proxy를 통해 할당하기 위함)
    this._proxy = proxy;
    return proxy;
  }

  /**
   * 상태 변경 감시
   * @param {string} key - 감시할 키
   * @param {Function} callback - 콜백 (newValue, oldValue)
   * @returns {Function} 구독 취소 함수
   */
  watch(key, callback) {
    if (!this._watchers.has(key)) {
      this._watchers.set(key, []);
    }
    this._watchers.get(key).push(callback);

    // 구독 취소 함수 반환
    return () => this.unwatch(key, callback);
  }

  /**
   * 감시 취소
   * @param {string} key - 키
   * @param {Function} [callback] - 콜백 (없으면 모두 제거)
   */
  unwatch(key, callback) {
    if (!this._watchers.has(key)) return;
    if (callback) {
      const callbacks = this._watchers.get(key);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }

      // 콜백이 없으면 키 제거
      if (callbacks.length === 0) {
        this._watchers.delete(key);
      }
    } else {
      // 모든 콜백 제거
      this._watchers.delete(key);
    }
  }

  /**
   * 계산된 속성 (computed property)
   * @param {string} key - 키
   * @param {Function} getter - 계산 함수
   * @returns {*} 계산된 값
   *
   * @example
   * store.compute('fullName', () => {
   *   return `${store.firstName} ${store.lastName}`;
   * });
   */
  compute(key, getter) {
    const self = this;

    // 의존성 추적
    const deps = this._trackDependencies(getter);
    this._computedDeps.set(key, deps);

    // 의존성 변경 시 캐시 무효화 + 워처 통지
    deps.forEach(dep => {
      this.watch(dep, () => {
        const oldValue = this._computedCache.get(key);
        this._computedCache.delete(key);
        const newValue = this._state[key];
        if (oldValue !== newValue) {
          this._notifyWatchers(key, newValue, oldValue);
        }
      });
    });

    // getter를 상태에 추가
    Object.defineProperty(this._state, key, {
      get: () => {
        if (self._computedCache.has(key)) {
          return self._computedCache.get(key);
        }

        // getter를 state 컨텍스트로 실행
        const value = getter.call(self._state);
        self._computedCache.set(key, value);
        return value;
      },
      enumerable: true,
      configurable: true
    });
    return this._state[key];
  }

  /**
   * 의존성 추적 (간단한 구현)
   * @private
   */
  _trackDependencies(getter) {
    const deps = new Set();
    const proxy = new Proxy(this._state, {
      get(target, property) {
        deps.add(property);
        return target[property];
      }
    });

    // getter 실행하여 의존성 수집
    try {
      getter.call(proxy);
    } catch (_e) {
      // 에러 무시 (의존성만 수집)
    }
    return Array.from(deps);
  }

  /**
   * 배치 업데이트 (여러 변경을 한 번에)
   * @param {Function} fn - 업데이트 함수
   *
   * @example
   * store.batch(() => {
   *   store.count++;
   *   store.name = 'John';
   *   store.age = 30;
   * }); // 모든 변경 후 한 번만 알림
   */
  batch(fn) {
    this._isUpdating = true;
    this._batchedUpdates = [];
    try {
      fn();
    } finally {
      this._isUpdating = false;

      // 배치된 업데이트 알림
      this._batchedUpdates.forEach(_ref => {
        let {
          property,
          value,
          oldValue
        } = _ref;
        this._notifyWatchers(property, value, oldValue);
      });
      this._batchedUpdates = [];
    }
  }

  /**
   * 전체 상태 가져오기
   * @returns {Object} 상태 복사본
   */
  getState() {
    return {
      ...this._state
    };
  }

  /**
   * 전체 상태 설정
   * @param {Object} newState - 새 상태
   * @param {boolean} [merge=true] - 병합 여부
   */
  setState(newState) {
    let merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const proxy = this._proxy;
    this.batch(() => {
      if (merge) {
        Object.keys(newState).forEach(key => {
          proxy[key] = newState[key];
        });
      } else {
        // 전체 교체: 기존 키 삭제
        Object.keys(this._state).forEach(key => {
          if (!(key in newState)) {
            const oldValue = this._state[key];
            delete this._state[key];
            this._batchedUpdates.push({
              property: key,
              value: undefined,
              oldValue
            });
          }
        });
        // 새 값 설정 (Proxy를 통해)
        Object.keys(newState).forEach(key => {
          proxy[key] = newState[key];
        });
      }
    });
  }

  /**
   * 초기 상태로 리셋
   * @param {Object} [initialState] - 새 초기 상태 (없으면 빈 객체)
   */
  reset(initialState) {
    this.setState(initialState !== undefined ? initialState : {
      ...this._initialState
    }, false);
  }

  /**
   * 감시자에게 알림
   * @private
   */
  _notifyWatchers(key, newValue, oldValue) {
    if (!this._watchers.has(key)) return;
    const callbacks = this._watchers.get(key);
    callbacks.forEach(callback => {
      try {
        callback(newValue, oldValue);
      } catch (error) {
        console.error(`Error in watcher for "${key}":`, error);
      }
    });
  }

  /**
   * 상태 스토어 정리 (메모리 누수 방지)
   * 모든 watcher와 computed 속성을 제거합니다.
   *
   * @example
   * const state = StateManager.create({ count: 0 });
   * state.watch('count', handler);
   * // 사용 종료 시
   * state.destroy();
   */
  destroy() {
    // destroyed 플래그 설정 (Proxy 접근 경고용)
    this._destroyed = true;

    // 모든 watcher 제거
    this._watchers.clear();

    // computed 캐시 및 의존성 제거
    this._computedCache.clear();
    this._computedDeps.clear();

    // 배치 업데이트 큐 정리
    this._batchedUpdates = [];
    this._isUpdating = false;

    // 상태 초기화
    this._state = {};
  }
}

/**
 * 전역 상태 스토어 (옵션)
 * @class
 * @description 앱 전체에서 공유하는 전역 상태를 관리합니다.
 * 여러 컴포넌트간 상태를 공유할 때 사용합니다.
 *
 * @example
 * GlobalState.set('user', { name: 'John' });
 * const user = GlobalState.get('user');
 */
class GlobalState {
  /**
   * 전역 스토어 생성 또는 가져오기
   * @param {string} name - 스토어 이름
   * @param {Object} [initialState] - 초기 상태
   * @returns {Proxy} 스토어
   *
   * @example
   * const userStore = GlobalState.use('user', { id: null, name: '' });
   * const appStore = GlobalState.use('app', { theme: 'light' });
   */
  static use(name) {
    let initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!this._stores.has(name)) {
      this._stores.set(name, StateManager.create(initialState));
    }
    return this._stores.get(name);
  }

  /**
   * 전역 스토어 제거
   * @param {string} name - 스토어 이름
   */
  static remove(name) {
    const store = this._stores.get(name);
    if (store && typeof store.destroy === 'function') {
      store.destroy();
    }
    this._stores.delete(name);
  }

  /**
   * 모든 전역 스토어 제거
   */
  static clear() {
    // 모든 스토어의 destroy() 호출
    this._stores.forEach(store => {
      if (store && typeof store.destroy === 'function') {
        store.destroy();
      }
    });
    this._stores.clear();
  }
}
_defineProperty(GlobalState, "_stores", new Map());

/**
 * Form Validation Module
 * @module core/form
 */

/**
 * 폼 검증 유틸리티
 * @class
 * @description 폼 입력 값의 검증을 수행하는 클래스입니다.
 * 다양한 검증 규칙(required, email, min, max 등)을 제공합니다.
 *
 * @example
 * const validator = new FormValidator('#myForm', {
 *   rules: { email: ['required', 'email'] }
 * });
 */
class FormValidator {
  /**
   * 폼 검증기 생성
   * @param {string|HTMLElement} form - 폼 선택자 또는 요소
   * @param {Object} rules - 검증 규칙
   * @param {Object} [options={}] - 옵션
   * @returns {FormValidator} 검증기 인스턴스
   *
   * @example
   * const validator = FormValidator.create('#login-form', {
   *   email: { required: true, email: true },
   *   password: { required: true, minLength: 8 }
   * });
   */
  static create(form, rules) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new FormValidator(form, rules, options);
  }
  constructor(_form, rules) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    /**
     * 기본 검증 규칙
     */
    _defineProperty(this, "validators", {
      required: {
        validate: value => ({
          valid: value !== null && value !== undefined && value.trim() !== '',
          message: '필수 입력 항목입니다.'
        })
      },
      email: {
        validate: value => {
          if (!value) return {
            valid: true
          };
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return {
            valid: regex.test(value),
            message: '올바른 이메일 형식이 아닙니다.'
          };
        }
      },
      minLength: {
        validate: (value, min) => ({
          valid: !value || value.length >= min,
          message: `최소 ${min}자 이상 입력해주세요.`
        })
      },
      maxLength: {
        validate: (value, max) => ({
          valid: !value || value.length <= max,
          message: `최대 ${max}자까지 입력 가능합니다.`
        })
      },
      min: {
        validate: (value, min) => {
          if (!value) return {
            valid: true
          };
          const num = Number(value);
          return {
            valid: !isNaN(num) && num >= min,
            message: `${min} 이상의 값을 입력해주세요.`
          };
        }
      },
      max: {
        validate: (value, max) => {
          if (!value) return {
            valid: true
          };
          const num = Number(value);
          return {
            valid: !isNaN(num) && num <= max,
            message: `${max} 이하의 값을 입력해주세요.`
          };
        }
      },
      pattern: {
        validate: (value, pattern) => {
          if (!value) return {
            valid: true
          };
          try {
            // ReDoS 방어: 문자열 패턴 길이 제한 (최대 500자)
            if (typeof pattern === 'string' && pattern.length > 500) {
              console.error('FormValidator: 정규식 패턴이 너무 깁니다 (최대 500자).');
              return {
                valid: false,
                message: '검증 패턴이 올바르지 않습니다.'
              };
            }
            // ReDoS 방어: 검증 대상 값 길이 제한 (최대 10000자)
            if (value.length > 10000) {
              return {
                valid: false,
                message: '입력값이 너무 깁니다.'
              };
            }
            const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
            return {
              valid: regex.test(value),
              message: '입력 형식이 올바르지 않습니다.'
            };
          } catch (_e) {
            console.error('FormValidator: 잘못된 정규식 패턴:', pattern);
            return {
              valid: false,
              message: '검증 패턴이 올바르지 않습니다.'
            };
          }
        }
      },
      number: {
        validate: value => {
          if (!value || value.trim() === '') return {
            valid: true
          };
          return {
            valid: !isNaN(Number(value)) && value.trim() !== '',
            message: '숫자만 입력 가능합니다.'
          };
        }
      },
      url: {
        validate: value => {
          if (!value) return {
            valid: true
          };
          try {
            new URL(value);
            return {
              valid: true
            };
          } catch {
            return {
              valid: false,
              message: '올바른 URL 형식이 아닙니다.'
            };
          }
        }
      },
      match: {
        validate: (value, targetFieldName, form) => {
          if (!value) return {
            valid: true
          };
          const targetField = form.elements[targetFieldName];
          return {
            valid: targetField && value === targetField.value,
            message: '입력값이 일치하지 않습니다.'
          };
        }
      },
      custom: {
        validate: (value, fn) => {
          const result = fn(value);
          if (typeof result === 'boolean') {
            return {
              valid: result,
              message: '유효하지 않은 값입니다.'
            };
          }
          return result;
        }
      }
    });
    this.form = typeof _form === 'string' ? document.querySelector(_form) : _form;
    this.rules = rules;
    this.options = {
      validateOnBlur: true,
      validateOnInput: false,
      errorClass: 'is-invalid',
      successClass: 'is-valid',
      errorMessageClass: 'error-message',
      showErrorMessages: true,
      ...options
    };
    this.errors = {};
    this.touched = {};
    this._eventHandlers = [];
    this._init();
  }

  /**
   * 초기화
   * @private
   */
  _init() {
    if (!this.form) return;

    // 각 필드에 이벤트 리스너 추가
    Object.keys(this.rules).forEach(fieldName => {
      const field = this.form.elements[fieldName];
      if (!field) return;
      if (this.options.validateOnBlur) {
        const blurHandler = () => this._validateField(fieldName);
        field.addEventListener('blur', blurHandler);
        this._eventHandlers.push({
          element: field,
          event: 'blur',
          handler: blurHandler
        });
      }
      if (this.options.validateOnInput) {
        const inputHandler = () => this._validateField(fieldName);
        field.addEventListener('input', inputHandler);
        this._eventHandlers.push({
          element: field,
          event: 'input',
          handler: inputHandler
        });
      }
    });

    // 폼 제출 이벤트
    const submitHandler = e => {
      if (!this.validate()) {
        e.preventDefault();
      }
    };
    this.form.addEventListener('submit', submitHandler);
    this._eventHandlers.push({
      element: this.form,
      event: 'submit',
      handler: submitHandler
    });
  }

  /**
   * 단일 필드 검증
   * @param {string} fieldName - 필드 이름
   * @returns {boolean} 검증 성공 여부
   */
  _validateField(fieldName) {
    const field = this.form.elements[fieldName];
    if (!field) return true;
    const rules = this.rules[fieldName];
    const value = field.value;
    this.touched[fieldName] = true;

    // 모든 규칙 검사
    for (const [ruleName, ruleValue] of Object.entries(rules)) {
      const validator = this.validators[ruleName];
      if (!validator) continue;
      const result = validator.validate(value, ruleValue, this.form);
      if (!result.valid) {
        this.errors[fieldName] = result.message;
        this._updateFieldUI(field, false, result.message);
        return false;
      }
    }

    // 모든 규칙 통과
    delete this.errors[fieldName];
    this._updateFieldUI(field, true);
    return true;
  }

  /**
   * 전체 폼 검증
   * @returns {boolean} 검증 성공 여부
   */
  validate() {
    let isValid = true;
    Object.keys(this.rules).forEach(fieldName => {
      if (!this._validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  /**
   * 필드 UI 업데이트
   * @private
   */
  _updateFieldUI(field, isValid) {
    let errorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    // 클래스 업데이트
    field.classList.remove(this.options.errorClass, this.options.successClass);
    field.classList.add(isValid ? this.options.successClass : this.options.errorClass);

    // 에러 메시지 표시
    if (this.options.showErrorMessages) {
      let errorEl = field.parentElement.querySelector(`.${this.options.errorMessageClass}`);
      if (!isValid && errorMessage) {
        if (!errorEl) {
          errorEl = document.createElement('div');
          errorEl.className = this.options.errorMessageClass;
          field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
      } else if (errorEl) {
        errorEl.style.display = 'none';
      }
    }
  }

  /**
   * 에러 목록 가져오기
   * @returns {Object} 에러 객체
   */
  getErrors() {
    return {
      ...this.errors
    };
  }

  /**
   * 특정 필드의 에러 가져오기
   * @param {string} fieldName - 필드 이름
   * @returns {string|null} 에러 메시지
   */
  getError(fieldName) {
    return this.errors[fieldName] || null;
  }

  /**
   * 검증 성공 여부
   * @returns {boolean}
   */
  isValid() {
    return Object.keys(this.errors).length === 0;
  }

  /**
   * 폼 리셋
   */
  reset() {
    this.errors = {};
    this.touched = {};
    if (this.form) {
      this.form.reset();

      // UI 초기화
      Object.keys(this.rules).forEach(fieldName => {
        const field = this.form.elements[fieldName];
        if (field) {
          field.classList.remove(this.options.errorClass, this.options.successClass);
          const errorEl = field.parentElement.querySelector(`.${this.options.errorMessageClass}`);
          if (errorEl) {
            errorEl.style.display = 'none';
          }
        }
      });
    }
  }

  /**
   * 이벤트 리스너 정리
   */
  destroy() {
    this._eventHandlers.forEach(_ref => {
      let {
        element,
        event,
        handler
      } = _ref;
      element.removeEventListener(event, handler);
    });
    this._eventHandlers = [];
  }
  /**
   * 커스텀 검증 규칙 추가
   * @param {string} name - 규칙 이름
   * @param {Function} validator - 검증 함수
   */
  addValidator(name, validator) {
    this.validators[name] = validator;
  }
}

var _AnimationUtil;
/**
 * Animation Utilities - 다양한 애니메이션 효과
 * @module core/animation
 */

/**
 * 애니메이션 유틸리티
 * @class
 * @description Web Animations API 기반의 다양한 애니메이션 효과를 제공합니다.
 * GPU 가속을 활용하여 부드러운 60fps 애니메이션을 구현합니다.
 *
 * @example
 * // Fade In 애니메이션
 * await AnimationUtil.animate('#box').fadeIn(300);
 *
 * @example
 * // Bounce In 애니메이션
 * await AnimationUtil.animate('.card').bounceIn(600);
 */
class AnimationUtil {
  /**
   * 애니메이션 생성
   * @param {string|HTMLElement} element - 대상 요소
   * @returns {Animator} 애니메이터 인스턴스
   *
   * @example
   * await AnimationUtil.animate('#box').fadeIn(300);
   * await AnimationUtil.animate('#box').slideDown(400);
   */
  static animate(element) {
    return new Animator(element);
  }

  /**
   * 이징 함수들
   */
}

/**
 * 애니메이터 클래스
 * @class
 * @description 개별 요소에 대한 애니메이션을 실행하는 클래스입니다.
 * 20가지 이상의 다양한 애니메이션 효과를 제공합니다.
 */
_AnimationUtil = AnimationUtil;
_defineProperty(AnimationUtil, "easings", {
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * (2 * Math.PI / 3)),
  easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
  easeInBounce: t => 1 - _AnimationUtil.easings.easeOutBounce(1 - t),
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
});
/**
 * JS 이징 이름 → CSS 이징 문자열 맵
 * Web Animations API에 전달할 CSS 포맷 cubic-bezier 값
 */
_defineProperty(AnimationUtil, "cssEasings", {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOutBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInElastic: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
  easeOutElastic: 'cubic-bezier(0.215, 0.61, 0.355, 1.2)'
});
class Animator {
  /**
   * Animator 생성자
   * @constructor
   * @param {string|HTMLElement} element - 애니메이션을 적용할 대상 요소 (CSS 선택자 또는 DOM 요소)
   *
   * @example
   * const animator = new Animator('#myElement');
   *
   * @example
   * const animator = new Animator(document.getElementById('myElement'));
   */
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
  }

  /**
   * 커스텀 애니메이션
   * @param {Object} from - 시작 스타일
   * @param {Object} to - 종료 스타일
   * @param {number} duration - 지속 시간 (ms)
   * @param {string|Function} easing - 이징 함수
   * @returns {Promise}
   */
  custom(from, to) {
    let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
    let easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'easeInOut';
    return new Promise(resolve => {
      if (!this.element) {
        resolve();
        return;
      }
      const easingFn = typeof easing === 'function' ? easing : AnimationUtil.easings[easing] || AnimationUtil.easings.linear;

      // 시작 스타일 적용 (다음 프레임에서)
      requestAnimationFrame(() => {
        Object.keys(from).forEach(key => {
          this.element.style[key] = from[key];
        });

        // 리플로우 강제 (브라우저가 from 스타일을 확실히 적용하도록)
        void this.element.offsetHeight;

        // 애니메이션 시작
        const startTime = performance.now();
        const animate = currentTime => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easingFn(progress);

          // 스타일 보간
          Object.keys(to).forEach(key => {
            const fromValue = this._parseValue(from[key]);
            const toValue = this._parseValue(to[key]);
            if (fromValue.unit && toValue.unit) {
              const currentValue = fromValue.value + (toValue.value - fromValue.value) * easedProgress;
              this.element.style[key] = `${currentValue}${toValue.unit}`;
            } else {
              this.element.style[key] = to[key];
            }
          });
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(animate);
      });
    });
  }

  /**
   * JS 이징 이름을 CSS 이징 문자열로 변환 (Web Animations API용)
   * @private
   */
  _cssEasing(easing) {
    if (typeof easing === 'string' && easing.includes('(')) return easing;
    return AnimationUtil.cssEasings[easing] || easing || 'ease';
  }

  /**
   * 값 파싱 (숫자 + 단위)
   * @private
   */
  _parseValue(value) {
    if (typeof value !== 'string') return {
      value,
      unit: ''
    };
    const match = value.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2] || ''
      };
    }
    return {
      value: 0,
      unit: ''
    };
  }

  /**
   * Fade In
   */
  fadeIn() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ease-out';
    if (!this.element) return Promise.resolve();
    this.element.style.display = 'block';
    const keyframes = [{
      opacity: '0'
    }, {
      opacity: '1'
    }];
    const animation = this.element.animate(keyframes, {
      duration,
      easing,
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      this.element.style.opacity = '1';
    });
  }

  /**
   * Fade Out
   */
  fadeOut() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeIn';
    if (!this.element) return Promise.resolve();
    const animation = this.element.animate([{
      opacity: '1'
    }, {
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Slide Down
   */
  slideDown() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeOutCubic';
    if (!this.element) return Promise.resolve();
    const el = this.element;
    el.style.display = 'block';
    const height = el.scrollHeight;
    el.style.overflow = 'hidden';
    const animation = el.animate([{
      height: '0px'
    }, {
      height: `${height}px`
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      el.style.height = '';
      el.style.overflow = '';
    });
  }

  /**
   * Slide Up
   */
  slideUp() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeInCubic';
    if (!this.element) return Promise.resolve();
    const el = this.element;
    const height = el.scrollHeight;
    el.style.overflow = 'hidden';
    const animation = el.animate([{
      height: `${height}px`
    }, {
      height: '0px'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      el.style.display = 'none';
      el.style.height = '';
      el.style.overflow = '';
    });
  }

  /**
   * Slide Left
   */
  slideLeft() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeInOut';
    if (!this.element) return Promise.resolve();
    const width = this.element.offsetWidth;
    const animation = this.element.animate([{
      transform: 'translateX(0)',
      opacity: '1'
    }, {
      transform: `translateX(-${width}px)`,
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Slide Right
   */
  slideRight() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeInOut';
    if (!this.element) return Promise.resolve();
    const width = this.element.offsetWidth;
    const animation = this.element.animate([{
      transform: 'translateX(0)',
      opacity: '1'
    }, {
      transform: `translateX(${width}px)`,
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Scale In
   */
  scaleIn() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ease-out';
    if (!this.element) return Promise.resolve();
    this.element.style.display = 'block';
    const keyframes = [{
      transform: 'scale(0)',
      opacity: '0'
    }, {
      transform: 'scale(1)',
      opacity: '1'
    }];
    const animation = this.element.animate(keyframes, {
      duration,
      easing,
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      this.element.style.transform = 'scale(1)';
      this.element.style.opacity = '1';
    });
  }

  /**
   * Scale Out
   */
  scaleOut() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeInCubic';
    if (!this.element) return Promise.resolve();
    const animation = this.element.animate([{
      transform: 'scale(1)',
      opacity: '1'
    }, {
      transform: 'scale(0)',
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Bounce In
   */
  bounceIn() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 600;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    if (!this.element) return Promise.resolve();
    this.element.style.display = 'block';
    const keyframes = [{
      transform: 'translateY(-100px)',
      opacity: '0'
    }, {
      transform: 'translateY(0)',
      opacity: '1'
    }];
    const animation = this.element.animate(keyframes, {
      duration,
      easing,
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      this.element.style.transform = 'translateY(0)';
      this.element.style.opacity = '1';
    });
  }

  /**
   * Bounce Out
   */
  bounceOut() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 600;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeInBounce';
    if (!this.element) return Promise.resolve();
    const animation = this.element.animate([{
      transform: 'translateY(0)',
      opacity: '1'
    }, {
      transform: 'translateY(-100px)',
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Rotate In
   */
  rotateIn() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeOut';
    if (!this.element) return Promise.resolve();
    this.element.style.display = 'block';
    const animation = this.element.animate([{
      transform: 'rotate(-180deg) scale(0)',
      opacity: '0'
    }, {
      transform: 'rotate(0deg) scale(1)',
      opacity: '1'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.transform = 'rotate(0deg) scale(1)';
        this.element.style.opacity = '1';
      }
    });
  }

  /**
   * Rotate Out
   */
  rotateOut() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeIn';
    if (!this.element) return Promise.resolve();
    const animation = this.element.animate([{
      transform: 'rotate(0deg) scale(1)',
      opacity: '1'
    }, {
      transform: 'rotate(180deg) scale(0)',
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Flip In
   */
  flipIn() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 600;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeOut';
    if (!this.element) return Promise.resolve();
    this.element.style.display = 'block';
    const animation = this.element.animate([{
      transform: 'perspective(400px) rotateY(90deg)',
      opacity: '0'
    }, {
      transform: 'perspective(400px) rotateY(0deg)',
      opacity: '1'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.transform = 'perspective(400px) rotateY(0deg)';
        this.element.style.opacity = '1';
      }
    });
  }

  /**
   * Flip Out
   */
  flipOut() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 600;
    let easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'easeIn';
    if (!this.element) return Promise.resolve();
    const animation = this.element.animate([{
      transform: 'perspective(400px) rotateY(0deg)',
      opacity: '1'
    }, {
      transform: 'perspective(400px) rotateY(90deg)',
      opacity: '0'
    }], {
      duration,
      easing: this._cssEasing(easing),
      fill: 'forwards'
    });
    return animation.finished.then(() => {
      if (this.element) {
        this.element.style.display = 'none';
        this.element.style.transform = '';
        this.element.style.opacity = '';
      }
    });
  }

  /**
   * Shake
   */
  shake() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'translateX(0)'
    }, {
      transform: 'translateX(-10px)'
    }, {
      transform: 'translateX(10px)'
    }, {
      transform: 'translateX(-10px)'
    }, {
      transform: 'translateX(10px)'
    }, {
      transform: 'translateX(-10px)'
    }, {
      transform: 'translateX(0)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Pulse
   */
  pulse() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'scale(1)'
    }, {
      transform: 'scale(1.05)'
    }, {
      transform: 'scale(1)'
    }, {
      transform: 'scale(1.05)'
    }, {
      transform: 'scale(1)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Flash
   */
  flash() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      opacity: '1'
    }, {
      opacity: '0'
    }, {
      opacity: '1'
    }, {
      opacity: '0'
    }, {
      opacity: '1'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Swing
   */
  swing() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'rotate(0deg)'
    }, {
      transform: 'rotate(15deg)'
    }, {
      transform: 'rotate(-10deg)'
    }, {
      transform: 'rotate(5deg)'
    }, {
      transform: 'rotate(-5deg)'
    }, {
      transform: 'rotate(0deg)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Wobble
   */
  wobble() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'translateX(0%) rotate(0deg)'
    }, {
      transform: 'translateX(-25%) rotate(-5deg)'
    }, {
      transform: 'translateX(20%) rotate(3deg)'
    }, {
      transform: 'translateX(-15%) rotate(-3deg)'
    }, {
      transform: 'translateX(10%) rotate(2deg)'
    }, {
      transform: 'translateX(-5%) rotate(-1deg)'
    }, {
      transform: 'translateX(0%) rotate(0deg)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Tada
   */
  tada() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'scale(1) rotate(0deg)'
    }, {
      transform: 'scale(0.9) rotate(-3deg)'
    }, {
      transform: 'scale(0.9) rotate(-3deg)'
    }, {
      transform: 'scale(1.1) rotate(3deg)'
    }, {
      transform: 'scale(1.1) rotate(-3deg)'
    }, {
      transform: 'scale(1.1) rotate(3deg)'
    }, {
      transform: 'scale(1.1) rotate(-3deg)'
    }, {
      transform: 'scale(1.1) rotate(3deg)'
    }, {
      transform: 'scale(1.1) rotate(-3deg)'
    }, {
      transform: 'scale(1) rotate(0deg)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }

  /**
   * Heart Beat
   */
  heartBeat() {
    let duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    if (!this.element) return Promise.resolve();
    const keyframes = [{
      transform: 'scale(1)'
    }, {
      transform: 'scale(1.3)'
    }, {
      transform: 'scale(1)'
    }, {
      transform: 'scale(1.3)'
    }, {
      transform: 'scale(1)'
    }];
    return this.element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    }).finished;
  }
}

/**
 * IMCAT 단축 API
 * @module core/shortcuts
 * @description 자주 사용하는 패턴의 단축 함수를 제공합니다.
 */


/**
 * 단축 API 모음
 * @class
 */
const Shortcuts = {
  /**
   * 모달 단축 생성
   * @param {Object} options - 모달 옵션
   * @returns {Promise<Modal>}
   *
   * @example
   * const modal = await IMCAT.modal({ title: '알림', content: '완료!' });
   * modal.show();
   */
  async modal(options) {
    const Overlays = await this.use('overlays');
    const modal = new Overlays.Modal(options);
    this.view.registerInstance(modal);
    return modal;
  },
  /**
   * 드로어 단축 생성
   * @param {Object} options - 드로어 옵션
   * @returns {Promise<Drawer>}
   */
  async drawer(options) {
    const Overlays = await this.use('overlays');
    const drawer = new Overlays.Drawer(options);
    this.view.registerInstance(drawer);
    return drawer;
  },
  /**
   * 확인 다이얼로그
   * @param {string|Object} options - 메시지 또는 옵션 객체
   * @returns {Promise<boolean>}
   *
   * @example
   * if (await IMCAT.confirm('삭제하시겠습니까?')) {
   *   // 삭제 로직
   * }
   */
  async confirm(options) {
    const Overlays = await this.use('overlays');
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    return new Promise(resolve => {
      const modal = new Overlays.Modal({
        title: options.title || '확인',
        content: `<p style="margin: 0; font-size: 15px; color: var(--text-primary);">${Security.escape(options.message)}</p>`,
        size: 'sm',
        buttons: [{
          text: options.cancelText || '취소',
          variant: 'secondary',
          action: () => {
            modal.hide();
            modal.destroy();
            resolve(false);
          }
        }, {
          text: options.confirmText || '확인',
          variant: options.danger ? 'danger' : 'primary',
          action: () => {
            modal.hide();
            modal.destroy();
            resolve(true);
          }
        }]
      });
      modal.show();
    });
  },
  /**
   * 알림 다이얼로그
   * @param {string} message - 메시지
   * @param {Object} [options] - 추가 옵션
   * @returns {Promise<void>}
   *
   * @example
   * await IMCAT.alert('저장되었습니다');
   */
  async alert(message) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Overlays = await this.use('overlays');
    return new Promise(resolve => {
      const modal = new Overlays.Modal({
        title: options.title || '알림',
        content: `<p style="margin: 0; font-size: 15px; color: var(--text-primary);">${Security.escape(message)}</p>`,
        size: 'sm',
        buttons: [{
          text: options.buttonText || '확인',
          variant: 'primary',
          action: () => {
            modal.hide();
            modal.destroy();
            resolve();
          }
        }]
      });
      modal.show();
    });
  },
  /**
   * 입력 다이얼로그
   * @param {string} message - 메시지
   * @param {Object} [options] - 추가 옵션
   * @returns {Promise<string|null>}
   *
   * @example
   * const name = await IMCAT.prompt('이름을 입력하세요');
   * if (name) console.log('입력:', name);
   */
  async prompt(message) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Overlays = await this.use('overlays');
    return new Promise(resolve => {
      const inputId = Utils.randomId('prompt-input');
      const modal = new Overlays.Modal({
        title: options.title || '입력',
        content: `
          <p style="margin: 0 0 12px 0; font-size: 15px; color: var(--text-primary);">${Security.escape(message)}</p>
          <input type="${options.type || 'text'}" 
                 id="${inputId}"
                 class="form-input" 
                 value="${Security.escape(options.defaultValue || '')}"
                 placeholder="${Security.escape(options.placeholder || '')}"
                 style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 14px;">
        `,
        size: 'sm',
        buttons: [{
          text: options.cancelText || '취소',
          variant: 'secondary',
          action: () => {
            modal.hide();
            modal.destroy();
            resolve(null);
          }
        }, {
          text: options.confirmText || '확인',
          variant: 'primary',
          action: () => {
            const input = document.getElementById(inputId);
            const value = (input === null || input === void 0 ? void 0 : input.value) || '';
            modal.hide();
            modal.destroy();
            resolve(value);
          }
        }]
      });
      modal.show();

      // 자동 포커스
      setTimeout(() => {
        const input = document.getElementById(inputId);
        if (input) {
          input.focus();
          input.select();
        }
      }, 100);
    });
  },
  /**
   * 토스트 단축 API
   */
  toast: {
    _imcat: null,
    async _getModule() {
      if (!this._imcat) {
        throw new Error('Toast: IMCAT 인스턴스가 설정되지 않았습니다.');
      }
      return await this._imcat.use('feedback');
    },
    async show(message) {
      let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
      const Feedback = await this._getModule();
      return Feedback.Toast.show(message, type, duration);
    },
    async success(message, duration) {
      return this.show(message, 'success', duration);
    },
    async error(message, duration) {
      return this.show(message, 'error', duration);
    },
    async warning(message, duration) {
      return this.show(message, 'warning', duration);
    },
    async info(message, duration) {
      return this.show(message, 'info', duration);
    },
    async clear() {
      const Feedback = await this._getModule();
      Feedback.Toast.clear();
    }
  },
  /**
   * 알림(Notification) 단축 API
   */
  notify: {
    _imcat: null,
    async _getModule() {
      if (!this._imcat) {
        throw new Error('Notify: IMCAT 인스턴스가 설정되지 않았습니다.');
      }
      return await this._imcat.use('feedback');
    },
    async show(options) {
      const Feedback = await this._getModule();
      return Feedback.Notification.show(options);
    },
    async success(message) {
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return this.show({
        message,
        title,
        type: 'success'
      });
    },
    async error(message) {
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return this.show({
        message,
        title,
        type: 'error'
      });
    },
    async warning(message) {
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return this.show({
        message,
        title,
        type: 'warning'
      });
    },
    async info(message) {
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return this.show({
        message,
        title,
        type: 'info'
      });
    }
  },
  /**
   * 드롭다운 단축 생성
   * @param {string|HTMLElement} trigger - 트리거 요소
   * @param {Object} options - 드롭다운 옵션
   * @returns {Promise<Dropdown>}
   */
  async dropdown(trigger, options) {
    const Dropdown = await this.use('dropdown');
    const dropdown = new Dropdown(trigger, options);
    this.view.registerInstance(dropdown);
    return dropdown;
  },
  /**
   * 툴팁 단축 생성
   * @param {string|HTMLElement} element - 대상 요소
   * @param {string|Object} options - 내용 또는 옵션
   * @returns {Promise<Tooltip>}
   */
  async tooltip(element, options) {
    const Tooltips = await this.use('tooltips');
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    const tooltip = new Tooltips.Tooltip(element, options);
    this.view.registerInstance(tooltip);
    return tooltip;
  },
  /**
   * 팝오버 단축 생성
   * @param {string|HTMLElement} element - 대상 요소
   * @param {string|Object} options - 내용 또는 옵션
   * @returns {Promise<Popover>}
   */
  async popover(element, options) {
    const Tooltips = await this.use('tooltips');
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    const popover = new Tooltips.Popover(element, options);
    this.view.registerInstance(popover);
    return popover;
  },
  /**
   * 탭 단축 생성
   * @param {string|HTMLElement} element - 탭 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<Tabs>}
   */
  async tabs(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Navigation = await this.use('navigation');
    const tabs = new Navigation.Tabs(element, options);
    this.view.registerInstance(tabs);
    return tabs;
  },
  /**
   * 아코디언 단축 생성
   * @param {string|HTMLElement} element - 아코디언 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<Accordion>}
   */
  async accordion(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Navigation = await this.use('navigation');
    const accordion = new Navigation.Accordion(element, options);
    this.view.registerInstance(accordion);
    return accordion;
  },
  /**
   * 캐러셀 단축 생성
   * @param {string|HTMLElement} element - 캐러셀 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<Carousel>}
   */
  async carousel(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const CarouselModule = await this.use('carousel');
    const carousel = new CarouselModule.Carousel(element, options);
    this.view.registerInstance(carousel);
    return carousel;
  },
  /**
   * 라이트박스 (이미지 갤러리)
   * @param {string[]|Object[]} images - 이미지 배열
   * @param {Object} [options] - 옵션
   * @returns {Promise<Lightbox>}
   *
   * @example
   * await IMCAT.lightbox(['img1.jpg', 'img2.jpg']);
   * await IMCAT.lightbox([{ src: 'img.jpg', title: '제목' }]);
   */
  async lightbox(images) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Overlays = await this.use('overlays');
    const lightbox = new Overlays.Lightbox({
      images,
      ...options
    });
    this.view.registerInstance(lightbox);
    lightbox.show();
    return lightbox;
  },
  /**
   * 날짜 선택기 단축 생성
   * @param {string|HTMLElement} element - 입력 요소
   * @param {Object} [options] - 옵션
   * @returns {Promise<DatePicker>}
   */
  async datePicker(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Pickers = await this.use('pickers');
    const picker = new Pickers.DatePicker(element, options);
    this.view.registerInstance(picker);
    return picker;
  },
  /**
   * 시간 선택기 단축 생성
   * @param {string|HTMLElement} element - 입력 요소
   * @param {Object} [options] - 옵션
   * @returns {Promise<TimePicker>}
   */
  async timePicker(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Pickers = await this.use('pickers');
    const picker = new Pickers.TimePicker(element, options);
    this.view.registerInstance(picker);
    return picker;
  },
  /**
   * 색상 선택기 단축 생성
   * @param {string|HTMLElement} element - 입력 요소
   * @param {Object} [options] - 옵션
   * @returns {Promise<ColorPicker>}
   */
  async colorPicker(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Pickers = await this.use('pickers');
    const picker = new Pickers.ColorPicker(element, options);
    this.view.registerInstance(picker);
    return picker;
  },
  /**
   * 카운트다운 단축 생성
   * @param {string|HTMLElement} element - 표시 요소
   * @param {Date|string|number} targetDate - 목표 날짜
   * @param {Object} [options] - 옵션
   * @returns {Promise<Countdown>}
   */
  async countdown(element, targetDate) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const Pickers = await this.use('pickers');
    const countdown = new Pickers.Countdown(element, {
      targetDate,
      ...options
    });
    this.view.registerInstance(countdown);
    return countdown;
  },
  /**
   * 자동완성 단축 생성
   * @param {string|HTMLElement} element - 입력 요소
   * @param {Object} options - 옵션 (source 필수)
   * @returns {Promise<Autocomplete>}
   */
  async autocomplete(element, options) {
    const Selectors = await this.use('selectors');
    const autocomplete = new Selectors.Autocomplete(element, options);
    this.view.registerInstance(autocomplete);
    return autocomplete;
  },
  /**
   * 다중 선택 단축 생성
   * @param {string|HTMLElement} element - select 요소
   * @param {Object} [options] - 옵션
   * @returns {Promise<MultiSelect>}
   */
  async multiSelect(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Selectors = await this.use('selectors');
    const multiSelect = new Selectors.MultiSelect(element, options);
    this.view.registerInstance(multiSelect);
    return multiSelect;
  },
  /**
   * 범위 슬라이더 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<RangeSlider>}
   */
  async rangeSlider(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Selectors = await this.use('selectors');
    const slider = new Selectors.RangeSlider(element, options);
    this.view.registerInstance(slider);
    return slider;
  },
  /**
   * 별점 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<Rating>}
   */
  async rating(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Forms = await this.use('forms');
    const rating = new Forms.Rating(element, options);
    this.view.registerInstance(rating);
    return rating;
  },
  /**
   * 파일 업로드 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<FileUpload>}
   */
  async fileUpload(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Forms = await this.use('forms');
    const upload = new Forms.FileUpload(element, options);
    this.view.registerInstance(upload);
    return upload;
  },
  /**
   * 데이터 테이블 단축 생성
   * @param {string|HTMLElement} element - 테이블 컨테이너
   * @param {Object} options - 옵션 (columns, data)
   * @returns {Promise<DataTable>}
   */
  async dataTable(element, options) {
    const DataViz = await this.use('data-viz');
    const table = new DataViz.DataTable(element, options);
    this.view.registerInstance(table);
    return table;
  },
  /**
   * 차트 단축 생성
   * @param {string|HTMLElement} element - 캔버스/SVG 컨테이너
   * @param {Object} options - 차트 옵션
   * @returns {Promise<Chart>}
   */
  async chart(element, options) {
    const DataViz = await this.use('data-viz');
    const chart = new DataViz.Chart(element, options);
    this.view.registerInstance(chart);
    return chart;
  },
  /**
   * 칸반 보드 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} options - 옵션
   * @returns {Promise<Kanban>}
   */
  async kanban(element, options) {
    const DataViz = await this.use('data-viz');
    const kanban = new DataViz.Kanban(element, options);
    this.view.registerInstance(kanban);
    return kanban;
  },
  /**
   * 스테퍼 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} [options] - 옵션
   * @returns {Promise<Stepper>}
   */
  async stepper(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const StepperModule = await this.use('stepper');
    const stepper = new StepperModule.Stepper(element, options);
    this.view.registerInstance(stepper);
    return stepper;
  },
  /**
   * QR 코드 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {string} data - QR 코드 데이터
   * @param {Object} [options] - 옵션 (size, color 등)
   * @returns {Promise<QRCode>}
   */
  async qrCode(element, data) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const AdvancedUI = await this.use('advanced-ui');
    const qr = new AdvancedUI.QRCode(element, {
      data,
      ...options
    });
    this.view.registerInstance(qr);
    return qr;
  },
  /**
   * 진행률 트래커 단축 생성
   * @param {Object} options - 옵션 (steps, current 등)
   * @returns {Promise<ProgressTracker>}
   */
  async progress(options) {
    const Feedback = await this.use('feedback');
    const tracker = new Feedback.ProgressTracker(options);
    this.view.registerInstance(tracker);
    return tracker;
  },
  /**
   * 스켈레톤 로딩 표시
   * @param {string|HTMLElement} element - 대상 요소
   * @param {Object} [options] - 옵션
   * @returns {Promise<Skeleton>}
   */
  async skeleton(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const Feedback = await this.use('feedback');
    const skeleton = new Feedback.Skeleton(element, options);
    return skeleton;
  },
  /**
   * 무한 스크롤 단축 생성
   * @param {string|HTMLElement} element - 스크롤 컨테이너
   * @param {Object} options - 옵션 (loadMore 콜백)
   * @returns {Promise<InfiniteScroll>}
   */
  async infiniteScroll(element, options) {
    const Scroll = await this.use('scroll');
    const scroll = new Scroll.InfiniteScroll(element, options);
    this.view.registerInstance(scroll);
    return scroll;
  },
  /**
   * 페이지네이션 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} options - 옵션
   * @returns {Promise<Pagination>}
   */
  async pagination(element, options) {
    const PaginationModule = await this.use('pagination');
    const pagination = new PaginationModule.Pagination(element, options);
    this.view.registerInstance(pagination);
    return pagination;
  },
  /**
   * 간트 차트 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} options - 옵션
   * @returns {Promise<Gantt>}
   */
  async gantt(element, options) {
    const Gantt = await this.use('gantt');
    const gantt = new Gantt(element, options);
    this.view.registerInstance(gantt);
    return gantt;
  },
  /**
   * 이미지 목록 (갤러리) 단축 생성
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} options - 옵션
   * @returns {Promise<ImageList>}
   */
  async imageList(element, options) {
    const ImageModule = await this.use('imagelist');
    const imageList = new ImageModule.ImageList(element, options);
    this.view.registerInstance(imageList);
    return imageList;
  },
  /**
   * 이미지 비교 슬라이더
   * @param {string|HTMLElement} element - 컨테이너
   * @param {Object} options - 옵션 (before, after 이미지)
   * @returns {Promise<ImageCompare>}
   */
  async imageCompare(element, options) {
    const ImageModule = await this.use('imagelist');
    const compare = new ImageModule.ImageCompare(element, options);
    this.view.registerInstance(compare);
    return compare;
  },
  // ===== Theme API =====
  /**
   * 테마 관리 객체
   * @description 테마 전환 효과를 포함한 테마 관리 API
   *
   * @example
   * // 기본 토글
   * IMCAT.theme.toggle();
   *
   * // 클릭 위치 기반 원형 전환 (View Transitions API)
   * btn.addEventListener('click', (e) => IMCAT.theme.toggleWithEvent(e));
   *
   * // 전환 효과 초기화
   * IMCAT.theme.init({ transition: 'circle', transitionDuration: 800 });
   */
  theme: {
    _imcat: null,
    _instance: null,
    /**
     * 사용 가능한 전환 효과 타입
     * @type {Object}
     * @property {string} NONE - 즉시 전환 (애니메이션 없음)
     * @property {string} FADE - 페이드 효과
     * @property {string} SLIDE - 슬라이드 효과
     * @property {string} CIRCLE - 클릭 위치 기반 원형 확산
     * @property {string} CIRCLE_TOP_LEFT - 좌상단에서 원형 확산
     * @property {string} CIRCLE_TOP_RIGHT - 우상단에서 원형 확산
     * @property {string} CIRCLE_BOTTOM_LEFT - 좌하단에서 원형 확산
     * @property {string} CIRCLE_BOTTOM_RIGHT - 우하단에서 원형 확산
     * @property {string} CIRCLE_CENTER - 화면 중앙에서 원형 확산
     */
    TRANSITIONS: {
      NONE: 'none',
      FADE: 'fade',
      SLIDE: 'slide',
      CIRCLE: 'circle',
      CIRCLE_TOP_LEFT: 'circle-top-left',
      CIRCLE_TOP_RIGHT: 'circle-top-right',
      CIRCLE_BOTTOM_LEFT: 'circle-bottom-left',
      CIRCLE_BOTTOM_RIGHT: 'circle-bottom-right',
      CIRCLE_CENTER: 'circle-center'
    },
    async _getModule() {
      if (!this._imcat) {
        throw new Error('Theme: IMCAT 인스턴스가 설정되지 않았습니다.');
      }
      return await this._imcat.use('theme');
    },
    async _getInstance() {
      if (!this._instance) {
        const ThemeModule = await this._getModule();
        this._instance = ThemeModule.initTheme({
          transition: 'circle',
          transitionDuration: 500
        });
      }
      return this._instance;
    },
    /**
     * 테마 초기화 (전환 효과 설정)
     * @param {Object} options - 옵션
     * @returns {Promise<Theme>}
     *
     * @example
     * IMCAT.theme.init({ transition: 'circle', transitionDuration: 800 });
     */
    async init() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const ThemeModule = await this._getModule();
      this._instance = ThemeModule.initTheme({
        transition: 'circle',
        transitionDuration: 500,
        ...options
      });
      return this._instance;
    },
    /**
     * 테마 토글 (light ↔ dark)
     * @param {boolean} [animate=true] - 애니메이션 적용 여부
     *
     * @example
     * IMCAT.theme.toggle();
     */
    async toggle() {
      let animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      const instance = await this._getInstance();
      instance.toggle(animate);
    },
    /**
     * 클릭 이벤트 기반 테마 전환 (원형 효과)
     * @param {MouseEvent} event - 클릭 이벤트
     * @param {string} [theme] - 테마 ('light', 'dark'). 생략 시 토글
     *
     * @example
     * button.addEventListener('click', (e) => IMCAT.theme.toggleWithEvent(e));
     */
    async toggleWithEvent(event, theme) {
      const instance = await this._getInstance();
      instance.toggleWithEvent(event, theme);
    },
    /**
     * 테마 설정
     * @param {string} theme - 테마 ('light', 'dark', 'system')
     * @param {boolean} [animate=true] - 애니메이션 적용 여부
     *
     * @example
     * IMCAT.theme.set('dark');
     */
    async set(theme) {
      let animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const instance = await this._getInstance();
      instance.setTheme(theme, animate);
    },
    /**
     * 현재 테마 가져오기
     * @returns {Promise<string>} 'light' | 'dark'
     */
    async get() {
      const instance = await this._getInstance();
      return instance.getResolved();
    },
    /**
     * 다크 모드 여부
     * @returns {Promise<boolean>}
     */
    async isDark() {
      const theme = await this.get();
      return theme === 'dark';
    },
    /**
     * 라이트 모드 여부
     * @returns {Promise<boolean>}
     */
    async isLight() {
      const theme = await this.get();
      return theme === 'light';
    }
  }
};

/**
 * IMCAT 헬퍼 함수
 * @module core/helpers
 * @description 자주 사용하는 유틸리티 함수를 제공합니다.
 */


/**
 * 헬퍼 함수 모음
 * @class
 */
const Helpers = {
  /**
   * 폼 데이터 수집
   * @param {string|HTMLFormElement} selector - 폼 선택자 또는 요소
   * @returns {Object} 폼 데이터 객체
   *
   * @example
   * const data = IMCAT.formData('#userForm');
   * // { name: '홍길동', email: 'hong@example.com' }
   */
  formData(selector) {
    const form = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!form || !(form instanceof HTMLFormElement)) {
      console.warn('Helpers.formData: 유효한 폼 요소가 아닙니다.');
      return {};
    }
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      // 같은 키가 여러 개면 배열로 처리
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });
    return data;
  },
  /**
   * 폼에 데이터 채우기
   * @param {string|HTMLFormElement} selector - 폼 선택자 또는 요소
   * @param {Object} data - 채울 데이터
   *
   * @example
   * IMCAT.fillForm('#userForm', { name: '홍길동', email: 'hong@example.com' });
   */
  fillForm(selector, data) {
    const form = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!form || !(form instanceof HTMLFormElement)) {
      console.warn('Helpers.fillForm: 유효한 폼 요소가 아닙니다.');
      return;
    }
    Object.entries(data).forEach(_ref => {
      let [key, value] = _ref;
      const input = form.elements[key];
      if (!input) return;
      if (input.type === 'checkbox') {
        input.checked = Boolean(value);
      } else if (input.type === 'radio') {
        // CSS.escape()로 선택자 인젝션 방어
        const escapedKey = CSS.escape(key);
        const escapedValue = CSS.escape(String(value));
        const radio = form.querySelector(`[name="${escapedKey}"][value="${escapedValue}"]`);
        if (radio) radio.checked = true;
      } else if (input.tagName === 'SELECT' && input.multiple && Array.isArray(value)) {
        // 다중 선택
        Array.from(input.options).forEach(option => {
          option.selected = value.includes(option.value);
        });
      } else {
        input.value = value;
      }
    });
  },
  /**
   * 폼 초기화
   * @param {string|HTMLFormElement} selector - 폼 선택자 또는 요소
   */
  resetForm(selector) {
    const form = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (form && form instanceof HTMLFormElement) {
      form.reset();
    }
  },
  /**
   * 클립보드 복사
   * @param {string} text - 복사할 텍스트
   * @returns {Promise<boolean>} 성공 여부
   *
   * @example
   * if (await IMCAT.copy('복사할 텍스트')) {
   *   IMCAT.toast.success('복사되었습니다');
   * }
   */
  async copy(text) {
    try {
      // Clipboard API 사용 (보안 컨텍스트 필요)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // 폴백: execCommand 사용
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        return true;
      } finally {
        textarea.remove();
      }
    } catch (error) {
      console.error('Helpers.copy: 복사 실패', error);
      return false;
    }
  },
  /**
   * 파일 다운로드
   * @param {Blob|string} content - Blob 또는 데이터 URL
   * @param {string} filename - 파일명
   *
   * @example
   * IMCAT.download(blob, 'report.pdf');
   */
  download(content, filename) {
    const url = content instanceof Blob ? URL.createObjectURL(content) : content;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (content instanceof Blob) {
      URL.revokeObjectURL(url);
    }
  },
  /**
   * JSON 다운로드
   * @param {*} data - JSON 데이터
   * @param {string} filename - 파일명
   *
   * @example
   * IMCAT.downloadJSON({ users: [...] }, 'users.json');
   */
  downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {
      type: 'application/json;charset=utf-8'
    });
    this.download(blob, filename);
  },
  /**
   * CSV 다운로드
   * @param {Object[]} rows - 행 데이터 배열
   * @param {string} filename - 파일명
   * @param {Object} [options] - 옵션
   *
   * @example
   * IMCAT.downloadCSV([
   *   { name: '홍길동', age: 30 },
   *   { name: '김철수', age: 25 }
   * ], 'users.csv');
   */
  downloadCSV(rows, filename) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!rows || rows.length === 0) {
      console.warn('Helpers.downloadCSV: 데이터가 비어있습니다.');
      return;
    }
    const delimiter = options.delimiter || ',';
    const headers = options.headers || Object.keys(rows[0]);

    // 값 이스케이프 (쉼표, 따옴표, 줄바꿈 처리)
    const escapeValue = val => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csv = [headers.map(escapeValue).join(delimiter), ...rows.map(row => headers.map(h => escapeValue(row[h])).join(delimiter))].join('\n');

    // BOM 추가 (Excel 한글 호환)
    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8'
    });
    this.download(blob, filename);
  },
  /**
   * 테이블 데이터 추출
   * @param {string|HTMLTableElement} selector - 테이블 선택자 또는 요소
   * @returns {Object[]} 행 데이터 배열
   *
   * @example
   * const data = IMCAT.tableData('#userTable');
   */
  tableData(selector) {
    const table = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!table || !(table instanceof HTMLTableElement)) {
      console.warn('Helpers.tableData: 유효한 테이블 요소가 아닙니다.');
      return [];
    }

    // 헤더 추출
    const headers = [];
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (headerRow) {
      headerRow.querySelectorAll('th, td').forEach(cell => {
        headers.push(cell.textContent.trim());
      });
    }

    // 데이터 추출
    const rows = [];
    const tbody = table.querySelector('tbody') || table;
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      // 첫 번째 행이 헤더면 스킵
      if (index === 0 && !table.querySelector('thead')) return;
      const row = {};
      tr.querySelectorAll('td').forEach((td, i) => {
        const key = headers[i] || `col${i}`;
        row[key] = td.textContent.trim();
      });
      if (Object.keys(row).length > 0) {
        rows.push(row);
      }
    });
    return rows;
  },
  /**
   * URL 쿼리 파라미터 파싱 (URLUtil에 위임)
   * @param {string} [url] - URL (기본: 현재 URL)
   * @returns {Object} 파라미터 객체
   */
  parseQuery(url) {
    return URLUtil.parseQuery(url ? new URL(url, window.location.origin).search : undefined);
  },
  /**
   * 쿼리 스트링 생성 (URLUtil에 위임)
   * @param {Object} params - 파라미터 객체
   * @returns {string} 쿼리 스트링
   */
  buildQuery(params) {
    return URLUtil.buildQuery(params, false);
  },
  /**
   * 스크롤 위치로 이동
   * @param {string|HTMLElement|number} target - 대상 (선택자, 요소, 또는 y좌표)
   * @param {Object} [options] - 옵션
   */
  scrollTo(target) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // smooth 옵션과 behavior 옵션 모두 지원
    const behavior = options.behavior || (options.smooth !== false ? 'smooth' : 'auto');
    const offset = options.offset || 0;
    let y = 0;
    if (typeof target === 'number') {
      y = target;
    } else {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        y = element.getBoundingClientRect().top + window.scrollY + offset;
      }
    }
    window.scrollTo({
      top: y,
      behavior
    });
  },
  /**
   * 페이지 최상단으로 스크롤
   * @param {boolean} [smooth=true] - 부드러운 스크롤 여부
   */
  scrollTop() {
    let smooth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.scrollTo(0, {
      smooth
    });
  },
  /**
   * 요소가 뷰포트에 보이는지 확인
   * @param {string|HTMLElement} selector - 선택자 또는 요소
   * @param {number} [threshold=0] - 임계값 (0~1)
   * @returns {boolean}
   */
  isInViewport(selector) {
    let threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight * (1 - threshold) && rect.top + rect.height >= windowHeight * threshold;
    const horInView = rect.left <= windowWidth * (1 - threshold) && rect.left + rect.width >= windowWidth * threshold;
    return vertInView && horInView;
  },
  /**
   * 로컬 스토리지 안전 접근 (Storage 클래스에 위임)
   * @param {string} key - 키
   * @param {*} [defaultValue] - 기본값
   * @returns {*}
   */
  getStorage(key) {
    let defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return Storage.get(key, defaultValue);
  },
  /**
   * 로컬 스토리지 안전 저장 (Storage 클래스에 위임)
   * @param {string} key - 키
   * @param {*} value - 값
   * @returns {boolean} 성공 여부
   */
  setStorage(key, value) {
    return Storage.set(key, value);
  }
};

/**
 * IMCAT 포맷터
 * @module core/formatters
 * @description 자주 사용하는 형식 변환 함수를 제공합니다.
 */


/**
 * 포맷터 함수 모음
 * @class
 */
const Formatters = {
  /**
   * 숫자 포맷 (천 단위 구분)
   * @param {number} value - 숫자
   * @param {string} [locale='ko-KR'] - 로케일
   * @returns {string}
   *
   * @example
   * IMCAT.format.number(1234567); // '1,234,567'
   */
  number(value, locale) {
    if (value === null || value === undefined || isNaN(value)) return '';
    return new Intl.NumberFormat(locale || Config.getLocale()).format(value);
  },
  /**
   * 통화 포맷
   * @param {number} value - 금액
   * @param {string} [currency='KRW'] - 통화 코드
   * @param {string} [locale='ko-KR'] - 로케일
   * @returns {string}
   *
   * @example
   * IMCAT.format.currency(50000); // '₩50,000'
   * IMCAT.format.currency(100, 'USD', 'en-US'); // '$100.00'
   */
  currency(value, currency, locale) {
    if (value === null || value === undefined || isNaN(value)) return '';
    const resolvedCurrency = currency || Config.getCurrency();
    const resolvedLocale = locale || Config.getLocale();
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: resolvedCurrency,
      maximumFractionDigits: resolvedCurrency === 'KRW' ? 0 : 2
    }).format(value);
  },
  /**
   * 퍼센트 포맷
   * @param {number} value - 값 (0~1 또는 0~100)
   * @param {number} [decimals=0] - 소수점 자리수
   * @param {boolean} [isRatio=false] - true면 0~1, false면 0~100
   * @returns {string}
   *
   * @example
   * IMCAT.format.percent(0.75, 1, true); // '75.0%'
   * IMCAT.format.percent(75); // '75%'
   */
  percent(value) {
    let decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let isRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (value === null || value === undefined || isNaN(value)) return '';
    const percent = isRatio ? value * 100 : value;
    return `${percent.toFixed(decimals)}%`;
  },
  /**
   * 날짜 포맷
   * @param {Date|string|number} value - 날짜
   * @param {Object|string} [options] - Intl 옵션 또는 포맷 문자열
   * @returns {string}
   *
   * @example
   * IMCAT.format.date(new Date()); // '2025. 12. 3.'
   * IMCAT.format.date(new Date(), 'short'); // '25. 12. 3.'
   */
  date(value) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    // 프리셋 옵션
    const presets = {
      short: {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
      },
      medium: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      iso: null // ISO 포맷은 별도 처리
    };
    if (options === 'iso') {
      return date.toISOString().split('T')[0];
    }
    const finalOptions = typeof options === 'string' ? presets[options] || {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    } : {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };
    return new Intl.DateTimeFormat(Config.getLocale(), finalOptions).format(date);
  },
  /**
   * 시간 포맷
   * @param {Date|string|number} value - 날짜/시간
   * @param {Object} [options] - Intl 옵션
   * @returns {string}
   *
   * @example
   * IMCAT.format.time(new Date()); // '오후 3:30'
   */
  time(value) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const finalOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Intl.DateTimeFormat(Config.getLocale(), finalOptions).format(date);
  },
  /**
   * 날짜+시간 포맷
   * @param {Date|string|number} value - 날짜/시간
   * @returns {string}
   *
   * @example
   * IMCAT.format.datetime(new Date()); // '2025. 12. 3. 오후 3:30'
   */
  datetime(value) {
    if (!value) return '';
    return `${this.date(value)} ${this.time(value)}`;
  },
  /**
   * 상대 시간 포맷
   * @param {Date|string|number} value - 날짜/시간
   * @returns {string}
   *
   * @example
   * IMCAT.format.relative(new Date(Date.now() - 60000)); // '1분 전'
   * IMCAT.format.relative(new Date(Date.now() + 86400000)); // '내일'
   */
  relative(value) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const rtf = new Intl.RelativeTimeFormat(Config.getLocale(), {
      numeric: 'auto'
    });
    const diff = (date.getTime() - Date.now()) / 1000; // 초 단위

    // 적절한 단위 선택
    const units = [{
      unit: 'year',
      seconds: 31536000
    }, {
      unit: 'month',
      seconds: 2592000
    }, {
      unit: 'week',
      seconds: 604800
    }, {
      unit: 'day',
      seconds: 86400
    }, {
      unit: 'hour',
      seconds: 3600
    }, {
      unit: 'minute',
      seconds: 60
    }, {
      unit: 'second',
      seconds: 1
    }];
    for (const {
      unit,
      seconds
    } of units) {
      if (Math.abs(diff) >= seconds || unit === 'second') {
        return rtf.format(Math.round(diff / seconds), unit);
      }
    }
    return '';
  },
  /**
   * 바이트 크기 포맷
   * @param {number} bytes - 바이트 수
   * @param {number} [decimals=2] - 소수점 자리수
   * @returns {string}
   *
   * @example
   * IMCAT.format.bytes(1024); // '1 KB'
   * IMCAT.format.bytes(1536, 1); // '1.5 KB'
   */
  bytes(bytes) {
    let decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    if (bytes === 0) return '0 Bytes';
    if (!bytes || isNaN(bytes)) return '';
    const absBytes = Math.abs(bytes);
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.min(Math.floor(Math.log(absBytes) / Math.log(k)), sizes.length - 1);
    return parseFloat((absBytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  },
  /**
   * 문자열 자르기 (말줄임표)
   * @param {string} str - 문자열
   * @param {number} maxLength - 최대 길이
   * @param {string} [suffix='...'] - 접미사
   * @returns {string}
   *
   * @example
   * IMCAT.format.truncate('Hello World', 8); // 'Hello...'
   */
  truncate(str, maxLength) {
    let suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';
    return Utils.truncate(str, maxLength, suffix);
  },
  /**
   * 전화번호 포맷
   * @param {string} value - 전화번호
   * @returns {string}
   *
   * @example
   * IMCAT.format.phone('01012345678'); // '010-1234-5678'
   * IMCAT.format.phone('0212345678'); // '02-1234-5678'
   */
  phone(value) {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');

    // 휴대폰 (010, 011, 016, 017, 018, 019)
    if (/^01[016789]/.test(cleaned) && cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }

    // 서울 (02)
    if (cleaned.startsWith('02')) {
      if (cleaned.length === 9) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    }

    // 일반 지역번호 (3자리)
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return value;
  },
  /**
   * 사업자등록번호 포맷
   * @param {string} value - 사업자등록번호
   * @returns {string}
   *
   * @example
   * IMCAT.format.bizNo('1234567890'); // '123-45-67890'
   */
  bizNo(value) {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 10) return value;
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  },
  /**
   * 주민등록번호 마스킹
   * @param {string} value - 주민등록번호
   * @returns {string}
   *
   * @example
   * IMCAT.format.ssn('9001011234567'); // '900101-1******'
   */
  ssn(value) {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length !== 13) return value;
    return cleaned.substring(0, 6) + '-' + cleaned.charAt(6) + '******';
  },
  /**
   * 카드번호 마스킹
   * @param {string} value - 카드번호
   * @returns {string}
   *
   * @example
   * IMCAT.format.cardNo('1234567890123456'); // '1234-****-****-3456'
   */
  cardNo(value) {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length < 13) return value;
    return cleaned.substring(0, 4) + '-****-****-' + cleaned.substring(cleaned.length - 4);
  },
  /**
   * 우편번호 포맷
   * @param {string} value - 우편번호
   * @returns {string}
   *
   * @example
   * IMCAT.format.zipCode('12345'); // '12345'
   * IMCAT.format.zipCode('123456'); // '123-456' (구 우편번호)
   */
  zipCode(value) {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');

    // 신 우편번호 (5자리)
    if (cleaned.length === 5) {
      return cleaned;
    }

    // 구 우편번호 (6자리)
    if (cleaned.length === 6) {
      return cleaned.replace(/(\d{3})(\d{3})/, '$1-$2');
    }
    return value;
  },
  /**
   * 첫 글자 대문자
   * @param {string} str - 문자열
   * @returns {string}
   *
   * @example
   * IMCAT.format.capitalize('hello'); // 'Hello'
   */
  capitalize(str) {
    return Utils.capitalize(str);
  },
  /**
   * 제목 케이스 (각 단어 첫 글자 대문자)
   * @param {string} str - 문자열
   * @returns {string}
   *
   * @example
   * IMCAT.format.titleCase('hello world'); // 'Hello World'
   */
  titleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  },
  /**
   * 슬러그 생성
   * @param {string} str - 문자열
   * @returns {string}
   *
   * @example
   * IMCAT.format.slug('Hello World!'); // 'hello-world'
   */
  slug(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().trim().replace(/[^\w\s가-힣-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  },
  /**
   * 이메일 마스킹
   * @param {string} email - 이메일
   * @returns {string}
   *
   * @example
   * IMCAT.format.maskEmail('user@example.com'); // 'us**@example.com'
   */
  maskEmail(email) {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    const visibleChars = Math.min(2, local.length);
    const maskedLocal = local.substring(0, visibleChars) + '*'.repeat(Math.max(0, local.length - visibleChars));
    return `${maskedLocal}@${domain}`;
  },
  /**
   * 이름 마스킹
   * @param {string} name - 이름
   * @returns {string}
   *
   * @example
   * IMCAT.format.maskName('홍길동'); // '홍*동'
   * IMCAT.format.maskName('John Doe'); // 'J*** D**'
   */
  maskName(name) {
    if (!name) return '';

    // 한글 이름 (2~4자)
    if (/^[가-힣]{2,4}$/.test(name)) {
      if (name.length === 2) {
        return name.charAt(0) + '*';
      }
      return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    }

    // 영문 이름
    return name.split(' ').map(part => {
      if (part.length <= 1) return part;
      return part.charAt(0) + '*'.repeat(part.length - 1);
    }).join(' ');
  }
};

/**
 * 자동 초기화 관리자
 * @class
 *
 * @example
 * <!-- HTML에서 사용 -->
 * <button data-imcat="dropdown" data-items='[{"text":"메뉴1"},{"text":"메뉴2"}]'>
 *   드롭다운
 * </button>
 *
 * <button data-imcat="modal" data-title="알림" data-content="내용입니다">
 *   모달 열기
 * </button>
 *
 * <span data-imcat="tooltip" data-content="툴팁 내용">
 *   마우스를 올려보세요
 * </span>
 */
class AutoInit {
  /**
   * 기본 컴포넌트 등록
   * @private
   */
  static _registerDefaults() {
    // 드롭다운
    AutoInit.register('dropdown', async (el, options, imcat) => {
      const Dropdown = await imcat.use('dropdown');
      const dropdown = new Dropdown(el, options);
      imcat.view.registerInstance(dropdown);
      return dropdown;
    });

    // 모달 (클릭 트리거)
    AutoInit.register('modal', async (el, options, imcat) => {
      const Overlays = await imcat.use('overlays');
      const modal = new Overlays.Modal(options);
      imcat.view.registerInstance(modal);
      el.addEventListener('click', e => {
        e.preventDefault();
        modal.show();
      });
      return modal;
    });

    // 드로어 (클릭 트리거)
    AutoInit.register('drawer', async (el, options, imcat) => {
      const Overlays = await imcat.use('overlays');
      const drawer = new Overlays.Drawer(options);
      imcat.view.registerInstance(drawer);
      el.addEventListener('click', e => {
        e.preventDefault();
        drawer.show();
      });
      return drawer;
    });

    // 오프캔버스 (클릭 트리거)
    AutoInit.register('offcanvas', async (el, options, imcat) => {
      const Overlays = await imcat.use('overlays');
      const offcanvas = new Overlays.Offcanvas(options);
      imcat.view.registerInstance(offcanvas);
      el.addEventListener('click', e => {
        e.preventDefault();
        offcanvas.show();
      });
      return offcanvas;
    });

    // 툴팁
    AutoInit.register('tooltip', async (el, options, imcat) => {
      const Tooltips = await imcat.use('tooltips');
      const tooltip = new Tooltips.Tooltip(el, options);
      imcat.view.registerInstance(tooltip);
      return tooltip;
    });

    // 팝오버
    AutoInit.register('popover', async (el, options, imcat) => {
      const Tooltips = await imcat.use('tooltips');
      const popover = new Tooltips.Popover(el, options);
      imcat.view.registerInstance(popover);
      return popover;
    });

    // 탭
    AutoInit.register('tabs', async (el, options, imcat) => {
      const Navigation = await imcat.use('navigation');
      const tabs = new Navigation.Tabs(el, options);
      imcat.view.registerInstance(tabs);
      return tabs;
    });

    // 아코디언
    AutoInit.register('accordion', async (el, options, imcat) => {
      const Navigation = await imcat.use('navigation');
      const accordion = new Navigation.Accordion(el, options);
      imcat.view.registerInstance(accordion);
      return accordion;
    });

    // 캐러셀
    AutoInit.register('carousel', async (el, options, imcat) => {
      const CarouselModule = await imcat.use('carousel');
      const carousel = new CarouselModule.Carousel(el, options);
      imcat.view.registerInstance(carousel);
      return carousel;
    });

    // 확인 다이얼로그 (클릭 트리거)
    AutoInit.register('confirm', async (el, options, imcat) => {
      el.addEventListener('click', async e => {
        e.preventDefault();
        const result = await imcat.confirm({
          title: options.title || '확인',
          message: options.message || options.content || '확인하시겠습니까?',
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          danger: options.danger
        });
        if (result) {
          // 확인 시 CustomEvent dispatch (보안: new Function 대신 이벤트 리스너 패턴 사용)
          // JS에서 el.addEventListener('imcat:confirmed', handler)로 처리하세요.
          el.dispatchEvent(new CustomEvent('imcat:confirmed', {
            bubbles: true,
            detail: {
              action: options.onConfirm || null
            }
          }));

          // href가 있으면 이동 (XSS 방어: javascript: 등 위험 프로토콜 차단)
          if (options.href && Security.isSafeUrl(options.href)) {
            window.location.href = options.href;
          }

          // form이 있으면 제출
          if (options.form) {
            const form = document.querySelector(options.form);
            if (form) form.submit();
          }
        }
      });
      return null;
    });

    // 복사 버튼
    AutoInit.register('copy', async (el, options, imcat) => {
      el.addEventListener('click', async e => {
        e.preventDefault();
        let text = options.text || options.content;

        // 선택자로 텍스트 가져오기
        if (options.target) {
          const target = document.querySelector(options.target);
          if (target) {
            text = target.value || target.textContent;
          }
        }
        if (text) {
          const success = await imcat.copy(text);
          if (success && options.toast !== false) {
            await imcat.toast.success(options.message || '복사되었습니다');
          }
        }
      });
      return null;
    });

    // 스크롤 탑 버튼
    AutoInit.register('scroll-top', async (el, options, imcat) => {
      const clickHandler = e => {
        e.preventDefault();
        imcat.scrollTop(options.smooth !== false);
      };
      el.addEventListener('click', clickHandler);
      let scrollHandler = null;

      // 스크롤 위치에 따라 버튼 표시/숨김
      if (options.autoHide !== false) {
        const threshold = parseInt(options.threshold) || 300;
        const toggleVisibility = () => {
          if (window.scrollY > threshold) {
            el.classList.remove('is-hidden');
            el.classList.add('is-visible');
          } else {
            el.classList.remove('is-visible');
            el.classList.add('is-hidden');
          }
        };
        scrollHandler = imcat.throttle(toggleVisibility, 100);
        window.addEventListener('scroll', scrollHandler);
        toggleVisibility();
      }

      // 정리용 객체 반환
      return {
        destroy() {
          el.removeEventListener('click', clickHandler);
          if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
          }
        }
      };
    });

    // 스크롤 투 버튼
    AutoInit.register('scroll-to', async (el, options, imcat) => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const target = options.target || el.getAttribute('href');
        if (target) {
          imcat.scrollTo(target, {
            offset: parseInt(options.offset) || 0,
            behavior: options.smooth !== false ? 'smooth' : 'auto'
          });
        }
      });
      return null;
    });

    // 토글 클래스
    AutoInit.register('toggle', async (el, options, _imcat) => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const target = options.target ? document.querySelector(options.target) : el;
        const className = options.class || 'is-active';
        if (target) {
          target.classList.toggle(className);
        }
      });
      return null;
    });
  }

  /**
   * 컴포넌트 초기화 함수 등록
   * @param {string} name - 컴포넌트 이름 (data-imcat 값)
   * @param {Function} initializer - 초기화 함수 (el, options, imcat) => instance
   *
   * @example
   * AutoInit.register('myComponent', async (el, options, imcat) => {
   *   const MyModule = await imcat.use('my-module');
   *   return new MyModule(el, options);
   * });
   */
  static register(name, initializer) {
    AutoInit._components[name] = initializer;
  }

  /**
   * 컴포넌트 등록 해제
   * @param {string} name - 컴포넌트 이름
   */
  static unregister(name) {
    delete AutoInit._components[name];
  }

  /**
   * 자동 초기화 시작
   * @param {Object} imcat - IMCAT 인스턴스
   *
   * @example
   * AutoInit.init(IMCAT);
   */
  static init(imcat) {
    if (AutoInit._initialized) return;
    AutoInit._imcat = imcat;
    AutoInit._registerDefaults();

    // DOM이 준비되면 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => AutoInit._initAll());
    } else {
      AutoInit._initAll();
    }

    // DOM 변경 감지 (동적으로 추가되는 요소)
    AutoInit._setupObserver();
    AutoInit._initialized = true;
  }

  /**
   * 모든 data-imcat 요소 초기화
   * @private
   */
  static _initAll() {
    const elements = document.querySelectorAll('[data-imcat]');
    elements.forEach(el => AutoInit._initElement(el));
  }

  /**
   * 특정 요소 초기화
   * @param {HTMLElement} el - 요소
   * @private
   */
  static async _initElement(el) {
    // 이미 초기화되었으면 스킵
    if (AutoInit._instances.has(el)) return;
    const componentName = el.dataset.imcat;
    const initializer = AutoInit._components[componentName];
    if (!initializer) {
      if (AutoInit._imcat && AutoInit._imcat.config && AutoInit._imcat.config.get('debug')) {
        console.warn(`AutoInit: Unknown component "${componentName}"`);
      }
      return;
    }
    try {
      const options = AutoInit._parseOptions(el);
      const instance = await initializer(el, options, AutoInit._imcat);
      AutoInit._instances.set(el, instance);

      // destroy 메서드가 있는 인스턴스는 정리용 Set에 추가
      if (instance && typeof instance.destroy === 'function') {
        AutoInit._destroyables.add(instance);
      }
    } catch (error) {
      console.error(`AutoInit: Failed to initialize "${componentName}"`, error);
    }
  }

  /**
   * 요소의 data-* 속성을 옵션 객체로 파싱
   * @param {HTMLElement} el - 요소
   * @returns {Object} 옵션 객체
   * @private
   */
  static _parseOptions(el) {
    const options = {};

    // 모든 data-* 속성 순회
    for (const key in el.dataset) {
      if (key === 'imcat') continue; // 컴포넌트 이름은 제외

      let value = el.dataset[key];

      // JSON 파싱 시도
      try {
        // 배열이나 객체인 경우
        if (value.startsWith('[') || value.startsWith('{')) {
          value = JSON.parse(value);
        }
        // 불리언
        else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
        // 숫자
        else if (!isNaN(value) && value.trim() !== '') {
          value = Number(value);
        }
      } catch {
        // JSON 파싱 실패 시 문자열 그대로 사용
      }

      // camelCase로 변환 (data-my-option -> myOption)
      options[key] = value;
    }
    return options;
  }

  /**
   * MutationObserver 설정 (동적 요소 감지)
   * @private
   */
  static _setupObserver() {
    if (AutoInit._observer) return;
    AutoInit._observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 추가된 요소가 data-imcat을 가지면 초기화
            if (node.hasAttribute && node.hasAttribute('data-imcat')) {
              AutoInit._initElement(node);
            }

            // 자식 요소 중 data-imcat을 가진 요소 초기화
            if (node.querySelectorAll) {
              node.querySelectorAll('[data-imcat]').forEach(el => {
                AutoInit._initElement(el);
              });
            }
          }
        });
      });
    });
    AutoInit._observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 특정 요소 또는 범위 내 요소 수동 초기화
   * @param {HTMLElement|string} [scope] - 범위 (없으면 전체)
   *
   * @example
   * // 전체 재검색 및 초기화
   * AutoInit.refresh();
   *
   * // 특정 범위 내에서만 초기화
   * AutoInit.refresh('#my-container');
   */
  static refresh(scope) {
    let container = document;
    if (scope) {
      container = typeof scope === 'string' ? document.querySelector(scope) : scope;
    }
    if (!container) return;
    const elements = container.querySelectorAll ? container.querySelectorAll('[data-imcat]') : [container];
    elements.forEach(el => {
      // 기존 인스턴스가 없는 요소만 초기화
      if (!AutoInit._instances.has(el)) {
        AutoInit._initElement(el);
      }
    });
  }

  /**
   * 특정 요소의 인스턴스 가져오기
   * @param {HTMLElement} el - 요소
   * @returns {*} 인스턴스
   */
  static getInstance(el) {
    return AutoInit._instances.get(el);
  }

  /**
   * 자동 초기화 정리
   */
  static destroy() {
    // MutationObserver 정리
    if (AutoInit._observer) {
      AutoInit._observer.disconnect();
      AutoInit._observer = null;
    }

    // 모든 인스턴스의 destroy() 호출
    AutoInit._destroyables.forEach(instance => {
      try {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      } catch (error) {
        console.error('AutoInit: Error destroying instance', error);
      }
    });

    // 정리
    AutoInit._destroyables.clear();
    AutoInit._instances = new WeakMap();
    AutoInit._initialized = false;
    AutoInit._imcat = null;
  }
}
/**
 * 등록된 컴포넌트 초기화 함수
 * @private
 */
_defineProperty(AutoInit, "_components", {});
/**
 * 초기화된 인스턴스 맵 (WeakMap으로 메모리 관리)
 * @private
 */
_defineProperty(AutoInit, "_instances", new WeakMap());
/**
 * destroy가 필요한 인스턴스들 (순회 가능하도록 Set 사용)
 * @private
 */
_defineProperty(AutoInit, "_destroyables", new Set());
/**
 * IMCAT 인스턴스 참조
 * @private
 */
_defineProperty(AutoInit, "_imcat", null);
/**
 * MutationObserver 인스턴스
 * @private
 */
_defineProperty(AutoInit, "_observer", null);
/**
 * 초기화 여부
 * @private
 */
_defineProperty(AutoInit, "_initialized", false);

/**
 * IMCAT UI Framework - Core Entry Point
 * @module imcat-ui
 * @version 1.2.0
 */


/**
 * IMCAT Core Class
 * @class
 * @description IMCAT UI 프레임워크의 핵심 클래스입니다.
 * 모든 코어 모듈을 통합하고 전역 IMCAT 객체를 생성합니다.
 *
 * @example
 * const element = IMCAT('#app');
 * element.addClass('active').text('Hello');
 */
class IMCATCore {
  /**
   * IMCATCore 생성자
   * @constructor
   */
  constructor() {
    // 싱글톤 인스턴스들
    this.eventBus = new EventBus();
    this.loader = new ModuleLoader();
    this.router = new ViewRouter();
    this.loadingIndicator = LoadingIndicator$1;

    // 이벤트 리스너 추적 (메모리 관리용)
    this._clickHandler = null;
    this._domReadyHandler = null;

    // Router에 Loading 통합 (URL 변경 없이 내부 렌더링만)
    // serverRender 옵션은 config에서 자동 감지
    const serverRender = Config.get('serverRender', false);
    this.router.init({
      loading: this.loadingIndicator,
      useHistory: false,
      serverRender
    });

    // catui-href 자동 바인딩 (DOM ready 후)
    this._bindSPALinks();

    // 서버 렌더링 모드: hash 기반 자동 렌더링 초기화
    this._initServerRenderHash();

    // 단축 API에 IMCAT 인스턴스 바인딩
    this._initShortcuts();

    // 자동 초기화 시작 (DOM ready 후)
    this._initAutoInit();
  }

  /**
   * 단축 API 초기화
   * @private
   */
  _initShortcuts() {
    var _this = this;
    // toast, notify, theme에 IMCAT 인스턴스 주입
    Shortcuts.toast._imcat = this;
    Shortcuts.notify._imcat = this;
    Shortcuts.theme._imcat = this;

    // Shortcuts 함수형 메서드를 인스턴스에 자동 바인딩
    // (toast, notify, theme는 getter이므로 제외)
    const skipKeys = ['toast', 'notify', 'theme'];
    for (const key of Object.keys(Shortcuts)) {
      if (skipKeys.includes(key)) continue;
      if (typeof Shortcuts[key] === 'function' && !this[key]) {
        this[key] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return Shortcuts[key].call(_this, ...args);
        };
      }
    }

    // 하위 호환성: IMCAT.isString() 등 기존 직접 호출 지원
    // (네임스페이스 IMCAT.utils.isString()도 사용 가능)
    const utilMethods = ['isString', 'isNumber', 'isArray', 'isObject', 'isFunction', 'extend', 'clone', 'debounce', 'throttle', 'randomId'];
    for (const key of utilMethods) {
      if (typeof Utils[key] === 'function') {
        this[key] = Utils[key].bind(Utils);
      }
    }

    // 하위 호환성: IMCAT.sanitize(), IMCAT.validatePath()
    this.sanitize = Security.sanitize.bind(Security);
    this.validatePath = Security.validatePath.bind(Security);

    // 하위 호환성: IMCAT.formData() 등 Helpers 직접 호출
    const helperMethods = ['formData', 'fillForm', 'resetForm', 'copy', 'download', 'downloadJSON', 'downloadCSV', 'tableData', 'scrollTo', 'scrollTop', 'isInViewport', 'parseQuery', 'buildQuery', 'getStorage', 'setStorage'];
    for (const key of helperMethods) {
      if (typeof Helpers[key] === 'function') {
        this[key] = Helpers[key].bind(Helpers);
      }
    }
  }

  /**
   * 자동 초기화 시작
   * @private
   */
  _initAutoInit() {
    // DOM ready 후 AutoInit 시작
    if (document.readyState === 'loading') {
      this._autoInitReadyHandler = () => {
        AutoInit.init(this);
      };
      document.addEventListener('DOMContentLoaded', this._autoInitReadyHandler);
    } else {
      AutoInit.init(this);
    }
  }

  /**
   * catui-href 자동 바인딩
   * SPA 링크를 자동으로 처리하여 설정 코드 불필요
   * @private
   */
  _bindSPALinks() {
    // DOM ready 핸들러
    const bindLinks = () => {
      // 기본 컨테이너 자동 감지
      this._detectRouterContainer();

      // 클릭 핸들러 생성 (나중에 제거할 수 있도록 저장)
      this._clickHandler = e => {
        // catui-href를 가진 요소 찾기
        const link = e.target.closest('[catui-href]');
        if (link) {
          // 서버 렌더링 모드 (Config에서 동적 참조 — init 후 변경도 반영)
          const isServerRender = Config.get('serverRender', false) || this.router.serverRender;
          if (isServerRender) {
            const path = link.getAttribute('catui-href');
            const target = link.getAttribute('catui-target');

            // URL 보안 검증
            if (!Security.isSafeUrl(path)) {
              e.preventDefault();
              console.warn('IMCAT: Unsafe URL blocked:', path);
              return;
            }

            // catui-target이 있으면 서버 HTML을 fetch하여 타겟에 렌더링
            if (target) {
              e.preventDefault();
              this._serverRenderFetch(path, target);
              return;
            }

            // catui-target 없으면 전체 페이지 이동
            e.preventDefault();
            window.location.href = path;
            return;
          }

          // 이벤트 기본 동작 방지 (SPA 모드)
          e.preventDefault();
          e.stopPropagation();
          const path = link.getAttribute('catui-href');
          const target = link.getAttribute('catui-target');
          if (path) {
            // 링크별 타겟이 있으면 임시로 변경
            const originalContainer = this.router.container;
            if (target) {
              this.router.setContainer(`#${target}`);
            }

            // 네비게이션 실행
            this.router.navigate(path).then(() => {
              // 원래 컨테이너로 복원 (타겟이 지정된 경우만)
              if (target) {
                this.router.setContainer(originalContainer);
              }
            });
          }
        }
      };

      // capture 단계에서 이벤트 캡처 (더 일찍 처리)
      document.addEventListener('click', this._clickHandler, true);
    };

    // DOM이 이미 로드되었으면 즉시 실행, 아니면 대기
    if (document.readyState === 'loading') {
      this._domReadyHandler = bindLinks;
      document.addEventListener('DOMContentLoaded', this._domReadyHandler);
    } else {
      bindLinks();
    }
  }

  /**
   * 서버 렌더링 모드 fetch + 타겟 렌더링
   * @param {string} path - 서버 경로
   * @param {string} targetId - 렌더링 대상 요소 ID
   * @private
   */
  _serverRenderFetch(path, targetId) {
    const container = document.getElementById(targetId);
    if (!container) {
      console.error(`IMCAT: Target "#${targetId}" not found`);
      return;
    }

    // 로딩 표시
    if (this.loadingIndicator) {
      this.loadingIndicator.show();
    }
    fetch(path).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    }).then(html => {
      container.innerHTML = html;
      // 스크립트 실행
      if (this.router._executeScripts) {
        this.router._executeScripts(container);
      }
      // hash 방식으로 URL 업데이트 (새로고침 시 Catphp 기본 페이지 유지)
      window.location.hash = `#${path}`;
      // 마지막 타겟 저장 (hash 복원 시 사용)
      this._lastServerTarget = targetId;
    }).catch(err => {
      console.error('IMCAT: Failed to load:', err);
    }).finally(() => {
      if (this.loadingIndicator) {
        this.loadingIndicator.hide();
      }
    });
  }

  /**
   * 서버 렌더링 모드: 페이지 로드 시 hash 경로 자동 렌더링
   * @private
   */
  _initServerRenderHash() {
    const restore = () => {
      const isServerRender = Config.get('serverRender', false) || this.router.serverRender;
      if (!isServerRender) return;
      const hash = window.location.hash;
      // #/path 형식인지 확인
      if (!hash || !hash.startsWith('#/')) return;
      const path = hash.slice(1); // '#/login' → '/login'

      // 기본 타겟 감지: catui-target 속성을 가진 첫 번째 링크의 타겟 사용
      let targetId = this._lastServerTarget;
      if (!targetId) {
        const targetLink = document.querySelector('[catui-href][catui-target]');
        if (targetLink) {
          targetId = targetLink.getAttribute('catui-target');
        }
      }
      if (targetId && Security.isSafeUrl(path)) {
        this._serverRenderFetch(path, targetId);
      }
    };

    // DOM ready 후 hash 복원
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', restore);
    } else {
      // Config가 설정될 시간을 확보하기 위해 다음 틱에서 실행
      setTimeout(restore, 0);
    }

    // hash 변경 감지 (뒤로가기/앞으로가기)
    this._hashChangeHandler = () => {
      var _document$querySelect;
      const isServerRender = Config.get('serverRender', false) || this.router.serverRender;
      if (!isServerRender) return;
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#/')) return;
      const path = hash.slice(1);
      const targetId = this._lastServerTarget || ((_document$querySelect = document.querySelector('[catui-href][catui-target]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute('catui-target'));
      if (targetId && Security.isSafeUrl(path)) {
        this._serverRenderFetch(path, targetId);
      }
    };
    window.addEventListener('hashchange', this._hashChangeHandler);
  }

  /**
   * Router 컨테이너 자동 감지
   * catui-target 속성 또는 기본 선택자 사용
   * @private
   */
  _detectRouterContainer() {
    // 1. catui-target 속성을 가진 요소 찾기
    const targetElement = document.querySelector('[catui-target]');
    if (targetElement) {
      const targetId = targetElement.getAttribute('catui-target');
      if (targetId) {
        this.router.setContainer(`#${targetId}`);
        return;
      }
    }

    // 2. 일반적인 선택자들 시도 (우선순위 순)
    const defaultSelectors = ['#app-content', '#content', '#app', 'main'];
    for (const selector of defaultSelectors) {
      if (document.querySelector(selector)) {
        this.router.setContainer(selector);
        return;
      }
    }

    // 3. 기본값
    this.router.setContainer('#content');
  }

  /**
   * DOM 요소 선택
   * @param {string|HTMLElement} selector - 선택자
   * @returns {DOMElement}
   */
  $(selector) {
    return DOM.select(selector);
  }

  /**
   * 새 요소 생성
   * @param {string} tagName - 태그 이름
   * @param {Object} attributes - 속성
   * @returns {DOMElement}
   */
  create(tagName, attributes) {
    return DOM.create(tagName, attributes);
  }

  /**
   * 모듈 로드
   * @param {...string} moduleNames - 모듈 이름들
   * @returns {Promise<*>}
   */
  use() {
    return this.loader.use(...arguments);
  }

  // ===== View Router API =====
  /**
   * View Router 인스턴스
   * @returns {ViewRouter}
   */
  get view() {
    return this.router;
  }

  // ===== API Utility =====
  /**
   * API 유틸리티
   * @returns {APIUtil}
   */
  get api() {
    return APIUtil;
  }

  // ===== Event Bus API =====
  /**
   * 이벤트 구독
   */
  on(event, handler) {
    return this.eventBus.on(event, handler);
  }

  /**
   * 일회성 이벤트 구독
   */
  once(event, handler) {
    return this.eventBus.once(event, handler);
  }

  /**
   * 이벤트 구독 취소
   */
  off(event, handler) {
    return this.eventBus.off(event, handler);
  }

  /**
   * 이벤트 발행
   */
  emit(event) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return this.eventBus.emit(event, ...args);
  }

  // ===== Loading Indicator API =====
  /**
   * Loading Indicator 인스턴스
   * @returns {LoadingIndicator}
   */
  get loading() {
    return this.loadingIndicator;
  }

  // ===== Template API =====
  /**
   * Template 엔진
   * @returns {Template}
   */
  get template() {
    return Template;
  }

  // ===== Storage API =====
  /**
   * Storage 유틸리티
   * @returns {Storage}
   */
  get storage() {
    return Storage;
  }

  // ===== URL API =====
  /**
   * URL 유틸리티
   * @returns {URLUtil}
   */
  get url() {
    return URLUtil;
  }

  // ===== State API =====
  /**
   * 상태 관리
   * @returns {StateManager}
   */
  get state() {
    return StateManager;
  }

  /**
   * 전역 상태
   * @returns {GlobalState}
   */
  get globalState() {
    return GlobalState;
  }

  // ===== Form API =====
  /**
   * 폼 검증
   * @returns {FormValidator}
   */
  get form() {
    return FormValidator;
  }

  // ===== Animation API =====
  /**
   * 애니메이션
   * @returns {AnimationUtil}
   */
  get animate() {
    return AnimationUtil.animate.bind(AnimationUtil);
  }

  /**
   * 애니메이션 유틸리티
   * @returns {AnimationUtil}
   */
  get animation() {
    return AnimationUtil;
  }

  // ===== Security API (네임스페이스) =====
  /** Security 유틸리티 @returns {Security} */
  get security() {
    return Security;
  }

  /** HTML 이스케이프 (단축) */
  escape(str) {
    return Security.escape(str);
  }

  // ===== Utils API (네임스페이스) =====
  /**
   * Utils 유틸리티 (IMCAT.utils.isString(), IMCAT.utils.debounce() 등)
   * @returns {Utils}
   */
  get utils() {
    return Utils;
  }

  /** DOM 준비 완료 시 실행 */
  ready(callback) {
    return DOM.ready(callback);
  }

  /** 버전 정보 */
  get version() {
    return '1.2.0';
  }

  // ===== Shortcuts API (자동 바인딩) =====
  /** 토스트 API @returns {Object} */
  get toast() {
    return Shortcuts.toast;
  }
  /** 알림(Notification) API @returns {Object} */
  get notify() {
    return Shortcuts.notify;
  }
  /**
   * 테마 API (전환 효과 포함)
   * @returns {Object}
   * @example
   * IMCAT.theme.toggle();
   * IMCAT.theme.set('dark');
   */
  get theme() {
    return Shortcuts.theme;
  }

  // ===== Helpers API (네임스페이스) =====
  /**
   * Helpers 유틸리티 (IMCAT.helpers.copy(), IMCAT.helpers.scrollTo() 등)
   * @returns {Helpers}
   */
  get helpers() {
    return Helpers;
  }

  // ===== Formatters API =====
  /** 포맷터 유틸리티 @returns {Formatters} */
  get format() {
    return Formatters;
  }

  // ===== Config API =====
  /**
   * 글로벌 설정
   * @param {Object|string} keyOrOptions - 설정 키 또는 옵션 객체
   * @param {*} [value] - 설정 값
   * @returns {Object}
   *
   * @example
   * // 여러 설정 변경
   * IMCAT.config({ animation: false, theme: 'dark' });
   *
   * // 단일 설정 변경
   * IMCAT.config('animation', false);
   *
   * // 설정 조회
   * const animation = IMCAT.config.get('animation');
   */
  config(keyOrOptions, value) {
    if (arguments.length === 0) {
      return Config.get();
    }
    return Config.set(keyOrOptions, value);
  }

  // ===== AutoInit API =====
  /**
   * 자동 초기화 유틸리티
   * @returns {AutoInit}
   */
  get autoInit() {
    return AutoInit;
  }

  /**
   * 프레임워크 정리 (메모리 누수 방지)
   * SPA 재시작 또는 테스트 환경에서 사용
   *
   * @example
   * // 애플리케이션 종료 시
   * IMCAT.destroy();
   */
  destroy() {
    // 전역 클릭 리스너 제거 (capture 단계로 등록했으므로 같은 옵션으로 제거)
    if (this._clickHandler) {
      document.removeEventListener('click', this._clickHandler, true);
      this._clickHandler = null;
    }

    // DOMContentLoaded 리스너 제거 (아직 실행 안된 경우)
    if (this._domReadyHandler) {
      document.removeEventListener('DOMContentLoaded', this._domReadyHandler);
      this._domReadyHandler = null;
    }

    // hashchange 리스너 제거 (서버 렌더링 모드)
    if (this._hashChangeHandler) {
      window.removeEventListener('hashchange', this._hashChangeHandler);
      this._hashChangeHandler = null;
    }

    // AutoInit DOMContentLoaded 리스너 제거
    if (this._autoInitReadyHandler) {
      document.removeEventListener('DOMContentLoaded', this._autoInitReadyHandler);
      this._autoInitReadyHandler = null;
    }

    // 라우터 정리
    if (this.router && typeof this.router.destroy === 'function') {
      this.router.destroy();
    }

    // 이벤트 버스 정리
    if (this.eventBus && typeof this.eventBus.clear === 'function') {
      this.eventBus.clear();
    }

    // 모듈 로더 정리
    if (this.loader && typeof this.loader.destroy === 'function') {
      this.loader.destroy();
    }

    // 로딩 인디케이터 정리
    if (this.loadingIndicator && typeof this.loadingIndicator.destroy === 'function') {
      this.loadingIndicator.destroy();
    }

    // Config 정리
    Config.destroy();

    // AutoInit 정리
    AutoInit.destroy();
  }
}

// 전역 인스턴스 생성
const IMCAT = new IMCATCore();

// 전역 함수로도 사용 가능
function IMCATFunction(selector) {
  return IMCAT.$(selector);
}

// IMCATCore의 프로토타입 메서드와 getter를 복사
const proto = Object.getPrototypeOf(IMCAT);
Object.getOwnPropertyNames(proto).forEach(key => {
  if (key === 'constructor') return;
  const descriptor = Object.getOwnPropertyDescriptor(proto, key);
  if (descriptor.get) {
    // getter인 경우
    Object.defineProperty(IMCATFunction, key, {
      get() {
        return IMCAT[key];
      }
    });
  } else if (typeof descriptor.value === 'function') {
    // 일반 메서드인 경우
    IMCATFunction[key] = IMCAT[key].bind(IMCAT);
  }
});

// 인스턴스 프로퍼티 복사
Object.keys(IMCAT).forEach(key => {
  if (!Object.prototype.hasOwnProperty.call(IMCATFunction, key)) {
    Object.defineProperty(IMCATFunction, key, {
      get() {
        return IMCAT[key];
      }
    });
  }
});

// config 메서드에 정적 메서드들 추가 (IMCAT.config.get(), IMCAT.config.reset() 등)
IMCATFunction.config.get = Config.get.bind(Config);
IMCATFunction.config.set = Config.set.bind(Config);
IMCATFunction.config.reset = Config.reset.bind(Config);
IMCATFunction.config.onChange = Config.onChange.bind(Config);
IMCATFunction.config.extend = Config.extend.bind(Config);
IMCATFunction.config.getFor = Config.getFor.bind(Config);
IMCATFunction.config.clearListeners = Config.clearListeners.bind(Config);
IMCATFunction.config.destroy = Config.destroy.bind(Config);

// 브라우저 전역에 등록
if (typeof window !== 'undefined') {
  window.IMCAT = IMCATFunction;
}

// Named exports는 모듈 개발자용
// IIFE 빌드 시에는 default만 사용됨

export { IMCATFunction as default };
