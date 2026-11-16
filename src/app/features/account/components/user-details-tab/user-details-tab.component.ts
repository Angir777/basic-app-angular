import { CommonModule } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCamera,
  faCircleCheck,
  faCircleExclamation,
  faEnvelope,
  faSave,
  faTrash,
  faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardInputComponent } from '@/zardui/components/input';
import { finalize, Observable } from 'rxjs';
import {
  LoaderComponent,
  FormControlErrorsComponent,
  SaveButtonComponent,
  BaseUpdateComponent,
} from '../../../../shared/components';
import { FormHelper } from '../../../../shared/helpers';
import { User } from '../../../../shared/interfaces';
import {
  ToastService,
  AuthenticationService,
  TranslatedSwalService,
  AccountService,
} from '../../../../shared/services';
import { Credentials, CredentialsService } from '../../../../core/services';
import { UpdateComponent } from '../../../../shared/interfaces/form/update-component.interface';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-details-tab',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FontAwesomeModule,
    LoaderComponent,
    FormControlErrorsComponent,
    SaveButtonComponent,
    ZardInputComponent,
    MatTooltipModule,
  ],
  templateUrl: './user-details-tab.component.html',
  styleUrl: './user-details-tab.component.scss',
})
export class UserDetailsTabComponent
  extends BaseUpdateComponent
  implements OnInit, UpdateComponent<User>
{
  // Icons
  protected readonly faCamera = faCamera;
  protected readonly faSave = faSave;
  protected readonly faTrash = faTrash;
  protected readonly faUserXmark = faUserXmark;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faCircleExclamation = faCircleExclamation;
  protected readonly faCircleCheck = faCircleCheck;

  // User
  user = signal<User | null>(null);

  // Avatar
  selectedAvatar = signal<File | null>(null);
  avatarPreview = signal<string | null>(null);
  removeAvatarRequested = signal(false);

  // Account deletion
  isDeletingAccount = signal(false);

  // Resend activation email
  isResendingConfirmation = signal(false);

  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // DI
  private readonly fb = inject(UntypedFormBuilder);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountService);
  private readonly credentialsService = inject(CredentialsService);
  private readonly toastService = inject(ToastService);
  private readonly translatedSwalService = inject(TranslatedSwalService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Create the form
    this.createForm();

    // Fetch the current user
    this.getCurrentUser();
  }

  /**
   * Form
   */

  // Create the form
  createForm(): void {
    this.form = this.fb.group({
      email: [
        { value: null, disabled: true },
        [Validators.required, Validators.email, Validators.maxLength(191)],
      ],
      firstName: [null, [Validators.required, Validators.maxLength(191)]],
      lastName: [null, [Validators.required, Validators.maxLength(191)]],
    });
  }

  // Update form fields
  updateForm(user: User): void {
    this.form.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    this.removeAvatarRequested.set(false);
    this.avatarPreview.set(user.avatarUrl);
  }

  // Fetch model data
  getCurrentUser(): void {
    this.isLoading.set(true);
    this.authenticationService
      .getCurrentUser()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res: HttpResponse<User>) => {
          if (res.body) {
            this.user.set(res.body);

            // Update the form
            this.updateForm(res.body);
          }
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  /**
   * Avatar
   */

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  isDragOver = false;

  onDropzoneClick(): void {
    if (this.isSaving()) {
      return;
    }

    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.isSaving()) {
      this.isDragOver = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (this.isSaving()) {
      return;
    }

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.handleAvatarFile(file);
    }
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.handleAvatarFile(file);
    }
  }

  private handleAvatarFile(file: File): void {
    this.clearServerErrors('avatar');

    if (!file.type.startsWith('image/')) {
      this.toastService.show('error', 'account.message.error.avatarMustBeImage');

      return;
    }

    this.removeAvatarRequested.set(false);
    this.selectedAvatar.set(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.avatarPreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.selectedAvatar.set(null);
    this.removeAvatarRequested.set(true);
    this.avatarPreview.set(null);
  }

  /**
   * Save
   */

  // Build the object to save from the form
  createDataToSaveFromForm(): FormData {
    const formValue = this.form.getRawValue();

    const formData = new FormData();

    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);

    if (this.selectedAvatar()) {
      formData.append('avatar', this.selectedAvatar()!);
    }

    formData.append('removeAvatar', this.removeAvatarRequested() ? 'true' : 'false');

    return formData;
  }

  // Call save
  onSubmit(): void {
    // Validation
    FormHelper.validateAllFormFields(this.form);
    if (!this.form.valid || this.isSaving()) {
      this.toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Object to save
    const dataToSave = this.createDataToSaveFromForm();

    this.subscribeToSaveResponse(this.accountService.updateDetailsUser(dataToSave));
  }

  // Handle the API response
  subscribeToSaveResponse(result: Observable<HttpResponse<User>>): void {
    this.isSaving.set(true);
    result
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        }),
      )
      .subscribe({
        next: (res: HttpResponse<User>) => this.onSaveSuccess(res),
        error: (err: HttpErrorResponse) => this.onSaveError(err),
      });
  }

  // Called when the API returns OK
  onSaveSuccess(res: HttpResponse<User>): void {
    if (!res.body) {
      return;
    }

    const user = res.body;

    // Refresh the avatar in the header
    const currentCredentials = this.credentialsService.credentials;

    if (currentCredentials) {
      const credentials: Credentials = {
        ...currentCredentials,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        avatarUrl: user.avatarUrl ?? null,
      };

      this.credentialsService.setCredentials(credentials);
    }

    // Refresh the form
    this.user.set(user);
    this.updateForm(user);
    this.selectedAvatar.set(null);

    this.translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});
  }

  // Called when the API returns an error
  onSaveError(errorRes: HttpErrorResponse): void {
    if (errorRes.error != null && errorRes.error.errors != null) {
      this.serverErrors = errorRes.error.errors;
    }

    this.translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
  }

  /**
   * Resend activation email
   */
  resendConfirmationEmail(): void {
    if (this.isResendingConfirmation() || this.isSaving()) {
      return;
    }

    this.isResendingConfirmation.set(true);

    this.accountService
      .resendConfirmationEmail()
      .pipe(
        finalize(() => {
          this.isResendingConfirmation.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.translatedSwalService.show(
            'success',
            'account.message.success.resendingConfirmationSuccessfully',
            {},
          );
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.error?.message === 'EMAIL_HAS_BEEN_SENT') {
            this.translatedSwalService.show(
              'warning',
              'account.message.warning.cantResendingConfirmationAgain',
              {},
            );
          } else if (errorRes.error?.message === 'EMAIL_ALREADY_CONFIRMED') {
            this.translatedSwalService.show(
              'info',
              'account.message.info.cantResendingConfirmationEmailConfirmed',
              {},
            );
          } else {
            this.translatedSwalService.show(
              'error',
              'account.message.error.cantResendingConfirmation',
              {},
            );
          }
        },
      });
  }

  /**
   * Delete account
   */

  async deleteAccount(): Promise<void> {
    if (this.isDeletingAccount() || this.isSaving()) {
      return;
    }

    const result = await this.translatedSwalService.showAsync(
      'account.message.question.areYouSureYouWantDeleteAccount',
      {},
      {
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonTextTranslation: 'main.global.yes',
        cancelButtonTextTranslation: 'main.global.no',

        // RedAlert
        iconColor: '#ffffff',
        background: '#e7000b',
        color: '#ffffff',
        customClass: {
          confirmButton: 'swal-delete-confirm',
          cancelButton: 'swal-delete-cancel',
        },
      },
    );

    if (result.value) {
      this.isDeletingAccount.set(true);

      this.accountService
        .deleteAccount()
        .pipe(
          finalize(() => {
            this.isDeletingAccount.set(false);
          }),
        )
        .subscribe({
          next: () => {
            this.translatedSwalService.show(
              'success',
              'account.message.success.deletedSuccessfully',
              {},
            );

            // Log out of the application.
            this.authenticationService.logOut();
            // Redirect to the login page.
            this.router.navigate(['/login']);
          },
          error: (errorRes: HttpErrorResponse) => {
            if (errorRes.error?.message === 'SUPER_ADMIN_CANT_DELETE_ACCOUNT') {
              this.translatedSwalService.show(
                'error',
                'account.message.error.superAdminCantDeleteAccount',
                {},
              );
            } else {
              this.translatedSwalService.show('error', 'account.message.error.cantDeleted', {});
            }
          },
        });
    }
  }
}
