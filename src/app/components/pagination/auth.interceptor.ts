// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const blogData = localStorage.getItem('BlogData');
  
  if (blogData) {
    const parsedData = JSON.parse(blogData);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${parsedData.token}`
      }
    });
  }
  
  return next(req);
};