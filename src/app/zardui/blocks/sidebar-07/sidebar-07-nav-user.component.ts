import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/zardui/components/avatar/avatar.component';
import type { ZardDropdownSide } from '@/zardui/components/dropdown/dropdown-positions';
import { ZardDropdownImports } from '@/zardui/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/zardui/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@/zardui/components/sidebar/sidebar.service';
import { AuthenticationService } from '../../../shared/services';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

export interface Sidebar07User {
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-sidebar-07-nav-user',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, ZardAvatarComponent, NgIcon, TranslatePipe, RouterLink],
  viewProviders: [
    provideIcons({
      lucideBadgeCheck,
      lucideBell,
      lucideChevronsUpDown,
      lucideCreditCard,
      lucideLogOut,
      lucideSparkles,
    }),
  ],
  templateUrl: './sidebar-07-nav-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar07NavUserComponent {
  // DI
  private readonly sidebar = inject(ZardSidebarService);
  private readonly authenticationService = inject(AuthenticationService);

  /** shadcn opens these menus to the side of the sidebar on desktop and below the trigger on mobile. */
  protected readonly menuSide = computed<ZardDropdownSide>(() =>
    this.sidebar.isMobile() ? 'bottom' : 'right',
  );

  readonly user = input.required<Sidebar07User>();

  protected readonly userInitials = computed(() => {
    return this.user()
      .name.split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  // Wyloguj
  logOut() {
    this.authenticationService.logOut();
  }
}
