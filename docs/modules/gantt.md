# Gantt

Gantt — 간트 차트 프로젝트 관리 컴포넌트를 제공합니다.

> 소스: `src/modules/gantt.js`
>
> **이 문서의 핵심**: `IMCAT.use('gantt')` → Gantt.
> 일/주/월 뷰 모드, 오늘 라인, 의존성 화살표, 드래그 편집, 그룹/자식 작업 지원.

## 로드 방법

```javascript
const Gantt = await IMCAT.use('gantt');
```

## 기본 사용

```javascript
const Gantt = await IMCAT.use('gantt');
new Gantt('#gantt', {
  tasks: [
    { id: '1', name: '기획', start: '2025-01-01', end: '2025-01-15', progress: 100 },
    { id: '2', name: '디자인', start: '2025-01-10', end: '2025-02-01', progress: 80, dependencies: ['1'], assignee: '김철수' },
    { id: '3', name: '개발', start: '2025-02-01', end: '2025-03-15', progress: 40, dependencies: ['2'], color: '#3b82f6' },
    { id: '4', name: '테스트', start: '2025-03-10', end: '2025-04-01', progress: 0, dependencies: ['3'] }
  ],
  viewMode: 'day',
  editable: true,
  onTaskClick: (task, e) => console.log('클릭:', task),
  onTaskChange: (task) => console.log('변경:', task),
  onViewChange: (mode) => console.log('뷰:', mode)
});
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `tasks` | array | `[]` | 작업 배열 |
| `startDate` | string/Date | `null` | 시작일 (null이면 자동 계산) |
| `endDate` | string/Date | `null` | 종료일 (null이면 자동 계산) |
| `viewMode` | string | `'day'` | 보기 모드 (`'day'`/`'week'`/`'month'`) |
| `todayLine` | boolean | `true` | 오늘 날짜 라인 표시 |
| `weekends` | boolean | `true` | 주말 음영 표시 |
| `editable` | boolean | `false` | 드래그로 편집 |
| `taskHeight` | number | `36` | 작업 바 높이 (px) |
| `rowHeight` | number | `48` | 행 높이 (px) |
| `headerHeight` | number | `60` | 헤더 높이 (px) |
| `sidebarWidth` | number | `280` | 사이드바 너비 (px) |
| `showProgress` | boolean | `true` | 진행률 바 표시 |
| `showDependencies` | boolean | `true` | 의존성 화살표 표시 |
| `colors` | object | `{ primary, success, warning, danger, info }` | 색상 팔레트 |
| `locale` | string | `'ko-KR'` | 날짜 로케일 |
| `dateFormat` | object | `{ day, week, month }` | 뷰별 날짜 형식 (Intl.DateTimeFormat 옵션) |
| `onTaskClick` | function | `null` | 작업 클릭 콜백 `(task, event)` |
| `onTaskChange` | function | `null` | 작업 변경 콜백 `(task)` (드래그 후) |
| `onViewChange` | function | `null` | 뷰 모드 변경 콜백 `(mode)` |

## task 객체

| 키 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | ✓ | 고유 ID |
| `name` | string | ✓ | 작업명 |
| `start` | string | ✓ | 시작일 (YYYY-MM-DD) |
| `end` | string | ✓ | 종료일 (YYYY-MM-DD) |
| `progress` | number | | 진행률 (0~100, 기본 0) |
| `dependencies` | string[] | | 선행 작업 ID 배열 |
| `color` | string | | 바 색상 (기본 `colors.primary`) |
| `assignee` | string | | 담당자 이름 |
| `group` | string | | 그룹명 |
| `collapsed` | boolean | | 하위 작업 접힘 여부 |
| `children` | task[] | | 하위 작업 배열 (중첩 지원) |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setViewMode(mode)` | 보기 모드 변경 (`'day'`/`'week'`/`'month'`) |
| `.setTasks(tasks)` | 작업 배열 교체 |
| `.addTask(task)` | 작업 추가 |
| `.updateTask(id, updates)` | 작업 수정 |
| `.removeTask(id)` | 작업 삭제 |
| `.scrollToTask(id)` | 해당 작업으로 스크롤 |
| `.refresh()` | 차트 새로고침 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Data Viz](data-viz.md) — Calendar, Kanban
