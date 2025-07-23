import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth for login and register endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  
  if (isAuthEndpoint) {
    console.log('Skipping auth for:', req.url);
    return next(req);
  }

  // Get token from AuthService
  const token = authService.getToken();
  
  console.log('Interceptor - URL:', req.url);
  console.log('Interceptor - Has token:', !!token);
  
  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor - Added auth header');
  } else {
    console.warn('Interceptor - No token available for:', req.url);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: req.url,
        error: error.error
      });

      // If 401 Unauthorized, handle token expiry
      if (error.status === 401 || error.status === 403) {
        console.log('Unauthorized access, clearing auth');
        authService.handleTokenExpiry();
      }
      
      return throwError(() => error);
    })
  );
};