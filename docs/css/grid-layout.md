# Grid & Layout

CSS Grid, Flexbox, 반응형 레이아웃 유틸리티를 제공합니다.

> 소스: `src/styles/base/_typography.scss` (유틸리티 섹션)
>
> **이 문서의 핵심**: `.grid` + `.grid-cols-*` + `.col-span-*` CSS Grid 유틸리티. `.d-flex` + `align-items-*` + `justify-content-*` Flexbox.
> 반응형: xs(<640) / sm(≥640) / md(≥768) / lg(≥1024) / xl(≥1280) / 2xl(≥1536).

## CSS Grid

### 그리드 컨테이너

| 클래스 | 설명 |
| --- | --- |
| `.grid` | CSS Grid 컨테이너 (`display: grid`) |
| `.d-grid` | `.grid` 별칭 |
| `.grid-cols-1` ~ `.grid-cols-12` | 컬럼 수 (`grid-template-columns: repeat(N, 1fr)`) |
| `.col-span-1` ~ `.col-span-12` | 컬럼 병합 (`grid-column: span N`) |
| `.col-span-full` | 전체 너비 (`grid-column: 1 / -1`) |
| `.card-grid` | 카드 자동 배치 (`auto-fill, minmax(280px, 1fr)`) |
| `.grid-rows-1` ~ `.grid-rows-6` | 행 수 (`grid-template-rows: repeat(N, minmax(0, 1fr))`) |
| `.row-span-1` ~ `.row-span-6` | 행 병합 (`grid-row: span N`) |
| `.row-span-full` | 전체 높이 (`grid-row: 1 / -1`) |

### 12컬럼 그리드

```html
<div class="grid grid-cols-12 gap-2">
  <div class="col-span-4">4칸</div>
  <div class="col-span-4">4칸</div>
  <div class="col-span-4">4칸</div>
</div>

<div class="grid grid-cols-12 gap-2">
  <div class="col-span-3">3칸</div>
  <div class="col-span-6">6칸</div>
  <div class="col-span-3">3칸</div>
</div>
```

### 자동 그리드

```html
<!-- 3열 그리드 -->
<div class="grid grid-cols-3 gap-3">
  <div>항목 1</div>
  <div>항목 2</div>
  <div>항목 3</div>
</div>

<!-- 카드 자동 배치 -->
<div class="card-grid gap-3">
  <div class="card"><div class="card__body">카드</div></div>
  <div class="card"><div class="card__body">카드</div></div>
  <div class="card"><div class="card__body">카드</div></div>
</div>
```

## Flexbox 유틸리티

```html
<div class="d-flex align-items-center justify-content-between gap-3">
  <div>왼쪽</div>
  <div>오른쪽</div>
</div>

<div class="d-flex flex-column gap-2">
  <div>위</div>
  <div>아래</div>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.d-flex` | display: flex |
| `.d-inline-flex` | display: inline-flex |
| `.flex-row` | 가로 방향 (기본) |
| `.flex-column` | 세로 방향 |
| `.flex-wrap` | 줄바꿈 허용 |
| `.flex-nowrap` | 줄바꿈 금지 |
| `.align-items-start` | 상단 정렬 |
| `.align-items-center` | 중앙 정렬 |
| `.align-items-end` | 하단 정렬 |
| `.align-items-stretch` | 늘리기 (기본) |
| `.justify-content-start` | 시작 배치 |
| `.justify-content-center` | 중앙 배치 |
| `.justify-content-end` | 끝 배치 |
| `.justify-content-between` | 균등 배치 (양끝) |
| `.justify-content-around` | 균등 배치 (주변) |

## Gap

| 클래스 | 설명 |
| --- | --- |
| `.gap-0` | gap: 0 |
| `.gap-1` | gap: 0.25rem |
| `.gap-2` | gap: 0.5rem |
| `.gap-3` | gap: 1rem |
| `.gap-4` | gap: 1.5rem |
| `.gap-5` | gap: 3rem |

## 반응형 브레이크포인트

| 이름 | 최소 너비 |
| --- | --- |
| xs | 0 (기본) |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

## SPA 레이아웃 예시

```html
<div class="d-flex" style="min-height:100vh">
  <aside style="width:240px;border-right:1px solid var(--border-color)">
    사이드바
  </aside>
  <main style="flex:1;padding:2rem">
    콘텐츠
  </main>
</div>
```

## 관련 문서

- [Cards](cards.md) — 카드 그리드 배치
- [Utilities](utilities.md) — 전체 유틸리티 클래스
- [구현 패턴](../PATTERNS.md) — SPA 레이아웃 패턴
