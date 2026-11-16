import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-three-state-switch',
  imports: [CommonModule],
  templateUrl: './ui-three-state-switch.component.html',
  styleUrl: './ui-three-state-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiThreeStateSwitchComponent),
      multi: true,
    },
  ],
})
export class UiThreeStateSwitchComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() switchState: boolean | null = null;
  @Output() switchChange = new EventEmitter<boolean | null>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: boolean | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  get switchClass(): string {
    switch (this.size) {
      case 'small':
        return 'switch-small';
      case 'large':
        return 'switch-large';
      default:
        return 'switch-medium';
    }
  }

  onSettingChange() {
    if (this.switchState === null) {
      this.switchState = true; // Switch to true
    } else if (this.switchState === true) {
      this.switchState = false; // Switch to false
    } else {
      this.switchState = null; // Switch to null
    }

    this.onChange(this.switchState);
    this.onTouched();
    this.switchChange.emit(this.switchState);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean | null): void {
    this.switchState = value;
  }

  registerOnChange(fn: (value: boolean | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
