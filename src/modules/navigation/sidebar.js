/**
 * Sidebar 컴포넌트
 * @module modules/navigation/sidebar
 * @description 사이드바 네비게이션 컴포넌트 (Ubold app-menu 패턴 참조)
 *   - 다단계 메뉴 (JSON 데이터 렌더링 또는 기존 DOM 파싱)
 *   - 메뉴 타이틀 섹션, 아이콘, 뱃지
 *   - 사이드바 토글 (expanded / collapsed / compact)
 *   - 활성 항목 자동 추적
 *   - 키보드 접근성
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Security } from '../../core/security.js';
import { Config } from '../../core/config.js';

/**
 * Sidebar 클래스
 * @class
 * @description 사이드바 네비게이션 컴포넌트
 */
class Sidebar {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      mode: 'expanded',
      collapsedWidth: 64,
      compactWidth: 180,
      expandedWidth: 260,
      animation: true,
      animationDuration: 250,
      closeOthers: true,
      activeItem: null,
      showUserBox: false,
      user: null,
      items: null,
      onItemClick: null,
      onModeChange: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('sidebar', Utils.extend({}, Sidebar.defaults(), options));
    this.id = Utils.randomId('sidebar');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('Sidebar: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.mode = this.options.mode;
    this.menuEl = null;
    this.menuItems = [];
    this.activeItemEl = null;
    this.eventBus = EventEmitterMixin.create();
    this._timers = [];

    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._handleToggleClick = this._handleToggleClick.bind(this);

    this._init();
  }

  _init() {
    this.container.classList.add('sidebar');
    this.container.classList.add(`sidebar--${this.mode}`);
    this.container.style.setProperty('--sidebar-width', `${this._getWidth()}px`);

    if (this.options.items) {
      this._renderFromData();
    } else {
      this._parseExistingDOM();
    }

    if (this.menuEl) {
      this.menuEl.addEventListener('click', this._handleMenuClick);
    }

    const toggleBtn = this.container.querySelector('.sidebar__toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', this._handleToggleClick);
    }

