# Selectors

Autocomplete, MultiSelect, RangeSlider — 고급 선택 컴포넌트를 제공합니다.

> 소스: `src/modules/selectors.js`
>
> **이 문서의 핵심**: `IMCAT.use('selectors')` → Autocomplete, MultiSelect, RangeSlider.
> Autocomplete: 검색 + 드롭다운. MultiSelect: 다중 선택 + 태그.

## 로드 방법

```javascript
const { Autocomplete, MultiSelect, RangeSlider } = await IMCAT.use('selectors');
```

## Autocomplete

```javascript
const { Autocomplete } = await IMCAT.use('selectors');
new Autocomplete('#searchInput', {
  source: ['서울', '부산', '대구', '인천', '광주', '대전', '울산'],
  minLength: 1,
  maxResults: 5,
  onSelect: (item) => console.log('선택:', item)
});
```

### Autocomplete 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `source` | array/function | `[]` | 데이터 소스 (배열 또는 비동기 함수) |
| `minLength` | number | `1` | 최소 입력 길이 |
| `maxResults` | number | `10` | 최대 결과 수 |
| `debounce` | number | `300` | 입력 지연 (ms) |
| `onSelect` | function | `null` | 선택 콜백 |

## MultiSelect

```javascript
const { MultiSelect } = await IMCAT.use('selectors');
new MultiSelect('#tagSelect', {
  options: [
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'go', label: 'Go' }
  ],
  placeholder: '기술 스택 선택',
  maxItems: 5,
  onChange: (selected) => console.log(selected)
});
```

## RangeSlider

```javascript
const { RangeSlider } = await IMCAT.use('selectors');
new RangeSlider('#priceRange', {
  min: 0, max: 100000, step: 1000,
  value: [20000, 80000],
  range: true,
  onChange: ([min, max]) => console.log(`${min} ~ ${max}`)
});
```

## 이벤트

| 이벤트명 | 콜백 인자 | 발생 시점 |
| --- | --- | --- |
| `onSelect` (Autocomplete) | `(item)` | 항목 선택 시 |
| `onChange` (MultiSelect) | `(selectedItems)` | 선택 변경 시 |
| `onChange` (RangeSlider) | `([min, max])` | 범위 변경 시 |

## 관련 문서

- [Forms CSS](../css/forms.md) — 셀렉트 스타일
- [Dropdown](dropdown.md) — 단순 드롭다운 메뉴
