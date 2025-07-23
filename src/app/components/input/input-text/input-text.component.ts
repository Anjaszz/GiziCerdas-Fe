import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  QueryList,
  ViewChild,
  ViewChildren,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputRuleDirective } from 'src/app/directives/input-rule.directive';
import { IconModule } from '../../icon/icon.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClickOutsideDirective } from 'src/app/directives/click-outside.directive';
import { COUNTRY_EXT, CountryExt } from 'src/app/constants/country.const';
import { DataItem } from 'src/app/interfaces/form.interface';
import { GlobalService } from 'src/app/services/GlobalService/global.service';

export interface OptionDropdown<t = string> {
  value: t;
  label: string;
  option?: string;
  desc?: string;
}
export type LeadingDropdownInput = {
  selected: OptionDropdown;
  options: OptionDropdown[];
};

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputRuleDirective,
    IconModule,
    ClickOutsideDirective,
    InputTextComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class InputTextComponent implements OnInit, ControlValueAccessor {
  showPasswordIcon: boolean = false; // untuk menentukan apakah menampilkan icon password
  isPasswordVisible: boolean = false; // untuk track state show/hide password
  hasSearched: boolean = false;
  @Input()
  placeholder: string = '';

  @Input()
  type: HTMLInputElement['type'] | 'password-toggle' = 'text';

  @Input()
  inputmode: HTMLInputElement['inputMode'] = '';

  @Input()
  mode:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url'
    | 'currency'
    | 'lat' = 'text';

  @Input()
  label: string = '';

  @Input()
  labelInfo: string = '';

  @Input()
  labelOptional: string = '';

  @Input()
  helper: string = '';

  @Input()
  helperInfo: string = '';

  @Input()
  error: boolean = false;

  @Input()
  bgWhite: boolean = false;

  @Input()
  bgGrey: boolean = false;

  @Input()
  shortInput: boolean = false;

  @Input()
  readonly: any = false;

  @Input()
  editMode: boolean = false;

  @Input()
  isTextCenter: boolean = false;
  @Input()
  maxValue: number | null = null;

  @Input()
  separatorLeft: boolean = false;

  @Input()
  separatorRight: boolean = false;

  @Input()
  disable: boolean = false;

  @Output()
  enterApi = new EventEmitter<void>();

  @Input()
  enterButtonText?: string = 'Cari';

  @Input()
  enterIcon?: boolean = false;

  @Input()
  deleteIcon?: boolean = false;
  
  @Input()
  deleteBlueIcon?: boolean = false;

  isDisabled: boolean = true;

  val = '';
  onChange: any = () => {};
  onTouch: any = () => {};

  currencyVal = '';

  inputRule: '' | 'float' | 'currency' | 'number' = '';

  focused: boolean = false;

  set value(val: string) {
    if (val !== undefined && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  get value() {
    return this.val;
  }
  @Input()
  leadingDropdown: LeadingDropdownInput | null = null;
  @Input()
  leadingDropdownPosition: 'left' | 'right' = 'left';

  leadingDropdownBinding: LeadingDropdownInput | null = null;
  leadingDropdownSearch: string = '';

  @Output()
  leadingDropdownChange = new EventEmitter<OptionDropdown>();
  // leadingDropdownOpen: boolean = false;

  @ViewChild('dropdownInput') dropdownInput!: ElementRef<HTMLInputElement>;

  set leadingDropdownOpen(value: boolean) {
    this._leadingDropdownOpen = value;
    if (value) {
      setTimeout(() => {
        this.dropdownInput?.nativeElement?.focus();
      });
    }
  }
  get leadingDropdownOpen(): boolean {
    return this._leadingDropdownOpen;
  }
  private _leadingDropdownOpen = false;

  stringListCountry: string = '';
  listCountry: CountryExt[] = COUNTRY_EXT;
  filteredListCountry: CountryExt[] = COUNTRY_EXT;
  @Output()
  selectCountry = new EventEmitter<CountryExt>();
  @Input()
  selectedCountry: CountryExt | null = null;
  @ViewChild('flagdropdown') flagdropdown!: ElementRef<HTMLInputElement>;
  get flagDropdownOpen(): boolean {
    return this._flagDropdownOpen;
  }
  set flagDropdownOpen(value: boolean) {
    this._flagDropdownOpen = value;

    if (value) {
      setTimeout(() => {
        this.flagdropdown?.nativeElement?.focus();
      });
    }
  }
  _flagDropdownOpen: boolean = false;

  @Input()
  substarctValue: number | null = null;
  @Input()
  addValue: number | null = null;

  //#region COMBOBOX TH
  @ViewChild('InputDefault')
  InputDefault!: ElementRef<HTMLInputElement>;

  @Input()
  combox: LeadingDropdownInput | null = null;
  comboxFiltered: LeadingDropdownInput | null = null;
  @Input()
  comboxOrMenu: 'combox' | 'menu' | null = null;
  comboxOpen: boolean = false;

  @ViewChildren('ListItemRef')
  listItemRefs!: QueryList<ElementRef<HTMLElement>>;
  focusedItemIndex?: number;
  //#endregion

  @ViewChild('MainInput')
  MainInput!: ElementRef<HTMLElement>;

  constructor(private global: GlobalService, private hostRef: ElementRef) {}

  ngOnInit() {
    this.setInputRule();
    this.initCondition();
  }

  initCondition() {
    this.editMode || this.disable
      ? (this.isDisabled = true)
      : (this.isDisabled = false);

    if (this.leadingDropdown) {
      this.leadingDropdownBinding = this.leadingDropdown
        ? {
            selected: this.leadingDropdown.selected,
            options: [...this.leadingDropdown.options], // Create a new array with the same elements
          }
        : null;
    }
    if (this.selectedCountry || this.substarctValue) this.separatorLeft = true;
    if (this.addValue) {
      this.separatorRight = true;
      this.isTextCenter = true;
    }

    if (this.combox) this.comboxFiltered = { ...this.combox };
  }

  //#region COMBOBOX FN
  comboxClicked(target: OptionDropdown) {
    if (this.combox) this.combox.selected = target;
    // console.log(this.combox,'combox');

    this.value = target.label;

    this.setComboxOpen(false);
    this.resetCombox();
  }
  comboxEntered() {
    // console.log('kuyy');

    const validSelection =
      this.comboxOpen && this.focusedItemIndex !== undefined;
    if (
      (!validSelection && this.combox === null) ||
      this.comboxFiltered?.options.length === 0
    )
      return;

    this.combox!.selected =
      this.comboxFiltered!.options[this.focusedItemIndex!];
    // console.log(this.combox?.selected,'comboxEntered');
    this.value = this.combox!.selected.label;
    this.setComboxOpen(false, 'comboxEntered');

    // if (this.comboxOrMenu !== 'menu') this.InputDefault.nativeElement.blur();
    this.InputDefault.nativeElement.blur();

    // this.comboxOrMenu == 'menu' ? this.MainInput.nativeElement.blur() : this.InputDefault.nativeElement.blur()
    // this.MainInput.nativeElement.blur()

    this.resetCombox();
    console.log('wefwez');
  }

  private comboxUpdateFocus() {
    // console.log('coy');
    const currentlyFocused = this.listItemRefs.find((item) =>
      item.nativeElement.classList.contains('combobox_active')
    );

    if (currentlyFocused)
      currentlyFocused.nativeElement.classList.remove('combobox_active');
    if (this.focusedItemIndex === undefined) return;
    const itemToFocus = this.listItemRefs.get(
      this.focusedItemIndex
    )!.nativeElement;

    itemToFocus.classList.add('combobox_active');
    itemToFocus.scrollIntoView({ block: 'nearest' });
  }

  comboxChanged(value: string) {
    // this.setComboxOpen(value.length > 0)

    if (!value.length || this.comboxFiltered === null) {
      if (this.combox) this.comboxFiltered = { ...this.combox };
      this.focusedItemIndex = undefined;
      this.comboxUpdateFocus();
      // console.log(this.comboxOpen,'kosongg');

      // this.comboxFiltered!.options = [...this.combox?.options ?? []]
      return;
    }

    const previousItemsLength = this.comboxFiltered!.options.length;

    this.comboxFiltered.options = this.global.filterData<OptionDropdown>(
      value,
      this.combox?.options ?? [],
      this.comboxFiltered?.options ?? [],
      'label'
    );

    if (previousItemsLength !== this.comboxFiltered!.options.length) {
      this.comboxFiltered.options.length
        ? (this.focusedItemIndex = 0)
        : (this.focusedItemIndex = undefined);
      this.comboxUpdateFocus();
    }
    // console.log(this.comboxFiltered,'anjaay');
  }

  setComboxOpen(value: boolean, source: string = 'default') {
    this.comboxOpen = value;
    // console.log(source, 'auuu');

    // if (source == 'button true') {
    // 	console.log('jajang true');

    // 	this.InputDefault.nativeElement.blur()
    // } else if ('button false') {
    // 	console.log('dayat false');

    // 	this.InputDefault.nativeElement.blur()
    // }
    if (value) {
      if (this.comboxOrMenu !== 'menu') this.value = '';

      this.focusedItemIndex = 0;

      setTimeout(() => {
        this.comboxUpdateFocus();
      }, 50);
    }

    if (!value) this.focusedItemIndex = undefined;
  }

  comboxNavigationDown() {
    if (!this.comboxOpen) {
      this.comboxOpen = true;
      return;
    }

    // console.log(this.comboxFiltered,'bray');

    if (
      this.comboxFiltered === null ||
      this.comboxFiltered?.options.length === 0
    )
      return;

    if (this.focusedItemIndex === undefined) {
      this.focusedItemIndex = 0;

      this.comboxUpdateFocus();
      return;
    }

    // console.log(this.focusedItemIndex);

    if (this.focusedItemIndex === this.comboxFiltered.options.length - 1) {
      console.log(this.focusedItemIndex, 'bray');
      return;
    }

    this.focusedItemIndex++;
    this.comboxUpdateFocus();
  }

  comboxNavigationUp() {
    if (
      this.comboxFiltered === null ||
      this.focusedItemIndex === 0 ||
      this.focusedItemIndex === undefined
    )
      return;

    this.focusedItemIndex--;
    this.comboxUpdateFocus();
  }

  private resetCombox() {
    if (this.combox !== null) {
      this.value = this.combox.selected.label;
    }

    if (this.combox) this.comboxFiltered = { ...this.combox };
    this.focusedItemIndex = undefined;
    this.comboxUpdateFocus();
  }

  // uncomment kl tau artinya
  // @HostListener('document:mousedown', ['$event.target'])
  // @HostListener('window:focusin', ['$event.target'])
  // onFocus(target: HTMLElement) {
  // 	if (this.hostRef.nativeElement.contains(target)) {
  // 		console.log(target,'focus');

  // 		this.setComboxOpen(false,'onFocus')
  // 	}
  // }

  //#endregion

  calculatetVal(addition: boolean) {
    if (this.mode !== 'decimal') return;
    const current = Number(this.val) || 0;
    let result;

    if (addition && this.addValue) {
      result = current + this.addValue;
    } else if (!addition && this.substarctValue) {
      if (this.value == '0' || this.substarctValue > Number(this.value)) return;

      result = current - this.substarctValue;
    }

    this.value = result?.toString() || this.value;
  }

  clickOutsideDropdown() {
    if (this.selectedCountry) {
      this.flagDropdownOpen = false;
      this.stringListCountry = '';
      this.filterFlag(this.stringListCountry);
    } else if (this.combox !== null) {
      // console.log('keluar combox');

      this.setComboxOpen(false, 'clickOutsideDropdown');

      this.resetCombox();
    } else {
      this.leadingDropdownOpen = false;
      this.leadingDropdownSearch = '';
      this.filterLeadingDropdown(this.leadingDropdownSearch);
    }
  }

  filterLeadingDropdown(input: string) {
    if (this.leadingDropdownBinding === null || this.leadingDropdown === null)
      return;

    this.leadingDropdownBinding.options =
      this.global.filterData<OptionDropdown>(
        input,
        this.leadingDropdown?.options ?? [],
        this.leadingDropdownBinding?.options ?? [],
        'label'
      );
  }

  filterFlag(selectedData: string) {
    this.filteredListCountry = this.global.filterData(
      selectedData,
      this.listCountry,
      this.filteredListCountry,
      'country'
    );
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.mode === 'currency') this.currencyVal = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setInputRule() {
    switch (this.mode) {
      case 'currency':
      case 'tel':
        this.inputRule = 'number';
        break;
      case 'decimal':
        this.inputRule = 'float';
        break;
      default:
        this.inputRule = '';
        break;
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

 

resetInputValue(): void {
  this.value = '';
  if (this.mode === 'currency') {
    this.currencyVal = '';
  }
  // This will trigger the onChange event
  this.onChange('');
  this.onTouch('');
  
  this.hasSearched = false;
  
  // Focus the input after clearing
  setTimeout(() => {
    if (this.InputDefault) {
      this.InputDefault.nativeElement.focus();
    }
  });
}

handleEnterClick(): void {
  this.hasSearched = true;
  this.enterApi.emit();
}

  onCurrencyValChange() {
    if (this.currencyVal.length <= 3) {
      this.writeValue(this.currencyVal);
      return;
    }

    let val = this.currencyVal.replace(/\./g, '');
    this.writeValue(val);

    const manyDot = Math.ceil(this.val.length / 3);

    let currencySubstring = [];
    for (let i = 1; i <= manyDot; ++i) {
      let currencyTemp = val.substring(
        val.length - i * 3,
        val.length - (i - 1) * 3
      );
      currencySubstring.unshift(currencyTemp);
    }

    this.currencyVal = currencySubstring.join('.');
  }
}

@Pipe({
  name: 'comboxAutocompleFilter',
  standalone: true,
})
export class ComboxAutocompleteFilterPipe implements PipeTransform {
  transform(items: OptionDropdown[], input: string): OptionDropdown[] {
    if (!input.length) return items;

    return items.filter((option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    );
  }
}
