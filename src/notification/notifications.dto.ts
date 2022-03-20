export enum notificationEnum {
  teacher = "teacher",
  follow = "follow",
  review = "review",
  replyOfPost = "reply of post",
  likePost = "like post",
  buyLesson = "buy lesson",
  buyStreamTicket = "buy stream ticket",
  inviteTeacher = "invite",
  acceptInvite = "accept-invite",
  rejectInvite = "reject-invite",
  disimissTeacher = "dissmis-teacher",
}

export const generateNotificationText = {
  follow: (name: string) => `${name} started following you.`,
  inviteTeacher: (name: string) => `${name} invites you to his company`,
  acceptInvite: (name: string) => `${name} accepted your invite`,
  rejectInvite: (name: string) => `${name} rejected your invite`,
  acceptBecomeTeacher: () => `Your request to become a teacher has been accepted`,
  rejectBecome: (type: string) => `Your request for become a ${type} has been rejected`,
  acceptBecomeCompany: () => `Your request to create a company has been accepted`,
  replyOfPost: (name: string) => `${name} replied to your post`,
  review: (name: string) => `${name} wrote a review about you`,
  likePost: (name: string) => `${name} like your post`,
  dismissTeacher: (name: string) => `${name} dismiss you.`,
};
