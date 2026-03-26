# IMCAT UI 프레임워크 전면 리뷰 리포트

> **리뷰 날짜**: 2025-01  
> **리뷰 범위**: 코어 모듈 20개 + 확장 모듈 22개  
> **리뷰 관점**: 보안 취약점, 메모리 누수, 합리성, 일관성

---

## 요약

| 분류              | 심각  | 중간  | 낮음   | 합계   |
| ----------------- | ----- | ----- | ------ | ------ |
| 보안 취약점 (SEC) | 2     | 2     | 2      | 6      |
| 메모리 누수 (MEM) | 0     | 3     | 2      | 5      |
| 일관성 (CON)      | 1     | 1     | 4      | 6      |
| 합리성 (RAT)      | 0     | 2     | 5      | 7      |
| **합계**          | **3** | **8** | **13** | **24** |

---

## 1. 보안 취약점 (SEC)

### SEC-01: social.js ChatUI — userName/avatar XSS ⚠️ HIGH

**파일**: `src/modules/social.js` `_renderMessages()` (line 116~135)

**문제**: `msg.userName`과 `msg.avatar`가 `innerHTML`에 이스케이프 없이 삽입됩니다. `msg.text`만 `_escapeHtml()`로 처리되어 있습니다.

```javascript
// 이스케이프 없음 — XSS 가능
`<img src="${msg.avatar}" alt="${msg.userName}">`
`<div class="chat-ui__sender">${msg.userName}</div>`

// 이것만 이스케이프됨
`<div class="chat-ui__text">${this._escapeHtml(msg.text)}</div>`
```

**영향**: 공격자가 `userName`에 `<img onerror=alert(1)>`을 넣으면 스크립트 실행 가능

**수정 방안**: 모든 사용자 제공 필드에 `Security.escape()` 적용

---

### SEC-02: social.js Comments — userName/avatar XSS ⚠️ HIGH

**파일**: `src/modules/social.js` `_renderComment()` (line 378~428)

**문제**: SEC-01과 동일한 패턴. `comment.userName`, `comment.avatar`가 이스케이프 없이 삽입됩니다.

```javascript
// 이스케이프 없음
`<img src="${comment.avatar}" alt="${comment.userName}">`
`<span class="comments__author">${comment.userName}</span>`
```

**참고**: 같은 파일의 `SocialFeed._renderPost()` (line 1135)에서는 `Security.escape()`를 정상적으로 사용하고 있어 **동일 모듈 내 불일치**가 존재합니다.

---

### SEC-03: social.js ChatUI — 타이핑 표시 name XSS 🔶 MEDIUM

**파일**: `src/modules/social.js` `showTyping()` (line 247~248)

**문제**: 타이핑 사용자 이름이 이스케이프 없이 삽입됩니다.

```javascript
const names = users.map(u => u.name).join(', ');
this.typingContainer.innerHTML = `...${names}님이 입력 중...`;
```

**수정 방안**: `users.map(u => Security.escape(u.name)).join(', ')`

---

### SEC-04: pickers.js ColorPicker — CSS/속성 인젝션 🔶 MEDIUM

**파일**: `src/modules/pickers.js` ColorPicker (line 327)

**문제**: `presetColors` 값이 `data-color` 속성과 `style` 속성에 새니타이징 없이 삽입됩니다.

```javascript
this.options.presetColors.map(c => 
  `<span class="colorpicker__preset" data-color="${c}" style="background:${c}"></span>`
)
```

**영향**: 악의적인 색상 값(`red" onclick="alert(1)`)으로 속성 탈출 가능

**수정 방안**: `Security.escape(c)` (속성), `Security.sanitizeCSS(c)` (스타일)

---

### SEC-05: stepper.js — content raw HTML 삽입 🔵 LOW

**파일**: `src/modules/stepper.js` `_updateContent()` (line 355~372)

**문제**: `step.content`가 `innerHTML`에 새니타이징 없이 삽입됩니다.

```javascript
this.contentContainer.innerHTML = `
  <div class="stepper__panel is-active">
    ${content}  <!-- 새니타이징 없음 -->
  </div>
`;
```

**위험도**: 낮음 (개발자가 제공하는 옵션값이므로 사용자 입력이 아님). 단, `step.title`과 `step.subtitle`은 `Security.escape()` 처리가 되어 있어 일관성 부족.

---

### SEC-06: media-viewer.js EmbedVideo.setSrc() — URL 미이스케이프 🔵 LOW

**파일**: `src/modules/media-viewer.js` `setSrc()` (line 1043~1049)

