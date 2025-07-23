// services/auth.service.ts - Updated with better token handling
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Change this to your API base URL
  private readonly API_URL = 'http://localhost:3000/api/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'gizicerdas_token';
  private userKey = 'gizicerdas_user';

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        console.log('Auth loaded from storage:', { token: !!token, user: user.name });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearStorage();
      }
    } else {
      console.log('No stored auth found');
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    console.log('Auth storage cleared');
  }

  private storeAuth(response: AuthResponse): void {
    console.log('Storing auth:', { token: !!response.token, user: response.user.name });
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData)
      );
      
      console.log('Register successful:', response.user.name);
      this.storeAuth(response);
      
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting login for:', loginData.email);
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData)
      );
      
      console.log('Login successful:', response.user.name);
      this.storeAuth(response);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token available');
      }

      console.log('Fetching profile with token:', token.substring(0, 20) + '...');
      
      const response = await firstValueFrom(
        this.http.get<User>(`${this.API_URL}/profile`, {
          headers: this.getAuthHeaders()
        })
      );
      
      // Update stored user data
      localStorage.setItem(this.userKey, JSON.stringify(response));
      this.currentUserSubject.next(response);
      
      return response;
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      // If unauthorized, clear storage and redirect to login
      if (error.status === 401 || error.status === 403) {
        console.log('Token invalid, clearing auth');
        this.logout();
      }
      
      throw error;
    }
  }

  async updateProfile(updateData: Partial<User>): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.put<User>(`${this.API_URL}/profile`, updateData, {
          headers: this.getAuthHeaders()
        })
      );
      
      // Update stored user data
      localStorage.setItem(this.userKey, JSON.stringify(response));
      this.currentUserSubject.next(response);
      
      return response;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put(`${this.API_URL}/change-password`, passwordData, {
          headers: this.getAuthHeaders()
        })
      );
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      const token = this.getToken();
      if (token) {
        console.log('Calling logout endpoint');
        await firstValueFrom(
          this.http.post(`${this.API_URL}/logout`, {}, {
            headers: this.getAuthHeaders()
          })
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      console.log('Performing local logout');
      this.clearStorage();
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      console.log('Token found:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in storage');
    }
    return token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuth = !!(token && user);
    console.log('Is authenticated:', isAuth, { hasToken: !!token, hasUser: !!user });
    return isAuth;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.log('Creating auth headers with token:', !!token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Method to get headers for HTTP requests
  getAuthHeadersForRequest(): { [key: string]: string } {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
    console.log('Auth headers for request:', { hasAuth: !!token });
    return headers;
  }

  // Method to handle token expiry
  handleTokenExpiry(): void {
    console.log('Token expired, clearing auth');
    this.clearStorage();
    this.router.navigate(['/login']);
  }

  // Method to check if user has valid session
  async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.log('No authentication data available');
      return false;
    }

    try {
      await this.getProfile();
      console.log('Session validation successful');
      return true;
    } catch (error: any) {
      console.log('Session validation failed:', error.status);
      if (error.status === 401 || error.status === 403) {
        this.handleTokenExpiry();
        return false;
      }
      return true; // Keep session for other errors
    }
  }

  // Debug method to check auth state
  debugAuthState(): void {
    console.log('=== AUTH DEBUG ===');
    console.log('Token:', this.getToken());
    console.log('User:', this.getCurrentUser());
    console.log('Is Authenticated:', this.isAuthenticated());
    console.log('================');
  }
}