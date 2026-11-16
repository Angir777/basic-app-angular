import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export class MultiTranslateHttpLoaderHelper {
  constructor(
    private http: HttpClient,
    private resources: string[],
    private appVersion?: string,
  ) {}

  getTranslation(lang: string): Observable<Record<string, string>> {
    const versionQuery = this.appVersion ? `?v=${this.appVersion}` : '';

    const requests: Observable<Record<string, string>>[] = this.resources.map((path) =>
      this.http.get<Record<string, string>>(`/assets/i18n/${lang}/${path}.json${versionQuery}`),
    );

    return forkJoin(requests).pipe(map((response) => Object.assign({}, ...response)));
  }
}
