import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Publisher {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  constructor(private http: HttpClient) {}

  getPublishers(): Observable<{ message: string; data: Publisher[] }> {
    return this.http.get<{ message: string; data: Publisher[] }>('http://localhost:3000/publishers');
  }

  addPublisher(data: Pick<Publisher, 'name'>): Observable<{ message: string; data: Publisher }> {
    return this.http.post<{ message: string; data: Publisher }>('http://localhost:3000/publishers', data);
  }
}
