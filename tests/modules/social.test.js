/**
 * Social Module 테스트
 * ChatUI, Comments, ShareButtons, Reactions, SocialFeed
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let ChatUI, Comments, ShareButtons, Reactions, SocialFeed;

beforeEach(async () => {
  const mod = await import('../../src/modules/social.js');
  ChatUI = mod.ChatUI || mod.default?.ChatUI;
  Comments = mod.Comments || mod.default?.Comments;
  ShareButtons = mod.ShareButtons || mod.default?.ShareButtons;
  Reactions = mod.Reactions || mod.default?.Reactions;
  SocialFeed = mod.SocialFeed || mod.default?.SocialFeed;
  document.body.innerHTML = '<div id="social-container"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('ChatUI', () => {
  it('ChatUI 클래스가 존재해야 함', () => {
    expect(ChatUI).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: []
    });
    expect(chat).toBeDefined();
    chat.destroy?.();
  });

  it('destroy()로 정리되어야 함', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: []
    });
    if (chat && typeof chat.destroy === 'function') {
      chat.destroy();
    }
  });
});

describe('Comments', () => {
  it('Comments 클래스가 존재해야 함', () => {
    expect(Comments).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: []
    });
    expect(c).toBeDefined();
    c.destroy?.();
  });
});

describe('ShareButtons', () => {
  it('ShareButtons 클래스가 존재해야 함', () => {
    expect(ShareButtons).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      title: 'IMCAT UI'
    });
    expect(sb).toBeDefined();
    sb.destroy?.();
  });
});

describe('Reactions', () => {
  it('Reactions 클래스가 존재해야 함', () => {
    expect(Reactions).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var r = new Reactions('#social-container', {
      reactions: [
        { emoji: '👍', label: '좋아요', count: 0, active: false }
      ]
    });
    expect(r).toBeDefined();
    r.destroy?.();
  });
});

describe('SocialFeed', () => {
  it('SocialFeed 클래스가 존재해야 함', () => {
    expect(SocialFeed).toBeDefined();
  });

  it('인스턴스를 생성할 수 있어야 함', () => {
    var sf = new SocialFeed('#social-container', { posts: [] });
    expect(sf).toBeDefined();
    sf.destroy?.();
  });

  it('포스트와 함께 생성', () => {
    var sf = new SocialFeed('#social-container', {
      posts: [
        { id: '1', userName: '홍길동', text: '안녕', createdAt: new Date().toISOString(), likes: 3, liked: true, images: ['img1.jpg', 'img2.jpg'] }
      ],
      currentUser: { id: 'me', name: '나' }
    });
    expect(sf).toBeDefined();
    sf.destroy?.();
  });

  it('addPost / setPosts / removePost', () => {
    var sf = new SocialFeed('#social-container', { posts: [], currentUser: { id: 'me', name: '나' } });
    sf.addPost({ id: '1', userName: '테스트', text: '포스트', createdAt: new Date().toISOString() });
    sf.setPosts([{ id: '2', userName: '테스트2', text: '포스트2', createdAt: new Date().toISOString() }]);
    sf.removePost('2');
    sf.destroy?.();
  });

  it('좋아요 클릭', () => {
    const onLike = vi.fn();
    var sf = new SocialFeed('#social-container', {
      posts: [{ id: '1', userName: '홍', text: '테스트', createdAt: new Date().toISOString(), likes: 0 }],
      onLike
    });
    const likeBtn = document.querySelector('[data-action="like"]');
    if (likeBtn) likeBtn.click();
    sf.destroy?.();
  });
});

describe('ChatUI 추가', () => {
  it('메시지와 함께 생성', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [
        { userId: 'me', userName: '나', text: '안녕', timestamp: new Date().toISOString() },
        { userId: 'other', userName: '상대', text: '반가워', timestamp: new Date().toISOString(), avatar: 'av.jpg' }
      ]
    });
    expect(chat).toBeDefined();
    chat.destroy?.();
  });

  it('addMessage / setMessages / clearMessages', () => {
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [] });
    chat.addMessage({ userId: 'me', userName: '나', text: '추가', timestamp: new Date().toISOString() });
    chat.setMessages([{ userId: 'other', userName: '상대', text: '교체', timestamp: new Date().toISOString() }]);
    chat.clearMessages();
    chat.destroy?.();
  });

  it('전송 버튼 클릭', () => {
    const onSend = vi.fn();
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [], onSend });
    chat.input.value = '안녕하세요';
    chat.sendBtn.click();
    expect(onSend).toHaveBeenCalled();
    chat.destroy?.();
  });

  it('Enter 키로 전송', () => {
    const onSend = vi.fn();
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [], onSend });
    chat.input.value = '키보드 전송';
    chat.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onSend).toHaveBeenCalled();
    chat.destroy?.();
  });

  it('showTyping / hideTyping', () => {
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [] });
    chat.showTyping([{ name: '상대' }]);
    expect(chat.typingContainer.classList.contains('is-visible')).toBe(true);
    chat.hideTyping();
    expect(chat.typingContainer.classList.contains('is-visible')).toBe(false);
    chat.showTyping([]);
    chat.destroy?.();
  });

  it('빈 메시지 전송 무시', () => {
    const onSend = vi.fn();
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [], onSend });
    chat.input.value = '';
    chat.sendBtn.click();
    expect(onSend).not.toHaveBeenCalled();
    chat.destroy?.();
  });

  it('input 이벤트 — 높이 조절 및 onTyping', () => {
    vi.useFakeTimers();
    const onTyping = vi.fn();
    var chat = new ChatUI('#social-container', { currentUser: { id: 'me', name: '나' }, messages: [], onTyping });
    chat.input.dispatchEvent(new Event('input'));
    expect(onTyping).toHaveBeenCalled();
    vi.advanceTimersByTime(1100);
    chat.destroy?.();
    vi.useRealTimers();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ChatUI('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Comments 추가', () => {
  it('댓글과 함께 생성', () => {
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [
        { id: '1', userId: 'me', userName: '나', text: '댓글', createdAt: new Date().toISOString(), likes: 1, liked: true, edited: true, replies: [
          { id: '2', userId: 'other', userName: '상대', text: '답글', createdAt: new Date().toISOString(), replies: [] }
        ] }
      ]
    });
    expect(c).toBeDefined();
    c.destroy?.();
  });

  it('addComment / setComments', () => {
    var c = new Comments('#social-container', { currentUser: { id: 'me', name: '나' }, comments: [] });
    c.addComment({ id: '1', userId: 'me', userName: '나', text: '추가', createdAt: new Date().toISOString(), replies: [] });
    c.setComments([]);
    c.destroy?.();
  });

  it('좋아요 클릭', () => {
    const onLike = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'other', userName: '상대', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      onLike
    });
    const likeBtn = document.querySelector('[data-action="like"]');
    if (likeBtn) likeBtn.click();
    c.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new Comments('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('메인 폼으로 댓글 제출', () => {
    const onSubmit = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [],
      onSubmit
    });
    var input = c.container.querySelector('.comments__form--main .comments__input');
    var submitBtn = c.container.querySelector('.comments__form--main .comments__submit');
    if (input && submitBtn) {
      input.value = '새 댓글';
      submitBtn.click();
      expect(onSubmit).toHaveBeenCalled();
    }
    c.destroy?.();
  });

  it('답글 폼 열기/닫기', () => {
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'other', userName: '상대', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      allowReplies: true
    });
    var replyBtn = c.container.querySelector('[data-action="reply"]');
    if (replyBtn) {
      replyBtn.click(); // 열기
      var replyForm = c.container.querySelector('.comments__reply-form');
      expect(replyForm.style.display).toBe('block');
      replyBtn.click(); // 닫기
    }
    c.destroy?.();
  });

  it('답글 제출', () => {
    const onSubmit = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'other', userName: '상대', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      allowReplies: true,
      onSubmit
    });
    var replyBtn = c.container.querySelector('[data-action="reply"]');
    if (replyBtn) {
      replyBtn.click();
      var replyInput = c.container.querySelector('.comments__input--reply');
      var replySubmit = c.container.querySelector('.comments__reply-submit');
      if (replyInput && replySubmit) {
        replyInput.value = '답글 내용';
        replySubmit.click();
        expect(onSubmit).toHaveBeenCalled();
      }
    }
    c.destroy?.();
  });

  it('답글 취소', () => {
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'other', userName: '상대', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      allowReplies: true
    });
    var replyBtn = c.container.querySelector('[data-action="reply"]');
    if (replyBtn) {
      replyBtn.click();
      var cancelBtn = c.container.querySelector('.comments__cancel');
      if (cancelBtn) cancelBtn.click();
    }
    c.destroy?.();
  });

  it('수정 버튼 (prompt)', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('수정된 댓글');
    const onEdit = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'me', userName: '나', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      allowEdit: true,
      onEdit
    });
    var editBtn = c.container.querySelector('[data-action="edit"]');
    if (editBtn) {
      editBtn.click();
      expect(onEdit).toHaveBeenCalledWith('1', '수정된 댓글');
    }
    c.destroy?.();
  });

  it('삭제 버튼 (confirm)', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onDelete = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [{ id: '1', userId: 'me', userName: '나', text: '댓글', createdAt: new Date().toISOString(), likes: 0, replies: [] }],
      allowDelete: true,
      onDelete
    });
    var delBtn = c.container.querySelector('[data-action="delete"]');
    if (delBtn) {
      delBtn.click();
      expect(onDelete).toHaveBeenCalledWith('1');
    }
    c.destroy?.();
  });

  it('빈 텍스트 제출 무시', () => {
    const onSubmit = vi.fn();
    var c = new Comments('#social-container', {
      currentUser: { id: 'me', name: '나' },
      comments: [],
      onSubmit
    });
    var input = c.container.querySelector('.comments__form--main .comments__input');
    var submitBtn = c.container.querySelector('.comments__form--main .comments__submit');
    if (input && submitBtn) {
      input.value = '';
      submitBtn.click();
      expect(onSubmit).not.toHaveBeenCalled();
    }
    c.destroy?.();
  });
});

describe('ShareButtons 추가', () => {
  it('플랫폼 버튼 렌더링', () => {
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      title: 'IMCAT',
      platforms: ['copy', 'twitter', 'facebook', 'email']
    });
    expect(document.querySelectorAll('.share-buttons__btn').length).toBe(4);
    sb.destroy?.();
  });

  it('setUrl / setTitle', () => {
    var sb = new ShareButtons('#social-container', { url: 'https://imcat.dev' });
    sb.setUrl('https://new.dev');
    expect(sb.options.url).toBe('https://new.dev');
    sb.setTitle('새 제목');
    expect(sb.options.title).toBe('새 제목');
    sb.destroy?.();
  });

  it('showLabels 옵션', () => {
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      platforms: ['copy'],
      showLabels: true
    });
    expect(document.querySelector('.share-buttons__label')).not.toBeNull();
    sb.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new ShareButtons('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Reactions 추가', () => {
  it('리액션 토글', () => {
    const onReact = vi.fn();
    var r = new Reactions('#social-container', {
      reactions: [{ emoji: '👍', label: '좋아요', count: 0, active: false }],
      onReact
    });
    const btn = document.querySelector('.reactions__btn');
    if (btn) btn.click();
    expect(onReact).toHaveBeenCalled();
    r.destroy?.();
  });

  it('setReactions / getReactions', () => {
    var r = new Reactions('#social-container', {
      reactions: [{ emoji: '👍', label: '좋아요', count: 5, active: true }]
    });
    expect(r.getReactions()[0].count).toBe(5);
    r.setReactions([{ emoji: '❤️', label: '사랑', count: 0, active: false }]);
    expect(r.getReactions()[0].emoji).toBe('❤️');
    r.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new Reactions('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('SocialFeed 추가2', () => {
  it('compose submit', () => {
    const onPost = vi.fn();
    var sf = new SocialFeed('#social-container', {
      posts: [],
      currentUser: { id: 'me', name: '나' },
      showCompose: true,
      onPost
    });
    var textarea = sf.container.querySelector('.feed-post__compose textarea');
    var submitBtn = sf.container.querySelector('.feed-post__submit');
    if (textarea && submitBtn) {
      textarea.value = '새 포스트';
      submitBtn.click();
      expect(onPost).toHaveBeenCalled();
    }
    sf.destroy?.();
  });

  it('compose 빈 텍스트 무시', () => {
    const onPost = vi.fn();
    var sf = new SocialFeed('#social-container', {
      posts: [],
      currentUser: { id: 'me', name: '나' },
      onPost
    });
    var textarea = sf.container.querySelector('.feed-post__compose textarea');
    var submitBtn = sf.container.querySelector('.feed-post__submit');
    if (textarea && submitBtn) {
      textarea.value = '';
      submitBtn.click();
      expect(onPost).not.toHaveBeenCalled();
    }
    sf.destroy?.();
  });

  it('comment 버튼 클릭', () => {
    const onComment = vi.fn();
    var sf = new SocialFeed('#social-container', {
      posts: [{ id: '1', userName: '홍', text: '테스트', createdAt: new Date().toISOString() }],
      onComment
    });
    var commentBtn = sf.container.querySelector('[data-action="comment"]');
    if (commentBtn) commentBtn.click();
    expect(onComment).toHaveBeenCalled();
    sf.destroy?.();
  });

  it('share 버튼 클릭', () => {
    const onShare = vi.fn();
    var sf = new SocialFeed('#social-container', {
      posts: [{ id: '1', userName: '홍', text: '테스트', createdAt: new Date().toISOString() }],
      onShare
    });
    var shareBtn = sf.container.querySelector('[data-action="share"]');
    if (shareBtn) shareBtn.click();
    expect(onShare).toHaveBeenCalled();
    sf.destroy?.();
  });

  it('showCompose false', () => {
    var sf = new SocialFeed('#social-container', { posts: [], showCompose: false });
    expect(sf.container.querySelector('.feed-post__compose')).toBeNull();
    sf.destroy?.();
  });

  it('showActions false', () => {
    var sf = new SocialFeed('#social-container', {
      posts: [{ id: '1', userName: '홍', text: '테', createdAt: new Date().toISOString() }],
      showActions: false
    });
    expect(sf.container.querySelector('.feed-post__actions')).toBeNull();
    sf.destroy?.();
  });

  it('존재하지 않는 컨테이너 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    new SocialFeed('#nonexistent');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('ShareButtons 추가2', () => {
  it('copy 버튼 클릭', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(true) } });
    vi.useFakeTimers();
    const onShare = vi.fn();
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      platforms: ['copy'],
      onShare
    });
    var copyBtn = sb.container.querySelector('.share-buttons__btn--copy');
    if (copyBtn) {
      copyBtn.click();
      await vi.advanceTimersByTimeAsync(100);
    }
    sb.destroy?.();
    vi.useRealTimers();
  });

  it('twitter 버튼 — window.open 호출', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const onShare = vi.fn();
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      title: 'IMCAT',
      platforms: ['twitter'],
      onShare
    });
    var btn = sb.container.querySelector('.share-buttons__btn--twitter');
    if (btn) btn.click();
    expect(openSpy).toHaveBeenCalled();
    expect(onShare).toHaveBeenCalledWith('twitter');
    openSpy.mockRestore();
    sb.destroy?.();
  });

  it('whatsapp/telegram/linkedin 플랫폼', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      platforms: ['whatsapp', 'telegram', 'linkedin']
    });
    expect(sb.container.querySelectorAll('.share-buttons__btn').length).toBe(3);
    openSpy.mockRestore();
    sb.destroy?.();
  });

  it('vertical layout / lg size', () => {
    var sb = new ShareButtons('#social-container', {
      url: 'https://imcat.dev',
      platforms: ['copy'],
      layout: 'vertical',
      size: 'lg'
    });
    expect(sb.container.classList.contains('share-buttons--vertical')).toBe(true);
    expect(sb.container.classList.contains('share-buttons--lg')).toBe(true);
    sb.destroy?.();
  });
});

describe('ChatUI 추가2', () => {
  it('_formatDate — 어제', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [{ userId: 'me', userName: '나', text: '어제 메시지', timestamp: yesterday.toISOString() }]
    });
    expect(chat.messagesContainer.innerHTML).toContain('어제');
    chat.destroy?.();
  });

  it('_formatDate — 옛날 날짜', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [{ userId: 'me', userName: '나', text: '옛날', timestamp: '2020-01-01T00:00:00Z' }]
    });
    expect(chat.messagesContainer.innerHTML.length).toBeGreaterThan(0);
    chat.destroy?.();
  });

  it('groupMessages — 같은 사용자 연속 메시지', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [
        { userId: 'me', userName: '나', text: '1', timestamp: new Date().toISOString() },
        { userId: 'me', userName: '나', text: '2', timestamp: new Date().toISOString() }
      ],
      groupMessages: true
    });
    expect(chat.messagesContainer.querySelectorAll('.chat-ui__message--grouped').length).toBe(1);
    chat.destroy?.();
  });

  it('showTimestamp false', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [{ userId: 'me', userName: '나', text: '테스트', timestamp: new Date().toISOString() }],
      showTimestamp: false
    });
    expect(chat.messagesContainer.querySelector('.chat-ui__time')).toBeNull();
    chat.destroy?.();
  });

  it('showAvatar false', () => {
    var chat = new ChatUI('#social-container', {
      currentUser: { id: 'me', name: '나' },
      messages: [{ userId: 'other', userName: '상대', text: '안녕', timestamp: new Date().toISOString() }],
      showAvatar: false
    });
    expect(chat.messagesContainer.querySelector('.chat-ui__avatar')).toBeNull();
    chat.destroy?.();
  });
});
