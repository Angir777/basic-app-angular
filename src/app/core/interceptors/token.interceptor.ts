import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialsService } from '../services';

/**
 * Interceptor adding the token when the user is logged in.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly credentialsService = inject(CredentialsService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.credentialsService.getToken() != null) {
      req = req.clone({
        setHeaders: {
          Authorization: `${this.credentialsService.getAuthHeader()}`,
        },
      });
    }
    return next.handle(req);
  }
}
