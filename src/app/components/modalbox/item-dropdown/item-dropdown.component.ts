import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../input/input-text/input-text.component';
import { IconModule } from '../../icon/icon.module';
import { ItemTypeService, ItemType } from 'src/app/services/item-type.service';
import { AlertService } from '../../alert/alertservice';

// Generic dropdown item interface
export interface DropdownItem {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-item-type-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextComponent, IconModule],
  templateUrl: './item-dropdown.component.html',
  styleUrls: ['./item-dropdown.component.scss']
})
export class ItemDropdownComponent implements OnInit {
  @Input() isOpen = false;
  @Input() dropdownType: 'itemType' | 'quantityUnit' = 'itemType';
  @Input() placeholder: string = 'Cari Jenis Barang';
  // New input for mobile height
  @Input() mobileMaxHeight: number = 380; // Default taller height for mobile
  @Output() itemSelected = new EventEmitter<DropdownItem>();
  @Output() closeDropdown = new EventEmitter<void>();
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @ViewChild('dragIndicator') dragIndicator!: ElementRef;
  
  searchQuery = '';
  isLoading = false;
  allItems: DropdownItem[] = [];
  error: string = '';
  isMobile: boolean = false;

  constructor(private itemTypeService: ItemTypeService, private toastService: AlertService) {
    // Check if mobile on init
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 640; // 640px is the sm breakpoint
  }

  ngOnInit() {
    if (this.isOpen) {
      this.loadItems();
    }
  }

  // Load items when dropdown is opened
  ngOnChanges() {
    if (this.isOpen && this.allItems.length === 0) {
      this.loadItems();
    }
  }

  // Load the appropriate items based on dropdown type
  loadItems() {
    if (this.dropdownType === 'itemType') {
      this.loadItemTypes();
      this.placeholder = 'Cari Jenis Barang';
    } else if (this.dropdownType === 'quantityUnit') {
      this.loadQuantityUnits();
      this.placeholder = 'Pilih Satuan';
    }
  }

  loadItemTypes() {
    this.isLoading = true;
    this.error = '';
    this.itemTypeService.getItemTypes().subscribe({
      next: (items) => {
        this.allItems = items;
        this.isLoading = false;
        if (items.length === 0) {
          this.error = 'Tidak ada jenis barang yang tersedia';
        }
       
      },
      error: (error) => {
        this.showErrorToast('Gagal Memuat list jenis barang');
        this.isLoading = false;
        this.error = 'Gagal memuat jenis barang';
      }
    });
  }

  loadQuantityUnits() {
    this.isLoading = true;
    this.error = '';
    this.itemTypeService.getQuantityUnits().subscribe({
      next: (units) => {
        this.allItems = units;
        this.isLoading = false;
        if (units.length === 0) {
          this.error = 'Tidak ada satuan yang tersedia';
        }
       
      },
      error: (error) => {
        this.showErrorToast('Gagal memuat List satuan');
        this.isLoading = false;
        this.error = 'Gagal memuat satuan';
      }
    });
  }

  get filteredAllItems() {
    if (!this.searchQuery) return this.allItems;
    return this.allItems.filter(item => 
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectAndClose(item: DropdownItem) {
    this.itemSelected.emit(item);
    this.close();
  }

  onSearch() {
    // Filtering is handled by the filteredAllItems getter
  }

  // Touch event handling for drag indicator only
  private touchStartY: number = 0;
  private touchCurrentY: number = 0;
  private readonly DRAG_THRESHOLD = 150;
  private isDragging = false;

  onDragIndicatorTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevent scrolling when dragging from indicator
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
    
    const dropdown = this.dropdownContainer?.nativeElement;
    if (dropdown) {
      dropdown.style.transition = 'none';
    }
  }

  onDragIndicatorTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    
    this.touchCurrentY = event.touches[0].clientY;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    if (dragDistance < 0) return;
    
    const dropdown = this.dropdownContainer?.nativeElement;
    if (!dropdown) return;

    const damping = 0.5;
    dropdown.style.transform = `translateY(${dragDistance * damping}px)`;
    
    const opacity = 1 - (dragDistance / (this.DRAG_THRESHOLD * 2));
    const overlay = dropdown.closest('.bg-black');
    if (overlay) {
      overlay.style.setProperty('opacity', Math.max(0, opacity).toString());
    }
  }

  onDragIndicatorTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    
    const dropdown = this.dropdownContainer?.nativeElement;
    if (!dropdown) return;

    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    dropdown.style.transition = 'transform 0.3s ease-out';
    
    if (dragDistance > this.DRAG_THRESHOLD) {
      dropdown.style.transform = `translateY(100%)`;
      setTimeout(() => this.close(), 300);
    } else {
      dropdown.style.transform = 'translateY(0)';
      const overlay = dropdown.closest('.bg-black');
      if (overlay) {
        overlay.style.setProperty('opacity', '1');
      }
    }
    
    this.isDragging = false;
    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }

  close() {
    if (this.dropdownContainer?.nativeElement) {
      this.dropdownContainer.nativeElement.style.transform = '';
      this.dropdownContainer.nativeElement.style.transition = '';
    }
    this.closeDropdown.emit();
    this.searchQuery = '';
  }
  
  private showErrorToast(message: string) {
    this.toastService.show({
      variant: 'closeicon',
      title: '',
      showIcon: false,
      color: 'error',
      message: message,
      detailText: 'Details',
      duration: 5000,
      position: 'top-center',
    });
  }
  

}