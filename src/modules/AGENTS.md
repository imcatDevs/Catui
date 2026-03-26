# 확장 모듈 가이드

## 모듈 목록 (22개)

`theme`, `overlays`, `dropdown`, `navigation`, `pickers`, `selectors`,
`forms`, `feedback`, `tooltips`, `carousel`, `data-viz`,
`stepper`, `scroll`, `live-status`, `advanced-ui`, `text-editors`,
`media-viewer`, `social`, `imagelist`, `security-input`, `gantt`, `pagination`

## 모듈 작성 규칙

- 각 모듈은 **단일 파일** (`src/modules/{모듈명}.js`)
- 반드시 `export default`를 제공 (동적 로딩 호환)
- 복합 모듈은 객체로 export: `export default { Modal, Drawer, Offcanvas }`
- 코어 모듈(`src/core/`)을 직접 import하지 않음 — `IMCAT` 인스턴스를 통해 접근
- 하위 모듈 로딩 지원: `IMCAT.use('overlays/modal')` → `Modal` 클래스 직접 반환
- 컴포넌트 내부 이벤트는 `EventEmitterMixin.apply(this)` 권장 (`new EventBus()` 대신)

## destroy() 필수

모든 UI 컴포넌트 클래스에 `destroy()` 메서드 구현:

- 이벤트 리스너 해제
- DOM에서 생성한 요소 제거
- 타이머/인터벌 정리
- 참조 null 처리

## 빌드 등록

새 모듈은 반드시 `rollup.config.js`의 모듈 배열에 추가:

```javascript
const moduleConfigs = [
  'theme', 'overlays', /* ... */, '새모듈명'
].map(createModuleConfig);
```

## 스타일

- 모듈 전용 SCSS: `src/styles/modules/_{모듈명}.scss`
- 모듈 CSS는 `dist/modules/{모듈명}.css`로 개별 빌드 (`autoLoadModuleCSS: true`로 자동 로드)
- 전체 번들이 필요한 경우 `imcat-ui.all.scss` 사용
- CSS 클래스 접두사: `.imcat-{모듈명}`
