# Stepper

Stepper, VerticalStepper — 단계별 진행 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/stepper.js`
>
> **이 문서의 핵심**: `IMCAT.use('stepper')` → Stepper, VerticalStepper.
> Stepper: 수평/수직 단계 표시 (3가지 variant, 순차 모드).
> VerticalStepper: 인라인 콘텐츠 포함 수직 스텝퍼 (펼치기/수정 가능).

## 로드 방법

```javascript
const { Stepper, VerticalStepper } = await IMCAT.use('stepper');
```

---

## Stepper

```javascript
const { Stepper } = await IMCAT.use('stepper');
const stepper = new Stepper('#myStepper', {
  steps: [
    { title: '정보 입력', subtitle: '기본 정보', icon: 'person', content: '<form>...</form>' },
    { title: '확인', icon: 'check_circle' },
    { title: '완료', icon: 'done_all' }
  ],
  currentStep: 0,
  orientation: 'horizontal',
  clickable: true,
  linear: false,
  showStepNumber: true,
  animated: true,
  connector: 'line',
  size: 'md',
  variant: 'default',
  onChange: (step, prevStep) => console.log('변경:', step),
  onComplete: () => console.log('모든 단계 완료')
});
```

### Stepper 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계 배열 `{ title, subtitle?, icon?, content? }` |
| `currentStep` | number | `0` | 현재 단계 (0-indexed) |
| `orientation` | string | `'horizontal'` | 방향 (`'horizontal'`/`'vertical'`) |
| `clickable` | boolean | `true` | 단계 클릭 허용 |
| `linear` | boolean | `false` | 순차 모드 (이전 단계 완료 필수) |
| `showStepNumber` | boolean | `true` | 단계 번호 표시 |
| `animated` | boolean | `true` | 콘텐츠 전환 애니메이션 |
| `connector` | string | `'line'` | 커넥터 스타일 (`'line'`/`'arrow'`/`'none'`) |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `variant` | string | `'default'` | 변형 (`'default'`/`'dots'`/`'pills'`) |
| `onChange` | function | `null` | 단계 변경 콜백 `(step, prevStep)` |
| `onComplete` | function | `null` | 모든 단계 완료 콜백 |

### Stepper 메서드

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 단계 (현재 단계 자동 완료) |
| `.prev()` | 이전 단계 |
| `.goTo(index)` | 특정 단계로 이동 |
| `.complete(index)` | 단계 완료 처리 |
| `.uncomplete(index)` | 단계 완료 취소 |
| `.reset()` | 모든 단계 초기화 |
| `.addStep(step, index?)` | 단계 추가 |
| `.removeStep(index)` | 단계 제거 |
| `.getCurrentStep()` | 현재 단계 인덱스 반환 |
| `.getCompletedSteps()` | 완료된 단계 인덱스 배열 반환 |
| `.isComplete()` | 모든 단계 완료 여부 반환 |
| `.destroy()` | 인스턴스 제거 |

### step 객체 구조

```javascript
{
  title: '단계 제목',
  subtitle: '부제목',        // 선택
  icon: 'person',            // Material Icons 이름, 선택 (없으면 번호 표시)
  content: '<div>...</div>'  // 선택, 문자열 또는 (stepIndex) => html 함수
}
```

---

## VerticalStepper

각 단계에 콘텐츠가 인라인으로 표시되는 수직 스텝퍼입니다. 이전/다음/완료 버튼이 자동 생성됩니다.

```javascript
const { VerticalStepper } = await IMCAT.use('stepper');
new VerticalStepper('#myVerticalStepper', {
  steps: [
    { title: '기본 정보', subtitle: '이름, 이메일', icon: 'person', content: '<form>...</form>' },
    { title: '상세 설정', icon: 'settings', content: '<div>설정 UI</div>' },
    { title: '완료', icon: 'done_all', content: '<p>완료되었습니다.</p>' }
  ],
  currentStep: 0,
  expandable: true,
  editable: true,
  animated: true,
  onChange: (step, prevStep) => console.log('변경:', step),
  onComplete: () => console.log('완료')
});
```

### VerticalStepper 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계 배열 `{ title, subtitle?, icon?, content? }` |
| `currentStep` | number | `0` | 현재 단계 |
| `expandable` | boolean | `true` | 이전 단계 펼치기 가능 |
| `editable` | boolean | `true` | 완료된 단계 수정 가능 (편집 버튼 표시) |
| `animated` | boolean | `true` | 애니메이션 사용 |
| `onChange` | function | `null` | 단계 변경 콜백 `(step, prevStep)` |
| `onComplete` | function | `null` | 완료 콜백 |

### VerticalStepper 메서드

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 단계 (현재 단계 자동 완료) |
| `.prev()` | 이전 단계 |
| `.goTo(index)` | 특정 단계로 이동 |
| `.complete(index)` | 단계 완료 처리 |
| `.reset()` | 모든 단계 초기화 |
| `.getCurrentStep()` | 현재 단계 인덱스 반환 |
| `.getCompletedSteps()` | 완료된 단계 인덱스 배열 반환 |
| `.isComplete()` | 모든 단계 완료 여부 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Progress CSS](../css/progress.md) — 프로그레스 바
- [Feedback](feedback.md) — ProgressTracker
