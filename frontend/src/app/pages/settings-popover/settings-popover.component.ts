import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
  standalone: false
})
export class SettingsPopoverComponent {

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) {}

  async goProfile() {
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/profile']);
  }

  async logout() {
    await this.popoverCtrl.dismiss();
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async goFeed() {
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/feed']);
  }

}
