import { Component, inject, signal } from '@angular/core';
import { RoleService, TranslatedSwalService, UserService } from '../../../../shared/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSpinner,
  faEye,
  faEdit,
  faTrashAlt,
  faPlus,
  faGears,
  faUser,
  faUserSlash,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UiSwitchModule } from 'ngx-ui-switch';
import { finalize } from 'rxjs';
import { LoaderComponent, MatTableComponent } from '../../../../shared/components';
import { Permission, Role, User } from '../../../../shared/interfaces';
import { environment } from '../../../../../environments/environment';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardCheckboxComponent } from '@/zardui/components/checkbox';
import { AttachRoleModalComponent } from '../../components/attach-role-modal/attach-role-modal.component';
import { UserHistoryModalComponent } from '../../components/user-history-modal/user-history-modal.component';
import {
  AppDialogService,
  type AppDialogRef,
  TableColumnSelectorComponent,
} from '../../../../shared/components/ui';

@Component({
  selector: 'app-users-list',
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
    ZardCheckboxComponent,
    TableColumnSelectorComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent extends MatTableComponent<User> {
  // Icons
  protected readonly faSpinner = faSpinner;
  protected readonly faEye = faEye;
  protected readonly faEdit = faEdit;
  protected readonly faTrashAlt = faTrashAlt;
  protected readonly faPlus = faPlus;
  protected readonly faGears = faGears;
  protected readonly faUser = faUser;
  protected readonly faUserSlash = faUserSlash;
  protected readonly faClockRotateLeft = faClockRotateLeft;

  // Table columns
  override displayedColumns: string[] = ['actions', 'id', 'fullName', 'email', 'emailVerifiedAt'];

  // Column translations for 'Show/hide columns'
  protected columnTranslations: Record<string, string> = {
    actions: 'main.global.actions',
    id: 'main.global.id',
    fullName: 'user.form.fullName',
    email: 'user.form.email',
    emailVerifiedAt: 'user.form.emailVerifiedAt',
  };

  // All table columns (Show/hide columns)
  protected allColumns: string[] = this.displayedColumns;

  // Modal reference
  ref: AppDialogRef<boolean> | null = null;

  // Additional filters
  roles = signal<Role[]>([]);
  isLoadingRoles = signal(false);

  permissions = signal<Permission[]>([]);
  isLoadingPermissions = signal(false);

  // Date format
  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // Modal reference
  refAttachRole: AppDialogRef<boolean> | null = null;

  // DI
  protected override dataService = inject(UserService);
  protected readonly roleService = inject(RoleService);
  protected readonly translatedSwalService = inject(TranslatedSwalService);
  protected readonly translate = inject(TranslateService);
  protected readonly dialogService = inject(AppDialogService);

  constructor() {
    super('user');
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Load the required dictionaries
    this.getRoles();
    this.getPermissions();
  }

  /**
   * Load the required dictionaries
   */

  private getRoles(): void {
    this.isLoadingRoles.set(true);

    this.roleService
      .getAll()
      .pipe(
        finalize(() => {
          this.isLoadingRoles.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.roles.set(res.body ?? []);
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  private getPermissions(): void {
    this.isLoadingPermissions.set(true);

    this.roleService
      .getPermissions()
      .pipe(
        finalize(() => {
          this.isLoadingPermissions.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.permissions.set(res ?? []);
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  /**
   * Actions
   */

  // Change history modal
  openHistoryModal(user: User) {
    this.ref = this.dialogService.open<boolean>(UserHistoryModalComponent, {
      title: 'main.global.history.title',
      width: '1000px',
      maximizable: true,
      data: { id: user.id },
    });

    this.ref.closed.subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  // Edit role assignment
  openAddRoleModal(user: User) {
    this.refAttachRole = this.dialogService.open<boolean>(AttachRoleModalComponent, {
      title: 'user.form.role',
      width: '800px',
      maximizable: true,
      data: { user },
    });

    this.refAttachRole.closed.subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  // Deletion
  async delete(user: User) {
    const result = await this.translatedSwalService.showAsync(
      'user.message.question.areYouSureYouWantDelete',
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
      user.isDeleting = true;
      this.dataService
        .delete(user.id)
        .pipe(
          finalize(() => {
            user.isDeleting = false;
          }),
        )
        .subscribe({
          next: () => {
            this.translatedSwalService.show('success', 'user.message.success.deletedSuccessfully', {
              name: user.fullName,
            });
            this.refreshTable();
          },
          error: () => {
            this.translatedSwalService.show('error', 'user.message.error.cantDeleted', {
              name: user.fullName,
            });
          },
        });
    }
  }

  /**
   * Helper functions
   */

  // Toggle checkboxes for additional filters
  onEmailVerifiedFilterChange(type: 'no' | 'yes'): void {
    if (type === 'no' && this.criteria['filter[emailVerifiedAtNo]']) {
      this.criteria['filter[emailVerifiedAtYes]'] = false;
    }

    if (type === 'yes' && this.criteria['filter[emailVerifiedAtYes]']) {
      this.criteria['filter[emailVerifiedAtNo]'] = false;
    }

    this.search();
  }
}
