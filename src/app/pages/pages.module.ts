import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '../theme/theme.module';
import { NbButtonModule, NbCardModule, NbIconModule, NbMenuModule, NbSpinnerModule, NbDialogModule, NbDatepickerModule } from '@nebular/theme';
import { MenuAppComponent } from './menu-app/menu-app.component';
import { NgbdSortableHeader, UserManagementComponent } from './user-management/user-management.component';
import { AddComponent } from './user-management/add/add.component';
import { DetailComponent } from './user-management/detail/detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    MenuAppComponent,
    UserManagementComponent,
    AddComponent,
    DetailComponent,
    NgbdSortableHeader,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    NbDatepickerModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    NotificationComponent
  ]
})
export class PagesModule { }
