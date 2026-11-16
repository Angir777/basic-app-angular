import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHistoryObjectComponent } from './role-history-object.component';

describe('RoleHistoryObjectComponent', () => {
  let component: RoleHistoryObjectComponent;
  let fixture: ComponentFixture<RoleHistoryObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleHistoryObjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleHistoryObjectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
