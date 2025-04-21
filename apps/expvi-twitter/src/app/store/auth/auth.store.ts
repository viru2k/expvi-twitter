import { RegisterUserRequest } from './../../api/model/registerUserRequest';
import { LoginUserRequest } from './../../api/model/loginUserRequest';
import { Store } from '@ngrx/store';
import { linkToGlobalState } from './../component-state.reducer';
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
  constructor( private globalStore: Store
  ) {
       super(DEFAULT_STATE);
       linkToGlobalState(this.state$, 'AuthStore', this.globalStore);
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
    data: LoginUserRequest
    onSuccess?: () => void;
  }>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setLoginError(null);
      }),
      switchMap((loginUserRequest) =>
        this.authService.loginUser(loginUserRequest.data).pipe(
          tap((response) => {
            const token = response?.data?.token;
            if (token) {
              this.localStorage.setToken(token);
              this.setToken(token);
              this.router.navigate(['/tweets']);
            } else {
              this.setLoginError('Invalid Token');
            }
          }),
          catchError(() => {
            this.setLoginError('Error at login');
            return EMPTY;
          }),
          tap(() => this.setLoading(false))
        )
      )
    )
  );

  readonly register = this.effect<{
    data: RegisterUserRequest
  }>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setLoginError(null);
      }),
      switchMap((registerUserRequest) =>
        this.authService
          .registerUser(registerUserRequest.data)
          .pipe(
            tap((response) => {
              const token = response?.data?.token;
              if (token) {
                this.localStorage.setToken(token);
                this.setToken(token);
                this.router.navigate(['/tweets']);
              } else {
                this.setLoginError('Invalid Token');
              }
            }),
            catchError(() => {
              this.setLoginError('Error at register');
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
