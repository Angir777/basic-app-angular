import { DestroyRef, inject, Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Breadcrumb {
  breadcrumb: string;
  description?: string;
  url: string;
  clickable?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // State
  breadcrumbs: Observable<Breadcrumb[]>;
  private _breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

  // DI
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.breadcrumbs = this._breadcrumbs.asObservable();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.buildBreadcrumbs());
  }

  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    let currentRoute: ActivatedRoute | null = this.route.root;
    let url = '';

    do {
      const childrenRoutes = currentRoute.children;
      currentRoute = null;

      childrenRoutes.forEach((route) => {
        if (route.outlet === 'primary') {
          const snapshot = route.snapshot;

          const routeUrl = snapshot.url.map((segment) => segment.path).join('/');

          if (routeUrl) {
            url += `/${routeUrl}`;
          }

          const breadcrumb = snapshot.data['breadcrumb'];
          const description = snapshot.data['description'];
          const hasUrlSegment = snapshot.url.length > 0;

          if (breadcrumb && hasUrlSegment) {
            breadcrumbs.push({
              breadcrumb: breadcrumb,
              description: description,
              url,
              clickable: snapshot.data['clickable'] === true,
            });
          }

          currentRoute = route;
        }
      });
    } while (currentRoute);

    this._breadcrumbs.next(breadcrumbs);
  }
}
