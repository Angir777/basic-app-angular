import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Interceptor adding the selected application language to API requests.
 */
@Injectable()
export class LocaleInterceptor implements HttpInterceptor {
  private readonly translateService = inject(TranslateService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const locale = this.translateService.getCurrentLang() || 'pl';

    const clonedRequest = req.clone({
      setHeaders: {
        Locale: locale,
      },
    });

    return next.handle(clonedRequest);
  }
}
