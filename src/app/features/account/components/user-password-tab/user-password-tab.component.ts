import { CommonModule } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardInputComponent } from '@/zardui/components/input';
import { Observable, finalize } from 'rxjs';
import {
  LoaderComponent,
  FormControlErrorsComponent,
  SaveButtonComponent,
  BaseUpdateComponent,
} from '../../../../shared/components';
import { FormHelper } from '../../../../shared/helpers';
import { AccountService, ToastService, TranslatedSwalService } from '../../../../shared/services';
import { ChangePassword } from '../../../../shared/interfaces/auth/change-password.interface';
import { UpdateComponent } from '../../../../shared/interfaces/form/update-component.interface';

@Component({
  selector: 'app-user-password-tab',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FontAwesomeModule,
    LoaderComponent,
    FormControlErrorsComponent,
    SaveButtonComponent,
    ZardInputComponent,
  ],
  templateUrl: './user-password-tab.component.html',
  styleUrl: './user-password-tab.component.scss',
})
export class UserPasswordTabComponent
  extends BaseUpdateComponent
  implements OnInit, UpdateComponent<ChangePassword>
{
  // DI
  private readonly fb = inject(UntypedFormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly toastService = inject(ToastService);
  private readonly translatedSwalService = inject(TranslatedSwalService);

  ngOnInit(): void {
    // Create the form
    this.createForm();
  }

  /**
   * Form
   */

  // Create the form
  createForm(): void {
    this.form = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [null, [Validators.required]],
    });
  }

  updateForm(): void {
    //
  }

  /**
   * Save
   */

  // Build the object to save from the form
  createDataToSaveFromForm(): ChangePassword {
    // Gets the whole form, including disabled fields
    const formValue = this.form.getRawValue();

    return {
      oldPassword: formValue.oldPassword,
      newPassword: formValue.newPassword,
      passwordConfirmation: formValue.passwordConfirmation,
    };
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

    this.subscribeToSaveResponse(this.accountService.changePassword(dataToSave));
  }

  // Handle the API response
  subscribeToSaveResponse(result: Observable<HttpResponse<unknown>>): void {
    this.isSaving.set(true);
    result
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        }),
      )
      .subscribe({
        next: () => this.onSaveSuccess(),
        error: (err: HttpErrorResponse) => this.onSaveError(err),
      });
  }

  // Called when the API returns OK
  onSaveSuccess(): void {
    this.translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});

    // Reset the form
    this.form.reset();
  }

  // Called when the API returns an error
  onSaveError(errorRes: HttpErrorResponse): void {
    if (errorRes.error != null && errorRes.error.errors != null) {
      this.serverErrors = errorRes.error.errors;
    }

    if (errorRes.error?.message === 'OLD_PASSWORD_INCORRECT') {
      this.translatedSwalService.show('error', 'account.message.error.oldPasswordIncorrect', {});
    } else {
      this.translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
    }
  }
}
