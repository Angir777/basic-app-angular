import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface FormErrors {
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  min?: { min: number; actual: number };
  max?: { max: number; actual: number };
  minlength?: { requiredLength: number; actualLength: number };
  maxlength?: { requiredLength: number; actualLength: number };
  pattern?: { requiredPattern: string; actualValue: string };
  mismatch?: boolean;
}

/**
 * Component displaying validation errors for ReactiveForms
 */
@Component({
  selector: 'app-form-control-errors',
  templateUrl: './form-control-errors.component.html',
  styleUrls: ['./form-control-errors.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe],
})
export class FormControlErrorsComponent {
  /**
   * Object containing validation errors
   * Some validators also return the expected and actual value
   * Example for the required validator when the field is empty
   * {
   *   required: true
   * }
   *
   * Example for the min validator when the entered value is lower
   * {
   *   min: {
   *     min: {{min}}, // value given when defining the validator
   *     actual: {{max}} // value in the field
   *   }
   * }
   *
   * The keys for the expected and actual values differ between validators
   */
  @Input() errors: FormErrors | null | undefined = null;

  /**
   * Validation errors returned by the API
   * Laravel returns validation errors as an object
   * {
   *   attribute: [string[] array containing translated validation errors ready to display]
   * }
   *
   * Example for a field named name validated with required
   * {
   *   name: ['The name field is required']
   * }
   */
  @Input() serverErrors: string[] = [];

  /**
   * Custom translation for a given error
   * The passed translations should be an object in the form
   * {
   *   validator: 'translation key'
   * }
   *
   * np.
   * {
   *   required: 'user.validation.customRequiredMessage'
   * }
   *
   * validators that take a parameter, e.g. min(1), return that parameter on error
   * this parameter can be used in translation keys, e.g. 'user.validation.minAge': 'Minimum age is {{min}}'
   */
  @Input() customValidationMessages: Record<string, string> = {};

  /**
   * Checks whether the object contains the attribute passed as the parameter
   * @param key Attribute name
   */
  hasCustomErrorMessage(key: string) {
    return !!this.customValidationMessages[key];
  }

  hasServerErrors() {
    return !(this.serverErrors == null || this.serverErrors.length === 0);
  }
}
