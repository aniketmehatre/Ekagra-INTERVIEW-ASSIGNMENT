import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'number' | 'password';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validators?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  visibleWhen?: {
    field: string;
    equals: any;
  };
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  @Input() fields: DynamicField[] = [];
  @Input() formGroup!: FormGroup;

  isVisible(field: DynamicField): boolean {
    if (!field.visibleWhen) {
      return true;
    }

    const control = this.formGroup.get(field.visibleWhen.field);
    return control?.value === field.visibleWhen.equals;
  }

  getError(field: DynamicField): string | null {
    const control = this.formGroup.get(field.key);
    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    if (control.errors?.['required']) {
      return `${field.label} is required.`;
    }
    if (control.errors?.['minlength']) {
      return `${field.label} must have at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control.errors?.['maxlength']) {
      return `${field.label} must have at most ${control.errors['maxlength'].requiredLength} characters.`;
    }
    if (control.errors?.['pattern']) {
      return `${field.label} has an invalid format.`;
    }
    if (control.errors?.['min']) {
      return `${field.label} must be at least ${control.errors['min'].min}.`;
    }
    if (control.errors?.['max']) {
      return `${field.label} must be at most ${control.errors['max'].max}.`;
    }

    return 'Invalid value.';
  }
}
