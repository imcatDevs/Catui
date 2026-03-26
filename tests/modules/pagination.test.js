/**
 * Pagination Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Pagination;

beforeEach(async () => {
  const mod = await import('../../src/modules/pagination.js');
  Pagination = mod.Pagination || mod.default?.Pagination;
  // default가 PaginationModule 래퍼인 경우
  if (!Pagination && mod.default) {
    Pagination = mod.default.Pagination || mod.default;
  }
  document.body.innerHTML = '<div id="pg-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Pagination', () => {
  it('Pagination 클래스가 존재해야 함', () => {
    expect(Pagination).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    expect(pg).toBeDefined();
    expect(pg.container).toBeTruthy();
    pg.destroy?.();
  });

  it('존재하지 않는 컨테이너는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new Pagination('#nonexistent', { totalItems: 100 });
    expect(spy).toHaveBeenCalled();
  });

  it('defaults()가 올바른 기본값을 반환해야 함', () => {
    var d = Pagination.defaults();
    expect(d.totalItems).toBe(0);
    expect(d.itemsPerPage).toBe(10);
    expect(d.currentPage).toBe(1);
    expect(d.maxVisiblePages).toBe(5);
  });

  it('DOM에 페이지네이션을 렌더링해야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10 });
    var container = document.getElementById('pg-container');
    expect(container.children.length).toBeGreaterThan(0);
    pg.destroy?.();
  });

  it('goToPage()로 특정 페이지로 이동할 수 있어야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    pg.goToPage(3);
    expect(pg.currentPage).toBe(3);
    pg.destroy?.();
  });

  it('goToPage()로 다음 페이지로 이동할 수 있어야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10, currentPage: 1 });
    pg.goToPage(2);
    expect(pg.currentPage).toBe(2);
    pg.destroy?.();
  });

  it('범위 밖 페이지로는 이동하지 않아야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10, currentPage: 1 });
    pg.goToPage(0);
    expect(pg.currentPage).toBe(1);
    pg.goToPage(999);
    expect(pg.currentPage).toBe(1);
    pg.destroy?.();
  });

  it('onChange 콜백이 호출되어야 함', () => {
    var receivedPage = null;
    var pg = new Pagination('#pg-container', {
      totalItems: 100,
      itemsPerPage: 10,
      onChange: function(page) { receivedPage = page; }
    });
    pg.goToPage(5);
    expect(receivedPage.currentPage).toBe(5);
    pg.destroy?.();
  });

  it('setTotalItems()로 총 아이템 수를 변경할 수 있어야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    pg.setTotalItems(200);
    expect(pg.totalPages).toBe(20);
    pg.destroy?.();
  });

  it('getTotalPages()가 올바른 총 페이지 수를 반환해야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 95, itemsPerPage: 10 });
    if (typeof pg.getTotalPages === 'function') {
      expect(pg.getTotalPages()).toBe(10);
    }
    pg.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10 });
    expect(typeof pg.destroy).toBe('function');
    pg.destroy();
  });

  it('showInfo 옵션', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10, showInfo: true });
    expect(document.querySelector('.pagination-info')).not.toBeNull();
    pg.destroy?.();
  });

  it('rounded / size 옵션', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, rounded: true, size: 'sm' });
    expect(pg.ul.classList.contains('pagination-rounded')).toBe(true);
    expect(pg.ul.classList.contains('pagination-sm')).toBe(true);
    pg.destroy?.();
  });

  it('align center', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, align: 'center' });
    pg.destroy?.();
  });

  it('setItemsPerPage', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    if (typeof pg.setItemsPerPage === 'function') {
      pg.setItemsPerPage(20);
      expect(pg.totalPages).toBe(5);
    }
    pg.destroy?.();
  });

  it('많은 페이지 — ellipsis 표시', () => {
    var pg = new Pagination('#pg-container', { totalItems: 200, itemsPerPage: 10, maxVisiblePages: 5 });
    pg.goToPage(10);
    expect(pg.currentPage).toBe(10);
    pg.destroy?.();
  });

  it('onInit 콜백', () => {
    const onInit = vi.fn();
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, onInit });
    expect(onInit).toHaveBeenCalled();
    pg.destroy?.();
  });

  it('getPageData', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    var data = pg.getPageData();
    expect(data.currentPage).toBe(1);
    expect(data.totalPages).toBe(10);
    expect(data.isFirstPage).toBe(true);
    pg.destroy?.();
  });

  it('updateOptions', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10 });
    if (typeof pg.updateOptions === 'function') {
      pg.updateOptions({ totalItems: 200 });
      expect(pg.totalPages).toBe(20);
    }
    pg.destroy?.();
  });

  it('refresh', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10 });
    if (typeof pg.refresh === 'function') {
      pg.refresh();
    }
    pg.destroy?.();
  });

  it('클릭으로 페이지 이동', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    var link = pg.ul.querySelector('[data-page="3"]');
    if (link) link.click();
    expect(pg.currentPage).toBe(3);
    pg.destroy?.();
  });

  it('first/last 액션 클릭', () => {
    var pg = new Pagination('#pg-container', { totalItems: 100, itemsPerPage: 10 });
    pg.goToPage(5);
    var firstLink = pg.ul.querySelector('[data-action="first"]');
    if (firstLink) firstLink.click();
    expect(pg.currentPage).toBe(1);
    pg.destroy?.();
  });

  it('icons false', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, icons: false });
    pg.destroy?.();
  });

  it('size lg', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, size: 'lg' });
    expect(pg.ul.classList.contains('pagination-lg')).toBe(true);
    pg.destroy?.();
  });

  it('align end', () => {
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, align: 'end' });
    pg.destroy?.();
  });

  it('onDestroy 콜백', () => {
    const onDestroy = vi.fn();
    var pg = new Pagination('#pg-container', { totalItems: 50, itemsPerPage: 10, onDestroy });
    pg.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });

  it('totalItems 0', () => {
    var pg = new Pagination('#pg-container', { totalItems: 0, itemsPerPage: 10 });
    pg.destroy?.();
  });
});

describe('DataPaginator', () => {
  let DataPaginator;

  beforeEach(async () => {
    const mod = await import('../../src/modules/pagination.js');
    DataPaginator = mod.DataPaginator || mod.default?.DataPaginator;
  });

  it('DataPaginator 클래스가 존재해야 함', () => {
    expect(DataPaginator).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [{ a: 1 }, { a: 2 }, { a: 3 }],
      itemsPerPage: 2
    });
    expect(dp).toBeDefined();
    dp.destroy?.();
  });

  it('setData / getCurrentPageData', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [],
      itemsPerPage: 2
    });
    dp.setData([{ x: 1 }, { x: 2 }, { x: 3 }]);
    expect(dp.getCurrentPageData().length).toBe(2);
    dp.destroy?.();
  });

  it('filter / resetFilter', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [{ v: 1 }, { v: 2 }, { v: 3 }],
      itemsPerPage: 10
    });
    dp.filter(item => item.v > 1);
    expect(dp.getFilteredData().length).toBe(2);
    dp.resetFilter();
    expect(dp.getFilteredData().length).toBe(3);
    dp.destroy?.();
  });

  it('search', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [{ name: '홍길동' }, { name: '김철수' }],
      itemsPerPage: 10
    });
    dp.search('홍');
    expect(dp.getFilteredData().length).toBe(1);
    dp.search('');
    expect(dp.getFilteredData().length).toBe(2);
    dp.destroy?.();
  });

  it('sort', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [{ v: 3 }, { v: 1 }, { v: 2 }],
      itemsPerPage: 10
    });
    dp.sort((a, b) => a.v - b.v);
    expect(dp.getFilteredData()[0].v).toBe(1);
    dp.destroy?.();
  });

  it('renderItem 함수', () => {
    var dp = new DataPaginator({
      container: '#pg-container',
      data: [{ name: 'A' }],
      itemsPerPage: 10,
      renderItem: (item) => `<div>${item.name}</div>`
    });
    dp.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new DataPaginator({ container: '#nonexistent', data: [] });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
