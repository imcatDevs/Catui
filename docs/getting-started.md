# 시작하기

IMCAT UI 프레임워크를 설치하고 첫 번째 페이지를 만드는 방법을 안내합니다.

> 소스: `dist/` 폴더 전체 | **라이브 데모**: [catui.imcat.dev](https://catui.imcat.dev/)
>
> **이 문서의 핵심**: ZIP 다운로드 또는 npm 설치 → CSS/JS 로드 → `IMCAT.alert()` 등 단축 API 사용.
> `dist/imcat-ui.css`는 `<head>`에, `dist/imcat-ui.min.js`는 `</body>` 직전에 배치.

## 설치 방법

### 1. ZIP 다운로드 (가장 빠름)

[imcatui-1.1.2.zip 다운로드](../examples/data/imcatui-1.1.2.zip) — JS + CSS + 폰트 포함 (약 400KB)

압축 해제 후 `dist/` 폴더를 프로젝트 루트에 복사합니다.

### 2. npm 설치

```bash
# npm
npm install @imcat-ckim/catui

# pnpm
pnpm add @imcat-ckim/catui
```

### 3. ESM import (번들러 환경)

```javascript
import IMCAT from '@imcat-ckim/catui/dist/imcat-ui.esm.js';
```

## 프로젝트 폴더 구조

```text
my-project/
├── index.html
└── dist/
    ├── imcat-ui.css          ← 코어 CSS
    ├── imcat-ui.min.js       ← IIFE 번들 (전역 IMCAT)
    ├── imcat-ui.esm.js       ← ESM 번들
    ├── fonts/                ← 내장 폰트
    └── modules/
        ├── overlays.js       ← 개별 모듈 JS
        ├── overlays.css      ← 개별 모듈 CSS (자동 로드)
        ├── navigation.js
        ├── navigation.css
        └── ...               ← 22개 모듈
```

## 최소 보일러플레이트

아래 HTML을 복사하면 바로 실행할 수 있습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My IMCAT App</title>

  <!-- IMCAT UI CSS -->
  <link rel="stylesheet" href="dist/imcat-ui.css">

  <!-- Material Icons (아이콘 사용 시 필요) -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined">
</head>
<body>

  <h1>Hello IMCAT UI!</h1>
  <button class="btn btn--primary" onclick="run()">클릭하세요</button>

  <!-- IMCAT UI JS (body 끝) -->
  <script src="dist/imcat-ui.min.js"></script>
  <script>
    async function run() {
      // 1. Alert
      await IMCAT.alert('안녕하세요!');

      // 2. Confirm
      const ok = await IMCAT.confirm('계속할까요?');

      // 3. Toast
      IMCAT.toast.success(ok ? '확인!' : '취소됨');
    }
  </script>
</body>
</html>
```

## 핵심 사용법 3가지

### 1. 단축 API (모듈 자동 로드)

```javascript
// 모달, 확인, 알림 — 모듈을 자동으로 로드합니다
await IMCAT.alert('알림 메시지');
const ok = await IMCAT.confirm('삭제하시겠습니까?');
await IMCAT.modal({ title: '제목', content: '내용' });

// 토스트 — 4가지 타입
IMCAT.toast.success('저장 완료');
IMCAT.toast.error('오류 발생');
IMCAT.toast.warning('주의');
IMCAT.toast.info('안내');
```

### 2. DOM 조작 (jQuery 스타일)

```javascript
// 선택 + 체이닝
IMCAT('#app').addClass('active').text('Ready!');

// 이벤트 바인딩
IMCAT('.btn').on('click', (e) => {
  IMCAT.toast.info('버튼 클릭!');
});

// 속성/스타일
IMCAT('#box').css('color', 'red').attr('title', '안내');
```

### 3. 모듈 동적 로드

```javascript
// 모듈 로드 (JS + CSS 자동 로드)
const { Modal, Drawer } = await IMCAT.use('overlays');

// 사용
new Modal({
  title: '모달 제목',
  content: '<p>모달 내용입니다.</p>',
  buttons: [
    { text: '닫기', variant: 'secondary', close: true },
    { text: '확인', variant: 'primary', close: true }
  ]
}).show();

// 하위 모듈만 로드
const Tabs = await IMCAT.use('navigation/tabs');
```

## 빌드 산출물 설명

| 파일 | 용도 |
| --- | --- |
| `imcat-ui.css` | 코어 CSS (타이포, 버튼, 카드, 폼 등) |
| `imcat-ui.min.js` | 압축 IIFE 번들 — 전역 `IMCAT` 객체 생성 (프로덕션 권장) |
| `imcat-ui.js` | 비압축 IIFE (디버깅용) |
| `imcat-ui.esm.js` | ESM 번들 (번들러 환경용) |
| `modules/*.js` | 개별 ESM 모듈 (`IMCAT.use()`로 자동 로드) |
| `modules/*.css` | 개별 모듈 CSS (`autoLoadModuleCSS: true`로 자동 로드) |

## ⚠️ 주의사항

- ❌ `dist/modules/`의 JS 파일을 직접 `<script>`로 로드하지 마세요 → ✅ `IMCAT.use('모듈명')` 사용
- ❌ `innerHTML`에 사용자 입력을 직접 넣지 마세요 → ✅ `IMCAT('#el').html(value)` 사용 (자동 XSS 방어)
- ❌ `eval()`, `new Function()` 사용 금지

## 다음 단계

- [CSS 클래스 — Buttons](css/buttons.md) — 버튼 스타일링
- [Core API — DOM](core/dom.md) — DOM 조작 상세
- [모듈 — Overlays](modules/overlays.md) — Modal, Drawer
- [치트시트](CHEATSHEET.md) — 전체 API 한눈에 보기
- [구현 패턴](PATTERNS.md) — CRUD, 폼 검증 등 실전 코드
