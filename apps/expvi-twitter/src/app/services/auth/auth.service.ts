import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../storage/local-storage.service';

interface LoginResponse {
  data: {
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.localStorageService.setToken(res.data.token)),
      map(() => {})
    );
  }

  logout(): void {
    this.localStorageService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.localStorageService.isLoggedIn();
  }
}
