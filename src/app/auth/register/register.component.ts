import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]  // Agregado
    }, { validators: this.matchPasswords });
  }


  matchPasswords(group: FormGroup): { [key: string]: any } | null {
    return group.get('password')?.value === group.get('password_confirmation')?.value
      ? null : { notMatching: true };
  }


  register(): void {
    if (this.registerForm.invalid) return;

    const data = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: () => {
        this.successMessage = 'Usuario creado exitosamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.errorMessage = err?.error?.message || 'No se pudo registrar el usuario.';
      }
    });
  }
}
