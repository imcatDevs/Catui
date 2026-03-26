# 구현 패턴 모음

자주 사용하는 IMCAT UI 구현 패턴을 완전한 코드로 제공합니다. 복사하여 바로 사용할 수 있습니다.

> **이 문서의 핵심**: CRUD, 폼 검증, SPA 레이아웃, 테마 전환 등 실전 패턴.
> 모든 코드는 `dist/imcat-ui.min.js`와 `dist/imcat-ui.css`가 로드된 환경에서 동작합니다.

## 패턴 1: 모달 확인 다이얼로그

사용자에게 확인을 받고 결과에 따라 처리하는 패턴입니다.

```html
<button class="btn btn--danger" onclick="deleteItem(42)">삭제</button>

<script>
async function deleteItem(id) {
  const ok = await IMCAT.confirm('정말 삭제하시겠습니까?');
  if (!ok) return;

  try {
    await IMCAT.api.delete(`/api/items/${id}`);
    IMCAT.toast.success('삭제되었습니다.');
  } catch (e) {
    IMCAT.toast.error('삭제 실패: ' + e.message);
  }
}
</script>
```

## 패턴 2: CRUD 테이블 (DataTable + Modal + Toast)

데이터 목록 조회, 추가, 수정, 삭제를 하나의 페이지에서 처리합니다.

```html
<div class="card">
  <div class="card__header" style="display:flex;justify-content:space-between;align-items:center;">
    <h4 class="card__title">사용자 관리</h4>
    <button class="btn btn--primary btn--sm" onclick="openAddModal()">
      <i class="material-icons-outlined" style="font-size:16px">add</i> 추가
    </button>
  </div>
  <div class="card__body">
    <div id="userTable"></div>
  </div>
</div>

<script>
let dataTable;

async function init() {
  const { DataTable } = await IMCAT.use('data-viz');

  dataTable = new DataTable('#userTable', {
    columns: [
      { key: 'id', title: 'ID', width: '60px' },
      { key: 'name', title: '이름' },
      { key: 'email', title: '이메일' },
      { key: 'actions', title: '관리', width: '120px', render: (val, row) =>
        `<button class="btn btn--outline btn--sm" onclick="editUser(${row.id})">수정</button>
         <button class="btn btn--outline-danger btn--sm" onclick="deleteUser(${row.id})">삭제</button>`
      }
    ],
    data: [
      { id: 1, name: '홍길동', email: 'hong@test.com' },
      { id: 2, name: '김철수', email: 'kim@test.com' },
    ],
    pagination: true,
    pageSize: 10,
    search: true
  });
}

async function openAddModal() {
  const { Modal } = await IMCAT.use('overlays');
  new Modal({
    title: '사용자 추가',
    content: `
      <div class="form-group">
        <label class="form-label">이름</label>
        <input type="text" class="form-input" id="userName">
      </div>
      <div class="form-group">
        <label class="form-label">이메일</label>
        <input type="email" class="form-input" id="userEmail">
      </div>
    `,
    buttons: [
      { text: '취소', variant: 'secondary', close: true },
      { text: '저장', variant: 'primary', action: () => {
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        if (!name || !email) { IMCAT.toast.warning('모든 필드를 입력하세요.'); return; }
        IMCAT.toast.success(`${name} 추가 완료`);
      }, close: true }
    ]
  }).show();
}

async function deleteUser(id) {
  if (await IMCAT.confirm('삭제하시겠습니까?')) {
    IMCAT.toast.success('삭제 완료');
  }
}

init();
</script>
```

## 패턴 3: 폼 검증

FormValidator를 사용하여 실시간 폼 검증을 수행합니다.

```html
<form id="registerForm">
  <div class="form-group">
    <label class="form-label">이름 *</label>
    <input type="text" class="form-input" name="name">
  </div>
  <div class="form-group">
    <label class="form-label">이메일 *</label>
    <input type="email" class="form-input" name="email">
  </div>
  <div class="form-group">
    <label class="form-label">비밀번호 *</label>
    <input type="password" class="form-input" name="password">
  </div>
  <div class="form-group">
    <label class="form-label">비밀번호 확인 *</label>
    <input type="password" class="form-input" name="passwordConfirm">
  </div>
  <button type="submit" class="btn btn--primary btn--block">가입</button>
</form>

<script>
// new IMCAT.form(selector, rules, options?)
const validator = new IMCAT.form('#registerForm', {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  password: { required: true, minLength: 8 },
  passwordConfirm: { required: true, match: 'password' }
}, {
  validateOnBlur: true,
  validateOnInput: false,
  showErrorMessages: true
});

// 폼 제출 시 검증
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (validator.validate()) {
    const data = IMCAT.formData('#registerForm');
    IMCAT.toast.success('가입 완료!');
    console.log('폼 데이터:', data);
  }
});
</script>
```

## 패턴 4: SPA 레이아웃 (라우터 + 사이드바)

