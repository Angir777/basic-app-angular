import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetFinishComponent } from './password-reset-finish/password-reset-finish.component';

/**
 * Auth routing
 */
export const authRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'auth.pageTitle.login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'auth.pageTitle.register' },
  },
  {
    path: 'confirm-account/:code',
    component: ConfirmAccountComponent,
    data: { title: 'auth.pageTitle.confirmAccount' },
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    data: { title: 'auth.pageTitle.passwordReset' },
  },
  {
    path: 'password-reset-finish/:code',
    component: PasswordResetFinishComponent,
    data: { title: 'auth.pageTitle.passwordResetFinish' },
  },
];
