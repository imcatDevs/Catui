# 코어 모듈 가이드

## 모듈 구성 (20개)

| 모듈 | 역할 |
| --- | --- |
| `index.js` | IMCATCore 진입점, 모든 코어 모듈 통합 |
| `dom.js` | DOM 조작 유틸리티 (선택, 이벤트, 클래스) |
| `router.js` | SPA ViewRouter (History API, 뷰 로딩) |
| `loader.js` | 동적 모듈 로더 (JS/CSS 캐싱) |
| `security.js` | XSS 방어, 경로 검증, HTML 정화 |
| `event.js` | EventBus + EventEmitterMixin (pub/sub 패턴) |
| `api.js` | HTTP API 유틸리티 (fetch 래퍼) |
| `state.js` | StateManager, GlobalState (상태 관리) |
| `storage.js` | localStorage/sessionStorage 래퍼 |
| `template.js` | 간단한 템플릿 엔진 |
| `form.js` | FormValidator (폼 검증) |
| `animation.js` | AnimationUtil (CSS 트랜지션/애니메이션) |
| `shortcuts.js` | 단축 API (modal, confirm, alert, toast 등) |
| `helpers.js` | 헬퍼 유틸리티 |
| `formatters.js` | 포맷터 (날짜, 숫자, 통화 등) |
| `utils.js` | 범용 유틸리티 (throttle, debounce 등) |
| `url.js` | URL 유틸리티 |
| `config.js` | 전역 설정 관리 |
| `loading.js` | 로딩 인디케이터 |
| `auto-init.js` | `data-imcat` 속성 자동 초기화 |

## 의존 방향

```text
security.js, utils.js (최하위 계층 — 다른 코어에 의존 없음)
  ↑ dom.js, router.js, loading.js, template.js, shortcuts.js
config.js → utils.js
loader.js → config.js
helpers.js → storage.js, url.js
formatters.js → config.js
index.js → 모든 코어 모듈
```

## 편집 시 주의사항

- `index.js`는 네임스페이스 getter(`utils`, `helpers`, `security`) + 하위호환 자동바인딩 패턴 사용
- `security.js`, `utils.js`는 최하위 계층 — 다른 코어 모듈에 의존 추가 금지
- `event.js`의 `EventEmitterMixin`은 컴포넌트 내장 이벤트용 (글로벌 통신은 `EventBus` 사용)
- `auto-init.js`는 모든 모듈을 간접 참조 — 새 모듈 추가 시 등록 검토
- 코어 모듈은 **외부 의존성 없이** 순수 JS만 사용
