import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleComponent } from './update-role.component';

describe('UpdateRoleComponent', () => {
  let component: UpdateRoleComponent;
  let fixture: ComponentFixture<UpdateRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRoleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
