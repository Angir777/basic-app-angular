import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { ApiUnavailableInterceptor } from './api-unavailable.interceptor';
import { AuthorizedInterceptor } from './authorized.interceptor';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { LocaleInterceptor } from './locale.interceptor';
import { TokenInterceptor } from './token.interceptor';

/**
 * List of HTTP interceptors loaded in the application.
 */
export const httpInterceptorProviders = [
  // Interceptor adding the API prefix.
  { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },

  // Interceptor handling a missing API connection.
  { provide: HTTP_INTERCEPTORS, useClass: ApiUnavailableInterceptor, multi: true },

  // Interceptor adding the selected application language to API requests.
  { provide: HTTP_INTERCEPTORS, useClass: LocaleInterceptor, multi: true },

  // Interceptor adding the token to API requests sent by a logged-in user.
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  // Interceptor handling 401 errors for a logged-in user.
  { provide: HTTP_INTERCEPTORS, useClass: AuthorizedInterceptor, multi: true },

  // Interceptor handling request errors.
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
];
