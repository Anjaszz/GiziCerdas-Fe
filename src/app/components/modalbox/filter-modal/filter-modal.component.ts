// filter-modal.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioWithDescComponent } from '../../radio-with-desc/radio-with-desc.component';
import { ButtonComponent } from '../../button/button.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { IconModule } from '../../icon/icon.module';

export interface FilterOption {
  id: string;
  label: string;
  checked?: boolean;
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioWithDescComponent,
    ButtonComponent,
    CheckboxComponent,
    IconModule,
  ],
  templateUrl: './filter-modal.component.html',
})
export class FilterModalComponent implements OnDestroy, OnChanges {
  @Input() isOpen = false;
  @Input() type: 'sort' | 'courier' | 'pickup' = 'sort';
  @Input() title = '';
  @Input() options: FilterOption[] = [];
  @Input() position = { top: 0, left: 0 };

  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<{ type: string; value: any }>();

  isDesktop: boolean = false;
  selectedSort: string = 'courier';
  localOptions: FilterOption[] = [];
  private initialSort: string = '';
  private initialOptions: FilterOption[] = [];

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  
  ngOnChanges(changes: SimpleChanges) {
    // Ketika modal dibuka atau options berubah
    if ((changes['isOpen'] && changes['isOpen'].currentValue) || changes['options']) {
      if (this.type === 'sort') {
        // Update sort options
        this.localOptions = [...this.options];
        const checkedOption = this.localOptions.find(opt => opt.checked);
        if (checkedOption) {
          this.selectedSort = checkedOption.id;
          this.initialSort = checkedOption.id;
        }
      } else {
        // Update checkbox options dengan nilai dari parent
        this.localOptions = this.options.map(opt => ({...opt}));
        this.initialOptions = this.options.map(opt => ({...opt}));
      }
    }
  }

  private resetToInitial() {
    if (this.type === 'sort') {
      this.selectedSort = this.initialSort;
    } else {
      // Reset checkbox states berdasarkan initial options
      this.localOptions = this.initialOptions.map(opt => ({...opt}));
      // Memastikan tampilan terupdate
      this.options.forEach((opt, index) => {
        opt.checked = this.initialOptions[index].checked;
      });
    }
  }

  private checkScreenSize() {
    this.isDesktop = window.innerWidth >= 640;
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  onSortChange(value: string) {
    this.selectedSort = value;
  }

  onCheckboxChange(option: FilterOption) {
    const index = this.localOptions.findIndex(opt => opt.id === option.id);
    if (index !== -1) {
      this.localOptions[index] = { ...option };
    }
  }

  closeModal() {
    this.resetToInitial();
    this.close.emit();
  }

  applyFilter() {
    if (this.isApplyDisabled) {
      return;
    }

    if (this.type === 'sort') {
      this.initialSort = this.selectedSort;
      this.apply.emit({
        type: this.type,
        value: this.selectedSort
      });
    } else {
      // Update initial state dan parent options
      this.initialOptions = this.localOptions.map(opt => ({...opt}));
      this.options.forEach((opt, index) => {
        opt.checked = this.localOptions[index].checked;
      });

      const selectedOptions = this.localOptions
        .filter(opt => opt.checked)
        .map(opt => opt.id);
      
      this.apply.emit({
        type: this.type,
        value: selectedOptions
      });
    }
    this.close.emit();
  }

  get isApplyDisabled(): boolean {
    if (this.type === 'sort') {
      return !this.selectedSort;
    } else {
      return !this.localOptions.some(opt => opt.checked);
    }
  }
}
