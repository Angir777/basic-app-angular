import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

interface CustomOptions {
  confirmButtonTextTranslation?: string;
  cancelButtonTextTranslation?: string;
  titleTranslationKey?: string;
  titleTranslationParams?: Record<string, string | number | boolean>;
}

type SweetAlertOptionsCustom = SweetAlertOptions & CustomOptions;

@Injectable({
  providedIn: 'root',
})
export class TranslatedSwalService {
  private readonly translateService = inject(TranslateService);

  async show(
    type: SweetAlertIcon,
    translationKey: string,
    translationParams: Record<string, string | number | boolean>,
  ) {
    const translation = await firstValueFrom(
      this.translateService.get(translationKey, translationParams),
    );

    await swal.fire({
      icon: type,
      text: translation,
    });
  }

  async showAsync(
    translationKey: string,
    translationParams: Record<string, string | number | boolean>,
    settings: SweetAlertOptionsCustom = {},
  ): Promise<SweetAlertResult> {
    const swalSettings: SweetAlertOptions = {
      icon: 'success',
      text: await firstValueFrom(this.translateService.get(translationKey, translationParams)),
    };

    if (settings.titleTranslationKey != null) {
      swalSettings.title = await firstValueFrom(
        this.translateService.get(settings.titleTranslationKey, settings.titleTranslationParams),
      );
    }

    if (settings.confirmButtonTextTranslation != null) {
      swalSettings.confirmButtonText = await firstValueFrom(
        this.translateService.get(settings.confirmButtonTextTranslation),
      );
    }

    if (settings.cancelButtonTextTranslation != null) {
      swalSettings.cancelButtonText = await firstValueFrom(
        this.translateService.get(settings.cancelButtonTextTranslation),
      );
    }

    return await swal.fire({
      ...swalSettings,
      ...settings,
    } as SweetAlertOptions);
  }

  close(): void {
    void swal.close();
  }
}
