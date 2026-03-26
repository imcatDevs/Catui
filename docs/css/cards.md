# Cards

카드 컴포넌트 — 콘텐츠를 그룹화하는 유연한 컨테이너입니다.

> 소스: `src/styles/components/_cards.scss`
>
> **이 문서의 핵심**: `.card` 기본 + `__header`/`__body`/`__footer` 영역 + `--outlined`/`--elevated`/`--filled`/`--flat` 변형.
> BEM: `.card` (블록), `.card__body` (요소), `.card--outlined` (수정자).

## 기본 구조

```html
<div class="card">
  <div class="card__header">
    <h4 class="card__title">카드 제목</h4>
    <p class="card__subtitle">부제목</p>
  </div>
  <div class="card__body">
    <p>카드 본문 내용입니다.</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary btn--sm">확인</button>
  </div>
</div>
```

## 구조 클래스

| 클래스 | 설명 |
| --- | --- |
| `.card` | 카드 컨테이너 |
| `.card__header` | 헤더 영역 |
| `.card__body` | 본문 영역 |
| `.card__footer` | 푸터 영역 |
| `.card__title` | 제목 |
| `.card__subtitle` | 부제목 |
| `.card__text` | 본문 텍스트 |

## BEM 변형

| 클래스 | 설명 |
| --- | --- |
| `.card--outlined` | 테두리만 (그림자 없음) |
| `.card--elevated` | 강한 그림자 (테두리 없음) |
| `.card--flat` | 배경 투명, 테두리/그림자 없음 |
| `.card--filled` | 연한 배경 (테두리 없음) |
| `.card--horizontal` | 가로 레이아웃 (이미지 옆 배치) |
| `.card--clickable` | 클릭 가능 카드 (호버 효과) |
| `.card--primary` | Primary 색상 테두리 + 헤더 배경 |
| `.card--success` | Success 색상 |
| `.card--warning` | Warning 색상 |
| `.card--danger` | Danger 색상 |
| `.card--info` | Info 색상 |

```html
<div class="card card--outlined">
  <div class="card__body">테두리만 있는 카드</div>
</div>
<div class="card card--elevated">
  <div class="card__body">그림자 카드</div>
</div>
```

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.card--sm` | 작은 패딩/폰트 |
| (기본) | 중간 |
| `.card--lg` | 큰 패딩/폰트 |

## 구조 클래스 (추가)

| 클래스 | 설명 |
| --- | --- |
| `.card__actions` | 헤더 우측 액션 버튼 영역 |
| `.card__image` | 이미지 영역 (16:9 비율) |
| `.card__image--square` | 이미지 1:1 비율 |
| `.card__image--portrait` | 이미지 3:4 비율 |
| `.card__header--no-border` | 헤더 하단 테두리 제거 |
| `.card__header--transparent` | 헤더 배경 투명 |
| `.card__footer--no-border` | 푸터 상단 테두리 제거 |
| `.card__footer--between` | 푸터 양쪽 정렬 |
| `.card__footer--start` | 푸터 좌측 정렬 |

## 이미지 카드

BEM(`.card__image`)과 Bootstrap 호환(`.card-img-top`) 모두 사용 가능합니다.

```html
<!-- Bootstrap 호환 -->
<div class="card">
  <img src="image.jpg" class="card-img-top" alt="...">
  <div class="card-body">
    <h4 class="card-title">이미지 카드</h4>
    <p class="card-text">이미지와 함께 표시되는 카드입니다.</p>
  </div>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.card-img-top` | 상단 이미지 |
| `.card-img-bottom` | 하단 이미지 |
| `.card-img` | 전체 이미지 |
| `.card-img-overlay` | 이미지 위 오버레이 |

## 가로 카드

```html
<div class="card card--horizontal">
  <img src="image.jpg" alt="..." style="width:200px;object-fit:cover">
  <div class="card__body">
    <h4 class="card__title">가로 카드</h4>
    <p>이미지와 콘텐츠가 나란히 배치됩니다.</p>
  </div>
</div>
```

## 카드 레이아웃

| 클래스 | 설명 |
| --- | --- |
| `.card-grid` | CSS Grid 카드 레이아웃 (auto-fill, 280px) |
| `.card-list` | 세로 스택 레이아웃 |
| `.card-group` | 카드 그룹 (연결된 카드) |

```html
<div class="card-grid">
  <div class="card"><div class="card__body">카드 1</div></div>
  <div class="card"><div class="card__body">카드 2</div></div>
  <div class="card"><div class="card__body">카드 3</div></div>
</div>
```

## Bootstrap 호환 클래스

| 클래스 | 설명 |
| --- | --- |
| `.card-body` | 본문 (`.card__body` 호환) |
| `.card-header` | 헤더 |
| `.card-footer` | 푸터 |
| `.card-title` / `.card-subtitle` / `.card-text` / `.card-link` | 콘텐츠 |
| `.card-action` / `.card-action-item` | 액션 도구 |
| `.card-bordered` | 좌측 액센트 보더 |
| `.card-filled` | 연한 배경 |
| `.card-inverse` / `.text-white` | 어두운 배경 위 밝은 텍스트 |
| `.card-horizontal` | 가로 카드 (Bootstrap 스타일) |
| `.card-header-tabs` / `.card-header-pills` | 헤더 내 탭/필 |
| `.stretched-link` | 카드 전체 클릭 영역 |
| `.text-bg-primary`~`dark` | 배경색 카드 |
| `.border-primary`~`dark` | 테두리 색상 |

## 관련 문서

- [Grid & Layout](grid-layout.md) — 카드 그리드 배치
- [Buttons](buttons.md) — 카드 내 버튼
