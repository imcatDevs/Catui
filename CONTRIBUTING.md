# Contributing to IMCAT UI

기여해주셔서 감사합니다! 아래 가이드를 읽고 참여해주세요.

---

## 개발 환경 설정

```bash
git clone https://github.com/imcatDevs/imcat_ui.git
cd imcat_ui
npm install
npm run dev
```

---

## 브랜치 전략

| 브랜치 | 목적 |
| --- | --- |
| `main` | 안정 릴리스 |
| `develop` | 다음 버전 개발 |
| `feature/*` | 새 기능 |
| `fix/*` | 버그 수정 |

새 작업은 `develop` 기반으로 브랜치를 생성합니다.

```bash
git checkout develop
git checkout -b feature/my-feature
```

---

## 코드 스타일

- 들여쓰기: **스페이스 2칸**
- 모듈 시스템: **ES6 `import/export`** (CommonJS 금지)
- 클래스 이름: `PascalCase`
- 메서드/변수 이름: `camelCase`
- 상수: `UPPER_SNAKE_CASE`
- 린트 확인: `npm run lint`

---

## 커밋 메시지 규칙

```text
<type>(<scope>): <message>
```

| type | 설명 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 코드 포맷 (기능 변경 없음) |
| `refactor` | 리팩터링 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드·설정 변경 |

예시:

```text
feat(loader): _toPascalCase로 케밥케이스 모듈명 지원
fix(auto-init): new Function() 제거, CustomEvent 방식으로 대체
```

---

## Pull Request 절차

1. `develop` 기반으로 브랜치 생성
2. 변경 사항 구현
3. 테스트 작성 및 통과 확인: `npm test`
4. 린트 통과 확인: `npm run lint`
5. PR 제목과 설명 작성 (변경 이유 명시)
6. 리뷰 요청

---

## 새 모듈 추가

1. `src/modules/<모듈명>.js` 생성
2. `src/styles/modules/_<모듈명>.scss` 생성
3. `src/styles/imcat-ui.scss`에 `@use` 추가
4. `rollup.config.js`의 `moduleConfigs` 배열에 모듈명 추가
5. `docs/모듈목록.md`에 문서 추가
6. `tests/modules/<모듈명>.test.js` 테스트 작성

---

## ESLint v9 마이그레이션 계획

현재 프로젝트는 ESLint v8(`eslint@8.x`)을 사용하며 `.eslintrc.cjs` 형식(Legacy config)으로 설정되어 있습니다.
ESLint v8은 2024년 EOL이며, v9 업그레이드 시 **flat config** 시스템으로 전환이 필요합니다.

### 전환 작업 개요

1. `eslint` 버전을 `^9.x`로 업그레이드
2. `.eslintrc.cjs` → `eslint.config.js` (flat config) 형식으로 변환

```js
// eslint.config.js (v9 flat config 형식)
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-eval': 'error',
      'no-new-func': 'error',
      // ... 기존 rules 이전
    }
  }
];
```

1. `package.json` `lint` 스크립트 확인 (`eslint src/`)
2. 별도 브랜치에서 진행하여 기존 CI 영향 최소화

---

## 보안 취약점 신고

공개 이슈 대신 **[이메일 또는 비공개 채널]** 로 보고해주세요.
