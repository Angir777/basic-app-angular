import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable, type Type } from '@angular/core';

import {
  APP_DIALOG_MAX_HEIGHT,
  APP_DIALOG_MAX_WIDTH,
  APP_DIALOG_SHELL_OPTIONS,
  AppDialogShellComponent,
} from './dialog-shell.component';

export interface AppDialogConfig<D> {
  /** Title translation key. */
  title: string;
  /** Dialog width, e.g. '1000px'. Limited to 95vw on small screens. */
  width?: string;
  /** Data available in the content component via `DIALOG_DATA`. */
  data?: D;
  /** Maximize button in the header. */
  maximizable?: boolean;
  /** Prevents closing with Esc and by clicking the backdrop. */
  disableClose?: boolean;
}

/** Reference to a dialog opened by `AppDialogService`. */
export type AppDialogRef<R = unknown> = DialogRef<R, AppDialogShellComponent>;

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  private readonly dialog = inject(Dialog);

  open<R = unknown, D = unknown>(
    component: Type<unknown>,
    config: AppDialogConfig<D>,
  ): AppDialogRef<R> {
    const width = config.width ?? '600px';
    const titleId = `app-dialog-title-${nextId++}`;

    return this.dialog.open<R, D, AppDialogShellComponent>(AppDialogShellComponent, {
      data: config.data,
      width,
      maxWidth: APP_DIALOG_MAX_WIDTH,
      maxHeight: APP_DIALOG_MAX_HEIGHT,
      disableClose: config.disableClose ?? false,
      ariaLabelledBy: titleId,
      backdropClass: ['cdk-overlay-dark-backdrop', 'bg-black/50!'],
      providers: [
        {
          provide: APP_DIALOG_SHELL_OPTIONS,
          useValue: {
            component,
            title: config.title,
            titleId,
            width,
            maximizable: config.maximizable ?? false,
          },
        },
      ],
    });
  }
}
