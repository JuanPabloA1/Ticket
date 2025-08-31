import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = environment.apiKey;

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PÚBLICOS (Sin Token) ---
  login(credentials: any): Observable<any> {
    console.log('Enviando credenciales al backend:', credentials);
    return this.http.post(`${this.API_URL}/auth/login`, credentials);
  }

  // --- MÉTODOS PRIVADOS (Requieren Token) ---
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    // --- ¡ESTE ES EL ÚNICO CAMBIO! ---
    // Ahora el formato es "Bearer <token>", que es el estándar profesional.
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getAuthHeaders2(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    // --- ¡ESTE ES EL ÚNICO CAMBIO! ---
    // Ahora el formato es "Bearer <token>", que es el estándar profesional.
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });
  }

  getNumbers(): Observable<any> {
    console.log('Pidiendo números al backend...');
    return this.http.get(`${this.API_URL}/numbers`, { headers: this.getAuthHeaders() });
  }

  createTicket(ticketData: any): Observable<any> {
    console.log('Enviando nueva boleta al backend:', ticketData);
    return this.http.post(`${this.API_URL}/tickets`, ticketData, { headers: this.getAuthHeaders() });
  }

  getHistory(): Observable<any> {
    console.log('Pidiendo historial al backend...');
    return this.http.get(`${this.API_URL}/history`, { headers: this.getAuthHeaders() });
  }

  printTicket(receiptData: any): Observable<any> {
    // La ruta ahora está unificada
    return this.http.post<Blob>(`${this.API_URL}/print/pdf`, receiptData, { headers:
    this.getAuthHeaders2(), responseType: 'blob' as 'json' });
  }
}
