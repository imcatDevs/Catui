/**
 * Data Visualization Module
 * @module modules/data-viz
 * @description 데이터 시각화 컴포넌트 모듈
 */

import { Security } from '../core/security.js';

/**
 * @continued
 * - DataTable: 데이터 테이블 (정렬, 필터, 검색, 페이지네이션)
 * - Chart: 간단한 차트 (bar, line, pie, doughnut, area, horizontalBar)
 * - Masonry: 타일 레이아웃 (필터, 애니메이션)
 * - Kanban: 칸반 보드 (드래그 앤 드롭, 우선순위, 담당자)
 * - Calendar: 캘린더 (월/주간 뷰, 이벤트 카테고리)
 */

// ============================================
// DataTable - 데이터 테이블
// ============================================

/**
 * 데이터 테이블 컴포넌트
 * @class DataTable
 * @description 정렬, 검색, 필터, 페이지네이션, 행 선택, CSV 내보내기 지원
 */
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

// ============================================
// Chart - 차트
// ============================================

/**
 * 차트 컴포넌트
 * @class Chart
 * @description bar, horizontalBar, line, area, pie, doughnut 지원. 툴팁, 그리드, 레전드 포함.
 */
class Chart {
  static defaults() {
    return {
      type: 'bar', // 'bar', 'horizontalBar', 'line', 'area', 'pie', 'doughnut'
      data: { labels: [], datasets: [] },
      colors: ['#667eea', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'],
      height: 300,
      showLegend: true,
      showValues: false,
      showGrid: true,
      showTooltip: true,
      gridLines: 5,
      animate: true,
      barRadius: 4
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Chart.defaults(), ...options };
    this._tooltipEl = null;
    this._init();
  }

  _init() {
    this.container.classList.add('chart-wrapper');
    this._render();
    this._bindTooltip();
  }

  _render() {
    const { type, data, showLegend } = this.options;
    this.container.innerHTML = '';

    if (type === 'bar' || type === 'horizontalBar') this._renderBar();
    else if (type === 'line' || type === 'area') this._renderLine();
    else if (type === 'pie' || type === 'doughnut') this._renderPie();

    if (showLegend && data.datasets.length > 0) this._renderLegend();
  }

  _renderBar() {
    const { type, data, colors, height, showValues, showGrid, gridLines, animate, barRadius } = this.options;
    const { labels, datasets } = data;
    const isHorizontal = type === 'horizontalBar';
    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues, 0);
    const chartHeight = height - 40;

    // 그리드 라인
    let gridHtml = '';
    if (showGrid) {
      for (let i = 0; i <= gridLines; i++) {
        const val = Math.round((maxValue / gridLines) * (gridLines - i));
        const pos = (i / gridLines) * 100;
        gridHtml += isHorizontal
          ? `<div class="chart__grid-line chart__grid-line--vertical" style="left: ${100 - pos}%;">
              <span class="chart__grid-value">${val}</span>
            </div>`
          : `<div class="chart__grid-line" style="top: ${pos}%;">
              <span class="chart__grid-value">${val}</span>
            </div>`;
      }
    }

    let barsHtml = '';
    const gap = 8;
    const groupCount = labels.length;
    const dsCount = datasets.length;

    if (isHorizontal) {
      // 수평 바 차트
      labels.forEach((label, i) => {
        datasets.forEach((dataset, j) => {
          const value = dataset.data[i] || 0;
          const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const color = dataset.color || colors[j % colors.length];
          const top = i * (dsCount * 24 + gap) + j * 24;
          barsHtml += `
            <div class="chart__hbar ${animate ? 'animate' : ''}"
                 style="top: ${top}px; width: ${barWidth}%; background: ${Security.sanitizeCSS(color)}; border-radius: 0 ${barRadius}px ${barRadius}px 0;"
                 data-value="${value}" data-label="${Security.escape(label)}" data-dataset="${Security.escape(dataset.label || '')}">
              ${showValues ? `<span class="chart__hbar-value">${value}</span>` : ''}
            </div>`;
        });
      });
      const totalH = groupCount * (dsCount * 24 + gap);
      this.container.innerHTML = `
        <div class="chart chart--horizontal-bar" style="height: ${Math.max(height, totalH + 40)}px;">
          <div class="chart__y-labels">
            ${labels.map((l, i) => `<span class="chart__y-label" style="top: ${i * (dsCount * 24 + gap) + (dsCount * 12)}px;">${Security.escape(l)}</span>`).join('')}
          </div>
          <div class="chart__area chart__area--horizontal" style="height: ${totalH}px;">
            ${gridHtml}${barsHtml}
          </div>
        </div>`;
    } else {
      // 수직 바 차트
      const slotWidth = 100 / groupCount;
      const barW = Math.min(slotWidth / (dsCount + 1), 12);

      labels.forEach((label, i) => {
        datasets.forEach((dataset, j) => {
          const value = dataset.data[i] || 0;
          const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
          const color = dataset.color || colors[j % colors.length];
          const cx = slotWidth * i + slotWidth / 2;
          const offset = (j - (dsCount - 1) / 2) * (barW + 2);
          barsHtml += `
            <div class="chart__bar ${animate ? 'animate' : ''}"
                 style="left: calc(${cx}% + ${offset}px - ${barW / 2}px); width: ${barW}px; height: ${barHeight}px; background: ${Security.sanitizeCSS(color)}; border-radius: ${barRadius}px ${barRadius}px 0 0;"
                 data-value="${value}" data-label="${Security.escape(label)}" data-dataset="${Security.escape(dataset.label || '')}">
              ${showValues ? `<span class="chart__bar-value">${value}</span>` : ''}
            </div>`;
        });
      });

      const labelsHtml = labels.map((label, i) =>
        `<span class="chart__label" style="left: ${slotWidth * i + slotWidth / 2}%;">${Security.escape(label)}</span>`
      ).join('');

      this.container.innerHTML = `
        <div class="chart chart--bar" style="height: ${height}px;">
          <div class="chart__area" style="height: ${chartHeight}px;">
            ${gridHtml}${barsHtml}
          </div>
          <div class="chart__labels">${labelsHtml}</div>
        </div>`;
    }
  }

