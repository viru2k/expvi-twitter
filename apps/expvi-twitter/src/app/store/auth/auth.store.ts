import { RegisterUserRequest } from './../../api/model/registerUserRequest';
import { LoginUserRequest } from './../../api/model/loginUserRequest';
import { AuthService } from './../../api/api/auth.service';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { tap, switchMap, catchError, EMPTY } from 'rxjs';
import { LocalStorageService } from '../../services/storage/local-storage.service';

export interface AuthState {
  isLoading: boolean;
  loginError: string | null;
  token: string | null;
}

const DEFAULT_STATE: AuthState = {
  isLoading: false,
  loginError: null,
  token: null
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  private authService = inject(AuthService);
  private localStorage= inject(LocalStorageService);
  private router =inject(Router);
  constructor(
  ) {
    super(DEFAULT_STATE);
    const token = this.localStorage.getToken();
    if (token) {
      this.patchState({ token });
    }
  }

  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly loginError$ = this.select((s) => s.loginError);
  readonly token$ = this.select((s) => s.token);

  readonly setLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly setLoginError = this.updater((state, loginError: string | null) => ({
    ...state,
    loginError
  }));

  readonly setToken = this.updater((state, token: string) => ({
    ...state,
    token
  }));

  readonly clearAuthState = this.updater(() => ({
    isLoading: false,
    loginError: null,
    token: null
  }));

  readonly login = this.effect<{
    email: string;
    password: string;
    onSuccess?: () => void;
  }>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setLoginError(null);
      }),
      switchMap(({ email, password, onSuccess }) =>
        this.authService.loginUser({ email, password } as LoginUserRequest).pipe(
          tap((response) => {
            const token = response?.data?.token;
            if (token) {
              this.localStorage.setToken(token);
              this.setToken(token);
              onSuccess?.();
              this.router.navigate(['/tweets']);
            } else {
              this.setLoginError('Token no válido');
            }
          }),
          catchError(() => {
            this.setLoginError('Error al iniciar sesión');
            return EMPTY;
          }),
          tap(() => this.setLoading(false))
        )
      )
    )
  );

  readonly register = this.effect<{
    name: string;
    email: string;
    password: string;
    avatar_url?: string;
    onSuccess?: () => void;
  }>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setLoginError(null);
      }),
      switchMap(({ name, email, password, avatar_url, onSuccess }) =>
        this.authService
          .registerUser({ name, email, password, avatar_url } as RegisterUserRequest)
          .pipe(
            tap((response) => {
              const token = response?.data?.token;
              if (token) {
                this.localStorage.setToken(token);
                this.setToken(token);
                onSuccess?.();
                this.router.navigate(['/tweets']);
              } else {
                this.setLoginError('Token no válido');
              }
            }),
            catchError(() => {
              this.setLoginError('Error al registrar');
              return EMPTY;
            }),
            tap(() => this.setLoading(false))
          )
      )
    )
  );

  readonly logout = this.effect(() =>
    this.token$.pipe(
      tap(() => {
        this.localStorage.clearToken();
        this.clearAuthState();
        this.router.navigate(['/auth/login']);
      })
    )
  );
}
