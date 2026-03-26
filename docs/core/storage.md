# Storage

localStorage/sessionStorage 래퍼 — JSON 자동 직렬화, TTL 만료를 제공합니다.

> 소스: `src/core/storage.js`
>
> **이 문서의 핵심**: `IMCAT.storage.set('key', value, { expires: 초 })` 저장.
> `IMCAT.storage.get('key')` 조회 (만료 시 null). JSON 자동 처리.

## 기본 사용법

```javascript
// 저장 (영구)
IMCAT.storage.set('user', { name: '홍길동', age: 30 });

// 조회
const user = IMCAT.storage.get('user');  // { name: '홍길동', age: 30 }

// TTL 저장 (1시간 후 만료)
IMCAT.storage.set('token', 'abc123', { expires: 3600 });

// 삭제
IMCAT.storage.remove('user');
```

## 주요 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.set(key, value, options?)` | string, any, `{ expires?, storage? }` | boolean | 저장 (expires: 초 단위, storage: `'session'`) |
| `.get(key)` | string | any/null | 조회 (만료 시 null) |
| `.remove(key)` | string | — | 삭제 |
| `.clear()` | — | — | 전체 삭제 |
| `.has(key)` | string | boolean | 존재 여부 |
| `.keys()` | — | string[] | 전체 키 목록 |
| `.size()` | — | number | 사용 용량 (bytes) |
| `.cleanExpired()` | — | — | 만료된 항목 정리 |

## Session Storage

기본은 localStorage입니다. sessionStorage를 사용하려면:

```javascript
IMCAT.storage.set('tempData', { key: 'value' }, { storage: 'session' });
IMCAT.storage.get('tempData', null, 'session');
```

## 관련 문서

- [Config](config.md) — 앱 설정 관리
- [Helpers](../CHEATSHEET.md) — `IMCAT.helpers.getStorage/setStorage` 단축
