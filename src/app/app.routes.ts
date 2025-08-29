import { Routes } from '@angular/router';
import { LoginComponent } from './Vistas/login/login';
import { VenderComponent } from './Vistas/vender/vender';
import { HistorialComponent } from './Vistas/historial/historial';
import { authGuard } from './Servicios/auth-guard';

export const routes: Routes = [
    // La ruta de login NUNCA debe tener canActivate
    { path: 'login', component: LoginComponent },

    // Estas SÍ deben estar protegidas
    {
      path: 'vender',
      component: VenderComponent,
      canActivate: [authGuard], // CORRECTO
      data: { roles: ['vendedor', 'admin'] }
    },
    {
      path: 'historial',
      component: HistorialComponent,
      canActivate: [authGuard], // CORRECTO
      data: { roles: ['vendedor', 'administrador'] }
    },

    // Las rutas de redirección NUNCA deben tener canActivate
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
