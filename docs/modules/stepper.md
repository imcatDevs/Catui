# Stepper

Stepper, VerticalStepper — 단계별 진행 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/stepper.js`
>
> **이 문서의 핵심**: `IMCAT.use('stepper')` → Stepper, VerticalStepper.
> Stepper: 가로 단계 표시. VerticalStepper: 세로 단계 표시.

## 로드 방법

```javascript
const { Stepper, VerticalStepper } = await IMCAT.use('stepper');
```

## Stepper

```javascript
const { Stepper } = await IMCAT.use('stepper');
const stepper = new Stepper('#myStepper', {
  steps: [
    { title: '정보 입력', icon: 'person' },
    { title: '확인', icon: 'check_circle' },
    { title: '완료', icon: 'done_all' }
  ],
  current: 0,
  orientation: 'horizontal'
});
stepper.next();      // 다음 단계
stepper.prev();      // 이전 단계
stepper.goTo(2);     // 특정 단계로
```

### Stepper 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계 배열 `{ title, icon?, description? }` |
| `current` | number | `0` | 현재 단계 (0-indexed) |
| `orientation` | string | `'horizontal'` | 방향 (`'horizontal'`/`'vertical'`) |
| `clickable` | boolean | `false` | 단계 클릭 허용 |
| `onChange` | function | `null` | 단계 변경 콜백 (index) |

## VerticalStepper

세로 방향의 단계별 UI입니다.

```javascript
const { VerticalStepper } = await IMCAT.use('stepper');
new VerticalStepper('#myVerticalStepper', {
  steps: [
    { title: '기본 정보', icon: 'person' },
    { title: '상세 설정', icon: 'settings' },
    { title: '완료', icon: 'done_all' }
  ],
  current: 0
});
```

## 메서드 (공통)

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 단계 |
| `.prev()` | 이전 단계 |
| `.goTo(index)` | 특정 단계로 |
| `.destroy()` | 제거 |

## 관련 문서

- [Progress CSS](../css/progress.md) — 프로그레스 바
- [Feedback](feedback.md) — ProgressTracker
