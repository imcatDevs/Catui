/**
 * MegaMenu 컴포넌트
 * @module modules/navigation/megamenu
 * @description 메가 메뉴 컴포넌트 (대형 드롭다운 메뉴)
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Config } from '../../core/config.js';

/**
 * MegaMenu 클래스
 * @class
 * @description 메가 메뉴 컴포넌트 (대형 드롭다운 메뉴)
 */
class MegaMenu {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      trigger: 'hover',
      hoverDelay: 200,
      animation: true,
      animationDuration: 300,
      closeOnOutside: true,
      onChange: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('megamenu', Utils.extend({}, MegaMenu.defaults(), options));
    this.id = Utils.randomId('megamenu');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('MegaMenu: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.items = [];
    this.activeItem = null;
    this.hoverTimer = null;
    this.eventBus = EventEmitterMixin.create();

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleTriggerMouseEnter = this._handleTriggerMouseEnter.bind(this);
    this._handleTriggerMouseLeave = this._handleTriggerMouseLeave.bind(this);
    this._handlePanelMouseEnter = this._handlePanelMouseEnter.bind(this);
    this._handlePanelMouseLeave = this._handlePanelMouseLeave.bind(this);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);

    this._init();
  }

  _init() {
    const itemElements = Array.from(this.container.querySelectorAll('.megamenu__item'));

    if (itemElements.length === 0) {
      console.error('MegaMenu: .megamenu__item을 찾을 수 없습니다.');
      return;
    }

    itemElements.forEach((itemEl, index) => {
      const trigger = itemEl.querySelector('.megamenu__trigger');
      const panel = itemEl.querySelector('.megamenu__panel');

      if (!trigger || !panel) {
        console.warn(`MegaMenu: 아이템 ${index}의 트리거 또는 패널을 찾을 수 없습니다.`);
        return;
      }

      const triggerId = trigger.id || `${this.id}-trigger-${index}`;
      const panelId = panel.id || `${this.id}-panel-${index}`;

      trigger.id = triggerId;
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', panelId);

      panel.id = panelId;
      panel.setAttribute('aria-labelledby', triggerId);
      panel.style.display = 'none';

      this.items.push({
        element: itemEl,
        trigger: trigger,
        panel: panel,
        isOpen: false
      });

      if (this.options.trigger === 'hover') {
        trigger.addEventListener('mouseenter', this._handleTriggerMouseEnter);
        trigger.addEventListener('mouseleave', this._handleTriggerMouseLeave);
        panel.addEventListener('mouseenter', this._handlePanelMouseEnter);
        panel.addEventListener('mouseleave', this._handlePanelMouseLeave);
      } else {
        trigger.addEventListener('click', this._handleTriggerClick);
      }
    });

    if (this.options.closeOnOutside) {
      document.addEventListener('click', this._handleOutsideClick);
    }
  }

  _handleTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const trigger = e.currentTarget;
    const index = this.items.findIndex(item => item.trigger === trigger);
    if (index !== -1) {
      this.toggle(index);
    }
  }

  _handleTriggerMouseEnter(e) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
    const trigger = e.currentTarget;
    const index = this.items.findIndex(item => item.trigger === trigger);
    this.hoverTimer = setTimeout(() => {
      if (index !== -1) {
        this.open(index);
      }
    }, this.options.hoverDelay);
  }

  _handleTriggerMouseLeave() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    this.hoverTimer = setTimeout(() => {
      this.closeAll();
    }, 300);
  }

  _handlePanelMouseEnter() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  _handlePanelMouseLeave() {
    this.hoverTimer = setTimeout(() => {
      this.closeAll();
    }, 300);
  }

  _handleOutsideClick(e) {
    const isInside = this.items.some(item => item.element.contains(e.target));
    if (!isInside) {
      this.closeAll();
    }
  }

  toggle(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn('MegaMenu: 유효하지 않은 인덱스입니다.');
      return;
    }
    const item = this.items[index];
    if (item.isOpen) {
      this.close(index);
    } else {
      this.open(index);
    }
  }

  open(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn('MegaMenu: 유효하지 않은 인덱스입니다.');
      return;
    }

    const item = this.items[index];
    if (item.isOpen) return;

    this.closeAll();

    item.isOpen = true;
    item.trigger.setAttribute('aria-expanded', 'true');
    item.element.classList.add('megamenu__item--active');

    if (this.options.animation) {
      item.panel.style.display = 'block';
      item.panel.style.opacity = '0';
      item.panel.style.transform = 'translateY(-10px)';

      requestAnimationFrame(() => {
        if (!item.panel) return;
        item.panel.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
        item.panel.style.opacity = '1';
        item.panel.style.transform = 'translateY(0)';
      });
    } else {
      item.panel.style.display = 'block';
    }

    this.activeItem = item;

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(index, true, item);
    }
    this.eventBus.emit('open', { index, item });
  }

  close(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn('MegaMenu: 유효하지 않은 인덱스입니다.');
      return;
    }

    const item = this.items[index];
    if (!item.isOpen) return;

    item.isOpen = false;
    item.trigger.setAttribute('aria-expanded', 'false');
    item.element.classList.remove('megamenu__item--active');

    if (this.options.animation) {
      item.panel.style.opacity = '0';
      item.panel.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        item.panel.style.display = 'none';
      }, this.options.animationDuration);
    } else {
      item.panel.style.display = 'none';
    }

    if (this.activeItem === item) {
      this.activeItem = null;
    }

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(index, false, item);
    }
    this.eventBus.emit('close', { index, item });
  }

  closeAll() {
    this.items.forEach((item, index) => {
      if (item.isOpen) {
        this.close(index);
      }
    });
  }

  destroy() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }

    if (this.items && Array.isArray(this.items)) {
      this.items.forEach(item => {
        if (this.options.trigger === 'hover') {
          item.trigger.removeEventListener('mouseenter', this._handleTriggerMouseEnter);
          item.trigger.removeEventListener('mouseleave', this._handleTriggerMouseLeave);
          item.panel.removeEventListener('mouseenter', this._handlePanelMouseEnter);
          item.panel.removeEventListener('mouseleave', this._handlePanelMouseLeave);
        } else {
          item.trigger.removeEventListener('click', this._handleTriggerClick);
        }
      });
    }

    document.removeEventListener('click', this._handleOutsideClick);

    this.container = null;
    this.items = [];
    this.activeItem = null;
    if (this.eventBus) {
      this.eventBus.clear();
    }

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { MegaMenu };
export default MegaMenu;
