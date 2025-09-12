// admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userString = sessionStorage.getItem('loggedInUser');
  const user = userString ? JSON.parse(userString) : null;

  if (user?.role === 'Admin') {
    return true;
  }

  router.navigate(['/']); // redirige al home o login
  return false;
};
