import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHistoryModalComponent } from './role-history-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

describe('RoleHistoryModalComponent', () => {
  let component: RoleHistoryModalComponent;
  let fixture: ComponentFixture<RoleHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleHistoryModalComponent],
      providers: [
        { provide: DialogRef, useValue: { close: vi.fn() } },
        { provide: DIALOG_DATA, useValue: { id: 1 } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleHistoryModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