**문제**: `_render()`에서는 `Security.escape(embedUrl)`로 처리하지만, `setSrc()`에서 동적으로 URL을 변경할 때는 이스케이프 없이 `iframe.src`에 직접 할당합니다.

```javascript
setSrc(url) {
  this.options.url = url;
  const embedUrl = this._normalizeUrl(url);
  if (this.iframe) {
    this.iframe.src = embedUrl; // 이스케이프 없음
  }
}
```

**위험도**: 낮음 (`iframe.src` DOM 속성 할당은 HTML 파싱을 거치지 않으므로 XSS 위험은 낮지만, `javascript:` 프로토콜 등의 가능성 존재)

**수정 방안**: `Security.isSafeUrl()` 검증 추가

---

## 2. 메모리 누수 (MEM)

### MEM-01: social.js ChatUI — 이벤트 리스너 미정리 🔶 MEDIUM

**파일**: `src/modules/social.js` ChatUI

**문제**:

- `_bindEvents()`에서 `sendBtn`과 `input`에 추가한 이벤트 리스너가 `destroy()`에서 명시적으로 제거되지 않음
- `destroy()`는 `container.innerHTML = ''`로만 처리
- `typingTimer` (line 167)가 destroy 시 `clearTimeout` 되지 않음

```javascript
destroy() {
  ChatUI.instances.delete(this.container);
  this.container.innerHTML = ''; // 이벤트 리스너 명시적 제거 없음
  this.container = null;
}
```

**수정 방안**: 이벤트 핸들러를 바인딩하여 추적하고, destroy()에서 `removeEventListener` 호출 + `clearTimeout(typingTimer)`

---

### MEM-02: social.js Comments/SocialFeed — 위임 이벤트 미정리 🔶 MEDIUM

**파일**: `src/modules/social.js` Comments, SocialFeed

**문제**: `_bindEvents()`에서 컨테이너에 이벤트 위임(delegation)을 설정하지만, `destroy()`에서 명시적으로 리스너를 제거하지 않습니다. `innerHTML = ''`는 자식 요소만 제거하고, 컨테이너 자체의 리스너는 남습니다.

---

### MEM-03: OverlayBase — body 스크롤 잠금 참조 카운팅 부재 🔶 MEDIUM

**파일**: `src/modules/overlays.js` OverlayBase

**문제**: `_preventBodyScroll()`과 `_restoreBodyScroll()`이 단순히 `document.body.style.overflow`를 설정/해제합니다. 모달 A와 모달 B가 동시에 열려 있을 때, 모달 B를 닫으면 모달 A가 아직 열려 있어도 스크롤이 복원됩니다.

```javascript
_preventBodyScroll() {
  document.body.style.overflow = 'hidden';
}
_restoreBodyScroll() {
  document.body.style.overflow = ''; // 다른 오버레이가 열려있어도 복원
}
```

**수정 방안**: 열린 오버레이 수를 카운팅하여 마지막 오버레이가 닫힐 때만 스크롤 복원

---

### MEM-04: feedback.js Toast/Notification — 정적 컨테이너 미정리 🔵 LOW

**파일**: `src/modules/feedback.js`

**문제**: `Toast.container`와 `Notification.container`는 정적 변수로, DOM에 한번 추가되면 제거되지 않습니다. 글로벌 `destroy()` 또는 `cleanup()` 메서드가 없습니다.

**위험도**: 낮음 (SPA에서 프레임워크가 완전히 해제될 때만 관련)

---

### MEM-05: Carousel/Social — 정적 instances Map 🔵 LOW

**파일**: `src/modules/carousel.js`, `src/modules/social.js`

**문제**: `Carousel.instances`, `ChatUI.instances` 등 정적 Map에 인스턴스를 저장합니다. `destroy()`에서 Map에서 삭제하고 있어 대체로 정상이나, destroy 호출을 잊으면 GC가 불가능합니다.

**상태**: destroy()에서 `instances.delete()` 호출 확인됨 — 현재 구현은 정상

---

## 3. 일관성 (CON)

### CON-01: social.js 내부 이스케이프 불일치 ⚠️ HIGH

**파일**: `src/modules/social.js`

| 클래스 | userName 이스케이프 | avatar 이스케이프 | text 이스케이프 |
| --- | --- | --- | --- |
| ChatUI | ❌ | ❌ | ✅ `_escapeHtml()` |
| Comments | ❌ | ❌ | ✅ `_escapeHtml()` |
| SocialFeed | ✅ `Security.escape()` | ✅ `Security.escape()` | ✅ `_escapeHtml()` |

