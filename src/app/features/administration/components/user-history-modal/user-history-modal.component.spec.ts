import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryModalComponent } from './user-history-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

describe('UserHistoryModalComponent', () => {
  let component: UserHistoryModalComponent;
  let fixture: ComponentFixture<UserHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHistoryModalComponent],
      providers: [
        { provide: DialogRef, useValue: { close: vi.fn() } },
        { provide: DIALOG_DATA, useValue: { id: 1 } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHistoryModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
