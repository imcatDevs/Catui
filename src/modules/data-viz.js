/**
 * Data Visualization Module (Aggregator)
 * @module modules/data-viz
 * @description 데이터 시각화 컴포넌트 모듈
 * - DataTable: 데이터 테이블 (정렬, 필터, 검색, 페이지네이션)
 * - Chart: 간단한 차트 (bar, line, pie, doughnut, area, horizontalBar)
 * - Masonry: 타일 레이아웃 (필터, 애니메이션)
 * - Kanban: 칸반 보드 (드래그 앤 드롭, 우선순위, 담당자)
 * - Calendar: 캘린더 (월/주간 뷰, 이벤트 카테고리)
 *
 * 개별 로딩: IMCAT.use('data-viz/datatable'), IMCAT.use('data-viz/chart') 등
 * 전체 로딩: IMCAT.use('data-viz')
 */

import { DataTable } from './data-viz/datatable.js';
import { Chart } from './data-viz/chart.js';
import { Masonry } from './data-viz/masonry.js';
import { Kanban } from './data-viz/kanban.js';
import { Calendar } from './data-viz/calendar.js';

export { DataTable, Chart, Masonry, Kanban, Calendar };
export default { DataTable, Chart, Masonry, Kanban, Calendar };
