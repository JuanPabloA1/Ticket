import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Servicios/api.service';
// ¡Añade esta línea!
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true, // Esto está bien
  templateUrl: './historial.html', // Pronto corregiremos esto
  // ¡Corrige esta línea! Reemplaza CurrencyPipe por CommonModule
  imports: [CommonModule],
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  history: any[] = [];
  currentUser: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getHistory().subscribe({
      next: (data: any) => {
        console.log('Historial recibido del backend:', data);
        this.history = data;
      },
      error: (err: any) => console.error('Error al obtener el historial:', err)
    });

    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
