import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut, lucideUser } from '@ng-icons/lucide';
import { ZardDropdownImports } from '@/zardui/components/dropdown/dropdown.imports';
import { AuthenticationService } from '../../../../shared/services';
import { CredentialsService } from '../../../../core/services';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe, NgIcon, ...ZardDropdownImports],
  viewProviders: [provideIcons({ lucideLogOut, lucideUser })],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent {
  // State
  userName!: string;
  userEmail!: string;
  avatarUrl: string | null = null;

  // DI
  private readonly credentialsService = inject(CredentialsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  protected readonly credentials = this.credentialsService.credentialsSignal;

  get userInitials(): string {
    const credentials = this.credentials();

    if (!credentials) {
      return '';
    }

    return `${credentials.firstName?.charAt(0) ?? ''}${credentials.lastName?.charAt(0) ?? ''}`;
  }

  // Go to account
  goToAccount() {
    this.router.navigate(['/account']);
  }

  // Log out
  logOut() {
    this.authenticationService.logOut();
  }
}
