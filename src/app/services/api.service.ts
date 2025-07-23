import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Generic GET method
  get<T>(endpoint: string, params?: { [key: string]: any }): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  // Generic POST method
  post<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // Generic PUT method
  put<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // Generic PATCH method
  patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // Generic DELETE method
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  // File upload method
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData);
  }

  // Async versions using firstValueFrom
  async getAsync<T>(endpoint: string, params?: { [key: string]: any }): Promise<T> {
    return firstValueFrom(this.get<T>(endpoint, params));
  }

  async postAsync<T>(endpoint: string, data?: any): Promise<T> {
    return firstValueFrom(this.post<T>(endpoint, data));
  }

  async putAsync<T>(endpoint: string, data?: any): Promise<T> {
    return firstValueFrom(this.put<T>(endpoint, data));
  }

  async patchAsync<T>(endpoint: string, data?: any): Promise<T> {
    return firstValueFrom(this.patch<T>(endpoint, data));
  }

  async deleteAsync<T>(endpoint: string): Promise<T> {
    return firstValueFrom(this.delete<T>(endpoint));
  }

  async uploadAsync<T>(endpoint: string, formData: FormData): Promise<T> {
    return firstValueFrom(this.upload<T>(endpoint, formData));
  }

  // Helper method to build full URL
  getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}