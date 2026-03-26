# Social

ChatUI, Comments, Reactions, SocialFeed, ShareButtons — 소셜 컴포넌트를 제공합니다.

> 소스: `src/modules/social.js`
>
> **이 문서의 핵심**: `IMCAT.use('social')` → ChatUI, Comments, Reactions, SocialFeed, ShareButtons.
> userName/avatar 등 사용자 입력은 내부적으로 XSS 방어 처리 완료.

## 로드 방법

```javascript
const { ChatUI, Comments, Reactions, SocialFeed, ShareButtons } = await IMCAT.use('social');
```

## ChatUI

```javascript
const { ChatUI } = await IMCAT.use('social');
const chat = new ChatUI('#chat', {
  currentUser: { id: 1, name: '홍길동', avatar: 'user1.jpg' },
  onSend: (message) => {
    console.log('전송:', message);
    // 서버 전송 후 addMessage 호출
  }
});
chat.addMessage({ user: { name: '김철수', avatar: 'user2.jpg' }, text: '안녕하세요!' });
```

## Comments

```javascript
const { Comments } = await IMCAT.use('social');
new Comments('#comments', {
  data: [
    { id: 1, user: { name: '홍길동' }, text: '좋은 글이네요!', date: '2025-01-15' }
  ],
  onSubmit: (comment) => IMCAT.toast.success('댓글 등록'),
  allowReply: true,
  maxDepth: 3
});
```

## Reactions

```javascript
const { Reactions } = await IMCAT.use('social');
new Reactions('#post-reactions', {
  reactions: ['👍', '❤️', '😂', '😮', '😢'],
  counts: { '👍': 12, '❤️': 5 },
  onReact: (emoji, count) => console.log(emoji, count)
});
```

## SocialFeed

```javascript
const { SocialFeed } = await IMCAT.use('social');
new SocialFeed('#feed', {
  items: [
    { user: { name: '홍길동', avatar: 'user.jpg' }, content: '새 게시물입니다.', date: '2025-01-15' }
  ],
  infiniteScroll: true,
  onLoadMore: async (page) => await IMCAT.api.get(`/api/feed?page=${page}`)
});
```

## ShareButtons

```javascript
const { ShareButtons } = await IMCAT.use('social');
new ShareButtons('#share', {
  url: 'https://example.com/article/1',
  title: '공유할 제목',
  platforms: ['twitter', 'facebook', 'linkedin', 'copy']
});
```

## ⚠️ 주의사항

- 사용자명/아바타 URL은 내부적으로 `Security.escape()` 처리됨
- 댓글/채팅 내용도 XSS 방어 적용

## 관련 문서

- [Avatars CSS](../css/avatars.md) — 아바타 스타일
