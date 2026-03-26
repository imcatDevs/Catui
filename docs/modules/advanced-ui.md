# Advanced UI

SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker — 고급 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/advanced-ui.js`
>
> **이 문서의 핵심**: `IMCAT.use('advanced-ui')` → SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker.
> SplitPane: 분할 패널. QRCode: QR 코드 생성. CopyToClipboard: 클립보드 복사.
> CodeBlock: 코드 블록 + 복사. SimpleColorPicker: 프리셋 색상 선택.

## 로드 방법

```javascript
const { SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker } = await IMCAT.use('advanced-ui');
```

---

## SplitPane

드래그로 크기 조절 가능한 분할 패널입니다. 키보드, 터치 지원.

```javascript
const { SplitPane } = await IMCAT.use('advanced-ui');
new SplitPane('#editor', {
  direction: 'horizontal',
  initialSizes: [50, 50],
  minSizes: [100, 100],
  maxSizes: [Infinity, Infinity],
  gutterSize: 8,
  snapOffset: 30,
  collapsible: false,
  onDragStart: () => console.log('드래그 시작'),
  onDrag: (sizes) => console.log('크기:', sizes),
  onDragEnd: (sizes) => console.log('드래그 종료:', sizes)
});
```

### SplitPane 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `direction` | string | `'horizontal'` | 분할 방향 (`'horizontal'`/`'vertical'`) |
| `initialSizes` | array | `[50, 50]` | 초기 크기 (퍼센트) |
| `minSizes` | array | `[100, 100]` | 최소 크기 (px) |
| `maxSizes` | array | `[Infinity, Infinity]` | 최대 크기 (px) |
| `gutterSize` | number | `8` | 구분선 크기 (px) |
| `snapOffset` | number | `30` | 스냅 오프셋 (px) |
| `collapsible` | boolean | `false` | 접기 가능 여부 |
| `onDragStart` | function | `null` | 드래그 시작 콜백 |
| `onDrag` | function | `null` | 드래그 중 콜백 `(sizes)` |
| `onDragEnd` | function | `null` | 드래그 종료 콜백 `(sizes)` |

### SplitPane 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setSizes(sizes)` | 크기 설정 (퍼센트 배열, 합계 100) |
| `.getSizes()` | 현재 크기 반환 |
| `.collapseFirst()` | 첫 번째 패널 접기/펼치기 (`collapsible: true` 필요) |
| `.collapseSecond()` | 두 번째 패널 접기/펼치기 |
| `.destroy()` | 인스턴스 제거 |

---

## QRCode

QR Server API를 사용하여 실제 스캔 가능한 QR 코드를 생성합니다.

```javascript
const { QRCode } = await IMCAT.use('advanced-ui');
new QRCode('#qr', {
  text: 'https://imcat.dev',
  size: 200,
  colorDark: '000000',
  colorLight: 'ffffff',
  correctLevel: 'M',
  margin: 4,
  format: 'png'
});
```

### QRCode 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `text` | string | `''` | QR 코드에 인코딩할 텍스트/URL |
| `size` | number | `200` | 이미지 크기 (px) |
| `colorDark` | string | `'000000'` | 전경색 (hex, `#` 없이) |
| `colorLight` | string | `'ffffff'` | 배경색 (hex, `#` 없이) |
| `correctLevel` | string | `'M'` | 오류 보정 레벨 (`'L'`/`'M'`/`'Q'`/`'H'`) |
| `margin` | number | `4` | 여백 (모듈 단위) |
| `format` | string | `'png'` | 이미지 형식 (`'png'`/`'svg'`) |

### QRCode 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setText(text)` | 텍스트 변경 |
| `.setColors(dark, light)` | 색상 변경 (hex) |
| `.setSize(size)` | 크기 변경 |
| `.getImageUrl()` | 이미지 URL 반환 |
| `.toDataURL()` | 이미지 데이터 URL 반환 (Promise) |
| `.download(filename?)` | 이미지 다운로드 (기본: `'qrcode.png'`) |
| `.destroy()` | 인스턴스 제거 |

