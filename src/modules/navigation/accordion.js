/**
 * Accordion 컴포넌트
 * @module modules/navigation/accordion
 * @description 아코디언 컴포넌트
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Config } from '../../core/config.js';

/**
 * Accordion 클래스
 * @class
 * @description 아코디언 컴포넌트
 */
class Accordion {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      multiple: false,
      expandFirst: true,
      animation: true,
      animationDuration: 300,
      onChange: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('accordion', Utils.extend({}, Accordion.defaults(), options));
    this.id = Utils.randomId('accordion');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('Accordion: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.items = [];
    this.eventBus = EventEmitterMixin.create();

    this._handleHeaderClick = this._handleHeaderClick.bind(this);

    this._init();
  }

  _init() {
    const itemElements = Array.from(this.container.querySelectorAll('.accordion__item'));

    if (itemElements.length === 0) {
      console.error('Accordion: .accordion__item을 찾을 수 없습니다.');
      return;
    }

    itemElements.forEach((itemEl, index) => {
      const header = itemEl.querySelector('.accordion__trigger') || itemEl.querySelector('.accordion__header');
      const content = itemEl.querySelector('.accordion__content');

      if (!header || !content) {
        console.warn(`Accordion: 아이템 ${index}의 헤더 또는 콘텐츠를 찾을 수 없습니다.`);
        return;
      }

      header.classList.add('accordion__trigger');

      if (!header.querySelector('.accordion__trigger-icon')) {
        const icon = document.createElement('i');
        icon.className = 'material-icons-outlined accordion__trigger-icon';
        icon.textContent = 'expand_more';
        header.appendChild(icon);
      }

      const headerId = header.id || `${this.id}-header-${index}`;
      const contentId = content.id || `${this.id}-content-${index}`;

      header.id = headerId;
      content.id = contentId;

      header.setAttribute('role', 'button');
      header.setAttribute('aria-controls', contentId);
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('tabindex', '0');

      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', headerId);
      content.style.display = 'none';

      this.items.push({
        element: itemEl,
        header: header,
        content: content,
        isExpanded: false
      });

      header.addEventListener('click', this._handleHeaderClick);
    });

    if (this.options.expandFirst && this.items.length > 0) {
      this.expand(0, false);
    }
  }

  _handleHeaderClick(e) {
    const header = e.currentTarget;
    const index = this.items.findIndex(item => item.header === header);
    if (index !== -1) {
      this.toggle(index);
    }
  }

  toggle(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn('Accordion: 유효하지 않은 인덱스입니다.');
      return;
    }
    const item = this.items[index];
    if (item.isExpanded) {
      this.collapse(index);
    } else {
      this.expand(index);
    }
  }

  expand(index, triggerCallback = true) {
    if (index < 0 || index >= this.items.length) {
      console.warn('Accordion: 유효하지 않은 인덱스입니다.');
      return;
    }

    const item = this.items[index];
    if (item.isExpanded) return;

    if (!this.options.multiple) {
      this.items.forEach((otherItem, i) => {
        if (i !== index && otherItem.isExpanded) {
          this.collapse(i, false);
        }
      });
    }

    item.isExpanded = true;
    item.header.setAttribute('aria-expanded', 'true');
    item.element.classList.add('is-open');
    item.content.classList.add('is-open');

    if (this.options.animation) {
      if (item._transitionEndHandler) {
        item.content.removeEventListener('transitionend', item._transitionEndHandler);
      }

      item.content.style.transition = 'none';
      item.content.style.display = 'block';
      item.content.style.height = '0';
      item.content.style.overflow = 'hidden';
      void item.content.offsetHeight;

      item.content.style.transition = `height ${this.options.animationDuration}ms ease`;
      item.content.style.height = item.content.scrollHeight + 'px';

      item._transitionEndHandler = () => {
        item.content.removeEventListener('transitionend', item._transitionEndHandler);
        item._transitionEndHandler = null;
        if (item.isExpanded) {
          item.content.style.height = 'auto';
          item.content.style.overflow = '';
          item.content.style.transition = '';
        }
      };
      item.content.addEventListener('transitionend', item._transitionEndHandler);
    } else {
      item.content.style.display = 'block';
    }

    if (triggerCallback && typeof this.options.onChange === 'function') {
      this.options.onChange(index, true, item);
    }
    this.eventBus.emit('expand', { index, item });
  }

  collapse(index, triggerCallback = true) {
    if (index < 0 || index >= this.items.length) {
      console.warn('Accordion: 유효하지 않은 인덱스입니다.');
      return;
    }

    const item = this.items[index];
    if (!item.isExpanded) return;

    item.isExpanded = false;
    item.header.setAttribute('aria-expanded', 'false');
    item.element.classList.remove('is-open');
    item.content.classList.remove('is-open');

    if (this.options.animation) {
      if (item._transitionEndHandler) {
        item.content.removeEventListener('transitionend', item._transitionEndHandler);
      }

      item.content.style.transition = 'none';
      item.content.style.height = item.content.scrollHeight + 'px';
      item.content.style.overflow = 'hidden';
      void item.content.offsetHeight;

      item.content.style.transition = `height ${this.options.animationDuration}ms ease`;
      item.content.style.height = '0';

      item._transitionEndHandler = () => {
        item.content.removeEventListener('transitionend', item._transitionEndHandler);
        item._transitionEndHandler = null;
        if (!item.isExpanded) {
          item.content.style.display = 'none';
          item.content.style.height = '';
          item.content.style.overflow = '';
          item.content.style.transition = '';
        }
      };
      item.content.addEventListener('transitionend', item._transitionEndHandler);
    } else {
      item.content.style.display = 'none';
    }

    if (triggerCallback && typeof this.options.onChange === 'function') {
      this.options.onChange(index, false, item);
    }
    this.eventBus.emit('collapse', { index, item });
  }

  expandAll() {
    this.items.forEach((item, index) => {
      this.expand(index, false);
    });
  }

  collapseAll() {
    this.items.forEach((item, index) => {
      this.collapse(index, false);
    });
  }

  destroy() {
    this.items.forEach(item => {
      item.header.removeEventListener('click', this._handleHeaderClick);
    });

    this.container = null;
    this.items = [];
    this.eventBus.clear();

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { Accordion };
export default Accordion;