`catui-href` 속성으로 SPA 네비게이션을 구성합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My SPA</title>
  <link rel="stylesheet" href="dist/imcat-ui.css">
  <style>
    .app { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); padding: 1rem; }
    .main { flex: 1; padding: 2rem; }
    .nav-link { display: block; padding: 0.5rem 1rem; color: var(--text-secondary); text-decoration: none; border-radius: 4px; }
    .nav-link:hover { background: var(--bg-tertiary); text-decoration: none; }
    .nav-link.is-active { background: rgba(59,130,246,0.1); color: var(--primary); }
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <h5>메뉴</h5>
      <nav>
        <a class="nav-link is-active" catui-href="views/home.html">홈</a>
        <a class="nav-link" catui-href="views/users.html">사용자</a>
        <a class="nav-link" catui-href="views/settings.html">설정</a>
      </nav>
    </aside>
    <main class="main" catui-target="content">
      <div id="content">
        <h1>홈</h1>
        <p>환영합니다!</p>
      </div>
    </main>
  </div>

  <script src="dist/imcat-ui.min.js"></script>
  <script>
    // 라우팅 후 메뉴 활성화
    IMCAT.view.afterLoad((path) => {
      IMCAT('.nav-link').each(l => l.classList.remove('is-active'));
      IMCAT(`[catui-href="${path}"]`).each(l => l.classList.add('is-active'));
    });
  </script>
</body>
</html>
```

## 패턴 5: 테마 전환 (라이트/다크)

Theme 모듈로 부드러운 테마 전환을 구현합니다.

```html
<button class="btn btn--outline-secondary btn--icon" id="themeBtn">
  <i class="material-icons-outlined">dark_mode</i>
</button>

<script>
(async function() {
  const TM = await IMCAT.use('theme');
  const theme = TM.createTheme({
    defaultTheme: 'system',
    transition: 'fade',
    transitionDuration: 300,
    onChange: (resolved) => {
      IMCAT('#themeBtn i').text(resolved === 'dark' ? 'light_mode' : 'dark_mode');
    }
  });

  // 초기 아이콘
  IMCAT('#themeBtn i').text(theme.getResolved() === 'dark' ? 'light_mode' : 'dark_mode');

  // 토글
  IMCAT('#themeBtn').on('click', () => theme.toggle());
})();
</script>
```

## 패턴 6: 탭 네비게이션

Tabs 컴포넌트로 탭 UI를 구성합니다.

```html
<div id="myTabs">
  <div role="tablist">
    <button role="tab">개요</button>
    <button role="tab">상세</button>
    <button role="tab">리뷰</button>
  </div>
  <div role="tabpanel"><p>개요 내용입니다.</p></div>
  <div role="tabpanel"><p>상세 내용입니다.</p></div>
  <div role="tabpanel"><p>리뷰 내용입니다.</p></div>
</div>

<script>
(async function() {
  const { Tabs } = await IMCAT.use('navigation');
  const tabs = new Tabs('#myTabs', {
    animation: true,
    onChange: (index) => console.log('탭 변경:', index)
  });
})();
</script>
```

## 패턴 7: 데이터 로딩 + 로딩 인디케이터

API 호출 시 로딩 표시를 자동으로 처리합니다.

```javascript
async function loadData() {
  IMCAT.loading.show('데이터 로딩 중...');
  try {
    const users = await IMCAT.api.get('/api/users');
    renderUsers(users);
    IMCAT.toast.success(`${users.length}명 로드 완료`);
  } catch (e) {
    IMCAT.toast.error('로드 실패');
  } finally {
    IMCAT.loading.hide();
  }
}
```

## 패턴 8: 리액티브 상태 + DOM 업데이트

상태 변경을 감지하여 자동으로 UI를 업데이트합니다.

```html
<div class="card">
  <div class="card__body">
    <h4 id="countDisplay">카운트: 0</h4>
    <div class="btn-group">
      <button class="btn btn--primary" id="incBtn">+1</button>
      <button class="btn btn--secondary" id="decBtn">-1</button>
      <button class="btn btn--danger" id="resetBtn">초기화</button>
    </div>
  </div>
</div>

<script>
const state = IMCAT.state.create({ count: 0 });

state.watch('count', (newVal) => {
  IMCAT('#countDisplay').text(`카운트: ${newVal}`);
});

IMCAT('#incBtn').on('click', () => state.count++);
IMCAT('#decBtn').on('click', () => state.count--);
IMCAT('#resetBtn').on('click', () => state.count = 0);
</script>
```

## 패턴 9: 선언적 초기화 (data-imcat)

JavaScript 없이 HTML 속성만으로 컴포넌트를 초기화합니다.

```html
<!-- 드롭다운 -->
<button data-imcat="dropdown"
        data-items='[{"text":"수정","icon":"edit"},{"text":"삭제","icon":"delete"}]'
        data-position="bottom"
        class="btn btn--outline">
  메뉴
</button>

<!-- 툴팁 -->
<button data-imcat="tooltip" data-content="도움말 텍스트입니다" class="btn btn--primary">
  호버하세요
</button>

<!-- 모달 트리거 -->
<button data-imcat="modal"
        data-title="안내"
        data-content="이것은 모달입니다."
        class="btn btn--info">
  모달 열기
</button>
```

## 패턴 10: 파일 업로드 + 프리뷰

FileUpload 모듈을 사용한 드래그 앤 드롭 업로드입니다.

```html
<div id="uploader"></div>

<script>
(async function() {
  const { FileUpload } = await IMCAT.use('forms');
  const upload = new FileUpload('#uploader', {
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,  // 5MB
    multiple: true,
    preview: true,
    onUploadComplete: (files) => {
      IMCAT.toast.success(`${files.length}개 파일 업로드 완료`);
    },
    onError: (error) => {
      IMCAT.toast.error(error);
    }
  });
})();
</script>
```
