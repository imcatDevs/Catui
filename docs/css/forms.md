# Forms

폼 컴포넌트 CSS 클래스 — 입력 필드, 셀렉트, 체크박스, 스위치, 검증 상태를 제공합니다.

> 소스: `src/styles/components/_inputs.scss`
>
> **이 문서의 핵심**: `.form-group` > `.form-label` + `.form-control` 구조.
> `.form-input`은 `.form-control`의 BEM alias. 검증: `.is-valid`/`.is-invalid`.
> 체크박스/라디오는 Bootstrap 호환 클래스 사용 (`.form-check-input`, `.form-check-label`).

## 기본 구조

```html
<div class="form-group">
  <label class="form-label">이름</label>
  <input type="text" class="form-control" placeholder="이름 입력">
</div>

<!-- BEM alias도 동일하게 동작 -->
<div class="form-group">
  <label class="form-label">이름</label>
  <input type="text" class="form-input" placeholder="이름 입력">
</div>
```

## 입력 요소

| 클래스 | 설명 |
| --- | --- |
| `.form-group` | 폼 그룹 래퍼 (label + input) |
| `.form-label` | 라벨 |
| `.form-control` | 텍스트 입력, textarea (Bootstrap 호환) |
| `.form-input` | `.form-control`의 BEM alias |
| `.form-select` | 셀렉트 (드롭다운) |
| `.form-helper` | 도움말 텍스트 (입력 아래) |
| `.form-text` | 도움말 텍스트 (Bootstrap 호환, `.form-helper` alias) |

## 체크박스 / 라디오 / 스위치

```html
<!-- 체크박스 -->
<div class="form-check">
  <input type="checkbox" class="form-check-input" id="check1">
  <label class="form-check-label" for="check1">체크박스</label>
</div>

<!-- 라디오 -->
<div class="form-check">
  <input type="radio" class="form-check-input" name="r1" id="radio1">
  <label class="form-check-label" for="radio1">옵션 1</label>
</div>

<!-- 인라인 체크 -->
<div class="form-check form-check--inline">
  <input type="checkbox" class="form-check-input" id="inline1">
  <label class="form-check-label" for="inline1">인라인</label>
</div>

<!-- 스위치 -->
<div class="form-check form-switch">
  <input type="checkbox" class="form-check-input" id="switch1">
  <label class="form-check-label" for="switch1">알림 허용</label>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.form-check` | 체크박스/라디오 래퍼 |
| `.form-check-input` | 체크박스/라디오 input |
| `.form-check-label` | 체크박스/라디오 label |
| `.form-check--inline` | 인라인 배치 |
| `.form-switch` | 스위치 토글 (`.form-check`와 함께 사용) |
| `.form-checkbox` | 체크박스 래퍼 (별도 스타일, BEM) |
| `.form-radio` | 라디오 래퍼 (별도 스타일, BEM) |

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.form-control-sm` / `.form-input--sm` | 작은 입력 |
| (기본) | 중간 입력 |
| `.form-control-lg` / `.form-input--lg` | 큰 입력 |
| `.form-select--sm` | 작은 셀렉트 |
| `.form-select--lg` | 큰 셀렉트 |

## 검증 상태

```html
<!-- 유효 -->
<div class="form-group">
  <label class="form-label">이메일</label>
  <input type="email" class="form-control is-valid" value="user@test.com">
  <div class="valid-feedback">올바른 이메일입니다.</div>
</div>

<!-- 무효 -->
<div class="form-group">
  <label class="form-label">이메일</label>
  <input type="email" class="form-control is-invalid" value="invalid">
  <div class="invalid-feedback">올바른 이메일 형식이 아닙니다.</div>
</div>

<!-- 폼 전체 검증 -->
<form class="was-validated">
  <input type="email" class="form-control" required>
</form>
```

| 클래스 | 설명 |
| --- | --- |
| `.is-valid` | 유효 상태 (초록 테두리) |
| `.is-invalid` | 무효 상태 (빨간 테두리) |
| `.valid-feedback` / `.form-success` | 유효 메시지 |
| `.invalid-feedback` / `.form-error` | 에러 메시지 |
| `.was-validated` | 폼 전체 검증 활성 (`:valid`/`:invalid` 자동 적용) |
| `.has-validation-icon` | 검증 아이콘 표시 |

## 입력 그룹

아이콘이나 버튼을 입력 필드에 결합합니다.

```html
<div class="input-group">
  <span class="input-group-text">
    <i class="material-icons-outlined">search</i>
  </span>
  <input type="text" class="form-control" placeholder="검색...">
</div>

<div class="input-group">
  <input type="text" class="form-control" placeholder="이메일">
  <span class="input-group-text">@example.com</span>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.input-group` | 입력 그룹 컨테이너 |
| `.input-group-text` | 텍스트/아이콘 부착 요소 |
| `.input-group__text` | `.input-group-text`의 BEM alias |
| `.input-group-merge` | 비밀번호 표시/숨김 (Ubold 스타일) |

## 플로팅 라벨

```html
<div class="form-floating">
  <input type="text" class="form-control" id="name" placeholder="이름">
  <label for="name">이름</label>
</div>
```

## 특수 입력

| 클래스 | 설명 |
| --- | --- |
| `.form-range` | 레인지 슬라이더 |
| `.form-control-plaintext` | 읽기 전용 텍스트 (테두리 없음) |
| `.form-search` | 검색 입력 래퍼 |

## 기타 상태

| 속성/클래스 | 설명 |
| --- | --- |
| `readonly` | 읽기 전용 |
| `disabled` | 비활성 |

## 관련 문서

- [Forms 모듈](../modules/forms.md) — Rating, FileUpload, InputMask (JS 모듈)
- [구현 패턴](../PATTERNS.md) — 폼 검증 패턴
