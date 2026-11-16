import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../shared/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backdrop',
  imports: [CommonModule],
  templateUrl: './backdrop.component.html',
  styleUrl: './backdrop.component.scss',
})
export class BackdropComponent {
  // State
  readonly isMobileOpen$;

  // DI
  public readonly sidebarService = inject(SidebarService);

  constructor() {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  closeSidebar() {
    this.sidebarService.setMobileOpen(false);
  }
}
