import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ url: string }> {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>('http://localhost:3000/upload', formData);
  }
}
