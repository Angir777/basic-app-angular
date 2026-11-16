import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';
import { CommonModule } from '@angular/common';
import { ZardButtonComponent } from '@/zardui/components/button/button.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule, ZardButtonComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  theme$ = this.themeService.theme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
