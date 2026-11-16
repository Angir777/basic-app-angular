import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HistoryObject = Record<string, any>;

@Component({
  selector: 'app-user-history-object',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './user-history-object.component.html',
  styleUrl: './user-history-object.component.scss',
})
export class UserHistoryObjectComponent {
  // State
  @Input() history: HistoryObject = {};
  @Input() border = false;
  @Input() parentKey = '';
  @Input() translationPrefix = 'user.history.';

  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // DI
  protected readonly translateService = inject(TranslateService);

  /**
   * Returns the full translation key including parent keys, separated by underscores.
   *
   * @param key
   * @returns
   */
  getFullKey(key: unknown): string {
    return (this.parentKey !== '' ? this.parentKey + '_' : '') + key;
  }

  /**
   * Comparator disabling the default natural-order sorting
   * when using the 'keyvalue' pipe.
   *
   * @returns
   */
  originalOrder(): number {
    return 0;
  }

  /**
   * Checks whether the argument is an array.
   *
   * @param obj
   * @returns
   */
  isArray(obj: unknown) {
    return Array.isArray(obj);
  }

  /**
   * A comment starting with 'COMMENT_' has translated text
   */
  getHistoryValue(value: unknown): string {
    if (typeof value === 'string' && value.startsWith('COMMENT_')) {
      return this.translateService.instant('user.history.comment.' + value);
    }

    return value?.toString() || '-';
  }
}
