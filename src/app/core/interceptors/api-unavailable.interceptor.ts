import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

/**
 * Interceptor handling a missing API connection.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiUnavailableInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.errorHandler(error)));
  }

  private errorHandler(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    if (error.status <= 0) {
      // Notify that there is no API connection.
      console.error('NO_CONNECTION_TO_API');
    }
    throw error;
  }
}
