import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GridShapeComponent } from '../../../shared/components';

@Component({
  selector: 'app-not-found',
  imports: [TranslatePipe, RouterModule, GridShapeComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  currentYear: number = new Date().getFullYear();
}
