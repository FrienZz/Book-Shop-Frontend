import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Category {
  _id: string;
  category_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ message: string; data: Category[] }> {
    return this.http.get<{ message: string; data: Category[] }>('http://localhost:3000/categories');
  }

  addCategory(data: Pick<Category, 'category_type'>): Observable<{ message: string; data: Category }> {
    return this.http.post<{ message: string; data: Category }>('http://localhost:3000/categories', data);
  }
}
