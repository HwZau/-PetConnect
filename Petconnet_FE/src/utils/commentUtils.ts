import type { Comment } from '../components/community/CommunityFeed';

export const createUniqueCommentId = (postId: string | number, base?: string | number): string => {
  return `${String(postId)}_${base || Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

interface NormalizeOptions {
  defaultAuthor?: string;
  defaultTimestamp?: string;
}

export const normalizeComment = (comment: Partial<Comment>, options: NormalizeOptions = {}): Comment => {
  if (!comment || typeof comment !== 'object') {
    throw new Error('Invalid comment data');
  }

  const {
    defaultAuthor = 'Người dùng',
    defaultTimestamp = 'Vừa xong'
  } = options;

  return {
    id: comment.id || createUniqueCommentId(comment.postId || '0'),
    postId: String(comment.postId || '0'),
    author: comment.author || defaultAuthor,
    content: comment.content || '',
    timestamp: comment.timestamp || defaultTimestamp
  };
};

export const validateComment = (comment: unknown): comment is Comment => {
  return (
    comment !== null &&
    typeof comment === 'object' &&
    'id' in comment &&
    'author' in comment &&
    'content' in comment &&
    'timestamp' in comment &&
    'postId' in comment &&
    typeof (comment as Comment).id === 'string' &&
    typeof (comment as Comment).author === 'string' &&
    typeof (comment as Comment).content === 'string' &&
    typeof (comment as Comment).timestamp === 'string' &&
    typeof (comment as Comment).postId === 'string'
  );
};