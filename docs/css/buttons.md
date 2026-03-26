# Buttons

버튼 컴포넌트의 CSS 클래스 — 색상, 크기, 형태, 상태 변형을 제공합니다.

> 소스: `src/styles/components/_buttons.scss`
>
> **이 문서의 핵심**: `.btn` 기본 + `.btn--primary` 등 색상 + `.btn--sm`/`--lg` 크기 + `.btn--rounded`/`--icon`/`--ghost`/`--block` 형태.
> BEM: `.btn` (블록), `.btn--primary` (수정자).

## 기본 사용법

```html
<button class="btn btn--primary">Primary</button>
<button class="btn btn--success">Success</button>
<button class="btn btn--danger">Danger</button>
```

## 색상 변형

| 클래스 | 설명 |
| --- | --- |
| `.btn--primary` | 파란색 (기본 액션) |
| `.btn--success` | 초록색 (성공/완료) |
| `.btn--info` | 하늘색 (정보) |
| `.btn--warning` | 노란색 (경고) |
| `.btn--danger` | 빨간색 (삭제/위험) |
| `.btn--dark` | 어두운 색 |
| `.btn--secondary` | 회색 (보조) |
| `.btn--light` | 밝은 색 |
| `.btn--link` | 링크 스타일 (밑줄) |

## 아웃라인 변형

배경 없이 테두리만 표시합니다.

| 클래스 | 설명 |
| --- | --- |
| `.btn--outline` | Primary 아웃라인 |
| `.btn--outline-success` | Success 아웃라인 |
| `.btn--outline-info` | Info 아웃라인 |
| `.btn--outline-warning` | Warning 아웃라인 |
| `.btn--outline-danger` | Danger 아웃라인 |
| `.btn--outline-dark` | Dark 아웃라인 |
| `.btn--outline-secondary` | Secondary 아웃라인 |

```html
<button class="btn btn--outline">Primary 아웃라인</button>
<button class="btn btn--outline-danger">Danger 아웃라인</button>
```

## Soft 변형

연한 배경 + 색상 텍스트입니다.

| 클래스 | 설명 |
| --- | --- |
| `.btn--soft-primary` | 연한 파란색 |
| `.btn--soft-success` | 연한 초록색 |
| `.btn--soft-danger` | 연한 빨간색 |
| `.btn--soft-warning` | 연한 노란색 |
| `.btn--soft-info` | 연한 하늘색 |
| `.btn--soft-dark` | 연한 어두운색 |
| `.btn--soft-secondary` | 연한 회색 |

```html
<button class="btn btn--soft-primary">Soft Primary</button>
<button class="btn btn--soft-danger">Soft Danger</button>
```

## 크기

| 클래스 | 설명 |
| --- | --- |
| `.btn--xs` | 초소형 버튼 |
| `.btn--sm` | 작은 버튼 |
| (기본) | 중간 버튼 |
| `.btn--lg` | 큰 버튼 |

```html
<button class="btn btn--primary btn--xs">XS</button>
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary">Default</button>
<button class="btn btn--primary btn--lg">Large</button>
```

## 형태 변형

| 클래스 | 설명 |
| --- | --- |
| `.btn--rounded` | 둥근 모서리 (pill) |
| `.btn--square` | 직각 (radius 0) |
| `.btn--icon` | 아이콘 전용 (정사각형) |
| `.btn--ghost` | 투명 배경 (호버 시 배경 표시) |
| `.btn--block` | 전체 너비 (width: 100%) |

```html
<button class="btn btn--primary btn--rounded">Rounded</button>
<button class="btn btn--primary btn--square">Square</button>
<button class="btn btn--primary btn--icon"><i class="material-icons-outlined">add</i></button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--primary btn--block">전체 너비</button>
```

## 버튼 너비

고정 최소 너비를 지정합니다.

| 클래스 | 최소 너비 |
| --- | --- |
| `.width-xs` | 80px |
| `.width-sm` | 100px |
| `.width-md` | 120px |
| `.width-lg` | 150px |
| `.width-xl` | 200px |

```html
<button class="btn btn--primary width-md">고정 너비</button>
```

## 버튼 라벨 (아이콘)

버튼 앞/뒤에 아이콘 라벨을 부착합니다.

```html
<button class="btn btn--primary">
  <span class="btn-label"><i class="material-icons-outlined">check</i></span> 확인
</button>
<button class="btn btn--danger">
  삭제 <span class="btn-label-right"><i class="material-icons-outlined">delete</i></span>
</button>
```

## 버튼 그룹

```html
<div class="btn-group">
  <button class="btn btn--primary">왼쪽</button>
  <button class="btn btn--primary">가운데</button>
  <button class="btn btn--primary">오른쪽</button>
</div>

<!-- 연결된 버튼 그룹 (gap 없음, 모서리 연결) -->
<div class="btn-group btn-group--attached">
  <button class="btn btn--primary">왼쪽</button>
  <button class="btn btn--primary">가운데</button>
  <button class="btn btn--primary">오른쪽</button>
</div>

<!-- 세로 버튼 그룹 -->
<div class="btn-group btn-group--vertical">
  <button class="btn btn--primary">위</button>
  <button class="btn btn--primary">아래</button>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.btn-group` | 버튼 그룹 (inline-flex, gap) |
| `.btn-group--attached` | 연결된 버튼 (gap 제거, border-radius 연결) |
| `.btn-group--vertical` | 세로 방향 |
| `.button-list` | 버튼 나열 레이아웃 (flex-wrap, gap) |

## 상태

| 클래스/속성 | 설명 |
| --- | --- |
| `disabled` 속성 | 비활성 상태 |
| `.btn--loading` | 로딩 상태 (스피너 표시, 텍스트 숨김) |
| `.btn.disabled` | Bootstrap 호환 비활성 클래스 |

```html
<button class="btn btn--primary" disabled>비활성</button>
<button class="btn btn--primary btn--loading">로딩 중...</button>
```

## Bootstrap 호환 클래스

BEM 외에 Bootstrap 단일 대시 클래스도 지원합니다.

| BEM | Bootstrap 호환 |
| --- | --- |
| `.btn--primary` | `.btn-primary` |
| `.btn--outline` | `.btn-outline-primary` |
| `.btn--soft-primary` | `.btn-soft-primary` |
| `.btn--sm` / `--lg` / `--xs` | `.btn-sm` / `.btn-lg` / `.btn-xs` |
| — | `.btn-white` (흰색 버튼) |

## ⚠️ 주의사항

- ❌ `.btn` 없이 색상 클래스만 사용 → ✅ 반드시 `.btn` + `.btn--primary` 조합
- ❌ `<a>` 태그에 `.btn` 사용 시 `href="#"` 필수 (접근성)

## 관련 문서

- [Forms](forms.md) — 폼 내 버튼 사용
- [Overlays 모듈](../modules/overlays.md) — Modal 내 버튼 옵션
