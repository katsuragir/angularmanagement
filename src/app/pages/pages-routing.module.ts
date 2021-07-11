import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AddComponent } from './user-management/add/add.component';
import { DetailComponent } from './user-management/detail/detail.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard], // pengecekan authentication user login
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'users/list',
        component: UserManagementComponent
      },
      {
        path: 'users/add',
        component: AddComponent
      },
      {
        path: 'users/edit/:id',
        component: AddComponent
      },
      {
        path: 'users/detail/:id',
        component: DetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
