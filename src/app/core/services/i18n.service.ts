import { Injectable, inject } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Logger } from './logger.service';

const log = new Logger('DAILO');
const languageKey = 'language';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  supportedLanguages!: string[];

  private defaultLanguage!: string;
  private langChangeSubscription!: Subscription;

  private readonly translateService = inject(TranslateService);

  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;

    const savedLang = localStorage.getItem(languageKey) || defaultLanguage;
    this.language = savedLang;

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => localStorage.setItem(languageKey, event.lang),
    );
  }

  destroy() {
    this.langChangeSubscription?.unsubscribe();
  }

  set language(language: string) {
    const savedLang =
      localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();

    if (!language) {
      language = savedLang || this.defaultLanguage;
    }

    const isSupported = this.supportedLanguages.includes(language);
    if (!isSupported) {
      language = language.split('-')[0];
      language =
        this.supportedLanguages.find((lang) => lang.startsWith(language)) || this.defaultLanguage;
    }

    log.debug(`Language set to "${language}"`);
    this.translateService.use(language);
  }

  get language(): string {
    return this.translateService.getCurrentLang() ?? 'pl';
  }
}
