// dropdown.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownIconComponent } from '../icon/dropdown-icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { RadioWithDescComponent } from "../radio-with-desc/radio-with-desc.component";

type DropdownItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  hasDivider?: boolean;
  action?: () => void;
  subItems?: SubDropdownItem[];
  showSubmenu?: boolean;
  submenuPosition?: 'left' | 'right';
}

// Tambahkan interface baru untuk SubDropdownItem
type SubDropdownItem = {
  label: string;
  imageUrl?: string;
  icon?: string; 
  value: string;
  checked: boolean; // hapus optional (?) dan default false di constructor
  disabled?: boolean; // tambahkan ini
  action?: () => void;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownIconComponent, AvatarComponent, RadioWithDescComponent],
  templateUrl: './dropdowns.component.html',
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() variant: 'left' | 'right' = 'left';
  @Input() showHeader = false;
  @Input() name = '';
  @Input() role = '';
  @Input() defaultSubmenuPosition: 'left' | 'right' = 'right';
  @Input() imageUrl: string = '';
  @Output() itemClick = new EventEmitter<DropdownItem>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  get initials(): string {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  resetSubmenus(): void {
    this.items.forEach(item => item.showSubmenu = false);
  }

  onItemHover(item: DropdownItem): void {
    this.resetSubmenus();
    
    if (item.subItems && item.subItems.length > 0) {
      item.showSubmenu = true;
    }
  }

  onItemLeave(item: DropdownItem): void {
    if (item.subItems && item.subItems.length > 0) {
      setTimeout(() => {
        item.showSubmenu = false;
      }, 100);
    }
  }

  handleItemClick(item: DropdownItem): void {
    if (!item.disabled && !item.subItems) {
      this.itemClick.emit(item);
      if (item.action) {
        item.action();
      }
      this.isOpen = false;
      this.resetSubmenus();
    }
  }



  handleSubItemClick(event: Event, subItem: SubDropdownItem, parentItem: DropdownItem): void {
    event.stopPropagation();
    
    // Reset semua checked state di subitem yang sama
    if(parentItem.subItems) {
      parentItem.subItems.forEach(item => item.checked = false);
    }
    
    // Set checked untuk item yang dipilih
    subItem.checked = true;

    if (!subItem.disabled && subItem.action) {
      subItem.action();
    }}
}