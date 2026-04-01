/**
 * Text Editors Module 테스트
 * RichTextEditor, MarkdownEditor, TextareaAutosize
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let RichTextEditor, MarkdownEditor, TextareaAutosize;

beforeEach(async () => {
  const mod = await import('../../src/modules/text-editors.js');
  RichTextEditor = mod.RichTextEditor || mod.default?.RichTextEditor;
  MarkdownEditor = mod.MarkdownEditor || mod.default?.MarkdownEditor;
  TextareaAutosize = mod.TextareaAutosize || mod.default?.TextareaAutosize;
  document.body.innerHTML = '<div id="te-container"></div><textarea id="ta-input"></textarea>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('RichTextEditor', () => {
  it('RichTextEditor 클래스가 존재해야 함', () => {
    expect(RichTextEditor).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var rte = new RichTextEditor('#te-container');
    expect(rte).toBeDefined();
    rte.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var rte = new RichTextEditor('#te-container');
    if (rte && typeof rte.destroy === 'function') {
      rte.destroy();
    }
  });
});

describe('MarkdownEditor', () => {
  it('MarkdownEditor 클래스가 존재해야 함', () => {
    expect(MarkdownEditor).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var mde = new MarkdownEditor('#te-container');
    expect(mde).toBeDefined();
    mde.destroy?.();
  });
});

describe('TextareaAutosize', () => {
  it('TextareaAutosize 클래스가 존재해야 함', () => {
    expect(TextareaAutosize).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var ta = new TextareaAutosize('#ta-input');
    expect(ta).toBeDefined();
    ta.destroy?.();
  });
});

describe('RichTextEditor 추가', () => {
  it('getHTML / setHTML / getText / clear', () => {
    var rte = new RichTextEditor('#te-container');
    rte.setHTML('<p>테스트</p>');
    expect(rte.getHTML()).toBe('<p>테스트</p>');
    expect(rte.getText()).toBe('테스트');
    rte.clear();
    expect(rte.getHTML()).toBe('');
    rte.destroy?.();
  });

  it('setHTML() 기본값은 sanitize 적용', () => {
    var rte = new RichTextEditor('#te-container');
    // 악성 HTML 입력
    rte.setHTML('<script>alert("XSS")</script><p>안전</p>');
    // script 태그가 제거되어야 함
    expect(rte.getHTML()).not.toContain('<script>');
    expect(rte.getHTML()).toContain('<p>안전</p>');
    rte.destroy?.();
  });

  it('setHTML(html, true)는 sanitize 생략', () => {
    var rte = new RichTextEditor('#te-container');
    // trusted=true로 신뢰 HTML 설정
    rte.setHTML('<p>신뢰</p>', true);
    expect(rte.getHTML()).toBe('<p>신뢰</p>');
    rte.destroy?.();
  });

  it('focus()', () => {
    var rte = new RichTextEditor('#te-container');
    rte.focus();
    rte.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new RichTextEditor('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var rte = new RichTextEditor('#te-container', { onChange });
    rte.editor.innerHTML = '변경됨';
    rte.editor.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalled();
    rte.destroy?.();
  });

  it('onFocus / onBlur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    var rte = new RichTextEditor('#te-container', { onFocus, onBlur });
    rte.editor.dispatchEvent(new Event('focus'));
    expect(onFocus).toHaveBeenCalled();
    rte.editor.dispatchEvent(new Event('blur'));
    expect(onBlur).toHaveBeenCalled();
    rte.destroy?.();
  });
});

describe('MarkdownEditor 추가', () => {
  it('존재하지 않는 컨테이너 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new MarkdownEditor('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('getValue / setValue / clear', () => {
    var mde = new MarkdownEditor('#te-container');
    if (mde.setValue) {
      mde.setValue('# 제목');
      expect(mde.getValue()).toBe('# 제목');
      mde.clear?.();
      expect(mde.getValue()).toBe('');
    }
    mde.destroy?.();
  });

  it('getHTML — 마크다운 파싱', () => {
    var mde = new MarkdownEditor('#te-container');
    mde.setValue('**볼드** _이탈릭_ ~~삭제~~');
    var html = mde.getHTML();
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<del>');
    mde.destroy?.();
  });

  it('splitView 옵션', () => {
    var mde = new MarkdownEditor('#te-container', { splitView: true });
    expect(mde.container.classList.contains('markdown-editor--split')).toBe(true);
    mde.destroy?.();
  });

  it('tabs 모드에서 탭 전환', () => {
    var mde = new MarkdownEditor('#te-container', { splitView: false, preview: true });
    var previewTab = mde.container.querySelector('[data-tab="preview"]');
    if (previewTab) previewTab.click();
    var editTab = mde.container.querySelector('[data-tab="edit"]');
    if (editTab) editTab.click();
    mde.destroy?.();
  });

  it('onChange 콜백', () => {
    const onChange = vi.fn();
    var mde = new MarkdownEditor('#te-container', { onChange });
    mde.textarea.value = '변경됨';
    mde.textarea.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalled();
    mde.destroy?.();
  });

  it('focus()', () => {
    var mde = new MarkdownEditor('#te-container');
    mde.focus();
    mde.destroy?.();
  });

  it('preview false', () => {
    var mde = new MarkdownEditor('#te-container', { preview: false });
    mde.destroy?.();
  });
});

describe('TextareaAutosize 추가', () => {
  it('인스턴스 생성', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el');
    expect(ta).toBeDefined();
    ta.destroy?.();
  });

  it('getValue / setValue / clear', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el');
    ta.setValue('테스트 텍스트');
    expect(ta.getValue()).toBe('테스트 텍스트');
    ta.clear();
    expect(ta.getValue()).toBe('');
    ta.destroy?.();
  });

  it('showCount 옵션', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el', { showCount: true, maxLength: 100 });
    ta.setValue('hello');
    expect(ta.footerEl).not.toBeNull();
    ta.destroy?.();
  });

  it('toolbar 옵션', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el', { toolbar: ['clear', '|', 'copy'] });
    expect(ta.toolbarEl).not.toBeNull();
    ta.destroy?.();
  });

  it('onChange 콜백', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    const onChange = vi.fn();
    var ta = new TextareaAutosize('#ta-el', { onChange });
    ta.textarea.value = '입력';
    ta.textarea.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalled();
    ta.destroy?.();
  });

  it('resize()', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el');
    ta.resize();
    ta.destroy?.();
  });

  it('focus / blur 이벤트', () => {
    document.body.innerHTML = '<div id="ta-wrap"><textarea id="ta-el"></textarea></div>';
    var ta = new TextareaAutosize('#ta-el');
    ta.textarea.dispatchEvent(new Event('focus'));
    expect(ta.wrapper.classList.contains('is-focused')).toBe(true);
    ta.textarea.dispatchEvent(new Event('blur'));
    expect(ta.wrapper.classList.contains('is-focused')).toBe(false);
    ta.destroy?.();
  });

  it('존재하지 않는 요소 에러', () => {
    var spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new TextareaAutosize('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('RichTextEditor 추가2', () => {
  it('툴바 버튼 클릭 — bold', () => {
    var rte = new RichTextEditor('#te-container');
    var boldBtn = rte.toolbar.querySelector('[data-command="bold"]');
    if (boldBtn) boldBtn.click();
    rte.destroy?.();
  });

  it('키보드 단축키 — Ctrl+B/I/U', () => {
    var rte = new RichTextEditor('#te-container');
    rte.editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }));
    rte.editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, bubbles: true }));
    rte.editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', ctrlKey: true, bubbles: true }));
    rte.destroy?.();
  });

  it('defaults()', () => {
    var d = RichTextEditor.defaults();
    expect(d.toolbar).toContain('bold');
  });

  it('툴바에 알 수 없는 항목', () => {
    var rte = new RichTextEditor('#te-container', { toolbar: ['bold', '|', 'unknown'] });
    rte.destroy?.();
  });
});

describe('MarkdownEditor 추가2', () => {
  it('툴바 bold 액션 (래핑형)', () => {
    var mde = new MarkdownEditor('#te-container');
    mde.textarea.value = 'hello';
    mde.textarea.selectionStart = 0;
    mde.textarea.selectionEnd = 5;
    var boldBtn = mde.toolbar.querySelector('[data-action="bold"]');
    if (boldBtn) boldBtn.click();
    expect(mde.getValue()).toContain('**hello**');
    mde.destroy?.();
  });

  it('툴바 hr 액션 (삽입형)', () => {
    var mde = new MarkdownEditor('#te-container');
    var hrBtn = mde.toolbar.querySelector('[data-action="hr"]');
    if (hrBtn) hrBtn.click();
    expect(mde.getValue()).toContain('---');
    mde.destroy?.();
  });

  it('툴바 table 액션', () => {
    var mde = new MarkdownEditor('#te-container');
    var tableBtn = mde.toolbar.querySelector('[data-action="table"]');
    if (tableBtn) tableBtn.click();
    expect(mde.getValue()).toContain('제목');
    mde.destroy?.();
  });

  it('키보드 Ctrl+B/I', () => {
    var mde = new MarkdownEditor('#te-container');
    mde.textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }));
    mde.textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, bubbles: true }));
    mde.destroy?.();
  });

  it('키보드 Tab 키 — 들여쓰기', () => {
    var mde = new MarkdownEditor('#te-container');
    mde.textarea.value = 'text';
    mde.textarea.selectionStart = 0;
    mde.textarea.selectionEnd = 0;
    mde.textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(mde.getValue()).toContain('  ');
    mde.destroy?.();
  });

  it('마크다운 파싱 — 코드블록, 링크, 이미지, 리스트, 체크리스트', () => {
    var mde = new MarkdownEditor('#te-container', { splitView: true });
    mde.setValue([
      '```js',
      'var x = 1;',
      '```',
      '`inline`',
      '# H1',
      '## H2',
      '### H3',
      '> 인용',
      '---',
      '[링크](http://example.com)',
      '![이미지](http://img.jpg)',
      '- [x] 완료',
      '- [ ] 미완료',
      '- 항목',
      '1. 순서'
    ].join('\n'));
    var html = mde.getHTML();
    expect(html).toContain('<code>');
    expect(html).toContain('<h1>');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<a ');
    mde.destroy?.();
  });

  it('마크다운 파싱 — 특수문자 포함 언어명 코드 블록 (c++, c#, objective-c)', () => {
    var mde = new MarkdownEditor('#te-container', { splitView: true });
    mde.setValue([
      '```c++',
      'int main() {}',
      '```',
      '',
      '```c#',
      'Console.WriteLine();',
      '```',
      '',
      '```objective-c',
      '[obj method];',
      '```'
    ].join('\n'));
    var html = mde.getHTML();
    expect(html).toContain('language-c++');
    expect(html).toContain('language-c#');
    expect(html).toContain('language-objective-c');
    expect(html).toContain('int main() {}');
    expect(html).toContain('Console.WriteLine();');
    expect(html).toContain('[obj method];');
    mde.destroy?.();
  });

  it('마크다운 파싱 — h4, highlight, sub, sup, details', () => {
    var mde = new MarkdownEditor('#te-container', { splitView: true });
    mde.setValue([
      '#### 제목 4',
      '==형광펜==',
      'H~2~O',
      'E=mc^2^',
      '<details>',
      '<summary>접기</summary>',
      '',
      '내용',
      '',
      '</details>'
    ].join('\n'));
    var html = mde.getHTML();
    expect(html).toContain('<h4>');
    expect(html).toContain('<mark>형광펜</mark>');
    expect(html).toContain('<sub>2</sub>');
    expect(html).toContain('<sup>2</sup>');
    expect(html).toContain('<details>');
    expect(html).toContain('<summary>접기</summary>');
    mde.destroy?.();
  });

  it('defaults() — 새 툴바 버튼 포함', () => {
    var d = MarkdownEditor.defaults();
    expect(d.splitView).toBe(true);
    expect(d.toolbar).toContain('highlight');
    expect(d.toolbar).toContain('h4');
    expect(d.toolbar).toContain('sub');
    expect(d.toolbar).toContain('sup');
    expect(d.toolbar).toContain('details');
  });

  it('initial value 옵션', () => {
    var mde = new MarkdownEditor('#te-container', { value: '# 초기값' });
    expect(mde.getValue()).toBe('# 초기값');
    mde.destroy?.();
  });
});

describe('TextareaAutosize 추가2', () => {
  it('툴바 clear 액션', () => {
    document.body.innerHTML = '<div id="ta-w"><textarea id="ta-e"></textarea></div>';
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var ta = new TextareaAutosize('#ta-e', { toolbar: ['clear', '|', 'copy', 'undo', 'redo'] });
    ta.setValue('테스트');
    var clearBtn = ta.toolbarEl.querySelector('[data-action="clear"]');
    if (clearBtn) clearBtn.click();
    expect(ta.getValue()).toBe('');
    ta.destroy?.();
  });

  it('툴바 copy 액션', () => {
    document.body.innerHTML = '<div id="ta-w"><textarea id="ta-e"></textarea></div>';
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    var ta = new TextareaAutosize('#ta-e', { toolbar: ['copy'] });
    ta.setValue('복사 텍스트');
    var copyBtn = ta.toolbarEl.querySelector('[data-action="copy"]');
    if (copyBtn) copyBtn.click();
    ta.destroy?.();
  });

  it('maxLength 초과 — is-over 클래스', () => {
    document.body.innerHTML = '<div id="ta-w"><textarea id="ta-e"></textarea></div>';
    var ta = new TextareaAutosize('#ta-e', { showCount: true, maxLength: 5 });
    ta.setValue('123456');
    ta.textarea.dispatchEvent(new Event('input'));
    expect(ta.footerEl.classList.contains('is-over')).toBe(true);
    ta.destroy?.();
  });

  it('defaults()', () => {
    var d = TextareaAutosize.defaults();
    expect(d.minRows).toBe(2);
  });

  it('maxRows 제한', () => {
    document.body.innerHTML = '<div id="ta-w"><textarea id="ta-e"></textarea></div>';
    var ta = new TextareaAutosize('#ta-e', { maxRows: 3 });
    ta.setValue('1\n2\n3\n4\n5\n6\n7\n8');
    ta.resize();
    ta.destroy?.();
  });
});
