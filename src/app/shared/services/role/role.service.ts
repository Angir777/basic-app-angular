import { Injectable } from '@angular/core';
import { BaseRestService } from '../base-rest.service';
import { Observable } from 'rxjs';
import { Permission, Role } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseRestService<Role> {
  protected override resourceUrl = 'role';

  // Permissions.
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.resourceUrl}/get-permissions`);
  }
}
