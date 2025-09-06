import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../Servicios/api.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.html',
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, CurrencyPipe],
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  history: any[] = [];
  filteredHistory: any[] = [];
  users: any[] = [];
  selectedUser: string | null = null;
  currentUser: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    } else {
      // Manejar el caso si el usuario no está logueado, aunque el guard debería hacerlo
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getHistory().subscribe({
      next: (data: any) => {
        console.log(data);

        this.history = data;
        this.filteredHistory = data;
        this.extractUsers();
      },
      error: (err: any) => console.error('Error al obtener el historial:', err)
    });
  }

  extractUsers(): void {
    const userMap = new Map();
    this.history.forEach(item => {
      if (!userMap.has(item.user.username)) {
        userMap.set(item.user.username, item.user);
      }
    });
    this.users = Array.from(userMap.values());
  }

  filterHistory(): void {
    if (this.selectedUser === null || this.selectedUser === '') {
      this.filteredHistory = this.history;
    } else {
      this.filteredHistory = this.history.filter(
        item => item.user.username === this.selectedUser
      );
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
