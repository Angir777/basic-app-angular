import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CancelButtonComponent,
  BaseDisplayComponent,
  LoaderComponent,
} from '../../../../shared/components';
import { ActivatedRoute, Params } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { DisplayComponent, Role } from '../../../../shared/interfaces';
import { RoleService, ToastService } from '../../../../shared/services';

@Component({
  selector: 'app-display-role',
  imports: [
    CommonModule,
    LoaderComponent,
    TranslatePipe,
    FontAwesomeModule,
    CancelButtonComponent,
  ],
  templateUrl: './display-role.component.html',
  styleUrl: './display-role.component.scss',
})
export class DisplayRoleComponent extends BaseDisplayComponent implements OnInit, DisplayComponent {
  // Icons
  protected readonly faArrowLeft = faArrowLeft;

  // Model
  protected role = signal<Role | null>(null);

  // DI
  private readonly route = inject(ActivatedRoute);
  private readonly roleService = inject(RoleService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.getById(+params['id']);
      }
    });
  }

  /**
   * Fetch the data of the currently displayed model
   */
  getById(organizationStructureId: number): void {
    this.isLoading.set(true);
    this.roleService
      .getById(organizationStructureId)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.role.set(res.body);
          }
        },
        error: () => {
          this.toastService.show('error', 'main.global.message.error.cantGetData');
        },
      });
  }
}
