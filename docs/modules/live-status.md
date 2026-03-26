# Live Status

OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus — 실시간 상태 표시 컴포넌트를 제공합니다.

> 소스: `src/modules/live-status.js`
>
> **이 문서의 핵심**: `IMCAT.use('live-status')` → OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus.
> OnlineStatus: 온라인/오프라인 점. ConnectionStatus: 네트워크 연결 상태 모니터링.

## 로드 방법

```javascript
const { OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus } = await IMCAT.use('live-status');
```

## OnlineStatus

사용자의 온라인/오프라인 상태를 표시합니다.

```javascript
const { OnlineStatus } = await IMCAT.use('live-status');
const status = new OnlineStatus('#userAvatar', {
  status: 'online',
  showLabel: false,
  size: 'md',
  position: 'bottom-right',
  pulse: true
});
status.setStatus('away');   // 'online' | 'offline' | 'away' | 'busy' | 'dnd'
```

### OnlineStatus 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `status` | string | `'online'` | 상태 (`'online'`/`'offline'`/`'away'`/`'busy'`/`'dnd'`) |
| `showLabel` | boolean | `false` | 라벨 텍스트 표시 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `position` | string | `'bottom-right'` | 위치 (`'top-left'`/`'top-right'`/`'bottom-left'`/`'bottom-right'`) |
| `pulse` | boolean | `true` | 온라인 시 펄스 애니메이션 |
| `onChange` | function | `null` | 상태 변경 콜백 |

## TypingIndicator

상대방이 입력 중임을 표시합니다.

```javascript
const { TypingIndicator } = await IMCAT.use('live-status');
const typing = new TypingIndicator('#chatArea', {
  text: '상대방이 입력 중...'
});
typing.show();
typing.hide();
```

## ActivityStatus

마지막 활동 시간을 표시합니다.

```javascript
const { ActivityStatus } = await IMCAT.use('live-status');
new ActivityStatus('#userInfo', {
  lastActive: new Date('2025-03-14T14:30:00')
});
```

## LiveCounter

실시간으로 변하는 숫자를 애니메이션과 함께 표시합니다.

```javascript
const { LiveCounter } = await IMCAT.use('live-status');
const counter = new LiveCounter('#visitors', {
  value: 0,
  animation: true
});
counter.setValue(42);
counter.increment();
counter.decrement();
```

## ConnectionStatus

네트워크 연결 상태를 모니터링합니다.

```javascript
const { ConnectionStatus } = await IMCAT.use('live-status');
new ConnectionStatus('#networkStatus', {
  onOnline: () => IMCAT.toast.success('네트워크 연결됨'),
  onOffline: () => IMCAT.toast.error('네트워크 연결 끊김')
});
```

## 관련 문서

- [Badges CSS](../css/badges.md) — 배지 스타일
- [Social 모듈](social.md) — ChatUI (타이핑 인디케이터 사용)
