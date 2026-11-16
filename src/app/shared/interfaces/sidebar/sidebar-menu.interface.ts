import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { PermissionModes } from '../../constants';

export interface NavItem {
  name: string;
  icon?: string; // svg
  faIcon?: IconDefinition; // fontawesome

  path?: string;
  new?: boolean;

  permissions?: string[];
  permissionsMode?: PermissionModes;

  subItems?: NavSubItem[];
}

export interface NavSubItem {
  name: string;
  path: string;

  pro?: boolean;
  new?: boolean;

  permissions?: string[];
  permissionsMode?: PermissionModes;
}
