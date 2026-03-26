# Typography

타이포그래피 스타일 — 제목, 본문, 인라인 텍스트, 텍스트 유틸리티 클래스를 제공합니다.

> 소스: `src/styles/base/_typography.scss`
>
> **이 문서의 핵심**: `.display-1`~`.display-6` 대형 제목, `.h1`~`.h6` 제목, `.body1`/`.body2` 본문,
> `.text-center`/`.fw-bold` 등 텍스트 유틸리티. BEM 없이 단독 클래스 사용.

## 디스플레이 제목

대형 히어로 섹션용 제목입니다.

| 클래스 | 설명 |
| --- | --- |
| `.display-1` | 가장 큰 디스플레이 (약 3.5rem) |
| `.display-2` | 디스플레이 2 (약 3rem) |
| `.display-3` | 디스플레이 3 (약 2.5rem) |
| `.display-4` | 디스플레이 4 (약 2rem) |
| `.display-5` | 디스플레이 5 (1.5rem) |
| `.display-6` | 디스플레이 6 (1.25rem) |

```html
<h1 class="display-1">큰 제목</h1>
<h2 class="display-3">중간 제목</h2>
```

## 제목 (H1~H6)

HTML 태그(`<h1>`~`<h6>`) 또는 클래스(`.h1`~`.h6`)로 적용합니다.

| 클래스 | 설명 |
| --- | --- |
| `.h1` | h1 스타일 |
| `.h2` | h2 스타일 |
| `.h3` | h3 스타일 |
| `.h4` | h4 스타일 |
| `.h5` | h5 스타일 |
| `.h6` | h6 스타일 |

```html
<p class="h3">p 태그지만 h3 스타일</p>
<span class="h5">span에 h5 스타일</span>
```

## 본문 텍스트

| 클래스 | 설명 |
| --- | --- |
| `.body1` | 기본 본문 (1rem) |
| `.body2` | 작은 본문 (0.875rem) |
| `.caption` | 캡션 텍스트 (0.75rem) |
| `.overline` | 오버라인 (대문자, 작은 크기) |
| `.lead` | 리드 텍스트 (큰 도입 문단) |

```html
<p class="lead">도입 문단 텍스트</p>
<p class="body1">기본 본문 텍스트</p>
<p class="body2 text-secondary">작은 보조 텍스트</p>
<span class="caption text-muted">캡션</span>
<span class="overline">오버라인 라벨</span>
```

## 텍스트 정렬

| 클래스 | 설명 |
| --- | --- |
| `.text-left` | 왼쪽 정렬 |
| `.text-center` | 가운데 정렬 |
| `.text-right` | 오른쪽 정렬 |
| `.text-justify` | 양쪽 정렬 |

## 텍스트 변환

| 클래스 | 설명 |
| --- | --- |
| `.text-lowercase` | 소문자 |
| `.text-uppercase` | 대문자 |
| `.text-capitalize` | 첫 글자 대문자 |

## 텍스트 색상

| 클래스 | 설명 |
| --- | --- |
| `.text-primary` | 주요 색상 (파랑) |
| `.text-secondary` | 보조 색상 (회색) |
| `.text-muted` | 흐린 텍스트 |
| `.text-success` | 성공 (초록) |
| `.text-danger` | 위험 (빨강) |
| `.text-warning` | 경고 (노랑) |
| `.text-info` | 정보 (하늘) |
| `.text-white` | 흰색 |
| `.text-black` | 검정색 |
| `.text-light` | 밝은 회색 (#f8f9fa) |
| `.text-dark` | 어두운 텍스트 (text-primary 변수) |
| `.text-body` | 본문 색상 (text-primary 변수) |
| `.text-disabled` | 비활성화 텍스트 |

## 폰트 굵기

| 클래스 | 설명 |
| --- | --- |
| `.fw-bold` | 굵게 (700) |
| `.fw-semibold` | 중간 굵기 (600) |
| `.fw-medium` | 중간 (500) |
| `.fw-normal` | 보통 (400) |
| `.fw-light` | 얇게 (300) |

## 기타

| 클래스 | 설명 |
| --- | --- |
| `.text-truncate` | 한 줄 말줄임 (overflow: hidden + ellipsis) |
| `.text-break` | 긴 텍스트 줄바꿈 |
| `.text-nowrap` | 줄바꿈 금지 |
| `.text-wrap` | 줄바꿈 허용 (normal) |
| `.lh-1` | line-height: 1 |
| `.lh-sm` | line-height: 1.25 |
| `.lh-base` | line-height: 1.5 |
| `.lh-lg` | line-height: 2 |

## Bootstrap 호환 별칭

Bootstrap 클래스명과 호환되는 별칭입니다.

| 클래스 | 설명 |
| --- | --- |
| `.text-start` | 왼쪽 정렬 (`.text-left` 별칭) |
| `.text-end` | 오른쪽 정렬 (`.text-right` 별칭) |
| `.fst-italic` | 기울임 (font-style: italic) |
| `.fst-normal` | 기울임 해제 (font-style: normal) |
| `.text-decoration-none` | 텍스트 장식 제거 |
| `.text-decoration-underline` | 밑줄 |
| `.text-decoration-line-through` | 취소선 |

## 관련 문서

- [Utilities](utilities.md) — 전체 유틸리티 클래스
- [Buttons](buttons.md) — 버튼 색상 변형
