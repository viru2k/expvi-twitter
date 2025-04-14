import { RegisterUserRequest } from './../../api/model/registerUserRequest';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../store/auth/auth.store';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    avatar_url: ['']
  });

  readonly isLoading$ = this.authStore.isLoading$;
  readonly error$ = this.authStore.loginError$;

  onSubmit(): void {
    if (this.form.invalid) return;
    const registerUserRequest: RegisterUserRequest =  {    name: this.form.value.name ?? '',
      avatar_url: this.form.value.avatar_url ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? ''};

    this.authStore.register({data:registerUserRequest});
  }
}
