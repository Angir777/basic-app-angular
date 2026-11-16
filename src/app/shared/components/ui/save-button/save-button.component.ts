import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * OPTIONAL: Usage options
 *
 * Submit (form)
 * <app-save-button type="submit" [loading]="isSaving()" [preview]="inPreview()"></app-save-button>
 *
 * Normal button + lg + click
 * <app-save-button size="lg" type="button" [loading]="isSaving()" (clicked)="save()"></app-save-button>
 */

@Component({
  selector: 'app-save-button',
  imports: [CommonModule, FontAwesomeModule, TranslatePipe],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
  protected readonly faSpinner = faSpinner;
  protected readonly faSave = faSave;

  @Input() loading = false;
  @Input() preview = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() disabled = false;
  @Input() form?: string;
  @Input() label = 'main.global.button.save';

  @Output() clicked = new EventEmitter<void>();

  get sizeClass(): string {
    switch (this.size) {
      case 'lg':
        return 'px-5 py-3 text-base';

      case 'md':
        return 'px-4 py-2 text-sm';

      default:
        return 'px-3 py-1.5 text-sm';
    }
  }

  onClick(event: Event): void {
    if (this.type === 'button') {
      event.preventDefault();
    }

    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
