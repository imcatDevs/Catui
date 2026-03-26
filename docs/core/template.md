# Template

머스태시 스타일 템플릿 엔진 — 변수 바인딩, 자동 XSS 이스케이프, 블록 렌더링을 제공합니다.

> 소스: `src/core/template.js`
>
> **이 문서의 핵심**: `{{변수}}` 자동 이스케이프, `{{{rawHtml}}}` 비이스케이프 (신뢰 소스 전용).
> `{{#section}}...{{/section}}` 조건/반복 블록. `compile()` 캐싱.

## 기본 사용법

```javascript
// 변수 바인딩 (자동 XSS 이스케이프)
const html = IMCAT.template.render(
  '<h1>{{title}}</h1><p>{{content}}</p>',
  { title: '안녕하세요', content: '본문입니다.' }
);
```

## 이스케이프 규칙

| 문법 | 설명 | XSS 방어 |
| --- | --- | --- |
| `{{변수}}` | 자동 이스케이프 | ✅ 안전 |
| `{{{rawHtml}}}` | 이스케이프 없음 | ❌ 신뢰 소스만 |

```javascript
// 안전: 사용자 입력
IMCAT.template.render('이름: {{name}}', { name: '<script>alert(1)</script>' });
// → "이름: &lt;script&gt;alert(1)&lt;/script&gt;"

// 신뢰 소스: 서버 렌더링 HTML
IMCAT.template.render('{{{html}}}', { html: '<b>굵게</b>' });
// → "<b>굵게</b>"
```

## 블록 렌더링

```javascript
// 조건부 (truthy/falsy)
IMCAT.template.render(
  '{{#isAdmin}}<button class="btn btn--danger">삭제</button>{{/isAdmin}}',
  { isAdmin: true }
);

// 배열 반복
IMCAT.template.render(
  '{{#items}}<li>{{name}} - {{price}}원</li>{{/items}}',
  { items: [{ name: '사과', price: 1000 }, { name: '배', price: 2000 }] }
);
```

## Compile (캐싱)

반복 사용 시 컴파일된 템플릿을 캐싱합니다.

```javascript
const compiled = IMCAT.template.compile('<li>{{name}}</li>');
const html1 = compiled({ name: '홍길동' });
const html2 = compiled({ name: '김철수' });
```

## 주요 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.render(template, data)` | string, object | string | 템플릿 렌더링 |
| `.compile(template)` | string | function(data) | 템플릿 컴파일 (캐싱) |

## ⚠️ 보안 주의사항

### renderRaw() / {{{raw}}} 사용 시 필수 확인

> **⛔ 사용자 입력을 renderRaw()에 직접 전달하면 XSS 공격에 노출됩니다.**

```javascript
// ❌ 금지: 사용자 입력 직접 전달
Template.renderRaw('{{content}}', { content: userInput });

// ✅ 안전: 서버 렌더링 HTML (신뢰 소스만)
Template.renderRaw('{{content}}', { content: serverRenderedHTML });

// ✅ 불가피한 경우: Security.sanitize()로 감싸기
Template.renderRaw('{{content}}', {
  content: IMCAT.security.sanitize(userInput)
});
```

### 일반 규칙

- ❌ `{{{변수}}}` / `renderRaw()`에 사용자 입력 전달 금지 → ✅ `{{변수}}` / `render()` 사용
- ❌ 이벤트 핸들러를 템플릿 내 인라인으로 → ✅ 렌더 후 `.on()` 바인딩
- ❌ `innerHTML`에 사용자 입력 직접 삽입 → ✅ `textContent` 또는 `Security.escape()` 사용

## 관련 문서

- [DOM](dom.md) — `.html()` vs `.rawHtml()` 보안 차이
