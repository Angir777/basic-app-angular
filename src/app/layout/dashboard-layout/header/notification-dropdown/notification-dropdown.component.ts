import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardAvatarComponent } from '@/zardui/components/avatar/avatar.component';
import { ZardButtonComponent } from '@/zardui/components/button/button.component';
import { ZardDropdownImports } from '@/zardui/components/dropdown/dropdown.imports';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [
    TranslatePipe,
    NgIcon,
    ZardAvatarComponent,
    ZardButtonComponent,
    ...ZardDropdownImports,
  ],
  viewProviders: [provideIcons({ lucideBell })],
  templateUrl: './notification-dropdown.component.html',
})
export class NotificationDropdownComponent {
  // TODO: New notifications
  notifications = [
    {
      user: 'John Doe',
      message: 'Example new notification..',
      time: '5 min ago',
      avatar: '/assets/images/avatar/avatar.png',
      online: true,
    },
  ];
}
