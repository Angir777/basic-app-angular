import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, map, of } from 'rxjs';
import { CredentialsService, Credentials } from '../../../core/services';
import {
  AuthenticatedUser,
  Register,
  PasswordReset,
  FinishPasswordReset,
  User,
} from '../../interfaces';

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiPrefix = 'auth';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);
  private readonly permissionsService = inject(NgxPermissionsService);

  // Log in to the application.
  login(context: LoginContext): Observable<Credentials> {
    const body = {
      email: context.email,
      password: context.password,
    };

    return this.http.post<AuthenticatedUser>(`${this.apiPrefix}/login`, body).pipe(
      map((res) => {
        const user = res;

        const credentials: Credentials = {
          id: user.id ?? '',
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          token: user.token ?? '',
          permissions: user.permissions ?? [],
          roles: user.roles ?? [],
          avatarUrl: user.avatarUrl,
          settings: user.settings ?? {},
        };

        this.credentialsService.setCredentials(credentials, context.remember);

        if (context.remember) {
          localStorage.setItem('REMEMBERED_EMAIL_APP', context.email);
        } else {
          localStorage.removeItem('REMEMBERED_EMAIL_APP');
        }

        this.setPermissions(credentials.permissions);

        return credentials;
      }),
    );
  }

  // Log out of the application.
  logOut(): Observable<boolean> {
    // Clear permissions.
    this.permissionsService.flushPermissions();

    // Clear credentials.
    this.credentialsService.setCredentials();

    // Redirect.
    this.router.navigate(['/login']);

    return of(true);
  }

  // Registration.
  register(data: Register): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${this.apiPrefix}/register`, data);
  }

  // Confirm account.
  confirmAccount(code: string) {
    return this.http.get(`${this.apiPrefix}/confirm-account/` + code, {
      observe: 'response',
    });
  }

  // Request a password reset.
  sendResetPasswordEmail(authenticationData: PasswordReset) {
    return this.http.post(`${this.apiPrefix}/send-reset-password-email/`, authenticationData, {
      observe: 'response',
    });
  }

  // Reset the password.
  finishPasswordReset(authenticationData: FinishPasswordReset) {
    return this.http.post(`${this.apiPrefix}/finish-password-reset/`, authenticationData, {
      observe: 'response',
    });
  }

  // Fetch the logged-in user's data.
  getCurrentUser(): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${this.apiPrefix}/current-user`, {
      observe: 'response',
    });
  }

  // Show administrator email addresses on the login page.
  getAdminsEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiPrefix}/admins-emails`);
  }

  // Set permissions.
  private setPermissions(permissions: string[]): void {
    this.permissionsService.flushPermissions();
    this.permissionsService.loadPermissions(permissions);
  }
}
