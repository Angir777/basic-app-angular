import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachRoleModalComponent } from './attach-role-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

describe('AttachRoleModalComponent', () => {
  let component: AttachRoleModalComponent;
  let fixture: ComponentFixture<AttachRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachRoleModalComponent],
      providers: [
        { provide: DialogRef, useValue: { close: vi.fn() } },
        { provide: DIALOG_DATA, useValue: { user: { id: 1, fullName: 'Test User' } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachRoleModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
