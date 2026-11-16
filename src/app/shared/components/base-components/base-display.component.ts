import { signal } from '@angular/core';

/**
 * Base class used to display models.
 */
export abstract class BaseDisplayComponent {
  protected isLoading = signal(false);
  protected isSaving = signal(false);

  /**
   * Redirects to the previous page
   */
  previousState(): void {
    window.history.back();
  }
}
