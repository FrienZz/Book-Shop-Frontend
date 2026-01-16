import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
}

interface RegisterRes {
  message: string;
}

interface LoginUser {
  email: string;
  password: string;
}

interface LoginRes {
  message: string;
  role_type: string;
  token: string;
}
interface User extends RegisterUser {
  _id: string;
  role_type: string;
  status: string;
}

interface UserResById {
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUsers(data: RegisterUser): Observable<RegisterRes> {
    return this.http.post<RegisterRes>('http://localhost:3000/users/register', data);
  }

  loginUsers(data: LoginUser): Observable<LoginRes> {
    return this.http.post<LoginRes>('http://localhost:3000/users/login', data);
  }

  getUserById(id: string): Observable<UserResById> {
    return this.http.get<UserResById>(`http://localhost:3000/users/${id}`);
  }

  getMyProfile(): Observable<UserResById> {
    return this.http.get<UserResById>('http://localhost:3000/users/me');
  }
}
