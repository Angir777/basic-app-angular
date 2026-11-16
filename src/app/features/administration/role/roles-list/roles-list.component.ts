import { Component, inject } from '@angular/core';
import { LoaderComponent, MatTableComponent } from '../../../../shared/components';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Role } from '../../../../shared/interfaces';
import { faClockRotateLeft, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { RoleService, TranslatedSwalService } from '../../../../shared/services';
import { finalize } from 'rxjs';
import { ZardInputComponent } from '@/zardui/components/input';
import { RoleHistoryModalComponent } from '../../components/role-history-modal/role-history-modal.component';
import {
  AppDialogService,
  type AppDialogRef,
  TableColumnSelectorComponent,
} from '../../../../shared/components/ui';

@Component({
  selector: 'app-roles-list',
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
    TableColumnSelectorComponent
  ],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss',
})
export class RolesListComponent extends MatTableComponent<Role> {
  // Icons
  protected readonly faSpinner = faSpinner;
  protected readonly faEye = faEye;
  protected readonly faEdit = faEdit;
  protected readonly faTrashAlt = faTrashAlt;
  protected readonly faPlus = faPlus;
  protected readonly faClockRotateLeft = faClockRotateLeft;

  // Table columns
  override displayedColumns: string[] = ['actions', 'id', 'name', 'guardName', 'permissionsCount'];

  // Column translations for 'Show/hide columns'
  protected columnTranslations: Record<string, string> = {
    actions: 'main.global.actions',
    id: 'main.global.id',
    name: 'role.form.name',
    guardName: 'role.form.guardName',
    permissionsCount: 'role.form.permissionsCount',
  };

  // All table columns (Show/hide columns)
  protected allColumns: string[] = this.displayedColumns;

  // Modal reference
  ref: AppDialogRef<boolean> | null = null;

  // DI
  protected override dataService = inject(RoleService);
  protected readonly translatedSwalService = inject(TranslatedSwalService);
  protected readonly translate = inject(TranslateService);
  protected readonly dialogService = inject(AppDialogService);

  constructor() {
    super('role');
  }

  /**
   * Actions
   */

  // Change history modal
  openHistoryModal(role: Role) {
    this.ref = this.dialogService.open<boolean>(RoleHistoryModalComponent, {
      title: 'main.global.history.title',
      width: '1000px',
      maximizable: true,
      data: { id: role.id },
    });

    this.ref.closed.subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  // Deletion
  async delete(role: Role) {
    const result = await this.translatedSwalService.showAsync(
      'role.message.question.areYouSureYouWantDelete',
      {
        name: role.name,
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
      role.isDeleting = true;
      this.dataService
        .delete(role.id)
        .pipe(
          finalize(() => {
            role.isDeleting = false;
          }),
        )
        .subscribe({
          next: () => {
            this.translatedSwalService.show('success', 'role.message.success.deletedSuccessfully', {
              name: role.name,
            });
            this.refreshTable();
          },
          error: () => {
            this.translatedSwalService.show('error', 'role.message.error.cantDeleted', {
              name: role.name,
            });
          },
        });
    }
  }
}
