import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      alias: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    const { email, alias, password } = this.registerForm.value;

    this.authService.register({ email, alias, password }).subscribe({
      next: () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Error al registrar usuario.';
      }
    });
  }
}
