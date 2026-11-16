import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseUpdateComponent } from '../../../shared/components/base-components/base-update.component';
import { FormControlErrorsComponent } from '../../../shared/components/form-control-errors/form-control-errors.component';
import { faSpinner, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseHttpError } from '../../../shared/utils/parse-http-error.utils';
import { CredentialsService } from '../../../core/services';
import { AuthenticationService, ToastService } from '../../../shared/services';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardButtonComponent } from '@/zardui/components/button';
import { ZardAlertComponent } from '@/zardui/components/alert';

@Component({
  selector: 'app-password-reset-finish',
  imports: [
    CommonModule,
    TranslatePipe,
    RouterModule,
    FormControlErrorsComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    ZardInputComponent,
    ZardButtonComponent,
    ZardAlertComponent,
  ],
  templateUrl: './password-reset-finish.component.html',
  styleUrl: './password-reset-finish.component.scss',
})
export class PasswordResetFinishComponent extends BaseUpdateComponent implements OnInit {
  // Icons
  protected readonly icons = {
    spinner: faSpinner,
    xmark: faXmark,
    eye: faEye,
    eyeSlash: faEyeSlash,
  };

  // State
  protected showPassword = signal(false);
  protected showPasswordConfirmation = signal(false);
  protected token = signal('');

  // DI
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
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

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['code'] !== null) {
        this.token.set(params['code']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Form
   */

  // Create the form
  createForm() {
    this.form = this.formBuilder.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
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

    const data = {
      ...this.form.getRawValue(),
      token: this.token(),
    };

    this.isLoading.set(true);

    this.authenticationService
      .finishPasswordReset(data)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.form.reset();
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.show(
            'success',
            'auth.passwordResetFinish.messages.success.passwordResetFinishSuccess',
          );

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
