/**
 * 템플릿 엔진
 * @module core/template
 */

import Security from './security.js';

/**
 * 간단하고 빠른 템플릿 엔진
 * @class
 * @description {{key}} 문법을 사용하는 간단한 템플릿 엔진입니다.
 * 자동 XSS 방어(이스케이프)를 제공하며, 조건부/리스트 렌더링을 지원합니다.
 *
 * @example
 * const html = Template.render('Hello {{name}}!', { name: 'John' });
 */
export class Template {
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
  static render(template, data = {}) {
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
      if (!value || (Array.isArray(value) && value.length === 0)) {
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
  static renderRaw(template, data = {}) {
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
  static if(condition, template, data = {}) {
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
    return (data = {}) => this.render(template, data);
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

export default Template;
