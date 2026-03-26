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

---

## FileUpload

드래그 앤 드롭 파일 업로드입니다. 미리보기, 진행률 표시, 업로드 시뮬레이션을 지원합니다.

```javascript
const { FileUpload } = await IMCAT.use('forms');
const uploader = new FileUpload('#uploader', {
  accept: 'image/*',
  multiple: true,
  maxSize: 5 * 1024 * 1024,
  maxFiles: 10,
  dropzone: true,
  preview: true,
  showProgress: true,
  dropzoneText: '파일을 드래그하거나 클릭하여 업로드',
  onChange: (files) => console.log('파일:', files.length),
  onRemove: (name) => console.log('제거:', name),
  onError: (msg) => IMCAT.toast.error(msg),
  onUploadStart: (files) => console.log('시작'),
  onUploadProgress: (file, percent) => console.log(percent + '%'),
  onUploadComplete: (files) => console.log('완료')
});

// 업로드 시뮬레이션 (진행률 바 애니메이션)
await uploader.simulateUpload(2000);
```

### FileUpload 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `accept` | string | `'*/*'` | 허용 파일 타입 (MIME/확장자) |
| `multiple` | boolean | `false` | 다중 파일 |
| `maxSize` | number | `10485760` | 최대 파일 크기 (바이트, 10MB) |
| `maxFiles` | number | `10` | 최대 파일 수 |
| `dropzone` | boolean | `true` | 드롭존 UI |
| `preview` | boolean | `true` | 미리보기 |
| `showProgress` | boolean | `false` | 진행률 바 |
| `dropzoneText` | string | `'파일을 드래그하거나 클릭하여 업로드'` | 드롭존 텍스트 |
| `onChange` | function | `null` | 파일 변경 콜백 `(files)` |
| `onRemove` | function | `null` | 파일 제거 콜백 `(name)` |
| `onError` | function | `null` | 에러 콜백 `(message)` |
| `onUploadStart` | function | `null` | 업로드 시작 콜백 `(files)` |
| `onUploadProgress` | function | `null` | 진행 콜백 `(file, percent)` |
| `onUploadComplete` | function | `null` | 완료 콜백 `(files)` |

### FileUpload 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getFiles()` | 파일 배열 반환 |
| `.clear()` | 파일 전체 제거 |
| `.setProgress(fileName, percent)` | 특정 파일 진행률 설정 |
| `.simulateUpload(duration?)` | 업로드 시뮬레이션 (async, 기본 2000ms) |
| `.destroy()` | 인스턴스 제거 |

---

## Rating

별점 입력 컴포넌트입니다.

```javascript
const { Rating } = await IMCAT.use('forms');
const rating = new Rating('#rating', {
  max: 5,
  value: 3,
  size: 'md',
  readonly: false,
  icon: 'star',
  iconEmpty: 'star_border',
  color: '#f59e0b',
  onChange: (value) => console.log('별점:', value)
});

rating.getValue();
rating.setValue(4);
```

### Rating 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `max` | number | `5` | 최대 별 수 |
| `value` | number | `0` | 초기값 |
| `readonly` | boolean | `false` | 읽기 전용 |
| `icon` | string | `'star'` | 채워진 아이콘 |
| `iconEmpty` | string | `'star_border'` | 빈 아이콘 |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `color` | string | `'#f59e0b'` | 별 색상 |
| `onChange` | function | `null` | 변경 콜백 `(value)` |

### Rating 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 현재 값 반환 |
| `.setValue(value)` | 값 설정 |
| `.destroy()` | 인스턴스 제거 |

---

## SignaturePad

캔버스 기반 서명 패드입니다. 마우스/터치 입력을 지원합니다. 지우기/저장 내장 툴바 포함.

```javascript
const { SignaturePad } = await IMCAT.use('forms');
const pad = new SignaturePad('#signature', {
  width: 400,
  height: 200,
  backgroundColor: '#ffffff',
  penColor: '#000000',
  penWidth: 2,
  onBegin: () => console.log('그리기 시작'),
  onEnd: () => console.log('그리기 종료')
});

pad.isEmpty();
pad.toDataURL('image/png');
pad.clear();
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

| 메서드 | 설명 |
| --- | --- |
| `.clear()` | 서명 지우기 |
| `.isEmpty()` | 비어있는지 확인 |
| `.toDataURL(type?)` | 이미지 Data URL 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## FormWizard

단계별 폼 위저드입니다. 진행률 표시, 비동기 검증, 폼 데이터 자동 수집을 지원합니다.

```javascript
const { FormWizard } = await IMCAT.use('forms');
new FormWizard('#wizard', {
  steps: [
    { title: '계정', content: '<input name="email" ...>' },
    { title: '프로필', content: '<input name="name" ...>', validate: () => !!document.querySelector('[name=name]').value },
    { title: '완료', content: '<p>등록 완료!</p>' }
  ],
  startStep: 0,
  showProgress: true,
  showNavigation: true,
  prevText: '이전',
  nextText: '다음',
  submitText: '완료',
  onStepChange: (step) => console.log('단계:', step),
  onComplete: (data) => console.log('폼 데이터:', data),
  onValidationError: (step) => console.log('검증 실패:', step)
});
```

### FormWizard 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` | array | `[]` | 단계 배열 `{ title, content, validate? }` |
| `startStep` | number | `0` | 시작 단계 |
| `showProgress` | boolean | `true` | 진행률 표시 |
| `showNavigation` | boolean | `true` | 이전/다음 버튼 |
| `prevText` | string | `'이전'` | 이전 버튼 텍스트 |
| `nextText` | string | `'다음'` | 다음 버튼 텍스트 |
| `submitText` | string | `'완료'` | 완료 버튼 텍스트 |
| `onStepChange` | function | `null` | 단계 변경 콜백 `(step)` |
| `onComplete` | function | `null` | 완료 콜백 `(data)` (폼 데이터 자동 수집) |
| `onValidationError` | function | `null` | 검증 실패 콜백 `(step)` |

### FormWizard 메서드

| 메서드 | 설명 |
| --- | --- |
| `.next()` | 다음 단계 (비동기 검증 후 이동) |
| `.prev()` | 이전 단계 |
| `.goToStep(index)` | 특정 단계로 이동 |
| `.getCurrentStep()` | 현재 단계 인덱스 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Forms CSS](../css/forms.md) — 폼 스타일 클래스
- [Stepper 모듈](stepper.md) — Stepper 컴포넌트 (진행률 표시만)
- [구현 패턴](../PATTERNS.md) — 파일 업로드 패턴
