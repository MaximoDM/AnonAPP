import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  getAll(): Observable<Message[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`, {
      headers: this.getAuthHeaders(),
    }).pipe(map(list => list.map(Message.fromApi)));
  }

  getAllForUser(alias: string): Observable<Message[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/${alias}/messages`, {
      headers: this.getAuthHeaders(),
    }).pipe(map(list => list.map(Message.fromApi)));
  }

  getPending(): Observable<Message[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages?status=pending`, {
      headers: this.getAuthHeaders(),
    }).pipe(map(list => list.map(Message.fromApi)));
  }

  sendMessage(targetAlias: string, text: string, anonymous = false): Observable<any> {
    const body = { body: text, anonymous };
    return this.http.post(`${this.apiUrl}/profile/${targetAlias}/messages`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  replyTo(id: number, replyText: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/messages/${id}/reply`, { body: replyText }, {
      headers: this.getAuthHeaders(),
    });
  }

  reject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${id}/reject`, {
      headers: this.getAuthHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${id}/delete`, {
      headers: this.getAuthHeaders(),
    });
  }

  vote(id: number, type: 'like' | 'dislike'): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages/${id}/vote`, { type }, {
      headers: this.getAuthHeaders(),
    });
  }
}