동일 모듈 내에서 보안 처리가 다릅니다. SEC-01/02와 직결됩니다.

---

### CON-02: 옵션 병합 방식 불일치 🔶 MEDIUM

| 패턴 | 사용 모듈 |
| --- | --- |
| `Config.getFor()` | overlays, dropdown |
| `Utils.extend()` only | navigation/Tabs, carousel |

`Config.getFor()`은 글로벌 설정을 병합하므로 더 유연합니다. 모든 모듈이 동일한 패턴을 사용해야 합니다.

---

### CON-03: z-index 하드코딩 🔵 LOW

**파일**: `src/modules/dropdown.js` (line 116)

```javascript
this.menu.style.zIndex = '1000'; // 하드코딩
```

`_variables.scss`의 `$z-index-*`와 `Config`의 `zIndex` 설정이 SSOT로 관리되고 있으나, dropdown은 이를 무시하고 하드코딩합니다.

**수정 방안**: `Config.get('zIndex.dropdown')` 사용

---

### CON-04: 유틸리티 함수 중복 🔵 LOW

| 함수 | Utils | Formatters |
| --- | --- | --- |
| `truncate(str, maxLen, suffix)` | ✅ | ✅ |
| `capitalize(str)` | ✅ | ✅ |

두 곳에 동일한 함수가 존재합니다. 하나가 다른 하나에 위임하도록 수정하거나, 한 곳으로 통합 권장.

---

### CON-05: EventEmitterMixin 사용 불일치 🔵 LOW

- **사용**: overlays, dropdown, navigation, carousel, tooltips, social 등
- **미사용**: pickers, selectors, forms 일부

이벤트 발행이 없는 모듈에서도 `on()`/`off()` API를 제공하면 확장성이 향상됩니다.

---

### CON-06: Carousel EASINGS 상수 중복 🔵 LOW

**파일**: `src/modules/carousel.js` (line 16~47)

`AnimationUtil.cssEasings`와 동일한 값을 로컬 상수로 중복 선언합니다. 주석에 "모듈 번들이 독립적으로 빌드되므로 임포트 대신 로컬 상수를 유지"라고 설명되어 있어 **의도적 설계**입니다. 값의 동기화가 깨지지 않도록 주의 필요.

---

## 4. 합리성 (RAT)

### RAT-01: form.js pattern 검증 — ReDoS 가능성 🔶 MEDIUM

**파일**: `src/core/form.js` validators.pattern (line 286)

```javascript
pattern: {
  validate: (value, pattern) => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return { valid: regex.test(value), ... };
  }
}
```

사용자가 제공한 패턴 문자열로 `new RegExp()`를 생성합니다. 복잡한 패턴은 ReDoS(정규식 서비스 거부) 공격에 취약합니다.

**수정 방안**: try/catch로 감싸고, 타임아웃 또는 패턴 복잡도 검증 추가

---

### RAT-02: OverlayBase body 스크롤 — 다중 오버레이 충돌 🔶 MEDIUM

MEM-03과 동일. 참조 카운팅으로 해결 가능.

---

### RAT-03: APIUtil.request() — GET에 Content-Type 설정 🔵 LOW

**파일**: `src/core/api.js` (line 216~218)

```javascript
const headers = {
  'Content-Type': 'application/json',
  ...options.headers
};
```

GET 요청에도 `Content-Type: application/json`이 설정됩니다. 기능적으로는 무해하나 HTTP 스펙상 부적절합니다.

**수정 방안**: `method !== 'GET'`일 때만 Content-Type 설정

---

### RAT-04: Utils.flatten() — 재귀 깊이 제한 없음 🔵 LOW

**파일**: `src/core/utils.js` (line 168~171)

깊이 중첩된 배열에서 스택 오버플로우 발생 가능. ES2019+의 `Array.prototype.flat(Infinity)` 사용 권장.

---

### RAT-05: StateManager.destroy() — Proxy 접근 경고 없음 🔵 LOW

**파일**: `src/core/state.js`

`destroy()` 후에도 Proxy 객체가 살아있어 접근 시 조용히 `undefined` 반환. `_destroyed` 플래그를 추가하여 경고 로그 출력 권장.

---

### RAT-06: LoadingIndicator 싱글톤 export 패턴 🔵 LOW

**파일**: `src/core/loading.js` (line 362~363)

```javascript
export default new LoadingIndicator(); // 싱글톤 인스턴스
```

