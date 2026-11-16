import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HistoryObject = Record<string, any>;

@Component({
  selector: 'app-role-history-object',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './role-history-object.component.html',
  styleUrl: './role-history-object.component.scss',
})
export class RoleHistoryObjectComponent {
  // State
  @Input() history: HistoryObject = {};
  @Input() border = false;
  @Input() parentKey = '';
  @Input() translationPrefix = 'role.history.';

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
}
