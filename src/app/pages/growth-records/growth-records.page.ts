import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  addOutline, 
  scaleOutline, 
  statsChartOutline,
  createOutline,
  trashOutline,
  calendarOutline,
  trendingUpOutline,
  trendingDownOutline,
  removeOutline,
  refreshOutline,
  analyticsOutline, documentTextOutline } from 'ionicons/icons';
import { GrowthService } from '../../services/growth.service';
import { ChildrenService } from '../../services/children.service';
import { GrowthRecord, Child } from '../../models/app.models';

@Component({
  selector: 'app-growth-records',
  templateUrl: './growth-records.page.html',
  styleUrls: ['./growth-records.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class GrowthRecordsPage implements OnInit {
  private growthService = inject(GrowthService);
  private childrenService = inject(ChildrenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  childId: string = '';
  child: Child | null = null;
  growthRecords: GrowthRecord[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;
  recordToDelete: GrowthRecord | null = null;

  // Filter and sort options
  sortBy: 'date' | 'weight' | 'height' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor() {
    addIcons({arrowBackOutline,refreshOutline,addOutline,analyticsOutline,scaleOutline,calendarOutline,createOutline,trashOutline,documentTextOutline,statsChartOutline,trendingUpOutline,trendingDownOutline,removeOutline});
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    if (this.childId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      // Load growth records
      await this.loadGrowthRecords();
      
    } catch (error: any) {
      this.showToastMessage('Gagal memuat data pertumbuhan', 'danger');
      console.error('Error loading growth data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadGrowthRecords() {
    try {
      this.growthRecords = await this.growthService.getGrowthRecords(this.childId, {
        sort: this.sortOrder,
        limit: 50
      });
    } catch (error) {
      console.error('Error loading growth records:', error);
      throw error;
    }
  }

  async refreshData() {
    await this.loadGrowthRecords();
    this.showToastMessage('Data berhasil diperbarui', 'success');
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToAddRecord() {
    this.router.navigate(['/growth', this.childId, 'add']);
  }

  goToChart() {
    this.router.navigate(['/growth', this.childId, 'chart']);
  }

  editRecord(record: GrowthRecord, event: Event) {
    event.stopPropagation();
    // TODO: Navigate to edit page
    this.showToastMessage('Fitur edit akan segera tersedia', 'warning');
  }

  // Delete confirmation
  confirmDelete(record: GrowthRecord, event: Event) {
    event.stopPropagation();
    this.recordToDelete = record;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.recordToDelete = null;
  }

  async deleteRecord() {
    if (!this.recordToDelete) return;

    try {
      await this.growthService.deleteGrowthRecord(this.recordToDelete._id);
      this.showToastMessage('Data pertumbuhan berhasil dihapus', 'success');
      this.showDeleteConfirm = false;
      this.recordToDelete = null;
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus data', 'danger');
      console.error('Error deleting record:', error);
    }
  }

  // Sorting and filtering
  changeSortBy(sortBy: 'date' | 'weight' | 'height') {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'desc';
    }
    this.sortRecords();
  }

  sortRecords() {
    this.growthRecords.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortBy) {
        case 'date':
          valueA = new Date(a.recordDate).getTime();
          valueB = new Date(b.recordDate).getTime();
          break;
        case 'weight':
          valueA = a.weight;
          valueB = b.weight;
          break;
        case 'height':
          valueA = a.height;
          valueB = b.height;
          break;
        default:
          return 0;
      }

      if (this.sortOrder === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }

  // Utility methods
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getRelativeDate(date: string): string {
    const now = new Date();
    const recordDate = new Date(date);
    const diffTime = now.getTime() - recordDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  }

  getNutritionStatusText(status: string): string {
    return this.growthService.getNutritionStatusText(status);
  }

  getNutritionStatusBadgeColor(status: string): string {
    return this.growthService.getNutritionStatusBadgeColor(status);
  }

  getGrowthTrend(metric: 'weight' | 'height' | 'bmi'): 'increasing' | 'decreasing' | 'stable' {
    return this.growthService.getGrowthTrend(this.growthRecords, metric);
  }

  getTrendIcon(trend: 'increasing' | 'decreasing' | 'stable'): string {
    switch (trend) {
      case 'increasing': return 'trending-up-outline';
      case 'decreasing': return 'trending-down-outline';
      default: return 'remove-outline';
    }
  }

  getTrendColor(trend: 'increasing' | 'decreasing' | 'stable'): string {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getTrendText(trend: 'increasing' | 'decreasing' | 'stable', metric: string): string {
    const metricText = metric === 'weight' ? 'berat' : metric === 'height' ? 'tinggi' : 'BMI';
    switch (trend) {
      case 'increasing': return `${metricText} naik`;
      case 'decreasing': return `${metricText} turun`;
      default: return `${metricText} stabil`;
    }
  }

  getLatestRecord(): GrowthRecord | null {
    return this.growthRecords.length > 0 ? this.growthRecords[0] : null;
  }

  getGrowthVelocity(metric: 'weight' | 'height'): number {
    return this.growthService.calculateGrowthVelocity(this.growthRecords, metric);
  }

  trackByRecordId(index: number, item: any): string {

    return item._id;

  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}