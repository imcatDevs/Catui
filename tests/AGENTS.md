# 테스트 가이드

## 환경

- **프레임워크**: Vitest
- **DOM 환경**: jsdom
- **설정 파일**: `vitest.config.js`

## 구조

```text
tests/
├── core/       # src/core/ 모듈별 테스트
└── modules/    # src/modules/ 모듈별 테스트
```

## 테스트 작성 패턴

- `describe`로 클래스/모듈 그룹화
- `it` 또는 `test`로 개별 케이스
- `beforeEach`에서 DOM 초기화, `afterEach`에서 정리
- 비동기 테스트는 `async/await` 사용

## 실행 명령어

- `pnpm exec vitest run` — 전체 테스트 1회 실행
- `pnpm test` — watch 모드
- `pnpm run test:coverage` — 커버리지 리포트

## 주의사항

- 테스트 간 상태 공유 금지 (독립적 테스트)
- DOM 조작 후 반드시 정리 (`document.body.innerHTML = ''`)
- `destroy()` 호출 후 리소스 해제 검증 포함
