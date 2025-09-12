import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../Servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };
  public errorMessage: string | null = null; // Variable para mostrar el mensaje de error

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    sessionStorage.clear();
  }

  login(): void {
    this.errorMessage = null; // Limpiar cualquier mensaje de error anterior
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));
        this.router.navigate(['/vender']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Credenciales incorrectas.';
      }
    });
  }
}
