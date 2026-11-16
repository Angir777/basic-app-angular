import { HttpResponse } from '@angular/common/http';
import {
  Component,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { merge, startWith, switchMap, map, catchError, of } from 'rxjs';
import { BaseRestService, ToastService } from '../../services';
import { prepareSortParams } from '../../utils';
import { PaginatedResponse } from '../../interfaces';
import { BaseMatTableQueryComponent } from '../base-components/base-mat-table-query.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  template: '',
})
export abstract class MatTableComponent<T>
  extends BaseMatTableQueryComponent
  implements AfterViewInit
{
  // State
  data: T[] = [];
  appendedCriteria = {};
  isMobileView = false;

  protected abstract dataService: BaseRestService<T>;

  // DI
  private cdr = inject(ChangeDetectorRef);
  private breakpointObserver = inject(BreakpointObserver);
  protected readonly toastService = inject(ToastService);

  protected constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject('storageKeyPageSize') storageKeyPageSize: string,
  ) {
    super(storageKeyPageSize);

    this.breakpointObserver.observe(['(max-width: 1023px)']).subscribe((result) => {
      this.isMobileView = result.matches;
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.initDataReceiving();
  }

  // Base endpoint for reading data
  protected get fetchMethod() {
    return this.dataService.query.bind(this.dataService);
  }

  initDataReceiving() {
    // If the user changes the sort order, go back to the first page.
    this.sort.sortChange.subscribe(() => {
      // Disabled on the first render
      if (!this.firstRender()) {
        this.resetPaginator();
      }
      this.firstRender.set(false);
    });

    // Apply data from the remembered table state
    if (this.saveState) {
      // Refresh changes and display the remembered table settings
      this.cdr.detectChanges();

      // Set the arrow for the remembered sorting
      this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });
    }

    merge(this.sort.sortChange, this.paginator.page, this.filterSubject$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);

          return this.fetchMethod({
            sort: prepareSortParams(this.sort.active, this.sort.direction),
            page: this.paginator.pageIndex + 1,
            page_size: this.paginator.pageSize,
            ...this.criteria,
            ...this.appendedCriteria,
          });
        }),
        map((data: HttpResponse<PaginatedResponse<T>>) => {
          this.isLoadingResults.set(false);

          if (data.body != null) {
            this.resultsLength.set(data.body.total ?? 0);
            return data.body.data ?? [];
          }

          return [];
        }),
        catchError(() => {
          this.isLoadingResults.set(false);

          this.toastService.show('error', 'main.global.message.error.cantGetData');

          return of([]);
        }),
      )
      .subscribe((data) => (this.data = data));
  }
}
