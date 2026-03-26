/**
 * 모듈 로더
 * @module core/loader
 */

import { Config } from './config.js';

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
export class ModuleLoader {
  /**
   * ModuleLoader 생성자
   * @constructor
   * @param {Object} options - 로더 옵션
   * @param {string} options.distPath - dist 폴더 경로 (기본: 자동 감지)
   */
  constructor(options = {}) {
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
  async use(...moduleNames) {
    // 단일 모듈
    if (moduleNames.length === 1) {
      return this._loadModule(moduleNames[0]);
    }

    // 여러 모듈
    const modules = await Promise.all(
      moduleNames.map(name => this._loadModule(name))
    );
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
  async preload(...moduleNames) {
    await Promise.all(
      moduleNames.map(name => this._loadModule(name))
    );
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

    const promise = this.loadCSS(cssPath)
      .then(() => {
        this.loadedCSS.add(cssPath);
        // 브라우저 스타일 적용 보장
        return new Promise(resolve => requestAnimationFrame(resolve));
      })
      .catch(() => {
        // CSS가 없으면 무시 (선택적 파일)
      })
      .finally(() => {
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
    return str
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
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

export default ModuleLoader;
