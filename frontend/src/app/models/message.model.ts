// message.model.ts
export class Message {
  id?: number;
  text: string;
  reply?: string;
  isAnonymous: boolean;
  author?: string | null;
  avatar?: string | null;
  date?: Date;
  status?: string;
  // ... lo que ya tuvieras (votes, etc.)

  constructor(data: Partial<Message> = {}) {
    this.id = data.id;
    this.text = data.text ?? '';
    this.reply = data.reply ?? undefined;
    this.isAnonymous = !!data.isAnonymous;
    this.author = data.author ?? null;
    this.avatar = data.avatar ?? null;
    this.date = data.date ? new Date(data.date) : undefined;
    this.status = data.status;
  }

  static fromApi(api: any): Message {
    const isAnon = !!api.isAnonymous;

    return new Message({
      id: api.id,
      text: api.body,
      reply: api.reply,
      isAnonymous: isAnon,
      author: isAnon ? null : (api.fromUser?.alias ?? api.author ?? null),
      avatar: isAnon ? null : (api.fromUser?.avatar ?? api.avatar ?? null),
      date: api.createdAt,
      status: api.status,
    });
  }
}
