import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * OPTIONAL: Usage options
 *
 * Button with the default translation that goes back in history
 * <app-cancel-button></app-cancel-button>
 *
 * Button with a specific translation that navigates to a specific page
 * <app-cancel-button [link]="['/home']" label="global.button.cancel"></app-cancel-button>
 *
 * Plain back navigation
 * <app-cancel-button></app-cancel-button>
 *
 * Close the modal
 * <app-cancel-button label="global.button.close" (clicked)="closeModal()"></app-cancel-button>
 */

@Component({
  selector: 'app-cancel-button',
  imports: [CommonModule, FontAwesomeModule, TranslatePipe, RouterModule],
  templateUrl: './cancel-button.component.html',
  styleUrl: './cancel-button.component.scss',
})
export class CancelButtonComponent {
  protected readonly faArrowLeft = faArrowLeft;

  @Input() link: string | string[] | null = null;
  @Input() label = 'main.global.button.goBack';
  @Input() showIcon = true;

  @Output() clicked = new EventEmitter<void>();

  goBack(event: Event): void {
    event.preventDefault();

    if (this.link) {
      return;
    }

    if (this.clicked.observed) {
      this.clicked.emit();
      return;
    }

    window.history.back();
  }
}
