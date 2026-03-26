# Progress

프로그레스 바 CSS 클래스 — 진행률 표시, 색상, 크기, 스트라이프, 수직, 다중 바를 제공합니다.

> 소스: `src/styles/components/_progress.scss`
>
> **이 문서의 핵심**: `.progress` > `.progress__bar` 구조. width로 값 설정.
> 색상: `.progress--success` 등 **컨테이너**에 적용. 스트라이프/애니메이션도 **컨테이너** 수정자.

## 기본 사용법

```html
<div class="progress">
  <div class="progress__bar" style="width: 60%"></div>
</div>
```

## 색상

**컨테이너**에 색상 수정자를 적용합니다.

| 클래스 | 설명 |
| --- | --- |
| (기본) | Primary 색상 |
| `.progress--success` | 초록색 |
| `.progress--warning` | 노란색 |
| `.progress--danger` | 빨간색 |
| `.progress--error` | 빨간색 (danger alias) |
| `.progress--info` | 하늘색 |
| `.progress--secondary` | 회색 |

```html
<div class="progress progress--success">
  <div class="progress__bar" style="width: 75%"></div>
</div>
<div class="progress progress--danger">
  <div class="progress__bar" style="width: 25%"></div>
</div>
```

## 크기

| 클래스 | 높이 | 설명 |
| --- | --- | --- |
| `.progress--xs` | 0.25rem | 초소형 |
| `.progress--sm` | 0.375rem | 소형 |
| (기본) | 0.5rem | 중형 |
| `.progress--lg` | 0.75rem | 대형 |
| `.progress--xl` | 1rem | 초대형 |
| `.progress--xxl` | 1.25rem | 최대형 |

```html
<div class="progress progress--xs">
  <div class="progress__bar" style="width: 40%"></div>
</div>
<div class="progress progress--xl">
  <div class="progress__bar" style="width: 80%"></div>
</div>
```

## 스트라이프 & 애니메이션

**컨테이너**에 수정자를 적용합니다 (`.progress__bar`가 아님).

```html
<div class="progress progress--striped">
  <div class="progress__bar" style="width: 60%"></div>
</div>
<div class="progress progress--striped progress--animated">
  <div class="progress__bar" style="width: 80%"></div>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.progress--striped` | 스트라이프 패턴 |
| `.progress--animated` | 스트라이프 움직임 (striped 필수) |

## Indeterminate (무한 로딩)

진행률을 알 수 없을 때 사용합니다.

```html
<div class="progress progress--indeterminate">
  <div class="progress__bar"></div>
</div>
```

## 라벨 표시

`.progress--labeled`로 라벨 영역을 확보합니다 (높이 자동 확대).

```html
<div class="progress progress--labeled">
  <div class="progress__bar" style="width: 75%"></div>
  <span class="progress__label">75%</span>
</div>
```

## 다중 바 (스택)

```html
<div class="progress progress--stacked">
  <div class="progress__bar" style="width: 30%; background: var(--success-color)"></div>
  <div class="progress__bar" style="width: 20%; background: var(--warning-color)"></div>
  <div class="progress__bar" style="width: 10%; background: var(--danger-color)"></div>
</div>
```

## 수직 프로그레스

```html
<!-- 상단 시작 (기본) -->
<div class="progress progress--vertical">
  <div class="progress__bar" style="height: 60%"></div>
</div>

<!-- 하단 시작 -->
<div class="progress progress--vertical-bottom">
  <div class="progress__bar" style="height: 60%"></div>
</div>
```

## 전체 클래스 목록

| 클래스 | 설명 |
| --- | --- |
| `.progress` | 컨테이너 |
| `.progress__bar` | 진행 바 (width/height 필수) |
| `.progress--xs`~`--xxl` | 크기 (xs/sm/기본/lg/xl/xxl) |
| `.progress--success`/`warning`/`danger`/`error`/`info`/`secondary` | 색상 |
| `.progress--striped` | 스트라이프 |
| `.progress--animated` | 스트라이프 애니메이션 |
| `.progress--indeterminate` | 무한 로딩 |
| `.progress--labeled` | 라벨 영역 확보 |
| `.progress__label` | 라벨 텍스트 |
| `.progress--stacked` | 다중 바 |
| `.progress--vertical` | 수직 (상단 시작) |
| `.progress--vertical-bottom` | 수직 (하단 시작) |

## 관련 문서

- [Feedback 모듈](../modules/feedback.md) — ProgressTracker (JS 컴포넌트)
