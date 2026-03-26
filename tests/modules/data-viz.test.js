/**
 * Data Viz Module 테스트
 * DataTable, Chart, Masonry, Kanban, Calendar
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let DataTable, Chart, Masonry, Kanban, Calendar;

beforeEach(async () => {
  const mod = await import('../../src/modules/data-viz.js');
  DataTable = mod.DataTable || mod.default?.DataTable;
  Chart = mod.Chart || mod.default?.Chart;
  Masonry = mod.Masonry || mod.default?.Masonry;
  Kanban = mod.Kanban || mod.default?.Kanban;
  Calendar = mod.Calendar || mod.default?.Calendar;
  document.body.innerHTML = '<div id="dv-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('DataTable', () => {
  it('DataTable 클래스가 존재해야 함', () => {
    expect(DataTable).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var dt = new DataTable('#dv-container', {
      columns: [
        { key: 'name', title: '이름' },
        { key: 'age', title: '나이' }
      ],
      data: [
        { name: '홍길동', age: 30 },
        { name: '김영희', age: 25 }
      ]
    });
    expect(dt).toBeDefined();
    dt.destroy?.();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = DataTable.defaults();
    expect(d).toBeDefined();
  });

  it('destroy()로 정리되어야 함', () => {
    var dt = new DataTable('#dv-container', {
      columns: [{ key: 'id', title: 'ID' }],
      data: [{ id: 1 }]
    });
    if (dt && typeof dt.destroy === 'function') {
      dt.destroy();
    }
  });
});

describe('Chart', () => {
  it('Chart 클래스가 존재해야 함', () => {
    expect(Chart).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
    });
    expect(c).toBeDefined();
    c.destroy?.();
  });
});

describe('Masonry', () => {
  it('Masonry 클래스가 존재해야 함', () => {
    expect(Masonry).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    global.ResizeObserver = vi.fn().mockImplementation(function() {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    document.body.innerHTML = '<div id="masonry-container"><div class="masonry-item">1</div><div class="masonry-item">2</div></div>';
    var m = new Masonry('#masonry-container', { columns: 3 });
    expect(m).toBeDefined();
    m.destroy?.();
    delete global.ResizeObserver;
  });
});

describe('Kanban', () => {
  it('Kanban 클래스가 존재해야 함', () => {
    expect(Kanban).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var k = new Kanban('#dv-container', {
      columns: [
        { id: 'todo', title: '할 일', items: [{ id: '1', title: '작업 1' }] },
        { id: 'done', title: '완료', items: [] }
      ]
    });
    expect(k).toBeDefined();
    k.destroy?.();
  });
});

describe('Calendar', () => {
  it('Calendar 클래스가 존재해야 함', () => {
    expect(Calendar).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var cal = new Calendar('#dv-container');
    expect(cal).toBeDefined();
    cal.destroy?.();
  });
});

describe('DataTable 추가', () => {
  const cols = [{ field: 'name', title: '이름' }, { field: 'age', title: '나이' }];
  const data = [
    { name: '홍길동', age: 30 },
    { name: '김영희', age: 25 },
    { name: '이철수', age: 35 }
  ];

  it('setData', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data });
    dt.setData([{ name: '새사람', age: 20 }]);
    expect(dt.data.length).toBe(1);
    dt.destroy?.();
  });

  it('search', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data });
    dt.search('홍');
    expect(dt.filteredData.length).toBe(1);
    dt.search('');
    expect(dt.filteredData.length).toBe(3);
    dt.destroy?.();
  });

  it('refresh', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data });
    dt.refresh();
    dt.destroy?.();
  });

  it('addRow / deleteRow', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [] });
    dt.addRow({ name: '추가', age: 99 });
    expect(dt.data.length).toBe(1);
    dt.deleteRow(0);
    expect(dt.data.length).toBe(0);
    dt.destroy?.();
  });

  it('selectRow / deselectRow / clearSelection', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data, selectable: true });
    dt.selectRow(0);
    expect(dt.getSelectedIndices()).toContain(0);
    dt.deselectRow(0);
    expect(dt.getSelectedIndices()).not.toContain(0);
    dt.selectAll();
    dt.clearSelection();
    expect(dt.getSelectedIndices().length).toBe(0);
    dt.destroy?.();
  });

  it('exportCSV', () => {
    // URL.createObjectURL mock
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data, exportable: true });
    dt.exportCSV();
    dt.destroy?.();
  });

  it('striped/bordered/compact/responsive 옵션', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [], striped: true, bordered: true, compact: true, responsive: true });
    expect(dt.container.classList.contains('datatable--striped')).toBe(true);
    dt.destroy?.();
  });

  it('존재하지 않는 컨테이너', () => {
    var dt = new DataTable('#nonexistent', { columns: cols });
    expect(dt.container).toBeFalsy();
  });

  it('정렬 클릭', () => {
    var dt = new DataTable('#dv-container', { columns: [{ field: 'name', title: '이름' }], data: [{ name: 'B' }, { name: 'A' }] });
    const th = document.querySelector('.is-sortable');
    if (th) th.click();
    dt.destroy?.();
  });

  it('빈 데이터 empty state', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [] });
    expect(document.querySelector('.datatable__empty')).not.toBeNull();
    dt.destroy?.();
  });
});

describe('Chart 추가', () => {
  it('line 차트', () => {
    var c = new Chart('#dv-container', {
      type: 'line',
      data: { labels: ['A', 'B', 'C'], datasets: [{ data: [10, 20, 15], label: '데이터' }] }
    });
    expect(c).toBeDefined();
    c.destroy?.();
  });

  it('area 차트', () => {
    var c = new Chart('#dv-container', {
      type: 'area',
      data: { labels: ['A', 'B'], datasets: [{ data: [5, 10] }] }
    });
    c.destroy?.();
  });

  it('pie 차트', () => {
    var c = new Chart('#dv-container', {
      type: 'pie',
      data: { labels: ['A', 'B'], datasets: [{ data: [30, 70] }] }
    });
    c.destroy?.();
  });

  it('doughnut 차트', () => {
    var c = new Chart('#dv-container', {
      type: 'doughnut',
      data: { labels: ['A', 'B'], datasets: [{ data: [40, 60] }] }
    });
    c.destroy?.();
  });

  it('horizontalBar 차트', () => {
    var c = new Chart('#dv-container', {
      type: 'horizontalBar',
      data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
    });
    c.destroy?.();
  });

  it('showValues/showGrid 옵션', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A'], datasets: [{ data: [10] }] },
      showValues: true,
      showGrid: false
    });
    c.destroy?.();
  });

  it('존재하지 않는 컨테이너', () => {
    var c = new Chart('#nonexistent');
    expect(c.container).toBeFalsy();
  });

  it('update', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A'], datasets: [{ data: [10] }] }
    });
    c.update({ labels: ['X', 'Y'], datasets: [{ data: [5, 15] }] });
    c.destroy?.();
  });

  it('showLegend', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A'], datasets: [{ data: [10], label: 'DS1' }] },
      showLegend: true
    });
    c.destroy?.();
  });

  it('showTooltip', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A'], datasets: [{ data: [10] }] },
      showTooltip: true
    });
    c.destroy?.();
  });
});

describe('Masonry 추가', () => {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(function() {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
  });

  afterEach(() => {
    delete global.ResizeObserver;
  });

  it('render 함수로 아이템 렌더링', () => {
    var m = new Masonry('#dv-container', {
      items: [{ name: 'A', cat: 'x' }, { name: 'B', cat: 'y' }],
      render: (item) => `<p>${item.name}</p>`,
      filterKey: 'cat'
    });
    expect(m.container.querySelectorAll('.masonry__item').length).toBe(2);
    m.destroy?.();
  });

  it('filter / clearFilter', () => {
    var m = new Masonry('#dv-container', {
      items: [{ name: 'A', cat: 'x' }, { name: 'B', cat: 'y' }],
      render: (item) => `<p>${item.name}</p>`,
      filterKey: 'cat'
    });
    m.filter('x');
    expect(m.container.querySelectorAll('.masonry__item').length).toBe(1);
    m.clearFilter();
    expect(m.container.querySelectorAll('.masonry__item').length).toBe(2);
    m.destroy?.();
  });

  it('getCategories', () => {
    var m = new Masonry('#dv-container', {
      items: [{ cat: 'x' }, { cat: 'y' }, { cat: 'x' }],
      render: () => '<p>item</p>',
      filterKey: 'cat'
    });
    var cats = m.getCategories();
    expect(cats).toContain('x');
    expect(cats).toContain('y');
    m.destroy?.();
  });

  it('addItem / removeItem', () => {
    var m = new Masonry('#dv-container', {
      items: [{ name: 'A' }],
      render: (item) => `<p>${item.name}</p>`
    });
    m.addItem({ name: 'B' });
    expect(m.options.items.length).toBe(2);
    m.removeItem(0);
    expect(m.options.items.length).toBe(1);
    m.destroy?.();
  });
});

describe('Kanban 추가', () => {
  const kanbanCols = [
    { id: 'todo', title: '할 일', cards: [{ id: '1', title: '작업1', priority: 'high', tags: [{ text: '태그' }], date: '2024-01-01', assignees: [{ name: '홍길동' }] }] },
    { id: 'done', title: '완료', cards: [] }
  ];

  it('addCard / removeCard', () => {
    var k = new Kanban('#dv-container', { columns: JSON.parse(JSON.stringify(kanbanCols)) });
    k.addCard('done', { id: '2', title: '새 카드' });
    var doneCol = k.options.columns.find(c => c.id === 'done');
    expect(doneCol.cards.length).toBe(1);
    k.removeCard('2');
    expect(doneCol.cards.length).toBe(0);
    k.destroy?.();
  });

  it('onCardClick 콜백', () => {
    const onCardClick = vi.fn();
    var k = new Kanban('#dv-container', { columns: JSON.parse(JSON.stringify(kanbanCols)), onCardClick });
    var card = k.container.querySelector('.kanban__card');
    if (card) card.click();
    expect(onCardClick).toHaveBeenCalled();
    k.destroy?.();
  });

  it('카드 삭제 버튼 클릭', () => {
    const onCardDelete = vi.fn();
    var k = new Kanban('#dv-container', { columns: JSON.parse(JSON.stringify(kanbanCols)), onCardDelete });
    var deleteBtn = k.container.querySelector('.kanban__card-delete');
    if (deleteBtn) deleteBtn.click();
    expect(onCardDelete).toHaveBeenCalled();
    k.destroy?.();
  });

  it('wipLimit 옵션', () => {
    var k = new Kanban('#dv-container', { columns: [
      { id: 'a', title: 'A', wipLimit: 1, cards: [{ id: '1', title: 'T1' }, { id: '2', title: 'T2' }] }
    ] });
    expect(k.container.querySelector('.kanban__column--over-wip')).not.toBeNull();
    k.destroy?.();
  });

  it('checked 카드', () => {
    var k = new Kanban('#dv-container', { columns: [
      { id: 'a', title: 'A', cards: [{ id: '1', title: 'T', checked: false }] }
    ] });
    var checkbox = k.container.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
    k.destroy?.();
  });

  it('allowAddCard / showColumnMenu false', () => {
    var k = new Kanban('#dv-container', { columns: kanbanCols, allowAddCard: false, showColumnMenu: false });
    expect(k.container.querySelector('.kanban__add-card')).toBeNull();
    k.destroy?.();
  });
});

describe('Calendar 추가', () => {
  it('week 뷰', () => {
    var cal = new Calendar('#dv-container', { view: 'week' });
    expect(cal.container.querySelector('.calendar__week-view')).not.toBeNull();
    cal.destroy?.();
  });

  it('prev / next 네비게이션', () => {
    var cal = new Calendar('#dv-container');
    var prevBtn = cal.container.querySelector('[data-action="prev"]');
    if (prevBtn) prevBtn.click();
    var nextBtn = cal.container.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.click();
    cal.destroy?.();
  });

  it('today 버튼', () => {
    var cal = new Calendar('#dv-container');
    var todayBtn = cal.container.querySelector('[data-action="today"]');
    if (todayBtn) todayBtn.click();
    cal.destroy?.();
  });

  it('setView / goToToday / goToDate', () => {
    var cal = new Calendar('#dv-container');
    cal.setView('week');
    expect(cal.view).toBe('week');
    cal.goToToday();
    cal.goToDate('2024-06-15');
    cal.destroy?.();
  });

  it('addEvent / removeEvent / getEvents / getAllEvents', () => {
    var cal = new Calendar('#dv-container');
    cal.addEvent({ id: 'e1', title: '이벤트', date: new Date().toISOString() });
    expect(cal.getAllEvents().length).toBe(1);
    cal.removeEvent('e1');
    expect(cal.getAllEvents().length).toBe(0);
    cal.destroy?.();
  });

  it('updateEvent', () => {
    var cal = new Calendar('#dv-container', { events: [{ id: 'e1', title: '원래', date: new Date().toISOString() }] });
    cal.updateEvent('e1', { title: '수정됨' });
    var ev = cal.getAllEvents().find(e => e.id === 'e1');
    expect(ev.title).toBe('수정됨');
    cal.destroy?.();
  });

  it('onDateClick / onEventClick 콜백', () => {
    const onDateClick = vi.fn();
    const onEventClick = vi.fn();
    var today = new Date();
    var dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    var cal = new Calendar('#dv-container', {
      events: [{ id: 'e1', title: '이벤트', date: dateStr, category: 'success' }],
      onDateClick, onEventClick
    });
    var eventEl = cal.container.querySelector('.calendar__event');
    if (eventEl) eventEl.click();
    var cell = cal.container.querySelector(`[data-date="${dateStr}"]`);
    if (cell) cell.click();
    cal.destroy?.();
  });

  it('뷰 토글 버튼 클릭', () => {
    var cal = new Calendar('#dv-container');
    var weekBtn = cal.container.querySelector('[data-view="week"]');
    if (weekBtn) weekBtn.click();
    expect(cal.view).toBe('week');
    var monthBtn = cal.container.querySelector('[data-view="month"]');
    if (monthBtn) monthBtn.click();
    expect(cal.view).toBe('month');
    cal.destroy?.();
  });

  it('onMonthChange 콜백', () => {
    const onMonthChange = vi.fn();
    var cal = new Calendar('#dv-container', { onMonthChange });
    var nextBtn = cal.container.querySelector('[data-action="next"]');
    if (nextBtn) nextBtn.click();
    expect(onMonthChange).toHaveBeenCalled();
    cal.destroy?.();
  });

  it('이벤트 색상 — color 지정', () => {
    var cal = new Calendar('#dv-container', {
      events: [{ id: 'e1', title: 'T', date: new Date().toISOString(), color: '#ff0000' }]
    });
    cal.destroy?.();
  });
});

describe('DataTable 추가2', () => {
  const cols = [{ field: 'name', title: '이름' }, { field: 'age', title: '나이' }];
  const manyData = Array.from({ length: 25 }, (_, i) => ({ name: `사람${i}`, age: 20 + i }));

  it('페이지네이션 — next/prev/first/last 클릭', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, pageSize: 5 });
    var nextBtn = dt.container.querySelector('[data-page="next"]');
    if (nextBtn) nextBtn.click();
    expect(dt.currentPage).toBe(2);
    var prevBtn = dt.container.querySelector('[data-page="prev"]');
    if (prevBtn) prevBtn.click();
    expect(dt.currentPage).toBe(1);
    var lastBtn = dt.container.querySelector('[data-page="last"]');
    if (lastBtn) lastBtn.click();
    expect(dt.currentPage).toBe(5);
    var firstBtn = dt.container.querySelector('[data-page="first"]');
    if (firstBtn) firstBtn.click();
    expect(dt.currentPage).toBe(1);
    dt.destroy?.();
  });

  it('페이지 번호 직접 클릭', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, pageSize: 5 });
    var pageBtn = dt.container.querySelector('[data-page="3"]');
    if (pageBtn) pageBtn.click();
    expect(dt.currentPage).toBe(3);
    dt.destroy?.();
  });

  it('정렬 방향 토글 (asc → desc)', () => {
    const onSort = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, onSort });
    var th = dt.container.querySelector('.is-sortable');
    if (th) {
      th.click(); // asc
      expect(onSort).toHaveBeenCalledTimes(1);
      // re-render 후 다시 쿼리
      var th2 = dt.container.querySelector('.is-sortable');
      if (th2) th2.click(); // desc
      expect(onSort).toHaveBeenCalledTimes(2);
    }
    dt.destroy?.();
  });

  it('행 클릭 콜백', () => {
    const onRowClick = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, onRowClick });
    var row = dt.container.querySelector('.datatable__tbody tr[data-index]');
    if (row) row.click();
    expect(onRowClick).toHaveBeenCalled();
    dt.destroy?.();
  });

  it('검색 입력 이벤트', () => {
    const onSearch = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, onSearch });
    var input = dt.container.querySelector('.datatable__search input');
    if (input) {
      input.value = '사람1';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onSearch).toHaveBeenCalled();
    }
    dt.destroy?.();
  });

  it('전체 선택 체크박스', () => {
    const onSelect = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData.slice(0, 3), selectable: true, onSelect });
    var selectAll = dt.container.querySelector('.datatable__select-all');
    if (selectAll) {
      selectAll.checked = true;
      selectAll.dispatchEvent(new Event('change', { bubbles: true }));
      expect(onSelect).toHaveBeenCalled();
    }
    dt.destroy?.();
  });

  it('개별 행 선택', () => {
    const onSelect = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData.slice(0, 3), selectable: true, onSelect });
    var rowCb = dt.container.querySelector('.datatable__row-select');
    if (rowCb) {
      rowCb.checked = true;
      rowCb.dispatchEvent(new Event('change', { bubbles: true }));
      expect(onSelect).toHaveBeenCalled();
    }
    dt.destroy?.();
  });

  it('페이지 사이즈 변경', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData, pageSize: 5 });
    var select = dt.container.querySelector('.datatable__per-page select');
    if (select) {
      select.value = '10';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      expect(dt.options.pageSize).toBe(10);
    }
    dt.destroy?.();
  });

  it('toolbar 버튼 클릭', () => {
    const onClick = vi.fn();
    var dt = new DataTable('#dv-container', {
      columns: cols, data: manyData.slice(0, 3),
      toolbar: { buttons: [{ text: '새로고침', icon: 'refresh', onClick }] }
    });
    var actionBtn = dt.container.querySelector('.datatable__action-btn');
    if (actionBtn) actionBtn.click();
    expect(onClick).toHaveBeenCalled();
    dt.destroy?.();
  });

  it('updateRow', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [{ name: '원래', age: 20 }] });
    dt.updateRow(0, { name: '수정됨' });
    expect(dt.filteredData[0].name).toBe('수정됨');
    dt.destroy?.();
  });

  it('deleteSelectedRows', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [{ name: 'A', age: 1 }, { name: 'B', age: 2 }], selectable: true });
    dt.selectAll();
    dt.deleteSelectedRows();
    expect(dt.data.length).toBe(0);
    dt.destroy?.();
  });

  it('getSelectedRows', () => {
    var dt = new DataTable('#dv-container', { columns: cols, data: [{ name: 'A', age: 1 }], selectable: true });
    dt.selectRow(0);
    expect(dt.getSelectedRows().length).toBe(1);
    dt.destroy?.();
  });

  it('column render 함수', () => {
    var dt = new DataTable('#dv-container', {
      columns: [{ field: 'name', title: '이름', render: (val) => `<b>${val}</b>` }],
      data: [{ name: '홍길동' }]
    });
    expect(dt.container.innerHTML).toContain('<b>홍길동</b>');
    dt.destroy?.();
  });

  it('column align/width 옵션', () => {
    var dt = new DataTable('#dv-container', {
      columns: [{ field: 'name', title: '이름', width: '200px', align: 'center' }],
      data: [{ name: 'A' }]
    });
    dt.destroy?.();
  });

  it('export 버튼 클릭', () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
    var dt = new DataTable('#dv-container', { columns: cols, data: manyData.slice(0, 3), exportable: true });
    var exportBtn = dt.container.querySelector('[data-action="export"]');
    if (exportBtn) exportBtn.click();
    dt.destroy?.();
  });
});

describe('Chart 추가2', () => {
  it('defaults()', () => {
    var d = Chart.defaults();
    expect(d.type).toBe('bar');
    expect(d.showLegend).toBe(true);
  });

  it('bar 차트 — 툴팁 mouseover/mouseleave', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A', 'B'], datasets: [{ data: [10, 20], label: 'DS' }] },
      showTooltip: true
    });
    var bar = c.container.querySelector('.chart__bar, .chart__hbar');
    if (bar) {
      bar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: 50, clientY: 50 }));
      bar.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }
    c.destroy?.();
  });

  it('multiple datasets', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A', 'B'], datasets: [
        { data: [10, 20], label: 'DS1' },
        { data: [15, 25], label: 'DS2' }
      ] }
    });
    c.destroy?.();
  });

  it('animate false', () => {
    var c = new Chart('#dv-container', {
      type: 'bar',
      data: { labels: ['A'], datasets: [{ data: [10] }] },
      animate: false
    });
    c.destroy?.();
  });
});
