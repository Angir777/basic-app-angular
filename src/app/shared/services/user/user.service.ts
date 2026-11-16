import { Injectable } from '@angular/core';
import { BaseRestService } from '../base-rest.service';
import { User, UserId } from '../../interfaces';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

type EntityResponse = HttpResponse<User>;

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseRestService<User> {
  protected override resourceUrl = 'user';

  // Restore a user.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restore(id: any): Observable<EntityResponse> {
    return this.http.delete<User>(`${this.resourceUrl}/${id}/restore`, { observe: 'response' });
  }

  // Assign roles.
  attachRoles(userId: UserId, selectedRolesIds: number[]): Observable<User> {
    const body = {
      selectedRolesIds,
    };

    return this.http.put<User>(`${this.resourceUrl}/attach-roles/${userId}`, body).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
