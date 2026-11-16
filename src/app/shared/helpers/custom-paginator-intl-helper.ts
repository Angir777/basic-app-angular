import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorIntlHelper extends MatPaginatorIntl {
  private readonly translateService = inject(TranslateService);

  constructor() {
    super();

    this.getTranslations();

    // If the language changes, we update the texts
    this.translateService.onLangChange.subscribe(() => {
      this.getTranslations();
      this.changes.next();
    });
  }

  // Changing translations in 'mat-paginator'
  private getTranslations() {
    this.itemsPerPageLabel = this.translateService.instant('main.paginator.itemsPerPage');
    this.nextPageLabel = this.translateService.instant('main.paginator.nextPage');
    this.previousPageLabel = this.translateService.instant('main.paginator.previousPage');
    this.firstPageLabel = this.translateService.instant('main.paginator.firstPage');
    this.lastPageLabel = this.translateService.instant('main.paginator.lastPage');
    this.lastPageLabel = this.translateService.instant('main.paginator.lastPage');
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translateService.instant('paginator.of')} ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${this.translateService.instant(
      'main.paginator.of',
    )} ${length}`;
  };
}
