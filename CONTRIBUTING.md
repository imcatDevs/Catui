# Contributing to IMCAT UI

기여해주셔서 감사합니다! 아래 가이드를 읽고 참여해주세요.

> **[English version below](#english)**

---

## 기여 방법

| 기여 유형 | 설명 |
| --------- | ---- |
| **버그 리포트** | [GitHub Issues](https://github.com/imcatDevs/Catui/issues)에 버그 신고 |
| **기능 제안** | Issues에 `enhancement` 라벨로 등록 |
| **코드 기여** | PR 제출 (아래 절차 참조) |
| **문서 개선** | `docs/` 폴더 수정 또는 오타 교정 |
| **플러그인 개발** | [플러그인 가이드](docs/community/plugin-guide.md) 참조 |
| **번역** | `docs/en/` 영어 문서 기여 환영 |

---

## 개발 환경 설정

```bash
git clone https://github.com/imcatDevs/Catui.git
cd Catui
pnpm install
pnpm run dev
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

## ESLint 설정

프로젝트는 ESLint v9 **flat config** (`eslint.config.js`)를 사용합니다.

```bash
pnpm run lint       # 검사
pnpm run lint:fix   # 자동 수정
```

---

## 버전 관리 정책

프로젝트는 [Semantic Versioning 2.0.0](https://semver.org/lang/ko/)을 따릅니다.

```text
MAJOR.MINOR.PATCH  (예: 1.1.2)
```

| 변경 유형 | 버전 | 예시 |
| --- | --- | --- |
| 하위 호환 버그 수정 | PATCH | `1.1.2` → `1.1.3` |
| 하위 호환 기능 추가 | MINOR | `1.1.2` → `1.2.0` |
| 하위 호환성 깨지는 변경 | MAJOR | `1.1.2` → `2.0.0` |

### Breaking Changes 규칙

- **MAJOR** 버전 변경 시 반드시 마이그레이션 가이드 작성
- 공개 API (`IMCAT.*`, 모듈 `export`) 시그니처 변경은 MAJOR
- 옵션 기본값 변경은 MINOR (기존 동작 유지 시) 또는 MAJOR (동작 변경 시)
- CSS 클래스명 변경/제거는 MAJOR

### 릴리스 절차

```bash
# 1. develop 브랜치에서 최종 확인
pnpm run lint
pnpm exec vitest run
pnpm run build

# 2. package.json 버전 업데이트
# 3. CHANGELOG 작성

# 4. 빌드 + 패키징
pnpm run release

# 5. npm 퍼블리시
npm publish --access public
```

### 번들 크기 기준

| 파일 | 목표 (gzip) |
| --- | --- |
| `imcat-ui.min.js` | < 25 KB |
| `imcat-ui.css` | < 20 KB |

---

## 보안 취약점 신고

공개 이슈 대신 **[security@imcat.dev](mailto:security@imcat.dev)** 로 보고해주세요.
보고 내용에는 재현 절차, 영향 범위, 가능한 해결 방안을 포함해 주세요.

---

## 행동 강령 (Code of Conduct)

- 모든 참여자에게 존중과 예의를 갖춥니다
- 건설적인 피드백을 제공합니다
- 차별적/공격적 언어를 사용하지 않습니다
- 질문은 언제든 환영합니다 — 초보자도 편하게 참여할 수 있는 환경을 만듭니다

---

## English

### How to Contribute

1. Fork the repository and create a branch from `develop`
2. Install dependencies: `pnpm install`
3. Make your changes
4. Run tests: `pnpm exec vitest run`
5. Run lint: `pnpm run lint`
6. Submit a Pull Request with a clear description

### Commit Message Format

```text
<type>(<scope>): <message>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Security

Report vulnerabilities to **[security@imcat.dev](mailto:security@imcat.dev)** (do not use public issues).
