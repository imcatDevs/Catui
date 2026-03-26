# Pickers

DatePicker, TimePicker, ColorPicker, Countdown, DDay — 날짜/시간/색상 선택 및 카운트다운 컴포넌트를 제공합니다.

> 소스: `src/modules/pickers.js`
>
> **이 문서의 핵심**: `IMCAT.use('pickers')` → DatePicker, TimePicker, ColorPicker, Countdown, DDay.
> DatePicker: 캘린더 날짜 선택 (년/월 뷰 전환). TimePicker: 시간 드롭다운 선택.
> ColorPicker: 프리셋 + 네이티브 색상 선택. Countdown: 타이머. DDay: D-Day 카운터.

## 로드 방법

```javascript
const { DatePicker, TimePicker, ColorPicker, Countdown, DDay } = await IMCAT.use('pickers');
```

---

## DatePicker

캘린더 UI로 날짜를 선택합니다. 년/월 뷰 전환, 오늘 버튼을 지원합니다.

```javascript
const { DatePicker } = await IMCAT.use('pickers');
const picker = new DatePicker('#dateInput', {
  format: 'YYYY-MM-DD',
  locale: 'ko',
  minDate: null,
  maxDate: null,
  placeholder: '날짜 선택',
  onChange: (date) => console.log('선택:', date)
});

picker.open();
picker.close();
picker.setValue('2025-06-15');
picker.getValue();
```

### DatePicker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `format` | string | `'YYYY-MM-DD'` | 날짜 형식 |
| `minDate` | string/Date | `null` | 최소 날짜 |
| `maxDate` | string/Date | `null` | 최대 날짜 |
| `locale` | string | `'ko'` | 로케일 |
| `placeholder` | string | `'날짜 선택'` | 플레이스홀더 |
| `onChange` | function | `null` | 변경 콜백 `(dateString)` |

### DatePicker 메서드

| 메서드 | 설명 |
| --- | --- |
| `.open()` | 캘린더 열기 |
| `.close()` | 캘린더 닫기 |
| `.setValue(dateString)` | 날짜 설정 (format 형식) |
| `.getValue()` | 현재 값 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## TimePicker

드롭다운 목록에서 시간을 선택합니다.

```javascript
const { TimePicker } = await IMCAT.use('pickers');
const tp = new TimePicker('#timeInput', {
  format: 'HH:mm',
  step: 15,
  placeholder: '시간 선택',
  onChange: (time) => console.log(time)
});
```

### TimePicker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `format` | string | `'HH:mm'` | 시간 형식 |
| `step` | number | `15` | 분 단위 간격 |
| `placeholder` | string | `'시간 선택'` | 플레이스홀더 |
| `onChange` | function | `null` | 변경 콜백 `(timeString)` |

### TimePicker 메서드

| 메서드 | 설명 |
| --- | --- |
| `.open()` | 드롭다운 열기 |
| `.close()` | 드롭다운 닫기 |
| `.setValue(timeString)` | 시간 설정 |
| `.getValue()` | 현재 값 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## ColorPicker

프리셋 색상 + 네이티브 색상 입력을 지원합니다.

```javascript
const { ColorPicker } = await IMCAT.use('pickers');
const cp = new ColorPicker('#colorInput', {
  defaultColor: '#667eea',
  presetColors: ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#3b82f6', '#6366f1'],
  onChange: (color) => console.log(color)
});
```

### ColorPicker 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `defaultColor` | string | `'#667eea'` | 기본 색상 |
| `presetColors` | array | 12개 색상 배열 | 프리셋 색상 목록 |
| `onChange` | function | `null` | 변경 콜백 `(color)` |

### ColorPicker 메서드

| 메서드 | 설명 |
| --- | --- |
| `.open()` | 드롭다운 열기 |
| `.close()` | 드롭다운 닫기 |
| `.toggle()` | 토글 |
| `.setValue(color)` | 색상 설정 (`Security.validateColor()` 검증) |
| `.getValue()` | 현재 값 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## Countdown

카운트다운 타이머입니다. 각 단위(일/시/분/초)를 개별적으로 표시/숨김할 수 있습니다.

```javascript
const { Countdown } = await IMCAT.use('pickers');
const timer = new Countdown('#timer', {
  targetDate: '2025-12-31T00:00:00',
  labels: { days: '일', hours: '시간', minutes: '분', seconds: '초' },
  showLabels: true,
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  separator: ':',
  onComplete: () => console.log('완료!'),
  onTick: (time) => console.log(time)
});

timer.start();
timer.stop();
timer.setTarget('2026-01-01T00:00:00');
```

### Countdown 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `targetDate` | string/Date | `null` | 목표 날짜/시간 |
| `labels` | object | `{ days:'일', hours:'시간', minutes:'분', seconds:'초' }` | 단위 라벨 |
| `showLabels` | boolean | `true` | 라벨 표시 |
| `showDays` | boolean | `true` | 일 표시 |
| `showHours` | boolean | `true` | 시간 표시 |
| `showMinutes` | boolean | `true` | 분 표시 |
| `showSeconds` | boolean | `true` | 초 표시 |
| `separator` | string | `':'` | 구분자 |
| `onComplete` | function | `null` | 완료 콜백 |
| `onTick` | function | `null` | 매초 콜백 `(time)` |

### Countdown 메서드

| 메서드 | 설명 |
| --- | --- |
| `.start()` | 타이머 시작 |
| `.stop()` | 타이머 정지 |
| `.setTarget(date)` | 목표 날짜 변경 |
| `.destroy()` | 인스턴스 제거 |

---

## DDay

D-Day 카운터를 표시합니다. 미래(D-N), 당일(D-Day), 과거(D+N)를 자동 구분합니다.

```javascript
const { DDay } = await IMCAT.use('pickers');
const dday = new DDay('#dday', {
  targetDate: '2025-12-25',
  title: '크리스마스',
  showPastDays: true,
  onChange: (diff) => console.log('D-Day 차이:', diff)
});

dday.setTarget('2026-01-01', '새해');
dday.getDays();  // 남은 일수 (음수면 지남)
```

### DDay 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `targetDate` | string/Date | `null` | 목표 날짜 |
| `title` | string | `'D-Day'` | 제목 |
| `showPastDays` | boolean | `true` | 지난 일수 표시 (false면 'D-Day 지남') |
| `onChange` | function | `null` | 변경 콜백 `(diff)` |

### DDay 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setTarget(date, title?)` | 목표 날짜/제목 변경 |
| `.getDays()` | 남은 일수 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Forms CSS](../css/forms.md) — 입력 필드 스타일
- [Formatters](../core/formatters.md) — 날짜/시간 포맷
