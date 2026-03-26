# Social

ChatUI, Comments, Reactions, SocialFeed, ShareButtons — 소셜 컴포넌트를 제공합니다.

> 소스: `src/modules/social.js`
>
> **이 문서의 핵심**: `IMCAT.use('social')` → ChatUI, Comments, Reactions, SocialFeed, ShareButtons.
> ChatUI: 실시간 채팅 인터페이스. Comments: 댓글/답글 시스템.
> Reactions: 이모지 리액션. SocialFeed: 포스트 피드. ShareButtons: 소셜 공유 버튼.

## 로드 방법

```javascript
const { ChatUI, Comments, Reactions, SocialFeed, ShareButtons } = await IMCAT.use('social');
```

---

## ChatUI

실시간 채팅 인터페이스입니다. 메시지 그룹화, 날짜 구분선, 타이핑 표시를 지원합니다.

```javascript
const { ChatUI } = await IMCAT.use('social');
const chat = new ChatUI('#chat', {
  currentUser: { id: 'user1', name: '홍길동', avatar: 'user1.jpg' },
  messages: [],
  placeholder: '메시지를 입력하세요...',
  showTimestamp: true,
  showAvatar: true,
  groupMessages: true,
  onSend: (message) => {
    console.log('전송:', message);
    // message = { id, userId, userName, avatar, text, timestamp }
  },
  onTyping: () => console.log('입력 중...')
});

// 메시지 추가
chat.addMessage({
  id: '1', userId: 'user2', userName: '김철수',
  avatar: 'user2.jpg', text: '안녕하세요!',
  timestamp: new Date().toISOString()
});
```

### ChatUI 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `messages` | array | `[]` | 초기 메시지 배열 |
| `currentUser` | object | `{ id: 'user1', name: '나', avatar: '' }` | 현재 사용자 정보 |
| `placeholder` | string | `'메시지를 입력하세요...'` | 입력 필드 플레이스홀더 |
| `showTimestamp` | boolean | `true` | 타임스탬프 표시 |
| `showAvatar` | boolean | `true` | 아바타 표시 |
| `groupMessages` | boolean | `true` | 같은 사용자 메시지 그룹화 |
| `onSend` | function | `null` | 메시지 전송 콜백 `(message)` |
| `onTyping` | function | `null` | 입력 중 콜백 |

### ChatUI 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addMessage(message)` | 메시지 추가 |
| `.setMessages(messages)` | 전체 메시지 교체 |
| `.clearMessages()` | 모든 메시지 삭제 |
| `.showTyping(users)` | 타이핑 표시 (사용자 배열) |
| `.hideTyping()` | 타이핑 표시 숨김 |
| `.destroy()` | 인스턴스 제거 |

### 메시지 객체 구조

```javascript
{
  id: '1',
  userId: 'user1',     // currentUser.id와 비교하여 내/상대 구분
  userName: '홍길동',
  avatar: 'user.jpg',
  text: '메시지 내용',
  timestamp: '2025-01-15T10:30:00.000Z'
}
```

---

## Comments

댓글/답글 시스템입니다. 좋아요, 수정, 삭제, 중첩 답글을 지원합니다.

```javascript
const { Comments } = await IMCAT.use('social');
new Comments('#comments', {
  comments: [
    {
      id: '1', userId: 'u1', userName: '홍길동', avatar: '',
      text: '좋은 글이네요!', createdAt: '2025-01-15T10:00:00Z',
      likes: 3, liked: false, replies: []
    }
  ],
  currentUser: { id: 'u2', name: '김철수', avatar: '' },
  allowReplies: true,
  allowEdit: true,
  allowDelete: true,
  maxDepth: 3,
  placeholder: '댓글을 입력하세요...',
  onSubmit: (comment) => console.log('등록:', comment),
  onEdit: (id, newText) => console.log('수정:', id, newText),
  onDelete: (id) => console.log('삭제:', id),
  onLike: (id) => console.log('좋아요:', id)
});
```

### Comments 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `comments` | array | `[]` | 초기 댓글 배열 |
| `currentUser` | object | `null` | 현재 사용자 `{ id, name, avatar }` (null이면 작성 폼 숨김) |
| `allowReplies` | boolean | `true` | 답글 허용 |
| `allowEdit` | boolean | `true` | 수정 허용 (본인 댓글만) |
| `allowDelete` | boolean | `true` | 삭제 허용 (본인 댓글만) |
| `maxDepth` | number | `3` | 답글 최대 중첩 깊이 |
| `placeholder` | string | `'댓글을 입력하세요...'` | 입력 필드 플레이스홀더 |
| `onSubmit` | function | `null` | 댓글 등록 콜백 `(comment)` |
| `onEdit` | function | `null` | 댓글 수정 콜백 `(id, newText)` |
| `onDelete` | function | `null` | 댓글 삭제 콜백 `(id)` |
| `onLike` | function | `null` | 좋아요 콜백 `(id)` |

### Comments 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addComment(comment)` | 댓글 추가 |
| `.setComments(comments)` | 전체 댓글 교체 |
| `.destroy()` | 인스턴스 제거 |

### 댓글 객체 구조

```javascript
{
  id: '1',
  userId: 'u1',
  userName: '홍길동',
  avatar: 'user.jpg',
  text: '댓글 내용',
  createdAt: '2025-01-15T10:00:00Z',
  likes: 0,
  liked: false,
  edited: false,
  replies: []   // 중첩 댓글
}
```

---

## Reactions

이모지 리액션 시스템입니다. 리액션은 **객체 배열**로 정의합니다.

