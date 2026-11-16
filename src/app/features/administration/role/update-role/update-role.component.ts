import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Permission, Role } from '../../../../shared/interfaces';
import { CommonModule } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faArrowLeft, faSave, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { finalize, Observable } from 'rxjs';
import {
  LoaderComponent,
  FormControlErrorsComponent,
  SaveButtonComponent,
  CancelButtonComponent,
  BaseUpdateComponent,
} from '../../../../shared/components';
import { FormHelper } from '../../../../shared/helpers';
import { RoleService, ToastService, TranslatedSwalService } from '../../../../shared/services';
import { UpdateComponent } from '../../../../shared/interfaces/form/update-component.interface';
import { ZardInputComponent } from '@/zardui/components/input';

interface PermissionGroupView {
  name: string;
  translatedName: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-update-role',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    LoaderComponent,
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    UiSwitchModule,
    MatTooltipModule,
    FormControlErrorsComponent,
    SaveButtonComponent,
    CancelButtonComponent,
    ZardInputComponent,
  ],
  templateUrl: './update-role.component.html',
  styleUrl: './update-role.component.scss',
})
export class UpdateRoleComponent
  extends BaseUpdateComponent
  implements OnInit, UpdateComponent<Role>
{
  // Icons
  protected readonly faSpinner = faSpinner;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faSave = faSave;
  protected readonly faInfoCircle = faInfoCircle;

  // Role
  role = signal<Role | null>(null);

  // Permissions
  permissions = signal<Permission[]>([]);
  isLoadingPermissions = signal(false);

  // Permissions grouped for display
  groupedPermissions = computed<PermissionGroupView[]>(() => {
    const groups = new Map<string, PermissionGroupView>();

    let permissions = this.permissions();

    if (this.showOnlySelected()) {
      permissions = permissions.filter((p) => p.isSelected);
    }

    permissions.forEach((permission) => {
      const groupName = permission.groupName || 'OTHER';

      if (!groups.has(groupName)) {
        groups.set(groupName, {
          name: groupName,
          translatedName: this.translate.instant(`role.permissionGroups.${groupName}`),
          permissions: [],
        });
      }

      groups.get(groupName)!.permissions.push(permission);
    });

    return [...groups.values()];
  });

  // Number of selected permissions
  selectedPermissionsCount = computed(
    () => this.permissions().filter((permission) => permission.isSelected).length,
  );

  // Total number of permissions
  permissionsStats = computed(() => ({
    selected: this.permissions().filter((permission) => permission.isSelected).length,
    total: this.permissions().length,
  }));

  // Flag for showing only selected permissions
  showOnlySelected = signal(false);

  // DI
  protected readonly route = inject(ActivatedRoute);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly toastService = inject(ToastService);
  private readonly translatedSwalService = inject(TranslatedSwalService);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    // Create the form
    this.createForm();

    // Create or Update
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.getById(+params['id']);
      } else {
        // Load available permissions
        this.getPermissions();
      }
    });
  }

  /**
   * Form
   */

  // Create the form
  createForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  // Update form fields
  updateForm(role: Role) {
    this.form.patchValue({
      name: role.name,
    });

    // Load available permissions
    this.getPermissions();
  }

  // Fetch model data
  getById(roleId: number): void {
    this.isLoading.set(true);
    this.roleService
      .getById(roleId)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.body !== null) {
            this.role.set(res.body);

            // Update the form
            this.updateForm(res.body);
          }
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  // Fetch permissions
  getPermissions() {
    this.isLoadingPermissions.set(true);
    this.roleService
      .getPermissions()
      .pipe(
        finalize(() => {
          this.isLoadingPermissions.set(false);
        }),
      )
      .subscribe({
        next: (permissions) => {
          this.permissions.set(permissions);

          // Prepare permissions for display
          this.preparePermissionsToShow();
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  /**
   * Save
   */

  // Build the object to save from the form
  createDataToSaveFromForm(): Role {
    // Gets the whole form, including disabled fields
    const formValue = this.form.getRawValue();

    return {
      id: this.role()?.id,
      name: formValue.name,
      permissions: this.permissions().filter((permission) => permission.isSelected),
    } as Role;
  }

  // Call save
  onSubmit() {
    // Validation
    FormHelper.validateAllFormFields(this.form);
    if (!this.form.valid) {
      this.toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Prepare selected permissions for saving
    const selectedPermissions = this.preparePermissionsToSave();
    if (!selectedPermissions || selectedPermissions.length === 0) {
      // At least one permission must be selected
      this.toastService.show('warn', 'role.message.error.selectMinOnePermission');
      return;
    }

    // Object to save
    const dataToSave = this.createDataToSaveFromForm();

    if (this.role() === null) {
      this.subscribeToSaveResponse(this.roleService.create(dataToSave));
    } else {
      this.subscribeToSaveResponse(this.roleService.update(dataToSave));
    }
  }

  // Handle the API response
  subscribeToSaveResponse(result: Observable<HttpResponse<Role>>): void {
    this.isSaving.set(true);
    result
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        }),
      )
      .subscribe({
        next: () => this.onSaveSuccess(),
        error: (err: HttpErrorResponse) => this.onSaveError(err),
      });
  }

  // Called when the API returns OK
  onSaveSuccess(): void {
    this.translatedSwalService.show(
      'success',
      'role.message.success.createdUpdatedSuccessfully',
      {},
    );
    this.previousState();
  }

  // Called when the API returns an error
  onSaveError(errorRes: HttpErrorResponse): void {
    if (errorRes.error != null && errorRes.error.errors != null) {
      this.serverErrors = errorRes.error.errors;
    }

    this.translatedSwalService.show('error', 'role.message.error.cantCreateUpdate', {});
  }

  /**
   * Helpers
   */

  // Prepare permissions for display
  private preparePermissionsToShow(): void {
    const role = this.role();

    if (!role?.permissions?.length) {
      this.showOnlySelected.set(false);
      return;
    }

    const selectedPermissionIds = new Set(role.permissions.map((permission) => permission.id));

    this.permissions.update((permissions) =>
      permissions.map((permission) => ({
        ...permission,
        isSelected: selectedPermissionIds.has(permission.id),
      })),
    );

    this.showOnlySelected.set(true);
  }

  // Prepare selected permissions for saving
  private preparePermissionsToSave(): number[] {
    return this.permissions()
      .filter((permission) => permission.isSelected && permission.id !== undefined)
      .map((permission) => Number(permission.id));
  }

  // Refresh the selected permissions counter
  onPermissionChange(): void {
    this.permissions.update((permissions) => [...permissions]);
  }
}
