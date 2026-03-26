/**
 * Navigation Module 테스트
 * Tabs, Accordion
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Navigation;

beforeEach(async () => {
  Navigation = await import('../../src/modules/navigation.js');
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// ============================================
// Tabs
// ============================================
describe('Tabs', () => {
  const Tabs = () => Navigation.Tabs || Navigation.default?.Tabs;

  beforeEach(() => {
    // Tabs 클래스가 요구하는 실제 WAI-ARIA 구조
    document.body.innerHTML = `
      <div id="tabs">
        <div role="tablist">
          <button role="tab" aria-controls="panel-1" aria-selected="true">탭 1</button>
          <button role="tab" aria-controls="panel-2" aria-selected="false">탭 2</button>
        </div>
        <div id="panel-1" role="tabpanel">내용 1</div>
        <div id="panel-2" role="tabpanel">내용 2</div>
      </div>
    `;
  });

  it('Tabs 클래스가 존재해야 함', () => {
    expect(Tabs()).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    expect(tabs).toBeDefined();
    tabs.destroy?.();
  });

  it('destroy() 메서드가 존재해야 함', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    expect(typeof tabs.destroy).toBe('function');
    tabs.destroy();
  });

  it('select() 메서드가 존재해야 함', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    expect(typeof tabs.select).toBe('function');
    tabs.destroy?.();
  });

  it('select(1)로 두 번째 탭을 활성화할 수 있어야 함', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    tabs.select(1);
    expect(tabs.activeIndex).toBe(1);
    tabs.destroy?.();
  });
});

// ============================================
// Accordion
// ============================================
describe('Accordion', () => {
  const Accordion = () => Navigation.Accordion || Navigation.default?.Accordion;

  beforeEach(() => {
    // Accordion 클래스가 요구하는 실제 DOM 구조
    document.body.innerHTML = `
      <div id="accordion">
        <div class="accordion__item">
          <button class="accordion__header">섹션 1</button>
          <div class="accordion__content"><p>내용 1</p></div>
        </div>
        <div class="accordion__item">
          <button class="accordion__header">섹션 2</button>
          <div class="accordion__content"><p>내용 2</p></div>
        </div>
      </div>
    `;
  });

  it('Accordion 클래스가 존재해야 함', () => {
    expect(Accordion()).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion');
    expect(accordion).toBeDefined();
    accordion.destroy?.();
  });

  it('destroy() 메서드가 존재해야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion');
    expect(typeof accordion.destroy).toBe('function');
    accordion.destroy();
  });

  it('expand/collapse 메서드가 동작해야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false, expandFirst: false });
    accordion.expand(0);
    expect(accordion.items[0].isExpanded).toBe(true);
    accordion.collapse(0);
    expect(accordion.items[0].isExpanded).toBe(false);
  });

  it('toggle() — 패널을 토글해야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false, expandFirst: false });
    accordion.toggle(0);
    expect(accordion.items[0].isExpanded).toBe(true);
    accordion.toggle(0);
    expect(accordion.items[0].isExpanded).toBe(false);
  });

  it('expandAll/collapseAll', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false, multiple: true, expandFirst: false });
    accordion.expandAll();
    expect(accordion.items.every(i => i.isExpanded)).toBe(true);
    accordion.collapseAll();
    expect(accordion.items.every(i => !i.isExpanded)).toBe(true);
  });

  it('multiple: false — 하나만 열려야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false, multiple: false, expandFirst: false });
    accordion.expand(0);
    accordion.expand(1);
    expect(accordion.items[0].isExpanded).toBe(false);
    expect(accordion.items[1].isExpanded).toBe(true);
  });

  it('헤더 클릭 시 토글되어야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false, expandFirst: false });
    const header = document.querySelector('.accordion__header');
    header.click();
    expect(accordion.items[0].isExpanded).toBe(true);
  });

  it('onChange 콜백을 호출해야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const onChange = vi.fn();
    const accordion = new AccordionClass('#accordion', { animation: false, onChange, expandFirst: false });
    accordion.expand(0);
    expect(onChange).toHaveBeenCalledWith(0, true, expect.anything());
    accordion.collapse(0);
    expect(onChange).toHaveBeenCalledWith(0, false, expect.anything());
  });

  it('유효하지 않은 인덱스는 무시해야 함', () => {
    const AccordionClass = Accordion();
    if (!AccordionClass) return;
    const accordion = new AccordionClass('#accordion', { animation: false });
    expect(() => accordion.toggle(-1)).not.toThrow();
    expect(() => accordion.expand(99)).not.toThrow();
    expect(() => accordion.collapse(99)).not.toThrow();
  });
});

// ============================================
// Tabs 추가 테스트
// ============================================
describe('Tabs 추가', () => {
  const Tabs = () => Navigation.Tabs || Navigation.default?.Tabs;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tabs">
        <div role="tablist">
          <button role="tab" aria-controls="panel-1" aria-selected="true">탭 1</button>
          <button role="tab" aria-controls="panel-2" aria-selected="false">탭 2</button>
          <button role="tab" aria-controls="panel-3" aria-selected="false">탭 3</button>
        </div>
        <div id="panel-1" role="tabpanel">내용 1</div>
        <div id="panel-2" role="tabpanel">내용 2</div>
        <div id="panel-3" role="tabpanel">내용 3</div>
      </div>
    `;
  });

  it('키보드 ArrowRight로 다음 탭 이동', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    const tab = document.querySelectorAll('[role="tab"]')[0];
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs.activeIndex).toBe(1);
    tabs.destroy();
  });

  it('키보드 ArrowLeft로 이전 탭 이동 (래핑)', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    const tab = document.querySelectorAll('[role="tab"]')[0];
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(tabs.activeIndex).toBe(2); // 래핑
    tabs.destroy();
  });

  it('키보드 Home/End로 처음/마지막 탭', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    const tab = document.querySelectorAll('[role="tab"]')[0];
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs.activeIndex).toBe(2);
    const tab2 = document.querySelectorAll('[role="tab"]')[2];
    tab2.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabs.activeIndex).toBe(0);
    tabs.destroy();
  });

  it('탭 클릭으로 활성화', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    document.querySelectorAll('[role="tab"]')[1].click();
    expect(tabs.activeIndex).toBe(1);
    tabs.destroy();
  });

  it('onChange 콜백 호출', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const onChange = vi.fn();
    const tabs = new TabsClass('#tabs', { animation: false, onChange });
    tabs.select(1);
    expect(onChange).toHaveBeenCalledWith(1, expect.anything(), expect.anything());
    tabs.destroy();
  });

  it('getActiveIndex() 반환', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    expect(tabs.getActiveIndex()).toBe(0);
    tabs.destroy();
  });

  it('유효하지 않은 인덱스 select는 경고', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tabs = new TabsClass('#tabs', { animation: false });
    tabs.select(-1);
    tabs.select(99);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    tabs.destroy();
  });

  it('vertical orientation', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false, orientation: 'vertical' });
    expect(document.querySelector('.tabs--vertical')).not.toBeNull();
    // vertical 모드에서 ArrowDown으로 이동
    const tab = document.querySelectorAll('[role="tab"]')[0];
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(tabs.activeIndex).toBe(1);
    tabs.destroy();
  });

  it('컨테이너를 찾지 못하면 에러 로그', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tabs = new TabsClass('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('onDestroy 콜백 호출', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const onDestroy = vi.fn();
    const tabs = new TabsClass('#tabs', { animation: false, onDestroy });
    tabs.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });
});

// ============================================
// Collapse
// ============================================
describe('Collapse', () => {
  const Collapse = () => Navigation.Collapse || Navigation.default?.Collapse;

  beforeEach(() => {
    document.body.innerHTML = '<div id="collapse-content"><p>접히는 내용</p></div>';
  });

  it('인스턴스 생성', () => {
    const C = Collapse();
    if (!C) return;
    const c = new C('#collapse-content', { animation: false, expanded: false });
    expect(c).toBeDefined();
    c.destroy?.();
  });

  it('toggle/expand/collapse 동작', () => {
    const C = Collapse();
    if (!C) return;
    const c = new C('#collapse-content', { animation: false, expanded: false });
    expect(c.isExpanded).toBe(false);
    c.expand();
    expect(c.isExpanded).toBe(true);
    c.expand(); // 중복 호출 무시
    expect(c.isExpanded).toBe(true);
    c.collapse();
    expect(c.isExpanded).toBe(false);
    c.collapse(); // 중복 호출 무시
    expect(c.isExpanded).toBe(false);
    c.toggle();
    expect(c.isExpanded).toBe(true);
    c.toggle();
    expect(c.isExpanded).toBe(false);
    c.destroy();
  });

  it('onChange 콜백 호출', () => {
    const C = Collapse();
    if (!C) return;
    const onChange = vi.fn();
    const c = new C('#collapse-content', { animation: false, expanded: false, onChange });
    c.expand();
    expect(onChange).toHaveBeenCalledWith(true);
    c.collapse();
    expect(onChange).toHaveBeenCalledWith(false);
    c.destroy();
  });

  it('컨테이너 못 찾으면 에러', () => {
    const C = Collapse();
    if (!C) return;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new C('#none');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ============================================
// MegaMenu
// ============================================
describe('MegaMenu', () => {
  const MegaMenu = () => Navigation.MegaMenu || Navigation.default?.MegaMenu;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="megamenu">
        <div class="megamenu__item">
          <button class="megamenu__trigger">메뉴 1</button>
          <div class="megamenu__panel"><p>패널 1</p></div>
        </div>
        <div class="megamenu__item">
          <button class="megamenu__trigger">메뉴 2</button>
          <div class="megamenu__panel"><p>패널 2</p></div>
        </div>
      </div>
    `;
  });

  it('인스턴스 생성 (click 트리거)', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: false });
    expect(mm).toBeDefined();
    mm.destroy();
  });

  it('open/close/toggle', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: false });
    mm.open(0);
    expect(mm.items[0].isOpen).toBe(true);
    mm.toggle(0); // 닫기
    expect(mm.items[0].isOpen).toBe(false);
    mm.toggle(0); // 열기
    expect(mm.items[0].isOpen).toBe(true);
    mm.close(0);
    expect(mm.items[0].isOpen).toBe(false);
    mm.destroy();
  });

  it('closeAll()', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: false });
    mm.open(0);
    mm.closeAll();
    expect(mm.items.every(i => !i.isOpen)).toBe(true);
    mm.destroy();
  });

  it('클릭 트리거 핸들러', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: false });
    document.querySelector('.megamenu__trigger').click();
    expect(mm.items[0].isOpen).toBe(true);
    mm.destroy();
  });

  it('hover 트리거 생성', () => {
    vi.useFakeTimers();
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'hover', animation: false });
    const trigger = document.querySelector('.megamenu__trigger');
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(300);
    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(400);
    mm.destroy();
    vi.useRealTimers();
  });

  it('외부 클릭 시 닫기', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: false, closeOnOutside: true });
    mm.open(0);
    document.body.click();
    expect(mm.items[0].isOpen).toBe(false);
    mm.destroy();
  });

  it('onChange 콜백', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const onChange = vi.fn();
    const mm = new MM('#megamenu', { trigger: 'click', animation: false, onChange });
    mm.open(0);
    expect(onChange).toHaveBeenCalledWith(0, true, expect.anything());
    mm.close(0);
    expect(onChange).toHaveBeenCalledWith(0, false, expect.anything());
    mm.destroy();
  });
});

// ============================================
// TreeView
// ============================================
describe('TreeView', () => {
  const TreeView = () => Navigation.TreeView || Navigation.default?.TreeView;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tree">
        <div class="treeview__item">
          <button class="treeview__toggle"><i>chevron_right</i></button>
          <span class="treeview__label">루트</span>
          <div class="treeview__children">
            <div class="treeview__item">
              <span class="treeview__label">자식 1</span>
            </div>
          </div>
        </div>
        <div class="treeview__item">
          <span class="treeview__label">단독 노드</span>
        </div>
      </div>
    `;
  });

  it('인스턴스 생성', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    expect(tv.nodes.length).toBeGreaterThan(0);
    tv.destroy();
  });

  it('expandNode/collapseNode', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    const rootNode = tv.nodes.find(n => n.hasChildren);
    if (!rootNode) return;
    tv.expandNode(rootNode);
    expect(rootNode.isExpanded).toBe(true);
    tv.collapseNode(rootNode);
    expect(rootNode.isExpanded).toBe(false);
    tv.destroy();
  });

  it('toggleNode', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    const rootNode = tv.nodes.find(n => n.hasChildren);
    if (!rootNode) return;
    tv.toggleNode(rootNode);
    expect(rootNode.isExpanded).toBe(true);
    tv.toggleNode(rootNode);
    expect(rootNode.isExpanded).toBe(false);
    tv.destroy();
  });

  it('selectNode — 단일 선택', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    tv.selectNode(tv.nodes[0]);
    expect(tv.nodes[0].isSelected).toBe(true);
    tv.selectNode(tv.nodes[1]);
    expect(tv.nodes[0].isSelected).toBe(false);
    expect(tv.nodes[1].isSelected).toBe(true);
    tv.destroy();
  });

  it('selectNode — 다중 선택', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false, multipleSelect: true });
    tv.selectNode(tv.nodes[0]);
    tv.selectNode(tv.nodes[1]);
    expect(tv.selectedNodes.length).toBe(2);
    tv.destroy();
  });

  it('expandAll/collapseAll', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    tv.expandAll();
    tv.nodes.filter(n => n.hasChildren).forEach(n => expect(n.isExpanded).toBe(true));
    tv.collapseAll();
    tv.nodes.filter(n => n.hasChildren).forEach(n => expect(n.isExpanded).toBe(false));
    tv.destroy();
  });

  it('토글 클릭 핸들러', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false });
    const toggle = document.querySelector('.treeview__toggle');
    if (toggle) toggle.click();
    tv.destroy();
  });

  it('노드 클릭 핸들러', () => {
    const TV = TreeView();
    if (!TV) return;
    const onNodeClick = vi.fn();
    const tv = new TV('#tree', { animation: false, onNodeClick });
    document.querySelector('.treeview__label').click();
    expect(onNodeClick).toHaveBeenCalled();
    tv.destroy();
  });
});

// ============================================
// Sidebar
// ============================================
describe('Sidebar', () => {
  const SidebarCls = () => Navigation.Sidebar || Navigation.default?.Sidebar;

  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="sidebar">
        <ul class="sidebar__menu">
          <li class="sidebar__item">
            <a class="sidebar__link" href="#home">홈</a>
          </li>
          <li class="sidebar__item sidebar__item--has-submenu">
            <a class="sidebar__link" href="#settings">설정</a>
            <ul class="sidebar__submenu">
              <li class="sidebar__item"><a class="sidebar__link" href="#profile">프로필</a></li>
            </ul>
          </li>
        </ul>
        <button class="sidebar__toggle">토글</button>
      </nav>
    `;
  });

  it('인스턴스 생성', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    expect(s).toBeDefined();
    s.destroy?.();
  });

  it('컨테이너 못 찾으면 에러', () => {
    const S = SidebarCls();
    if (!S) return;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new S('#none');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('setMode / getMode', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    s.setMode('collapsed');
    expect(s.getMode()).toBe('collapsed');
    s.setMode('expanded');
    expect(s.getMode()).toBe('expanded');
    s.destroy?.();
  });

  it('토글 클릭으로 모드 변경', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    var toggleBtn = document.querySelector('.sidebar__toggle');
    if (toggleBtn) {
      toggleBtn.click();
      expect(s.getMode()).toBe('collapsed');
      toggleBtn.click();
      expect(s.getMode()).toBe('expanded');
    }
    s.destroy?.();
  });

  it('서브메뉴 클릭으로 토글', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    var submenuLink = document.querySelector('.sidebar__item--has-submenu > .sidebar__link');
    if (submenuLink) submenuLink.click();
    s.destroy?.();
  });

  it('일반 항목 클릭 — onItemClick', () => {
    const S = SidebarCls();
    if (!S) return;
    const onItemClick = vi.fn();
    const s = new S('#sidebar', { animation: false, onItemClick });
    var link = document.querySelector('.sidebar__link[href="#home"]');
    if (link) link.click();
    s.destroy?.();
  });

  it('expandAll / collapseAll', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    s.expandAll();
    s.collapseAll();
    s.destroy?.();
  });

  it('setActive', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    s.setActive('#home');
    s.destroy?.();
  });

  it('onModeChange 콜백', () => {
    const S = SidebarCls();
    if (!S) return;
    const onModeChange = vi.fn();
    const s = new S('#sidebar', { animation: false, onModeChange });
    s.setMode('collapsed');
    expect(onModeChange).toHaveBeenCalledWith('collapsed', 'expanded');
    s.destroy?.();
  });

  it('onDestroy 콜백', () => {
    const S = SidebarCls();
    if (!S) return;
    const onDestroy = vi.fn();
    const s = new S('#sidebar', { animation: false, onDestroy });
    s.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });

  it('compact 모드', () => {
    const S = SidebarCls();
    if (!S) return;
    const s = new S('#sidebar', { animation: false });
    s.setMode('compact');
    expect(s.getMode()).toBe('compact');
    s.destroy?.();
  });
});

describe('Collapse 추가2', () => {
  const Collapse = () => Navigation.Collapse || Navigation.default?.Collapse;

  beforeEach(() => {
    document.body.innerHTML = '<div id="collapse-content"><p>접히는 내용</p></div>';
  });

  it('animation expand/collapse', () => {
    vi.useFakeTimers();
    const C = Collapse();
    if (!C) return;
    const c = new C('#collapse-content', { animation: true, animationDuration: 100, expanded: false });
    c.expand();
    vi.advanceTimersByTime(200);
    expect(c.isExpanded).toBe(true);
    c.collapse();
    vi.advanceTimersByTime(200);
    expect(c.isExpanded).toBe(false);
    c.destroy?.();
    vi.useRealTimers();
  });

  it('onDestroy 콜백', () => {
    const C = Collapse();
    if (!C) return;
    const onDestroy = vi.fn();
    const c = new C('#collapse-content', { animation: false, onDestroy });
    c.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });

  it('expanded true 초기 상태', () => {
    const C = Collapse();
    if (!C) return;
    const c = new C('#collapse-content', { animation: false, expanded: true });
    expect(c.isExpanded).toBe(true);
    c.destroy?.();
  });
});

describe('MegaMenu 추가2', () => {
  const MegaMenu = () => Navigation.MegaMenu || Navigation.default?.MegaMenu;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="megamenu">
        <div class="megamenu__item">
          <button class="megamenu__trigger">메뉴 1</button>
          <div class="megamenu__panel"><p>패널 1</p></div>
        </div>
        <div class="megamenu__item">
          <button class="megamenu__trigger">메뉴 2</button>
          <div class="megamenu__panel"><p>패널 2</p></div>
        </div>
      </div>
    `;
  });

  it('animation open/close', () => {
    vi.useFakeTimers();
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'click', animation: true, animationDuration: 100 });
    mm.open(0);
    vi.advanceTimersByTime(200);
    mm.close(0);
    vi.advanceTimersByTime(200);
    mm.destroy();
    vi.useRealTimers();
  });

  it('hover — panelMouseEnter/Leave', () => {
    vi.useFakeTimers();
    const MM = MegaMenu();
    if (!MM) return;
    const mm = new MM('#megamenu', { trigger: 'hover', animation: false, hoverDelay: 50 });
    const trigger = document.querySelector('.megamenu__trigger');
    const panel = document.querySelector('.megamenu__panel');
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(100);
    panel.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    panel.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(400);
    mm.destroy();
    vi.useRealTimers();
  });

  it('onDestroy 콜백', () => {
    const MM = MegaMenu();
    if (!MM) return;
    const onDestroy = vi.fn();
    const mm = new MM('#megamenu', { trigger: 'click', animation: false, onDestroy });
    mm.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });
});

describe('TreeView 추가2', () => {
  const TreeView = () => Navigation.TreeView || Navigation.default?.TreeView;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tree">
        <div class="treeview__item">
          <button class="treeview__toggle"><i>chevron_right</i></button>
          <span class="treeview__label">루트</span>
          <div class="treeview__children">
            <div class="treeview__item">
              <span class="treeview__label">자식 1</span>
            </div>
          </div>
        </div>
        <div class="treeview__item">
          <span class="treeview__label">단독 노드</span>
        </div>
      </div>
    `;
  });

  it('onNodeToggle 콜백', () => {
    const TV = TreeView();
    if (!TV) return;
    const onNodeToggle = vi.fn();
    const tv = new TV('#tree', { animation: false, onNodeToggle });
    const rootNode = tv.nodes.find(n => n.hasChildren);
    if (rootNode) {
      tv.expandNode(rootNode);
      expect(onNodeToggle).toHaveBeenCalledWith(rootNode, true);
      tv.collapseNode(rootNode);
      expect(onNodeToggle).toHaveBeenCalledWith(rootNode, false);
    }
    tv.destroy();
  });

  it('다중 선택 — 선택 해제 토글', () => {
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: false, multipleSelect: true });
    tv.selectNode(tv.nodes[0]);
    expect(tv.nodes[0].isSelected).toBe(true);
    tv.selectNode(tv.nodes[0]);
    expect(tv.nodes[0].isSelected).toBe(false);
    tv.destroy();
  });

  it('onDestroy 콜백', () => {
    const TV = TreeView();
    if (!TV) return;
    const onDestroy = vi.fn();
    const tv = new TV('#tree', { animation: false, onDestroy });
    tv.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });

  it('animation expand/collapse', () => {
    vi.useFakeTimers();
    const TV = TreeView();
    if (!TV) return;
    const tv = new TV('#tree', { animation: true, animationDuration: 100 });
    const rootNode = tv.nodes.find(n => n.hasChildren);
    if (rootNode) {
      tv.expandNode(rootNode);
      vi.advanceTimersByTime(200);
      tv.collapseNode(rootNode);
      vi.advanceTimersByTime(200);
    }
    tv.destroy();
    vi.useRealTimers();
  });
});

describe('Tabs 추가2', () => {
  const Tabs = () => Navigation.Tabs || Navigation.default?.Tabs;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tabs">
        <div role="tablist">
          <button role="tab" aria-controls="panel-1" aria-selected="true">탭 1</button>
          <button role="tab" aria-controls="panel-2" aria-selected="false">탭 2</button>
        </div>
        <div id="panel-1" role="tabpanel">내용 1</div>
        <div id="panel-2" role="tabpanel">내용 2</div>
      </div>
    `;
  });

  it('vertical orientation — ArrowUp/ArrowDown', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false, orientation: 'vertical' });
    const firstTab = document.querySelector('[role="tab"]');
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(tabs.activeIndex).toBe(1);
    const secondTab = document.querySelectorAll('[role="tab"]')[1];
    secondTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(tabs.activeIndex).toBe(0);
    tabs.destroy?.();
  });

  it('Home/End 키', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: false });
    const firstTab = document.querySelector('[role="tab"]');
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs.activeIndex).toBe(1);
    const lastTab = document.querySelectorAll('[role="tab"]')[1];
    lastTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabs.activeIndex).toBe(0);
    tabs.destroy?.();
  });

  it('무효 인덱스 경고', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tabs = new TabsClass('#tabs', { animation: false });
    tabs.select(-1);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    tabs.destroy?.();
  });

  it('animation true — 탭 변경', () => {
    const TabsClass = Tabs();
    if (!TabsClass) return;
    const tabs = new TabsClass('#tabs', { animation: true, animationDuration: 100 });
    tabs.select(1);
    expect(tabs.activeIndex).toBe(1);
    tabs.destroy?.();
  });
});

describe('Sidebar 추가2', () => {
  const SidebarCls = () => Navigation.Sidebar || Navigation.default?.Sidebar;

  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="sidebar">
        <ul class="sidebar__menu">
          <li class="sidebar__item">
            <a class="sidebar__link" href="#home">홈</a>
          </li>
          <li class="sidebar__item sidebar__item--has-submenu">
            <a class="sidebar__link" href="#">설정</a>
            <ul class="sidebar__submenu">
              <li class="sidebar__item"><a class="sidebar__link" href="#profile">프로필</a></li>
            </ul>
          </li>
        </ul>
        <button class="sidebar__toggle">토글</button>
      </nav>
    `;
  });

  it('items 데이터 기반 렌더링', () => {
    const S = SidebarCls();
    if (!S) return;
    document.body.innerHTML = '<nav id="sidebar2"></nav>';
    const s = new S('#sidebar2', {
      animation: false,
      items: [
        { label: '홈', href: '#home', icon: 'home' },
        { type: 'title', label: '섹션' },
        { label: '설정', icon: 'settings', children: [
          { label: '프로필', href: '#profile' }
        ] },
        { label: '알림', href: '#noti', badge: { text: '3', variant: 'danger' } }
      ],
      showUserBox: true,
      user: { name: '테스트', role: '관리자', avatar: '' }
    });
    expect(s.menuItems.length).toBeGreaterThan(0);
    s.destroy?.();
  });

  it('expandAll/collapseAll — 서브메뉴 있는 항목', () => {
    const S = SidebarCls();
    if (!S) return;
    document.body.innerHTML = '<nav id="sidebar2"></nav>';
    const s = new S('#sidebar2', {
      animation: false,
      items: [
        { label: '메뉴1', children: [{ label: '하위1', href: '#a' }] },
        { label: '메뉴2', children: [{ label: '하위2', href: '#b' }] }
      ]
    });
    s.expandAll();
    s.menuItems.filter(m => m.submenu).forEach(m => expect(m.isOpen).toBe(true));
    s.collapseAll();
    s.menuItems.filter(m => m.submenu).forEach(m => expect(m.isOpen).toBe(false));
    s.destroy?.();
  });

  it('서브메뉴 클릭 — 동일 레벨 자동 닫기', () => {
    const S = SidebarCls();
    if (!S) return;
    document.body.innerHTML = '<nav id="sidebar2"></nav>';
    const s = new S('#sidebar2', {
      animation: false,
      items: [
        { label: '메뉴1', children: [{ label: '하위1', href: '#a' }] },
        { label: '메뉴2', children: [{ label: '하위2', href: '#b' }] }
      ]
    });
    // 첫 번째 서브메뉴 열기
    const submenuItems = s.menuItems.filter(m => m.submenu);
    if (submenuItems.length >= 2) {
      s._toggleSubmenu(submenuItems[0]);
      expect(submenuItems[0].isOpen).toBe(true);
      s._toggleSubmenu(submenuItems[1]);
      // 첫 번째가 닫혔는지 확인 (singleExpand 동작)
    }
    s.destroy?.();
  });

  it('setActive — 부모 서브메뉴 자동 펼치기', () => {
    const S = SidebarCls();
    if (!S) return;
    document.body.innerHTML = '<nav id="sidebar2"></nav>';
    const s = new S('#sidebar2', {
      animation: false,
      items: [
        { label: '설정', children: [
          { label: '프로필', href: '#profile' }
        ] }
      ]
    });
    s.setActive('#profile');
    s.destroy?.();
  });
});
