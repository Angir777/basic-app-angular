import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UserHistory } from '../../../../shared/interfaces';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs';
import { LoaderComponent, CancelButtonComponent } from '../../../../shared/components';
import { UserService, ToastService } from '../../../../shared/services';
import { UserHistoryObjectComponent } from './user-history-object/user-history-object.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CredentialsService } from '../../../../core/services';

@Component({
  selector: 'app-user-history-modal',
  imports: [
    CommonModule,
    UserHistoryObjectComponent,
    LoaderComponent,
    TranslatePipe,
    CancelButtonComponent,
  ],
  templateUrl: './user-history-modal.component.html',
  styleUrl: './user-history-modal.component.scss',
})
export class UserHistoryModalComponent implements OnInit {
  // State
  isLoading = signal(false);
  history: UserHistory[] = [];

  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  isAdministrator = signal(false);

  // DI
  protected readonly dataService = inject(UserService);
  protected readonly toastService = inject(ToastService);
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly credentialsService = inject(CredentialsService);

  // Obj
  readonly id: number = inject<{ id: number }>(DIALOG_DATA).id;

  constructor() {
    // Check whether the user is a super administrator
    this.isAdministrator.set(this.credentialsService.checkUserRole('superadmin'));
  }

  ngOnInit(): void {
    this.getHistory();
  }

  getHistory() {
    this.isLoading.set(true);
    this.dataService
      .getHistory(this.id!)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.body != null) {
            this.history = res.body.map((value: { diff: string }) => {
              return {
                ...value,
                diff: JSON.parse(value.diff),
              };
            });
          }
        },
        error: () => {
          // Failed to fetch the change history for the selected item!
          this.toastService.show('error', 'main.global.history.message.error.cantLoad');
          this.close();
        },
      });
  }

  close() {
    this.ref.close();
  }
}
