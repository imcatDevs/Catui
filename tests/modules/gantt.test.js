/**
 * Gantt Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Gantt;

beforeEach(async () => {
  const mod = await import('../../src/modules/gantt.js');
  Gantt = mod.Gantt || mod.default?.Gantt || mod.default;
  document.body.innerHTML = '<div id="gantt-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Gantt', () => {
  it('Gantt 클래스가 존재해야 함', () => {
    expect(Gantt).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '작업 1', start: '2025-01-01', end: '2025-01-15', progress: 50 },
        { id: '2', name: '작업 2', start: '2025-01-10', end: '2025-01-25', progress: 20 }
      ]
    });
    expect(g).toBeDefined();
    g.destroy?.();
  });

  it('존재하지 않는 컨테이너는 에러를 출력해야 함', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(function() {});
    new Gantt('#nonexistent', { tasks: [] });
    expect(spy).toHaveBeenCalled();
  });

  it('DOM에 간트 차트를 렌더링해야 함', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '작업 1', start: '2025-01-01', end: '2025-01-15', progress: 50 }
      ]
    });
    var container = document.getElementById('gantt-container');
    expect(container.children.length).toBeGreaterThan(0);
    g.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var g = new Gantt('#gantt-container', { tasks: [] });
    if (g && typeof g.destroy === 'function') {
      g.destroy();
    }
  });

  it('setViewMode', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }]
    });
    g.setViewMode('week');
    expect(g.options.viewMode).toBe('week');
    g.setViewMode('month');
    expect(g.options.viewMode).toBe('month');
    g.destroy?.();
  });

  it('setTasks', () => {
    var g = new Gantt('#gantt-container', { tasks: [] });
    g.setTasks([{ id: 'a', name: '새 작업', start: '2025-02-01', end: '2025-02-10' }]);
    expect(g.tasks.length).toBe(1);
    g.destroy?.();
  });

  it('addTask / removeTask', () => {
    var g = new Gantt('#gantt-container', { tasks: [] });
    g.addTask({ id: 'x', name: '추가 작업', start: '2025-03-01', end: '2025-03-05' });
    expect(g.tasks.length).toBe(1);
    g.removeTask('x');
    expect(g.tasks.length).toBe(0);
    g.destroy?.();
  });

  it('updateTask', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '원본', start: '2025-01-01', end: '2025-01-10' }]
    });
    g.updateTask('1', { name: '수정됨' });
    expect(g.tasks[0].name).toBe('수정됨');
    g.destroy?.();
  });

  it('refresh', () => {
    var g = new Gantt('#gantt-container', { tasks: [] });
    g.refresh();
    g.destroy?.();
  });

  it('중복 인스턴스 교체', () => {
    var g1 = new Gantt('#gantt-container', { tasks: [] });
    var g2 = new Gantt('#gantt-container', { tasks: [] });
    expect(g2).toBeDefined();
    g2.destroy?.();
  });

  it('viewMode week/month 타임라인 렌더링', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-03-01' }],
      viewMode: 'week'
    });
    g.destroy?.();
  });

  it('showProgress 옵션', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10', progress: 75 }],
      showProgress: true
    });
    g.destroy?.();
  });

  it('showDependencies 옵션', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '작업1', start: '2025-01-01', end: '2025-01-10' },
        { id: '2', name: '작업2', start: '2025-01-11', end: '2025-01-20', dependencies: ['1'] }
      ],
      showDependencies: true
    });
    g.destroy?.();
  });

  it('todayLine 옵션', () => {
    var today = new Date();
    var start = new Date(today);
    start.setDate(start.getDate() - 5);
    var end = new Date(today);
    end.setDate(end.getDate() + 5);
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] }],
      todayLine: true
    });
    g.destroy?.();
  });

  it('weekends 옵션', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-15' }],
      weekends: true
    });
    g.destroy?.();
  });

  it('editable 옵션', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      editable: true
    });
    g.destroy?.();
  });

  it('onTaskClick 콜백', () => {
    const onTaskClick = vi.fn();
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      onTaskClick
    });
    var bar = g.container.querySelector('.gantt__bar');
    if (bar) bar.click();
    g.destroy?.();
  });

  it('하위 작업 접기/펼치기', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '부모', start: '2025-01-01', end: '2025-01-20', children: [
          { id: '1-1', name: '자식', start: '2025-01-05', end: '2025-01-15' }
        ] }
      ]
    });
    var collapseBtn = g.container.querySelector('.gantt__collapse-btn');
    if (collapseBtn) collapseBtn.click();
    g.destroy?.();
  });

  it('scrollToTask', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }]
    });
    if (typeof g.scrollToTask === 'function') {
      g.scrollToTask('1');
    }
    g.destroy?.();
  });

  it('onViewChange 콜백', () => {
    const onViewChange = vi.fn();
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      onViewChange
    });
    g.setViewMode('week');
    g.destroy?.();
  });
});

describe('Gantt 추가', () => {
  it('뷰 버튼 클릭', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }]
    });
    var weekBtn = g.container.querySelector('[data-view="week"]');
    if (weekBtn) weekBtn.click();
    expect(g.options.viewMode).toBe('week');
    g.destroy?.();
  });

  it('오늘 버튼 클릭', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }]
    });
    var todayBtn = g.container.querySelector('.gantt__today-btn');
    if (todayBtn) todayBtn.click();
    g.destroy?.();
  });

  it('editable 드래그 — mousedown/mousemove/mouseup', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      editable: true,
      onTaskChange: vi.fn()
    });
    var bar = g.container.querySelector('.gantt__bar');
    if (bar) {
      bar.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
    }
    g.destroy?.();
  });

  it('editable 드래그 — left handle', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      editable: true
    });
    var handle = g.container.querySelector('.gantt__bar-handle--left');
    if (handle) {
      handle.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, bubbles: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
    }
    g.destroy?.();
  });

  it('editable 드래그 — right handle', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      editable: true
    });
    var handle = g.container.querySelector('.gantt__bar-handle--right');
    if (handle) {
      handle.dispatchEvent(new MouseEvent('mousedown', { clientX: 200, bubbles: true }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
    }
    g.destroy?.();
  });

  it('완료된 작업 색상(success)', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '완료', start: '2025-01-01', end: '2025-01-10', progress: 100 }]
    });
    g.destroy?.();
  });

  it('지연된 작업 색상(danger)', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '지연', start: '2024-01-01', end: '2024-06-01', progress: 30 }]
    });
    g.destroy?.();
  });

  it('assignee 표시', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10', assignee: '홍길동' }]
    });
    expect(g.container.innerHTML).toContain('홍길동');
    g.destroy?.();
  });

  it('month 뷰 렌더링', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-03-01' }],
      viewMode: 'month'
    });
    g.destroy?.();
  });

  it('startDate / endDate 명시', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [],
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });
    g.destroy?.();
  });

  it('defaults()', () => {
    var d = Gantt.defaults();
    expect(d.viewMode).toBe('day');
    expect(d.taskHeight).toBe(36);
  });

  it('collapsed 토글 (사이드바 클릭)', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '부모', start: '2025-01-01', end: '2025-01-20', children: [
          { id: '1-1', name: '자식', start: '2025-01-05', end: '2025-01-15' }
        ]}
      ]
    });
    // 사이드바의 collapse 버튼 클릭
    var sidebar = g.container.querySelector('.gantt__sidebar-content');
    var collapseBtn = sidebar?.querySelector('.gantt__collapse-btn');
    if (collapseBtn) collapseBtn.click();
    // 다시 클릭하여 펼치기
    sidebar = g.container.querySelector('.gantt__sidebar-content');
    collapseBtn = sidebar?.querySelector('.gantt__collapse-btn');
    if (collapseBtn) collapseBtn.click();
    g.destroy?.();
  });

  it('removeTask — 하위 작업', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [
        { id: '1', name: '부모', start: '2025-01-01', end: '2025-01-20', children: [
          { id: '1-1', name: '자식', start: '2025-01-05', end: '2025-01-15' }
        ]}
      ]
    });
    g.removeTask('1-1');
    expect(g.tasks[0].children.length).toBe(0);
    g.destroy?.();
  });

  it('weekends false', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }],
      weekends: false
    });
    g.destroy?.();
  });

  it('스크롤 동기화', () => {
    var g = new Gantt('#gantt-container', {
      tasks: [{ id: '1', name: '작업', start: '2025-01-01', end: '2025-01-10' }]
    });
    if (g._chartWrapper) {
      g._chartWrapper.dispatchEvent(new Event('scroll'));
    }
    g.destroy?.();
  });
});
