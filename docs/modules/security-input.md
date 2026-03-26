# Security Input

OTPInput, PinInput — 보안 입력 컴포넌트를 제공합니다.

> 소스: `src/modules/security-input.js`
>
> **이 문서의 핵심**: `IMCAT.use('security-input')` → OTPInput, PinInput.
> OTPInput: 6자리 인증 코드 입력. PinInput: 4~6자리 PIN 코드 입력.

## 로드 방법

```javascript
const { OTPInput, PinInput } = await IMCAT.use('security-input');
```

## OTPInput

6자리 인증 코드 입력에 최적화된 컴포넌트입니다.

```javascript
const { OTPInput } = await IMCAT.use('security-input');
new OTPInput('#otp', {
  length: 6,
  type: 'number',
  autoSubmit: true,
  separator: true,
  separatorPosition: 3,
  onComplete: (code) => console.log('인증 코드:', code)
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
| `separator` | boolean | `false` | 구분선 표시 (3-3 형태) |
| `separatorPosition` | number | `3` | 구분선 위치 |
| `mask` | boolean | `false` | 입력 마스킹 |
| `placeholder` | string | `'○'` | 플레이스홀더 |
| `disabled` | boolean | `false` | 비활성 |
| `error` | boolean | `false` | 에러 상태 |
| `errorMessage` | string | `''` | 에러 메시지 |
| `onComplete` | function | `null` | 완료 콜백 |
| `onChange` | function | `null` | 변경 콜백 |

## PinInput

4~6자리 PIN 코드 입력 (보안 강화) 컴포넌트입니다.

```javascript
const { PinInput } = await IMCAT.use('security-input');
new PinInput('#pin', {
  length: 4,
  size: 'md',
  mask: true,
  onComplete: (pin) => console.log('PIN:', pin)
});
```

### PinInput 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `length` | number | `4` | PIN 길이 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `mask` | boolean | `true` | 입력 마스킹 (기본 활성) |
| `onComplete` | function | `null` | 완료 콜백 |

## 관련 문서

- [Forms CSS](../css/forms.md) — 입력 필드 스타일
- [Forms 모듈](forms.md) — FileUpload, Rating 등
