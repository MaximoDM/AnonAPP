import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AppStorageService } from '../services/app-storage';
import { environment } from 'src/environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private appStorage: AppStorageService
  ) {}

  private getAuthHeaders$(): Observable<HttpHeaders> {
    return from(this.appStorage.get<string>('token')).pipe(
      map(token =>
        new HttpHeaders({
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        })
      )
    );
  }

  getProfile(alias: string): Observable<User> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/users/profile/${alias}`, { headers })
      ),
      map(data => User.fromApi ? User.fromApi(data) : new User(data))
    );
  }

  getCurrentUser(): Observable<User> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/users/profile`, { headers })
      ),
      map(data => User.fromApi ? User.fromApi(data) : new User(data))
    );
  }

  updateUser(data: Partial<User>): Observable<User> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/users/update`, data, { headers })
      ),
      map(resp => User.fromApi ? User.fromApi(resp) : new User(resp))
    );
  }

  updateAvatarBase64(avatarBase64: string): Observable<User> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.put<any>(
          `${this.apiUrl}/users/avatar`,
          { avatarBase64 },
          { headers }
        )
      ),
      map(resp => User.fromApi ? User.fromApi(resp) : new User(resp))
    );
  }

  getTopUsuarios(): Observable<User[]> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/users/top`, { headers })
      ),
      map(data =>
        data.map(u => (User.fromApi ? User.fromApi(u) : new User(u)))
      )
    );
  }

  searchUsuarios(query: string): Observable<User[]> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any[]>(
          `${this.apiUrl}/users/search?q=${encodeURIComponent(query)}`,
          { headers }
        )
      ),
      map(data =>
        data.map(u => (User.fromApi ? User.fromApi(u) : new User(u)))
      )
    );
  }
}
