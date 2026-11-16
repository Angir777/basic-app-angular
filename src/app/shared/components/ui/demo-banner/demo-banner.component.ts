import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-demo-banner',
  imports: [TranslatePipe],
  templateUrl: './demo-banner.component.html',
  styleUrl: './demo-banner.component.scss',
})
export class DemoBannerComponent {
  // State
  @Output() closed = new EventEmitter<void>();

  closeTestBanner() {
    this.closed.emit();
  }
}
