import { Routes } from '@angular/router';
import { LoginComponent } from './Vistas/login/login';
import { VenderComponent } from './Vistas/vender/vender';
import { HistorialComponent } from './Vistas/historial/historial';
import { authGuard } from './Servicios/auth-guard';
import { GestionUsuarios } from './gestion-usuarios/gestion-usuarios';

export const routes: Routes = [
    // La ruta de login NUNCA debe tener canActivate
    { path: 'login', component: LoginComponent },

    // Estas SÍ deben estar protegidas
    {
      path: 'crearVendedor',
      component: GestionUsuarios,
      canActivate: [authGuard], // CORRECTO
      data: { roles: ['admin'] }
    },
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
      data: { roles: ['vendedor', 'admin'] }
    },

    // Las rutas de redirección NUNCA deben tener canActivate
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
