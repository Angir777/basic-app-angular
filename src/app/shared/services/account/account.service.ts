import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserSettings } from '../../interfaces';
import { ChangePassword } from '../../interfaces/auth/change-password.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  protected resourceUrl = 'account';
  private readonly http = inject(HttpClient);

  // Update user data.
  updateDetailsUser(formData: FormData): Observable<HttpResponse<User>> {
    return this.http.put<User>(`${this.resourceUrl}/update-details-user`, formData, {
      observe: 'response',
    });
  }

  // Change password
  changePassword(context: ChangePassword): Observable<HttpResponse<User>> {
    const body = {
      oldPassword: context.oldPassword,
      newPassword: context.newPassword,
      passwordConfirmation: context.passwordConfirmation,
    };
    return this.http.patch<User>(`${this.resourceUrl}/change-password`, body, {
      observe: 'response',
    });
  }

  // Resend activation email
  resendConfirmationEmail(): Observable<HttpResponse<void>> {
    return this.http.post<void>(
      `${this.resourceUrl}/resend-confirmation-email`,
      {},
      {
        observe: 'response',
      },
    );
  }

  // Delete account
  deleteAccount(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl}/delete-account`, {
      observe: 'response',
    });
  }

  getUserSettings(): Observable<HttpResponse<UserSettings>> {
    return this.http.get<UserSettings>(`${this.resourceUrl}/get-user-settings`, {
      observe: 'response',
    });
  }

  updateUserSettings(data: Record<string, boolean>): Observable<HttpResponse<UserSettings>> {
    return this.http.patch<UserSettings>(`${this.resourceUrl}/update-user-settings`, data, {
      observe: 'response',
    });
  }
}
