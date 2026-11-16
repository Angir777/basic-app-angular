import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiThreeStateSwitchComponent } from './ui-three-state-switch.component';

describe('UiThreeStateSwitchComponent', () => {
  let component: UiThreeStateSwitchComponent;
  let fixture: ComponentFixture<UiThreeStateSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiThreeStateSwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiThreeStateSwitchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
