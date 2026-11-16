import { Component, inject } from '@angular/core';
import { faSpinner, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CancelButtonComponent,
  LoaderComponent,
  MatTableComponent,
} from '../../../../shared/components';
import { User } from '../../../../shared/interfaces';
import { UserService, RoleService, TranslatedSwalService } from '../../../../shared/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ZardInputComponent } from '@/zardui/components/input';
import { TableColumnSelectorComponent } from '../../../../shared/components/ui';

@Component({
  selector: 'app-deleted-users-list',
  imports: [
    CommonModule,
    LoaderComponent,
    TranslatePipe,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    UiSwitchModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    NgSelectModule,
    NgxPermissionsModule,
    ZardInputComponent,
    CancelButtonComponent,
    TableColumnSelectorComponent
  ],
  templateUrl: './deleted-users-list.component.html',
  styleUrl: './deleted-users-list.component.scss',
})
export class DeletedUsersListComponent extends MatTableComponent<User> {
  // Icons
  protected readonly faSpinner = faSpinner;
  protected readonly faArrowRotateLeft = faArrowRotateLeft;

  // Table columns
  override displayedColumns: string[] = ['actions', 'id', 'fullName', 'email', 'deletedAt'];

  // Column translations for 'Show/hide columns'
  protected columnTranslations: Record<string, string> = {
    actions: 'main.global.actions',
    id: 'main.global.id',
    fullName: 'user.form.fullName',
    email: 'user.form.email',
    deletedAt: 'user.form.deletedAt',
  };

  // All table columns (Show/hide columns)
  protected allColumns: string[] = this.displayedColumns;

  // Date format
  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // DI
  protected override dataService = inject(UserService);
  protected readonly roleService = inject(RoleService);
  protected readonly translatedSwalService = inject(TranslatedSwalService);

  constructor() {
    super('user');
  }

  /**
   * Override the method to call the correct API endpoint
   */

  override get fetchMethod() {
    return this.dataService.queryDeleted.bind(this.dataService);
  }

  /**
   * Actions
   */

  // Restoration
  async restore(user: User) {
    const result = await this.translatedSwalService.showAsync(
      'user.message.question.areYouSureYouWantRestore',
      {
        name: user.fullName,
      },
      {
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonTextTranslation: 'main.global.yes',
        cancelButtonTextTranslation: 'main.global.no',
      },
    );

    if (result.value) {
      user.isRestoring = true;
      this.dataService
        .restore(user.id)
        .pipe(
          finalize(() => {
            user.isRestoring = false;
          }),
        )
        .subscribe({
          next: () => {
            this.translatedSwalService.show(
              'success',
              'user.message.success.restoredSuccessfully',
              {
                name: user.fullName,
              },
            );
            this.refreshTable();
          },
          error: () => {
            this.translatedSwalService.show('error', 'user.message.error.cantRestored', {
              name: user.fullName,
            });
          },
        });
    }
  }
}
