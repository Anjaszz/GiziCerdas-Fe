// location-modal.component.ts
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../input/input-text/input-text.component';
import { ButtonComponent } from '../../button/button.component';
import { IconModule } from '../../icon/icon.module';
import { Locationn } from 'src/app/pages/cek-tarif/cek-tarif.interface';
import { LocationService } from 'src/app/services/location.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from '../../alert/alertservice';



@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextComponent, ButtonComponent, IconModule,SkeletonModule],
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
  
})
export class LocationModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() locationSelected = new EventEmitter<Locationn>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() variant: 'modal' | 'dropdown' = 'modal';
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  pathParts: string[] = [];
  
  searchQuery = '';
  currentStep: 'province' | 'city' | 'district' | 'subdistrict' | 'postalCode' = 'province';
  selectedLocation: Partial<Locationn> = {};
  selectedPath = '';
  isComplete = false;
  isLoading = false; 
  // Property untuk mengendalikan visibilitas icon delete
  showDeleteIcon = false;

  constructor(private locationService: LocationService,
    private toastService: AlertService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  async loadLocations() {
    this.isLoading = true;
    const params = {
      get: this.currentStep === 'province' ? 'province' : 
           this.currentStep === 'city' ? 'city' :
           this.currentStep === 'district' ? 'district' :
           this.currentStep === 'subdistrict' ? 'subdistrict' : 'postal',
      province: this.selectedLocation.province || '',
      city: this.selectedLocation.city || '',
      district: this.selectedLocation.district || '',
      subdistrict: this.selectedLocation.subdistrict || '',
      search: this.searchQuery
    };

    try {
      const response = await this.locationService.getAdministrativeData(params).toPromise();
      if (response?.status === 200) {
        // Update mapping sesuai dengan response API
        switch(this.currentStep) {
          case 'province':
            this.locations.provinces = response.data.map(item => item.provinsi);
            break;
          case 'city':
            // Perhatikan perubahan disini dari 'kota' ke 'kabupaten'
            this.locations.cities = response.data.map(item => item.kabupaten || item.kota);
            break;
          case 'district':
            // Perhatikan perubahan disini dari 'kecamatan' ke 'district'
            this.locations.districts = response.data.map(item => item.kecamatan);
            break;
          case 'subdistrict':
            // Perhatikan perubahan disini dari 'kelurahan' ke 'subdistrict'
            this.locations.subdistricts = response.data.map(item => item.kelurahan);
            break;
          case 'postalCode':
            this.locations.postalCodes = response.data.map(item => item.kodepos);
            break;
        }
      }
    } catch (error) {
      this.showErrorToast('Gagal memuat data domisili. Silakan coba lagi.');
      switch (this.currentStep) {
        case 'province':
          this.locations.provinces = [];
          break;
        case 'city':
          this.locations.cities = [];
          break;
        case 'district':
          this.locations.districts = [];
          break;
        case 'subdistrict':
          this.locations.subdistricts = [];
          break;
        case 'postalCode':
          this.locations.postalCodes = [];
          break;
      }
    }
    finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  }
  
  // Add dropdown-specific methods
  toggleDropdown() {
    if (this.variant === 'dropdown') {
      this.isOpen = !this.isOpen;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Hapus event handler ini karena kita hanya ingin menutup via tombol
    return;
  }
  
  // Dengan API sebenarnya, data akan dimuat dinamis
  locations = {
    provinces: [] as string[],
    cities: [] as string[],
    districts: [] as string[],
    subdistricts: [] as string[],
    postalCodes: [] as string[]
  };

  getSearchPlaceholder() {
    switch (this.currentStep) {
      case 'province': return 'Cari Provinsi';
      case 'city': return 'Cari Kota';
      case 'district': return 'Cari Kecamatan';
      case 'subdistrict': return 'Cari Kelurahan';
      case 'postalCode': return 'Cari Kode Pos';
      default: return '';
    }
  }

  onSearch() {
    // Tampilkan delete icon saat pencarian dilakukan
    this.showDeleteIcon = true;
    this.loadLocations();
  }

  get filteredLocations() {
    switch (this.currentStep) {
      case 'province':
        return this.locations.provinces;
      case 'city':
        return this.locations.cities;
      case 'district':
        return this.locations.districts;
      case 'subdistrict':
        return this.locations.subdistricts;
      case 'postalCode':
        return this.locations.postalCodes;
      default:
        return [];
    }
  }

  selectItem(item: string) {
    switch (this.currentStep) {
      case 'province':
        this.selectedLocation.province = item;
        this.currentStep = 'city';
        break;
      case 'city':
        this.selectedLocation.city = item;
        this.currentStep = 'district';
        break;
      case 'district':
        this.selectedLocation.district = item;
        this.currentStep = 'subdistrict';
        break;
      case 'subdistrict':
        this.selectedLocation.subdistrict = item;
        this.currentStep = 'postalCode';
        break;
      case 'postalCode':
        this.selectedLocation.postalCode = item;
        this.isComplete = true;
        break;
    }
    this.updateSelectedPath();
    this.searchQuery = '';
    // Reset delete icon saat item dipilih dan search field dikosongkan
    this.showDeleteIcon = false;
    if (!this.isComplete) {
      this.loadLocations();
    }
  }

  getNextStepPrompt(): string {
    // Jika sudah complete, tidak perlu menampilkan prompt
    if (this.isComplete) return '';
    
    switch(this.currentStep) {
      case 'city':
        return 'Pilih Kota';
      case 'district':
        return 'Pilih Kecamatan';
      case 'subdistrict':
        return 'Pilih Kelurahan';
      case 'postalCode':
        return 'Pilih Kode Pos';
      default:
        return '';
    }
  }



// Modifikasi method updateSelectedPath()
updateSelectedPath() {
  const parts = [];
  if (this.selectedLocation.province) parts.push(this.selectedLocation.province);
  if (this.selectedLocation.city) parts.push(this.selectedLocation.city);
  if (this.selectedLocation.district) parts.push(this.selectedLocation.district);
  if (this.selectedLocation.subdistrict) parts.push(this.selectedLocation.subdistrict);
  if (this.selectedLocation.postalCode) parts.push(this.selectedLocation.postalCode);
  
  // Menyimpan parts dalam array untuk navigasi
  this.pathParts = [...parts];
  
  // Perbarui selectedPath seperti sebelumnya
  this.selectedPath = parts.join(' / ');
}

// Tambahkan method navigasi baru
navigateToPath(index: number) {
  // Jika user sudah selesai memilih, tidak perlu melakukan apa-apa
  if (this.isComplete && index === this.pathParts.length - 1) {
    return;
  }

  // Reset data setelah level yang diklik
  const currentSelectedLocation = { ...this.selectedLocation };
  
  // Reset selection ke step yang sesuai dengan yang diklik
  switch(index) {
    case 0: // Provinsi - Kembali ke step provinsi
      this.selectedLocation = {};
      this.currentStep = 'province';
      break;
    case 1: // Kota - Kembali ke step kota
      this.selectedLocation = {
        province: currentSelectedLocation.province
      };
      this.currentStep = 'city';
      break;
    case 2: // Kecamatan - Kembali ke step kecamatan
      this.selectedLocation = {
        province: currentSelectedLocation.province,
        city: currentSelectedLocation.city
      };
      this.currentStep = 'district';
      break;
    case 3: // Kelurahan - Kembali ke step kelurahan
      this.selectedLocation = {
        province: currentSelectedLocation.province,
        city: currentSelectedLocation.city,
        district: currentSelectedLocation.district
      };
      this.currentStep = 'subdistrict';
      break;
    case 4: // Kode Pos - Kembali ke step kode pos
      this.selectedLocation = {
        province: currentSelectedLocation.province,
        city: currentSelectedLocation.city,
        district: currentSelectedLocation.district,
        subdistrict: currentSelectedLocation.subdistrict
      };
      this.currentStep = 'postalCode';
      break;
  }
  
  this.isComplete = false;
  this.updateSelectedPath();
  this.loadLocations();
}
  

  resetSelection() {
    this.selectedLocation = {};
    this.currentStep = 'province';
    this.selectedPath = '';
    this.isComplete = false;
    this.searchQuery = '';
    
    // Sembunyikan delete icon saat reset
    this.showDeleteIcon = false;
    
    this.loadLocations();
  }

  saveLocation() {
    if (this.isComplete) {
      // Kirim object Location dan format string-nya
      const location: Locationn = {
        province: this.selectedLocation.province || '',
        city: this.selectedLocation.city || '',
        district: this.selectedLocation.district || '',
        subdistrict: this.selectedLocation.subdistrict || '',
        postalCode: this.selectedLocation.postalCode || '',
        formattedAddress: this.getFormattedLocation() // tambahkan property baru untuk formatted string
      };
      this.locationSelected.emit(location);
      this.closeModal.emit();
    }
  }

  private getFormattedLocation(): string {
    const parts = [];
    if (this.selectedLocation.province) parts.push(this.selectedLocation.province);
    if (this.selectedLocation.city) parts.push(this.selectedLocation.city);
    if (this.selectedLocation.district) parts.push(this.selectedLocation.district);
    if (this.selectedLocation.subdistrict) parts.push(this.selectedLocation.subdistrict);
    if (this.selectedLocation.postalCode) parts.push(this.selectedLocation.postalCode);
    
    return parts.join(', ');
  }

  isSelected(item: string) {
    return this.selectedLocation.postalCode === item;
  }
  
  get hasSelectedLocation(): boolean {
    return !!(
      this.selectedLocation.province ||
      this.selectedLocation.city ||
      this.selectedLocation.district ||
      this.selectedLocation.subdistrict ||
      this.selectedLocation.postalCode
    );
  }

  // Properties for drag functionality
  private touchStartY: number = 0;
  private touchCurrentY: number = 0;
  private readonly DRAG_THRESHOLD = 150; // Minimum drag distance to close
  private isDragging = false;

  // Touch event handlers
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
    
    // Get the modal element
    const modal = this.modalContainer.nativeElement;
    // Set transition to none for smooth dragging
    modal.style.transition = 'none';
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    
    this.touchCurrentY = event.touches[0].clientY;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    // Only allow dragging downwards
    if (dragDistance < 0) return;
    
    const modal = this.modalContainer.nativeElement;
    // Apply transform with damping effect
    const damping = 0.5;
    modal.style.transform = `translateY(${dragDistance * damping}px)`;
    
    // Add opacity effect to backdrop
    const opacity = 1 - (dragDistance / (this.DRAG_THRESHOLD * 2));
    modal.closest('.bg-black')?.style.setProperty('opacity', Math.max(0, opacity).toString());
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    
    const modal = this.modalContainer.nativeElement;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    // Reset transition for smooth animation
    modal.style.transition = 'transform 0.3s ease-out';
    
    if (dragDistance > this.DRAG_THRESHOLD) {
      // Close the modal if dragged beyond threshold
      modal.style.transform = `translateY(100%)`;
      setTimeout(() => this.close(), 300);
    } else {
      // Reset position if not dragged enough
      modal.style.transform = 'translateY(0)';
      modal.closest('.bg-black')?.style.setProperty('opacity', '1');
    }
    
    this.isDragging = false;
    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }


  close() {
    // Reset any transforms before closing
    if (this.modalContainer?.nativeElement) {
      this.modalContainer.nativeElement.style.transform = '';
      this.modalContainer.nativeElement.style.transition = '';
    }
    this.closeModal.emit();
    this.resetSelection();
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