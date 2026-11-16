import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRoleComponent } from './display-role.component';

describe('DisplayRoleComponent', () => {
  let component: DisplayRoleComponent;
  let fixture: ComponentFixture<DisplayRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayRoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayRoleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