```javascript
const { Reactions } = await IMCAT.use('social');
new Reactions('#post-reactions', {
  reactions: [
    { emoji: '👍', label: '좋아요', count: 12, active: false },
    { emoji: '❤️', label: '사랑해요', count: 5, active: true },
    { emoji: '�', label: '웃겨요', count: 0, active: false }
  ],
  onReact: (emoji, active) => console.log(emoji, active)
});
```

### Reactions 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `reactions` | array | 6개 이모지 객체 | 리액션 배열 (`{ emoji, label, count, active }`) |
| `onReact` | function | `null` | 리액션 토글 콜백 `(emoji, active)` |

### Reactions 기본 reactions 배열

```javascript
[
  { emoji: '👍', label: '좋아요', count: 0, active: false },
  { emoji: '❤️', label: '사랑해요', count: 0, active: false },
  { emoji: '😂', label: '웃겨요', count: 0, active: false },
  { emoji: '😮', label: '놀랐어요', count: 0, active: false },
  { emoji: '😢', label: '슬퍼요', count: 0, active: false },
  { emoji: '😡', label: '화나요', count: 0, active: false }
]
```

### Reactions 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setReactions(reactions)` | 리액션 배열 교체 |
| `.getReactions()` | 현재 리액션 배열 반환 |
| `.destroy()` | 인스턴스 제거 |

---

## SocialFeed

포스트 카드 기반 소셜 피드입니다. 포스트 작성, 좋아요, 댓글, 공유를 지원합니다.

```javascript
const { SocialFeed } = await IMCAT.use('social');
new SocialFeed('#feed', {
  posts: [
    {
      id: '1', userId: 'u1', userName: '홍길동', avatar: 'user.jpg',
      text: '새 게시물입니다.', createdAt: '2025-01-15T10:00:00Z',
      likes: 5, liked: false, commentCount: 2, images: []
    }
  ],
  currentUser: { id: 'u2', name: '김철수', avatar: '' },
  showCompose: true,
  showActions: true,
  onPost: (post) => console.log('게시:', post),
  onLike: (postId) => console.log('좋아요:', postId),
  onComment: (postId, text) => console.log('댓글:', postId),
  onShare: (postId) => console.log('공유:', postId)
});
```

### SocialFeed 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `posts` | array | `[]` | 초기 포스트 배열 |
| `currentUser` | object | `null` | 현재 사용자 `{ id, name, avatar }` |
| `showCompose` | boolean | `true` | 포스트 작성 폼 표시 |
| `composePlaceholder` | string | `'무슨 생각을 하고 계신가요?'` | 작성 폼 플레이스홀더 |
| `showActions` | boolean | `true` | 좋아요/댓글/공유 액션 바 표시 |
| `onPost` | function | `null` | 포스트 작성 콜백 `(postData)` |
| `onLike` | function | `null` | 좋아요 콜백 `(postId)` |
| `onComment` | function | `null` | 댓글 콜백 `(postId, text)` |
| `onShare` | function | `null` | 공유 콜백 `(postId)` |

### SocialFeed 메서드

| 메서드 | 설명 |
| --- | --- |
| `.addPost(post)` | 포스트 추가 (상단에 삽입) |
| `.setPosts(posts)` | 전체 포스트 교체 |
| `.removePost(postId)` | 포스트 삭제 |
| `.destroy()` | 인스턴스 제거 |

### 포스트 객체 구조

```javascript
{
  id: '1',
  userId: 'u1',
  userName: '홍길동',
  avatar: 'user.jpg',
  text: '게시물 내용',
  createdAt: '2025-01-15T10:00:00Z',
  likes: 0,
  liked: false,
  commentCount: 0,
  images: ['img1.jpg', 'img2.jpg']  // 최대 3개 그리드 표시
}
```

---

## ShareButtons

소셜 공유 버튼입니다. 8개 플랫폼을 지원합니다.

```javascript
const { ShareButtons } = await IMCAT.use('social');
new ShareButtons('#share', {
  url: 'https://example.com/article/1',
  title: '공유할 제목',
  description: '공유 설명',
  platforms: ['copy', 'twitter', 'facebook', 'linkedin', 'email'],
  layout: 'horizontal',
  size: 'md',
  showLabels: false,
  onShare: (platform) => console.log('공유:', platform)
});
```

### ShareButtons 옵션

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `url` | string | 현재 페이지 URL | 공유할 URL |
| `title` | string | 페이지 제목 | 공유 제목 |
| `description` | string | `''` | 공유 설명 |
| `image` | string | `''` | 공유 이미지 |
| `platforms` | array | `['copy', 'twitter', 'facebook', 'linkedin', 'email']` | 표시할 플랫폼 |
| `layout` | string | `'horizontal'` | 레이아웃 (`'horizontal'`/`'vertical'`) |
| `size` | string | `'md'` | 크기 (`'sm'`/`'md'`/`'lg'`) |
| `showLabels` | boolean | `false` | 플랫폼 라벨 표시 |
| `onShare` | function | `null` | 공유 콜백 `(platform)` |

### 지원 플랫폼

`copy`, `twitter`, `facebook`, `linkedin`, `email`, `whatsapp`, `telegram`, `kakaotalk`

### ShareButtons 메서드

| 메서드 | 설명 |
| --- | --- |
| `.setUrl(url)` | 공유 URL 변경 |
| `.setTitle(title)` | 공유 제목 변경 |
| `.destroy()` | 인스턴스 제거 |

---

## ⚠️ 보안 주의사항

- `userName`, `avatar` URL은 내부적으로 `Security.escape()` 처리됨
- 댓글/채팅/포스트 텍스트도 XSS 방어 적용
- 이미지 URL은 `Security.escape()` 처리 후 렌더링

## 관련 문서

- [Avatars CSS](../css/avatars.md) — 아바타 스타일
