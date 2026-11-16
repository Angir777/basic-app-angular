import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface UpdateComponent<T> {
  /**
   * Create the form
   * @param model Model used to build the form
   */
  createForm(model: T): void;

  /**
   * Update form data
   * @param model Model used to update the form
   */
  updateForm(model: T): void;

  /**
   * Create a T object from the form data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDataToSaveFromForm(): any;

  /**
   * Save the form
   * When id != null, update is called; when id is undefined, create is called
   */
  onSubmit(): void;

  /**
   * Handles a successful response with status = 200
   * @param res result passed by subscribeToSaveResponse
   */
  onSaveSuccess(res: HttpResponse<T>): void;

  /**
   * Handles an error response with status != 200
   * @param errorRes errors from the HTTP request
   */
  onSaveError(errorRes?: HttpErrorResponse): void;
}
