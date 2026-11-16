import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import {
  AppDialogService,
  type AppDialogRef,
  ChangelogDetailsModalComponent,
} from '../../../shared/components/ui';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly version = environment.VERSION;
  readonly currentYear = new Date().getFullYear();

  // TODO: Check whether the system is up
  systemIsAvailable = signal(true);

  // Modal reference
  ref: AppDialogRef | null = null;

  // DI
  protected readonly dialogService = inject(AppDialogService);

  openChangelog(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.ref = this.dialogService.open(ChangelogDetailsModalComponent, {
      title: 'layout.header.changes',
      width: '800px',
      maximizable: true,
    });
  }
}
