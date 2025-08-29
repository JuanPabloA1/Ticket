import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('loggedInUser');

  // 1. Si no hay token, no está logueado. Lo enviamos al login.
  if (!token || !userString) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtenemos los datos del usuario y los roles permitidos para esta ruta.
  const user = JSON.parse(userString);
  const allowedRoles = route.data['roles'] as Array<string>;

  // 3. Verificamos que el usuario TENGA una propiedad de rol y la convertimos a minúsculas.
  // Si user.role no existe, asignamos un string vacío para evitar errores.
  const userRole = user.role ? user.role.toLowerCase() : '';

  // Imprimimos en consola para depurar fácilmente si algo sigue fallando.
  console.log("Rol del usuario:", userRole);
  console.log("Roles permitidos:", allowedRoles);
  console.log(allowedRoles && !allowedRoles.includes(userRole));


  // 4. Si la ruta requiere roles y el rol del usuario (en minúsculas) no está en la lista...
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert('No tienes permiso para acceder a esta página.');
    // Lo redirigimos a una página segura (su página de inicio por defecto).
    router.navigate(['/vender']);
    return false;
  }

  // 4. Si todo está bien, le permitimos el acceso.
  return true;
};
