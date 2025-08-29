import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Para poder hacer llamadas a la API
import { FormsModule } from '@angular/forms'; // Para usar ngModel en los formularios
import { authInterceptor } from './Servicios/auth.interceptor'; // Importa el interceptor

import { routes } from './app.routes'; // <-- 1. Importamos nuestras rutas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Le dice a Angular que use tus rutas
    provideHttpClient(),    // Habilita el uso de HttpClient para tu ApiService
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
