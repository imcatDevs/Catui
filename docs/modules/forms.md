# Forms (모듈)

FileUpload, Rating, SignaturePad, FormWizard — 고급 폼 컴포넌트를 제공합니다.

> 소스: `src/modules/forms.js`
>
> **이 문서의 핵심**: `IMCAT.use('forms')` → FileUpload, Rating, SignaturePad, FormWizard.
> CSS forms.md와 다릅니다 — 이 문서는 **JS 모듈** 컴포넌트입니다.

## 로드 방법

```javascript
const { FileUpload, Rating, SignaturePad, FormWizard } = await IMCAT.use('forms');
```

## FileUpload

드래그 앤 드롭 파일 업로드입니다.

```javascript
const { FileUpload } = await IMCAT.use('forms');
new FileUpload('#uploader', {
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024,
  multiple: true,
  preview: true,
  onUpload: (files) => IMCAT.toast.success(`${files.length}개 업로드`),
  onError: (err) => IMCAT.toast.error(err.message)
});
```

## Rating

별점 입력 컴포넌트입니다.

```javascript
const { Rating } = await IMCAT.use('forms');
new Rating('#rating', {
  max: 5,
  value: 3,
  size: 'md',
  onChange: (value) => console.log('별점:', value)
});
```

### Rating 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `max` | number | `5` | 최대 별 수 |
| `value` | number | `0` | 초기값 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `readonly` | boolean | `false` | 읽기 전용 |
| `half` | boolean | `false` | 반 별 허용 |
| `onChange` | function | `null` | 변경 콜백 |

## SignaturePad

캔버스 기반 서명 패드입니다. 마우스/터치 입력을 지원합니다.

```javascript
const { SignaturePad } = await IMCAT.use('forms');
const pad = new SignaturePad('#signature', {
  width: 400,
  height: 200,
  penColor: '#000000',
  penWidth: 2,
  backgroundColor: '#ffffff'
});
```

### SignaturePad 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `width` | number | `400` | 캔버스 너비 (px) |
| `height` | number | `200` | 캔버스 높이 (px) |
| `backgroundColor` | string | `'#ffffff'` | 배경색 |
| `penColor` | string | `'#000000'` | 펜 색상 |
| `penWidth` | number | `2` | 펜 굵기 |
| `onBegin` | function | `null` | 그리기 시작 콜백 |
| `onEnd` | function | `null` | 그리기 종료 콜백 |

### SignaturePad 메서드

| 메서드 | 반환값 | 설명 |
| --- | --- | --- |
| `.clear()` | — | 서명 지우기 |
| `.isEmpty()` | boolean | 비어있는지 확인 |
| `.toDataURL(type?)` | string | 이미지 Data URL 반환 |
| `.destroy()` | — | 인스턴스 제거 |

## FormWizard

단계별 폼 위저드입니다. 진행률 표시, 검증, 완료 콜백을 지원합니다.

```javascript
const { FormWizard } = await IMCAT.use('forms');
new FormWizard('#wizard', {
  steps: [
    { title: '계정', content: '<input name="email" ...>' },
    { title: '프로필', content: '<input name="name" ...>', validate: () => !!document.querySelector('[name=name]').value },
    { title: '완료', content: '<p>등록 완료!</p>' }
  ],
  onComplete: (data) => console.log('폼 데이터:', data)
});
```

### FormWizard 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계 배열 `{ title, content, validate? }` |
| `startStep` | number | `0` | 시작 단계 |
| `showProgress` | boolean | `true` | 진행률 표시 |
| `showNavigation` | boolean | `true` | 이전/다음 버튼 표시 |
| `prevText` | string | `'이전'` | 이전 버튼 텍스트 |
| `nextText` | string | `'다음'` | 다음 버튼 텍스트 |
| `submitText` | string | `'완료'` | 완료 버튼 텍스트 |
| `onStepChange` | function | `null` | 단계 변경 콜백 |
| `onComplete` | function | `null` | 완료 콜백 (폼 데이터 수집) |
| `onValidationError` | function | `null` | 검증 실패 콜백 |

### FormWizard 메서드

| 메서드 | 반환값 | 설명 |
| --- | --- | --- |
| `.next()` | — | 다음 단계 (검증 후 이동) |
| `.prev()` | — | 이전 단계 |
| `.goToStep(index)` | — | 특정 단계로 이동 |
| `.getCurrentStep()` | number | 현재 단계 인덱스 |
| `.destroy()` | — | 인스턴스 제거 |

## 관련 문서

- [Forms CSS](../css/forms.md) — 폼 스타일 클래스
- [Stepper 모듈](stepper.md) — Stepper 컴포넌트 (진행률 표시만)
- [구현 패턴](../PATTERNS.md) — 파일 업로드 패턴
