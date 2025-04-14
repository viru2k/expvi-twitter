import { LoginUserRequest } from './../../api/model/loginUserRequest';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '@store';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  readonly isLoading$ = this.authStore.isLoading$;
  readonly error$ = this.authStore.loginError$;

  onSubmit(): void {
    if (this.form.invalid) return;


    const loginUserRequest: LoginUserRequest = { email : this.form.value.email ?? '', password : this.form.value.password ?? '' };
    this.authStore.login({data: loginUserRequest});
  }
}
