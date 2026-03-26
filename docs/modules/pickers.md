# Pickers

DatePicker, TimePicker, ColorPicker, Countdown, DDay — 날짜/시간/색상 선택 컴포넌트를 제공합니다.

> 소스: `src/modules/pickers.js`
>
> **이 문서의 핵심**: `IMCAT.use('pickers')` → DatePicker, TimePicker, ColorPicker, Countdown, DDay.
> DatePicker: `format: 'YYYY-MM-DD'`, `locale: 'ko'`.

## 로드 방법

```javascript
const { DatePicker, TimePicker, ColorPicker, Countdown, DDay } = await IMCAT.use('pickers');
```

## DatePicker

```javascript
const { DatePicker } = await IMCAT.use('pickers');
const picker = new DatePicker('#dateInput', {
  format: 'YYYY-MM-DD',
  locale: 'ko',
  minDate: '2024-01-01',
  maxDate: '2025-12-31',
  onChange: (date) => console.log('선택:', date)
});
```

### DatePicker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `format` | string | `'YYYY-MM-DD'` | 날짜 형식 |
| `locale` | string | `'ko'` | 로케일 |
| `minDate` | string/Date | `null` | 최소 날짜 |
| `maxDate` | string/Date | `null` | 최대 날짜 |
| `placeholder` | string | `'날짜 선택'` | 플레이스홀더 |
| `onChange` | function | `null` | 변경 콜백 |

### DatePicker 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setValue(date)` | 날짜 설정 |
| `.getValue()` | 현재 값 |
| `.clear()` | 초기화 |
| `.destroy()` | 제거 |

## TimePicker

```javascript
const { TimePicker } = await IMCAT.use('pickers');
new TimePicker('#timeInput', {
  format: '24h',
  step: 15,
  onChange: (time) => console.log(time)
});
```

## ColorPicker

```javascript
const { ColorPicker } = await IMCAT.use('pickers');
new ColorPicker('#colorInput', {
  defaultColor: '#3B82F6',
  format: 'hex',
  onChange: (color) => console.log(color)
});
```

## Countdown

```javascript
const { Countdown } = await IMCAT.use('pickers');
new Countdown('#timer', {
  targetDate: '2025-12-31T00:00:00',
  format: '{days}일 {hours}:{minutes}:{seconds}',
  onComplete: () => IMCAT.toast.success('카운트다운 완료!')
});
```

## DDay

D-Day 카운터를 표시합니다.

```javascript
const { DDay } = await IMCAT.use('pickers');
new DDay('#dday', {
  targetDate: '2025-12-25',
  label: '크리스마스'
});
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onChange` (DatePicker) | `(date)` | 날짜 선택/변경 시 |
| `onChange` (TimePicker) | `(time)` | 시간 선택 시 |
| `onChange` (ColorPicker) | `(color)` | 색상 선택 시 |
| `onComplete` (Countdown) | `()` | 카운트다운 완료 시 |

## 관련 문서

- [Forms CSS](../css/forms.md) — 입력 필드 스타일
- [Formatters](../core/formatters.md) — 날짜/시간 포맷
