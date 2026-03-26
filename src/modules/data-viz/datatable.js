/**
 * DataTable 컴포넌트
 * @module modules/data-viz/datatable
 * @description 정렬, 검색, 필터, 페이지네이션, 행 선택, CSV 내보내기 지원
 */

import { Security } from '../../core/security.js';

class DataTable {
  static defaults() {
    return {
      data: [],
      columns: [],
      sortable: true,
      searchable: true,
      searchPlaceholder: '검색...',
      paginate: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50],
      striped: false,
      bordered: false,
      compact: false,
      responsive: false,
      // Empty State 옵션
      emptyIcon: 'inbox',
      emptyTitle: '데이터가 없습니다',
      emptyDescription: '표시할 데이터가 없습니다.',
      showInfo: true,
      selectable: false,
      toolbar: null, // { buttons: [{ text, icon, class, onClick }] }
      exportable: false,
      onRowClick: null,
      onSort: null,
      onFilter: null,
      onSelect: null,
      onSearch: null
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...DataTable.defaults(), ...options };
    this.data = [...this.options.data];
    this.filteredData = [...this.data];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.searchTerm = '';
    this.selectedRows = new Set();

    this._init();
  }

  _init() {
    this.container.classList.add('datatable');
    if (this.options.striped) this.container.classList.add('datatable--striped');
    if (this.options.bordered) this.container.classList.add('datatable--bordered');
    if (this.options.compact) this.container.classList.add('datatable--compact');
    if (this.options.responsive) this.container.classList.add('datatable--responsive');
    this._render();
    this._bindEvents();
  }

  _render() {
    const { columns, paginate, pageSize, showInfo, toolbar, searchable, exportable, pageSizeOptions } = this.options;

    // 페이지네이션 계산
    const totalPages = Math.ceil(this.filteredData.length / pageSize);
    if (this.currentPage > totalPages && totalPages > 0) this.currentPage = totalPages;
    const start = (this.currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = paginate ? this.filteredData.slice(start, end) : this.filteredData;
    const totalCols = columns.length + (this.options.selectable ? 1 : 0);

    this.container.innerHTML = `
      <div class="datatable__header">
        ${searchable ? `
          <div class="datatable__search">
            <i class="material-icons-outlined">search</i>
            <input type="text" placeholder="${Security.escape(this.options.searchPlaceholder)}" value="${Security.escape(this.searchTerm)}">
          </div>
        ` : '<div></div>'}
        <div class="datatable__actions">
          ${toolbar?.buttons?.length ? toolbar.buttons.map((btn, idx) => `
            <button class="datatable__action-btn ${btn.class || ''}" data-action-idx="${idx}">
              ${btn.icon ? `<i class="material-icons-outlined">${Security.escape(btn.icon)}</i>` : ''}
              ${btn.text ? `<span>${Security.escape(btn.text)}</span>` : ''}
            </button>
          `).join('') : ''}
          ${exportable ? `
            <button class="datatable__action-btn" data-action="export" title="CSV 내보내기">
              <i class="material-icons-outlined">download</i>
            </button>
          ` : ''}
        </div>
      </div>
      <div class="datatable__container">
        <table class="datatable__table">
          <thead class="datatable__thead">
            <tr>
              ${this.options.selectable ? `
                <th class="datatable__checkbox">
                  <input type="checkbox" class="datatable__select-all" ${this._isAllSelected(pageData, start) ? 'checked' : ''}>
                </th>
              ` : ''}
              ${columns.map(col => `
                <th class="${this.options.sortable && col.sortable !== false ? 'is-sortable' : ''} ${this.sortColumn === col.field ? 'is-sorted' : ''}"
                    data-field="${Security.escape(col.field)}"
                    style="${col.width ? `width: ${Security.sanitizeCSS(col.width)}` : ''}${col.align ? `;text-align: ${Security.sanitizeCSS(col.align)}` : ''}">
                  <span>${Security.escape(col.title)}</span>
                  ${this.options.sortable && col.sortable !== false ? `
                    <span class="datatable__sort">
                      <i class="material-icons-outlined ${this.sortColumn === col.field && this.sortDirection === 'asc' ? 'is-active' : ''}">arrow_upward</i>
                      <i class="material-icons-outlined ${this.sortColumn === col.field && this.sortDirection === 'desc' ? 'is-active' : ''}">arrow_downward</i>
                    </span>
                  ` : ''}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody class="datatable__tbody">
            ${pageData.length > 0 ? pageData.map((row, idx) => {
    const globalIdx = start + idx;
    return `
              <tr class="${this.selectedRows.has(globalIdx) ? 'is-selected' : ''}" data-index="${globalIdx}">
                ${this.options.selectable ? `
                  <td class="datatable__checkbox">
                    <input type="checkbox" class="datatable__row-select" ${this.selectedRows.has(globalIdx) ? 'checked' : ''}>
                  </td>
                ` : ''}
                ${columns.map(col => `
                  <td data-label="${Security.escape(col.title)}" style="${col.align ? `text-align: ${Security.sanitizeCSS(col.align)}` : ''}">${col.render ? col.render(row[col.field], row, globalIdx) : Security.escape(String(row[col.field] ?? ''))}</td>
                `).join('')}
              </tr>`;
  }).join('') : `
            <tr>
              <td colspan="${totalCols}">
                <div class="datatable__empty">
                  <i class="material-icons-outlined">${this.options.emptyIcon}</i>
                  <div class="datatable__empty-text">${Security.escape(this.options.emptyTitle)}</div>
                </div>
              </td>
            </tr>
          `}
          </tbody>
        </table>
      </div>
      ${paginate && (this.filteredData.length > 0) ? `
        <div class="datatable__footer">
          <div class="datatable__per-page">
            <label>표시</label>
            <select>
              ${pageSizeOptions.map(s => `<option value="${s}" ${s === pageSize ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <label>개</label>
          </div>
          ${showInfo ? `
            <div class="datatable__info">
              ${this.filteredData.length > 0 ? `${start + 1}-${Math.min(end, this.filteredData.length)} / 총 ${this.filteredData.length}개` : '0개'}
              ${this.searchTerm ? ` (전체 ${this.data.length}개)` : ''}
            </div>
          ` : ''}
          ${totalPages > 1 ? `
            <div class="datatable__pagination">
              <button class="datatable__page-btn" data-page="first" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="material-icons-outlined">first_page</i>
              </button>
              <button class="datatable__page-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="material-icons-outlined">chevron_left</i>
              </button>
              ${this._renderPageNumbers(totalPages)}
              <button class="datatable__page-btn" data-page="next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="material-icons-outlined">chevron_right</i>
              </button>
              <button class="datatable__page-btn" data-page="last" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="material-icons-outlined">last_page</i>
              </button>
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  /** 페이지 번호 버튼 렌더링 */
  _renderPageNumbers(totalPages) {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(`<button class="datatable__page-btn ${i === this.currentPage ? 'is-active' : ''}" data-page="${i}">${i}</button>`);
    }
    return pages.join('');
  }

  _bindEvents() {
    this._onClick = (e) => {
      // 툴바 버튼 클릭
      const actionBtn = e.target.closest('.datatable__action-btn');
      if (actionBtn) {
        if (actionBtn.dataset.action === 'export') {
          this.exportCSV();
          return;
        }
        const idx = parseInt(actionBtn.dataset.actionIdx);
        const btn = this.options.toolbar?.buttons?.[idx];
        if (btn?.onClick) btn.onClick(e);
        return;
      }

      // 정렬
      const th = e.target.closest('.is-sortable');
      if (th) {
        const field = th.dataset.field;
        if (this.sortColumn === field) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = field;
          this.sortDirection = 'asc';
        }
        this._applySort();
        return;
      }

      // 행 클릭 (체크박스 제외)
      const row = e.target.closest('.datatable__tbody tr[data-index]');
      if (row && this.options.onRowClick && !e.target.closest('.datatable__checkbox')) {
        const index = parseInt(row.dataset.index);
        this.options.onRowClick(this.filteredData[index], index);
      }

      // 페이지네이션
      const pageBtn = e.target.closest('.datatable__page-btn');
      if (pageBtn && !pageBtn.disabled) {
        const action = pageBtn.dataset.page;
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        if (action === 'first') this.currentPage = 1;
        else if (action === 'prev') this.currentPage--;
        else if (action === 'next') this.currentPage++;
        else if (action === 'last') this.currentPage = totalPages;
        else this.currentPage = parseInt(action);
        this._render();
        this._rebindInputEvents();
      }
    };

    this._onChange = (e) => {
      // 전체 선택
      if (e.target.classList.contains('datatable__select-all')) {
        const checked = e.target.checked;
        const rows = this.container.querySelectorAll('.datatable__tbody tr[data-index]');
        rows.forEach(row => {
          const idx = parseInt(row.dataset.index);
          if (checked) { this.selectedRows.add(idx); row.classList.add('is-selected'); }
          else { this.selectedRows.delete(idx); row.classList.remove('is-selected'); }
          const cb = row.querySelector('.datatable__row-select');
          if (cb) cb.checked = checked;
        });
        this._triggerSelectCallback();
        return;
      }

      // 개별 선택
      if (e.target.classList.contains('datatable__row-select')) {
        const row = e.target.closest('tr[data-index]');
        const idx = parseInt(row.dataset.index);
        if (e.target.checked) { this.selectedRows.add(idx); row.classList.add('is-selected'); }
        else { this.selectedRows.delete(idx); row.classList.remove('is-selected'); }
        const selectAll = this.container.querySelector('.datatable__select-all');
        const allCb = this.container.querySelectorAll('.datatable__row-select');
        const checkedCount = this.container.querySelectorAll('.datatable__row-select:checked').length;
        if (selectAll) {
          selectAll.checked = checkedCount === allCb.length;
          selectAll.indeterminate = checkedCount > 0 && checkedCount < allCb.length;
        }
        this._triggerSelectCallback();
        return;
      }

      // 페이지 사이즈 변경
      if (e.target.closest('.datatable__per-page select')) {
        this.options.pageSize = parseInt(e.target.value);
        this.currentPage = 1;
        this._render();
        this._rebindInputEvents();
      }
    };

    this.container.addEventListener('click', this._onClick);
    this.container.addEventListener('change', this._onChange);
    this._rebindInputEvents();
  }

  /** 검색 input 이벤트 바인딩 (렌더 후 재바인딩 필요) */
  _rebindInputEvents() {
    const searchInput = this.container.querySelector('.datatable__search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this._applySearch();
      });
    }
  }

  _applySearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(row =>
        this.options.columns.some(col => {
          const val = row[col.field];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
        })
      );
    }
    if (this.options.onSearch) this.options.onSearch(term, this.filteredData);
    this.currentPage = 1;
    if (this.sortColumn) this._applySortSilent();
    this._render();
    this._rebindInputEvents();
    // 검색어 복원
    const input = this.container.querySelector('.datatable__search input');
    if (input) { input.value = this.searchTerm; input.focus(); }
  }

  _isAllSelected(pageData, start) {
    if (!pageData.length) return false;
    return pageData.every((_, idx) => this.selectedRows.has(start + idx));
  }

  _triggerSelectCallback() {
    if (this.options.onSelect) {
      const selectedData = Array.from(this.selectedRows).map(idx => this.filteredData[idx]).filter(Boolean);
      this.options.onSelect(selectedData, Array.from(this.selectedRows));
    }
  }

  /** 정렬 적용 (렌더링 포함) */
  _applySort() {
    this._applySortSilent();
    if (this.options.onSort) this.options.onSort(this.sortColumn, this.sortDirection);
    this._render();
    this._rebindInputEvents();
  }

  /** 정렬만 적용 (렌더링 없이) */
  _applySortSilent() {
    if (!this.sortColumn) return;
    const dir = this.sortDirection === 'desc' ? -1 : 1;
    this.filteredData.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      if ((valA === null || valA === undefined) && (valB === null || valB === undefined)) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * dir;
      return String(valA).localeCompare(String(valB), 'ko') * dir;
    });
  }

  /** CSV 내보내기 */
  exportCSV(filename = 'data.csv') {
    const { columns } = this.options;
    const header = columns.map(c => `"${c.title}"`).join(',');
    const rows = this.filteredData.map(row =>
      columns.map(c => `"${String(row[c.field] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  setData(data) {
    this.data = [...data];
    this.filteredData = [...data];
    this.currentPage = 1;
    this.searchTerm = '';
    this.selectedRows.clear();
    if (this.sortColumn) this._applySortSilent();
    this._render();
    this._rebindInputEvents();
  }

  refresh() { this._render(); this._rebindInputEvents(); }

  search(term) {
    this.searchTerm = term;
    this._applySearch();
  }

  getSelectedRows() { return Array.from(this.selectedRows).map(idx => this.filteredData[idx]).filter(Boolean); }
  getSelectedIndices() { return Array.from(this.selectedRows); }

  clearSelection() { this.selectedRows.clear(); this._render(); this._rebindInputEvents(); }

  selectRow(index) { this.selectedRows.add(index); this._render(); this._rebindInputEvents(); }
  deselectRow(index) { this.selectedRows.delete(index); this._render(); this._rebindInputEvents(); }
  selectAll() { this.filteredData.forEach((_, idx) => this.selectedRows.add(idx)); this._render(); this._rebindInputEvents(); }

  addRow(row) {
    this.data.push(row);
    this.filteredData.push(row);
    this._render();
    this._rebindInputEvents();
  }

  updateRow(index, row) {
    if (this.filteredData[index]) {
      this.filteredData[index] = { ...this.filteredData[index], ...row };
      const dataIdx = this.data.findIndex(d => d === this.filteredData[index]);
      if (dataIdx !== -1) this.data[dataIdx] = this.filteredData[index];
      this._render();
      this._rebindInputEvents();
    }
  }

  deleteRow(index) {
    const item = this.filteredData[index];
    this.filteredData.splice(index, 1);
    const dataIdx = this.data.indexOf(item);
    if (dataIdx !== -1) this.data.splice(dataIdx, 1);
    this.selectedRows.delete(index);
    const newSelected = new Set();
    this.selectedRows.forEach(idx => { newSelected.add(idx > index ? idx - 1 : idx); });
    this.selectedRows = newSelected;
    this._render();
    this._rebindInputEvents();
  }

  deleteSelectedRows() {
    const indices = Array.from(this.selectedRows).sort((a, b) => b - a);
    indices.forEach(idx => {
      const item = this.filteredData[idx];
      this.filteredData.splice(idx, 1);
      const dataIdx = this.data.indexOf(item);
      if (dataIdx !== -1) this.data.splice(dataIdx, 1);
    });
    this.selectedRows.clear();
    this._render();
    this._rebindInputEvents();
  }

  destroy() {
    if (this._onClick) this.container.removeEventListener('click', this._onClick);
    if (this._onChange) this.container.removeEventListener('change', this._onChange);
    this.container.innerHTML = '';
    this.container.className = '';
    this.container = null;
    this.data = [];
    this.filteredData = [];
    this.selectedRows = null;
  }
}

export { DataTable };
export default DataTable;
