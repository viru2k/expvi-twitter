import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStore } from './../app/store/auth/auth.store';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe, NgIf } from '@angular/common';


@Component({
  imports: [ RouterModule, TranslateModule,ProgressSpinnerModule, AsyncPipe, NgIf ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public store = inject(AuthStore);

  title = 'expvi-posts';
}
