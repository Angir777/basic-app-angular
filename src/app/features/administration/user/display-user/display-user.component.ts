import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import {
  LoaderComponent,
  CancelButtonComponent,
  BaseDisplayComponent,
} from '../../../../shared/components';
import { DisplayComponent, Permission, User } from '../../../../shared/interfaces';
import { UserService, ToastService } from '../../../../shared/services';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-display-user',
  imports: [
    CommonModule,
    LoaderComponent,
    TranslatePipe,
    FontAwesomeModule,
    CancelButtonComponent,
  ],
  templateUrl: './display-user.component.html',
  styleUrl: './display-user.component.scss',
})
export class DisplayUserComponent extends BaseDisplayComponent implements OnInit, DisplayComponent {
  // Icons
  protected readonly faArrowLeft = faArrowLeft;

  // Model
  protected user = signal<User | null>(null);

  DATETIME_DISPLAY_HISTORY_FORMAT = environment.DATETIME_DISPLAY_HISTORY_FORMAT;

  // DI
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.getById(params['id']);
      }
    });
  }

  /**
   * Fetch the data of the currently displayed model
   */
  getById(id: string): void {
    this.isLoading.set(true);
    this.userService
      .getById(id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.user.set(res.body);
          }
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }

  /**
   * Load all permissions from the user's roles
   */
  getPermissions(): Permission[] {
    const permissions = this.user()?.roles?.flatMap((role) => role.permissions ?? []) ?? [];

    return permissions.filter(
      (permission, index, array) => array.findIndex((item) => item.id === permission.id) === index,
    );
  }
}
