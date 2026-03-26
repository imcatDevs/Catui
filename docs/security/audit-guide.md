# 보안 감사 및 의존성 관리 가이드

IMCAT UI 프로젝트의 의존성 보안 감사 및 자동화 설정 방법입니다.

> **이 문서의 핵심**: `pnpm audit`으로 취약점 점검, Dependabot으로 자동 업데이트 PR 생성,
> CI/CD 파이프라인에 보안 감사 통합.

---

## npm audit 사용법

### 기본 감사

```bash
# 취약점 검사
pnpm audit

# 심각도별 필터링
pnpm audit --audit-level=high

# JSON 형식 출력 (CI 통합용)
pnpm audit --json
```

### 자동 수정

```bash
# 호환 가능한 패치 자동 적용
pnpm audit --fix

# 수동 업데이트 (메이저 버전 변경 필요 시)
pnpm update <package-name>
```

### package.json 스크립트

```json
{
  "scripts": {
    "audit": "pnpm audit",
    "audit:fix": "pnpm audit --fix",
    "audit:high": "pnpm audit --audit-level=high"
  }
}
```

---

## GitHub Dependabot 설정

### `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    labels:
      - "dependencies"
      - "security"
    # 메이저 업데이트는 별도 PR
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"
```

### Dependabot 동작 방식

1. **주간 검사**: 매주 월요일 의존성 업데이트 확인
2. **자동 PR 생성**: 업데이트 가능한 패키지에 대해 PR 생성
3. **보안 알림**: 취약점 발견 시 긴급 PR 생성 (즉시)
4. **그룹화**: minor/patch 업데이트는 하나의 PR로 묶음

---

## CI/CD 파이프라인 통합

### GitHub Actions 예제

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # 매일 오전 9시 (KST) 실행
    - cron: '0 0 * * *'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=high

      - name: 린트 검사
        run: pnpm run lint

      - name: 테스트
        run: pnpm exec vitest run
```

---

## 취약점 대응 프로세스

| 심각도 | 대응 시간 | 조치 |
| ------ | --------- | ---- |
| **Critical** | 24시간 이내 | 즉시 패치, 핫픽스 배포 |
| **High** | 1주일 이내 | 다음 릴리스에 포함 |
| **Moderate** | 2주일 이내 | 다음 정기 업데이트에 포함 |
| **Low** | 1개월 이내 | 일반 유지보수 주기에 처리 |

### 대응 절차

1. `pnpm audit` 실행 → 취약점 확인
2. 영향 범위 분석 (해당 패키지가 프로덕션 코드에 사용되는지 확인)
3. `pnpm audit --fix` 또는 수동 업데이트
4. 테스트 (`pnpm exec vitest run`) 통과 확인
5. 변경 사항 커밋 및 배포

---

## 관련 문서

- [CSP 헤더 가이드](csp-guide.md)
- [토큰 저장 가이드](token-storage.md)
