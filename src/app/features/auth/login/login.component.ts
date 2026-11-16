import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faEye, faEyeSlash, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControlErrorsComponent } from '../../../shared/components/form-control-errors/form-control-errors.component';
import { environment } from '../../../../environments/environment';
import { BaseUpdateComponent } from '../../../shared/components/base-components/base-update.component';
import { parseHttpError } from '../../../shared/utils/parse-http-error.utils';
import { Logger, I18nService } from '../../../core/services';
import { AuthenticationService } from '../../../shared/services';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardCheckboxComponent } from '@/zardui/components/checkbox';
import { ZardButtonComponent } from '@/zardui/components/button';
import { ZardAlertComponent } from '@/zardui/components/alert';

const log = new Logger('DAILO');

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseUpdateComponent implements OnInit {
  // Icons
  protected readonly icons = {
    spinner: faSpinner,
    xmark: faXmark,
    eye: faEye,
    eyeSlash: faEyeSlash,
  };

  // State
  protected showPassword = signal(false);
  protected enableRegistration = environment.ENABLE_REGISTRATION;
  protected adminsEmails: string | null = null;

  // DI
  private readonly router = inject(Router);
  private readonly i18nService = inject(I18nService);
  private readonly authenticationService = inject(AuthenticationService);

  constructor() {
    super();

    this.createForm();
  }

  ngOnInit() {
    // this.loadAdminsEmails();

    this.restoreRememberEmail();
  }

  /**
   * Form
   */

  // Create the form
  createForm() {
    this.form = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [true],
    });
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
      .login(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.form.markAsPristine();
        }),
      )
      .subscribe({
        next: ({ email }) => {
          log.debug(`${email} successfully logged in!`);
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          log.debug('Login error.');

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

  private restoreRememberEmail() {
    const email = localStorage.getItem('REMEMBERED_EMAIL_APP');
    if (!email) return;

    this.form.patchValue({ email, remember: true });
  }

  // private loadAdminsEmails() {
  //   this.authenticationService
  //     .getAdminsEmails()
  //     .pipe(
  //       finalize(() => {
  //         //
  //       }),
  //     )
  //     .subscribe({
  //       next: (res: string[]) => {
  //         this.adminsEmails = res.join(', ') ?? null;
  //         console.log(this.adminsEmails);
  //       },
  //       error: () => {
  //         //
  //       },
  //     });
  // }
}
