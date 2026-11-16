import { CommonModule } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, Observable } from 'rxjs';
import {
  LoaderComponent,
  FormControlErrorsComponent,
  SaveButtonComponent,
  CancelButtonComponent,
  BaseUpdateComponent,
} from '../../../../shared/components';
import { FormHelper } from '../../../../shared/helpers';
import { User, UserId } from '../../../../shared/interfaces';
import { UpdateComponent } from '../../../../shared/interfaces/form/update-component.interface';
import { UserService, ToastService, TranslatedSwalService } from '../../../../shared/services';
import { UiSwitchModule } from 'ngx-ui-switch';
import { environment } from '../../../../../environments/environment';
import { ZardInputComponent } from '@/zardui/components/input';

@Component({
  selector: 'app-update-user',
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    LoaderComponent,
    FormControlErrorsComponent,
    SaveButtonComponent,
    CancelButtonComponent,
    ZardInputComponent,
    UiSwitchModule,
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
})
export class UpdateUserComponent
  extends BaseUpdateComponent
  implements OnInit, UpdateComponent<User>
{
  // Icons
  protected readonly faSpinner = faSpinner;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faSave = faSave;

  // User
  user = signal<User | null>(null);

  // Account verification date
  emailVerifiedAt = signal<string | null>(null);

  // Date format
  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // DI
  protected readonly route = inject(ActivatedRoute);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly translatedSwalService = inject(TranslatedSwalService);

  ngOnInit(): void {
    // Create the form
    this.createForm();

    // Create or Update
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.getById(params['id']);
      }
    });
  }

  /**
   * Form
   */

  // Create the form
  createForm(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(191)]],
      lastName: [null, [Validators.required, Validators.maxLength(191)]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(191)]],
      confirmed: [false, [Validators.required]],
    });
  }

  // Update form fields
  updateForm(user: User): void {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      confirmed: user.confirmed,
    });

    this.emailVerifiedAt.set(user.emailVerifiedAt);
  }

  // Fetch model data
  getById(userId: UserId): void {
    this.isLoading.set(true);
    this.userService
      .getById(userId)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res: HttpResponse<User>) => {
          if (res.body !== null) {
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
   * Save
   */

  // Build the object to save from the form
  createDataToSaveFromForm(): User {
    // Gets the whole form, including disabled fields
    const formValue = this.form.getRawValue();

    return {
      id: this.user()?.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      confirmed: formValue.confirmed,
    } as User;
  }

  // Call save
  onSubmit(): void {
    // Validation
    FormHelper.validateAllFormFields(this.form);
    if (!this.form.valid) {
      this.toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Object to save
    const dataToSave = this.createDataToSaveFromForm();

    if (this.user() === null) {
      this.subscribeToSaveResponse(this.userService.create(dataToSave));
    } else {
      this.subscribeToSaveResponse(this.userService.update(dataToSave));
    }
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
        next: () => this.onSaveSuccess(),
        error: (err: HttpErrorResponse) => this.onSaveError(err),
      });
  }

  // Called when the API returns OK
  onSaveSuccess(): void {
    this.translatedSwalService.show(
      'success',
      'user.message.success.createdUpdatedSuccessfully',
      {},
    );

    this.previousState();
  }

  // Called when the API returns an error
  onSaveError(errorRes: HttpErrorResponse): void {
    if (errorRes.error != null && errorRes.error.errors != null) {
      this.serverErrors = errorRes.error.errors;
    }

    this.translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});
  }
}
