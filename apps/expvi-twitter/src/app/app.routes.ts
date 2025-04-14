import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), },
  { path: 'twitter', loadChildren: () => import('./tweets/tweets.module').then(m => m.TweetsModule) },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];
