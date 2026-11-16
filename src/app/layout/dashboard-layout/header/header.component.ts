import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NotificationDropdownComponent } from './notification-dropdown/notification-dropdown.component';
import { LanguageDropdownComponent } from './language-dropdown/language-dropdown.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../../../shared/components/ui';
import { CredentialsService } from '../../../core/services';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { ZardSidebarImports } from '@/zardui/components/sidebar/sidebar.imports';
import { ZardSeparatorComponent } from '@/zardui/components/separator/separator.component';
import { ZardInputComponent } from '@/zardui/components/input/input.component';

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    NgIcon,
    ThemeToggleComponent,
    LanguageDropdownComponent,
    NotificationDropdownComponent,
    ZardSeparatorComponent,
    ZardInputComponent,
    ...ZardSidebarImports,
  ],
  viewProviders: [provideIcons({ lucideSearch })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // DI
  private readonly credentialsService = inject(CredentialsService);

  readonly webNotificationsEnabled = computed(
    () => this.credentialsService.credentialsSignal()?.settings?.['webNotifications'] === true,
  );

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
