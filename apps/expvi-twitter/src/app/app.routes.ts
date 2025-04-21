import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ajusta la ruta según tu estructura
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { UserProfileComponent } from './posts/user-profile/user-profile.component';

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
    path: 'posts',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./posts/timeline/timeline.component').then((m) => m.TimelineComponent)
  },
  {
    path: 'posts/:id',
    canActivate: [AuthGuard],
    component: PostDetailsComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'user/:id',
    component: UserProfileComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tweets'
  },
  {
    path: '**',
    redirectTo: 'posts'
  }
];
