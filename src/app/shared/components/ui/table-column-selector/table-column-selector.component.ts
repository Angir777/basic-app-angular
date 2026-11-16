import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';

import { ZardCheckboxComponent } from '@/zardui/components/checkbox';

@Component({
  selector: 'app-table-column-selector',
  imports: [FormsModule, NgSelectModule, TranslatePipe, ZardCheckboxComponent],
  templateUrl: './table-column-selector.component.html',
  styleUrl: './table-column-selector.component.scss',
})
export class TableColumnSelectorComponent {
  readonly allColumns = input.required<string[]>();
  readonly columnTranslations = input.required<Record<string, string>>();

  readonly selectedColumns = input.required<string[]>();
  readonly selectedColumnsChange = output<string[]>();

  onColumnsChange(columns: string[]): void {
    const orderedColumns = this.allColumns().filter((column) => columns.includes(column));

    this.selectedColumnsChange.emit(orderedColumns);
  }
}
