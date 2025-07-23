import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  statsChartOutline,
  downloadOutline,
  eyeOutline,
  scaleOutline,
  resizeOutline,
  analyticsOutline,
  refreshOutline,
  filterOutline,
  addOutline
} from 'ionicons/icons';
import { GrowthService } from '../../services/growth.service';
import { ChildrenService } from '../../services/children.service';
import { Child, GrowthRecord, GrowthChartData } from '../../models/app.models';

@Component({
  selector: 'app-growth-chart',
  templateUrl: './growth-chart.page.html',
  styleUrls: ['./growth-chart.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class GrowthChartPage implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private growthService = inject(GrowthService);
  private childrenService = inject(ChildrenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  childId: string = '';
  child: Child | null = null;
  growthRecords: GrowthRecord[] = [];
  chartData: GrowthChartData[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Chart settings
  selectedMetric: 'weight' | 'height' | 'bmi' = 'weight';
  selectedPeriod: '3m' | '6m' | '1y' | 'all' = '6m';
  showTrendLine = true;

  // Chart display data
  chartSummary = {
    totalRecords: 0,
    latestValue: 0,
    previousValue: 0,
    changeValue: 0,
    changePercent: 0,
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable'
  };

  // Mock chart data - In real app, use Chart.js or similar
  mockChartPoints: { x: string; y: number; age: number }[] = [];

  constructor() {
    addIcons({
      arrowBackOutline,
      statsChartOutline,
      downloadOutline,
      eyeOutline,
      scaleOutline,
      resizeOutline,
      analyticsOutline,
      refreshOutline,
      filterOutline,
      addOutline
    });
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    if (this.childId) {
      await this.loadData();
    }
  }

  ngAfterViewInit() {
    // Initialize chart after view is ready
    setTimeout(() => {
      this.generateMockChart();
    }, 100);
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      // Load growth records
      this.growthRecords = await this.growthService.getGrowthRecords(this.childId);
      
      // Load chart data
      this.chartData = await this.growthService.getGrowthChartData(this.childId);
      
      // Process data for current metric and period
      this.processChartData();
      
    } catch (error: any) {
      console.error('Error loading growth chart data:', error);
      this.showToastMessage('Gagal memuat data grafik pertumbuhan', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  processChartData() {
    if (this.growthRecords.length === 0) return;

    // Filter data by selected period
    let filteredRecords = this.filterRecordsByPeriod();
    
    // Sort by date
    filteredRecords.sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

    // Calculate summary statistics
    this.calculateSummary(filteredRecords);

    // Prepare mock chart data
    this.prepareMockChartData(filteredRecords);
  }

  filterRecordsByPeriod(): GrowthRecord[] {
    if (this.selectedPeriod === 'all') {
      return [...this.growthRecords];
    }

    const now = new Date();
    const months = this.selectedPeriod === '3m' ? 3 : this.selectedPeriod === '6m' ? 6 : 12;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());

    return this.growthRecords.filter(record => 
      new Date(record.recordDate) >= cutoffDate
    );
  }

  calculateSummary(records: GrowthRecord[]) {
    this.chartSummary.totalRecords = records.length;

    if (records.length === 0) {
      this.chartSummary.latestValue = 0;
      this.chartSummary.previousValue = 0;
      this.chartSummary.changeValue = 0;
      this.chartSummary.changePercent = 0;
      this.chartSummary.trend = 'stable';
      return;
    }

    const latest = records[records.length - 1];
    const previous = records.length > 1 ? records[records.length - 2] : latest;

    this.chartSummary.latestValue = latest[this.selectedMetric];
    this.chartSummary.previousValue = previous[this.selectedMetric];
    this.chartSummary.changeValue = this.chartSummary.latestValue - this.chartSummary.previousValue;
    
    if (this.chartSummary.previousValue > 0) {
      this.chartSummary.changePercent = (this.chartSummary.changeValue / this.chartSummary.previousValue) * 100;
    }

    // Determine trend
    if (Math.abs(this.chartSummary.changeValue) < 0.1) {
      this.chartSummary.trend = 'stable';
    } else if (this.chartSummary.changeValue > 0) {
      this.chartSummary.trend = 'increasing';
    } else {
      this.chartSummary.trend = 'decreasing';
    }
  }

  prepareMockChartData(records: GrowthRecord[]) {
    this.mockChartPoints = records.map(record => ({
      x: this.formatDateForChart(record.recordDate),
      y: record[this.selectedMetric],
      age: record.ageInMonths
    }));
  }

  generateMockChart() {
    if (!this.chartContainer?.nativeElement || this.mockChartPoints.length === 0) return;

    // This is a simple mock visualization
    // In a real app, you would use Chart.js, D3.js, or similar charting library
    const container = this.chartContainer.nativeElement;
    container.innerHTML = `
      <div class="w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div class="text-center">
          <div class="text-4xl mb-2">${this.getMetricIcon()}</div>
          <h3 class="font-semibold text-gray-700 mb-1">${this.getMetricTitle()}</h3>
          <p class="text-gray-500 text-sm">Grafik akan ditampilkan di sini</p>
          <p class="text-gray-400 text-xs mt-2">${this.mockChartPoints.length} data points</p>
        </div>
      </div>
    `;
  }

  // Chart controls
  changeMetric(metric: 'weight' | 'height' | 'bmi') {
    this.selectedMetric = metric;
    this.processChartData();
    this.generateMockChart();
  }

  changePeriod(period: '3m' | '6m' | '1y' | 'all') {
    this.selectedPeriod = period;
    this.processChartData();
    this.generateMockChart();
  }

  toggleTrendLine() {
    this.showTrendLine = !this.showTrendLine;
    this.generateMockChart();
  }

  async refreshData() {
    await this.loadData();
    this.showToastMessage('Data grafik berhasil diperbarui', 'success');
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/growth', this.childId]);
  }

  goToAddRecord() {
    this.router.navigate(['/growth', this.childId, 'add']);
  }

  goToRecordsList() {
    this.router.navigate(['/growth', this.childId]);
  }

  // Export functionality (placeholder)
  exportChart() {
    this.showToastMessage('Fitur export akan segera tersedia', 'warning');
  }

  // Utility methods
  getMetricTitle(): string {
    switch (this.selectedMetric) {
      case 'weight': return 'Berat Badan (kg)';
      case 'height': return 'Tinggi Badan (cm)';
      case 'bmi': return 'BMI';
      default: return '';
    }
  }

  getMetricIcon(): string {
    switch (this.selectedMetric) {
      case 'weight': return '⚖️';
      case 'height': return '📏';
      case 'bmi': return '📊';
      default: return '📈';
    }
  }

  getMetricUnit(): string {
    switch (this.selectedMetric) {
      case 'weight': return 'kg';
      case 'height': return 'cm';
      case 'bmi': return '';
      default: return '';
    }
  }

  getPeriodText(): string {
    switch (this.selectedPeriod) {
      case '3m': return '3 Bulan Terakhir';
      case '6m': return '6 Bulan Terakhir';
      case '1y': return '1 Tahun Terakhir';
      case 'all': return 'Semua Data';
      default: return '';
    }
  }

  getTrendIcon(): string {
    switch (this.chartSummary.trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  }

  getTrendText(): string {
    switch (this.chartSummary.trend) {
      case 'increasing': return 'Meningkat';
      case 'decreasing': return 'Menurun';
      case 'stable': return 'Stabil';
      default: return 'Stabil';
    }
  }

  getTrendColor(): string {
    if (this.selectedMetric === 'weight' || this.selectedMetric === 'height') {
      // For weight and height, increasing is generally good
      switch (this.chartSummary.trend) {
        case 'increasing': return 'text-green-600';
        case 'decreasing': return 'text-red-600';
        case 'stable': return 'text-gray-600';
        default: return 'text-gray-600';
      }
    } else {
      // For BMI, stable is generally best
      switch (this.chartSummary.trend) {
        case 'increasing': return 'text-orange-600';
        case 'decreasing': return 'text-orange-600';
        case 'stable': return 'text-green-600';
        default: return 'text-gray-600';
      }
    }
  }

  formatDateForChart(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}