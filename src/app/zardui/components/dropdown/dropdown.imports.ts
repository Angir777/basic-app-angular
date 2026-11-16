import { ZardDropdownMenuItemComponent } from '@/zardui/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/zardui/components/dropdown/dropdown-menu-content.component';
import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from '@/zardui/components/dropdown/dropdown-primitives.component';
import {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from '@/zardui/components/dropdown/dropdown-submenu.component';
import { ZardDropdownDirective } from '@/zardui/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from '@/zardui/components/dropdown/dropdown.component';

export const ZardDropdownImports = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuSubTriggerComponent,
  ZardDropdownMenuSubContentComponent,
  ZardDropdownDirective,
] as const;
