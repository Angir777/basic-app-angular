import { importProvidersFrom, type EnvironmentProviders, type Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';

/**
 * Providers shared by all unit tests (`angular.json` → `test.options.providersFile`).
 * Individual specs add only what is specific to the component under test.
 */
const testProviders: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  provideTranslateService(),
  importProvidersFrom(NgxPermissionsModule.forRoot()),
];

export default testProviders;
