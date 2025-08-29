import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../Servicios/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin(): void {
    this.apiService.login(this.credentials).subscribe({
      // 3. Los parámetros con la etiqueta ": any"
      next: (response: any) => {
        console.log('Respuesta del backend (login exitoso):', response);

        sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));
        sessionStorage.setItem('token', response.token);

        this.router.navigate(['/vender']);
      },
      // 3. Los parámetros con la etiqueta ": any"
      error: (err: any) => {
        console.error('Error del backend:', err);
        this.errorMessage = err.error.message || 'No se pudo conectar con el servidor.';
      }
    });
  }
}
