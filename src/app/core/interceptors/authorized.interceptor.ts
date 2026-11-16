import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { CredentialsService } from '../services';
import { ServerErrors } from '../types';
import { AuthenticationService } from '../../shared/services';

/**
 * Interceptor handling 401 errors for a logged-in user.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizedInterceptor implements HttpInterceptor {
  private readonly credentialsService = inject(CredentialsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If the user is not logged in, pass the request through.
    if (!this.credentialsService.isAuthenticated()) {
      return next.handle(request);
    }
    // If the user is logged in and the request returns a 401 error.
    return next.handle(request).pipe(
      catchError((error: ServerErrors) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Log out of the application.
            this.authenticationService.logOut();
            // Redirect to the login page.
            this.router.navigate(['/login']);
          }
        }
        throw error;
      }),
    );
  }
}
