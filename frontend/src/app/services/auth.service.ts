import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorageService } from './app-storage';
import { environment } from 'src/environments/environment';  // importa el environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private appStorage: AppStorageService
  ) {}

  register(data: { email: string; alias: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  async saveToken(token: string): Promise<void> {
    await this.appStorage.set('token', token);
    await this.appStorage.set('isLoggedIn', 'true');
  }

  async getToken(): Promise<string | null> {
    return this.appStorage.get<string>('token');
  }

  async logout(): Promise<void> {
    await this.appStorage.clear();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.appStorage.get<string>('token');
    return !!token;
  }
}
