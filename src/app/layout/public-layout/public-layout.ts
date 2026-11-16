import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleTwoComponent } from '../../shared/components/ui/theme-toggle-two/theme-toggle-two.component';
import { CommonModule } from '@angular/common';
import { faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardSelectImports } from '@/zardui/components/select';

@Component({
  selector: 'app-public-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslatePipe,
    FontAwesomeModule,
    ThemeToggleTwoComponent,
    FormsModule,
    ZardSelectImports,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout implements OnInit {
  protected readonly icons = {
    globe: faEarthEurope,
  };

  protected languages: string[] = [];

  private readonly i18nService = inject(I18nService);

  ngOnInit() {
    this.languages = this.i18nService.supportedLanguages;
  }

  setLanguage(lang: string) {
    this.i18nService.language = lang;
  }

  onLanguageChange(value: string | string[]): void {
    if (typeof value === 'string') {
      this.setLanguage(value);
    }
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }
}
