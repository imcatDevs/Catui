# Alerts

알림 메시지 CSS 클래스 — 색상, 스타일 변형, 크기, 닫기 버튼을 제공합니다.

> 소스: `src/styles/components/_alerts.scss`
>
> **이 문서의 핵심**: `.alert` + `.alert--info`/`--success`/`--warning`/`--danger` 색상.
> 스타일: `--filled`/`--outlined`. 구조: `__icon` + `__content` + `__close`.
> Bootstrap 호환: `.alert-primary`~`.alert-dark` 클래스도 지원.

## 기본 사용법

```html
<div class="alert alert--info">
  <span class="alert__icon"><i class="material-icons-outlined">info</i></span>
  <div class="alert__content">기본 알림 메시지입니다.</div>
</div>
```

## BEM 색상 변형

| 클래스 | 설명 |
| --- | --- |
| `.alert--info` | 하늘색 (기본, 클래스 없으면 자동 적용) |
| `.alert--success` | 초록색 (성공) |
| `.alert--warning` | 노란색 (경고) |
| `.alert--danger` | 빨간색 (에러) |
| `.alert--error` | `.alert--danger` alias |

```html
<div class="alert alert--success">
  <span class="alert__icon"><i class="material-icons-outlined">check_circle</i></span>
  <div class="alert__content"><strong>성공!</strong> 저장되었습니다.</div>
</div>
<div class="alert alert--danger">
  <span class="alert__icon"><i class="material-icons-outlined">error</i></span>
  <div class="alert__content"><strong>오류!</strong> 처리 중 문제가 발생했습니다.</div>
</div>
```

## 스타일 변형

| 클래스 | 설명 |
| --- | --- |
| (기본) | 연한 배경 + 색상 테두리 |
| `.alert--filled` | 진한 배경 + 흰색 텍스트 |
| `.alert--outlined` | 투명 배경 + 색상 테두리 |

```html
<div class="alert alert--success alert--filled">진한 배경 알림</div>
<div class="alert alert--warning alert--outlined">테두리만 알림</div>
```

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.alert--sm` | 작은 알림 (작은 패딩/폰트) |
| (기본) | 중간 |
| `.alert--lg` | 큰 알림 (큰 패딩/폰트) |

## 닫기 버튼

```html
<div class="alert alert--warning alert--dismissible">
  <span class="alert__icon"><i class="material-icons-outlined">warning</i></span>
  <div class="alert__content">닫을 수 있는 경고 메시지</div>
  <button class="alert__close">&times;</button>
</div>
```

## 액션 버튼

```html
<div class="alert alert--info">
  <div class="alert__content">
    업데이트가 있습니다.
    <div class="alert__actions">
      <button class="btn btn--primary btn--sm">업데이트</button>
      <button class="btn btn--ghost btn--sm">나중에</button>
    </div>
  </div>
</div>
```

## 알림 목록

```html
<div class="alert-list">
  <div class="alert alert--info">알림 1</div>
  <div class="alert alert--success">알림 2</div>
</div>
```

## BEM 구조 클래스

| 클래스 | 설명 |
| --- | --- |
| `.alert` | 컨테이너 |
| `.alert__icon` | 아이콘 영역 |
| `.alert__content` | 메시지 영역 |
| `.alert__title` | 제목 영역 (0.9375rem, bold) |
| `.alert__message` | 메시지 영역 (opacity: 0.9) |
| `.alert__close` | 닫기 버튼 |
| `.alert__actions` | 액션 버튼 영역 |
| `.alert--dismissible` | 닫기 애니메이션 |
| `.alert.is-hiding` | 닫기 애니메이션 진행 중 |
| `.alert-list` | 알림 스택 |

## Bootstrap 호환 클래스

BEM 외에 Bootstrap 스타일 클래스도 지원합니다.

| 클래스 | 설명 |
| --- | --- |
| `.alert-primary`~`.alert-dark` | 8가지 색상 (primary/secondary/success/danger/warning/info/light/dark) |
| `.alert-heading` | 알림 내 제목 |
| `.alert-link` | 알림 내 링크 (굵은 밑줄) |
| `.alert-dismissible` | 닫기 버튼 영역 (Bootstrap 호환) |

```html
<div class="alert alert-success alert-dismissible">
  <h5 class="alert-heading">성공!</h5>
  <p>작업이 완료되었습니다. <a href="#" class="alert-link">상세 보기</a></p>
  <hr>
  <p class="mb-0">추가 정보가 여기에 표시됩니다.</p>
</div>
```

## 관련 문서

- [Feedback 모듈](../modules/feedback.md) — Toast, Notification (JS 동적 알림)
