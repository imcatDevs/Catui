# Config

글로벌 설정 관리 — 모든 컴포넌트에 적용되는 기본값을 관리합니다.

> 소스: `src/core/config.js`
>
> **이 문서의 핵심**: `IMCAT.config.set('key', value)` 글로벌 설정.
> `Config.getFor('컴포넌트명')` 글로벌 + 컴포넌트 옵션 자동 병합.
> z-index는 SCSS `_variables.scss`와 동기화.

## 기본 사용법

```javascript
// 설정 변경
IMCAT.config.set('animation', false);
IMCAT.config.set('animationDuration', 200);

// 설정 조회
IMCAT.config.get('animation');        // false
IMCAT.config.get('animationDuration'); // 200
```

## 기본 설정값

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `animation` | boolean | `true` | 애니메이션 활성화 |
| `animationDuration` | number | `300` | 애니메이션 시간 (ms) |
| `autoLoadModuleCSS` | boolean | `true` | `IMCAT.use()` 시 모듈 CSS 자동 로드 |
| `serverRender` | boolean | `false` | 서버 렌더링 모드 (아래 참고) |
| `backdrop` | boolean | `true` | 오버레이 백드롭 표시 |
| `backdropClose` | boolean | `true` | 백드롭 클릭 시 닫기 |
| `escapeClose` | boolean | `true` | ESC 키 닫기 |
| `theme` | string | `'system'` | 테마 (`'light'`/`'dark'`/`'system'`) |
| `locale` | string | `'system'` | 로케일 (자동 감지) |
| `currency` | string | `'system'` | 통화 (자동 감지) |

## z-index 설정

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `zIndex.dropdown` | 1000 | 드롭다운 |
| `zIndex.sticky` | 1020 | sticky 요소 |
| `zIndex.fixed` | 1030 | fixed 요소 |
| `zIndex.modalBackdrop` | 1040 | 모달 백드롭 |
| `zIndex.modal` | 1050 | 모달 |
| `zIndex.drawer` | 1050 | 드로어 |
| `zIndex.popover` | 1060 | 팝오버 |
| `zIndex.tooltip` | 1070 | 툴팁 |
| `zIndex.toast` | 1080 | 토스트 |
| `zIndex.notification` | 1080 | 알림 |
| `zIndex.loading` | 9999 | 로딩 |

## 주요 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.set(key, value)` | string, any | — | 설정 변경 |
| `.get(key)` | string | any | 설정 조회 |
| `.getFor(component, options?)` | string, object? | object | 글로벌 + 컴포넌트 병합 |
| `.reset(key?)` | string? | — | 기본값 복원 (key 생략 시 전체) |
| `.onChange(callback)` | function | function | 변경 리스너 등록 (구독 해제 함수 반환) |
| `.extend(defaults)` | object | — | 기본값 확장 (플러그인용) |

## 중첩 키 접근

점(`.`) 표기법으로 중첩 설정에 접근합니다.

```javascript
IMCAT.config.set('zIndex.modal', 2000);
IMCAT.config.get('zIndex.modal');  // 2000
```

## serverRender 설정

Catphp 등 서버 사이드 라우터와 함께 사용할 때 활성화합니다.

```javascript
IMCAT.config.set('serverRender', true);
```

**`catui-href` 링크 동작 비교:**

| 모드 | `catui-target` 있음 | `catui-target` 없음 |
| --- | --- | --- |
| SPA (`false`) | 로컬 HTML → 타겟에 렌더링 | 로컬 HTML → 기본 컨테이너에 렌더링 |
| 서버 (`true`) | `fetch` → 타겟에 렌더링 | `window.location.href`로 페이지 이동 |

- IMCAT 로드 후 설정해도 **동적으로 반영**됨 (Config에서 실시간 참조)
- 상세 사용법은 [Router 문서](router.md#서버-렌더링-모드) 참고

## ⚠️ 주의사항

- z-index 변경 시 `src/styles/abstracts/_variables.scss`의 `$z-index-*` 변수도 함께 수정 필수

## 관련 문서

- [Router](router.md) — `serverRender` 모드 라우팅 상세
- [Formatters](formatters.md) — locale, currency 설정 영향
- [Theme 모듈](../modules/theme.md) — 테마 설정
