// services/dashboard.service.ts - New service for Dashboard API
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardChildStats {
  child: {
    id: string;
    name: string;
    ageInMonths: number;
    ageDisplay: string;
    profileImage?: string;
  };
  growth: {
    current: {
      weight: number;
      height: number;
      bmi: number;
      nutritionStatus: string;
      recordDate: string;
    } | null;
    trend: 'increasing' | 'decreasing' | 'stable';
    daysSinceLastRecord: number;
    needsUpdate: boolean;
    totalRecords: number;
  };
  nutrition: {
    today: {
      consumed: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      targets: {
        calories: number;
        protein: number;
      };
      compliance: {
        calories: number;
        protein: number;
      };
      mealsLogged: number;
      mealFrequency: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snack: number;
      };
    };
    weekly: {
      avgCalories: number;
      avgProtein: number;
      totalLogs: number;
    };
    monthly: {
      totalLogs: number;
      trackingConsistency: number;
      daysWithLogs: number;
    };
  };
  reminders: {
    total: number;
    upcoming: Array<{
      id: string;
      title: string;
      time: string;
      type: string;
    }>;
    nextReminder: {
      id: string;
      title: string;
      time: string;
      type: string;
      hoursUntil: number;
      minutesUntil: number;
    } | null;
  };
  summary: {
    totalFoodLogs: number;
    lastUpdated: string;
    overallStatus: {
      status: 'excellent' | 'good' | 'needs_improvement' | 'needs_attention';
      message: string;
      priority: 'low' | 'medium' | 'high';
    };
  };
}

export interface DashboardOverview {
  totalChildren: number;
  children: Array<{
    id: string;
    name: string;
    ageInMonths: number;
    profileImage?: string;
    todayLogs: number;
    activeReminders: number;
    lastGrowthRecord: string;
    nutritionStatus: string;
  }>;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);
  
  private childStatsSubject = new BehaviorSubject<DashboardChildStats | null>(null);
  public childStats$ = this.childStatsSubject.asObservable();

  private overviewSubject = new BehaviorSubject<DashboardOverview | null>(null);
  public overview$ = this.overviewSubject.asObservable();

  constructor() {}

  // Get stats for specific child
  async getChildStats(childId: string): Promise<DashboardChildStats> {
    try {
      const stats = await this.apiService.getAsync<DashboardChildStats>(`/dashboard/stats/${childId}`);
      this.childStatsSubject.next(stats);
      return stats;
    } catch (error) {
      console.error('Error fetching child stats:', error);
      throw error;
    }
  }

  // Get overview of all children
  async getOverview(): Promise<DashboardOverview> {
    try {
      const overview = await this.apiService.getAsync<DashboardOverview>('/dashboard/overview');
      this.overviewSubject.next(overview);
      return overview;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Get current child stats from subject
  getCurrentChildStats(): DashboardChildStats | null {
    return this.childStatsSubject.value;
  }

  // Get current overview from subject
  getCurrentOverview(): DashboardOverview | null {
    return this.overviewSubject.value;
  }

  // Clear dashboard data
  clearData(): void {
    this.childStatsSubject.next(null);
    this.overviewSubject.next(null);
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs_improvement': return 'text-yellow-600';
      case 'needs_attention': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs_attention': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  }

  formatTimeUntilReminder(hoursUntil: number, minutesUntil: number): string {
    if (hoursUntil > 0) {
      return `${hoursUntil} jam ${minutesUntil} menit lagi`;
    } else if (minutesUntil > 0) {
      return `${minutesUntil} menit lagi`;
    } else {
      return 'Sekarang';
    }
  }

  getComplianceColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  getComplianceBadgeColor(percentage: number): string {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }
}