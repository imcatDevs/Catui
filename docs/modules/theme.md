# Theme

테마 관리 — 라이트/다크 전환, View Transitions API 기반 전환 효과, 커스텀 테마를 제공합니다.

> 소스: `src/modules/theme.js`
>
> **이 문서의 핵심**: `IMCAT.use('theme')` → { createTheme, getTheme, initTheme, Theme }.
> 싱글톤 패턴: `createTheme()`. 전환 효과: fade/slide/circle (View Transitions API + 폴백).
> `toggleWithEvent(e)` — 클릭 위치 기반 원형 전환.

## 로드 방법

```javascript
const TM = await IMCAT.use('theme');
```

## 기본 사용

```javascript
const TM = await IMCAT.use('theme');
const theme = TM.createTheme({
  defaultTheme: 'system',
  transition: 'circle',
  transitionDuration: 800,
  themes: {},
  onChange: (resolved, setting) => {
    console.log('테마:', resolved, '설정:', setting);
  }
});

// 토글
theme.toggle();

// 클릭 위치 기반 원형 전환
btn.addEventListener('click', (e) => theme.toggleWithEvent(e));

// 특정 테마 설정
theme.setTheme('dark');

// 현재 테마
theme.getResolved();  // 'light' 또는 'dark'
theme.getTheme();     // 'light', 'dark', 또는 'system'
theme.isDark();       // boolean
```

## 싱글톤 팩토리

| 함수 | 설명 |
| --- | --- |
| `createTheme(options)` | 싱글톤 생성 (이미 있으면 기존 반환) |
| `getTheme()` | 싱글톤 인스턴스 반환 (없으면 null) |
| `initTheme(options)` | 기존 인스턴스 파괴 후 새로 생성 |

## 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `defaultTheme` | string | `'system'` | 기본 테마 (`'light'`/`'dark'`/`'system'`) |
| `storageKey` | string | `'imcat-theme'` | localStorage 키 |
| `transition` | string | `'none'` | 전환 효과 (아래 표 참조) |
| `transitionDuration` | number | `800` | 전환 시간 (ms) |
| `themes` | object | `{}` | 커스텀 테마 CSS 변수 맵 |
| `onChange` | function | `null` | 변경 콜백 `(resolved, setting)` |

### 전환 효과 타입

| 값 | 설명 |
| --- | --- |
| `'none'` | 즉시 전환 |
| `'fade'` | 페이드 전환 |
| `'slide'` | 슬라이드 전환 |
| `'circle'` | 원형 확대 (우하단) |
| `'circle-top-left'` | 원형 확대 (좌상단) |
| `'circle-top-right'` | 원형 확대 (우상단) |
| `'circle-bottom-left'` | 원형 확대 (좌하단) |
| `'circle-bottom-right'` | 원형 확대 (우하단) |
| `'circle-center'` | 원형 확대 (중앙) |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `.toggle(animate?)` | 라이트 ↔ 다크 토글 |
| `.toggleTheme()` | 토글 (레거시 호환) |
| `.toggleWithEvent(event, theme?)` | 클릭/터치 위치 기반 원형 전환 |
| `.set(theme, save?, animate?)` | 테마 설정 |
| `.setTheme(theme, animate?)` | 테마 설정 (레거시 호환) |
| `.setWithCircleAt(theme, x, y, duration?)` | 특정 좌표에서 원형 전환 |
| `.setTransition(transition, duration?)` | 전환 효과 변경 |
| `.get()` | 설정된 테마 반환 (`'light'`/`'dark'`/`'system'`) |
| `.getTheme()` | 설정된 테마 반환 (레거시 호환) |
| `.getResolved()` | 실제 적용 테마 (`'light'` 또는 `'dark'`) |
| `.getActualTheme()` | 실제 적용 테마 (레거시 호환) |
| `.getSystemTheme()` | 시스템 테마 반환 |
| `.isDark()` | 다크 모드 여부 |
| `.isLight()` | 라이트 모드 여부 |
| `.onChange(listener)` | 변경 리스너 등록 (구독 해제 함수 반환) |
| `.register(name, vars)` | 커스텀 테마 등록 |
| `.registerCustomTheme(name, colors)` | 커스텀 테마 등록 (레거시 호환) |
| `.reset()` | 기본 테마로 리셋 |
| `.destroy()` | 인스턴스 제거 |

## 커스텀 테마

```javascript
// JS에서 커스텀 테마 등록
theme.register('purple', {
  '--text-primary': '#1A1A1A',
  '--bg-primary': '#F5F3FF',
  '--primary': '#8B5CF6'
});
theme.set('purple');
```

```css
/* CSS 변수 오버라이드 */
:root {
  --primary: #8B5CF6;
  --bg-primary: #FAFAFA;
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --text-primary: #E5E5E5;
}
```

---

## 관련 문서

- [Config](../core/config.md) — `theme` 글로벌 설정
- [구현 패턴](../PATTERNS.md) — 테마 전환 패턴
