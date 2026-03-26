# Feedback

Toast, Notification, ProgressTracker, Skeleton — 피드백 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/feedback.js`
>
> **이 문서의 핵심**: `Toast.success/error/warning/info(msg)` 토스트 알림.
> 단축: `IMCAT.toast.success(msg)`. Notification은 고정 위치 알림.

## 로드 방법

```javascript
const { Toast, Notification, ProgressTracker, Skeleton } = await IMCAT.use('feedback');
```

## Toast

화면 모서리에 잠시 표시되는 알림입니다.

```javascript
// 단축 API (권장)
IMCAT.toast.success('저장 완료!');
IMCAT.toast.error('오류 발생');
IMCAT.toast.warning('주의하세요');
IMCAT.toast.info('안내 메시지');

// 직접 호출
const { Toast } = await IMCAT.use('feedback');
Toast.show('메시지', 'success', 5000);  // type, duration(ms)
Toast.clear();  // 모든 토스트 제거
```

### Toast 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `Toast.show(msg, type, duration)` | string, string, number | 토스트 표시 |
| `Toast.success(msg, duration?)` | string, number? | 성공 토스트 |
| `Toast.error(msg, duration?)` | string, number? | 에러 토스트 |
| `Toast.warning(msg, duration?)` | string, number? | 경고 토스트 |
| `Toast.info(msg, duration?)` | string, number? | 정보 토스트 |
| `Toast.clear()` | — | 모든 토스트 제거 |

## Notification

고정 위치에 표시되는 상세 알림입니다.

```javascript
const { Notification } = await IMCAT.use('feedback');
Notification.show({
  title: '새 메시지',
  message: '홍길동님이 메시지를 보냈습니다.',
  type: 'info',
  duration: 5000
});

// 단축 메서드
Notification.success('성공', '저장되었습니다.');
Notification.error('오류', '실패했습니다.');
Notification.clear();  // 모든 알림 제거
```

### Notification 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | string | `''` | 알림 제목 |
| `message` | string | `''` | 알림 내용 |
| `type` | string | `'info'` | 타입 (`'success'`/`'error'`/`'warning'`/`'info'`) |
| `duration` | number | `5000` | 표시 시간 (ms, 0=영구) |
| `closable` | boolean | `true` | 닫기 버튼 |
| `icon` | string | `null` | 커스텀 아이콘 |
| `actions` | array | `[]` | 액션 버튼 `[{ text, onClick }]` |
| `onClose` | function | `null` | 닫힘 콜백 |

### Notification 메서드

| 메서드 | 파라미터 | 설명 |
| --- | --- | --- |
| `Notification.show(options)` | object | 알림 표시 |
| `Notification.success(title, msg, opts?)` | string, string, object? | 성공 알림 |
| `Notification.error(title, msg, opts?)` | string, string, object? | 에러 알림 |
| `Notification.warning(title, msg, opts?)` | string, string, object? | 경고 알림 |
| `Notification.info(title, msg, opts?)` | string, string, object? | 정보 알림 |
| `Notification.clear()` | — | 모든 알림 제거 |

## ProgressTracker

단계별 진행 상태를 추적합니다.

```javascript
const { ProgressTracker } = await IMCAT.use('feedback');
const tracker = new ProgressTracker('#progress', {
  steps: ['업로드', '처리', '완료'],
  current: 0,
  vertical: false,
  clickable: false
});
tracker.next();       // 다음 단계로
tracker.prev();       // 이전 단계로
tracker.goTo(2);      // 특정 단계로
tracker.complete();   // 전체 완료
tracker.getCurrent(); // 현재 단계 반환
```

### ProgressTracker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계명 배열 |
| `current` | number | `0` | 초기 단계 |
| `vertical` | boolean | `false` | 세로 배치 |
| `clickable` | boolean | `false` | 단계 클릭 허용 |
| `onChange` | function | `null` | 단계 변경 콜백 |

## Skeleton

콘텐츠 로딩 중 표시되는 플레이스홀더입니다.

```javascript
const { Skeleton } = await IMCAT.use('feedback');
const skeleton = new Skeleton('#container', {
  type: 'list',    // 'text' | 'avatar' | 'card' | 'image' | 'list'
  lines: 5,
  animated: true,
  width: '100%'
});
// 데이터 로드 후
skeleton.destroy();
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onShow` (Toast/Notification) | `()` | 알림 표시 후 |
| `onClose` (Toast/Notification) | `()` | 알림 닫힘 후 |
| `onChange` (ProgressTracker) | `(step)` | 단계 변경 시 |

## 관련 문서

- [Alerts CSS](../css/alerts.md) — 정적 알림 메시지
- [구현 패턴](../PATTERNS.md) — 데이터 로딩 패턴
