import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ZardSonnerService } from '@/zardui/components/sonner';

export type ToastType = 'success' | 'error' | 'warn' | 'info';

/**
 * Standard toast:
 * this.toastService.show('error', 'auth.confirmAccount.messages.error.' + errorCode);
 *
 * Toast with extra parameters (display time, translation parameters):
 * this.toastService.show('error', 'user.message.error.cantDelete', 5000, { name: user.name });
 *
 * Toasts are rendered by `<z-sonner>` placed in `app.html`.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly sonner = inject(ZardSonnerService);
  private readonly translate = inject(TranslateService);

  private summaryMap: Record<ToastType, string> = {
    success: 'main.global.toast.success',
    error: 'main.global.toast.error',
    warn: 'main.global.toast.warning',
    info: 'main.global.toast.info',
  };

  show(
    type: ToastType, // Notification type
    detailKey: string, // Message content
    life = 3000, // Display time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any> = {},
  ) {
    const summary = this.translate.instant(this.summaryMap[type]);
    const options = {
      description: this.translate.instant(detailKey, params),
      duration: life,
    };

    switch (type) {
      case 'success':
        this.sonner.success(summary, options);
        break;
      case 'error':
        this.sonner.error(summary, options);
        break;
      case 'warn':
        this.sonner.warning(summary, options);
        break;
      case 'info':
        this.sonner.info(summary, options);
        break;
    }
  }
}
