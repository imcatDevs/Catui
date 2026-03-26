# Flags

SVG 국기 아이콘 — 267개 국가 국기를 크기/형태 유틸리티와 함께 제공합니다.

> 소스: `src/styles/components/_avatars.scss` (플래그 유틸리티 섹션) | SVG: `examples/assets/images/flags/`
>
> **이 문서의 핵심**: `.flag-xs` ~ `.flag-xl` 크기 + `.rounded`/`.rounded-circle` 형태.
> `.flag-badge`로 아바타 우하단 국기 배지. 경로: `assets/images/flags/{국가코드}.svg`.

## 기본 사용법

```html
<img src="assets/images/flags/kr.svg" alt="한국" class="flag-md rounded">
```

## 크기

| 클래스 | 높이 | 용도 |
| --- | --- | --- |
| `.flag-xs` | 14px | 인라인 텍스트 옆, 아바타 배지 |
| `.flag-sm` | 18px | 버튼/드롭다운 내부 |
| `.flag-md` | 24px | 기본 표시 |
| `.flag-lg` | 32px | 카드/프로필 |
| `.flag-xl` | 48px | 대형 표시 |

```html
<img src="assets/images/flags/kr.svg" alt="한국" class="flag-xs rounded">
<img src="assets/images/flags/us.svg" alt="미국" class="flag-md rounded">
<img src="assets/images/flags/jp.svg" alt="일본" class="flag-xl rounded">
```

## 형태

유틸리티 클래스를 조합하여 형태를 지정합니다.

| 클래스 조합 | 설명 |
| --- | --- |
| `.flag-lg` | 기본 (직사각형) |
| `.flag-lg.rounded` | 둥근 모서리 |
| `.flag-lg.rounded-circle` | 원형 (width + object-fit 필요) |
| `.flag-lg.img-thumbnail` | 썸네일 스타일 (패딩+테두리) |

```html
<!-- 원형 플래그 -->
<img src="assets/images/flags/cn.svg" alt="중국"
     class="flag-lg rounded-circle" style="width:32px;object-fit:cover">
```

## 아바타 + 국기 배지

`.avatar-status` + `.flag-badge`로 아바타 우하단에 국기를 표시합니다.

```html
<div class="avatar-status">
  <img src="user.jpg" class="avatar-lg rounded-circle">
  <img src="assets/images/flags/kr.svg" alt="한국" class="flag-xs flag-badge rounded">
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.flag-badge` | 우하단 절대 위치 + 흰색 테두리 (부모에 `position: relative` 필요) |

## 언어 선택 버튼

```html
<button class="btn btn--outline" style="display:flex;align-items:center;gap:0.5rem">
  <img src="assets/images/flags/kr.svg" alt="한국" class="flag-sm rounded"> 한국어
</button>
```

## 국가 코드 (주요)

| 코드 | 국가 | 코드 | 국가 |
| --- | --- | --- | --- |
| `kr` | 한국 | `us` | 미국 |
| `jp` | 일본 | `cn` | 중국 |
| `gb` | 영국 | `de` | 독일 |
| `fr` | 프랑스 | `es` | 스페인 |
| `it` | 이탈리아 | `ru` | 러시아 |
| `br` | 브라질 | `in` | 인도 |
| `au` | 호주 | `ca` | 캐나다 |
| `tw` | 대만 | `sg` | 싱가포르 |
| `th` | 태국 | `vn` | 베트남 |
| `ph` | 필리핀 | `id` | 인도네시아 |

전체 267개 국가 코드는 데모 페이지에서 검색 가능합니다.

## 관련 문서

- [Avatars](avatars.md) — `.avatar-status`, `.flag-badge` 조합
- [Utilities](utilities.md) — `.rounded`, `.rounded-circle` 유틸리티
