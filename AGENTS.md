# IMCAT UI Framework — 프로젝트 가이드

## 개요

IMCAT UI는 경량 제로빌드 ES6+ JavaScript 웹 프레임워크입니다.
동적 모듈 로딩, SPA 라우팅, XSS 자동 방어를 핵심으로 합니다.

## 언어 규칙

- 모든 코드 주석, 문서, 커밋 메시지는 **한국어**로 작성
- 변수명, 함수명, 클래스명은 **영어** 사용

## 핵심 아키텍처

- `src/core/index.js`의 `IMCATCore`가 프레임워크 진입점
- 전역 `IMCAT` 객체로 노출 (IIFE 빌드)
- 모듈은 `IMCAT.use('모듈명')`으로 동적 로드
- 하위 모듈은 `IMCAT.use('모듈명/하위모듈')` 형태로 로드
- 뷰는 `catui-href` HTML 속성으로 SPA 네비게이션
- `IMCAT.utils`, `IMCAT.helpers`, `IMCAT.security` 네임스페이스로 유틸리티 접근
- 하위 호환: `IMCAT.isString()` 등 직접 호출도 유지

## 코어 모듈 의존 방향

```text
index.js (진입점)
├── dom.js ─────────→ security.js
├── event.js         (의존 없음, EventEmitterMixin 포함)
├── loader.js ──────→ config.js
├── router.js ──────→ security.js
├── loading.js ─────→ security.js
├── api.js           (의존 없음)
├── security.js      (의존 없음, 최하위 계층)
├── utils.js         (의존 없음, 최하위 계층)
├── template.js ────→ security.js
├── storage.js       (의존 없음)
├── url.js           (의존 없음)
├── state.js         (의존 없음)
├── form.js          (의존 없음)
├── animation.js     (의존 없음)
├── config.js ──────→ utils.js
├── shortcuts.js ───→ security.js, utils.js
├── helpers.js ─────→ storage.js, url.js
├── formatters.js ──→ config.js
└── auto-init.js     (런타임에 imcat 인스턴스 사용)
```

**의존 규칙**: `security.js`와 `utils.js`는 최하위 계층으로 다른 코어 모듈에 의존하지 않음

## CSS 아키텍처

- `dist/imcat-ui.css` — 코어 스타일만 (abstracts + base + components)
- `dist/imcat-ui.all.css` — 코어 + 모든 모듈 스타일
- `dist/modules/*.css` — 개별 모듈 CSS (`autoLoadModuleCSS: true`로 자동 로드)
- `_variables.scss` — 기본 변수 (색상, 타이포그래피, 간격, z-index 등)
- `_tokens.scss` — 자동 생성 컴포넌트 디자인 토큰

## 이벤트 시스템

- `EventBus` — 글로벌 pub/sub 이벤트 버스 (전역 통신용)
- `EventEmitterMixin` — 컴포넌트 내장 이벤트 (new EventBus() 대신 사용 권장)

## 개발 명령어

- `pnpm run dev` — Rollup watch 모드
- `pnpm run build` — 프로덕션 빌드 (JS + 코어CSS + 모듈CSS + 폰트)
- `pnpm run build:css:all` — 전체 번들 CSS 빌드
- `pnpm run build:css:modules` — 개별 모듈 CSS 빌드
- `pnpm run serve` — HTTP 서버 (포트 3000)
- `pnpm exec vitest run` — 테스트 실행
- `pnpm run lint` — ESLint 검사

## 필수 원칙

- 사용자 입력은 반드시 `Security.escape()`로 처리
- 모든 UI 컴포넌트에 `destroy()` 메서드 구현
- `eval()`, `new Function()` 사용 절대 금지
- 새 모듈 추가 시 `rollup.config.js`에 등록 필수
- 새 컴포넌트 이벤트는 `EventEmitterMixin.apply(this)` 사용 권장
