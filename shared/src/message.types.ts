export interface Message {
  id: number;
  senderName: string;
  senderEmail: string;
  subject?: string;
  messageBody: string;
  isRead: boolean;
  createdAt?: string;
}

export type CreateMessageInput = Omit<Message, 'id' | 'isRead' | 'createdAt'>;
