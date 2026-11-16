import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { filter, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZardSonnerComponent } from '@/zardui/components/sonner';
import { Logger, I18nService, CredentialsService } from './core/services';
import { DemoBannerComponent } from './shared/components';
import { ThemeService } from './shared/services';

// Logger prefix
const log = new Logger('DAILO');

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DemoBannerComponent, ZardSonnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected readonly appVersion = signal(environment.PRODUCTION);
  protected showTestBanner = signal(false); // TODO: Set to true when the work is finished.

  private subs = new Subscription();

  // DI
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly translateService = inject(TranslateService);
  private readonly i18nService = inject(I18nService);
  private readonly permissionService = inject(NgxPermissionsService);
  private readonly credentialsService = inject(CredentialsService);

  // Toast theme
  protected readonly theme = toSignal(inject(ThemeService).theme$, {
    initialValue: 'light' as const,
  });

  ngOnInit() {
    // Logger setup
    if (environment.PRODUCTION) {
      Logger.enableProductionMode();
      this.showTestBanner.set(false);
    }

    log.debug('Init app..');

    // Permissions settings
    this.setPermissions();

    // Translation settings
    this.i18nService.init(environment.DEFAULT_LANGUAGE, environment.LANGUAGES_AVAILABLE);

    // ROUTE CHANGE
    this.subs.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.updateTitle()),
    );

    // LANGUAGE CHANGE
    this.subs.add(
      this.translateService.onLangChange.subscribe(() => {
        this.updateTitle();
      }),
    );

    // initial title
    this.updateTitle();
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }

  // Change language
  private updateTitle() {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data;

    const envPrefix = this.appVersion() ? '' : 'DEMO - ';

    const pageTitle = this.translateService.instant('main.appName');

    let subPageTitle = '';

    if (data?.['breadcrumb']) {
      subPageTitle = this.translateService.instant(data['breadcrumb']);
    }

    const finalTitle = subPageTitle
      ? `${envPrefix}${pageTitle} - ${subPageTitle}`
      : `${envPrefix}${pageTitle}`;

    this.titleService.setTitle(finalTitle);
  }

  // Setting permissions
  private setPermissions() {
    this.permissionService.flushPermissions();
    if (this.credentialsService.isAuthenticated()) {
      this.permissionService.loadPermissions(this.credentialsService.getPermissions());
      log.debug('User is logged. Permissions reloaded.');
    } else {
      log.debug('User is not logged. Permissions no reloaded.');
    }
  }

  // Closing the banner demo
  onBannerClosed() {
    this.showTestBanner.set(false);
  }
}
