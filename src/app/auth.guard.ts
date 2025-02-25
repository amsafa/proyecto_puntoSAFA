import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth_token'); // Usa sessionStorage o localStorage según prefieras

  if (token) {
    return true; // Permitir acceso
  } else {
    router.navigate(['/login']); // Redirigir al login si no hay token
    return false;
  }
};
