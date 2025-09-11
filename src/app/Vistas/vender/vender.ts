import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../Servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la estructura para cada número
interface NumberDetail {
  number: string;
  totalPlayed: number;
  isAvailable: boolean;
}

// Define la estructura para una jugada
interface Play {
  number: string;
  amount: number;
}

// Define la estructura para una boleta
interface Ticket {
  customerName: string;
  plays: Play[];
  total: number;
}

@Component({
  selector: 'app-vender',
  standalone: true,
  // ¡Añade esta línea de imports!
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './vender.html', // Pronto corregiremos esto también
  styleUrls: ['./vender.css'],
})
export class VenderComponent implements OnInit {
  readonly MAX_AMOUNT_PER_NUMBER = 10000;
  public numberAvailability: { number: string; availableAmount: number }[] = [];
  public newTicket: Ticket = { customerName: '', plays: [], total: 0 };
  public currentPlay: Play = { number: '', amount: 0 };
  private API_URL = 'http://localhost:3000/api';
  public currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchNumbers();
    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    }
  }

  fetchNumbers(): void {
    this.apiService.getNumbers().subscribe({
      next: (data) => {
        this.numberAvailability = data;
      },
      error: (err) => {
        console.error('Error al obtener números:', err);
        Swal.fire(
          'Error de Conexión',
          'No se pudieron cargar los datos de los números.',
          'error'
        );
      },
    });
  }

  addPlay(): void {
    if (
      !this.currentPlay.number ||
      !this.currentPlay.amount ||
      this.currentPlay.amount <= 0
    )
      return;

    const formattedNumber = this.currentPlay.number.toString().padStart(2, '0');
    const numberState = this.numberAvailability.find(
      (n) => n.number === formattedNumber
    );
    const playsOnThisTicket = this.newTicket.plays
      .filter((p) => p.number === formattedNumber)
      .reduce((sum, p) => sum + p.amount, 0);

    if (!numberState) {
      Swal.fire('Error', `El número ${formattedNumber} no es válido.`, 'error');
      return;
    }

    const potentialAmount = playsOnThisTicket + this.currentPlay.amount;
    if (potentialAmount > numberState.availableAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Monto Excedido',
        text: `No se puede agregar. El monto disponible para el número ${formattedNumber} es ${numberState.availableAmount}.`,
      });
      return;
    }

    this.newTicket.plays.push({ ...this.currentPlay, number: formattedNumber });
    this.currentPlay = { number: '', amount: 0 };
  }

  removePlay(index: number): void {
    this.newTicket.plays.splice(index, 1);
  }

  getTotal(): number {
    return this.newTicket.plays.reduce((total, play) => total + play.amount, 0);
  }

  printTicketPDF(receiptData: any): Observable<Blob> {
    return this.http.post(`${this.API_URL}/print/pdf`, receiptData, {
      responseType: 'blob', // Importante para recibir el archivo binario
    });
  }

  submitTicket(): void {
    const ticketData = {
      customerName: this.newTicket.customerName,
      plays: this.newTicket.plays,
      total: this.getTotal(),
    };

    this.apiService
      .createTicket(ticketData)
      .pipe(
        // 1. switchMap recibe la respuesta de createTicket (savedTicketResponse)
        switchMap((savedTicketResponse) => {
          console.log('Venta guardada:', savedTicketResponse);
          // 2. Y devuelve el siguiente observable que quieres ejecutar
          return this.apiService.printTicket(ticketData);
        })
        // 3. La suscripción se hace al final de toda la cadena
      )
      .subscribe({
        // El 'next' aquí recibirá el valor emitido por printTicket (el pdfBlob)
        next: (pdfBlob) => {
          console.log('Blob del PDF recibido:', pdfBlob); // Este console.log ahora debería funcionar

          // Crear URL para el Blob
          const url = window.URL.createObjectURL(pdfBlob);

          // Abrir el PDF en una nueva ventana
          const pdfWindow = window.open(url);

          // Esperar a que cargue y lanzar impresión
          if (pdfWindow) {
            pdfWindow.onload = () => {
              pdfWindow.focus();
              pdfWindow.print();
            };
          }

          Swal.fire(
            '¡Éxito!',
            'La boleta ha sido vendida y se abrió para imprimir.',
            'success'
          );

          this.resetForm();
        },
        // El 'error' aquí manejará cualquier error en la cadena (de createTicket o printTicket)
        error: (err) => {
          console.error('Error en el proceso:', err);
          if (err.error && err.error.message) {
            Swal.fire('Error', err.error.message, 'error');
          } else {
            Swal.fire(
              'Error',
              'No se pudo crear la venta o generar el PDF.',
              'error'
            );
          }
        },
      });
  }

  resetForm(): void {
    this.newTicket = { customerName: '', plays: [], total: 0 };
    this.fetchNumbers(); // Recargamos la disponibilidad de los números
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
