import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getProfile(alias: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/profile/${alias}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(data => User.fromApi ? User.fromApi(data) : data));
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(data => User.fromApi ? User.fromApi(data) : data));
  }

  updateUser(data: Partial<User>): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/update`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(data => User.fromApi ? User.fromApi(data) : data));
  }


  updateAvatar(formData: FormData): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/users/avatar`, formData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(data => User.fromApi ? User.fromApi(data) : data));
  }
}
