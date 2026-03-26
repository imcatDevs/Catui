# Live Status

OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus — 실시간 상태 표시 컴포넌트를 제공합니다.

> 소스: `src/modules/live-status.js`
>
> **이 문서의 핵심**: `IMCAT.use('live-status')` → OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus.
> OnlineStatus: 온라인/오프라인 상태 점. TypingIndicator: 입력 중 표시.
> ActivityStatus: 마지막 활동 시간. LiveCounter: 숫자 애니메이션.
> ConnectionStatus: 네트워크 연결 모니터링 (싱글톤).

## 로드 방법

```javascript
const { OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus } = await IMCAT.use('live-status');
```

---

## OnlineStatus

사용자의 온라인/오프라인 상태를 표시합니다.

```javascript
const { OnlineStatus } = await IMCAT.use('live-status');
const status = new OnlineStatus('#userAvatar', {
  status: 'online',
  showLabel: false,
  size: 'md',
  position: 'bottom-right',
  pulse: true,
  onChange: (status) => console.log('상태:', status)
});
status.setStatus('away');
```

### OnlineStatus 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `status` | string | `'online'` | 상태 (`'online'`/`'offline'`/`'away'`/`'busy'`/`'dnd'`) |
| `showLabel` | boolean | `false` | 라벨 텍스트 표시 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `position` | string | `'bottom-right'` | 위치 (`'top-left'`/`'top-right'`/`'bottom-left'`/`'bottom-right'`) |
| `pulse` | boolean | `true` | 온라인 시 펄스 애니메이션 |
| `onChange` | function | `null` | 상태 변경 콜백 `(status)` |

### OnlineStatus 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setStatus(status)` | 상태 설정 |
| `.getStatus()` | 현재 상태 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## TypingIndicator

타이핑 중인 사용자를 점 애니메이션과 함께 표시합니다.

```javascript
const { TypingIndicator } = await IMCAT.use('live-status');
const typing = new TypingIndicator('#chatArea', {
  users: [],
  maxDisplay: 3,
  showNames: true,
  hideAfter: 0
});

typing.addUser('홍길동');
typing.addUser('김철수');
typing.removeUser('홍길동');
typing.setUsers(['이영희', '박민수']);
typing.clear();
typing.show();
typing.hide();
```

### TypingIndicator 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `users` | array | `[]` | 타이핑 중인 사용자 이름 배열 |
| `maxDisplay` | number | `3` | 최대 표시할 사용자 수 |
| `showNames` | boolean | `true` | 사용자 이름 표시 |
| `hideAfter` | number | `0` | 자동 숨김 시간 (ms, 0이면 비활성) |

### TypingIndicator 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addUser(userName)` | 타이핑 사용자 추가 |
| `.removeUser(userName)` | 타이핑 사용자 제거 |
| `.setUsers(users)` | 타이핑 사용자 배열 설정 |
| `.clear()` | 모든 사용자 제거 |
| `.show()` | 표시 |
| `.hide()` | 숨김 |
| `.destroy()` | 인스턴스 제거 |

---

## ActivityStatus

마지막 활동 시간을 상대적/절대적 형식으로 표시합니다. 자동 업데이트를 지원합니다.

```javascript
const { ActivityStatus } = await IMCAT.use('live-status');
const activity = new ActivityStatus('#userInfo', {
  lastActivity: new Date('2025-03-14T14:30:00'),
  format: 'relative',
  updateInterval: 60000,
  locale: 'ko-KR',
  prefix: '마지막 활동: '
});

activity.setLastActivity(new Date());
activity.updateNow();
```

### ActivityStatus 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `lastActivity` | Date/number | `null` | 마지막 활동 시간 |
| `updateInterval` | number | `60000` | 업데이트 간격 (ms) |
| `format` | string | `'relative'` | 표시 형식 (`'relative'`/`'absolute'`) |
| `locale` | string | `'ko-KR'` | 로케일 |
| `prefix` | string | `'마지막 활동: '` | 접두사 |

### ActivityStatus 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setLastActivity(time)` | 마지막 활동 시간 설정 |
| `.updateNow()` | 현재 시간으로 업데이트 |
| `.destroy()` | 인스턴스 제거 |

---

## LiveCounter

실시간으로 변하는 숫자를 애니메이션과 함께 표시합니다.

```javascript
const { LiveCounter } = await IMCAT.use('live-status');
const counter = new LiveCounter('#visitors', {
  value: 0,
  prefix: '',
  suffix: ' 명',
  separator: ',',
  decimals: 0,
  duration: 1000,
  easing: 'easeOutExpo',
  onChange: (value) => console.log('값:', value)
});

counter.setValue(42);
counter.increment(5);
counter.decrement(2);
```

### LiveCounter 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | number | `0` | 초기 값 |
| `prefix` | string | `''` | 접두사 |
| `suffix` | string | `''` | 접미사 |
| `separator` | string | `','` | 천 단위 구분자 |
| `decimals` | number | `0` | 소수점 자릿수 |
| `duration` | number | `1000` | 애니메이션 시간 (ms) |
| `easing` | string | `'easeOutExpo'` | 이징 함수 |
| `onChange` | function | `null` | 값 변경 콜백 `(value)` |

### LiveCounter 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setValue(value, withAnimation?)` | 값 설정 (기본 애니메이션 O) |
| `.increment(amount?)` | 증가 (기본 1) |
| `.decrement(amount?)` | 감소 (기본 1) |
| `.getValue()` | 현재 값 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## ConnectionStatus

네트워크 연결 상태를 모니터링합니다. **싱글톤**으로 동작합니다.

```javascript
const { ConnectionStatus } = await IMCAT.use('live-status');
new ConnectionStatus({
  showOnline: false,
  position: 'top',
  autoHide: true,
  autoHideDelay: 3000,
  onlineMessage: '인터넷에 연결되었습니다',
  offlineMessage: '인터넷 연결이 끊겼습니다',
  onStatusChange: (isOnline) => console.log('연결:', isOnline)
});
```

### ConnectionStatus 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `showOnline` | boolean | `false` | 온라인 복귀 시 알림 표시 |
| `position` | string | `'top'` | 배너 위치 (`'top'`/`'bottom'`) |
| `autoHide` | boolean | `true` | 온라인 복귀 후 자동 숨김 |
| `autoHideDelay` | number | `3000` | 자동 숨김 지연 (ms) |
| `onlineMessage` | string | `'인터넷에 연결되었습니다'` | 온라인 메시지 |
| `offlineMessage` | string | `'인터넷 연결이 끊겼습니다'` | 오프라인 메시지 |
| `onStatusChange` | function | `null` | 상태 변경 콜백 `(isOnline)` |

### ConnectionStatus 메서드

| 메서드 | 설명 |
| --- | --- |
| `.isOnline()` | 현재 연결 상태 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Badges CSS](../css/badges.md) — 배지 스타일
- [Social 모듈](social.md) — ChatUI (타이핑 인디케이터 사용)
