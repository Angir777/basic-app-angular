import { DialogRef } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  signal,
  type Type,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMaximize2, lucideMinimize2, lucideX } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';

import { ZardButtonComponent } from '@/zardui/components/button';

export interface AppDialogShellOptions {
  component: Type<unknown>;
  title: string;
  titleId: string;
  width: string;
  maximizable: boolean;
}

export const APP_DIALOG_SHELL_OPTIONS = new InjectionToken<AppDialogShellOptions>(
  'APP_DIALOG_SHELL_OPTIONS',
);

export const APP_DIALOG_MAX_WIDTH = '95vw';
export const APP_DIALOG_MAX_HEIGHT = '95dvh';

/**
 * Dialog frame: header (title, maximize, close) and content.
 * The content component injects `DialogRef` and `DIALOG_DATA` from `@angular/cdk/dialog`.
 */
@Component({
  selector: 'app-dialog-shell',
  imports: [NgComponentOutlet, NgIcon, TranslatePipe, ZardButtonComponent],
  viewProviders: [provideIcons({ lucideMaximize2, lucideMinimize2, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full max-h-[inherit]' },
  template: `
    <div
      class="flex h-full max-h-[inherit] flex-col overflow-hidden bg-background text-foreground shadow-lg"
      [class]="maximized() ? 'rounded-none' : 'rounded-xl border border-border'"
    >
      <header class="flex shrink-0 items-center gap-2 px-6 pt-5 pb-3">
        <h2 [id]="options.titleId" class="text-lg leading-none font-semibold">
          {{ options.title | translate }}
        </h2>

        <div class="ml-auto flex items-center gap-1">
          @if (options.maximizable) {
            <button
              z-button
              type="button"
              zType="ghost"
              zSize="icon-sm"
              [attr.aria-label]="
                (maximized() ? 'main.global.button.restore' : 'main.global.button.maximize')
                  | translate
              "
              [attr.aria-pressed]="maximized()"
              (click)="toggleMaximize()"
            >
              <ng-icon [name]="maximized() ? 'lucideMinimize2' : 'lucideMaximize2'" />
            </button>
          }

          <button
            z-button
            type="button"
            zType="ghost"
            zSize="icon-sm"
            [attr.aria-label]="'main.global.button.close' | translate"
            (click)="dialogRef.close()"
          >
            <ng-icon name="lucideX" />
          </button>
        </div>
      </header>

      <div class="min-h-0 flex-1 overflow-auto px-6 pb-6">
        <ng-container *ngComponentOutlet="options.component" />
      </div>
    </div>
  `,
})
export class AppDialogShellComponent {
  protected readonly dialogRef = inject(DialogRef);
  protected readonly options = inject(APP_DIALOG_SHELL_OPTIONS);

  protected readonly maximized = signal(false);

  protected toggleMaximize(): void {
    const maximized = !this.maximized();
    this.maximized.set(maximized);

    this.dialogRef.overlayRef.updateSize(
      maximized
        ? { width: '100vw', height: '100dvh', maxWidth: '100vw', maxHeight: '100dvh' }
        : {
            width: this.options.width,
            height: '',
            maxWidth: APP_DIALOG_MAX_WIDTH,
            maxHeight: APP_DIALOG_MAX_HEIGHT,
          },
    );
  }
}
