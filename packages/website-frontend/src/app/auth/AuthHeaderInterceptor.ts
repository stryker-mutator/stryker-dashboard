import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.currentBearerToken) {
      return next.handle(
        req.clone({
          headers: req.headers.append(
            'Authorization',
            `Bearer ${this.authService.currentBearerToken}`
          ),
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
