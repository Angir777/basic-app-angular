import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  signal,
  Inject,
  HostListener,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

type FilterParams = Record<string, string | number | boolean | (string | number)[]>;

interface TableState {
  saveState?: boolean;
  pageSize?: number;
  pageIndex?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  criteria?: FilterParams;
  displayedColumns?: string[];
}

@Component({
  template: '',
})
export abstract class BaseMatTableQueryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterSubject$: Subject<FilterParams | null> = new Subject<FilterParams | null>();

  // Filter criteria for individual columns.
  criteria: FilterParams = {};
  criteriaChangedSubject$: Subject<FilterParams> = new Subject<FilterParams>();

  // Whether the component is being rendered for the first time.
  firstRender = signal(true);

  // Loader.
  isLoadingResults = signal(true);

  // Number of records to display.
  resultsLength = signal(0);

  // Is the "Remember state" switch visible?
  canChangeSaveState = signal(false);

  // Should settings be saved in localStorage?
  saveState = false;

  // Key under which this component's configuration is stored in localStorage.
  protected LOCAL_STORAGE_SAVED_STATE_KEY: string;
  tableState: string | null = null;

  // Initial paginator values.
  pageSize = environment.DEFAULT_PAGE_SIZE;
  pageSizeOptions = environment.PAGE_SIZES;

  // Table key.
  storageKeyPageSize: string | null = null;

  // Prevent tabbing through sort headers (labels).
  labelEnabled: Record<string, boolean> = {};

  // Displayed columns.
  displayedColumns: string[] = [];

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject('storageKeyPageSize') storageKeyPageSize: string,
  ) {
    this.storageKeyPageSize = storageKeyPageSize;

    this.LOCAL_STORAGE_SAVED_STATE_KEY = `${this.storageKeyPageSize}-state-table`;
    this.tableState = localStorage.getItem(this.LOCAL_STORAGE_SAVED_STATE_KEY);
  }

  ngOnInit(): void {
    // Option allowing table settings to be remembered.
    this.canChangeSaveState.set(true);
  }

  ngOnDestroy(): void {
    this.persistState();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (this.canChangeSaveState()) {
      this.persistState();
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator == null) {
      throw new Error('Paginator is null');
    }
    if (this.sort == null) {
      throw new Error('Sort is null');
    }
    this.restoreState();
    this.prepareCriteriaChangedSubject();
  }

  // Save the table state to local storage.
  persistState(): void {
    if (!this.saveState) {
      return;
    }

    localStorage.setItem(
      this.LOCAL_STORAGE_SAVED_STATE_KEY,
      JSON.stringify({
        saveState: this.saveState,
        pageSize: this.paginator.pageSize,
        pageIndex: this.paginator.pageIndex,
        sortColumn: this.sort.active,
        sortDirection: this.sort.direction,
        criteria: this.criteria,
        displayedColumns: this.displayedColumns,
      }),
    );
  }

  // Restore the table state from local storage.
  restoreState(): void {
    if (this.tableState != null) {
      // Remove the current table settings.
      localStorage.removeItem(this.LOCAL_STORAGE_SAVED_STATE_KEY);

      // Assign the current table settings read before they were removed.
      const restoredState: TableState = JSON.parse(this.tableState);

      if (restoredState.saveState != null) {
        this.saveState = restoredState.saveState;
      }
      if (restoredState.pageSize != null) {
        this.paginator.pageSize = restoredState.pageSize;
      }
      if (restoredState.pageIndex != null) {
        this.paginator.pageIndex = restoredState.pageIndex;
      }
      if (restoredState.sortColumn != null) {
        this.sort.active = restoredState.sortColumn;
      }
      if (restoredState.sortDirection != null) {
        this.sort.direction = restoredState.sortDirection;
      }
      if (restoredState.criteria != null) {
        this.criteria = restoredState.criteria;
      }
      if (restoredState.displayedColumns != null) {
        this.displayedColumns = restoredState.displayedColumns;
      }
    }
  }

  // Prepare the subject listening for filter changes.
  prepareCriteriaChangedSubject() {
    this.criteriaChangedSubject$
      .pipe(
        debounceTime(500),
        distinctUntilChanged((previousCriteria, currentCriteria) =>
          this.areCriteriaEqual(previousCriteria, currentCriteria),
        ),
        tap(() => {
          this.resetPaginator();
          this.filterSubject$.next(null);
        }),
      )
      .subscribe();
  }

  // Search using an input field.
  search(): void {
    this.criteriaChangedSubject$.next({ ...this.criteria });
  }

  private areCriteriaEqual(previousCriteria: FilterParams, currentCriteria: FilterParams): boolean {
    return JSON.stringify(previousCriteria) === JSON.stringify(currentCriteria);
  }

  // Search using a select field.
  onFilterSelect(): void {
    this.resetPaginator();
    this.filterSubject$.next(null);
  }

  // Reset pagination settings.
  resetPaginator(): void {
    if (this.paginator != null) {
      this.paginator.firstPage();
    }
  }

  // Refresh the table.
  refreshTable(): void {
    this.filterSubject$.next(null);
  }

  /**
   * Reset sorting.
   * @param active Sort column
   * @param direction Sort direction
   */
  resetSort(active: string, direction: SortDirection): void {
    if (this.sort) {
      this.sort.active = active;
      this.sort.direction = direction;

      // Emulate a sort event to trigger the sortChange subscription
      this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });
    }
  }
}
