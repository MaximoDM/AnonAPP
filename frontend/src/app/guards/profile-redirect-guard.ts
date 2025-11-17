import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStorageService } from 'src/app/services/app-storage';

@Injectable({ providedIn: 'root' })
export class ProfileRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private appStorage: AppStorageService
  ) {}

  async canActivate(): Promise<boolean> {
    const alias = await this.appStorage.get<string>('alias');

    if (alias) {
      this.router.navigate(['/profile', alias], { replaceUrl: true });
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }

    return false;
  }
}
