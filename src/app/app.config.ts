import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {
  provideRouter,
  withRouterConfig,
  withInMemoryScrolling,
  withViewTransitions,
  withHashLocation,
} from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { routes } from './app.routes';
import { MultiTranslateHttpLoaderHelper } from './shared/helpers';
import { httpInterceptorProviders } from './core/interceptors';
import { CustomPaginatorIntlHelper } from './shared/helpers/custom-paginator-intl-helper';
import { provideMarkdown } from 'ngx-markdown';
import { provideZard } from '@/zardui/core/provider/providezard';

// Translations Providers
const getTranslateServiceProvider = () => {
  const httpLoaderFactory = (backend: HttpBackend): MultiTranslateHttpLoaderHelper => {
    const appVersion = '{{APP_VERSION_TO_REPLACE}}';
    const http = new HttpClient(backend);

    // Translation file names
    const translationsFilesNames = [
      'auth',
      'error',
      'layout',
      'main',
      'nav',
      'role',
      'user',
      'account',
    ];

    return new MultiTranslateHttpLoaderHelper(http, translationsFilesNames, appVersion);
  };

  return provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpBackend],
    },
  });
};

// HTTP Client Providers
const httpProviders = [
  provideHttpClient(withInterceptorsFromDi()),
  httpInterceptorProviders,
];

// Router Providers
const routerProviders = provideRouter(
  routes,
  withRouterConfig({
    onSameUrlNavigation: 'reload',
  }),
  withInMemoryScrolling({
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
  }),
  withViewTransitions(),
  withHashLocation(),
);

export const appConfig: ApplicationConfig = {
  providers: [
    ...httpProviders,
    routerProviders,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
    getTranslateServiceProvider(),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlHelper },
    provideMarkdown(),
    provideZard(),
  ],
};
