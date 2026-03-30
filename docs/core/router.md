# Router

SPA 라우팅 — `catui-href` HTML 속성 기반 뷰 네비게이션을 제공합니다.

> 소스: `src/core/router.js`
>
> **이 문서의 핵심**: `<a catui-href="views/page.html">` → 자동 SPA 네비게이션.
> `IMCAT.view.navigate(path)` JS 호출. `afterLoad` 훅으로 뷰 로드 후 처리.
> `views/` 경로만 허용 (보안).
> **서버 렌더링 모드**: `serverRender: true` 시 Catphp 등 서버 라우터와 호환.

## HTML 기반 라우팅

```html
<!-- 사이드바 메뉴 -->
<a catui-href="views/home.html">홈</a>
<a catui-href="views/users.html">사용자</a>
<a catui-href="views/settings.html">설정</a>

<!-- 렌더 타겟 (생략 시 body) -->
<div catui-target="content">
  <div id="content">여기에 뷰가 로드됩니다.</div>
</div>
```

## JavaScript 라우팅

```javascript
// 프로그래밍 방식 네비게이션
IMCAT.view.navigate('views/users.html');

// 뷰 로드 후 훅
IMCAT.view.afterLoad((path) => {
  console.log('뷰 로드 완료:', path);
  // 메뉴 활성화, 데이터 초기화 등
});
```

## 주요 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `IMCAT.view.navigate(path)` | string | 뷰 네비게이션 |
| `IMCAT.view.afterLoad(callback)` | function(path) | 뷰 로드 후 콜백 |
| `IMCAT.view.registerInstance(instance)` | object | 뷰 전환 시 자동 destroy |

## 인스턴스 관리

뷰 전환 시 이전 뷰의 컴포넌트를 자동 정리합니다.

```javascript
// 뷰 내에서 컴포넌트 생성 시 등록
const { Tabs } = await IMCAT.use('navigation');
const tabs = new Tabs('#myTabs');
IMCAT.view.registerInstance(tabs);  // 뷰 전환 시 자동 destroy()
```

## HTML 속성

| 속성 | 설명 |
| --- | --- |
| `catui-href="경로"` | 클릭 시 해당 경로의 HTML 로드 |
| `catui-target="id"` | 뷰가 렌더링될 타겟 (생략 시 body) |

## 서버 렌더링 모드

Catphp 등 서버 사이드 라우터와 함께 사용할 때 `serverRender` 모드를 활성화합니다.

```javascript
// 서버 렌더링 모드 활성화
IMCAT.config.set('serverRender', true);
```

### catui-target이 있는 경우 (AJAX 부분 렌더링)

서버에서 HTML을 `fetch`하여 지정된 타겟 컨테이너에 렌더링합니다.
URL은 `history.pushState`로 업데이트됩니다.

```html
<script>IMCAT.config.set('serverRender', true);</script>

<!-- 서버 HTML을 #app-content에 렌더링 -->
<a catui-href="/login" catui-target="app-content">로그인</a>
<a catui-href="/register" catui-target="app-content">가입</a>

<!-- 렌더 타겟 -->
<main id="app-content">
  여기에 서버 응답 HTML이 렌더링됩니다.
</main>
```

**동작 흐름:**

1. 클릭 → `fetch('/login')` 요청
2. 서버 응답 HTML → `#app-content`에 렌더링
3. `history.pushState`로 URL 업데이트 (`/login`)
4. 로딩 인디케이터 자동 표시/숨김

### catui-target이 없는 경우 (전체 페이지 이동)

일반 링크처럼 `window.location.href`로 전체 페이지를 이동합니다.

```html
<!-- 전체 페이지 이동 (서버 라우터가 처리) -->
<a catui-href="/about">소개</a>
<a catui-href="/users">사용자</a>
```

### href 속성과의 관계

| HTML | 동작 |
| --- | --- |
| `<a catui-href="/login">` | `window.location.href`로 직접 이동 |
| `<a href="#" catui-href="/login">` | `window.location.href`로 직접 이동 |
| `<a catui-href="/login" catui-target="app">` | `fetch` → `#app`에 렌더링 |

### Catphp 통합 예시

```html
<!DOCTYPE html>
<html lang="ko">
<body>
  <header>
    <a catui-href="/login" catui-target="content" class="btn">로그인</a>
    <a catui-href="/register" catui-target="content" class="btn">가입</a>
  </header>

  <nav>
    <!-- target 없으면 전체 페이지 이동 -->
    <a catui-href="/about">소개</a>
    <a catui-href="/docs">문서</a>
  </nav>

  <main id="content">
    <!-- 서버 렌더링 HTML이 여기에 로드됨 -->
  </main>

  <script src="/imcatui/imcat-ui.min.js"></script>
  <script>
    IMCAT.config.set('serverRender', true);
  </script>
</body>
</html>
```

### 보안

- `javascript:`, `data:`, `vbscript:`, `file:` 프로토콜은 자동 차단됩니다
- 위험한 URL 클릭 시 콘솔에 경고 메시지가 출력됩니다

## ⚠️ 주의사항

- ❌ SPA 모드에서 `views/` 이외 경로 접근 → 보안 정책으로 차단됨
- ❌ 뷰 내 컴포넌트 미정리 → ✅ `registerInstance()` 사용
- ❌ SPA 모드에서 절대 경로(`/login`) 사용 → ✅ `views/` 경로 사용 또는 `serverRender: true` 활성화
- ⚠️ `serverRender` 설정은 `IMCAT` 로드 후 설정해도 동적으로 반영됨

## 관련 문서

- [Config](config.md) — `serverRender` 설정
- [구현 패턴](../PATTERNS.md) — SPA 레이아웃 패턴
- [Auto Init](auto-init.md) — 뷰 로드 후 자동 초기화
