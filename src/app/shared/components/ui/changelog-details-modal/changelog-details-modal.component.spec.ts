import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogDetailsModalComponent } from './changelog-details-modal.component';
import { DialogRef } from '@angular/cdk/dialog';
import { provideMarkdown } from 'ngx-markdown';

describe('ChangelogDetailsModalComponent', () => {
  let component: ChangelogDetailsModalComponent;
  let fixture: ComponentFixture<ChangelogDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangelogDetailsModalComponent],
      providers: [provideMarkdown(), { provide: DialogRef, useValue: { close: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogDetailsModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
