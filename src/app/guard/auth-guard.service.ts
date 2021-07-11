import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, } from "@angular/router";
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
// import { ServiceAuthService } from './service-auth.service';
import { LoginService } from './../auth/login/login.service'
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: LoginService, private authService: NbAuthService, private router: Router) {
  }
  canActivate(): boolean {
    // apakah user sudah login ?
    if (this.userService.isLoggedin()) {

      return true;

    } else {
      this.router.navigate(['/auth']);

      return false;
    }
  }
};