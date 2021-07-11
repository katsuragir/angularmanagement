import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { AppLoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guard/auth-guard.service';

const routes: Routes = [
   // redirect base href to dashboard / home page
  {
    path: '', 
    redirectTo: '/pages/dashboard',
    pathMatch: 'full'
  },
  // ============
  // inisiasi pages module dan routing pages
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  // ===============
  // authetication website
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      // Scritp login custom
      {
        path: '',
        component: AppLoginComponent,
      },
      {
        path: 'login',
        canActivate: [AuthGuard], // file pengecekan authentication user akses ke page login
        component: AppLoginComponent,
      }
    ],
  },
  // ======= 
  // redirect semua path url yg tidak terinisiasi di routing ke path authentication
  { path: '**', redirectTo: 'auth' }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
