import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { Message } from '../models/message.model';
import { AppStorageService } from './app-storage';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private appStorage: AppStorageService
  ) {}

  private getAuthHeaders$(): Observable<HttpHeaders> {
    return from(this.appStorage.get<string>('token')).pipe(
      map(token =>
        new HttpHeaders({
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        })
      )
    );
  }

  getAll(): Observable<Message[]> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/messages`, { headers })
      ),
      map(list => list.map(Message.fromApi))
    );
  }

  getAllForUser(alias: string): Observable<Message[]> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any[]>(
          `${this.apiUrl}/messages/${alias}/messages`,
          { headers }
        )
      ),
      map(list => list.map(Message.fromApi))
    );
  }

  getPending(): Observable<Message[]> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.get<any[]>(
          `${this.apiUrl}/messages?status=pending`,
          { headers }
        )
      ),
      tap(list => console.log('GET /messages?status=pending →', list)),
      map(list => list.map(Message.fromApi))
    );
  }

  sendMessage(targetAlias: string, text: string, anonymous = false): Observable<any> {
    const body = { body: text, anonymous };

    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.post(
          `${this.apiUrl}/profile/${targetAlias}/messages`,
          body,
          { headers }
        )
      )
    );
  }

  replyTo(id: number, replyText: string): Observable<any> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.put(
          `${this.apiUrl}/messages/${id}/reply`,
          { body: replyText },
          { headers }
        )
      )
    );
  }

  reject(id: number): Observable<any> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.delete(
          `${this.apiUrl}/messages/${id}/reject`,
          { headers }
        )
      )
    );
  }

  delete(id: number): Observable<any> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.delete(
          `${this.apiUrl}/messages/${id}/delete`,
          { headers }
        )
      )
    );
  }

  vote(id: number, type: 'like' | 'dislike'): Observable<any> {
    return this.getAuthHeaders$().pipe(
      switchMap(headers =>
        this.http.post(
          `${this.apiUrl}/messages/${id}/vote`,
          { type },
          { headers }
        )
      )
    );
  }
}
