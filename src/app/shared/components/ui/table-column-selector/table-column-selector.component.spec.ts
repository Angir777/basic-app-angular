import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnSelectorComponent } from './table-column-selector.component';

describe('TableColumnSelectorComponent', () => {
  let component: TableColumnSelectorComponent;
  let fixture: ComponentFixture<TableColumnSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColumnSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableColumnSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('allColumns', ['id', 'name']);
    fixture.componentRef.setInput('columnTranslations', {
      id: 'main.global.id',
      name: 'main.global.name',
    });
    fixture.componentRef.setInput('selectedColumns', ['id']);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
