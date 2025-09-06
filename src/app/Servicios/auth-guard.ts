import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // 🔒 Solo acceder a localStorage si estamos en navegador
  if (!isPlatformBrowser(platformId)) {
    router.navigate(['/login']);
    return false;
  }

  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('loggedInUser');

  // 1. Si no hay token o usuario, no está logueado.
  if (!token || !userString) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtenemos los datos del usuario y los roles permitidos para esta ruta.
  let user: any;
  try {
    user = JSON.parse(userString);
  } catch (e) {
    console.error("Error al parsear loggedInUser:", e);
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as Array<string>;
  const userRole = user.role ? user.role.toLowerCase() : '';

  console.log("Rol del usuario:", userRole);
  console.log("Roles permitidos:", allowedRoles);

  // 3. Verificamos roles
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert('No tienes permiso para acceder a esta página.');
    router.navigate(['/vender']);
    return false;
  }

  // ✅ Todo bien
  return true;
};
