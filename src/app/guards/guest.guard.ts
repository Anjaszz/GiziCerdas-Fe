// guards/guest.guard.ts - For login/register pages (redirect if already authenticated)
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};
