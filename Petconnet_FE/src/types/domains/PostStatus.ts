export enum PostStatus {
  Draft = 0,
  Pending = 1,
  Rejected = 2,
  Approved = 3
}

export const PostStatusLabels: Record<PostStatus, string> = {
  [PostStatus.Draft]: 'Nháp',
  [PostStatus.Pending]: 'Chờ duyệt',
  [PostStatus.Rejected]: 'Bị từ chối',
  [PostStatus.Approved]: 'Đã duyệt'
};
