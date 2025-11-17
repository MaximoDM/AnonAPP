import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AppStorageService } from 'src/app/services/app-storage';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
  standalone: false
})
export class SettingsPopoverComponent {

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private appStorage: AppStorageService
  ) {}

  async goFeed() {
    await this.popoverCtrl.dismiss();
    this.router.navigate(['/feed']);
  }

async goProfile() {
  await this.popoverCtrl.dismiss();
  const alias = await this.appStorage.get<string>('alias');
  if (alias) {
    this.router.navigate(['/profile', alias]);
  } else {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

  async logout() {
    await this.popoverCtrl.dismiss();
    await this.appStorage.clear();           
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
