import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordTabComponent } from './user-password-tab.component';

describe('UserPasswordTabComponent', () => {
  let component: UserPasswordTabComponent;
  let fixture: ComponentFixture<UserPasswordTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPasswordTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPasswordTabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
