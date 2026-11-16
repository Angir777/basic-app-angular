import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = (localStorage.getItem('THEME_APP') as Theme) || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('THEME_APP', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-neutral-950');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-neutral-950');
    }
  }
}
