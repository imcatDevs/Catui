# Badges

배지/라벨 CSS 클래스 — 상태 표시, 카운트, 도트 인디케이터를 제공합니다.

> 소스: `src/styles/components/_badges.scss`
>
> **이 문서의 핵심**: `.badge` + `.badge--primary` 등 색상. `.badge--pill` 둥근 형태.
> `.badge--dot` 도트 인디케이터. `.badge--outline-*` 아웃라인.

## 기본 사용법

```html
<span class="badge badge--primary">New</span>
<span class="badge badge--success">완료</span>
<span class="badge badge--danger">3</span>
```

## 색상 변형

| 클래스 | 설명 |
| --- | --- |
| `.badge--primary` | 파란색 |
| `.badge--success` | 초록색 |
| `.badge--warning` | 노란색 |
| `.badge--danger` | 빨간색 |
| `.badge--info` | 하늘색 |
| `.badge--secondary` | 회색 |

> `.badge--dark`, `.badge--light`는 BEM 클래스로 없습니다. Bootstrap 호환 `.badge.bg-dark`, `.badge.bg-light`를 사용하세요.

## Soft 변형

```html
<span class="badge badge--soft badge--primary">Soft Primary</span>
<span class="badge badge--soft badge--danger">Soft Danger</span>
```

## Outlined 변형

```html
<span class="badge badge--outlined badge--primary">Outline Primary</span>
```

## 형태 변형

| 클래스 | 설명 |
| --- | --- |
| `.badge--pill` | 둥근 모서리 (pill) |
| `.badge--dot` | 작은 점 (텍스트 없음) |
| `.badge--circle` | 원형 (숫자 표시용) |

```html
<span class="badge badge--primary badge--pill">Pill</span>
<span class="badge badge--danger badge--dot"></span>
<span class="badge badge--primary badge--circle">5</span>
```

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.badge--sm` | 작은 배지 |
| (기본) | 중간 |
| `.badge--lg` | 큰 배지 |

## 삭제 가능 배지

```html
<span class="badge badge--primary badge--removable">
  태그 <button class="badge__remove">&times;</button>
</span>
```

## 플로팅 배지 (버튼/아이콘 위)

```html
<span class="badge-wrapper">
  <button class="btn btn--primary">알림</button>
  <span class="badge badge--danger badge-float">3</span>
</span>
```

| 클래스 | 설명 |
| --- | --- |
| `.badge-wrapper` | 상대 위치 래퍼 |
| `.badge-float` | 우상단 절대 위치 |

## 배지 그룹

```html
<div class="badge-group">
  <span class="badge badge--primary">태그1</span>
  <span class="badge badge--success">태그2</span>
</div>
```

## Tag (별도 스타일)

`.badge`와 동일하지만 회색 테두리 스타일입니다.

```html
<span class="tag">기본 태그</span>
```

## 상태 인디케이터

배지와 별도의 상태 표시 컴포넌트입니다.

```html
<span class="status status--online"><span class="status__dot"></span> 온라인</span>
<span class="status status--away"><span class="status__dot"></span> 자리 비움</span>
<span class="status status--busy"><span class="status__dot"></span> 바쁨</span>
<span class="status status--offline"><span class="status__dot"></span> 오프라인</span>
```

| 클래스 | 설명 |
| --- | --- |
| `.status` | 상태 컨테이너 (inline-flex) |
| `.status__dot` | 상태 점 (원형, 필수 자식 요소) |
| `.status--online` | 초록 |
| `.status--away` | 노랑 |
| `.status--busy` | 빨강 |
| `.status--offline` | 회색 |

## Bootstrap 호환 클래스

| 클래스 | 설명 |
| --- | --- |
| `.badge.bg-primary`~`.bg-dark` | 배경색 (8가지) |
| `.badge-soft-primary`~`-dark` | Soft 배지 (7가지) |
| `.badge-outline-primary`~`-dark` | Outline 배지 (7가지) |
| `.rounded-pill` | 둥근 형태 (전역 유틸리티) |

```html
<span class="badge bg-primary">Primary</span>
<span class="badge badge-soft-success">Soft Success</span>
<span class="badge badge-outline-danger">Outline Danger</span>
```

## 관련 문서

- [Buttons](buttons.md) — 버튼 내 배지
- [Tables](tables.md) — 테이블 내 상태 배지
