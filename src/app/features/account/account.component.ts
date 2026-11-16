import { Component } from '@angular/core';
import { ZardTabsImports } from '@/zardui/components/tabs';
import { UserDetailsTabComponent } from './components/user-details-tab/user-details-tab.component';
import { UserSettingsTabComponent } from './components/user-settings-tab/user-settings-tab.component';
import { CommonModule } from '@angular/common';
import { TranslatePipe  } from '@ngx-translate/core';
import { UserPasswordTabComponent } from './components/user-password-tab/user-password-tab.component';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    TranslatePipe,
    ...ZardTabsImports,
    UserDetailsTabComponent,
    UserPasswordTabComponent,
    UserSettingsTabComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  protected activeTab = 0;
}
