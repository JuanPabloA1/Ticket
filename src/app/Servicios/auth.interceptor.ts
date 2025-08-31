// src/app/Servicios/auth.interceptor.ts
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // Obtenemos el token guardado durante el login
  const token = sessionStorage.getItem('authToken');

  // Si no hay token, dejamos pasar la petición sin modificarla (útil para el login mismo)
  if (!token) {
    return next(req);
  }

  // Si hay un token, clonamos la petición y le añadimos la cabecera de autorización
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  // Enviamos la nueva petición con el token incluido
  return next(authReq);
};
