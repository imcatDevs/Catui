# Gantt

Gantt — 간트 차트 프로젝트 관리 컴포넌트를 제공합니다.

> 소스: `src/modules/gantt.js`
>
> **이 문서의 핵심**: `IMCAT.use('gantt')` → Gantt.
> tasks 배열: `{ id, name, start, end, progress, dependencies }`.

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
    { id: '2', name: '디자인', start: '2025-01-10', end: '2025-02-01', progress: 80, dependencies: ['1'] },
    { id: '3', name: '개발', start: '2025-02-01', end: '2025-03-15', progress: 40, dependencies: ['2'] },
    { id: '4', name: '테스트', start: '2025-03-10', end: '2025-04-01', progress: 0, dependencies: ['3'] }
  ],
  viewMode: 'week',
  editable: true,
  onUpdate: (task) => console.log('수정:', task)
});
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `tasks` | array | `[]` | 작업 배열 |
| `viewMode` | string | `'week'` | 보기 모드 (`'day'`/`'week'`/`'month'`) |
| `editable` | boolean | `false` | 드래그로 편집 |
| `showProgress` | boolean | `true` | 진행률 표시 |
| `onUpdate` | function | `null` | 작업 수정 콜백 |
| `onClick` | function | `null` | 작업 클릭 콜백 |

## tasks 객체

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `id` | string | 고유 ID |
| `name` | string | 작업명 |
| `start` | string | 시작일 (YYYY-MM-DD) |
| `end` | string | 종료일 |
| `progress` | number | 진행률 (0~100) |
| `dependencies` | string[] | 선행 작업 ID 배열 |
| `color` | string | 바 색상 |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addTask(task)` | 작업 추가 |
| `.removeTask(id)` | 작업 삭제 |
| `.updateTask(id, data)` | 작업 수정 |
| `.setViewMode(mode)` | 보기 모드 변경 |
| `.destroy()` | 제거 |

## 관련 문서

- [Data Viz](data-viz.md) — Calendar, Kanban
