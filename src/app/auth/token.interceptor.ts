import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tokenGetter } from './auth.service';

@Injectable()
export class TokenInterceptor implements TokenInterceptor {

  constructor() {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `${tokenGetter()}`
      }
    });
    return next.handle(request);
  }
}