---

## CopyToClipboard

버튼에 바인딩하여 텍스트를 클립보드에 복사합니다. static 메서드로 직접 사용도 가능합니다.

```javascript
const { CopyToClipboard } = await IMCAT.use('advanced-ui');

// 인스턴스 방식 — 버튼에 바인딩
new CopyToClipboard('#copyBtn', {
  target: '#sourceText',
  feedbackText: '복사됨!',
  feedbackDuration: 2000,
  onSuccess: (text) => IMCAT.toast.success('복사됨!'),
  onError: (err) => IMCAT.toast.error('복사 실패')
});

// static 방식 — 직접 복사
await CopyToClipboard.copy('복사할 텍스트');
await CopyToClipboard.copyFrom('#sourceElement');
```

### CopyToClipboard 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `target` | string/element | `null` | 복사 대상 셀렉터 또는 요소 |
| `text` | string | `''` | 직접 복사할 텍스트 (`target`보다 우선) |
| `feedbackText` | string | `'복사됨!'` | 복사 후 표시 텍스트 |
| `feedbackDuration` | number | `2000` | 피드백 표시 시간 (ms) |
| `onSuccess` | function | `null` | 복사 성공 콜백 `(text)` |
| `onError` | function | `null` | 복사 실패 콜백 `(error)` |

### CopyToClipboard 메서드

| 메서드 | 설명 |
| --- | --- |
| `CopyToClipboard.copy(text)` | (static) 텍스트 클립보드 복사 → `Promise<boolean>` |
| `CopyToClipboard.copyFrom(selector)` | (static) 요소의 텍스트 복사 → `Promise<boolean>` |
| `.destroy()` | 인스턴스 제거 |

---

## CodeBlock

복사 버튼이 포함된 코드 블록을 렌더링합니다.

```javascript
const { CodeBlock } = await IMCAT.use('advanced-ui');
new CodeBlock('#code', {
  code: 'const x = 42;\nconsole.log(x);',
  language: 'javascript',
  showLineNumbers: true,
  copyButton: true,
  copyText: '복사',
  copiedText: '복사됨!',
  copiedDuration: 2000
});
```

### CodeBlock 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `code` | string | `''` | 코드 내용 |
| `language` | string | `'javascript'` | 언어 표시 |
| `showLineNumbers` | boolean | `false` | 줄 번호 표시 |
| `lineNumbers` | boolean | `false` | `showLineNumbers` 별칭 |
| `copyButton` | boolean | `true` | 복사 버튼 표시 |
| `copyText` | string | `'복사'` | 복사 버튼 텍스트 |
| `copiedText` | string | `'복사됨!'` | 복사 완료 텍스트 |
| `copiedDuration` | number | `2000` | 복사 완료 표시 시간 (ms) |

### CodeBlock 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setCode(code)` | 코드 내용 변경 |
| `.destroy()` | 인스턴스 제거 |

---

## SimpleColorPicker

프리셋 색상 + 직접 입력을 지원하는 간단한 색상 선택기입니다.

```javascript
const { SimpleColorPicker } = await IMCAT.use('advanced-ui');
new SimpleColorPicker('#colorPick', {
  value: '#3b82f6',
  showInput: true,
  onChange: (color) => console.log('색상:', color)
});
```

### SimpleColorPicker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `colors` | array | `['#ef4444', '#f97316', ...]` | 프리셋 색상 배열 (20색) |
| `value` | string | `'#3b82f6'` | 초기 선택 색상 |
| `showInput` | boolean | `true` | 직접 입력 필드 표시 (네이티브 color + 텍스트) |
| `onChange` | function | `null` | 색상 변경 콜백 `(color)` |

### SimpleColorPicker 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setValue(color)` | 색상 설정 |
| `.getValue()` | 현재 색상 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Navigation](navigation.md) — TreeView (트리 구조 탐색)
- [Pickers](pickers.md) — ColorPicker (고급 색상 선택)
