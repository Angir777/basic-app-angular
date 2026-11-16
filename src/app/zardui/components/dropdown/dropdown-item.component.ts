import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/zardui/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, type ZardDropdownItemTypeVariants } from './dropdown.variants';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'dropdown-menu-item',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-variant]': 'itemVariant()',
    '[attr.data-inset]': 'isInset() || null',
    '[attr.aria-disabled]': 'isDisabled()',
    '(click.prevent-with-stop)': 'onClick()',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)',
    role: 'menuitem',
    tabindex: '0',
  },
  exportAs: 'zDropdownMenuItem',
})
export class ZardDropdownMenuItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemTypeVariants>('default');
  readonly zType = input<ZardDropdownItemTypeVariants | undefined>(undefined);
  readonly zVariant = input<ZardDropdownItemTypeVariants | undefined>(undefined);
  readonly inset = input(false, { transform: booleanAttribute });
  readonly zInset = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly class = input<ClassValue>('');

  onClick() {
    if (this.isDisabled()) {
      return;
    }

    setTimeout(() => {
      this.dropdownService.closeAndFocusTrigger();
    }, 0);
  }

  onKeydown(event: Event) {
    event.preventDefault();

    if (this.isDisabled()) {
      return;
    }

    (event.target as HTMLElement).click();
  }

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly itemVariant = computed(
    () => this.zType() ?? this.zVariant() ?? this.variant(),
  );
  protected readonly isInset = computed(() => this.zInset() ?? this.inset());

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownItemVariants({
        variant: this.itemVariant(),
        inset: this.isInset(),
      }),
      'cursor-pointer',
      this.class(),
    ),
  );
}
