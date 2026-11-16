import { signal, inject } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { FormHelper } from '../../helpers';
import { FormWithValidation } from '../../interfaces';

/**
 * Base class used to update models.
 */
export abstract class BaseUpdateComponent implements FormWithValidation {
  protected isLoading = signal(false);
  protected isSaving = signal(false);
  protected inPreview = signal(false);

  protected error?: string;
  protected serverErrors: Record<string, string[]> = {};

  protected form!: FormGroup;
  protected readonly formBuilder = inject(FormBuilder);

  /**
   * Redirects to the previous page
   */
  previousState(): void {
    window.history.back();
  }

  /**
   * Form handling
   */
  protected getControlByPath(path: string): AbstractControl | null {
    return path.split('.').reduce((control: AbstractControl | null, key: string) => {
      if (!control) {
        return null;
      }

      if (control instanceof FormGroup) {
        return control.get(key);
      }

      if (control instanceof FormArray) {
        return control.at(Number(key));
      }

      return null;
    }, this.form);
  }

  isFormControlInvalid(
    formControlName: string,
    serverValidationPropName: string | null = null,
  ): boolean {
    const abstractControl = this.getControlByPath(formControlName);

    if (this.serverErrors !== null && serverValidationPropName !== null) {
      const errors = this.serverErrors[formControlName];
      if (errors && errors.length > 0) {
        return true;
      }
    }

    return FormHelper.isFormControlInvalid(abstractControl);
  }

  getFormValidationClass(
    formControlName: string,
    serverValidationPropName: string | null = null,
  ): string | null {
    const abstractControl = this.getControlByPath(formControlName);
    if (abstractControl != null && !abstractControl.touched && !abstractControl.dirty) {
      return '';
    }

    return FormHelper.getValidationWrapperClass(
      this.isFormControlInvalid(formControlName, serverValidationPropName),
    );
  }

  getServerErrors(name: string): string[] {
    return FormHelper.getServerErrors(this.serverErrors, name);
  }

  clearServerErrors(name: string) {
    if (this.serverErrors && Object.prototype.hasOwnProperty.call(this.serverErrors, name)) {
      delete this.serverErrors[name];
    }
  }
}
