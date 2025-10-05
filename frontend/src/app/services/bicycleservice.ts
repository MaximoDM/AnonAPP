import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class Bicycleservice {
  
  endpoint = 'http://localhost:8080/api/bicycles';
  constructor(private http: HttpClient) { }

  getBicycles() {
    return this.http.get(this.endpoint);
  }
}
