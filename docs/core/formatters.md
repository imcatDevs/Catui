# Formatters

숫자, 날짜, 통화, 전화번호 등 데이터 포맷 유틸리티를 제공합니다.

> 소스: `src/core/formatters.js`
>
> **이 문서의 핵심**: `IMCAT.format.number()`, `.currency()`, `.date()`, `.phone()` 등.
> Intl API 기반. 한국 로케일 특화 (전화번호, 사업자번호, 주민번호 마스킹).

## 기본 사용법

```javascript
IMCAT.format.number(1234567);         // "1,234,567"
IMCAT.format.currency(50000);         // "₩50,000"
IMCAT.format.date(new Date());        // "2025-01-15"
IMCAT.format.phone('01012345678');    // "010-1234-5678"
```

## 숫자 포맷

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.number(value)` | number | string | 천 단위 콤마 |
| `.currency(value, currency?)` | number, string? | string | 통화 포맷 (기본 KRW) |
| `.percent(value, decimals?)` | number, number? | string | 퍼센트 |
| `.bytes(value)` | number | string | 바이트 크기 (KB, MB 등) |
| `.truncate(str, length)` | string, number | string | 문자열 자르기 + ... |

```javascript
IMCAT.format.currency(50000, 'USD');  // "$50,000.00"
IMCAT.format.percent(0.856, 1);      // "85.6%"
IMCAT.format.bytes(1536000);          // "1.46 MB"
IMCAT.format.truncate('긴 문자열입니다', 5);  // "긴 문자열..."
```

## 날짜 / 시간

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.date(date, format?)` | Date, string? | string | 날짜 포맷 |
| `.time(date)` | Date | string | 시간 포맷 |
| `.relative(date)` | Date | string | 상대 시간 ("3분 전") |

```javascript
IMCAT.format.date(new Date(), 'long');  // "2025년 1월 15일 수요일"
IMCAT.format.relative(new Date(Date.now() - 180000));  // "3분 전"
```

## 한국 특화 포맷

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.phone(value)` | string | string | 전화번호 (010-1234-5678) |
| `.bizNo(value)` | string | string | 사업자번호 (123-45-67890) |
| `.ssn(value)` | string | string | 주민번호 마스킹 (950101-1******) |
| `.creditCard(value)` | string | string | 카드번호 마스킹 |
| `.zipCode(value)` | string | string | 우편번호 (12345) |

```javascript
IMCAT.format.phone('01012345678');     // "010-1234-5678"
IMCAT.format.bizNo('1234567890');      // "123-45-67890"
IMCAT.format.ssn('9501011234567');     // "950101-1******"
```

## 텍스트 변환

| 메서드 | 파라미터 | 반환값 | 설명 |
| --- | --- | --- | --- |
| `.capitalize(str)` | string | string | 첫 글자 대문자 |
| `.titleCase(str)` | string | string | 각 단어 첫 글자 대문자 |
| `.slug(str)` | string | string | URL 슬러그 (소문자 + 하이픈) |

## 관련 문서

- [Config](config.md) — locale, currency 글로벌 설정
- [치트시트](../CHEATSHEET.md) — 전체 API 요약
