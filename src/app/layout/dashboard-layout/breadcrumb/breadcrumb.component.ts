import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse } from '@fortawesome/free-regular-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ZardBreadcrumbImports } from '@/zardui/components/breadcrumb';

import { BreadcrumbService } from './service/breadcrumb.service';

interface BreadcrumbViewItem {
  label: string;
  routerLink: string;
  disabled: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [...ZardBreadcrumbImports, FontAwesomeModule, TranslatePipe],
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  // Icons
  protected readonly icons = {
    house: faHouse,
  };

  // "Pill" style – always white text, because the breadcrumb sits on an image background
  protected readonly pillClasses =
    'inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-white ' +
    'transition-colors hover:text-white hover:bg-white/14 hover:border-white/10 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  // State
  pageTitle = signal('');
  pageDescription = signal('');

  items = signal<BreadcrumbViewItem[]>([]);

  protected readonly homeLink = '/';

  // DI
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly translate = inject(TranslateService);

  ngOnInit() {
    this.breadcrumbService.breadcrumbs.subscribe((breadcrumbs) => {
      const mapped = breadcrumbs.map((b, index) => ({
        label: this.translate.instant(b.breadcrumb),
        routerLink: b.url,
        disabled: b.clickable === false || index === breadcrumbs.length - 1,
      }));

      this.items.set(mapped);

      const last = breadcrumbs[breadcrumbs.length - 1];

      // Page title
      this.pageTitle.set(last ? this.translate.instant(last.breadcrumb) : '');

      // Page description
      this.pageDescription.set(last?.description ? this.translate.instant(last.description) : '');
    });
  }
}
