import { inject, Injectable } from '@angular/core';
import { PermissionModes } from '../../constants';
import { NavItem } from '../../interfaces';
import { CredentialsService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class SidebarMenuService {
  // DI
  private readonly credentialsService = inject(CredentialsService);

  // Prepare menu items
  prepareMenu(items: NavItem[]): NavItem[] {
    const userPermissions = this.credentialsService.getPermissions().map((p) => {
      return p;
    });

    return items
      .map((item) => {
        const hasPermission = this.checkPermission(
          item.permissions,
          userPermissions,
          item.permissionsMode,
        );

        if (!hasPermission) {
          return null;
        }

        let filteredSubItems = item.subItems;

        if (item.subItems?.length) {
          filteredSubItems = item.subItems.filter((subItem) =>
            this.checkPermission(subItem.permissions, userPermissions, subItem.permissionsMode),
          );
        }

        return {
          ...item,
          subItems: filteredSubItems,
        };
      })
      .filter(Boolean) as NavItem[];
  }

  // Check permissions
  private checkPermission(
    itemPermissions: string[] = [],
    userPermissions: string[],
    permissionMode: PermissionModes = PermissionModes.AT_LEAST_ONE,
  ): boolean {
    if (!itemPermissions.length) {
      return true;
    }

    switch (permissionMode) {
      case PermissionModes.AT_LEAST_ONE:
        return itemPermissions.some((permission) => userPermissions.includes(permission));

      case PermissionModes.ALL:
        return itemPermissions.every((permission) => userPermissions.includes(permission));

      case PermissionModes.EXCEPT_AT_LEAST_ONE:
        return !itemPermissions.some((permission) => userPermissions.includes(permission));

      case PermissionModes.EXCEPT_ALL:
        return !itemPermissions.every((permission) => userPermissions.includes(permission));

      default:
        return false;
    }
  }
}
