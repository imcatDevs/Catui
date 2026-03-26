# CSP (Content Security Policy) 가이드

IMCAT UI 프레임워크 배포 시 권장하는 CSP 헤더 설정입니다.

> **이 문서의 핵심**: CSP 헤더로 XSS, 데이터 인젝션, 클릭재킹 공격을 방어합니다.
> IMCAT UI와 호환되는 최소/권장 설정을 제공합니다.

---

## 권장 CSP 헤더

### 프로덕션 (엄격)

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

| 지시어 | 값 | 설명 |
| ------ | --- | ---- |
| `default-src` | `'self'` | 기본적으로 같은 출처만 허용 |
| `script-src` | `'self'` | 자체 스크립트만 허용, 인라인 차단 |
| `style-src` | `'self' 'unsafe-inline'` | IMCAT UI 동적 스타일 허용 |
| `img-src` | `'self' data:` | data: URL 이미지 허용 (아바타 등) |
| `font-src` | `'self'` | 내장 폰트 (Pretendard) 허용 |
| `connect-src` | `'self' https://api.*` | API 서버 허용 |
| `frame-ancestors` | `'none'` | 클릭재킹 방지 |
| `base-uri` | `'self'` | base 태그 조작 방지 |
| `form-action` | `'self'` | 폼 데이터 탈취 방지 |

### IMCAT UI 호환 최소 설정

```text
Content-Security-Policy:
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
```

> **참고**: IMCAT UI는 `eval()`, `new Function()` 을 사용하지 않으므로 `'unsafe-eval'`이 불필요합니다.

---

## 서버별 설정 예제

### Nginx

```nginx
server {
    add_header Content-Security-Policy
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; base-uri 'self';"
        always;
}
```

### Apache (.htaccess)

```apache
Header always set Content-Security-Policy \
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; base-uri 'self';"
```

### Express (Node.js)

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    fontSrc: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}));
```

---

## 테스트 환경 (Report-Only 모드)

배포 전 CSP 위반을 모니터링하려면 `Content-Security-Policy-Report-Only` 헤더를 사용합니다.

```text
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  report-uri /csp-report;
```

위반 로그를 수집한 후 문제가 없으면 `Content-Security-Policy`로 전환합니다.

---

## nonce 기반 인라인 스크립트 허용

특정 인라인 스크립트가 필요한 경우 `nonce`를 사용합니다.

```html
<!-- 서버에서 요청마다 고유 nonce 생성 -->
<script nonce="abc123">
  // IMCAT 초기화
  IMCAT.config.set({ theme: 'dark' });
</script>
```

```text
Content-Security-Policy:
  script-src 'self' 'nonce-abc123';
```

> **주의**: `nonce` 값은 요청마다 고유해야 하며, 예측 불가능한 랜덤 값을 사용하세요.

---

## 관련 문서

- [보안 감사 가이드](audit-guide.md)
- [토큰 저장 가이드](token-storage.md)
- [Security 모듈](../core/security.md) — XSS 방어 API
