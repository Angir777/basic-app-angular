import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import {
  BaseUpdateComponent,
  LoaderComponent,
  SaveButtonComponent,
} from '../../../../shared/components';
import { UpdateComponent } from '../../../../shared/interfaces/form/update-component.interface';
import { AccountService, ToastService, TranslatedSwalService } from '../../../../shared/services';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UserSettings } from '../../../../shared/interfaces';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CredentialsService } from '../../../../core/services';

@Component({
  selector: 'app-user-settings-tab',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    LoaderComponent,
    UiSwitchModule,
    SaveButtonComponent,
  ],
  templateUrl: './user-settings-tab.component.html',
  styleUrl: './user-settings-tab.component.scss',
})
export class UserSettingsTabComponent
  extends BaseUpdateComponent
  implements OnInit, UpdateComponent<UserSettings>
{
  // DI
  private readonly fb = inject(UntypedFormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly toastService = inject(ToastService);
  private readonly translatedSwalService = inject(TranslatedSwalService);
  private readonly credentialsService = inject(CredentialsService);

  // Settings returned by the API
  protected settings: UserSettings = {};

  ngOnInit(): void {
    // Create the form
    this.createForm();

    // Fetch the logged-in user's settings
    this.getUserSettings();
  }

  /**
   * Fetch user settings
   */
  getUserSettings(): void {
    this.isLoading.set(true);

    this.accountService
      .getUserSettings()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response: HttpResponse<UserSettings>) => {
          if (response.body) {
            const settings = response.body;

            // Update the form
            this.updateForm(settings);

            // Update settings in credentials
            const currentCredentials = this.credentialsService.credentials;
            
            if (currentCredentials) {
              const credentials = {
                ...currentCredentials,
                settings: Object.fromEntries(
                  Object.values(settings).map((setting) => [
                    setting.name,
                    setting.value,
                  ]),
                ),
              };

              this.credentialsService.setCredentials(credentials);
            }
          }
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  // List of setting names
  protected get settingNames(): string[] {
    return Object.keys(this.settings);
  }

  /**
   * Form
   */

  // Create the form
  createForm(): void {
    this.form = this.fb.group({});
  }

  // Update the form
  updateForm(data: UserSettings): void {
    this.settings = data;

    Object.values(data).forEach((setting) => {
      if (!this.form.contains(setting.name)) {
        this.form.addControl(setting.name, this.fb.control(setting.value));
      } else {
        this.form.get(setting.name)?.setValue(setting.value);
      }
    });
  }

  /**
   * Save
   */

  // Build the object to save from the form
  createDataToSaveFromForm(): Record<string, boolean> {
    return this.form.getRawValue();
  }

  // Call save
  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    const dataToSave = this.createDataToSaveFromForm();

    this.subscribeToSaveResponse(this.accountService.updateUserSettings(dataToSave));
  }

  // Handle the API response
  subscribeToSaveResponse(result: Observable<HttpResponse<UserSettings>>): void {
    this.isSaving.set(true);

    result
      .pipe(
        finalize(() => {
          this.isSaving.set(false);

          // Refresh the displayed permissions
          this.getUserSettings();
        }),
      )
      .subscribe({
        next: (response: HttpResponse<UserSettings>) => {
          if (response.body) {
            this.updateForm(response.body);
          }

          this.onSaveSuccess();
        },
        error: (errorRes: HttpErrorResponse) => {
          this.onSaveError(errorRes);
        },
      });
  }

  // Called when the API returns OK
  onSaveSuccess(): void {
    this.translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});
  }

  // Called when the API returns an error
  onSaveError(errorRes: HttpErrorResponse): void {
    if (errorRes.error != null && errorRes.error.errors != null) {
      this.serverErrors = errorRes.error.errors;
    }

    this.translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
  }
}
