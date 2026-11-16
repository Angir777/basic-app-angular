import { Route } from '@angular/router';

/**
 * Administration routing
 */
export const administrationRoutes: Route[] = [
  {
    path: 'users',
    loadChildren: () => import('./user/users.routes').then((m) => m.usersRoutes),
    data: {
      breadcrumb: 'user.pageTitle.users',
      description: 'user.pageDescription.users',
      clickable: true,
    },
  },
  {
    path: 'roles',
    loadChildren: () => import('./role/roles.routes').then((m) => m.rolesRoutes),
    data: {
      breadcrumb: 'role.pageTitle.roles',
      description: 'role.pageDescription.roles',
      clickable: true,
    },
  },
];
