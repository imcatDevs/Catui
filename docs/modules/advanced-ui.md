# Advanced UI

SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker — 고급 UI 컴포넌트를 제공합니다.

> 소스: `src/modules/advanced-ui.js`
>
> **이 문서의 핵심**: `IMCAT.use('advanced-ui')` → SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker.
> SplitPane: 분할 패널. QRCode: QR 코드 생성. CopyToClipboard: 클립보드 복사.

## 로드 방법

```javascript
const { SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker } = await IMCAT.use('advanced-ui');
```

## SplitPane

드래그로 크기 조절 가능한 분할 패널입니다.

```javascript
const { SplitPane } = await IMCAT.use('advanced-ui');
new SplitPane('#editor', {
  orientation: 'horizontal',
  sizes: [50, 50],
  minSize: 100,
  onResize: (sizes) => console.log('크기:', sizes)
});
```

## QRCode

QR 코드를 생성합니다.

```javascript
const { QRCode } = await IMCAT.use('advanced-ui');
new QRCode('#qr', {
  text: 'https://imcat.dev',
  size: 200,
  color: '#000000',
  background: '#FFFFFF'
});
```

## CopyToClipboard

클릭으로 텍스트를 클립보드에 복사합니다.

```javascript
const { CopyToClipboard } = await IMCAT.use('advanced-ui');
new CopyToClipboard('#copyBtn', {
  text: '복사할 텍스트',
  onSuccess: () => IMCAT.toast.success('복사됨!'),
  onError: () => IMCAT.toast.error('복사 실패')
});
```

## CodeBlock

구문 강조가 적용된 코드 블록을 렌더링합니다.

```javascript
const { CodeBlock } = await IMCAT.use('advanced-ui');
new CodeBlock('#code', {
  language: 'javascript',
  code: 'const x = 42;\nconsole.log(x);',
  lineNumbers: true,
  copyButton: true
});
```

## SimpleColorPicker

간단한 색상 선택기입니다.

```javascript
const { SimpleColorPicker } = await IMCAT.use('advanced-ui');
new SimpleColorPicker('#colorPick', {
  defaultColor: '#3B82F6',
  onChange: (color) => console.log('색상:', color)
});
```

## 메서드 (공통)

| 메서드 | 설명 |
| --- | --- |
| `.destroy()` | 제거 + 메모리 정리 |

## 관련 문서

- [Navigation](navigation.md) — TreeView (트리 구조 탐색)
- [Pickers](pickers.md) — ColorPicker (고급 색상 선택)
