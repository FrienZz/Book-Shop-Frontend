import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthToken(): string {
    const token = localStorage.getItem('token');

    return token;
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
  }
}
