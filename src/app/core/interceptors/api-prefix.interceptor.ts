import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interceptor adding the API address to every request.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const noPrefixPaths = ['assets/'];

    if (
      !/^(http|https)/i.test(request.url) &&
      !noPrefixPaths.some((path) => request.url.startsWith(path))
    ) {
      const noPrefixEndpoints = ['test/test']; // Endpoints without the v1 prefix

      const shouldAddPrefix = !noPrefixEndpoints.some((e) => request.url.startsWith(e));

      const prefix = shouldAddPrefix ? 'v1/' : '';

      request = request.clone({
        url: environment.SERVER_URL + prefix + request.url,
      });
    }

    return next.handle(request);
  }
}
