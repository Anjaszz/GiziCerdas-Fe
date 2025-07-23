import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  addOutline, 
  personOutline, 
  createOutline, 
  trashOutline,
  eyeOutline,
  maleOutline,
  femaleOutline,
  refreshOutline
} from 'ionicons/icons';
import { ChildrenService } from '../../services/children.service';
import { Child } from '../../models/app.models';

@Component({
  selector: 'app-children',
  templateUrl: './children.page.html',
  styleUrls: ['./children.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class ChildrenPage implements OnInit {
function(arg0: any,arg1: any): import("@angular/core").TrackByFunction<Child> {
throw new Error('Method not implemented.');
}
  private childrenService = inject(ChildrenService);
  private router = inject(Router);

  children: Child[] = [];
  selectedChild: Child | null = null;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;
  childToDelete: Child | null = null;

  constructor() {
    addIcons({
      arrowBackOutline,
      addOutline,
      personOutline,
      createOutline,
      trashOutline,
      eyeOutline,
      maleOutline,
      femaleOutline,
      refreshOutline
    });
  }

  async ngOnInit() {
    await this.loadChildren();
    
    // Subscribe to selected child changes
    this.childrenService.selectedChild$.subscribe(child => {
      this.selectedChild = child;
    });
  }

  async loadChildren() {
    this.isLoading = true;
    try {
      this.children = await this.childrenService.getChildren();
    } catch (error: any) {
      this.showToastMessage('Gagal memuat data anak', 'danger');
      console.error('Error loading children:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshData() {
    await this.loadChildren();
    this.showToastMessage('Data berhasil diperbarui', 'success');
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToAddChild() {
    this.router.navigate(['/children/add']);
  }

  goToChildDetail(child: Child) {
    this.router.navigate(['/children', child._id]);
  }

  goToEditChild(child: Child, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/children', child._id, 'edit']);
  }

  // Child selection
  selectChild(child: Child) {
    this.childrenService.setSelectedChild(child);
    this.showToastMessage(`${child.name} dipilih sebagai anak aktif`, 'success');
  }

  // Delete confirmation
  confirmDelete(child: Child, event: Event) {
    event.stopPropagation();
    this.childToDelete = child;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.childToDelete = null;
  }

  async deleteChild() {
    if (!this.childToDelete) return;

    try {
      await this.childrenService.deleteChild(this.childToDelete._id);
      this.showToastMessage(`${this.childToDelete.name} berhasil dihapus`, 'success');
      this.showDeleteConfirm = false;
      this.childToDelete = null;
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus data anak', 'danger');
      console.error('Error deleting child:', error);
    }
  }

  // Utility methods
  formatAge(birthDate: string): string {
    return this.childrenService.formatAge(birthDate);
  }

  getGenderIcon(gender: string): string {
    return gender === 'male' ? 'male-outline' : 'female-outline';
  }

  getGenderColor(gender: string): string {
    return gender === 'male' ? 'text-blue-600' : 'text-pink-600';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getChildCardBg(gender: string): string {
    return gender === 'male' 
      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
      : 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200';
  }

  getSelectedBadge(child: Child): boolean {
    return this.selectedChild?._id === child._id;
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
  trackByChildId(index: number, child: any): any {

    return child.id; // Replace 'id' with the unique identifier property of your child object

  }
}