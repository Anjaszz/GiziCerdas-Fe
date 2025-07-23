import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { InputTextComponent } from '../../input/input-text/input-text.component';
import { ButtonComponent } from '../../button/button.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { AddressService } from 'src/app/services/address.service';
import { AlertService } from '../../alert/alertservice';

export type AddressType = 'pickup' | 'receiver';

interface Address {
  name: string;
  phone: string;
  address: string;
  domicile: string;
  type?: AddressType;
  uuid?: string;
  isPrimary?: boolean;
}

@Component({
  selector: 'app-address-list-modal',
  standalone: true,
  imports: [CommonModule, IconModule, InputTextComponent, ButtonComponent, FormsModule, CheckboxComponent],
  templateUrl: './address-list-modal.component.html',
})
export class AddressListModalComponent {
  @Input() isOpen = false;
  @Input() addresses: Address[] = [];
  @Input() addressType: AddressType = 'pickup';
  @Input() currentSelectedAddress?: Address;  // Tambahkan input property untuk alamat yang terpilih saat ini
  @Output() closeModal = new EventEmitter<void>();
  @Output() addressSelected = new EventEmitter<Address>();
  @Output() editAddress = new EventEmitter<Address>();
  @Output() addNewAddress = new EventEmitter<AddressType>();
  @Output() setPrimaryAddress = new EventEmitter<Address>();

  searchQuery = '';
  selectedAddress?: Address;
  isLoading = false;
  
  ngOnInit() {
    // Metode lifecycle untuk inisialisasi komponen
  }
  
  // Panggil ini setiap kali modal terbuka untuk mengatur alamat yang dipilih
  ngOnChanges() {
    if (this.isOpen && this.currentSelectedAddress) {
      // Temukan alamat yang sesuai di daftar alamat berdasarkan UUID
      const matchingAddress = this.addresses.find(
        addr => addr.uuid === this.currentSelectedAddress?.uuid && addr.type === this.addressType
      );
      
      if (matchingAddress) {
        this.selectedAddress = matchingAddress;
      }
    }
  }

  constructor(
    private addressService: AddressService,
    private toastService: AlertService
  ) {}

  get filteredAddresses() {
    // Filter by type first, then by search query
    const typeFiltered = this.addresses.filter(address => 
      !address.type || address.type === this.addressType
    );
    
    if (!this.searchQuery) return typeFiltered;
    
    const query = this.searchQuery.toLowerCase();
    return typeFiltered.filter(address => 
      address.name.toLowerCase().includes(query) ||
      address.phone.includes(query) ||
      address.address.toLowerCase().includes(query)
    );
  }

  get modalTitle(): string {
    return `Pilih Alamat ${this.addressType === 'pickup' ? 'Pickup' : 'Penerima'}`;
  }

  close() {
    this.selectedAddress = undefined;
    this.searchQuery = '';
    this.closeModal.emit();
  }

  selectAddress(address: Address) {
    // Toggle selection
    this.selectedAddress = this.selectedAddress === address ? undefined : address;
    if (this.selectedAddress) {
      // Ensure the selected address has the correct type
      const addressWithType = {
        ...this.selectedAddress,
        type: this.addressType
      };
      this.addressSelected.emit(addressWithType);
    } else {
      this.addressSelected.emit(undefined);
    }
  }

  onEditClick(address: Address, event: Event) {
    event.stopPropagation();
    // Ensure the type is set when editing
    const addressWithType = {
      ...address,
      type: this.addressType
    };
    this.editAddress.emit(addressWithType);
  }

  // Metode baru untuk menangani perubahan pada checkbox primary
  onPrimaryCheckboxChange(address: Address, isChecked: boolean) {
    // Pastikan event tidak menyebar ke parent (selectAddress)
    if (isChecked) {
      this.setAsPrimaryAddress(address);
    }
  }

  setAsPrimaryAddress(address: Address) {
    // Jika alamat sudah sebagai utama, tidak perlu melakukan apa-apa
    if (address.isPrimary) {
      return;
    }
    
    if (!address.uuid) {
      this.showErrorToast('Tidak dapat menetapkan alamat utama, alamat belum tersimpan');
      return;
    }
    
    this.isLoading = true;
    
    if (this.addressType === 'pickup') {
      this.addressService.setPrimaryPickupAddress(address.uuid).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Update the address in our local list
            this.addresses.forEach(addr => {
              if (addr.type === 'pickup') {
                addr.isPrimary = addr.uuid === address.uuid;
              }
            });
            
            // Emit to parent so it can refresh addresses if needed
            this.setPrimaryAddress.emit(address);
            
            this.showSuccessToast('Alamat Pickup utama berhasil diubah');
            
            // PENTING: Tidak menutup modal dan tidak mengubah selected address
          } else {
            this.showErrorToast('Gagal menetapkan alamat utama: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorToast('Gagal menetapkan alamat utama');
          this.isLoading = false;
        }
      });
    } else {  
      this.showErrorToast('Fitur alamat utama untuk penerima belum tersedia');
      this.isLoading = false;
    }
  }

  onAddNew() {
    this.addNewAddress.emit(this.addressType);
  }

  formatDomicile(domicile: string): string {
    return domicile.replace(/\s+\/\s+/g, ', ');
  }

  private showSuccessToast(message: string) {
    this.toastService.show({
      variant: 'closeicon',
      title: '',
      showIcon: false,
      color: 'green',
      message: message,
      detailText: 'Details',
      duration: 5000,
      position: 'top-center',
    });
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