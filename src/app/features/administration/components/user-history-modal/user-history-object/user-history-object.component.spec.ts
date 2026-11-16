import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryObjectComponent } from './user-history-object.component';

describe('UserHistoryObjectComponent', () => {
  let component: UserHistoryObjectComponent;
  let fixture: ComponentFixture<UserHistoryObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHistoryObjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHistoryObjectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
