import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
        this.errorMessage = '';
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err: HttpErrorResponse) => {

        const code = err.error?.error; 

        switch (code) {
          case 'missing_fields':
            this.errorMessage = 'Faltan campos obligatorios.';
            break;
          case 'user_already_exists':
            this.errorMessage = 'El email ya está registrado.';
            break;
          case 'alias_already_exists':
            this.errorMessage = 'El alias ya está en uso.';
            break;
          case 'weak_password':
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            break;
          default:
            if (err.status === 0) {
              this.errorMessage = 'No se pudo conectar con el servidor.';
            } else {
              this.errorMessage = 'Error al registrar usuario.';
            }
            break;
        }
      }
    });
  }

}
