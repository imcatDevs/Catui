# DOM

jQuery 스타일의 체이닝 가능한 DOM 조작 API를 제공합니다.

> 소스: `src/core/dom.js`
>
> **이 문서의 핵심**: `IMCAT('#selector')` → DOMElement 래퍼. 체이닝: `.addClass().text().on()`.
> `.html(value)`는 자동 XSS 이스케이프. 신뢰 소스는 `.rawHtml()` 사용.

## 구조: IMCATFunction

`IMCAT`은 **함수이자 객체**(`IMCATFunction`)입니다.

- **함수로 호출**: `IMCAT('#selector')` → `DOMElement` 래퍼 반환 (체이닝 가능)
- **객체로 접근**: `IMCAT.toast`, `IMCAT.on/emit/off`, `IMCAT.use()` 등 프레임워크 API

```javascript
// 함수: DOM 래핑
IMCAT('#app').addClass('active');

// 객체: 프레임워크 API
IMCAT.toast.success('성공!');
const { Modal } = await IMCAT.use('overlays');
```

## 기본 사용법

`IMCAT()` 함수는 CSS 선택자로 DOM 요소를 래핑합니다.

```javascript
// 단일 요소
IMCAT('#app').addClass('active').text('Hello!');

// 다중 요소
IMCAT('.item').each((el, i) => {
  el.classList.add('loaded');
});
```

## 클래스 조작

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.addClass(name)` | string | DOMElement | 클래스 추가 |
| `.removeClass(name)` | string | DOMElement | 클래스 제거 |
| `.toggleClass(name)` | string | DOMElement | 클래스 토글 |
| `.hasClass(name)` | string | boolean | 클래스 존재 여부 |

```javascript
IMCAT('#box').addClass('active').removeClass('hidden');
if (IMCAT('#box').hasClass('active')) { /* ... */ }
```

## 콘텐츠 조작

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.text(value)` | string | DOMElement | 텍스트 설정 (XSS 안전) |
| `.text()` | — | string | 텍스트 가져오기 |
| `.html(value)` | string | DOMElement | HTML 설정 (**자동 XSS 이스케이프**) |
| `.html()` | — | string | HTML 가져오기 |
| `.rawHtml(value)` | string | DOMElement | HTML 설정 (이스케이프 없음, **신뢰 소스 전용**) |

```javascript
// 안전: 사용자 입력은 html()로
IMCAT('#output').html(userInput);  // <script> 태그 자동 무력화

// 신뢰 소스만 rawHtml()로
IMCAT('#container').rawHtml('<div class="card"><p>안전한 HTML</p></div>');
```

## 속성 / 데이터

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.attr(name, value)` | string, string | DOMElement | 속성 설정 |
| `.attr(name)` | string | string | 속성 가져오기 |
| `.removeAttr(name)` | string | DOMElement | 속성 제거 |
| `.data(key, value)` | string, any | DOMElement | data-* 설정 |
| `.data(key)` | string | any | data-* 가져오기 |

## 스타일

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.css(prop, value)` | string, string | DOMElement | 스타일 설정 |
| `.css(obj)` | object | DOMElement | 다중 스타일 설정 |
| `.css(prop)` | string | string | 스타일 가져오기 |

```javascript
IMCAT('#box').css('color', 'red');
IMCAT('#box').css({ color: 'red', fontSize: '16px' });
```

## 이벤트

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.on(event, handler)` | string, function | DOMElement | 이벤트 바인딩 |
| `.on(event, selector, handler)` | string, string, function | DOMElement | 이벤트 위임 |
| `.off(event, handler)` | string, function | DOMElement | 이벤트 제거 |

```javascript
// 직접 바인딩
IMCAT('.btn').on('click', (e) => {
  IMCAT.toast.info('클릭!');
});

// 이벤트 위임 (동적 요소에 유용)
IMCAT('#list').on('click', '.list__item', (e) => {
  console.log(e.target.textContent);
});
```

## 표시 / 숨김

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.show()` | — | DOMElement | 표시 |
| `.hide()` | — | DOMElement | 숨김 |
| `.toggle()` | — | DOMElement | 토글 |

## DOM 삽입 / 제거

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.append(el)` | Element/string | DOMElement | 자식 끝에 추가 |
| `.prepend(el)` | Element/string | DOMElement | 자식 앞에 추가 |
| `.appendTo(parent)` | Element/string | DOMElement | 부모에 자신 추가 |
| `.remove()` | — | DOMElement | 요소 제거 |
| `.empty()` | — | DOMElement | 내용 비우기 |

## 탐색

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.find(selector)` | string | DOMElement | 하위 요소 검색 |
| `.parent()` | — | DOMElement | 부모 요소 |
| `.closest(selector)` | string | DOMElement | 가장 가까운 조상 |
| `.siblings()` | — | DOMElement | 형제 요소 |
| `.next()` | — | DOMElement | 다음 형제 |
| `.prev()` | — | DOMElement | 이전 형제 |
| `.first()` | — | DOMElement | 첫 번째 요소 |
| `.last()` | — | DOMElement | 마지막 요소 |
| `.eq(index)` | number | DOMElement | N번째 요소 |
| `.get(index)` | number? | HTMLElement/Array | 원본 DOM 요소 반환 |

```javascript
IMCAT('#list').find('.item').first().addClass('active');
IMCAT('.active').parent().closest('.container');
```

## 반복

```javascript
IMCAT('.item').each((el, index) => {
  console.log(index, el.textContent);
});
```

## ⚠️ 주의사항

- ❌ `.rawHtml()`에 사용자 입력 전달 금지 → ✅ `.html()` 사용 (자동 이스케이프)
- ❌ `document.querySelector` 직접 사용 → ✅ `IMCAT('#el')` 권장

## 관련 문서

- [Auto Init](../core/auto-init.md) — 자동 초기화
- [치트시트](../CHEATSHEET.md) — 전체 API 한눈에 보기
