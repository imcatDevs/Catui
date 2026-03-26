# Security Input

OTPInput, PinInput — 보안 입력 컴포넌트를 제공합니다.

> 소스: `src/modules/security-input.js`
>
> **이 문서의 핵심**: `IMCAT.use('security-input')` → OTPInput, PinInput.
> OTPInput: 6자리 인증 코드 입력. PinInput: 4~6자리 PIN 코드 입력 + 가상 키패드.

## 로드 방법

```javascript
const { OTPInput, PinInput } = await IMCAT.use('security-input');
```

---

## OTPInput

6자리 인증 코드 입력에 최적화된 컴포넌트입니다. 자동 포커스 이동, 붙여넣기, 키보드 탐색을 지원합니다.

```javascript
const { OTPInput } = await IMCAT.use('security-input');
new OTPInput('#otp', {
  length: 6,
  type: 'number',
  size: 'md',
  autoFocus: true,
  autoSubmit: true,
  separator: true,
  separatorPosition: 3,
  mask: false,
  placeholder: '○',
  disabled: false,
  error: false,
  errorMessage: '',
  onComplete: (code) => console.log('인증 코드:', code),
  onChange: (value) => console.log('변경:', value),
  onFocus: (e) => console.log('포커스'),
  onBlur: (e) => console.log('블러')
});
```

### OTPInput 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `length` | number | `6` | OTP 길이 |
| `type` | string | `'number'` | 입력 타입 (`'number'`/`'text'`/`'password'`) |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `autoFocus` | boolean | `true` | 첫 번째 입력 자동 포커스 |
| `autoSubmit` | boolean | `true` | 전체 입력 시 자동 제출 |
| `separator` | boolean | `false` | 구분선 표시 |
| `separatorPosition` | number | `3` | 구분선 위치 |
| `mask` | boolean | `false` | 입력 마스킹 |
| `placeholder` | string | `'○'` | 플레이스홀더 |
| `disabled` | boolean | `false` | 비활성 |
| `error` | boolean | `false` | 에러 상태 |
| `errorMessage` | string | `''` | 에러 메시지 |
| `onComplete` | function | `null` | 완료 콜백 `(value)` |
| `onChange` | function | `null` | 변경 콜백 `(value)` |
| `onFocus` | function | `null` | 포커스 콜백 |
| `onBlur` | function | `null` | 블러 콜백 |

### OTPInput 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 현재 값 반환 |
| `.setValue(value)` | 값 설정 |
| `.clear()` | 초기화 |
| `.focus()` | 첫 입력 포커스 |
| `.setError(message)` | 에러 상태 + 메시지 |
| `.clearError()` | 에러 해제 |
| `.setSuccess()` | 성공 상태 |
| `.clearSuccess()` | 성공 해제 |
| `.disable()` | 비활성화 |
| `.enable()` | 활성화 |
| `.destroy()` | 인스턴스 제거 |

---

## PinInput

4~6자리 PIN 코드 입력 (보안 강화) 컴포넌트입니다. 보이기/숨기기 토글, 가상 키패드(셔플)를 지원합니다.

```javascript
const { PinInput } = await IMCAT.use('security-input');
new PinInput('#pin', {
  length: 4,
  size: 'md',
  mask: true,
  showToggle: true,
  numeric: true,
  autoFocus: true,
  autoSubmit: true,
  disabled: false,
  error: false,
  errorMessage: '',
  keypad: false,
  shuffleKeypad: false,
  onComplete: (pin) => console.log('PIN:', pin),
  onChange: (value) => console.log('변경:', value)
});
```

### PinInput 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `length` | number | `4` | PIN 길이 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `mask` | boolean | `true` | 입력 마스킹 |
| `showToggle` | boolean | `true` | 보이기/숨기기 토글 |
| `numeric` | boolean | `true` | 숫자만 허용 |
| `autoFocus` | boolean | `true` | 첫 입력 자동 포커스 |
| `autoSubmit` | boolean | `true` | 전체 입력 시 자동 제출 |
| `disabled` | boolean | `false` | 비활성 |
| `error` | boolean | `false` | 에러 상태 |
| `errorMessage` | string | `''` | 에러 메시지 |
| `keypad` | boolean | `false` | 가상 키패드 표시 |
| `shuffleKeypad` | boolean | `false` | 키패드 셔플 (보안) |
| `onComplete` | function | `null` | 완료 콜백 `(value)` |
| `onChange` | function | `null` | 변경 콜백 `(value)` |

### PinInput 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 현재 값 반환 |
| `.setValue(value)` | 값 설정 |
| `.clear()` | 초기화 |
| `.focus()` | 첫 입력 포커스 |
| `.setError(message)` | 에러 상태 + 메시지 |
| `.clearError()` | 에러 해제 |
| `.setSuccess()` | 성공 상태 |
| `.clearSuccess()` | 성공 해제 |
| `.shuffleKeypad()` | 키패드 재셔플 |
| `.disable()` | 비활성화 |
| `.enable()` | 활성화 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Forms CSS](../css/forms.md) — 입력 필드 스타일
- [Forms 모듈](forms.md) — FileUpload, Rating 등
