/**
 * Masonry 컴포넌트
 * @module modules/data-viz/masonry
 * @description CSS Grid 기반 타일 레이아웃. 필터, 애니메이션 지원.
 */

import { Security } from '../../core/security.js';

class Masonry {
  static defaults() {
    return {
      columnWidth: 300,
      gap: 16,
      items: [],
      render: null,
      filterKey: null,
      animate: true
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Masonry.defaults(), ...options };
    this.activeFilter = null;
    this._init();
  }

  _init() {
    this.container.classList.add('masonry');
    if (this.options.animate) this.container.classList.add('masonry--animated');
    this._applyGridStyle();
    this._renderItems();
    this._bindEvents();
  }

  _applyGridStyle() {
    const { columnWidth, gap } = this.options;
    this.container.style.setProperty('--masonry-col-width', `${columnWidth}px`);
    this.container.style.setProperty('--masonry-gap', `${gap}px`);
  }

  _renderItems() {
    const { items, render } = this.options;
    if (!render) return;

    const filtered = this.activeFilter
      ? items.filter(item => item[this.options.filterKey] === this.activeFilter)
      : items;

    this.container.innerHTML = filtered.map((item, i) => {
      const categories = item[this.options.filterKey] || '';
      return `<div class="masonry__item" data-index="${i}" data-category="${Security.escape(String(categories))}">${render(item, i)}</div>`;
    }).join('');
  }

  /** 카테고리 필터 적용 */
  filter(category) {
    this.activeFilter = category || null;
    this._renderItems();
  }

  /** 필터 해제 */
  clearFilter() {
    this.activeFilter = null;
    this._renderItems();
  }

  /** 카테고리 목록 반환 */
  getCategories() {
    if (!this.options.filterKey) return [];
    const cats = new Set(this.options.items.map(item => item[this.options.filterKey]).filter(Boolean));
    return Array.from(cats);
  }

  addItem(item) {
    this.options.items.push(item);
    if (this.options.render && (!this.activeFilter || item[this.options.filterKey] === this.activeFilter)) {
      const div = document.createElement('div');
      div.className = 'masonry__item';
      div.dataset.index = this.options.items.length - 1;
      div.dataset.category = item[this.options.filterKey] || '';
      div.innerHTML = this.options.render(item, this.options.items.length - 1);
      this.container.appendChild(div);
    }
  }

  removeItem(index) {
    this.options.items.splice(index, 1);
    this._renderItems();
  }

  _bindEvents() {
    this._resizeObserver = new ResizeObserver(() => { /* CSS Grid 자동 처리 */ });
    this._resizeObserver.observe(this.container);
  }

  destroy() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this.container.innerHTML = '';
    this.container.classList.remove('masonry', 'masonry--animated');
    this.container.style.removeProperty('--masonry-col-width');
    this.container.style.removeProperty('--masonry-gap');
  }
}

export { Masonry };
export default Masonry;
