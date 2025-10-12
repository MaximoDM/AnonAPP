import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    private router: Router
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
      next: (res) => {
        if (res.token) localStorage.setItem('token', res.token);

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        localStorage.setItem('userId', String(res.id));
        localStorage.setItem('alias', res.alias || '');
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/profile', res.alias], { replaceUrl: true });
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Error al iniciar sesión. Verifica tus datos.';
      }
    });
  }
}
