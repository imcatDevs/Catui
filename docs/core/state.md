# State

Proxy 기반 리액티브 상태 관리 — watch, computed, batch를 제공합니다.

> 소스: `src/core/state.js`
>
> **이 문서의 핵심**: `IMCAT.state.create({초기값})` → Proxy 객체.
> `state.watch('key', callback)` 변경 감지. `state.compute()` 파생 값.
> `GlobalState` 전역 상태 vs 로컬 상태.

## 기본 사용법

```javascript
const state = IMCAT.state.create({
  count: 0,
  name: '홍길동'
});

// 변경 감지
state.watch('count', (newVal, oldVal) => {
  IMCAT('#display').text(`카운트: ${newVal}`);
});

// 상태 변경 → 자동으로 watch 콜백 호출
state.count++;
state.count = 10;
```

## 주요 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `IMCAT.state.create(initial)` | object | 리액티브 상태 생성 |
| `state.watch(key, callback)` | string, function(new, old) | 변경 감지 |
| `state.compute(key, fn)` | string, function | 파생 값 (자동 갱신) |
| `state.batch(fn)` | function | 여러 변경을 묶어 1회 알림 |
| `state.destroy()` | — | watch/compute 정리 |

## Compute (파생 값)

```javascript
const state = IMCAT.state.create({ price: 1000, quantity: 3 });

state.compute('total', () => state.price * state.quantity);

console.log(state.total);    // 3000
state.quantity = 5;
console.log(state.total);    // 5000
```

## Batch (일괄 변경)

여러 속성을 한 번에 변경하고 알림을 1회만 발생시킵니다.

```javascript
state.batch(() => {
  state.firstName = '길동';
  state.lastName = '홍';
  state.age = 30;
});
// watch 콜백이 한 번만 호출됨
```

## GlobalState (전역 상태)

앱 전체에서 공유하는 싱글톤 상태입니다.

```javascript
// 이름 기반 전역 스토어 생성/접근
const userStore = IMCAT.globalState.use('user', { name: '', role: '' });

// 상태 변경 (Proxy 기반)
userStore.name = '홍길동';
userStore.role = 'admin';

// 변경 감지
userStore.watch('name', (newVal) => console.log('이름 변경:', newVal));
```

### GlobalState 주요 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `IMCAT.globalState.use(name, initial?)` | string, object? | 전역 스토어 생성/조회 (Proxy 반환) |
| `IMCAT.globalState.remove(name)` | string | 스토어 제거 + destroy |
| `IMCAT.globalState.clear()` | — | 모든 전역 스토어 제거 |

## ⚠️ 주의사항

- ❌ 뷰 전환 시 state 미정리 → ✅ `state.destroy()` 또는 `registerInstance()` 사용
- ❌ 중첩 객체 직접 변경 → Proxy 감지 안 될 수 있음. 새 객체로 할당 권장

## 관련 문서

- [Events](events.md) — EventBus 글로벌 통신
- [구현 패턴](../PATTERNS.md) — 리액티브 상태 + DOM 업데이트 패턴
