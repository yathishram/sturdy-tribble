export type NotificationPayload = {
  user_id: string;
  type: NotificationTypes;
  content: string;
  scheduled_at?: Date;
};
