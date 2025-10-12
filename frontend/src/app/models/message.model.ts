import { User } from './user.model';

export interface RawMessage {
  id: number;
  body: string;
  reply?: string | null;
  createdAt: string;
  status?: string;
  visible?: boolean;
  fromUser?: {
    alias?: string;
    avatar?: string;
  } | null;
}

export class Message {
  id!: number;
  text!: string;
  reply?: string | null;
  date!: Date;
  author?: string | null;
  avatar?: string | null;
  isAnonymous!: boolean;
  status?: string;
  visible?: boolean;

 constructor(data: Partial<Message> = {}) {
    Object.assign(this, data);
  }


  static fromApi(apiData: RawMessage): Message {
    return new Message({
      id: apiData.id,
      text: apiData.body,
      reply: apiData.reply,
      date: new Date(apiData.createdAt),
      author: apiData.fromUser?.alias || null,
      avatar: apiData.fromUser?.avatar || null,
      isAnonymous: !apiData.fromUser,
      status: apiData.status,
      visible: apiData.visible,
    });
  }

  get shortText(): string {
    return this.text.length > 100 ? this.text.slice(0, 100) + '…' : this.text;
  }

  get isReplied(): boolean {
    return this.status === 'replied' && !!this.reply;
  }
}
