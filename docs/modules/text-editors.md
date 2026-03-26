# Text Editors

RichTextEditor, MarkdownEditor, TextareaAutosize — 텍스트 편집기 컴포넌트를 제공합니다.

> 소스: `src/modules/text-editors.js`
>
> **이 문서의 핵심**: `IMCAT.use('text-editors')` → RichTextEditor, MarkdownEditor, TextareaAutosize.
> RichTextEditor: WYSIWYG 편집기. MarkdownEditor: 마크다운 + 미리보기. TextareaAutosize: 자동 높이 조절.

## 로드 방법

```javascript
const { RichTextEditor, MarkdownEditor, TextareaAutosize } = await IMCAT.use('text-editors');
```

## RichTextEditor

```javascript
const { RichTextEditor } = await IMCAT.use('text-editors');
const editor = new RichTextEditor('#editor', {
  toolbar: ['bold', 'italic', 'underline', '|', 'h1', 'h2', '|', 'ul', 'ol', '|', 'link', 'image'],
  placeholder: '내용을 입력하세요...',
  height: '300px',
  onChange: (html) => console.log(html)
});

// 값 가져오기
const content = editor.getHTML();
const text = editor.getText();
```

### RichTextEditor 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `toolbar` | array | `[...]` | 툴바 버튼 목록 |
| `placeholder` | string | `''` | 플레이스홀더 |
| `height` | string | `'200px'` | 높이 |
| `maxLength` | number | `0` | 최대 길이 (0=무제한) |
| `onChange` | function | `null` | 변경 콜백 |

### RichTextEditor 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getHTML()` | HTML 가져오기 |
| `.getText()` | 텍스트만 가져오기 |
| `.setHTML(html)` | HTML 설정 |
| `.clear()` | 내용 비우기 |
| `.destroy()` | 제거 |

## MarkdownEditor

```javascript
const { MarkdownEditor } = await IMCAT.use('text-editors');
new MarkdownEditor('#mdEditor', {
  preview: true,
  toolbar: ['bold', 'italic', 'heading', '|', 'code', 'link', 'image', '|', 'preview'],
  onChange: (markdown) => console.log(markdown)
});
```

## TextareaAutosize

textarea의 높이를 내용에 따라 자동으로 조절합니다.

```javascript
const { TextareaAutosize } = await IMCAT.use('text-editors');
new TextareaAutosize('#myTextarea', {
  minRows: 3,
  maxRows: 10
});
```

## 관련 문서

- [Forms CSS](../css/forms.md) — textarea 스타일
