# Selectors

Autocomplete, MultiSelect, RangeSlider — 고급 선택 컴포넌트를 제공합니다.

> 소스: `src/modules/selectors.js`
>
> **이 문서의 핵심**: `IMCAT.use('selectors')` → Autocomplete, MultiSelect, RangeSlider.
> Autocomplete: 검색 + 드롭다운. MultiSelect: 다중 선택 + 태그. RangeSlider: 범위/단일 슬라이더.

## 로드 방법

```javascript
const { Autocomplete, MultiSelect, RangeSlider } = await IMCAT.use('selectors');
```

---

## Autocomplete

검색 자동완성입니다. 배열/비동기 함수 소스, 하이라이트, 키보드 탐색을 지원합니다.

```javascript
const { Autocomplete } = await IMCAT.use('selectors');
new Autocomplete('#searchInput', {
  source: ['서울', '부산', '대구', '인천', '광주', '대전', '울산'],
  minLength: 1,
  delay: 300,
  maxResults: 10,
  highlight: true,
  placeholder: '검색...',
  noResultsText: '검색 결과가 없습니다',
  renderItem: null,
  onSelect: (item) => console.log('선택:', item),
  onChange: (value) => console.log('변경:', value)
});
```

### Autocomplete 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `source` | array/function | `[]` | 데이터 소스 (배열 또는 async 함수) |
| `minLength` | number | `1` | 최소 입력 길이 |
| `delay` | number | `300` | 입력 디바운스 (ms) |
| `maxResults` | number | `10` | 최대 결과 수 |
| `highlight` | boolean | `true` | 검색어 하이라이트 |
| `placeholder` | string | `'검색...'` | 플레이스홀더 |
| `noResultsText` | string | `'검색 결과가 없습니다'` | 결과 없음 텍스트 |
| `renderItem` | function | `null` | 커스텀 렌더링 `(item, highlighted) → html` |
| `onSelect` | function | `null` | 선택 콜백 `(item)` |
| `onChange` | function | `null` | 변경 콜백 |

### Autocomplete 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 현재 값 반환 |
| `.setValue(value)` | 값 설정 |
| `.clear()` | 입력 초기화 |
| `.destroy()` | 인스턴스 제거 |

---

## MultiSelect

다중 선택 + 태그 UI입니다. 검색, 새 항목 생성(`allowCreate`)을 지원합니다.

```javascript
const { MultiSelect } = await IMCAT.use('selectors');
new MultiSelect('#tagSelect', {
  options: [
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'go', label: 'Go' }
  ],
  selected: [],
  maxItems: 5,
  placeholder: '선택...',
  searchable: true,
  searchPlaceholder: '검색...',
  allowCreate: false,
  onChange: (selected) => console.log(selected)
});
```

### MultiSelect 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `options` | array | `[]` | 선택지 `{ value, label }` |
| `selected` | array | `[]` | 초기 선택 값 배열 |
| `maxItems` | number | `null` | 최대 선택 수 (null=무제한) |
| `placeholder` | string | `'선택...'` | 플레이스홀더 |
| `searchable` | boolean | `true` | 검색 기능 |
| `searchPlaceholder` | string | `'검색...'` | 검색 플레이스홀더 |
| `allowCreate` | boolean | `false` | 새 항목 생성 허용 |
| `onChange` | function | `null` | 변경 콜백 `(selectedValues)` |

### MultiSelect 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 선택 값 배열 반환 |
| `.setValue(values)` | 값 배열 설정 |
| `.clear()` | 선택 초기화 |
| `.destroy()` | 인스턴스 제거 |

---

## RangeSlider

범위/단일 슬라이더입니다. 마우스/터치 드래그, 툴팁, 라벨을 지원합니다.

```javascript
const { RangeSlider } = await IMCAT.use('selectors');
new RangeSlider('#priceRange', {
  min: 0,
  max: 100000,
  step: 1000,
  value: [20000, 80000],
  range: true,
  showTooltip: true,
  showLabels: true,
  formatValue: (v) => v.toLocaleString() + '원',
  onChange: ([min, max]) => console.log(`${min} ~ ${max}`),
  onDragEnd: (value) => console.log('드래그 종료:', value)
});
```

### RangeSlider 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `min` | number | `0` | 최솟값 |
| `max` | number | `100` | 최댓값 |
| `step` | number | `1` | 간격 |
| `value` | array/number | `[25, 75]` | 초기값 (range면 배열, 단일이면 숫자) |
| `range` | boolean | `true` | 범위 모드 |
| `showTooltip` | boolean | `true` | 핸들 툴팁 |
| `showLabels` | boolean | `true` | 최소/최대 라벨 |
| `formatValue` | function | `(v) => v` | 값 포맷 함수 |
| `onChange` | function | `null` | 변경 콜백 `(value)` |
| `onDragEnd` | function | `null` | 드래그 종료 콜백 `(value)` |

### RangeSlider 메서드

| 메서드 | 설명 |
| --- | --- |
| `.getValue()` | 현재 값 반환 (range면 배열) |
| `.setValue(value)` | 값 설정 |
| `.destroy()` | 인스턴스 제거 |

---

## 관련 문서

- [Forms CSS](../css/forms.md) — 셀렉트 스타일
- [Dropdown](dropdown.md) — 단순 드롭다운 메뉴
