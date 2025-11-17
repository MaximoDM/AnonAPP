import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppStorageService } from 'src/app/services/app-storage'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private appStorage: AppStorageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: async (res) => {
        if (res.token) {
          await this.appStorage.set('token', res.token);
        }

        await this.appStorage.set('userId', String(res.id));
        await this.appStorage.set('alias', res.alias || '');
        await this.appStorage.set('isLoggedIn', 'true');

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        await this.goToMyProfile();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Error al iniciar sesión. Verifica tus datos.';
      }
    });
  }


  async goToMyProfile() {
  const alias = await this.appStorage.get<string>('alias');
  if (alias) {
    this.router.navigate(['/profile', alias]);
  }
}
}
