import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Logger, CredentialsService } from '../services';

const log = new Logger('DAILO');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard {
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);

  /**
   * Guard checking access to protected routes.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isAuthenticated()) {
      return true;
    } else {
      log.debug('Not authenticated, redirecting and adding redirect url.');

      this.router.navigate(['/login'], {
        queryParams: { redirect: state.url },
        replaceUrl: true,
      });

      return false;
    }
  }
}
