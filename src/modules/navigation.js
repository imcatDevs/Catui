/**
 * Navigation Components Module (Aggregator)
 * @module modules/navigation
 * @description 네비게이션 컴포넌트 모듈
 * - Tabs: 탭 네비게이션
 * - Accordion: 아코디언
 * - Collapse: 단일 접기/펼치기
 * - MegaMenu: 메가 메뉴
 * - TreeView: 트리 뷰
 * - Sidebar: 사이드바 네비게이션
 *
 * 개별 로딩: IMCAT.use('navigation/tabs'), IMCAT.use('navigation/accordion') 등
 * 전체 로딩: IMCAT.use('navigation')
 */

import { Tabs } from './navigation/tabs.js';
import { Accordion } from './navigation/accordion.js';
import { Collapse } from './navigation/collapse.js';
import { MegaMenu } from './navigation/megamenu.js';
import { TreeView } from './navigation/treeview.js';
import { Sidebar } from './navigation/sidebar.js';

export { Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar };
export default { Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar };
