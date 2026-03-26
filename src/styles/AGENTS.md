# SCSS 스타일 가이드

## 구조

- `imcat-ui.scss` — 코어 스타일 진입점 (abstracts + base + components만 포함)
- `imcat-ui.all.scss` — 전체 번들 (코어 + 모든 모듈 스타일)
- `abstracts/_variables.scss` — 기본 변수 (색상, 타이포그래피, 간격, z-index 등)
- `abstracts/_tokens.scss` — 자동 생성 컴포넌트 디자인 토큰 (`_variables.scss`에서 분리)
- `modules/` — 컴포넌트별 스타일 파일 (개별 CSS로 빌드됨)

## 네이밍

- BEM 변형: `.imcat-{컴포넌트}__{요소}--{변형}`
- 상태 클래스: `is-active`, `is-visible`, `is-hidden`, `is-disabled`
- CSS 커스텀 속성: `--text-primary`, `--bg-surface` 등

## 테마

- `:root`에 라이트 테마 변수 정의
- `[data-theme="dark"]`에 다크 테마 오버라이드
- 색상값 직접 사용 금지 — 항상 CSS 변수 참조

## 규칙

- 중첩 최대 3단계
- `!important` 최소화
- 모바일 퍼스트 반응형
- 새 모듈 스타일은 `modules/_{모듈명}.scss`에 작성 후 진입점에 import
