import { Route } from '@angular/router';
import { ngxPermissionsGuard } from 'ngx-permissions';
import { UsersListComponent } from './users-list/users-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { DisplayUserComponent } from './display-user/display-user.component';
import { DeletedUsersListComponent } from './deleted-users-list/deleted-users-list.component';

/**
 * Users routing
 */
export const usersRoutes: Route[] = [
  {
    path: '',
    component: UsersListComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['USERS_VIEW'],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'deleted',
    component: DeletedUsersListComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['USERS_VIEW'],
        redirectTo: '/',
      },
      breadcrumb: 'user.pageTitle.deleted',
    },
  },
  {
    path: 'add',
    component: UpdateUserComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['USERS_CREATE'],
        redirectTo: '/',
      },
      breadcrumb: 'user.pageTitle.add',
    },
  },
  {
    path: 'edit/:id',
    component: UpdateUserComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['USERS_UPDATE'],
        redirectTo: '/',
      },
      breadcrumb: 'user.pageTitle.edit',
    },
  },
  {
    path: 'display/:id',
    component: DisplayUserComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        only: ['USERS_VIEW'],
        redirectTo: '/',
      },
      breadcrumb: 'user.pageTitle.display',
    },
  },
];
