/* eslint-disable */
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../interfaces';
import { prepareRequestParams } from '../utils';
import { inject } from '@angular/core';

export abstract class BaseRestService<T> {
  readonly http = inject(HttpClient);
  protected abstract resourceUrl: string;

  getAll(req?: any): Observable<HttpResponse<T[]>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.get<T[]>(`${this.resourceUrl}/get-all`, {
      params,
      observe: 'response',
    });
  }

  query(req?: any): Observable<HttpResponse<PaginatedResponse<T>>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.get<PaginatedResponse<T>>(`${this.resourceUrl}`, {
      params,
      observe: 'response',
    });
  }

  queryDeleted(req?: any): Observable<HttpResponse<PaginatedResponse<T>>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.get<PaginatedResponse<T>>(`${this.resourceUrl}/deleted`, {
      params,
      observe: 'response',
    });
  }

  getById(id: any, req?: any): Observable<HttpResponse<T>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.get<T>(`${this.resourceUrl}/${id}`, {
      params,
      observe: 'response',
    });
  }

  create(postData: T, req?: any): Observable<HttpResponse<T>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.post<T>(`${this.resourceUrl}`, postData, {
      params,
      observe: 'response',
    });
  }

  update(postData: T, req?: any): Observable<HttpResponse<T>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.put<T>(`${this.resourceUrl}/${(postData as any).id}`, postData, {
      params,
      observe: 'response',
    });
  }

  delete(id: any, req?: any): Observable<HttpResponse<any>> {
    const params: HttpParams = prepareRequestParams(req);

    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      params,
      observe: 'response',
    });
  }

  getHistory(id: number | string, req?: any): Observable<HttpResponse<any>> {
    const params = prepareRequestParams(req);

    return this.http.get<any>(`${this.resourceUrl}/history/${id}`, {
      params,
      observe: 'response',
    });
  }
}
