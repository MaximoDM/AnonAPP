import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { SettingsPopoverComponent } from 'src/app/pages/settings-popover/settings-popover.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  standalone: false
})
export class MainHeaderComponent {
  @Input() title: string | null = null;
  @Input() showProfileButton = false;
  @Input() showSettingsButton = true;
  @Input() profileAlias: string | null = null;

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) {}

  goProfile() {
    if (this.profileAlias) {
      this.router.navigate(['/profile', this.profileAlias]);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  goPanel() {
    this.router.navigate(['/panel']);
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
}
