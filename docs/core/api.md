# API

HTTP 클라이언트 — fetch 래퍼, 인터셉터, AbortController 타임아웃을 제공합니다.

> 소스: `src/core/api.js`
>
> **이 문서의 핵심**: `IMCAT.api.get/post/put/delete(url, data?, options?)`.
> JSON 자동 파싱. AbortController 타임아웃. 인터셉터 (요청/응답 가로채기).

## 기본 사용법

```javascript
// GET
const users = await IMCAT.api.get('/api/users');

// POST
const result = await IMCAT.api.post('/api/users', {
  name: '홍길동',
  email: 'hong@test.com'
});

// PUT
await IMCAT.api.put('/api/users/1', { name: '김철수' });

// DELETE
await IMCAT.api.delete('/api/users/1');
```

## 주요 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.get(url, options?)` | string, object? | Promise | GET 요청 |
| `.post(url, data?, options?)` | string, any?, object? | Promise | POST 요청 |
| `.put(url, data?, options?)` | string, any?, object? | Promise | PUT 요청 |
| `.patch(url, data?, options?)` | string, any?, object? | Promise | PATCH 요청 |
| `.delete(url, options?)` | string, object? | Promise | DELETE 요청 |
| `.all(...requests)` | Promise[] | Promise<Array> | 병렬 요청 |
| `.race(...requests)` | Promise[] | Promise | 가장 빠른 요청 반환 |

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `timeout` | number | 30000 | 타임아웃 (ms) |
| `headers` | object | {} | 추가 헤더 |
| `responseType` | string | 'json' | 응답 타입 (json/text/blob) |

```javascript
const data = await IMCAT.api.get('/api/data', {
  timeout: 5000,
  headers: { 'Authorization': 'Bearer token123' }
});
```

## 인터셉터

요청/응답을 가로채서 공통 처리합니다.

```javascript
// 요청 인터셉터
IMCAT.api.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer ' + getToken();
  return config;
});

// 응답 인터셉터
IMCAT.api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.statusCode === 401) IMCAT.view.navigate('views/login.html');
    return Promise.reject(error);
  }
);
```

## FormData 전송

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', '문서');

await IMCAT.api.post('/api/upload', formData);
// Content-Type 자동 설정 (multipart/form-data)
```

## ⚠️ 주의사항

- ❌ fetch() 직접 사용 → ✅ `IMCAT.api.*` 사용 (인터셉터, 타임아웃 자동 적용)

## 관련 문서

- [구현 패턴](../PATTERNS.md) — 데이터 로딩 + 로딩 인디케이터 패턴
