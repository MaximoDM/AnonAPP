import { Injectable } from '@angular/core';

export interface Message {
  author: string;
  text: string;
  isAnonymous: boolean;
  date: Date;
  reply: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messages: Message[] = [
    { author: 'Anónimo', text: '¿Qué te motiva cada día?', isAnonymous: true, date: new Date(), reply: null },
    { author: 'Pedro', text: 'Buen trabajo con la app.', isAnonymous: false, date: new Date(), reply: 'Gracias.' },
    { author: 'María', text: '¿Cuál fue tu mejor decisión?', isAnonymous: false, date: new Date(), reply: 'Tomarme en serio mis ideas.' }
  ];

  getAll(): Message[] {
    return this.messages;
  }

  getPending(): Message[] {
    return this.messages.filter(m => !m.reply);
  }

  getReplied(): Message[] {
    return this.messages.filter(m => m.reply);
  }

  replyTo(message: Message, replyText: string): void {
    const idx = this.messages.indexOf(message);
    if (idx !== -1) {
      this.messages[idx].reply = replyText.trim();
    }
  }

  discard(message: Message): void {
    this.messages = this.messages.filter(m => m !== message);
  }
}
