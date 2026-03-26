# TypeScript 마이그레이션 평가

IMCAT UI 프레임워크의 TypeScript 전환 타당성 분석 및 로드맵입니다.

> **이 문서의 핵심**: 현재 JSDoc + d.ts 조합으로 충분한 타입 안전성 확보 가능.
> 점진적 마이그레이션 전략을 제시하며, 즉시 전환은 권장하지 않습니다.

---

## 타입 안전성과 보안의 관계

| 문제 유형 | JS 위험도 | TS 개선 효과 |
| --------- | --------- | ------------ |
| 암묵적 형변환 (`==`, `+`) | 높음 | ✅ strict 모드에서 차단 |
| null/undefined 참조 | 높음 | ✅ strictNullChecks로 감지 |
| 잘못된 API 파라미터 | 중간 | ✅ 컴파일 시점 검출 |
| XSS 인젝션 | 높음 | ⚠️ 간접 방어만 (타입으로 escape 강제 불가) |
| 이벤트 핸들러 타입 오류 | 중간 | ✅ 이벤트 페이로드 타입 검증 |

> **결론**: TypeScript는 런타임 보안(XSS 등)을 직접 해결하지 않지만, 코드 품질 향상으로 보안 실수를 줄여줍니다.

---

## 현재 타입 안전성 수준

### 이미 확보된 것

- **`types/imcat-ui.d.ts`** — 831줄 선언 파일로 IDE 자동완성 및 타입 검사 지원
- **JSDoc 주석** — 모든 public 클래스/메서드에 `@param`, `@returns` 작성
- **ESLint** — `eqeqeq`, `no-eval`, `prefer-const` 등으로 코드 품질 관리
- **Vitest** — 1841개 테스트로 런타임 동작 검증

### 부족한 점

- 내부 private 메서드의 타입 검증 없음
- 모듈 간 데이터 흐름 타입 추적 불가
- 리팩토링 시 타입 불일치 자동 감지 불가

---

## 점진적 마이그레이션 전략

### Phase 1: JSDoc 강화 (현재 → 즉시 가능)

```javascript
// @ts-check 활성화로 JSDoc 기반 타입 검사
// @ts-check

/** @type {import('../types/imcat-ui').DOMElement} */
const el = IMCAT('#app');
```

- 파일 상단에 `// @ts-check` 추가
- JSDoc 타입 어노테이션 보강
- `tsconfig.json`의 `checkJs: true`로 전체 검사

**작업량**: 1~2일, **위험도**: 없음

### Phase 2: d.ts 완전 동기화 (현재 → 1주일)

- 모든 모듈의 export 타입 선언 추가
- 제네릭 타입 활용 (`IMCAT.use<Modal>('overlays')`)
- 유니온/인터섹션 타입으로 옵션 엄격화

**작업량**: 3~5일, **위험도**: 낮음

### Phase 3: .ts 파일 전환 (선택적)

```text
src/
├── core/
│   ├── security.ts     ← 보안 모듈 우선 전환
│   ├── config.ts       ← 설정 타입 엄격화
│   ├── dom.ts          ← DOMElement 제네릭 지원
│   └── ... (나머지는 점진적)
└── modules/
    └── ... (코어 전환 후 순차)
```

**작업량**: 2~4주, **위험도**: 중간 (빌드 파이프라인 변경 필요)

---

## 번들 크기 영향

TypeScript는 컴파일 후 JavaScript로 변환되므로 **최종 번들 크기에 영향 없음**.

```text
[TypeScript 소스] → tsc 컴파일 → [JavaScript] → Rollup 번들 → [최종 JS 파일]
                     ↑ 개발 시점       ↑ 현재와 동일
```

| 항목 | 현재 (JS) | 전환 후 (TS→JS) |
| ---- | --------- | --------------- |
| `dist/imcat-ui.js` | ~180KB | ~180KB (동일) |
| `dist/imcat-ui.min.js` | ~80KB | ~80KB (동일) |
| 개발 의존성 | — | +typescript (~40MB) |
| 빌드 시간 | ~3초 | ~5초 (타입 검사 포함) |

---

## 권장 결론

| 항목 | 권장 |
| ---- | ---- |
| **즉시 전환** | ❌ 불필요 — 현재 d.ts + JSDoc으로 충분 |
| **Phase 1 (JSDoc 강화)** | ✅ 권장 — 비용 낮고 효과 높음 |
| **Phase 2 (d.ts 동기화)** | ✅ 권장 — 이번 작업에서 일부 완료 |
| **Phase 3 (.ts 전환)** | ⏸️ 보류 — 팀 규모 확대 또는 대규모 리팩토링 시 검토 |

---

## 관련 문서

- [Security 모듈](../core/security.md)
- [Config 모듈](../core/config.md)
