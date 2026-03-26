/**
 * Collapse 컴포넌트
 * @module modules/navigation/collapse
 * @description 단일 접기/펼치기 컴포넌트
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Config } from '../../core/config.js';

/**
 * Collapse 클래스
 * @class
 * @description 단일 접기/펼치기 컴포넌트
 */
class Collapse {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      expanded: false,
      animation: true,
      animationDuration: 300,
      onChange: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('collapse', Utils.extend({}, Collapse.defaults(), options));
    this.id = Utils.randomId('collapse');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('Collapse: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.isExpanded = this.options.expanded;
    this.eventBus = EventEmitterMixin.create();

    this._init();
  }

  _init() {
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-expanded', this.isExpanded.toString());

    if (!this.isExpanded) {
      this.container.style.display = 'none';
    }
  }

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand() {
    if (this.isExpanded) return;

    this.isExpanded = true;
    this.container.setAttribute('aria-expanded', 'true');

    if (this.options.animation) {
      if (this._transitionEndHandler) {
        this.container.removeEventListener('transitionend', this._transitionEndHandler);
      }

      this.container.style.display = 'block';
      const height = this.container.scrollHeight;
      this.container.style.height = '0';
      this.container.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        if (!this.container) return;
        this.container.style.transition = `height ${this.options.animationDuration}ms ease`;
        this.container.style.height = height + 'px';

        this._transitionEndHandler = () => {
          if (!this.container) return;
          this.container.removeEventListener('transitionend', this._transitionEndHandler);
          this._transitionEndHandler = null;
          if (this.isExpanded) {
            this.container.style.height = 'auto';
            this.container.style.overflow = 'visible';
            this.container.style.transition = '';
          }
        };
        this.container.addEventListener('transitionend', this._transitionEndHandler);
      });
    } else {
      this.container.style.display = 'block';
    }

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(true);
    }
    this.eventBus.emit('expand');
  }

  collapse() {
    if (!this.isExpanded) return;

    this.isExpanded = false;
    this.container.setAttribute('aria-expanded', 'false');

    if (this.options.animation) {
      if (this._transitionEndHandler) {
        this.container.removeEventListener('transitionend', this._transitionEndHandler);
      }

      const height = this.container.scrollHeight;
      this.container.style.height = height + 'px';
      this.container.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        if (!this.container) return;
        this.container.style.transition = `height ${this.options.animationDuration}ms ease`;
        this.container.style.height = '0';

        this._transitionEndHandler = () => {
          if (!this.container) return;
          this.container.removeEventListener('transitionend', this._transitionEndHandler);
          this._transitionEndHandler = null;
          if (!this.isExpanded) {
            this.container.style.display = 'none';
            this.container.style.height = 'auto';
            this.container.style.transition = '';
          }
        };
        this.container.addEventListener('transitionend', this._transitionEndHandler);
      });
    } else {
      this.container.style.display = 'none';
    }

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(false);
    }
    this.eventBus.emit('collapse');
  }

  destroy() {
    this.container = null;
    this.eventBus.clear();

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { Collapse };
export default Collapse;
