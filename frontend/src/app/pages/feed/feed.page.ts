import { Component, OnInit } from '@angular/core';
import { MessagesService, Message } from 'src/app/services/messages.service';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
  messages: Message[] = [];
  modalOpen = false;
  currentMessage: Message | null = null;
  tempReply = '';

  constructor(private msgService: MessagesService) {}

  ngOnInit() {
    this.messages = this.msgService.getPending();
  }

  openModal(msg: Message) {
    this.currentMessage = msg;
    this.tempReply = '';
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.currentMessage = null;
    this.tempReply = '';
  }

  sendReply() {
    if (!this.tempReply.trim() || !this.currentMessage) return;
    this.msgService.replyTo(this.currentMessage, this.tempReply);
    this.messages = this.msgService.getPending();
    this.closeModal();
  }

  discard(msg: Message) {
    this.msgService.discard(msg);
    this.messages = this.msgService.getPending();
  }
}
