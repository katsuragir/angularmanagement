import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse
  } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Injectable } from '@angular/core';
  import { tap } from 'rxjs/operators';
  
  
  @Injectable({
      providedIn: 'root'
    })
  
  export class InterceptService implements HttpInterceptor {
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const userToken = 'E3B79F1694617411596AC344B9A026CC';
      const cloneReq = req.clone({
        headers: req.headers.set('provider', `${userToken}`),
      });
      return next.handle(cloneReq).pipe(
          tap(
              event => {
                   if (event instanceof HttpResponse) {
                      // console.log('all looks good');
                      // http response status code
                      // console.log(event.status);
                  }
              },
              error => {
                  // http response status code
                  // console.log('----response----');
                  // console.error('status code:');
                  // tslint:disable-next-line:no-debugger
                  console.error(error.status);
                  console.error(error.message);
                  // console.log('--- end of response---');
              }
          )
      );
    }
}
  