import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { parseHttpError } from '../../../shared/utils/parse-http-error.utils';
import { CredentialsService } from '../../../core/services';
import { AuthenticationService, ToastService } from '../../../shared/services';

@Component({
  selector: 'app-confirm-account',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss',
})
export class ConfirmAccountComponent implements OnInit {
  // Icons
  protected readonly icons = {
    spinner: faSpinner,
  };

  // DI
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly credentialsService = inject(CredentialsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['code'] !== null) {
        this.confirmAccount(params['code']);
      } else {
        if (this.credentialsService.isAuthenticated()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  confirmAccount(code: string) {
    this.authenticationService
      .confirmAccount(code)
      .pipe(
        finalize(() => {
          if (this.credentialsService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.show(
            'success',
            'auth.confirmAccount.messages.success.confirmAccountSuccess',
          );
        },
        error: (error: HttpErrorResponse) => {
          const parsed = parseHttpError(error);

          const errorCode = parsed.message;

          this.toastService.show('error', 'auth.confirmAccount.messages.error.' + errorCode);
        },
        complete: () => {
          //
        },
      });
  }
}
