import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faXmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseUpdateComponent } from '../../../shared/components/base-components/base-update.component';
import { FormControlErrorsComponent } from '../../../shared/components/form-control-errors/form-control-errors.component';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { parseHttpError } from '../../../shared/utils/parse-http-error.utils';
import { CredentialsService } from '../../../core/services';
import { AuthenticationService, ToastService } from '../../../shared/services';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardButtonComponent } from '@/zardui/components/button';
import { ZardAlertComponent } from '@/zardui/components/alert';

@Component({
  selector: 'app-password-reset',
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
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent extends BaseUpdateComponent {
  // Icons
  protected readonly icons = {
    spinner: faSpinner,
    xmark: faXmark,
    user: faUser,
  };

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
        email: ['', [Validators.required, Validators.email]],
      },
      {},
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

    const payload = {
      ...this.form.getRawValue(),
      gatewayUrl: environment.APP_URL,
    };

    this.isLoading.set(true);

    this.authenticationService
      .sendResetPasswordEmail(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.show(
            'success',
            'auth.passwordReset.messages.success.passwordResetSuccess',
          );

          this.form.reset();
        },
        error: (error: HttpErrorResponse) => {
          const parsed = parseHttpError(error);

          this.error = parsed.message;
          this.serverErrors = parsed.errors;
        },
      });
  }
}
