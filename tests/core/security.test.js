/**
 * Security Module 테스트
 */

import { describe, it, expect } from 'vitest';
import { Security } from '../../src/core/security.js';

describe('Security Module', () => {
  describe('escape()', () => {
    it('HTML 특수 문자를 이스케이프해야 함', () => {
      expect(Security.escape('<script>alert("XSS")</script>'))
        .toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('& 문자를 이스케이프해야 함', () => {
      expect(Security.escape('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('작은따옴표를 이스케이프해야 함', () => {
      expect(Security.escape("It's fine")).toBe('It&#x27;s fine');
    });

    it('문자열이 아닌 값은 그대로 반환해야 함', () => {
      expect(Security.escape(123)).toBe(123);
      expect(Security.escape(null)).toBe(null);
      expect(Security.escape(undefined)).toBe(undefined);
    });
  });

  describe('sanitize()', () => {
    it('script 태그를 제거해야 함', () => {
      const html = '<p>안전</p><script>alert("XSS")</script>';
      const result = Security.sanitize(html);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>안전</p>');
    });

    it('iframe 태그를 제거해야 함', () => {
      const html = '<div>내용</div><iframe src="evil.com"></iframe>';
      const result = Security.sanitize(html);
      expect(result).not.toContain('<iframe');
      expect(result).toContain('<div>내용</div>');
    });

    it('on* 이벤트 핸들러를 제거해야 함', () => {
      const html = '<button onclick="alert(1)">클릭</button>';
      const result = Security.sanitize(html);
      expect(result).not.toContain('onclick');
      expect(result).toContain('<button>클릭</button>');
    });

    it('javascript: URL을 제거해야 함', () => {
      const html = '<a href="javascript:alert(1)">링크</a>';
      const result = Security.sanitize(html);
      expect(result).not.toContain('javascript:');
    });

    it('안전한 HTML은 그대로 유지해야 함', () => {
      const html = '<div><h1>제목</h1><p>내용</p><a href="/page">링크</a></div>';
      const result = Security.sanitize(html);
      expect(result).toContain('<h1>제목</h1>');
      expect(result).toContain('<p>내용</p>');
      expect(result).toContain('<a href="/page">링크</a>');
    });

    it('빈 문자열을 반환해야 함 (문자열이 아닌 경우)', () => {
      expect(Security.sanitize(null)).toBe('');
      expect(Security.sanitize(123)).toBe('');
    });
  });

  describe('validatePath()', () => {
    it('안전한 경로는 true를 반환해야 함', () => {
      expect(Security.validatePath('views/home.html')).toBe(true);
      expect(Security.validatePath('views/users/profile.html')).toBe(true);
      expect(Security.validatePath('views/admin/dashboard.php')).toBe(true);
    });

    it('URL 쿼리 스트링이 포함된 경로를 허용해야 함', () => {
      expect(Security.validatePath('views/products.html?id=1')).toBe(true);
      expect(Security.validatePath('views/products.html?category=all&sort=asc')).toBe(true);
      expect(Security.validatePath('views/user.html?name=john')).toBe(true);
    });

    it('상위 디렉토리 접근을 차단해야 함', () => {
      expect(Security.validatePath('../etc/passwd')).toBe(false);
      expect(Security.validatePath('views/../config.php')).toBe(false);
      expect(Security.validatePath('views/..\\..\\config.php')).toBe(false);
    });

    it('절대 경로를 차단해야 함', () => {
      expect(Security.validatePath('/etc/passwd')).toBe(false);
      expect(Security.validatePath('/views/home.html')).toBe(false);
    });

    it('views/ 폴더 외부 경로를 차단해야 함', () => {
      expect(Security.validatePath('config/database.php')).toBe(false);
      expect(Security.validatePath('home.html')).toBe(false);
    });

    it('null byte를 차단해야 함', () => {
      expect(Security.validatePath('views/home.html\0.txt')).toBe(false);
      expect(Security.validatePath('views/home.html%00.txt')).toBe(false);
    });

    it('URL 인코딩 우회를 차단해야 함', () => {
      expect(Security.validatePath('views/%2e%2e%2fetc/passwd')).toBe(false);
    });

    it('허용되지 않은 확장자를 차단해야 함', () => {
      expect(Security.validatePath('views/script.js')).toBe(false);
      expect(Security.validatePath('views/data.json')).toBe(false);
    });

    it('위험한 문자를 차단해야 함', () => {
      expect(Security.validatePath('views/home<script>.html')).toBe(false);
      expect(Security.validatePath('views/home;rm -rf.html')).toBe(false);
    });

    it('빈 문자열이나 null을 차단해야 함', () => {
      expect(Security.validatePath('')).toBe(false);
      expect(Security.validatePath(null)).toBe(false);
    });
  });

  describe('isSafeFilename()', () => {
    it('안전한 파일명은 true를 반환해야 함', () => {
      expect(Security.isSafeFilename('document.pdf')).toBe(true);
      expect(Security.isSafeFilename('report_2024.xlsx')).toBe(true);
      expect(Security.isSafeFilename('image-01.png')).toBe(true);
    });

    it('경로 구분자를 포함하면 false를 반환해야 함', () => {
      expect(Security.isSafeFilename('folder/file.txt')).toBe(false);
      expect(Security.isSafeFilename('..\\..\\config.ini')).toBe(false);
    });

    it('.. 를 포함하면 false를 반환해야 함', () => {
      expect(Security.isSafeFilename('..file.txt')).toBe(false);
      expect(Security.isSafeFilename('file..txt')).toBe(false);
    });

    it('null byte를 차단해야 함', () => {
      expect(Security.isSafeFilename('file.txt\0.exe')).toBe(false);
    });

    it('위험한 문자를 차단해야 함', () => {
      expect(Security.isSafeFilename('file<script>.txt')).toBe(false);
      expect(Security.isSafeFilename('file;rm.txt')).toBe(false);
    });

    it('너무 긴 파일명을 차단해야 함', () => {
      const longName = 'a'.repeat(300) + '.txt';
      expect(Security.isSafeFilename(longName)).toBe(false);
    });

    it('빈 문자열이나 null을 차단해야 함', () => {
      expect(Security.isSafeFilename('')).toBe(false);
      expect(Security.isSafeFilename(null)).toBe(false);
    });
  });

  describe('isSafeUrl()', () => {
    it('안전한 URL은 true를 반환해야 함', () => {
      expect(Security.isSafeUrl('https://example.com')).toBe(true);
      expect(Security.isSafeUrl('http://example.com/page')).toBe(true);
      expect(Security.isSafeUrl('/relative/path')).toBe(true);
      expect(Security.isSafeUrl('data:image/png;base64,ABC')).toBe(true);
    });

    it('javascript: 프로토콜을 차단해야 함', () => {
      expect(Security.isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(Security.isSafeUrl('JavaScript:alert(1)')).toBe(false);
    });

    it('vbscript: 프로토콜을 차단해야 함', () => {
      expect(Security.isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    });

    it('file: 프로토콜을 차단해야 함', () => {
      expect(Security.isSafeUrl('file:///etc/passwd')).toBe(false);
    });

    it('data: 프로토콜(이미지 제외)을 차단해야 함', () => {
      expect(Security.isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('빈 문자열이나 null을 차단해야 함', () => {
      expect(Security.isSafeUrl('')).toBe(false);
      expect(Security.isSafeUrl(null)).toBe(false);
    });
  });

  describe('sanitizeCSS()', () => {
    it('안전한 CSS 값은 그대로 유지해야 함', () => {
      expect(Security.sanitizeCSS('red')).toBe('red');
      expect(Security.sanitizeCSS('100px')).toBe('100px');
      expect(Security.sanitizeCSS('#ff0000')).toBe('#ff0000');
    });

    it('expression()을 제거해야 함', () => {
      const css = 'width: expression(alert(1))';
      const result = Security.sanitizeCSS(css);
      expect(result).not.toContain('expression');
    });

    it('javascript: URL을 제거해야 함', () => {
      const css = 'background: url(javascript:alert(1))';
      const result = Security.sanitizeCSS(css);
      expect(result).not.toContain('javascript:');
    });

    it('@import를 제거해야 함', () => {
      const css = '@import url(evil.css)';
      const result = Security.sanitizeCSS(css);
      expect(result).not.toContain('@import');
    });

    it('빈 문자열을 반환해야 함 (문자열이 아닌 경우)', () => {
      expect(Security.sanitizeCSS(null)).toBe('');
      expect(Security.sanitizeCSS(123)).toBe('');
    });
  });

  describe('sanitizeParam()', () => {
    it('SQL 인젝션 문자를 제거해야 함', () => {
      expect(Security.sanitizeParam("'; DROP TABLE users--")).not.toContain("'");
      expect(Security.sanitizeParam('"; DROP TABLE users--')).not.toContain('"');
    });

    it('XSS 문자를 이스케이프해야 함', () => {
      const result = Security.sanitizeParam('<script>alert(1)</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('백슬래시를 제거해야 함', () => {
      expect(Security.sanitizeParam('test\\value')).not.toContain('\\');
    });

    it('문자열이 아닌 값은 그대로 반환해야 함', () => {
      expect(Security.sanitizeParam(123)).toBe(123);
      expect(Security.sanitizeParam(null)).toBe(null);
    });
  });

  describe('sanitize() data URL 처리', () => {
    it('이미지가 아닌 data: URL을 제거해야 함', () => {
      const html = '<a href="data:text/html,<script>alert(1)</script>">link</a>';
      const result = Security.sanitize(html);
      const div = document.createElement('div');
      div.innerHTML = result;
      const a = div.querySelector('a');
      if (a) {
        expect(a.getAttribute('href') || '').not.toMatch(/^data:text/);
      }
    });

    it('이미지 data: URL은 허용해야 함', () => {
      const html = '<img src="data:image/png;base64,abc123">';
      const result = Security.sanitize(html);
      expect(result).toContain('data:image/png');
    });
  });

  describe('validatePath() 정규화 불일치', () => {
    it('중복 슬래시가 포함된 경로는 거부해야 함', () => {
      expect(Security.validatePath('views//page.html')).toBe(false);
    });
  });

  // ============================================
  // XSS 페이로드 테스트
  // ============================================
  describe('XSS 페이로드 방어', () => {
    it('SVG onload 벡터를 차단해야 함', () => {
      const result = Security.sanitize('<svg onload="alert(1)">');
      expect(result).not.toContain('onload');
    });

    it('IMG onerror 벡터를 차단해야 함', () => {
      const result = Security.sanitize('<img src=x onerror="alert(1)">');
      expect(result).not.toContain('onerror');
    });

    it('대소문자 혼합 이벤트 핸들러를 차단해야 함', () => {
      const result = Security.sanitize('<div OnClick="alert(1)">test</div>');
      expect(result).not.toMatch(/onclick/i);
    });

    it('공백 우회 이벤트 핸들러를 차단해야 함', () => {
      const result = Security.sanitize('<div on\nclick="alert(1)">test</div>');
      expect(result).not.toMatch(/onclick/i);
    });

    it('data: URL 인코딩 우회를 차단해야 함', () => {
      const result = Security.sanitize('<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">link</a>');
      const div = document.createElement('div');
      div.innerHTML = result;
      const a = div.querySelector('a');
      if (a) {
        expect(a.getAttribute('href') || '').not.toMatch(/^data:text/);
      }
    });

    it('javascript: 대소문자 변형을 차단해야 함', () => {
      const result = Security.sanitize('<a href="JaVaScRiPt:alert(1)">link</a>');
      expect(result).not.toMatch(/javascript:/i);
    });

    it('object 태그를 차단해야 함', () => {
      const result = Security.sanitize('<object data="evil.swf"></object>');
      expect(result).not.toContain('<object');
    });

    it('embed 태그를 차단해야 함', () => {
      const result = Security.sanitize('<embed src="evil.swf">');
      expect(result).not.toContain('<embed');
    });

    it('base 태그를 차단해야 함', () => {
      const result = Security.sanitize('<base href="https://evil.com/">');
      expect(result).not.toContain('<base');
    });

    it('form 태그의 javascript: action을 차단해야 함', () => {
      const result = Security.sanitize('<form action="javascript:alert(1)"><input></form>');
      expect(result).not.toMatch(/javascript:/i);
    });

    it('meta refresh를 차단해야 함', () => {
      const result = Security.sanitize('<meta http-equiv="refresh" content="0;url=evil.com">');
      expect(result).not.toContain('<meta');
    });

    it('style 태그 인젝션을 차단해야 함', () => {
      const result = Security.sanitize('<style>body{background:url("javascript:alert(1)")}</style>');
      expect(result).not.toContain('<style');
    });

    it('link 태그 인젝션을 차단해야 함', () => {
      const result = Security.sanitize('<link rel="stylesheet" href="https://evil.com/steal.css">');
      expect(result).not.toContain('<link');
    });

    it('escape()는 모든 HTML 특수 문자를 이스케이프해야 함', () => {
      const payload = '"><img src=x onerror=alert(1)>';
      const result = Security.escape(payload);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('"');
    });

    it('SVG foreignObject 인젝션을 차단해야 함', () => {
      const result = Security.sanitize('<svg><foreignObject><body onload="alert(1)"></body></foreignObject></svg>');
      expect(result).not.toMatch(/onload/i);
    });
  });

  // ============================================
  // Path Traversal 우회 테스트
  // ============================================
  describe('Path Traversal 고급 우회 방어', () => {
    it('이중 인코딩 우회를 차단해야 함', () => {
      expect(Security.validatePath('views/%252e%252e%252fetc/passwd')).toBe(false);
    });

    it('백슬래시 경로 (Windows)를 차단해야 함', () => {
      expect(Security.validatePath('views\\..\\..\\etc\\passwd')).toBe(false);
    });

    it('혼합 슬래시 경로를 차단해야 함', () => {
      expect(Security.validatePath('views/..\\..\\etc/passwd')).toBe(false);
    });

    it('긴 경로명도 올바른 형식이면 허용해야 함', () => {
      const longPath = 'views/' + 'a'.repeat(50) + '.html';
      expect(Security.validatePath(longPath)).toBe(true);
    });

    it('null byte + 확장자 위장을 차단해야 함', () => {
      expect(Security.validatePath('views/page.html\x00.js')).toBe(false);
    });

    it('.htaccess 접근을 차단해야 함', () => {
      expect(Security.validatePath('views/.htaccess')).toBe(false);
    });

    it('유니코드 슬래시 변형을 차단해야 함', () => {
      // U+2215 DIVISION SLASH, U+FF0F FULLWIDTH SOLIDUS
      expect(Security.validatePath('views/..∕etc/passwd')).toBe(false);
    });

    it('URL 인코딩된 백슬래시를 차단해야 함', () => {
      expect(Security.validatePath('views/%5c..%5c..%5cetc/passwd')).toBe(false);
    });
  });

  // ============================================
  // innerHTML Sanitization 심화 테스트
  // ============================================
  describe('innerHTML Sanitization 심화', () => {
    it('중첩된 script 태그의 실행을 방지해야 함', () => {
      const html = '<div><scr<script>ipt>alert(1)</scr</script>ipt></div>';
      const result = Security.sanitize(html);
      // sanitize는 <script> 태그를 제거하므로 실행 가능한 스크립트 없음
      expect(result).not.toContain('alert(1)</scr');
    });

    it('HTML 주석 내 script는 브라우저에서 실행되지 않음을 확인', () => {
      const html = '<div><!--<script>alert(1)</script>--></div>';
      const result = Security.sanitize(html);
      // HTML 주석 내 스크립트는 브라우저에서 실행되지 않으므로 안전
      const div = document.createElement('div');
      div.innerHTML = result;
      expect(div.querySelector('script')).toBeNull();
    });

    it('여러 위험 태그가 혼합된 HTML을 정리해야 함', () => {
      const html = '<p>안전</p><script>bad</script><iframe src="x"></iframe><img onerror="bad" src="x">';
      const result = Security.sanitize(html);
      expect(result).toContain('<p>안전</p>');
      expect(result).not.toContain('<script');
      expect(result).not.toContain('<iframe');
      expect(result).not.toMatch(/onerror/i);
    });

    it('안전한 태그와 속성은 유지해야 함', () => {
      const html = '<div class="box"><span style="color:red">텍스트</span><a href="/page">링크</a></div>';
      const result = Security.sanitize(html);
      expect(result).toContain('class="box"');
      expect(result).toContain('<a href="/page">링크</a>');
    });

    it('빈 문자열 입력 시 빈 문자열을 반환해야 함', () => {
      expect(Security.sanitize('')).toBe('');
    });

    it('일반 텍스트만 있는 경우 그대로 유지해야 함', () => {
      expect(Security.sanitize('일반 텍스트')).toBe('일반 텍스트');
    });

    it('sanitizeCSS()는 세미콜론을 차단해야 함', () => {
      const result = Security.sanitizeCSS('color: red; background: url(javascript:alert(1))');
      expect(result).not.toContain('javascript:');
    });

    it('sanitizeCSS()는 중괄호를 차단해야 함', () => {
      const result = Security.sanitizeCSS('color: red} .evil { background: red');
      expect(result).not.toContain('}');
      expect(result).not.toContain('{');
    });

    it('sanitizeCSS()는 url() 패턴을 차단해야 함', () => {
      const result = Security.sanitizeCSS('background: url(https://evil.com/steal.png)');
      expect(result).not.toMatch(/url\s*\(/i);
    });
  });
});
