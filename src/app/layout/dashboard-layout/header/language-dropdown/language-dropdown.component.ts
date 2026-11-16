import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLanguages } from '@ng-icons/lucide';
import { I18nService } from '../../../../core/services';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardButtonComponent } from '@/zardui/components/button/button.component';
import { ZardDropdownImports } from '@/zardui/components/dropdown/dropdown.imports';

@Component({
  selector: 'app-language-dropdown',
  imports: [TranslatePipe, NgIcon, ZardButtonComponent, ...ZardDropdownImports],
  viewProviders: [provideIcons({ lucideLanguages })],
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss',
})
export class LanguageDropdownComponent {
  // DI
  private readonly i18nService = inject(I18nService);

  // Available languages
  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  // Current language
  get currentLanguage(): string {
    return this.i18nService.language;
  }

  // Select language
  setLanguage(language: string | undefined) {
    if (!language || language === this.currentLanguage) {
      return;
    }
    this.i18nService.language = language;
    localStorage.setItem('language', language);
    location.reload();
  }
}
