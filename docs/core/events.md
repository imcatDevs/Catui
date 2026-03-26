# Events

이벤트 시스템 — 글로벌 EventBus와 컴포넌트 내장 EventEmitterMixin을 제공합니다.

> 소스: `src/core/event.js`
>
> **이 문서의 핵심**: `IMCAT.on/emit/off` 글로벌 통신 (IMCAT 객체에 직접 노출).
> 컴포넌트 내장은 `EventEmitterMixin`. 두 가지를 혼동하지 마세요.

## EventBus (글로벌 통신)

앱 전체에서 이벤트를 발행/구독합니다.

```javascript
// 구독 (구독 취소 함수 반환)
const unsubscribe = IMCAT.on('user:login', (user) => {
  console.log('로그인:', user.name);
});

// 발행
IMCAT.emit('user:login', { name: '홍길동' });

// 구독 해제 (방법 1: off 직접 호출)
IMCAT.off('user:login', handler);

// 구독 해제 (방법 2: 반환된 함수 호출)
unsubscribe();
```

### EventBus 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `.on(event, callback)` | string, function | 이벤트 구독 |
| `.off(event, callback)` | string, function | 구독 해제 |
| `.emit(event, ...args)` | string, ...any | 이벤트 발행 |
| `.once(event, callback)` | string, function | 1회만 구독 |

## EventEmitterMixin (컴포넌트 내장)

개별 컴포넌트 인스턴스에 이벤트 기능을 추가합니다.

```javascript
// 모듈 개발 시 사용 (프레임워크 확장용)
import { EventEmitterMixin } from '../core/event.js';

class MyComponent {
  constructor() {
    this.events = EventEmitterMixin.create();
  }

  doSomething() {
    this.events.emit('change', { value: 42 });
  }
}

// 사용 측
const comp = new MyComponent();
comp.events.on('change', (data) => console.log(data.value));
```

## 사용 구분

| 용도 | 사용 | 예시 |
| --- | --- | --- |
| 앱 전역 통신 | `IMCAT.on/emit/off` (EventBus) | 로그인/로그아웃, 테마 변경 |
| 컴포넌트 자체 이벤트 | `EventEmitterMixin` | Modal onShow, Tabs onChange |

## ⚠️ 주의사항

- ❌ 글로벌 이벤트에 EventEmitterMixin 사용 → ✅ `IMCAT.on/emit/off` 사용
- ❌ 구독 해제 안 함 (메모리 누수) → ✅ 뷰 전환 시 `IMCAT.off()` 호출 또는 반환된 unsubscribe 함수 호출

## 관련 문서

- [State](state.md) — 상태 관리 (watch로 변경 감지)
- [DOM](dom.md) — DOM 이벤트 (.on/.off)
