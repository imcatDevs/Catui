# Tables

테이블 컴포넌트 CSS 클래스 — 스트라이프, 호버, 테두리, 크기, 정렬, 상태를 제공합니다.

> 소스: `src/styles/components/_tables.scss`
>
> **이 문서의 핵심**: `.table` 기본 + `--striped`/`--bordered`/`--hover`/`--borderless` 변형.
> 크기: `--sm`/`--lg`. 반응형: `.table-wrapper` 또는 `.table-responsive` 래퍼.
> Bootstrap 호환 클래스 병행 지원.

## 기본 사용법

```html
<table class="table">
  <thead>
    <tr><th>이름</th><th>이메일</th><th>역할</th></tr>
  </thead>
  <tbody>
    <tr><td>홍길동</td><td>hong@test.com</td><td>관리자</td></tr>
    <tr><td>김철수</td><td>kim@test.com</td><td>사용자</td></tr>
  </tbody>
</table>
```

## BEM 변형

| 클래스 | 설명 |
| --- | --- |
| `.table` | 기본 테이블 |
| `.table--striped` | 홀짝 행 배경색 |
| `.table--bordered` | 전체 테두리 |
| `.table--borderless` | 테두리 없음 |
| `.table--hover` | 행 호버 효과 |
| `.table--sm` | 컴팩트 (작은 패딩/폰트) |
| `.table--lg` | 넉넉한 패딩/폰트 |
| `.table--selectable` | 행 클릭 가능 (커서 변경) |

```html
<table class="table table--striped table--bordered table--hover">
  <thead>
    <tr><th>ID</th><th>이름</th><th>상태</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>홍길동</td><td><span class="badge badge--success">활성</span></td></tr>
    <tr><td>2</td><td>김철수</td><td><span class="badge badge--danger">비활성</span></td></tr>
  </tbody>
</table>
```

## 반응형 테이블

`.table-wrapper` 또는 `.table-responsive`로 감싸면 가로 스크롤됩니다.

```html
<div class="table-responsive">
  <table class="table table--bordered" style="min-width:600px">
    <!-- 넓은 테이블 내용 -->
  </table>
</div>
```

## 정렬 / 셀 유틸리티

| 클래스 | 설명 |
| --- | --- |
| `.align-top` | 셀 상단 정렬 |
| `.align-middle` | 셀 중앙 정렬 |
| `.align-bottom` | 셀 하단 정렬 |
| `.table__sortable` | 정렬 가능 헤더 (커서+아이콘) |
| `.table__sortable.is-asc` | 오름차순 |
| `.table__sortable.is-desc` | 내림차순 |
| `.table__truncate` | 셀 텍스트 말줄임 (max-width: 200px) |

## 행/셀 상태

| 클래스 | 설명 |
| --- | --- |
| `tr.is-active` | 선택된 행 |
| `tr.is-disabled` | 비활성 행 |
| `tr.is-highlight` | 강조 행 |

## 추가 기능

| 클래스 | 설명 |
| --- | --- |
| `.table__actions` | 행 끝 액션 버튼 영역 |
| `.table__empty` | 빈 상태 메시지 (td colspan) |
| `.table__loading` | 로딩 오버레이 |
| `.table-fixed-header` | 헤더 고정 (스크롤) |

## Bootstrap 호환 클래스

| 클래스 | 설명 |
| --- | --- |
| `.table-striped` | 스트라이프 |
| `.table-bordered` | 테두리 |
| `.table-borderless` | 테두리 없음 |
| `.table-hover` | 호버 |
| `.table-sm` | 컴팩트 |
| `.table-dark` | 어두운 테이블 |
| `.table-light` | 밝은 thead |
| `.table-responsive` | 반응형 래퍼 |
| `.table-striped-columns` | 세로 줄무늬 |
| `.table-active`/`-primary`/`-success`/`-danger`/`-warning`/`-info` | 행/셀 색상 |

## 관련 문서

- [Data Viz 모듈](../modules/data-viz.md) — DataTable (정렬, 검색, 페이지네이션)
- [Badges](badges.md) — 테이블 내 상태 배지
