import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
  NbLayoutModule,
  NbIconModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { AppLoginComponent } from './login/login.component'; // <---
import { InterceptService } from './interception.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    AppAuthRoutingModule,
    NbSpinnerModule,
    NbAuthModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          login: {
            redirect: {
              success: '/dashboard/',
              failure: null, // stay on the same page
            },
          },

          register: {
            redirect: {
              success: '/welcome/',
              failure: null, // stay on the same page
            },
          }
        }),
      ],
      forms: {},
    }),
  ],
  declarations: [
    // ... here goes our new components
    AppLoginComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
  ]
})
export class AppAuthModule {
}