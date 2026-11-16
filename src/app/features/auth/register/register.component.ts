import { Component, inject, signal } from '@angular/core';
import { BaseUpdateComponent } from '../../../shared/components/base-components/base-update.component';
import { faSpinner, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControlErrorsComponent } from '../../../shared/components/form-control-errors/form-control-errors.component';
import { parseHttpError } from '../../../shared/utils/parse-http-error.utils';
import { CredentialsService } from '../../../core/services';
import { AuthenticationService, ToastService } from '../../../shared/services';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardCheckboxComponent } from '@/zardui/components/checkbox';
import { ZardButtonComponent } from '@/zardui/components/button';
import { ZardAlertComponent } from '@/zardui/components/alert';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    TranslatePipe,
    RouterModule,
    FormControlErrorsComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    ZardInputComponent,
    ZardCheckboxComponent,
    ZardButtonComponent,
    ZardAlertComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent extends BaseUpdateComponent {
  // Icons
  protected readonly icons = {
    spinner: faSpinner,
    eye: faEye,
    eyeSlash: faEyeSlash,
    xmark: faXmark,
  };

  // State
  protected showPassword = signal(false);
  protected showPasswordConfirmation = signal(false);

  // DI
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService);

  constructor() {
    super();

    // If the user is logged in, redirect to the home page
    if (this.credentialsService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.createForm();
  }

  /**
   * Form
   */

  // Create the form
  createForm() {
    this.form = this.formBuilder.nonNullable.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
        acceptanceRegulations: [false, Validators.requiredTrue],
        roles: [['teacher'], Validators.required],
      },
      { validators: this.passwordMatchValidator() },
    );
  }

  /**
   * Auth
   */

  // Call the action
  submitForm() {
    this.error = '';
    this.serverErrors = {};

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);

    this.authenticationService
      .register(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.form.markAsPristine();
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.show('success', 'auth.register.messages.success.registerSuccess');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error: HttpErrorResponse) => {
          const parsed = parseHttpError(error);

          this.error = parsed.message;
          this.serverErrors = parsed.errors;
        },
      });
  }

  /**
   * Helpers
   */

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  togglePasswordConfirmationVisibility() {
    this.showPasswordConfirmation.set(!this.showPasswordConfirmation());
  }

  // Validator comparing the password and passwordConfirmation field values
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirm = control.get('passwordConfirmation');

      if (!password || !confirm) return null;

      if (password.value !== confirm.value) {
        const errors = confirm.errors || {};

        confirm.setErrors({
          ...errors,
          mismatch: true,
        });
      } else {
        const errors = confirm.errors;

        if (errors?.['mismatch']) {
          delete errors['mismatch'];

          confirm.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return null;
    };
  }
}