    if (this.options.activeItem) {
      this.setActive(this.options.activeItem);
    }
  }

  _getWidth() {
    switch (this.mode) {
      case 'collapsed': return this.options.collapsedWidth;
      case 'compact': return this.options.compactWidth;
      default: return this.options.expandedWidth;
    }
  }

  _renderFromData() {
    let html = '';

    html += '<div class="sidebar__logo"><span class="sidebar__logo-text">IMCAT</span></div>';

    if (this.options.showUserBox && this.options.user) {
      const u = this.options.user;
      html += '<div class="sidebar__user">';
      if (u.avatar) {
        html += `<img class="sidebar__user-avatar" src="${Security.escape(u.avatar)}" alt="avatar">`;
      } else {
        const initial = (u.name || '?').charAt(0).toUpperCase();
        html += `<div class="sidebar__user-avatar sidebar__user-avatar--initial">${initial}</div>`;
      }
      html += '<div class="sidebar__user-info">';
      html += `<div class="sidebar__user-name">${Security.escape(u.name || '')}</div>`;
      if (u.role) {
        html += `<div class="sidebar__user-role">${Security.escape(u.role)}</div>`;
      }
      html += '</div></div>';
    }

    html += '<button class="sidebar__toggle" aria-label="사이드바 토글"><i class="material-icons-outlined">menu</i></button>';

    html += '<nav class="sidebar__nav"><ul class="sidebar__menu">';
    html += this._renderMenuItems(this.options.items);
    html += '</ul></nav>';

    this.container.innerHTML = html;
    this.menuEl = this.container.querySelector('.sidebar__menu');

    this._parseMenuItems(this.menuEl);
  }

  _renderMenuItems(items) {
    let html = '';

    items.forEach(item => {
      if (item.type === 'title') {
        html += `<li class="sidebar__menu-title">${Security.escape(item.label)}</li>`;
        return;
      }

      const hasChildren = item.children && item.children.length > 0;
      const itemId = item.id || '';
      const href = item.href || '#';
      const icon = item.icon || '';
      const badge = item.badge || null;

      html += `<li class="sidebar__menu-item${hasChildren ? ' has-submenu' : ''}" ${itemId ? `data-id="${Security.escape(itemId)}"` : ''}>`;
      html += `<a class="sidebar__menu-link" href="${Security.escape(href)}"${item.target ? ` target="${Security.escape(item.target)}"` : ''}>`;

      if (icon) {
        html += `<span class="sidebar__menu-icon"><i class="material-icons-outlined">${Security.escape(icon)}</i></span>`;
      }

      html += `<span class="sidebar__menu-text">${Security.escape(item.label)}</span>`;

      if (badge) {
        const badgeClass = badge.variant ? `badge--${badge.variant}` : 'badge--primary';
        html += `<span class="sidebar__badge ${badgeClass}">${Security.escape(String(badge.text))}</span>`;
      }

      if (hasChildren) {
        html += '<span class="sidebar__menu-arrow"><i class="material-icons-outlined">chevron_right</i></span>';
      }

      html += '</a>';

      if (hasChildren) {
        html += '<ul class="sidebar__submenu">';
        html += this._renderMenuItems(item.children);
        html += '</ul>';
      }

      html += '</li>';
    });

    return html;
  }

  _parseExistingDOM() {
    this.menuEl = this.container.querySelector('.sidebar__menu');
    if (!this.menuEl) {
      console.error('Sidebar: .sidebar__menu를 찾을 수 없습니다.');
      return;
    }

    this._parseMenuItems(this.menuEl);

    if (!this.container.querySelector('.sidebar__toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'sidebar__toggle';
      toggleBtn.setAttribute('aria-label', '사이드바 토글');
      toggleBtn.innerHTML = '<i class="material-icons-outlined">menu</i>';
      this.container.insertBefore(toggleBtn, this.menuEl.parentElement || this.menuEl);
    }
  }

  _parseMenuItems(parentEl, parentItem = null) {
    const itemEls = Array.from(parentEl.querySelectorAll(':scope > .sidebar__menu-item'));

    itemEls.forEach(el => {
      const link = el.querySelector(':scope > .sidebar__menu-link');
      const submenu = el.querySelector(':scope > .sidebar__submenu');

      if (!link) return;

      const itemData = {
        element: el,
        link: link,
        submenu: submenu,
        children: [],
        isOpen: false,
        parentItem: parentItem
      };

      this.menuItems.push(itemData);

      if (parentItem) {
        parentItem.children.push(itemData);
      }

      if (submenu) {
        submenu.style.display = 'none';
        el.classList.add('has-submenu');
        this._parseMenuItems(submenu, itemData);
      }
    });
  }

  _handleMenuClick(e) {
    const link = e.target.closest('.sidebar__menu-link');
    if (!link) return;

    const itemEl = link.parentElement;
    const itemData = this.menuItems.find(m => m.element === itemEl);
    if (!itemData) return;

    if (itemData.submenu) {
      e.preventDefault();
      this._toggleSubmenu(itemData);
      return;
    }

    this._setActiveItem(itemData);

    if (typeof this.options.onItemClick === 'function') {
      this.options.onItemClick(itemData, link);
    }

    this.eventBus.emit('itemClick', { item: itemData, link });
  }

  _handleToggleClick() {
    if (this.mode === 'expanded') {
      this.setMode('collapsed');
    } else {
      this.setMode('expanded');
    }
  }

  _toggleSubmenu(itemData) {
    if (itemData.isOpen) {
      this._collapseSubmenu(itemData);
    } else {
      if (this.options.closeOthers) {
        const siblings = this.menuItems.filter(m =>
          m.submenu && m.isOpen && m.parentItem === itemData.parentItem && m !== itemData
        );
        siblings.forEach(s => this._collapseSubmenu(s));
      }
      this._expandSubmenu(itemData);
    }
  }

  _expandSubmenu(itemData) {
    if (!itemData.submenu || itemData.isOpen) return;

    itemData.isOpen = true;
    itemData.element.classList.add('is-open');

    if (this.options.animation) {
      itemData.submenu.style.display = 'block';
      const height = itemData.submenu.scrollHeight;
      itemData.submenu.style.height = '0';
      itemData.submenu.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        itemData.submenu.style.transition = `height ${this.options.animationDuration}ms ease`;
        itemData.submenu.style.height = height + 'px';

        const timerId = setTimeout(() => {
          if (!this.container) return;
          itemData.submenu.style.height = 'auto';
          itemData.submenu.style.overflow = 'visible';
        }, this.options.animationDuration);
        this._timers.push(timerId);
      });
    } else {
      itemData.submenu.style.display = 'block';
    }

    this.eventBus.emit('submenuOpen', { item: itemData });
  }

  _collapseSubmenu(itemData) {
    if (!itemData.submenu || !itemData.isOpen) return;

    itemData.isOpen = false;
    itemData.element.classList.remove('is-open');

    // 자식 서브메뉴도 닫기
    itemData.children.forEach(child => {
      if (child.isOpen) this._collapseSubmenu(child);
    });

    if (this.options.animation) {
      const height = itemData.submenu.scrollHeight;
      itemData.submenu.style.height = height + 'px';
      itemData.submenu.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        itemData.submenu.style.transition = `height ${this.options.animationDuration}ms ease`;
        itemData.submenu.style.height = '0';

        const timerId = setTimeout(() => {
          if (!this.container) return;
          itemData.submenu.style.display = 'none';
          itemData.submenu.style.height = 'auto';
        }, this.options.animationDuration);
        this._timers.push(timerId);
      });
    } else {
      itemData.submenu.style.display = 'none';
    }

    this.eventBus.emit('submenuClose', { item: itemData });
  }

  _setActiveItem(itemData) {
    if (this.activeItemEl) {
      this.activeItemEl.classList.remove('is-active');
    }

    this.menuItems.forEach(m => m.element.classList.remove('is-active'));

    itemData.element.classList.add('is-active');
    this.activeItemEl = itemData.element;

    let parent = itemData.parentItem;
    while (parent) {
      if (!parent.isOpen) {
        this._expandSubmenu(parent);
      }
      parent.element.classList.add('is-active-parent');
      parent = parent.parentItem;
    }
  }

  setActive(idOrHref) {
    const itemData = this.menuItems.find(m => {
      const el = m.element;
      const link = m.link;
      return el.dataset.id === idOrHref || link.getAttribute('href') === idOrHref;
    });

    if (itemData) {
      this._setActiveItem(itemData);
    }
  }

  setMode(newMode) {
    if (newMode === this.mode) return;

    const oldMode = this.mode;
    this.container.classList.remove(`sidebar--${oldMode}`);
    this.mode = newMode;
    this.container.classList.add(`sidebar--${newMode}`);
    this.container.style.setProperty('--sidebar-width', `${this._getWidth()}px`);

    if (newMode === 'collapsed') {
      this.menuItems.forEach(m => {
        if (m.isOpen) {
          m.isOpen = false;
          m.element.classList.remove('is-open');
          if (m.submenu) m.submenu.style.display = 'none';
        }
      });
    }

    const toggleIcon = this.container.querySelector('.sidebar__toggle i');
    if (toggleIcon) {
      toggleIcon.textContent = newMode === 'collapsed' ? 'menu_open' : 'menu';
    }

    if (typeof this.options.onModeChange === 'function') {
      this.options.onModeChange(newMode, oldMode);
    }

    this.eventBus.emit('modeChange', { mode: newMode, previousMode: oldMode });
  }

  getMode() {
    return this.mode;
  }

  expandAll() {
    this.menuItems.forEach(m => {
      if (m.submenu && !m.isOpen) {
        this._expandSubmenu(m);
      }
    });
  }

  collapseAll() {
    this.menuItems.forEach(m => {
      if (m.submenu && m.isOpen) {
        this._collapseSubmenu(m);
      }
    });
  }

  destroy() {
    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];

    if (this.menuEl) {
      this.menuEl.removeEventListener('click', this._handleMenuClick);
    }

    const toggleBtn = this.container?.querySelector('.sidebar__toggle');
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', this._handleToggleClick);
    }

    this.container = null;
    this.menuEl = null;
    this.menuItems = [];
    this.activeItemEl = null;
    this.eventBus.clear();

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { Sidebar };
export default Sidebar;
