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

export class Security {
  // DOMParser 싱글톤 캐싱 (sanitize 성능 최적화)
  static _parser = null;
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
    const dangerous = [
      /expression\s*\(/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /@import/gi,
      /behavior:/gi,
      /url\s*\(/gi
    ];

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

export default Security;
