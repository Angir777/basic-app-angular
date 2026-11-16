import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
})
export class LoaderComponent {
  // State
  @Input() isLoading = false;
  @Input() message: string | undefined;
}
