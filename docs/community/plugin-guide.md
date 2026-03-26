# IMCAT UI 플러그인 개발 가이드

IMCAT UI 생태계를 확장하는 서드파티 플러그인(모듈) 개발 방법입니다.

> **이 문서의 핵심**: `IMCAT.use('플러그인명')`으로 로드 가능한 외부 모듈을 만드는 방법.
> 표준 모듈 인터페이스를 따르면 프레임워크와 자연스럽게 통합됩니다.

---

## 플러그인 구조

```text
imcat-plugin-example/
├── src/
│   └── index.js          # 메인 모듈 (export default)
├── styles/
│   └── example.scss      # 선택: 모듈 CSS
├── tests/
│   └── example.test.js   # 테스트
├── dist/
│   ├── example.js        # 빌드된 ESM
│   └── example.css       # 빌드된 CSS
├── package.json
└── README.md
```

---

## 기본 플러그인 템플릿

### `src/index.js`

```javascript
/**
 * IMCAT UI 플러그인 예제
 * @module plugins/example
 */

// ============================================
// ExampleWidget
// ============================================

class ExampleWidget {
  /** @type {Map<HTMLElement, ExampleWidget>} */
  static instances = new Map();

  static defaults() {
    return {
      theme: 'light',
      animation: true,
      onInit: null,
      onDestroy: null
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
      console.error('ExampleWidget: Container not found');
      return;
    }

    this.options = { ...ExampleWidget.defaults(), ...options };
    this.init();
    ExampleWidget.instances.set(this.container, this);
  }

  init() {
    this._render();
    this._bindEvents();

    if (this.options.onInit) {
      this.options.onInit(this);
    }
  }

  _render() {
    // DOM 구성
    this.container.classList.add('example-widget');
    // ...
  }

  _bindEvents() {
    // 이벤트 리스너 등록 (참조 보관)
    this._onClick = this._handleClick.bind(this);
    this.container.addEventListener('click', this._onClick);
  }

  _handleClick(e) {
    // ...
  }

  /** 반드시 구현: 메모리 누수 방지 */
  destroy() {
    if (this._onClick) {
      this.container.removeEventListener('click', this._onClick);
    }

    ExampleWidget.instances.delete(this.container);

    if (this.options.onDestroy) {
      this.options.onDestroy(this);
    }

    this.container = null;
  }
}

// ============================================
// 모듈 Export (필수 형식)
// ============================================

export { ExampleWidget };

export default {
  ExampleWidget
};
```

---

## 필수 규칙

### 1. `destroy()` 메서드 구현

모든 컴포넌트는 `destroy()`를 구현해야 합니다. SPA 뷰 전환 시 자동 정리됩니다.

```javascript
destroy() {
  // 1. 이벤트 리스너 제거
  this.container.removeEventListener('click', this._onClick);
  window.removeEventListener('resize', this._onResize);

  // 2. Observer 해제
  if (this._observer) this._observer.disconnect();

  // 3. Timer/Interval 해제
  if (this._timer) clearInterval(this._timer);

  // 4. AbortController 중단
  if (this._abortController) this._abortController.abort();

  // 5. static instances에서 제거
  ExampleWidget.instances.delete(this.container);

  // 6. DOM 참조 해제
  this.container = null;
}
```

### 2. `static instances` Map

인스턴스를 추적하여 중복 생성 방지 및 외부 접근을 지원합니다.

```javascript
class MyWidget {
  static instances = new Map();

  constructor(selector, options) {
    // ...
    MyWidget.instances.set(this.container, this);
  }

  // 외부에서 인스턴스 접근
  static getInstance(selector) {
    const el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    return MyWidget.instances.get(el);
  }
}
```

### 3. `static defaults()` 메서드

기본 옵션을 정적 메서드로 제공하여 `Config.getFor()` 연동을 지원합니다.

### 4. 보안 준수

```javascript
// ✅ 사용자 입력은 반드시 이스케이프
import { Security } from '@imcat-ckim/catui/core/security';
element.textContent = userInput;                    // 안전
element.innerHTML = Security.sanitize(htmlContent); // sanitize 필수

// ❌ 금지
element.innerHTML = userInput;      // XSS 위험
eval(code);                         // 절대 금지
new Function(code);                 // 절대 금지
```

---

## package.json 설정

```json
{
  "name": "imcat-plugin-example",
  "version": "1.0.0",
  "description": "Example plugin for IMCAT UI",
  "main": "dist/example.js",
  "module": "dist/example.js",
  "style": "dist/example.css",
  "keywords": [
    "imcat-ui",
    "imcat-plugin",
    "ui-component"
  ],
  "peerDependencies": {
    "@imcat-ckim/catui": ">=1.0.0"
  }
}
```

> **핵심**: `peerDependencies`로 IMCAT UI를 선언하여 번들 중복을 방지합니다.

---

## 플러그인 등록 및 사용

### 사용자 측

```javascript
// 1. npm 설치
// npm install imcat-plugin-example

// 2. 사용
import ExamplePlugin from 'imcat-plugin-example';
const widget = new ExamplePlugin.ExampleWidget('#container', {
  theme: 'dark'
});

// 3. 또는 IMCAT.use()로 로드 (로컬 모듈 경로 설정 시)
IMCAT.config.set({
  modulePaths: {
    'example': '/path/to/example.js'
  }
});
const Example = await IMCAT.use('example');
```

---

## 테스트 작성

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ExampleWidget } from '../src/index.js';

describe('ExampleWidget', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ExampleWidget.instances.forEach(instance => instance.destroy());
    document.body.removeChild(container);
  });

  it('인스턴스를 생성해야 함', () => {
    const widget = new ExampleWidget(container);
    expect(ExampleWidget.instances.has(container)).toBe(true);
  });

  it('destroy 후 정리되어야 함', () => {
    const widget = new ExampleWidget(container);
    widget.destroy();
    expect(ExampleWidget.instances.has(container)).toBe(false);
    expect(widget.container).toBeNull();
  });
});
```

---

## 플러그인 배포 체크리스트

- [ ] `destroy()` 메서드 구현 확인
- [ ] `static instances` Map 관리 확인
- [ ] 사용자 입력에 `Security.escape()` / `Security.sanitize()` 적용
- [ ] `eval()`, `new Function()` 미사용 확인
- [ ] `peerDependencies`에 `@imcat-ckim/catui` 선언
- [ ] 테스트 작성 및 통과
- [ ] README.md에 설치/사용 예제 포함
- [ ] 키워드에 `imcat-ui`, `imcat-plugin` 포함

---

## 관련 문서

- [CONTRIBUTING.md](../../CONTRIBUTING.md) — 기여 가이드
- [Security 모듈](../core/security.md) — XSS 방어 API
- [성능 최적화](../performance/optimization-guide.md) — destroy 패턴, 메모리 관리
