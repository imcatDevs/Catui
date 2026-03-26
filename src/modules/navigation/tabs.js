/**
 * Tabs 컴포넌트
 * @module modules/navigation/tabs
 * @description 탭 네비게이션 컴포넌트
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Config } from '../../core/config.js';

/**
 * Tabs 클래스
 * @class
 * @description 탭 네비게이션 컴포넌트
 */
class Tabs {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      activeIndex: 0,
      orientation: 'horizontal',
      keyboard: true,
      animation: true,
      animationDuration: 300,
      onChange: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('tabs', Utils.extend({}, Tabs.defaults(), options));
    this.id = Utils.randomId('tabs');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('Tabs: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.tabList = null;
    this.tabs = [];
    this.panels = [];
    this.activeIndex = this.options.activeIndex;
    this.eventBus = EventEmitterMixin.create();

    this._handleTabClick = this._handleTabClick.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);

    this._init();
  }

  _init() {
    this.tabList = this.container.querySelector('[role="tablist"]');
    if (!this.tabList) {
      console.error('Tabs: [role="tablist"]를 찾을 수 없습니다.');
      return;
    }

    this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));

    if (this.tabs.length === 0 || this.panels.length === 0) {
      console.error('Tabs: 탭 또는 패널을 찾을 수 없습니다.');
      return;
    }

    if (!this.container.classList.contains('tabs')) {
      this.container.classList.add('tabs');
    }
    this.container.classList.add(`tabs--${this.options.orientation}`);
    this.tabList.classList.add('tabs__list');
    this.tabs.forEach(tab => tab.classList.add('tabs__tab'));
    this.panels.forEach(panel => panel.classList.add('tabs__panel'));

    const panelParent = this.panels[0]?.parentElement;
    if (panelParent && panelParent !== this.container && panelParent !== this.tabList) {
      panelParent.classList.add('tabs__content');
    }

    this.tabList.setAttribute('aria-orientation', this.options.orientation);

    this.tabs.forEach((tab, index) => {
      const tabId = tab.id || `${this.id}-tab-${index}`;
      const panelId = this.panels[index]?.id || `${this.id}-panel-${index}`;

      tab.id = tabId;
      tab.setAttribute('aria-controls', panelId);
      tab.setAttribute('tabindex', index === this.activeIndex ? '0' : '-1');

      if (this.panels[index]) {
        this.panels[index].id = panelId;
        this.panels[index].setAttribute('aria-labelledby', tabId);
      }

      tab.addEventListener('click', this._handleTabClick);
      if (this.options.keyboard) {
        tab.addEventListener('keydown', this._handleKeydown);
      }
    });

    this.panels.forEach((panel, i) => {
      panel.removeAttribute('hidden');
      if (i !== this.activeIndex) {
        panel.style.display = 'none';
        panel.classList.remove('is-active');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    this.select(this.activeIndex, false);
  }

  _handleTabClick(e) {
    const tab = e.currentTarget;
    const index = this.tabs.indexOf(tab);
    if (index !== -1 && index !== this.activeIndex) {
      this.select(index);
    }
  }

  _handleKeydown(e) {
    const currentIndex = this.tabs.indexOf(e.target);
    let nextIndex = currentIndex;
    const isHorizontal = this.options.orientation === 'horizontal';

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
          nextIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      this.select(nextIndex);
      this.tabs[nextIndex].focus();
    }
  }

  select(index, triggerCallback = true) {
    if (index < 0 || index >= this.tabs.length) {
      console.warn('Tabs: 유효하지 않은 인덱스입니다.');
      return;
    }

    const previousIndex = this.activeIndex;
    if (index === previousIndex && triggerCallback) return;

    if (previousIndex !== index && previousIndex >= 0 && previousIndex < this.tabs.length) {
      this.tabs[previousIndex].classList.remove('is-active');
      this.tabs[previousIndex].setAttribute('aria-selected', 'false');
      this.tabs[previousIndex].setAttribute('tabindex', '-1');
      this.panels[previousIndex].classList.remove('is-active');
      this.panels[previousIndex].setAttribute('aria-hidden', 'true');
      this.panels[previousIndex].removeAttribute('hidden');
      this.panels[previousIndex].style.display = 'none';
      this.panels[previousIndex].style.transition = '';
      this.panels[previousIndex].style.opacity = '';
      this.panels[previousIndex].style.transform = '';
    }

    this.tabs[index].classList.add('is-active');
    this.tabs[index].setAttribute('aria-selected', 'true');
    this.tabs[index].setAttribute('tabindex', '0');
    this.panels[index].classList.add('is-active');
    this.panels[index].setAttribute('aria-hidden', 'false');
    this.panels[index].removeAttribute('hidden');
    this.panels[index].style.display = 'block';

    if (this.options.animation) {
      this.panels[index].style.opacity = '0';
      this.panels[index].style.transform = 'translateY(10px)';

      requestAnimationFrame(() => {
        if (!this.panels || !this.panels[index]) return;
        this.panels[index].style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
        this.panels[index].style.opacity = '1';
        this.panels[index].style.transform = 'translateY(0)';
      });
    }

    this.activeIndex = index;

    if (triggerCallback && typeof this.options.onChange === 'function') {
      this.options.onChange(index, this.tabs[index], this.panels[index]);
    }

    this.eventBus.emit('change', { index, tab: this.tabs[index], panel: this.panels[index] });
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  destroy() {
    this.tabs.forEach(tab => {
      tab.removeEventListener('click', this._handleTabClick);
      tab.removeEventListener('keydown', this._handleKeydown);
    });

    this.container = null;
    this.tabList = null;
    this.tabs = [];
    this.panels = [];
    this.eventBus.clear();

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { Tabs };
export default Tabs;
