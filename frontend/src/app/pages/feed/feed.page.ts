import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/message.model';
import { PopoverController } from '@ionic/angular';
import { SettingsPopoverComponent } from 'src/app/pages/settings-popover/settings-popover.component';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: false,
})
export class FeedPage implements OnInit {
  user: User = new User();
  messages: Message[] = [];
  modalOpen = false;
  currentMessage: Message | null = null;
  tempReply = '';
  loading = true;
  errorMessage = '';

  constructor(
    private msgService: MessagesService,
    private userService: UserService,
    private popoverCtrl: PopoverController  
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadMessages();
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe({
      next: (u: User) => {
        this.user = u;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el usuario actual.';
      },
    });
  }

  loadMessages() {
    this.loading = true;
    this.msgService.getAll().subscribe({
      next: (msgs) => {
        this.messages = msgs.filter(m => !m.reply && m.status !== 'rejected');
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar mensajes.';
        this.loading = false;
      }
    });
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
    if (!this.tempReply.trim() || !this.currentMessage?.id) return;

    this.msgService.replyTo(this.currentMessage.id, this.tempReply).subscribe({
      next: () => {
        this.closeModal();
        this.loadMessages();
      },
      error: (err) => {
        this.errorMessage = 'Error al enviar respuesta.';
      },
    });
  }


  // De momento lo borramos pero mi interés es mantenerlo por si acaso luego lo queremos 
  reject(msg: Message) {
    if (!msg.id) return;

    this.msgService.delete(msg.id).subscribe({
      next: () => this.loadMessages(),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al rechazar mensaje.';
      }
    });
  }

  trackById(index: number, item: Message) {
    return item.id ?? index;
  }

  async openSettings(ev: Event) {
  const popover = await this.popoverCtrl.create({
    component: SettingsPopoverComponent,
    event: ev,
    translucent: true,
    cssClass: 'settings-popover-style'
  });
    await popover.present();
  }

}
