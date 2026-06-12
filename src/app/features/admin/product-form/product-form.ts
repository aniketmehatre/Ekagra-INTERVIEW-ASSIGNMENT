import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() product?: Product;
  @Input() categories: string[] = [];
  @Output() save = new EventEmitter<Omit<Product, 'id'>>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;

  form: FormGroup = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    thumbnail: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.product) {
        this.isEditMode = true;
        this.form.patchValue(this.product);
      } else {
        this.isEditMode = false;
        this.form.reset({
          title: '',
          category: '',
          price: 0,
          stock: 0,
          description: '',
          thumbnail: '',
        });
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    this.save.emit(formValue);
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset();
    this.isEditMode = false;
  }

  closeForm(): void {
    this.resetForm();
    this.close.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return `${this.formatFieldName(fieldName)} is required`;
    if (control.errors['minLength'])
      return `${this.formatFieldName(fieldName)} must be at least ${control.errors['minLength'].requiredLength} characters`;
    if (control.errors['min'])
      return `${this.formatFieldName(fieldName)} must be greater than ${control.errors['min'].min}`;
    if (control.errors['pattern'])
      return `${this.formatFieldName(fieldName)} must be a valid URL`;

    return 'Invalid input';
  }

  private formatFieldName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}
