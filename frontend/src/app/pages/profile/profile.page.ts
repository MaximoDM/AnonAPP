import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/message.model';
import { PopoverController } from '@ionic/angular';
import { SettingsPopoverComponent } from 'src/app/pages/settings-popover/settings-popover.component';
import { AppStorageService } from 'src/app/services/app-storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user = new User();              
  currentUser: User | null = null;

  replies: Message[] = [];
  loading = true;
  errorMessage = '';
  messageText = '';
  sendAnon = false;
  sending = false;
  currentAlias: string | null = null;
  myAlias: string | null = null;
  isOwnProfile = false;

  editingBio = false;
  tempBio = '';
  savingBio = false;

  avatarPreview: string | null = null;

  constructor(
    private msgService: MessagesService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private appStorage: AppStorageService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const alias = params.get('alias');
      this.currentAlias = alias;

      if (alias) {
        this.loadProfileByAlias(alias);
      } else {
        this.loadOwnProfile();
      }
    });
  }

  get canDeleteMessages(): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.isAdmin) return true;
    return this.isOwnProfile;
  }

  private async loadOwnProfile() {
    const token = await this.appStorage.get<string>('token');
    if (!token) {
      this.navigateToLogin();
      return;
    }

    const userAlias = await this.appStorage.get<string>('alias');
    this.myAlias = userAlias || null;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (!userAlias) {
          this.errorMessage = 'Tu perfil no tiene alias asignado.';
          return;
        }

        this.isOwnProfile = true;

        if (this.router.url !== `/profile/${userAlias}`) {
          this.router.navigate([`/profile/${userAlias}`], { replaceUrl: true });
        } else {
          this.user = user;      
          this.loadReplies();
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando usuario actual', err);
        this.navigateToLogin();
      },
    });
  }

  private async loadProfileByAlias(alias: string) {
    this.loading = true;

    const myAlias = await this.appStorage.get<string>('alias');
    this.myAlias = myAlias || null;
    this.isOwnProfile = alias === myAlias;

    this.userService.getProfile(alias).subscribe({
      next: (data) => {
        this.user = data;
        this.loadReplies();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'Perfil no encontrado.';
          this.router.navigate(['/feed'], { replaceUrl: true });
        }
      },
    });

    this.userService.getCurrentUser().subscribe({
      next: (me) => {
        this.currentUser = me;
      },
      error: () => {
        this.currentUser = null;
      },
    });
  }

  private loadReplies() {
    if (!this.currentAlias && !this.myAlias) {
      console.error('No hay alias actual ni alias de usuario logueado');
      return;
    }

    if (this.currentAlias && this.currentAlias === this.myAlias) {
      this.msgService.getAll().subscribe({
        next: (msgs) => (this.replies = msgs.filter((m) => !!m.reply)),
        error: (err) => console.error('Error al cargar respuestas', err),
      });
    } else if (this.currentAlias) {
      this.msgService.getAllForUser(this.currentAlias).subscribe({
        next: (msgs) => (this.replies = msgs.filter((m) => !!m.reply)),
        error: (err) => console.error('Error al cargar respuestas', err),
      });
    }
  }

sendMessage() {
  if (this.isOwnProfile) {
    this.errorMessage = 'No puedes enviarte mensajes a ti mismo.';
    return;
  }
  if (!this.messageText.trim()) return;
  this.sending = true;

  this.msgService
    .sendMessage(this.user.alias, this.messageText, this.sendAnon)
    .subscribe({
      next: () => {
        this.messageText = '';
        this.sending = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.sending = false;
        this.errorMessage =
          err.error?.error === 'cannot_message_yourself'
            ? 'No puedes enviarte mensajes a ti mismo.'
            : 'Error al enviar el mensaje.';
      },
    });
}


  async openSettings(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: SettingsPopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'settings-popover-style',
    });
    await popover.present();
  }

  trackById(index: number, item: Message) {
    return item.id ?? index;
  }

  private navigateToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  editBio() {
    this.tempBio = this.user.bio || '';
    this.editingBio = true;
  }

  cancelEdit() {
    this.editingBio = false;
    this.tempBio = '';
  }

  saveBio() {
    const newBio = this.tempBio.trim();
    if (!newBio) return;
    this.savingBio = true;

    this.userService.updateUser({ bio: newBio }).subscribe({
      next: () => {
        this.user.bio = newBio;
        this.editingBio = false;
        this.savingBio = false;
      },
      error: (err) => {
        console.error('Error al actualizar bio', err);
        this.savingBio = false;
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024) {
      alert('El archivo debe pesar menos de 50 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.subirAvatarBase64(this.avatarPreview);
    };
    reader.readAsDataURL(file);
  }

  subirAvatarBase64(preview: string) {
    this.userService.updateAvatarBase64(preview).subscribe({
      next: () => {
        this.user.avatar = preview;
        this.avatarPreview = null;
      },
      error: (err) => console.error('Error al subir avatar', err),
    });
  }

  onDeleteReply(msg: Message) {
    if (!msg.id || !this.canDeleteMessages) return;

    this.msgService.delete(msg.id).subscribe({
      next: () => {
        this.replies = this.replies.filter((m) => m.id !== msg.id);
      },
      error: (err) => {
        console.error('Error al borrar mensaje', err);
      },
    });
  }
}
