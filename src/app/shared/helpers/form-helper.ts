import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormHelper {
  public static validateAllFormFields(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((ctrl) => {
        this.validateAllFormFields(ctrl);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach((ctrl) => {
        this.validateAllFormFields(ctrl);
      });
    }
  }

  public static isFormControlInvalid(formControl: AbstractControl | null): boolean {
    if (!formControl) {
      return false;
    }

    return formControl.invalid && (formControl.dirty || formControl.touched);
  }

  public static getValidationWrapperClass(isInvalid: boolean) {
    return isInvalid
      ? 'border-red-600 hover:border-red-600 focus:border-red-600'
      : 'border-green-500 hover:border-green-600 focus:border-green-600';
  }

  public static getValidationClass(isInvalid: boolean) {
    return isInvalid
      ? 'border-red-600 hover:border-red-600 focus:border-red-600'
      : 'border-green-500 hover:border-green-600 focus:border-green-600';
  }

  public static getServerErrors(
    serverErrors: Record<string, string[]>,
    propName: string,
  ): string[] {
    if (this.hasProp(serverErrors, propName)) {
      return serverErrors[propName];
    }
    return [];
  }

  private static hasProp(obj: Record<string, string[]>, prop: string): boolean {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
