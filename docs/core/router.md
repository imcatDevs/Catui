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

**serverRender: true 시 동작:**
- `catui-href`가 일반 링크처럼 동작
- `preventDefault()` 하지 않음
- 서버 라우터가 페이지 전환 처리

```html
<!-- Catphp 라우터와 함께 사용 -->
<script>IMCAT.config.set('serverRender', true);</script>

<!-- 일반 링크처럼 서버 라우터가 처리 -->
<a catui-href="/about">소개</a>
<a catui-href="/users">사용자</a>
```

## ⚠️ 주의사항

- ❌ `views/` 이외 경로 접근 → 보안 정책으로 차단됨
- ❌ 뷰 내 컴포넌트 미정리 → ✅ `registerInstance()` 사용
- ❌ 서버 렌더링 모드가 아닌데 `/` 경로 사용 → ✅ `views/` 경로 사용

## 관련 문서

- [구현 패턴](../PATTERNS.md) — SPA 레이아웃 패턴
- [Auto Init](auto-init.md) — 뷰 로드 후 자동 초기화
