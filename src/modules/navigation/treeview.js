/**
 * TreeView 컴포넌트
 * @module modules/navigation/treeview
 * @description 트리 뷰 컴포넌트 (계층적 데이터 표시)
 */

import { EventEmitterMixin } from '../../core/event.js';
import { Utils } from '../../core/utils.js';
import { Config } from '../../core/config.js';

/**
 * TreeView 클래스
 * @class
 * @description 트리 뷰 컴포넌트 (계층적 데이터 표시)
 */
class TreeView {
  /**
   * 기본 옵션
   * @returns {Object}
   */
  static defaults() {
    return {
      expandIcon: 'expand_more',
      collapseIcon: 'chevron_right',
      animation: true,
      animationDuration: 300,
      multipleSelect: false,
      onNodeClick: null,
      onNodeToggle: null,
      onDestroy: null
    };
  }

  constructor(container, options = {}) {
    this.options = Config.getFor('treeview', Utils.extend({}, TreeView.defaults(), options));
    this.id = Utils.randomId('treeview');

    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('TreeView: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    this.nodes = [];
    this.selectedNodes = [];
    this.eventBus = EventEmitterMixin.create();
    this._timers = [];

    this._handleToggleClick = this._handleToggleClick.bind(this);
    this._handleNodeClick = this._handleNodeClick.bind(this);

    this._init();
  }

  _init() {
    this._initNodes(this.container);
  }

  _initNodes(parentElement, level = 0) {
    const nodeElements = Array.from(parentElement.querySelectorAll(':scope > .treeview__item'));

    nodeElements.forEach((nodeEl) => {
      const toggle = nodeEl.querySelector('.treeview__toggle');
      const label = nodeEl.querySelector('.treeview__label');
      const children = nodeEl.querySelector('.treeview__children');

      if (!label) return;

      const nodeData = {
        element: nodeEl,
        toggle: toggle,
        label: label,
        children: children,
        level: level,
        isExpanded: false,
        isSelected: false,
        hasChildren: !!children
      };

      this.nodes.push(nodeData);

      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', this._handleToggleClick);
      }

      label.setAttribute('role', 'treeitem');
      label.setAttribute('tabindex', '0');
      label.addEventListener('click', this._handleNodeClick);

      if (children) {
        children.style.display = 'none';
        this._initNodes(children, level + 1);
      }
    });
  }

  _handleToggleClick(e) {
    e.stopPropagation();
    const toggle = e.currentTarget;
    const nodeData = this.nodes.find(n => n.toggle === toggle);
    if (nodeData) {
      this.toggleNode(nodeData);
    }
  }

  _handleNodeClick(e) {
    const label = e.currentTarget;
    const nodeData = this.nodes.find(n => n.label === label);
    if (nodeData) {
      this.selectNode(nodeData);
    }
  }

  toggleNode(nodeData) {
    if (!nodeData.hasChildren) return;
    if (nodeData.isExpanded) {
      this.collapseNode(nodeData);
    } else {
      this.expandNode(nodeData);
    }
  }

  expandNode(nodeData) {
    if (!nodeData.hasChildren || nodeData.isExpanded) return;

    nodeData.isExpanded = true;
    nodeData.element.classList.add('treeview__item--expanded');

    if (nodeData.toggle) {
      nodeData.toggle.setAttribute('aria-expanded', 'true');
      const icon = nodeData.toggle.querySelector('i');
      if (icon) {
        icon.textContent = this.options.expandIcon;
      }
    }

    if (this.options.animation) {
      nodeData.children.style.display = 'block';
      const height = nodeData.children.scrollHeight;
      nodeData.children.style.height = '0';
      nodeData.children.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        nodeData.children.style.transition = `height ${this.options.animationDuration}ms ease`;
        nodeData.children.style.height = height + 'px';

        const timerId = setTimeout(() => {
          if (!this.container) return;
          nodeData.children.style.height = 'auto';
          nodeData.children.style.overflow = 'visible';
        }, this.options.animationDuration);
        this._timers.push(timerId);
      });
    } else {
      nodeData.children.style.display = 'block';
    }

    if (typeof this.options.onNodeToggle === 'function') {
      this.options.onNodeToggle(nodeData, true);
    }
    this.eventBus.emit('expand', { node: nodeData });
  }

  collapseNode(nodeData) {
    if (!nodeData.hasChildren || !nodeData.isExpanded) return;

    nodeData.isExpanded = false;
    nodeData.element.classList.remove('treeview__item--expanded');

    if (nodeData.toggle) {
      nodeData.toggle.setAttribute('aria-expanded', 'false');
      const icon = nodeData.toggle.querySelector('i');
      if (icon) {
        icon.textContent = this.options.collapseIcon;
      }
    }

    if (this.options.animation) {
      const height = nodeData.children.scrollHeight;
      nodeData.children.style.height = height + 'px';
      nodeData.children.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        nodeData.children.style.transition = `height ${this.options.animationDuration}ms ease`;
        nodeData.children.style.height = '0';

        const timerId = setTimeout(() => {
          if (!this.container) return;
          nodeData.children.style.display = 'none';
          nodeData.children.style.height = 'auto';
        }, this.options.animationDuration);
        this._timers.push(timerId);
      });
    } else {
      nodeData.children.style.display = 'none';
    }

    if (typeof this.options.onNodeToggle === 'function') {
      this.options.onNodeToggle(nodeData, false);
    }
    this.eventBus.emit('collapse', { node: nodeData });
  }

  selectNode(nodeData) {
    if (!this.options.multipleSelect) {
      this.selectedNodes.forEach(node => {
        node.isSelected = false;
        node.label.classList.remove('treeview__label--selected');
        node.label.setAttribute('aria-selected', 'false');
      });
      this.selectedNodes = [];
    }

    nodeData.isSelected = !nodeData.isSelected;

    if (nodeData.isSelected) {
      nodeData.label.classList.add('treeview__label--selected');
      nodeData.label.setAttribute('aria-selected', 'true');
      this.selectedNodes.push(nodeData);
    } else {
      nodeData.label.classList.remove('treeview__label--selected');
      nodeData.label.setAttribute('aria-selected', 'false');
      this.selectedNodes = this.selectedNodes.filter(n => n !== nodeData);
    }

    if (typeof this.options.onNodeClick === 'function') {
      this.options.onNodeClick(nodeData, nodeData.isSelected);
    }
    this.eventBus.emit('select', { node: nodeData, selected: nodeData.isSelected });
  }

  expandAll() {
    this.nodes.forEach(node => {
      if (node.hasChildren && !node.isExpanded) {
        this.expandNode(node);
      }
    });
  }

  collapseAll() {
    this.nodes.forEach(node => {
      if (node.hasChildren && node.isExpanded) {
        this.collapseNode(node);
      }
    });
  }

  destroy() {
    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];

    this.nodes.forEach(node => {
      if (node.toggle) {
        node.toggle.removeEventListener('click', this._handleToggleClick);
      }
      node.label.removeEventListener('click', this._handleNodeClick);
    });

    this.container = null;
    this.nodes = [];
    this.selectedNodes = [];
    this.eventBus.clear();

    if (typeof this.options.onDestroy === 'function') {
      this.options.onDestroy(this);
    }
  }
}

export { TreeView };
export default TreeView;