  _renderLine() {
    const { type, data, colors, height, showGrid, gridLines, animate } = this.options;
    const { labels, datasets } = data;
    const isArea = type === 'area';
    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues, 0);
    const chartHeight = height - 40;

    let gridHtml = '';
    if (showGrid) {
      for (let i = 0; i <= gridLines; i++) {
        const val = Math.round((maxValue / gridLines) * (gridLines - i));
        const pos = (i / gridLines) * 100;
        gridHtml += `<div class="chart__grid-line" style="top: ${pos}%;"><span class="chart__grid-value">${val}</span></div>`;
      }
    }

    let svgContent = '';
    datasets.forEach((dataset, j) => {
      const color = dataset.color || colors[j % colors.length];
      const pts = dataset.data.map((value, i) => {
        const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
        const y = maxValue > 0 ? chartHeight - (value / maxValue) * chartHeight : chartHeight;
        return { x, y };
      });
      const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

      if (isArea) {
        const areaPath = `${pts.map(p => `${p.x},${p.y}`).join(' ')} ${pts[pts.length - 1].x},${chartHeight} ${pts[0].x},${chartHeight}`;
        svgContent += `<polygon class="chart__area-fill ${animate ? 'animate' : ''}" points="${areaPath}" fill="${color}" opacity="0.15"/>`;
      }
      svgContent += `<polyline class="chart__line ${animate ? 'animate' : ''}" points="${pointsStr}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    });

    // 포인트 (HTML)
    let pointsHtml = '';
    datasets.forEach((dataset, j) => {
      const color = dataset.color || colors[j % colors.length];
      dataset.data.forEach((value, i) => {
        const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
        const y = maxValue > 0 ? chartHeight - (value / maxValue) * chartHeight : chartHeight;
        pointsHtml += `<div class="chart__point" style="left: ${x}%; top: ${y}px; background: ${Security.sanitizeCSS(color)};" data-value="${value}" data-label="${Security.escape(labels[i])}" data-dataset="${Security.escape(dataset.label || '')}"></div>`;
      });
    });

    const labelsHtml = labels.map((label, i) => {
      const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
      return `<span class="chart__label" style="left: ${x}%;">${Security.escape(label)}</span>`;
    }).join('');

    this.container.innerHTML = `
      <div class="chart chart--${type}" style="height: ${height}px;">
        <div class="chart__area" style="height: ${chartHeight}px;">
          ${gridHtml}
          <svg class="chart__line-svg" viewBox="0 0 100 ${chartHeight}" preserveAspectRatio="none">${svgContent}</svg>
          ${pointsHtml}
        </div>
        <div class="chart__labels">${labelsHtml}</div>
      </div>`;
  }

  _renderPie() {
    const { type, data, colors, height, showValues } = this.options;
    const { labels, datasets } = data;
    const values = datasets[0]?.data || [];
    const total = values.reduce((a, b) => a + b, 0);

    let currentAngle = 0;
    const segments = values.map((value, i) => {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = total > 0 ? (value / total) * 360 : 0;
      const startAngle = currentAngle;
      currentAngle += angle;
      return { value, percentage, startAngle, angle, color: colors[i % colors.length], label: labels[i] };
    });

    const size = height - 20;
    const center = size / 2;
    const radius = center - 10;
    const innerRadius = type === 'doughnut' ? radius * 0.6 : 0;

    const pathsHtml = segments.map(seg => {
      if (seg.angle === 0) return '';
      const startRad = (seg.startAngle - 90) * Math.PI / 180;
      const endRad = (seg.startAngle + seg.angle - 90) * Math.PI / 180;
      const largeArc = seg.angle > 180 ? 1 : 0;
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      let d;
      if (innerRadius > 0) {
        const ix1 = center + innerRadius * Math.cos(startRad);
        const iy1 = center + innerRadius * Math.sin(startRad);
        const ix2 = center + innerRadius * Math.cos(endRad);
        const iy2 = center + innerRadius * Math.sin(endRad);
        d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      } else {
        d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }
      return `<path class="chart__pie-segment" d="${d}" fill="${seg.color}" data-value="${seg.value}" data-label="${Security.escape(seg.label)}" data-percent="${seg.percentage.toFixed(1)}"/>`;
    }).join('');

    this.container.innerHTML = `
      <div class="chart chart--${type}" style="height: ${height}px;">
        <svg class="chart__pie-svg" viewBox="0 0 ${size} ${size}" style="width: ${size}px; height: ${size}px;">
          ${pathsHtml}
        </svg>
        ${type === 'doughnut' && showValues ? `
          <div class="chart__doughnut-center">
            <div class="chart__doughnut-total">${total}</div>
            <div class="chart__doughnut-label">Total</div>
          </div>
        ` : ''}
      </div>`;
  }

  _renderLegend() {
    const { colors, data } = this.options;
    const { labels, datasets } = data;
    const items = this.options.type === 'pie' || this.options.type === 'doughnut'
      ? labels.map((label, i) => ({ label, color: colors[i % colors.length] }))
      : datasets.map((d, i) => ({ label: d.label || `Dataset ${i + 1}`, color: d.color || colors[i % colors.length] }));

    this.container.insertAdjacentHTML('beforeend', `
      <div class="chart__legend">
        ${items.map(item => `
          <div class="chart__legend-item">
            <span class="chart__legend-color" style="background: ${Security.sanitizeCSS(item.color)};"></span>
            <span class="chart__legend-label">${Security.escape(item.label)}</span>
          </div>
        `).join('')}
      </div>
    `);
  }

  /** 툴팁 이벤트 바인딩 */
  _bindTooltip() {
    if (!this.options.showTooltip) return;

    this._tooltipEl = document.createElement('div');
    this._tooltipEl.className = 'chart__tooltip';
    this._tooltipEl.style.display = 'none';
    document.body.appendChild(this._tooltipEl);

    this._onMouseOver = (e) => {
      const target = e.target.closest('[data-value]');
      if (!target) return;
      const value = target.dataset.value;
      const label = target.dataset.label || '';
      const dataset = target.dataset.dataset || '';
      const percent = target.dataset.percent ? ` (${target.dataset.percent}%)` : '';
      this._tooltipEl.innerHTML = `${label ? `<strong>${Security.escape(label)}</strong><br>` : ''}${dataset ? `${Security.escape(dataset)}: ` : ''}${Security.escape(value)}${percent}`;
      this._tooltipEl.style.display = 'block';
    };

    this._onMouseMove = (e) => {
      if (this._tooltipEl.style.display === 'block') {
        this._tooltipEl.style.left = `${e.pageX + 12}px`;
        this._tooltipEl.style.top = `${e.pageY - 8}px`;
      }
    };

    this._onMouseOut = (e) => {
      if (!e.target.closest('[data-value]')) {
        this._tooltipEl.style.display = 'none';
      }
    };

    this.container.addEventListener('mouseover', this._onMouseOver);
    this.container.addEventListener('mousemove', this._onMouseMove);
    this.container.addEventListener('mouseout', this._onMouseOut);
  }

  update(data) {
    this.options.data = data;
    this._render();
  }

  destroy() {
    if (this._tooltipEl) { this._tooltipEl.remove(); this._tooltipEl = null; }
    if (this._onMouseOver) this.container.removeEventListener('mouseover', this._onMouseOver);
    if (this._onMouseMove) this.container.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseOut) this.container.removeEventListener('mouseout', this._onMouseOut);
    this.container.innerHTML = '';
    this.container.classList.remove('chart-wrapper');
  }
}

// ============================================
// Masonry - 타일 레이아웃
// ============================================

/**
 * 메이슨리 레이아웃 컴포넌트
 * @class Masonry
 * @description CSS Grid 기반 타일 레이아웃. 필터, 애니메이션 지원.
 */
class Masonry {
  static defaults() {
    return {
      columnWidth: 300,
      gap: 16,
      items: [],
      render: null, // (item) => HTML string
      filterKey: null, // 필터 기준 키 (item[filterKey])
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

// ============================================
// Kanban - 칸반 보드
// ============================================

/**
 * 칸반 보드 컴포넌트
 * @class Kanban
 * @description 드래그 앤 드롭, 우선순위 배지, 담당자 아바타, 날짜, WIP 제한 지원 (ubold 패턴 참조)
 */
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
      columns: [], // { id, title, color, wipLimit, cards: [{ id, title, description, priority, date, assignees, tags, checked }] }
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

// ============================================
// Calendar - 캘린더
// ============================================

/**
 * 캘린더 컴포넌트
 * @class Calendar
 * @description 월/주간 뷰, today 버튼, 이벤트 카테고리, 이벤트 드래그 이동 지원
 */
class Calendar {
  /** 이벤트 카테고리 프리셋 */
  static CATEGORIES = {
    primary: '#667eea',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  };

  static defaults() {
    return {
      events: [], // { id, title, date, endDate, color, category, allDay }
      categories: [], // { id, label, color } — 사이드바 외부 이벤트용
      defaultDate: new Date(),
      view: 'month', // 'month', 'week'
      weekStart: 0, // 0 = 일요일, 1 = 월요일
      showToday: true,
      maxEventsPerCell: 2,
      onDateClick: null,
      onEventClick: null,
      onMonthChange: null,
      onEventAdd: null
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Calendar.defaults(), ...options };
    this.currentDate = new Date(this.options.defaultDate);
    this.view = this.options.view;
    this._init();
  }

  _init() {
    this.container.classList.add('calendar');
    this._render();
    this._bindEvents();
  }

  _render() {
    if (this.view === 'week') this._renderWeek();
    else this._renderMonth();
  }

  _renderMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    const cells = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthLastDay - i, isOtherMonth: true, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      cells.push({ day: i, isOtherMonth: false, date: new Date(year, month, i) });
    }
    const remaining = Math.ceil(cells.length / 7) * 7 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isOtherMonth: true, date: new Date(year, month + 1, i) });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxEvents = this.options.maxEventsPerCell;

    this.container.innerHTML = `
      <div class="calendar__header">
        <div class="calendar__nav">
          <button class="calendar__nav-btn" data-action="prev"><i class="material-icons-outlined">chevron_left</i></button>
          <button class="calendar__nav-btn" data-action="next"><i class="material-icons-outlined">chevron_right</i></button>
          ${this.options.showToday ? '<button class="calendar__today-btn" data-action="today">오늘</button>' : ''}
        </div>
        <h3 class="calendar__title">${year}년 ${monthNames[month]}</h3>
        <div class="calendar__view-toggle">
          <button class="calendar__view-btn ${this.view === 'month' ? 'is-active' : ''}" data-view="month">월</button>
          <button class="calendar__view-btn ${this.view === 'week' ? 'is-active' : ''}" data-view="week">주</button>
        </div>
      </div>
      <div class="calendar__weekdays">
        ${dayNames.map((d, i) => `<div class="calendar__weekday ${i === 0 ? 'sunday' : i === 6 ? 'saturday' : ''}">${d}</div>`).join('')}
      </div>
      <div class="calendar__grid">
        ${cells.map(cell => {
    const dateStr = this._formatDate(cell.date);
    const events = this._getEventsForDate(dateStr);
    const isToday = cell.date.getTime() === today.getTime();
    const dow = cell.date.getDay();
    return `
          <div class="calendar__cell ${cell.isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dow === 0 ? 'sunday' : ''} ${dow === 6 ? 'saturday' : ''}" data-date="${dateStr}">
            <span class="calendar__day">${cell.day}</span>
            ${events.length > 0 ? `
              <div class="calendar__events">
                ${events.slice(0, maxEvents).map(ev => `
                  <div class="calendar__event" style="background: ${Security.sanitizeCSS(this._getEventColor(ev))};" data-event-id="${Security.escape(ev.id)}" title="${Security.escape(ev.title)}">${Security.escape(ev.title)}</div>
                `).join('')}
                ${events.length > maxEvents ? `<div class="calendar__more">+${events.length - maxEvents}개 더</div>` : ''}
              </div>
            ` : ''}
          </div>`;
  }).join('')}
      </div>
    `;
  }

  _renderWeek() {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDates = this._getWeekDates(this.currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 주 범위 표시 텍스트
    const startStr = `${weekDates[0].getMonth() + 1}/${weekDates[0].getDate()}`;
    const endStr = `${weekDates[6].getMonth() + 1}/${weekDates[6].getDate()}`;
    const yearStr = weekDates[0].getFullYear();

    this.container.innerHTML = `
      <div class="calendar__header">
        <div class="calendar__nav">
          <button class="calendar__nav-btn" data-action="prev"><i class="material-icons-outlined">chevron_left</i></button>
          <button class="calendar__nav-btn" data-action="next"><i class="material-icons-outlined">chevron_right</i></button>
          ${this.options.showToday ? '<button class="calendar__today-btn" data-action="today">오늘</button>' : ''}
        </div>
        <h3 class="calendar__title">${yearStr}년 ${startStr} ~ ${endStr}</h3>
        <div class="calendar__view-toggle">
          <button class="calendar__view-btn ${this.view === 'month' ? 'is-active' : ''}" data-view="month">월</button>
          <button class="calendar__view-btn ${this.view === 'week' ? 'is-active' : ''}" data-view="week">주</button>
        </div>
      </div>
      <div class="calendar__week-view">
        ${weekDates.map((date, i) => {
    const dateStr = this._formatDate(date);
    const events = this._getEventsForDate(dateStr);
    const isToday = date.getTime() === today.getTime();
    const dow = date.getDay();
    return `
          <div class="calendar__week-day ${isToday ? 'today' : ''} ${dow === 0 ? 'sunday' : ''} ${dow === 6 ? 'saturday' : ''}" data-date="${dateStr}">
            <div class="calendar__week-day-header">
              <span class="calendar__week-day-name">${dayNames[i]}</span>
              <span class="calendar__week-day-num ${isToday ? 'is-today' : ''}">${date.getDate()}</span>
            </div>
            <div class="calendar__week-day-events">
              ${events.map(ev => `
                <div class="calendar__event" style="background: ${Security.sanitizeCSS(this._getEventColor(ev))};" data-event-id="${Security.escape(ev.id)}" title="${Security.escape(ev.title)}">${Security.escape(ev.title)}</div>
              `).join('')}
            </div>
          </div>`;
  }).join('')}
      </div>
    `;
  }

  /** 해당 날짜의 이벤트 목록 반환 */
  _getEventsForDate(dateStr) {
    return this.options.events.filter(e => this._formatDate(new Date(e.date)) === dateStr);
  }

  /** 이벤트 색상 결정 (category → color → 기본값) */
  _getEventColor(event) {
    if (event.color) return event.color;
    if (event.category && Calendar.CATEGORIES[event.category]) return Calendar.CATEGORIES[event.category];
    return Calendar.CATEGORIES.primary;
  }

  /** 지정 날짜가 속한 주의 7일 배열 반환 */
  _getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(d.getFullYear(), d.getMonth(), diff + i));
    }
    return dates;
  }

  _formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  _bindEvents() {
    this._onClick = (e) => {
      // 뷰 토글
      const viewBtn = e.target.closest('.calendar__view-btn');
      if (viewBtn) {
        this.view = viewBtn.dataset.view;
        this._render();
        return;
      }

      // 네비게이션
      const navBtn = e.target.closest('[data-action]');
      if (navBtn) {
        const action = navBtn.dataset.action;
        if (action === 'today') {
          this.currentDate = new Date();
        } else if (action === 'prev') {
          if (this.view === 'month') this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          else this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else if (action === 'next') {
          if (this.view === 'month') this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          else this.currentDate.setDate(this.currentDate.getDate() + 7);
        }
        this._render();
        if (this.options.onMonthChange) this.options.onMonthChange(this.currentDate);
        return;
      }

      // 이벤트 클릭
      const eventEl = e.target.closest('.calendar__event');
      if (eventEl && this.options.onEventClick) {
        this.options.onEventClick(eventEl.dataset.eventId);
        return;
      }

      // 날짜 클릭
      const cell = e.target.closest('[data-date]');
      if (cell && this.options.onDateClick) {
        this.options.onDateClick(cell.dataset.date);
      }
    };

    this.container.addEventListener('click', this._onClick);
  }

  /** 뷰 전환 */
  setView(view) {
    this.view = view;
    this._render();
  }

  goToDate(date) {
    this.currentDate = new Date(date);
    this._render();
  }

  goToToday() {
    this.currentDate = new Date();
    this._render();
  }

  addEvent(event) {
    this.options.events.push(event);
    this._render();
  }

  updateEvent(eventId, data) {
    const event = this.options.events.find(e => e.id === eventId);
    if (event) {
      Object.assign(event, data);
      this._render();
    }
  }

  removeEvent(eventId) {
    this.options.events = this.options.events.filter(e => e.id !== eventId);
    this._render();
  }

  getEvents(date) {
    const dateStr = this._formatDate(new Date(date));
    return this._getEventsForDate(dateStr);
  }

  getAllEvents() {
    return [...this.options.events];
  }

  destroy() {
    if (this._onClick) this.container.removeEventListener('click', this._onClick);
    this.container.innerHTML = '';
    this.container.classList.remove('calendar');
    this.container = null;
  }
}

// ============================================
// Export
// ============================================

export { DataTable, Chart, Masonry, Kanban, Calendar };
export default { DataTable, Chart, Masonry, Kanban, Calendar };
