import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Book {
  title: string;
  author: string;
  description: string;
  img_url: string;
  price_per_day: number;
  total_copies: number;
  publisher: { _id: string; name: string };
  categories: { _id: string; category_type: string }[];
}

export interface BookInput {
  title: string;
  author: string;
  description: string;
  img_url: string;
  price_per_day: number;
  total_copies: number;
  publisherId: string;
  categories: string[];
}

interface BookRes {
  message: string;
  data: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<BookRes> {
    return this.http.get<BookRes>('http://localhost:3000/books');
  }

  getBook(id: string): Observable<{ message: string; data: Book }> {
    return this.http.get<{ message: string; data: Book }>(`http://localhost:3000/books/${id}`);
  }

  addBook(data: BookInput): Observable<BookRes> {
    return this.http.post<BookRes>('http://localhost:3000/books', data);
  }
}
