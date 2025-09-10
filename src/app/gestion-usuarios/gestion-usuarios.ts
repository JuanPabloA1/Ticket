import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Servicios/api.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css'], // <- corregido
})
export class GestionUsuarios implements OnInit {
  userForm!: FormGroup;
  message: string | null = null;
  isSubmitting = false;
  currentUser: any = null;

  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    } else {
      // Manejar el caso si el usuario no está logueado, aunque el guard debería hacerlo
      this.router.navigate(['/login']);
      return;
    }
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
    });
  }

  private capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const userData = this.userForm.value;

    this.api.createUser(userData).subscribe({
      next: (res) => {
        this.message = `Usuario '${res.user.username}' creado.`;
        this.userForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Error al crear el usuario.';
        this.isSubmitting = false;
      },
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
