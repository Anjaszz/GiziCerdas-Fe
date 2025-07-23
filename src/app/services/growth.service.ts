// services/growth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { 
  GrowthRecord, 
  CreateGrowthRecordRequest, 
  GrowthChartData,
  GrowthRecordsQueryParams 
} from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class GrowthService {
  private apiService = inject(ApiService);
  
  private growthRecordsSubject = new BehaviorSubject<GrowthRecord[]>([]);
  public growthRecords$ = this.growthRecordsSubject.asObservable();

  constructor() {}

  // Get growth records for a child
  async getGrowthRecords(childId: string, params?: GrowthRecordsQueryParams): Promise<GrowthRecord[]> {
    try {
      const records = await this.apiService.getAsync<GrowthRecord[]>(
        `/growth-records/${childId}`, 
        params
      );
      this.growthRecordsSubject.next(records);
      return records;
    } catch (error) {
      console.error('Error fetching growth records:', error);
      throw error;
    }
  }

  // Add new growth record
  async addGrowthRecord(recordData: CreateGrowthRecordRequest): Promise<GrowthRecord> {
    try {
      const newRecord = await this.apiService.postAsync<GrowthRecord>('/growth-records', recordData);
      
      // Update local records list
      const currentRecords = this.growthRecordsSubject.value;
      const updatedRecords = [newRecord, ...currentRecords].sort((a, b) => 
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
      );
      this.growthRecordsSubject.next(updatedRecords);
      
      return newRecord;
    } catch (error) {
      console.error('Error adding growth record:', error);
      throw error;
    }
  }

  // Update growth record
  async updateGrowthRecord(recordId: string, updateData: Partial<CreateGrowthRecordRequest>): Promise<GrowthRecord> {
    try {
      const updatedRecord = await this.apiService.putAsync<GrowthRecord>(
        `/growth-records/${recordId}`, 
        updateData
      );
      
      // Update local records list
      const currentRecords = this.growthRecordsSubject.value;
      const updatedRecords = currentRecords.map(record => 
        record._id === recordId ? updatedRecord : record
      );
      this.growthRecordsSubject.next(updatedRecords);
      
      return updatedRecord;
    } catch (error) {
      console.error('Error updating growth record:', error);
      throw error;
    }
  }

  // Delete growth record
  async deleteGrowthRecord(recordId: string): Promise<void> {
    try {
      await this.apiService.deleteAsync(`/growth-records/${recordId}`);
      
      // Remove from local records list
      const currentRecords = this.growthRecordsSubject.value;
      const filteredRecords = currentRecords.filter(record => record._id !== recordId);
      this.growthRecordsSubject.next(filteredRecords);
      
    } catch (error) {
      console.error('Error deleting growth record:', error);
      throw error;
    }
  }

  // Get growth chart data
  async getGrowthChartData(childId: string): Promise<GrowthChartData[]> {
    try {
      const chartData = await this.apiService.getAsync<GrowthChartData[]>(
        `/growth-records/${childId}/chart`
      );
      return chartData;
    } catch (error) {
      console.error('Error fetching growth chart data:', error);
      throw error;
    }
  }

  // Calculate BMI
  calculateBMI(weight: number, height: number): number {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  // Get nutrition status based on BMI and age
  getNutritionStatus(bmi: number, ageInMonths: number): string {
    // WHO growth standards for children
    if (ageInMonths < 24) {
      // For children under 2 years
      if (bmi < 14) return 'severely_underweight';
      if (bmi < 16) return 'underweight';
      if (bmi < 18) return 'normal';
      if (bmi < 20) return 'overweight';
      return 'obese';
    } else {
      // For children 2+ years
      if (bmi < 16) return 'severely_underweight';
      if (bmi < 17) return 'underweight';
      if (bmi < 25) return 'normal';
      if (bmi < 30) return 'overweight';
      return 'obese';
    }
  }

  // Get nutrition status color
  getNutritionStatusColor(status: string): string {
    switch (status) {
      case 'severely_underweight': return 'text-red-600';
      case 'underweight': return 'text-orange-600';
      case 'normal': return 'text-green-600';
      case 'overweight': return 'text-yellow-600';
      case 'obese': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  // Get nutrition status text
  getNutritionStatusText(status: string): string {
    switch (status) {
      case 'severely_underweight': return 'Sangat Kurus';
      case 'underweight': return 'Kurus';
      case 'normal': return 'Normal';
      case 'overweight': return 'Gemuk';
      case 'obese': return 'Obesitas';
      default: return 'Tidak Diketahui';
    }
  }

  // Get nutrition status badge color
  getNutritionStatusBadgeColor(status: string): string {
    switch (status) {
      case 'severely_underweight': return 'bg-red-100 text-red-800';
      case 'underweight': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'overweight': return 'bg-yellow-100 text-yellow-800';
      case 'obese': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Calculate age from birth date
  calculateAgeInMonths(birthDate: string, recordDate?: string): number {
    const birth = new Date(birthDate);
    const record = recordDate ? new Date(recordDate) : new Date();
    
    let months = (record.getFullYear() - birth.getFullYear()) * 12;
    months += record.getMonth() - birth.getMonth();
    
    if (record.getDate() < birth.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  }

  // Get growth trend
  getGrowthTrend(records: GrowthRecord[], metric: 'weight' | 'height' | 'bmi'): 'increasing' | 'decreasing' | 'stable' {
    if (records.length < 2) return 'stable';
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
    );
    
    const latest = sortedRecords[sortedRecords.length - 1];
    const previous = sortedRecords[sortedRecords.length - 2];
    
    const latestValue = latest[metric];
    const previousValue = previous[metric];
    
    const difference = latestValue - previousValue;
    const threshold = metric === 'weight' ? 0.1 : metric === 'height' ? 0.5 : 0.1;
    
    if (difference > threshold) return 'increasing';
    if (difference < -threshold) return 'decreasing';
    return 'stable';
  }

  // Get growth recommendations based on status
  getGrowthRecommendations(status: string, ageInMonths: number): string[] {
    const recommendations: string[] = [];
    
    switch (status) {
      case 'severely_underweight':
      case 'underweight':
        recommendations.push('Konsultasi dengan dokter anak segera');
        recommendations.push('Tingkatkan asupan kalori dan protein');
        recommendations.push('Berikan makanan bergizi tinggi');
        if (ageInMonths >= 6) {
          recommendations.push('Variasikan menu MPASI dengan protein hewani');
        }
        break;
        
      case 'normal':
        recommendations.push('Pertahankan pola makan seimbang');
        recommendations.push('Lanjutkan pemberian ASI ekslusif (0-6 bulan)');
        if (ageInMonths >= 6) {
          recommendations.push('Berikan MPASI sesuai usia');
        }
        recommendations.push('Rutin kontrol pertumbuhan');
        break;
        
      case 'overweight':
      case 'obese':
        recommendations.push('Konsultasi dengan ahli gizi');
        recommendations.push('Kurangi makanan tinggi gula dan lemak');
        recommendations.push('Tingkatkan aktivitas fisik sesuai usia');
        recommendations.push('Perhatikan porsi makan');
        break;
    }
    
    return recommendations;
  }

  // Validate growth measurements
  validateMeasurements(weight: number, height: number, ageInMonths: number): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let isValid = true;
    
    // Weight validation
    if (weight < 1 || weight > 100) {
      warnings.push('Berat badan tidak dalam rentang normal (1-100 kg)');
      isValid = false;
    }
    
    // Height validation
    if (height < 30 || height > 200) {
      warnings.push('Tinggi badan tidak dalam rentang normal (30-200 cm)');
      isValid = false;
    }
    
    // Age-based validation
    if (ageInMonths < 12) {
      // Baby (0-12 months)
      if (weight < 2 || weight > 15) {
        warnings.push('Berat badan bayi umumnya 2-15 kg');
      }
      if (height < 45 || height > 90) {
        warnings.push('Tinggi badan bayi umumnya 45-90 cm');
      }
    } else if (ageInMonths < 60) {
      // Toddler (1-5 years)
      if (weight < 8 || weight > 30) {
        warnings.push('Berat badan balita umumnya 8-30 kg');
      }
      if (height < 70 || height > 130) {
        warnings.push('Tinggi badan balita umumnya 70-130 cm');
      }
    }
    
    return { isValid, warnings };
  }

  // Get latest growth record
  getLatestGrowthRecord(): GrowthRecord | null {
    const records = this.growthRecordsSubject.value;
    if (records.length === 0) return null;
    
    return records.reduce((latest, current) => {
      return new Date(current.recordDate) > new Date(latest.recordDate) ? current : latest;
    });
  }

  // Clear data (for logout or child change)
  clearGrowthRecords(): void {
    this.growthRecordsSubject.next([]);
  }

  // Get records count
  getRecordsCount(): number {
    return this.growthRecordsSubject.value.length;
  }

  // Calculate growth velocity (growth rate per month)
  calculateGrowthVelocity(records: GrowthRecord[], metric: 'weight' | 'height'): number {
    if (records.length < 2) return 0;
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
    );
    
    const latest = sortedRecords[sortedRecords.length - 1];
    const earliest = sortedRecords[0];
    
    const valueChange = latest[metric] - earliest[metric];
    const timeSpanMs = new Date(latest.recordDate).getTime() - new Date(earliest.recordDate).getTime();
    const timeSpanMonths = timeSpanMs / (30.44 * 24 * 60 * 60 * 1000); // Average days per month
    
    return timeSpanMonths > 0 ? Number((valueChange / timeSpanMonths).toFixed(2)) : 0;
  }

  // Get WHO percentile (simplified)
  getWHOPercentile(value: number, ageInMonths: number, metric: 'weight' | 'height', gender: 'male' | 'female'): string {
    // This is a simplified version. In real app, you'd use WHO growth charts data
    // For now, return a basic estimation
    
    if (metric === 'weight') {
      const expectedWeight = this.getExpectedWeight(ageInMonths, gender);
      const ratio = value / expectedWeight;
      
      if (ratio < 0.85) return 'P3';
      if (ratio < 0.9) return 'P10';
      if (ratio < 0.95) return 'P25';
      if (ratio < 1.05) return 'P50';
      if (ratio < 1.1) return 'P75';
      if (ratio < 1.15) return 'P90';
      return 'P97';
    }
    
    if (metric === 'height') {
      const expectedHeight = this.getExpectedHeight(ageInMonths, gender);
      const ratio = value / expectedHeight;
      
      if (ratio < 0.95) return 'P3';
      if (ratio < 0.97) return 'P10';
      if (ratio < 0.98) return 'P25';
      if (ratio < 1.02) return 'P50';
      if (ratio < 1.03) return 'P75';
      if (ratio < 1.05) return 'P90';
      return 'P97';
    }
    
    return 'P50';
  }

  // Get expected weight for age (simplified formula)
  private getExpectedWeight(ageInMonths: number, gender: 'male' | 'female'): number {
    if (ageInMonths <= 12) {
      // Birth weight ~3.5kg, +0.6kg per month for first year
      return 3.5 + (ageInMonths * 0.6);
    } else {
      // After 1 year: weight = age(years) * 2 + 8
      const ageInYears = ageInMonths / 12;
      const baseWeight = (ageInYears * 2) + 8;
      return gender === 'male' ? baseWeight * 1.05 : baseWeight * 0.95;
    }
  }

  // Get expected height for age (simplified formula)
  private getExpectedHeight(ageInMonths: number, gender: 'male' | 'female'): number {
    if (ageInMonths <= 12) {
      // Birth height ~50cm, +2.5cm per month for first year
      return 50 + (ageInMonths * 2.5);
    } else {
      // After 1 year: height = age(years) * 6 + 77
      const ageInYears = ageInMonths / 12;
      const baseHeight = (ageInYears * 6) + 77;
      return gender === 'male' ? baseHeight * 1.02 : baseHeight * 0.98;
    }
  }

  // Get growth milestones for age
  getGrowthMilestones(ageInMonths: number): { weight: string; height: string; development: string[] } {
    const milestones = {
      weight: '',
      height: '',
      development: [] as string[]
    };

    if (ageInMonths <= 6) {
      milestones.weight = 'Berat lahir biasanya 2x lipat pada 4-6 bulan';
      milestones.height = 'Tinggi bertambah 15-25 cm pada tahun pertama';
      milestones.development = [
        'Dapat menopang kepala (2-4 bulan)',
        'Mulai duduk dengan bantuan (4-6 bulan)',
        'Mulai MPASI (6 bulan)'
      ];
    } else if (ageInMonths <= 12) {
      milestones.weight = 'Berat lahir biasanya 3x lipat pada 12 bulan';
      milestones.height = 'Tinggi lahir biasanya 1.5x lipat pada 12 bulan';
      milestones.development = [
        'Dapat duduk sendiri (6-8 bulan)',
        'Mulai merangkak (7-10 bulan)',
        'Berdiri dengan bantuan (9-12 bulan)'
      ];
    } else if (ageInMonths <= 24) {
      milestones.weight = 'Pertambahan berat sekitar 2-3 kg per tahun';
      milestones.height = 'Pertambahan tinggi sekitar 10-12 cm per tahun';
      milestones.development = [
        'Berjalan mandiri (12-18 bulan)',
        'Mulai bicara kata-kata (12-24 bulan)',
        'Makan sendiri dengan sendok (18-24 bulan)'
      ];
    } else {
      milestones.weight = 'Pertambahan berat sekitar 2 kg per tahun';
      milestones.height = 'Pertambahan tinggi sekitar 5-7 cm per tahun';
      milestones.development = [
        'Toilet training (2-3 tahun)',
        'Bermain dengan anak lain (2-4 tahun)',
        'Siap sekolah (4-5 tahun)'
      ];
    }

    return milestones;
  }

  // Format age for display
  formatAgeFromMonths(months: number): string {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} bulan`;
    } else if (remainingMonths === 0) {
      return `${years} tahun`;
    } else {
      return `${years} tahun ${remainingMonths} bulan`;
    }
  }

  // Check if measurement is within normal range
  isWithinNormalRange(value: number, ageInMonths: number, metric: 'weight' | 'height', gender: 'male' | 'female'): boolean {
    const expected = metric === 'weight' 
      ? this.getExpectedWeight(ageInMonths, gender)
      : this.getExpectedHeight(ageInMonths, gender);
    
    const tolerance = metric === 'weight' ? 0.2 : 0.1; // 20% for weight, 10% for height
    const minValue = expected * (1 - tolerance);
    const maxValue = expected * (1 + tolerance);
    
    return value >= minValue && value <= maxValue;
  }

  // Get nutritional advice based on BMI status
  getNutritionalAdvice(status: string): { foods: string[]; avoid: string[]; tips: string[] } {
    const advice = {
      foods: [] as string[],
      avoid: [] as string[],
      tips: [] as string[]
    };

    switch (status) {
      case 'severely_underweight':
      case 'underweight':
        advice.foods = [
          'Alpukat, pisang, dan buah berkalori tinggi',
          'Kacang-kacangan dan biji-bijian',
          'Protein hewani: telur, ikan, daging',
          'Susu dan produk olahannya',
          'Minyak zaitun atau minyak kelapa'
        ];
        advice.avoid = [
          'Makanan rendah kalori berlebihan',
          'Minuman berkafein',
          'Makanan olahan dengan pengawet'
        ];
        advice.tips = [
          'Makan dalam porsi kecil tapi sering',
          'Tambahkan kalori sehat ke setiap makanan',
          'Konsultasi dengan dokter untuk suplemen'
        ];
        break;

      case 'normal':
        advice.foods = [
          'Sayuran hijau dan buah-buahan segar',
          'Protein seimbang: ikan, ayam, tahu, tempe',
          'Karbohidrat kompleks: nasi merah, roti gandum',
          'Produk susu rendah lemak',
          'Air putih yang cukup'
        ];
        advice.avoid = [
          'Makanan tinggi gula dan garam',
          'Makanan cepat saji berlebihan',
          'Minuman manis dan bersoda'
        ];
        advice.tips = [
          'Pertahankan pola makan seimbang',
          'Rutin aktivitas fisik sesuai usia',
          'Kontrol porsi makan'
        ];
        break;

      case 'overweight':
      case 'obese':
        advice.foods = [
          'Sayuran hijau dan serat tinggi',
          'Buah-buahan segar (bukan jus)',
          'Protein tanpa lemak: ikan, ayam tanpa kulit',
          'Karbohidrat kompleks dalam porsi terkontrol',
          'Air putih yang banyak'
        ];
        advice.avoid = [
          'Makanan tinggi gula dan lemak jenuh',
          'Minuman manis dan jus kemasan',
          'Gorengan dan makanan cepat saji',
          'Camilan tinggi kalori'
        ];
        advice.tips = [
          'Kurangi porsi makan secara bertahap',
          'Tingkatkan aktivitas fisik',
          'Makan perlahan dan kunyah dengan baik',
          'Konsultasi dengan ahli gizi'
        ];
        break;
    }

    return advice;
  }
}