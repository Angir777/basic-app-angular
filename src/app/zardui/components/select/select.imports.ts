import {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from '@/zardui/components/select/select-group.component';
import { ZardSelectItemComponent } from '@/zardui/components/select/select-item.component';
import { ZardSelectComponent } from '@/zardui/components/select/select.component';

export const ZardSelectImports = [
  ZardSelectComponent,
  ZardSelectGroupComponent,
  ZardSelectItemComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
] as const;
