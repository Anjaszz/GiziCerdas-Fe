import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '../../input/input-text/input-text.component';
import { InputTextareaComponent } from '../../input/input-textarea/input-textarea.component';
import { ButtonComponent } from '../../button/button.component';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { AlertService } from '../../alert/alertservice';
import { IconModule } from '../../icon/icon.module';
import { AddressService } from 'src/app/services/address.service'; 
import { RouterLink } from '@angular/router';
interface Location {
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postalCode: string;
}

export type AddressType = 'pickup' | 'receiver';

export interface AddressForm {
  name: string;
  phone: string;
  domicile: string;
  address: string;
  type?: AddressType;
  uuid?: string;
}

@Component({
  selector: 'app-add-address-modal',
  templateUrl: './add-address.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputTextareaComponent,
    ButtonComponent,
    LocationModalComponent,
    IconModule,
    RouterLink
  ]
})
export class AddAddressModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() editAddress: AddressForm | null = null;
  @Input() showSelectAddress = false; 
  @Input() addressType: AddressType = 'pickup';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveAddress = new EventEmitter<AddressForm>();
  @Output() closeWithoutSave = new EventEmitter<void>();
  @Output() selectAddress = new EventEmitter<void>();

  addressForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    domicile: ['', [Validators.required]],
    address: ['', [Validators.required]],
    type: ['pickup'], // Default to pickup
    uuid: [''] // Hidden field for UUID
  });
  
  isSubmit = false;
  isDomicileModalOpen = false;
  modalTitle = 'Tentukan Alamat';
  private previousEditAddress: AddressForm | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private toastService: AlertService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.updateFormWithEditAddress();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // Always update the form and title when the modal opens
    if (changes['isOpen'] && this.isOpen) {
      this.updateFormWithEditAddress();
      this.previousEditAddress = this.editAddress ? { ...this.editAddress } : null;
    }
    // Also update if addressType changes while the modal is already open
    else if (changes['addressType'] && this.isOpen) {
      this.modalTitle = this.getModalTitle(!!this.editAddress);
      this.addressForm.patchValue({
        type: this.addressType
      });
    }
  }

  private updateFormWithEditAddress() {
    if (this.editAddress) {
      // Set the address type from the edit address if it exists, otherwise use the input addressType
      this.addressType = this.editAddress.type || this.addressType;
      
      this.modalTitle = this.getModalTitle(true);
      this.addressForm.patchValue({
        name: this.editAddress.name,
        phone: this.editAddress.phone,
        domicile: this.editAddress.domicile,
        address: this.editAddress.address,
        type: this.addressType,
        uuid: this.editAddress.uuid || ''
      });
      
      // Mark all fields as untouched to avoid showing validation errors immediately
      Object.keys(this.addressForm.controls).forEach(key => {
        const control = this.addressForm.get(key);
        if (control) {
          control.markAsUntouched();
        }
      });
    } else {
      // If this is a new address, use the input addressType
      this.modalTitle = this.getModalTitle(false);
      this.addressForm.reset({
        type: this.addressType,
        uuid: ''
      });
    }
  }

  showSuccessAlert(action: string = 'disimpan') {
    const type = this.addressType === 'pickup' ? 'Pickup' : 'Penerima';
    this.toastService.show({
      variant: 'closeicon',
      title: '',
      showIcon: false,
      color: 'green',
      message: `Alamat ${type} berhasil ${action}`,
      detailText: 'Details',
      duration: 5000,
      position: 'top-center',
    });
  }

  private getModalTitle(isEdit: boolean): string {
    const action = isEdit ? 'Ubah' : 'Tentukan';
    const type = this.addressType === 'pickup' ? 'Pickup' : 'Penerima';
    return `${action} Alamat ${type}`;
  }

  get nameControl() { return this.addressForm.get('name'); }
  get phoneControl() { return this.addressForm.get('phone'); }
  get domicileControl() { return this.addressForm.get('domicile'); }
  get addressControl() { return this.addressForm.get('address'); }

  close() {
    this.closeWithoutSave.emit();
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      
      if (this.addressType === 'pickup') {
        // For pickup addresses, use the pickup API
        this.handlePickupAddressSubmit(formData);
      } else {
        // For receiver addresses, use the customer API
        this.handleCustomerAddressSubmit(formData);
      }
    }
  }

  private handlePickupAddressSubmit(formData: AddressForm) {
    this.isLoading = true;
    
    // Parse the domicile string to extract individual parts
    const domicileParts = this.addressService.parseDomicile(formData.domicile);
    
    // Create the API payload
    const apiPayload: any = {
      name: formData.name,
      phone: formData.phone,
      address1: formData.address,
      province: domicileParts.province,
      city: domicileParts.city,
      district: domicileParts.district,
      subdistrict: domicileParts.subdistrict,
      postal: domicileParts.postal || ''
    };
    
    // Check if we're editing an existing address or creating a new one
    if (formData.uuid) {
      // Add UUID for update
      apiPayload.uuid = formData.uuid;
      
      // Call the update method
      this.addressService.updatePickupAddress(apiPayload).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Emit the event to notify parent component
            this.saveAddress.emit(formData);
            this.showSuccessAlert('diperbarui');
          } else {
            this.showErrorAlert('Failed to update pickup address: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorAlert('Failed to update pickup address');
          this.isLoading = false;
        }
      });
    } else {
      // Create new address
      this.addressService.createPickupAddress(apiPayload).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Emit the event to notify parent component
            this.saveAddress.emit(formData);
            this.showSuccessAlert('disimpan');
          } else {
            this.showErrorAlert('Failed to save pickup address: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorAlert('Failed to save pickup address');
          this.isLoading = false;
        }
      });
    }
  }

  private handleCustomerAddressSubmit(formData: AddressForm) {
    this.isLoading = true;
    
    // Parse the domicile string to extract individual parts
    const domicileParts = this.addressService.parseDomicile(formData.domicile);
    
    // Create the API payload
    const apiPayload: any = {
      name: formData.name,
      phone: formData.phone,
      address1: formData.address,
      province: domicileParts.province,
      city: domicileParts.city,
      district: domicileParts.district,
      subdistrict: domicileParts.subdistrict,
      postal: domicileParts.postal || ''
    };
    
    // Check if we're editing an existing address or creating a new one
    if (formData.uuid) {
      // Add UUID for update
      apiPayload.uuid = formData.uuid;
      
      // Call the update method
      this.addressService.updateCustomerAddress(apiPayload).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Emit the event to notify parent component
            this.saveAddress.emit(formData);
            this.showSuccessAlert('diperbarui');
          } else {
            this.showErrorAlert('Failed to update customer address: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
        
          this.showErrorAlert('Failed to update customer address');
          this.isLoading = false;
        }
      });
    } else {
      // Create new address
      this.addressService.createCustomerAddress(apiPayload).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Emit the event to notify parent component
            this.saveAddress.emit(formData);
            this.showSuccessAlert('disimpan');
          } else {
            this.showErrorAlert('Failed to save customer address: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorAlert('Failed to save customer address');
          this.isLoading = false;
        }
      });
    }
  }

  showErrorAlert(message: string) {
    this.toastService.show({
      variant: 'closeicon',
      title: '',
      showIcon: false,
      message: message,
      detailText: 'Details',
      duration: 5000,
      position: 'top-center',
    });
  }

  openDomicileModal() {
    this.isDomicileModalOpen = true;
  }

  closeDomicileModal() {
    this.isDomicileModalOpen = false;
  }

  onDomicileSelected(location: Location) {
    const formattedAddress = `${location.province} / ${location.city} / ${location.district} / ${location.subdistrict} / ${location.postalCode}`;
    this.addressForm.patchValue({
      domicile: formattedAddress
    });
    this.closeDomicileModal();
  }

  onSelectAddressClick() {
    this.selectAddress.emit();
  }

  private resetForm() {
    this.addressForm.reset({
      type: this.addressType,
      uuid: ''
    });
    this.isSubmit = false;
    this.editAddress = null;
    this.modalTitle = this.getModalTitle(false);
  }
}