클래스와 인스턴스를 모두 export하는 혼합 패턴. `index.js`에서 별도 인스턴스를 생성하므로 default export 싱글톤은 사용되지 않을 수 있음.

---

### RAT-07: Utils.randomId() 충돌 가능성 🔵 LOW

**파일**: `src/core/utils.js` (line 224~226)

```javascript
static randomId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
```

`Math.random()`은 암호학적으로 안전하지 않으며, 9자리 base-36 → 약 5.4조 조합. 실용적으로 충돌 가능성은 극히 낮으나, `crypto.randomUUID()` 사용이 더 견고.

---

## 5. 긍정적 평가 ✅

### 보안 아키텍처

- **코어 보안 레이어**: `Security.escape()`, `sanitize()`, `validatePath()`, `isSafeUrl()`, `sanitizeCSS()`, `sanitizeParam()` — 포괄적인 방어 체계
- **Template 자동 이스케이프**: `Template.render()`가 기본으로 XSS 방어 (`renderRaw`는 명시적 사용)
- **DOM 래퍼 보안**: `DOMElement.html()`은 `Security.sanitize()`, `attr()`은 `Security.escape()`, `css()`는 `Security.sanitizeCSS()` 적용
- **라우터 경로 검증**: `ViewRouter`가 `Security.validatePath()`로 디렉토리 탐색 공격 방어
- **media-viewer**: `Security.escape()` 적용이 잘 되어 있음

### 메모리 관리

- **모든 22개 모듈에 `destroy()` 구현** — 우수
- **`auto-init.js`**: `WeakMap`으로 인스턴스 관리 + `Set`으로 destroyable 추적 + `MutationObserver` 정리
- **`ViewRouter.registerInstance()`**: SPA 뷰 전환 시 자동 인스턴스 정리
- **`EventBus`/`EventEmitterMixin`**: `clear()` 메서드로 리스너 전체 해제
- **이벤트 핸들러 바인딩**: 대부분의 모듈이 생성자에서 `.bind(this)` 패턴으로 핸들러를 추적

### 아키텍처 품질

- **의존 방향 준수**: `security.js`, `utils.js`가 최하위 계층으로 다른 모듈에 의존하지 않음
- **동적 모듈 로딩**: `IMCAT.use()`로 필요 시 로드 + 캐싱 — 효율적
- **하위 모듈 지원**: `IMCAT.use('overlays/modal')` 패턴 — 세밀한 로딩 가능
- **Config SSOT**: `Config.getFor()`으로 글로벌/컴포넌트별 설정 병합
- **JSDoc 문서화**: 모든 public 메서드에 한국어 JSDoc 작성 — 우수
- **접근성**: overlays에 `role="dialog"`, `aria-modal`, 포커스 트랩 구현

---

## 6. 수정 우선순위

### 즉시 수정 (HIGH)

1. **SEC-01/02/CON-01**: `social.js` ChatUI, Comments의 userName/avatar 이스케이프 누락
2. **SEC-03**: `social.js` 타이핑 표시 name 이스케이프

### 단기 수정 (MEDIUM)

1. **SEC-04**: `pickers.js` ColorPicker 색상값 새니타이징
2. **MEM-01/02**: `social.js` 이벤트 리스너 정리 보강
3. **MEM-03/RAT-02**: 오버레이 body 스크롤 잠금 참조 카운팅
4. **CON-02**: 옵션 병합 패턴 통일 (`Config.getFor()`)
5. **RAT-01**: `form.js` pattern ReDoS 방어

### 개선 권장 (LOW)

1. **CON-03**: z-index 하드코딩 제거
2. **CON-04**: 유틸리티 함수 중복 정리
3. **RAT-03**: GET 요청 Content-Type 조건부 설정
4. **RAT-04**: `Utils.flatten()` → `Array.flat(Infinity)` 대체
5. 기타 LOW 항목들

---

## 7. 결론

IMCAT UI 프레임워크는 전반적으로 **견고한 보안 아키텍처**와 **체계적인 메모리 관리**를 갖추고 있습니다. 코어 레이어의 `Security` 모듈, `destroy()` 패턴, `WeakMap` 기반 인스턴스 추적 등은 모범적입니다.

주요 개선점은 `social.js` 모듈의 **일부 필드 이스케이프 누락**(같은 모듈 내에서도 불일치)과 **이벤트 리스너 정리 보강**입니다. 이 두 가지를 수정하면 프레임워크의 보안과 안정성이 크게 향상됩니다.
