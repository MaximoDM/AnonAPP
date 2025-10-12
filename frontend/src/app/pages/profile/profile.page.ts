import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/message.model';
import { PopoverController } from '@ionic/angular';
import { SettingsPopoverComponent } from 'src/app/pages/settings-popover/settings-popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user = new User();
  replies: Message[] = [];
  loading = true;
  errorMessage = '';
  messageText = '';
  sendAnon = false;
  sending = false;
  currentAlias: string | null = null;
  isOwnProfile = false;

  constructor(
    private msgService: MessagesService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const alias = params.get('alias');
      this.currentAlias = alias;
      alias ? this.loadProfileByAlias(alias) : this.loadOwnProfile();
    });
  }

  private loadOwnProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.navigateToLogin();
      return;
    }

    const userAlias = localStorage.getItem('alias');

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
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
      }
    });
  }

  private loadProfileByAlias(alias: string) {
    this.loading = true;
    const myAlias = localStorage.getItem('alias');
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
      }
    });
  }

  private loadReplies() {
    const alias = localStorage.getItem('alias');
    if (!alias && !this.currentAlias) {
      console.error('No hay alias en localStorage');
      return;
    }

    if (this.currentAlias === alias) {
      this.msgService.getAll().subscribe({
        next: (msgs) => {
          this.replies = msgs.filter(m => !!m.reply);
        },
        error: (err) => {
          console.error('Error al cargar respuestas', err);
        }
      });
    } else {
      if (this.currentAlias) {
        this.msgService.getAllForUser(this.currentAlias).subscribe({
          next: (msgs) => {
            this.replies = msgs.filter(m => !!m.reply);
          },
          error: (err) => {
            console.error('Error al cargar respuestas', err);
          }
        });
      } else {
        console.error('currentAlias es null, no se puede cargar respuestas');
      }
    }
  }

  sendMessage() {
    if (!this.messageText.trim()) return;
    this.sending = true;

    this.msgService.sendMessage(this.user.alias, this.messageText, this.sendAnon).subscribe({
      next: () => {
        this.messageText = '';
        this.sending = false;
      },
      error: (err) => {
        console.error(err);
        this.sending = false;
      }
    });
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

  trackById(index: number, item: Message) {
    return item.id ?? index;
  }

  private navigateToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  editingBio = false;
  tempBio = '';
  savingBio = false;

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
    }
  });
}
}