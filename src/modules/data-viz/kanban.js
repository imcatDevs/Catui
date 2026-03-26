/**
 * Kanban 컴포넌트
 * @module modules/data-viz/kanban
 * @description 드래그 앤 드롭, 우선순위 배지, 담당자 아바타, 날짜, WIP 제한 지원
 */

import { Security } from '../../core/security.js';

class Kanban {
  /** 우선순위 색상 매핑 */
  static PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  };

  static PRIORITY_LABELS = {
    high: '높음',
    medium: '보통',
    low: '낮음'
  };

  static defaults() {
    return {
      columns: [],
      onMove: null,
      onCardClick: null,
      onCardAdd: null,
      onCardDelete: null,
      allowAddCard: true,
      showColumnMenu: true
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Kanban.defaults(), ...options };
    this.draggedCard = null;
    this._init();
  }

  _init() {
    this.container.classList.add('kanban');
    this._render();
    this._bindEvents();
  }

  _render() {
    const { columns, allowAddCard, showColumnMenu } = this.options;

    this.container.innerHTML = columns.map(col => {
      const cardCount = col.cards?.length || 0;
      const isOverWip = col.wipLimit && cardCount > col.wipLimit;
      return `
      <div class="kanban__column ${isOverWip ? 'kanban__column--over-wip' : ''}" data-column-id="${Security.escape(col.id)}">
        <div class="kanban__column-header">
          <div class="kanban__column-title-group">
            ${col.color ? `<span class="kanban__column-dot" style="background: ${Security.sanitizeCSS(col.color)};"></span>` : ''}
            <h3 class="kanban__column-title">${Security.escape(col.title)}</h3>
            <span class="kanban__column-count">${cardCount}${col.wipLimit ? `/${col.wipLimit}` : ''}</span>
          </div>
          ${showColumnMenu ? `
            <button class="kanban__column-menu-btn" data-column-id="${Security.escape(col.id)}">
              <i class="material-icons-outlined">more_horiz</i>
            </button>
          ` : ''}
        </div>
        <div class="kanban__cards" data-column-id="${Security.escape(col.id)}">
          ${(col.cards || []).map(card => this._renderCard(card)).join('')}
        </div>
        ${allowAddCard ? `
          <button class="kanban__add-card" data-column-id="${Security.escape(col.id)}">
            <i class="material-icons-outlined">add</i>
            카드 추가
          </button>
        ` : ''}
      </div>`;
    }).join('');
  }

  _renderCard(card) {
    const priorityColor = Kanban.PRIORITY_COLORS[card.priority] || '';
    const priorityLabel = Kanban.PRIORITY_LABELS[card.priority] || '';

    return `
      <div class="kanban__card ${card.checked ? 'kanban__card--done' : ''}" draggable="true" data-card-id="${Security.escape(card.id)}">
        <div class="kanban__card-header">
          ${card.priority ? `<span class="kanban__priority" style="background: ${Security.sanitizeCSS(priorityColor)};">${Security.escape(priorityLabel)}</span>` : ''}
          <button class="kanban__card-delete" data-card-id="${Security.escape(card.id)}">
            <i class="material-icons-outlined">close</i>
          </button>
        </div>
        <div class="kanban__card-body">
          ${card.checked !== undefined ? `
            <label class="kanban__card-check">
              <input type="checkbox" ${card.checked ? 'checked' : ''} data-card-id="${Security.escape(card.id)}">
            </label>
          ` : ''}
          <div class="kanban__card-content">
            <div class="kanban__card-title">${Security.escape(card.title)}</div>
            ${card.description ? `<div class="kanban__card-desc">${Security.escape(card.description)}</div>` : ''}
          </div>
        </div>
        ${card.tags?.length ? `
          <div class="kanban__card-tags">
            ${card.tags.map(tag => `<span class="kanban__tag" style="background: ${Security.sanitizeCSS(tag.color || '#667eea')};">${Security.escape(tag.text)}</span>`).join('')}
          </div>
        ` : ''}
        ${card.date || card.assignees?.length ? `
          <div class="kanban__card-footer">
            ${card.date ? `
              <span class="kanban__card-date">
                <i class="material-icons-outlined">event</i>
                ${Security.escape(card.date)}
              </span>
            ` : ''}
            ${card.assignees?.length ? `
              <div class="kanban__card-assignees">
                ${card.assignees.slice(0, 3).map(a =>
    a.avatar
      ? `<img class="kanban__avatar" src="${Security.escape(a.avatar)}" alt="${Security.escape(a.name || '')}" title="${Security.escape(a.name || '')}">`
      : `<span class="kanban__avatar kanban__avatar--initial" title="${Security.escape(a.name || '')}">${(a.name || '?')[0]}</span>`
  ).join('')}
                ${card.assignees.length > 3 ? `<span class="kanban__avatar kanban__avatar--more">+${card.assignees.length - 3}</span>` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  _bindEvents() {
    this._onDragstart = (e) => {
      const card = e.target.closest('.kanban__card');
      if (card) {
        this.draggedCard = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    };

    this._onDragend = () => {
      if (this.draggedCard) {
        this.draggedCard.classList.remove('dragging');
        this.draggedCard = null;
      }
      this.container.querySelectorAll('.kanban__cards').forEach(c => c.classList.remove('drag-over'));
    };

    this._onDragover = (e) => {
      e.preventDefault();
      const cardsContainer = e.target.closest('.kanban__cards');
      if (cardsContainer) cardsContainer.classList.add('drag-over');
    };

    this._onDragleave = (e) => {
      const cardsContainer = e.target.closest('.kanban__cards');
      if (cardsContainer && !cardsContainer.contains(e.relatedTarget)) {
        cardsContainer.classList.remove('drag-over');
      }
    };

    this._onDrop = (e) => {
      e.preventDefault();
      const cardsContainer = e.target.closest('.kanban__cards');
      if (cardsContainer && this.draggedCard) {
        const cardId = this.draggedCard.dataset.cardId;
        const fromColumnId = this.draggedCard.closest('.kanban__column').dataset.columnId;
        const toColumnId = cardsContainer.dataset.columnId;

        // WIP 제한 체크
        const toCol = this.options.columns.find(c => c.id === toColumnId);
        if (toCol?.wipLimit) {
          const currentCount = cardsContainer.querySelectorAll('.kanban__card').length;
          if (fromColumnId !== toColumnId && currentCount >= toCol.wipLimit) return;
        }

        cardsContainer.appendChild(this.draggedCard);
        cardsContainer.classList.remove('drag-over');
        this._syncData(cardId, fromColumnId, toColumnId);
        this._updateCounts();

        if (this.options.onMove) this.options.onMove(cardId, fromColumnId, toColumnId);
      }
    };

    this._onClick = (e) => {
      // 카드 삭제
      const deleteBtn = e.target.closest('.kanban__card-delete');
      if (deleteBtn) {
        e.stopPropagation();
        const cardId = deleteBtn.dataset.cardId;
        this.removeCard(cardId);
        if (this.options.onCardDelete) this.options.onCardDelete(cardId);
        return;
      }

      // 카드 클릭
      const card = e.target.closest('.kanban__card');
      if (card && this.options.onCardClick && !e.target.closest('input[type="checkbox"]') && !e.target.closest('.kanban__card-delete')) {
        this.options.onCardClick(card.dataset.cardId);
        return;
      }

      // 카드 추가
      const addBtn = e.target.closest('.kanban__add-card');
      if (addBtn) {
        const columnId = addBtn.dataset.columnId;
        if (this.options.onCardAdd) {
          this.options.onCardAdd(columnId);
        } else {
          this._showAddCardDialog(columnId);
        }
      }
    };

    // 체크박스 토글
    this._onChange = (e) => {
      if (e.target.type === 'checkbox' && e.target.dataset.cardId) {
        const cardEl = e.target.closest('.kanban__card');
        if (cardEl) {
          cardEl.classList.toggle('kanban__card--done', e.target.checked);
          // 데이터 동기화
          for (const col of this.options.columns) {
            const card = col.cards?.find(c => c.id === e.target.dataset.cardId);
            if (card) { card.checked = e.target.checked; break; }
          }
        }
      }
    };

    this.container.addEventListener('dragstart', this._onDragstart);
    this.container.addEventListener('dragend', this._onDragend);
    this.container.addEventListener('dragover', this._onDragover);
    this.container.addEventListener('dragleave', this._onDragleave);
    this.container.addEventListener('drop', this._onDrop);
    this.container.addEventListener('click', this._onClick);
    this.container.addEventListener('change', this._onChange);
  }

  /** 드래그 후 내부 데이터 동기화 */
  _syncData(cardId, fromColumnId, toColumnId) {
    if (fromColumnId === toColumnId) return;
    const fromCol = this.options.columns.find(c => c.id === fromColumnId);
    const toCol = this.options.columns.find(c => c.id === toColumnId);
    if (!fromCol || !toCol) return;
    const cardIdx = fromCol.cards?.findIndex(c => c.id === cardId);
    if (cardIdx === undefined || cardIdx < 0) return;
    const [card] = fromCol.cards.splice(cardIdx, 1);
    toCol.cards = toCol.cards || [];
    toCol.cards.push(card);
  }

  _updateCounts() {
    this.container.querySelectorAll('.kanban__column').forEach(col => {
      const colId = col.dataset.columnId;
      const colData = this.options.columns.find(c => c.id === colId);
      const count = col.querySelectorAll('.kanban__card').length;
      const countEl = col.querySelector('.kanban__column-count');
      if (countEl) countEl.textContent = colData?.wipLimit ? `${count}/${colData.wipLimit}` : count;
      col.classList.toggle('kanban__column--over-wip', !!(colData?.wipLimit && count > colData.wipLimit));
    });
  }

  _showAddCardDialog(columnId) {
    const title = prompt('카드 제목:');
    if (title) {
      this.addCard(columnId, { id: Date.now().toString(), title });
    }
  }

  addCard(columnId, card) {
    const column = this.options.columns.find(c => c.id === columnId);
    if (column) {
      column.cards = column.cards || [];
      column.cards.push(card);
      const escapedId = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(columnId) : columnId.replace(/(["\\])/g, '\\$1');
      const cardsContainer = this.container.querySelector(`.kanban__cards[data-column-id="${escapedId}"]`);
      if (cardsContainer) cardsContainer.insertAdjacentHTML('beforeend', this._renderCard(card));
      this._updateCounts();
    }
  }

  removeCard(cardId) {
    const escapedId = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(cardId) : cardId.replace(/(["\\])/g, '\\$1');
    const card = this.container.querySelector(`.kanban__card[data-card-id="${escapedId}"]`);
    if (card) {
      const colId = card.closest('.kanban__column')?.dataset.columnId;
      card.remove();
      // 데이터에서도 제거
      const col = this.options.columns.find(c => c.id === colId);
      if (col?.cards) col.cards = col.cards.filter(c => c.id !== cardId);
      this._updateCounts();
    }
  }

  destroy() {
    if (this._onDragstart) this.container.removeEventListener('dragstart', this._onDragstart);
    if (this._onDragend) this.container.removeEventListener('dragend', this._onDragend);
    if (this._onDragover) this.container.removeEventListener('dragover', this._onDragover);
    if (this._onDragleave) this.container.removeEventListener('dragleave', this._onDragleave);
    if (this._onDrop) this.container.removeEventListener('drop', this._onDrop);
    if (this._onClick) this.container.removeEventListener('click', this._onClick);
    if (this._onChange) this.container.removeEventListener('change', this._onChange);
    this.container.innerHTML = '';
    this.container.classList.remove('kanban');
    this.container = null;
    this.draggedCard = null;
  }
}

export { Kanban };
export default Kanban;
