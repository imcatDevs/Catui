# Changelog

IMCAT UI의 모든 주요 변경사항이 이 파일에 기록됩니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다.

## [1.2.0] - 2025-03-28

### Added

- CI/CD 워크플로우 추가 (lint, test, build, bundle size)
- GitHub Pages 데모 사이트 배포 워크플로우
- GitHub Wiki 문서 (9개 페이지)
  - Home, Getting Started, Installation, Configuration
  - API Reference, Examples, FAQ
  - Contributing, Changelog

### Changed

- Dependabot PR 병합
  - globals 16.5.0 → 17.4.0
  - @rollup/plugin-babel 6.1.0 → 7.0.0
  - archiver 6.0.2 → 7.0.1
- README.md Issues/Discussions 링크 수정
- CONTRIBUTING.md clone URL 및 ESLint v9 마이그레이션 섹션 업데이트

### Fixed

- jsdom 26+ ESM 호환성 문제로 25.0.1 유지

## [1.1.0] - 2025-03-27

### Added

- 확장 모듈 22개 추가
- 동적 모듈 로딩 시스템
- SPA 라우팅
- XSS 자동 방어
- EventEmitterMixin

### Changed

- Core API 리팩토링
- CSS 아키텍처 개선
- JSDoc 문서화

### Fixed

- 다양한 버그 수정

## [1.0.0] - 2025-01-15

### Added

- 초기 릴리스
- Core 모듈 20개
- 기본 컴포넌트 (Modal, Toast, Tooltip, Dropdown 등)
- IIFE/ESM 번들
- TypeScript 정의 파일
- SCSS 스타일 시스템

---

## 버전 규칙

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 새 기능 추가 (하위 호환)
- **PATCH**: 버그 수정 (하위 호환)
