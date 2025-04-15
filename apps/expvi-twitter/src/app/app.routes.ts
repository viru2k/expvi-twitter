import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ajusta la ruta según tu estructura

export const appRoutes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then((m) => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'tweets',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./tweets/timeline/timeline.component').then((m) => m.TimelineComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tweets'
  },
  {
    path: '**',
    redirectTo: 'tweets'
  }
];
