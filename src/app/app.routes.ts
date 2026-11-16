import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { ErrorLayout } from './layout/error-layout/error-layout';
import { PublicLayout } from './layout/public-layout/public-layout';
import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { AuthenticationGuard } from './core/guards';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AccountComponent } from './features/account/account.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Public routes
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },

  // Protected Routes
  {
    path: '',
    component: DashboardLayout,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: 'main.dashboard.pageTitle.dashboard',
          description: 'main.dashboard.pageDescription.dashboard',
          clickable: false,
        },
      },
      {
        path: 'account',
        component: AccountComponent,
        data: {
          breadcrumb: 'account.pageTitle.account',
          description: 'account.pageDescription',
          clickable: false,
        },
      },
      {
        path: 'administration',
        loadChildren: () =>
          import('./features/administration/administration.routes').then(
            (m) => m.administrationRoutes,
          ),
        data: {
          breadcrumb: 'nav.administration',
          description: 'nav.pageDescription.administration',
          clickable: false,
        },
      },
    ],
  },

  // Error Routes
  {
    path: 'error',
    component: ErrorLayout,
    children: [{ path: '404', component: NotFoundComponent }],
  },

  // Wildcard
  { path: '**', redirectTo: '/error/404' },
];
