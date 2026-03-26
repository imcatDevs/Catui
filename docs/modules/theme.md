# Theme

테마 관리 — 라이트/다크 전환, CSS 변수 오버라이드, View Transitions를 제공합니다.

> 소스: `src/modules/theme.js`
>
> **이 문서의 핵심**: `IMCAT.use('theme')` → `createTheme()`.
> `toggle()` 라이트↔다크. `setTheme('light'|'dark'|'system')`.
> CSS 변수 오버라이드로 커스텀 테마 생성.

## 로드 방법

```javascript
const TM = await IMCAT.use('theme');
```

## 기본 사용

```javascript
const TM = await IMCAT.use('theme');
const theme = TM.createTheme({
  defaultTheme: 'system',
  transition: 'fade',
  transitionDuration: 300,
  onChange: (resolved) => {
    console.log('테마:', resolved);  // 'light' 또는 'dark'
  }
});

// 토글
theme.toggle();

// 특정 테마 설정
theme.setTheme('dark');

// 현재 테마 (시스템 해석 후)
const current = theme.getResolved();  // 'light' 또는 'dark'
```

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `defaultTheme` | string | `'system'` | 기본 테마 (`'light'`/`'dark'`/`'system'`) |
| `transition` | string | `'fade'` | 전환 효과 (`'fade'`/`'slide'`/`'none'`) |
| `transitionDuration` | number | `300` | 전환 시간 (ms) |
| `storageKey` | string | `'imcat-theme'` | localStorage 키 |
| `onChange` | function | `null` | 테마 변경 콜백 |

## CSS 변수 오버라이드

```css
/* 커스텀 테마 색상 */
:root {
  --primary: #8B5CF6;         /* 보라색 Primary */
  --primary-hover: #7C3AED;
  --bg-primary: #FAFAFA;
  --text-primary: #1A1A1A;
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --text-primary: #E5E5E5;
}
```

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.toggle()` | 라이트 ↔ 다크 토글 |
| `.setTheme(theme)` | 테마 설정 (`'light'`/`'dark'`/`'system'`) |
| `.getTheme()` | 설정된 테마 값 |
| `.getResolved()` | 실제 적용 테마 (`'light'` 또는 `'dark'`) |
| `.destroy()` | 제거 |

## 관련 문서

- [Config](../core/config.md) — `theme` 글로벌 설정
- [구현 패턴](../PATTERNS.md) — 테마 전환 패턴
