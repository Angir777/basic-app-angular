import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Credentials {
  id: number | string | null;
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  roles: string[];
  token: string;
  avatarUrl: string | null;
  settings: Record<string, boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private readonly tokenType = 'Bearer';
  private readonly credentialsKey = 'CREDENTIALS-APP-' + environment.APP_STORAGE_PREFIX;

  private readonly _credentials = signal<Credentials | null>(null);

  constructor() {
    const savedCredentials =
      sessionStorage.getItem(this.credentialsKey) || localStorage.getItem(this.credentialsKey);
    if (savedCredentials) {
      this._credentials.set(JSON.parse(savedCredentials));
    }
  }

  get credentials(): Credentials | null {
    return this._credentials();
  }

  get credentialsSignal() {
    return this._credentials.asReadonly();
  }

  getUserId(): number | string | null {
    return this._credentials()?.id ?? null;
  }

  getToken() {
    return this._credentials()?.token ?? null;
  }

  getAuthHeader() {
    const credentials = this._credentials();

    if (credentials != null) {
      return `${this.tokenType} ${credentials.token}`;
    }

    return null;
  }

  getPermissions() {
    return this._credentials()?.permissions ?? [];
  }

  getRoles() {
    return this._credentials()?.roles ?? [];
  }

  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials.set(credentials || null);

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(this.credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(this.credentialsKey);
      localStorage.removeItem(this.credentialsKey);
    }
  }

  checkUserPermission(permissionName: string): boolean {
    return this._credentials()?.permissions?.includes(permissionName) ?? false;
  }

  checkUserRole(roleName: string): boolean {
    return this._credentials()?.roles?.includes(roleName) ?? false;
  }

  isAuthenticated(): boolean {
    return !!this._credentials();
  }
}
