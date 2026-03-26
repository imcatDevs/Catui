# Lists

리스트 컴포넌트 CSS 클래스 — 항목 나열, 구분선, 아이콘, 크기 변형, Bootstrap list-group 호환을 제공합니다.

> 소스: `src/styles/components/_lists.scss`
>
> **이 문서의 핵심**: `.list` > `.list__item` 구조. `__icon`/`__content`/`__title`/`__subtitle`/`__meta`/`__actions` 요소.
> 변형: `--divided`/`--bordered`/`--hoverable`/`--flush`. 크기: `--sm`/`--lg`.
> Bootstrap 호환: `.list-group` > `.list-group-item`.

## 기본 사용법

```html
<ul class="list">
  <li class="list__item">항목 1</li>
  <li class="list__item">항목 2</li>
  <li class="list__item">항목 3</li>
</ul>
```

## 구조 요소

| 클래스 | 설명 |
| --- | --- |
| `.list` | 리스트 컨테이너 |
| `.list__item` | 항목 (flex, gap 내장) |
| `.list__icon` | 아이콘/아바타 영역 |
| `.list__content` | 텍스트 콘텐츠 영역 (flex: 1) |
| `.list__title` | 제목 (말줄임 포함) |
| `.list__subtitle` | 부제목 (작은 글씨, 회색) |
| `.list__meta` | 우측 메타 정보 (날짜, 시간) |
| `.list__actions` | 우측 액션 버튼 (호버 시 표시) |

```html
<ul class="list list--divided">
  <li class="list__item">
    <div class="list__icon">
      <i class="material-icons-outlined text-primary">inbox</i>
    </div>
    <div class="list__content">
      <div class="list__title">받은 편지함</div>
      <div class="list__subtitle">3개의 새 메시지</div>
    </div>
    <span class="list__meta">2분 전</span>
  </li>
</ul>
```

## BEM 변형

| 클래스 | 설명 |
| --- | --- |
| `.list--divided` | 항목 사이 구분선 |
| `.list--bordered` | 외곽 테두리 + 둥근 모서리 |
| `.list--flush` | 좌우 패딩 제거 |
| `.list--hoverable` | 호버 시 배경 변경 |

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.list--sm` | 작은 패딩/폰트/아이콘 |
| (기본) | 중간 |
| `.list--lg` | 큰 패딩/폰트/아이콘 |

## 특수 리스트

| 클래스 | 설명 |
| --- | --- |
| `.list--inline` | 가로 배치 (flex-wrap) |
| `.list--numbered` | 순서 번호 (counter) |
| `.list--bullet` | 불릿 (•) |
| `.list--check` | 체크 (✓) |

```html
<ol class="list list--numbered">
  <li class="list__item">첫 번째</li>
  <li class="list__item">두 번째</li>
</ol>
```

## Description List

| 클래스 | 설명 |
| --- | --- |
| `.dl` | 설명 목록 |
| `.dl--horizontal` | 가로 배치 (Grid, label: auto / value: 1fr) |

```html
<dl class="dl dl--horizontal">
  <dt>이름</dt><dd>홍길동</dd>
  <dt>이메일</dt><dd>hong@test.com</dd>
</dl>
```

## Bootstrap 호환: List Group

| 클래스 | 설명 |
| --- | --- |
| `.list-group` | 리스트 그룹 컨테이너 |
| `.list-group-item` | 항목 |
| `.list-group-item-action` | 클릭 가능 항목 |
| `.list-group-item.active` | 활성 상태 |
| `.list-group-item.disabled` | 비활성 상태 |
| `.list-group-flush` | 외곽 테두리/둥근 모서리 제거 |
| `.list-group-horizontal` | 가로 배치 |
| `.list-group-numbered` | 순서 번호 |
| `.list-group-item-primary`~`-dark` | 색상 변형 (8가지) |

```html
<ul class="list-group">
  <li class="list-group-item active">활성 항목</li>
  <li class="list-group-item">일반 항목</li>
  <li class="list-group-item list-group-item-action">클릭 가능</li>
  <li class="list-group-item list-group-item-danger">위험 항목</li>
</ul>
```

## 관련 문서

- [Navigation 모듈](../modules/navigation.md) — Sidebar, Accordion
