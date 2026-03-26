# Avatars

아바타 CSS 클래스 — 프로필 이미지, 이니셜, 크기, 그룹, 상태 인디케이터를 제공합니다.

> 소스: `src/styles/components/_avatars.scss`
>
> **이 문서의 핵심**: `.avatar-xs` ~ `.avatar-2xl` 크기 + `.rounded-circle` 원형.
> `.avatar-title` 이니셜. `.avatar-group` > `.avatar-group__item` 겹침 그룹.
> `.avatar-status` + `__indicator--online` 상태 표시. `object-fit: cover` 자동 적용.

## 기본 사용법

```html
<!-- 이미지 아바타 (object-fit: cover 자동 적용) -->
<img src="user.jpg" alt="사용자" class="avatar-md rounded-circle">
```

## 크기

| 클래스 | 크기 | 설명 |
| --- | --- | --- |
| `.avatar-xs` | 1.5rem (24px) | 초소형 |
| `.avatar-sm` | 2rem (32px) | 소형 |
| `.avatar-md` | 2.5rem (40px) | 중형 |
| `.avatar-lg` | 3rem (48px) | 대형 |
| `.avatar-xl` | 4rem (64px) | 초대형 |
| `.avatar-2xl` | 5rem (80px) | 최대형 |

```html
<img src="user.jpg" alt="" class="avatar-xs rounded">
<img src="user.jpg" alt="" class="avatar-sm rounded">
<img src="user.jpg" alt="" class="avatar-md rounded">
<img src="user.jpg" alt="" class="avatar-lg rounded-circle">
<img src="user.jpg" alt="" class="avatar-xl rounded-circle">
<img src="user.jpg" alt="" class="avatar-2xl rounded-circle">
```

## 형태

유틸리티 클래스를 조합하여 형태를 지정합니다.

| 클래스 | 설명 |
| --- | --- |
| `.rounded` | 둥근 모서리 |
| `.rounded-circle` | 완전한 원형 |

## 이니셜 아바타

`.avatar-title`로 이미지 없이 텍스트 아바타를 만듭니다.

```html
<div class="avatar-md">
  <span class="avatar-title rounded-circle" style="background:var(--primary)">홍</span>
</div>
<div class="avatar-lg">
  <span class="avatar-title rounded" style="background:var(--success)">김</span>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.avatar-title` | 이니셜 텍스트 컨테이너 (flex 중앙 정렬, 흰색 텍스트, bold) |

## 아바타 그룹

`.avatar-group` > `.avatar-group__item`으로 겹쳐서 표시합니다.

```html
<div class="avatar-group">
  <img src="user1.jpg" alt="" class="avatar-md rounded-circle avatar-group__item">
  <img src="user2.jpg" alt="" class="avatar-md rounded-circle avatar-group__item">
  <img src="user3.jpg" alt="" class="avatar-md rounded-circle avatar-group__item">
  <div class="avatar-md avatar-group__item">
    <span class="avatar-title rounded-circle" style="background:var(--primary)">+5</span>
  </div>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.avatar-group` | 그룹 컨테이너 (flex, 겹침 간격 자동) |
| `.avatar-group__item` | 그룹 아이템 (음수 마진 + 흰색 테두리 + hover 효과) |

## 상태 인디케이터

`.avatar-status`로 온라인/부재/바쁨/오프라인 상태를 표시합니다.

```html
<div class="avatar-status">
  <img src="user.jpg" alt="" class="avatar-md rounded-circle">
  <span class="avatar-status__indicator avatar-status__indicator--online"></span>
</div>
```

| 클래스 | 설명 |
| --- | --- |
| `.avatar-status` | 상태 래퍼 (`position: relative`) |
| `.avatar-status__indicator` | 인디케이터 원형 (우하단) |
| `.avatar-status__indicator--online` | 초록 (온라인) |
| `.avatar-status__indicator--away` | 노랑 (부재) |
| `.avatar-status__indicator--busy` | 빨강 (바쁨) |
| `.avatar-status__indicator--offline` | 회색 (오프라인) |

## 이미지 유틸리티

| 클래스 | 설명 |
| --- | --- |
| `.img-fluid` | `max-width: 100%; height: auto` |
| `.img-thumbnail` | 패딩 + 테두리 + 배경 (썸네일 스타일) |

## 관련 문서

- [Flags](flags.md) — `.flag-badge`로 아바타에 국기 배지 표시
- [Social 모듈](../modules/social.md) — ChatUI, Comments (아바타 포함)
- [Cards](cards.md) — 카드 내 아바타
- [Utilities](utilities.md) — `.rounded`, `.rounded-circle` 유틸리티
