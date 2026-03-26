# Text Editors

RichTextEditor, MarkdownEditor, TextareaAutosize — 텍스트 편집기 컴포넌트를 제공합니다.

> 소스: `src/modules/text-editors.js`
>
> **이 문서의 핵심**: `IMCAT.use('text-editors')` → RichTextEditor, MarkdownEditor, TextareaAutosize.
> RichTextEditor: WYSIWYG (contentEditable). MarkdownEditor: 마크다운 + 실시간 미리보기. TextareaAutosize: 자동 높이 조절 + 선택적 툴바/상태바.

## 로드 방법

```javascript
const { RichTextEditor, MarkdownEditor, TextareaAutosize } = await IMCAT.use('text-editors');
```

---

## RichTextEditor

WYSIWYG 리치 텍스트 편집기입니다. 키보드 단축키(Ctrl+B/I/U)를 지원합니다.

```javascript
const { RichTextEditor } = await IMCAT.use('text-editors');
const editor = new RichTextEditor('#editor', {
  placeholder: '내용을 입력하세요...',
  toolbar: ['bold', 'italic', 'underline', '|', 'heading', 'quote', '|',
    'ul', 'ol', '|', 'link', 'image', '|', 'code', 'hr', '|', 'undo', 'redo'],
  minHeight: 200,
  maxHeight: 600,
  onChange: (html) => console.log(html),
  onFocus: () => console.log('포커스'),
  onBlur: () => console.log('블러')
});

editor.getHTML();
editor.getText();
editor.setHTML('<p>내용</p>');
editor.clear();
editor.focus();
```

### RichTextEditor 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `placeholder` | string | `'내용을 입력하세요...'` | 플레이스홀더 |
| `toolbar` | array | `['bold','italic','underline',...]` | 툴바 버튼 목록 |
| `minHeight` | number | `200` | 최소 높이 (px) |
| `maxHeight` | number | `600` | 최대 높이 (px) |
| `onChange` | function | `null` | 변경 콜백 `(html)` |
| `onFocus` | function | `null` | 포커스 콜백 |
| `onBlur` | function | `null` | 블러 콜백 |

### 사용 가능한 툴바 버튼

`bold`, `italic`, `underline`, `strikethrough`, `heading`, `quote`, `ul`, `ol`, `link`, `image`, `code`, `hr`, `undo`, `redo`, `alignLeft`, `alignCenter`, `alignRight`, `|` (구분선)

### RichTextEditor 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getHTML()` | HTML 반환 |
| `.getText()` | 텍스트만 반환 |
| `.setHTML(html)` | HTML 설정 |
| `.clear()` | 내용 비우기 |
| `.focus()` | 에디터 포커스 |
| `.destroy()` | 인스턴스 제거 |

---

## MarkdownEditor

마크다운 편집기 + 실시간 프리뷰입니다. 분할 뷰 또는 탭 전환을 지원합니다.

```javascript
const { MarkdownEditor } = await IMCAT.use('text-editors');
const md = new MarkdownEditor('#mdEditor', {
  value: '',
  placeholder: '마크다운을 입력하세요...',
  preview: true,
  splitView: true,
  toolbar: ['bold', 'italic', 'strikethrough', '|',
    'h1', 'h2', 'h3', '|', 'ul', 'ol', 'task', '|',
    'link', 'image', 'code', 'codeblock', '|', 'quote', 'hr', 'table'],
  minHeight: 300,
  onChange: (markdown) => console.log(markdown)
});

md.getValue();
md.getHTML();
md.setValue('# 제목\n내용');
md.clear();
md.focus();
```

### MarkdownEditor 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | string | `''` | 초기값 |
| `placeholder` | string | `'마크다운을 입력하세요...'` | 플레이스홀더 |
| `preview` | boolean | `true` | 미리보기 패널 |
| `splitView` | boolean | `true` | 분할 뷰 (false면 탭 전환) |
| `toolbar` | array | `['bold','italic',...]` | 툴바 버튼 목록 |
| `minHeight` | number | `300` | 최소 높이 (px) |
| `onChange` | function | `null` | 변경 콜백 `(markdown)` |

### 사용 가능한 툴바 버튼

`bold`, `italic`, `strikethrough`, `h1`, `h2`, `h3`, `ul`, `ol`, `task`, `link`, `image`, `code`, `codeblock`, `quote`, `hr`, `table`, `|` (구분선)

### MarkdownEditor 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 마크다운 텍스트 반환 |
| `.getHTML()` | 파싱된 HTML 반환 |
| `.setValue(markdown)` | 마크다운 설정 |
| `.clear()` | 내용 비우기 |
| `.focus()` | 에디터 포커스 |
| `.destroy()` | 인스턴스 제거 |

---

## TextareaAutosize

textarea의 높이를 내용에 따라 자동으로 조절합니다. 선택적 툴바와 글자 수 상태바를 지원합니다.

```javascript
const { TextareaAutosize } = await IMCAT.use('text-editors');
new TextareaAutosize('#myTextarea', {
  minRows: 3,
  maxRows: 10,
  toolbar: ['clear', 'copy', '|', 'undo', 'redo'],
  showCount: true,
  maxLength: 500,
  onChange: (value) => console.log(value)
});
```

### TextareaAutosize 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `minRows` | number | `2` | 최소 행 수 |
| `maxRows` | number | `10` | 최대 행 수 |
| `toolbar` | array | `null` | 툴바 버튼 (`'clear'`/`'copy'`/`'undo'`/`'redo'`/`'\|'`) |
| `showCount` | boolean | `false` | 글자 수/줄 수 상태바 |
| `maxLength` | number | `0` | 최대 길이 (0=무제한, 상태바에 표시) |
| `onChange` | function | `null` | 변경 콜백 `(value)` |

### TextareaAutosize 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 값 반환 |
| `.setValue(value)` | 값 설정 |
| `.clear()` | 내용 비우기 |
| `.resize()` | 수동 리사이즈 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Forms CSS](../css/forms.md) — textarea 스타일
