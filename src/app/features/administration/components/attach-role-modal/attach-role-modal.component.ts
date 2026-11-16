import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Role, User } from '../../../../shared/interfaces';
import { FormsModule } from '@angular/forms';
import { LoaderComponent, SaveButtonComponent } from '../../../../shared/components';
import {
  RoleService,
  UserService,
  TranslatedSwalService,
  ToastService,
} from '../../../../shared/services';
import { finalize } from 'rxjs';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ZardInputComponent } from '@/zardui/components/input';
import { ZardSelectImports } from '@/zardui/components/select/select.imports';

type RoleSortColumn = 'id' | 'assigned' | 'name' | 'permissions';
type SortDirection = 'asc' | 'desc';
type AssignedRoleFilter = 'all' | 'assigned' | 'notAssigned';

@Component({
  selector: 'app-attach-role-modal',
  imports: [
    FormsModule,
    TranslatePipe,
    LoaderComponent,
    SaveButtonComponent,
    ZardInputComponent,
    ...ZardSelectImports,
    UiSwitchModule,
  ],
  templateUrl: './attach-role-modal.component.html',
  styleUrl: './attach-role-modal.component.scss',
})
export class AttachRoleModalComponent implements OnInit {
  // State
  roles: Role[] = [];

  assignedRoleFilter: AssignedRoleFilter = 'assigned';
  roleNameFilter = '';

  sortColumn: RoleSortColumn = 'id';
  sortDirection: SortDirection = 'asc';

  isLoading = signal(false);
  isSaving = false;

  // DI
  protected readonly translate = inject(TranslateService);
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);

  protected readonly roleService = inject(RoleService);
  protected readonly userService = inject(UserService);
  protected readonly toastService = inject(ToastService);
  protected readonly translatedSwalService = inject(TranslatedSwalService);

  readonly user: User = inject<{ user: User }>(DIALOG_DATA).user;

  ngOnInit(): void {
    this.getAvailableRoles();
  }

  /**
   * Roles and permissions
   */

  getParsedPermissions(role: Role): string {
    return (role.permissions ?? []).map((permission) => permission.translatedName).join(', ');
  }

  getVisibleRoles(): Role[] {
    const normalizedRoleNameFilter = this.normalizeText(this.roleNameFilter);

    return this.roles
      .filter((role) => {
        if (this.assignedRoleFilter === 'assigned') {
          return role.isSelected;
        }

        if (this.assignedRoleFilter === 'notAssigned') {
          return !role.isSelected;
        }

        return true;
      })
      .filter((role) => {
        if (!normalizedRoleNameFilter) {
          return true;
        }

        const searchableName = this.normalizeText(`${role.name ?? ''}`);

        return searchableName.includes(normalizedRoleNameFilter);
      })
      .sort((a, b) => this.compareRoles(a, b));
  }

  setSort(column: RoleSortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

      return;
    }

    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  getSortIcon(column: RoleSortColumn): string {
    if (this.sortColumn !== column) {
      return '';
    }

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  private normalizeText(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase();
  }

  private compareRoles(a: Role, b: Role): number {
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    switch (this.sortColumn) {
      case 'id':
        return (Number(a.id) - Number(b.id)) * direction;

      case 'assigned':
        return (Number(a.isSelected) - Number(b.isSelected)) * direction;

      case 'name':
        return this.compareStrings(a.name, b.name) * direction;

      case 'permissions':
        return (
          this.compareStrings(this.getParsedPermissions(a), this.getParsedPermissions(b)) *
          direction
        );

      default:
        return 0;
    }
  }

  private compareStrings(a: string | null | undefined, b: string | null | undefined): number {
    return (a ?? '').localeCompare(b ?? '', 'pl');
  }

  /**
   * Fetch roles
   */

  private getAvailableRoles(): void {
    this.isLoading.set(true);

    this.roleService
      .getAll()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          const roles: Role[] = res.body ?? [];
          const currentRoleNames = this.getCurrentRoleNames();

          this.roles = roles.map((role) => ({
            ...role,
            isSelected: currentRoleNames.includes(role.name),
          }));
        },

        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  private getCurrentRoleNames(): string[] {
    return (this.user.roles ?? []).map((role) => role.name);
  }

  /**
   * Save
   */

  onSubmit(): void {
    const selectedRolesIds: number[] = this.roles
      .filter((role) => role.isSelected)
      .map((role) => Number(role.id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (selectedRolesIds.length < 1) {
      this.translatedSwalService.show('error', 'user.message.error.selectMinOneRole', {});

      return;
    }

    if (!this.user?.id) {
      this.translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});

      return;
    }

    this.isSaving = true;

    this.userService
      .attachRoles(this.user.id, selectedRolesIds)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: () => {
          this.translatedSwalService.show(
            'success',
            'user.message.success.createdUpdatedSuccessfully',
            {},
          );

          this.ref.close(true);
        },

        error: () => {
          this.translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});
        },
      });
  }

  close() {
    this.ref.close();
  }
}
