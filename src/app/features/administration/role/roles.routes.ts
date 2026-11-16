import { Route } from '@angular/router';
import { ngxPermissionsGuard } from 'ngx-permissions';
import { RolesListComponent } from './roles-list/roles-list.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { DisplayRoleComponent } from './display-role/display-role.component';

/**
 * Roles routing
 */
export const rolesRoutes: Route[] = [
  {
    path: '',
    component: RolesListComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_VIEW'],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'add',
    component: UpdateRoleComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_CREATE'],
        redirectTo: '/',
      },
      breadcrumb: 'role.pageTitle.add',
    },
  },
  {
    path: 'edit/:id',
    component: UpdateRoleComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_UPDATE'],
        redirectTo: '/',
      },
      breadcrumb: 'role.pageTitle.edit',
    },
  },
  {
    path: 'display/:id',
    component: DisplayRoleComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_VIEW'],
        redirectTo: '/',
      },
      breadcrumb: 'role.pageTitle.display',
    },
  },
];
