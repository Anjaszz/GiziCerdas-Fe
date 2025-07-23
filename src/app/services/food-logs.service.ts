// services/food-logs.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { 
  FoodLog, 
  CreateFoodLogRequest, 
  UpdateFoodLogRequest,
  DailyNutritionSummary,
  WeeklyNutritionReport,
  FoodLogStats
} from '../models/food.models';

@Injectable({
  providedIn: 'root'
})
export class FoodLogsService {
  private apiService = inject(ApiService);
  
  private foodLogsSubject = new BehaviorSubject<FoodLog[]>([]);
  public foodLogs$ = this.foodLogsSubject.asObservable();

  private dailySummarySubject = new BehaviorSubject<DailyNutritionSummary | null>(null);
  public dailySummary$ = this.dailySummarySubject.asObservable();

  constructor() {}

  // Get food logs for a child
  async getFoodLogs(childId: string, params?: { 
    date?: string; 
    mealType?: string; 
    limit?: number; 
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<FoodLog[]> {
    try {
      const logs = await this.apiService.getAsync<FoodLog[]>(`/food-logs/${childId}`, params);
      this.foodLogsSubject.next(logs);
      return logs;
    } catch (error) {
      console.error('Error fetching food logs:', error);
      throw error;
    }
  }

  // Get food log by ID
  async getFoodLogById(logId: string): Promise<FoodLog> {
    try {
      return await this.apiService.getAsync<FoodLog>(`/food-logs/log/${logId}`);
    } catch (error) {
      console.error('Error fetching food log:', error);
      throw error;
    }
  }

  // Add new food log
  async addFoodLog(logData: CreateFoodLogRequest): Promise<FoodLog> {
    try {
      const newLog = await this.apiService.postAsync<FoodLog>('/food-logs', logData);
      
      // Update local food logs list
      const currentLogs = this.foodLogsSubject.value;
      this.foodLogsSubject.next([newLog, ...currentLogs]);
      
      return newLog;
    } catch (error) {
      console.error('Error adding food log:', error);
      throw error;
    }
  }

  // Update food log
  async updateFoodLog(logId: string, updateData: UpdateFoodLogRequest): Promise<FoodLog> {
    try {
      const updatedLog = await this.apiService.putAsync<FoodLog>(`/food-logs/${logId}`, updateData);
      
      // Update local food logs list
      const currentLogs = this.foodLogsSubject.value;
      const updatedLogs = currentLogs.map(log => 
        log._id === logId ? updatedLog : log
      );
      this.foodLogsSubject.next(updatedLogs);
      
      return updatedLog;
    } catch (error) {
      console.error('Error updating food log:', error);
      throw error;
    }
  }

  // Delete food log
  async deleteFoodLog(logId: string): Promise<void> {
    try {
      await this.apiService.deleteAsync(`/food-logs/${logId}`);
      
      // Remove from local food logs list
      const currentLogs = this.foodLogsSubject.value;
      const filteredLogs = currentLogs.filter(log => log._id !== logId);
      this.foodLogsSubject.next(filteredLogs);
      
    } catch (error) {
      console.error('Error deleting food log:', error);
      throw error;
    }
  }

  // Get daily nutrition summary
  async getDailyNutritionSummary(childId: string, date: string): Promise<DailyNutritionSummary> {
    try {
      const summary = await this.apiService.getAsync<DailyNutritionSummary>(`/food-logs/${childId}/daily-summary/${date}`);
      this.dailySummarySubject.next(summary);
      return summary;
    } catch (error) {
      console.error('Error fetching daily nutrition summary:', error);
      throw error;
    }
  }

  // Get weekly nutrition report
  async getWeeklyNutritionReport(childId: string, startDate: string, endDate: string): Promise<WeeklyNutritionReport> {
    try {
      return await this.apiService.getAsync<WeeklyNutritionReport>(`/food-logs/${childId}/weekly-report`, {
        startDate,
        endDate
      });
    } catch (error) {
      console.error('Error fetching weekly nutrition report:', error);
      throw error;
    }
  }

  // Get food log statistics
  async getFoodLogStats(childId: string): Promise<FoodLogStats> {
    try {
      return await this.apiService.getAsync<FoodLogStats>(`/food-logs/${childId}/stats`);
    } catch (error) {
      console.error('Error fetching food log stats:', error);
      throw error;
    }
  }

  // Get logs for specific date
  async getLogsForDate(childId: string, date: string): Promise<FoodLog[]> {
    try {
      const logs = await this.getFoodLogs(childId, { date });
      return logs;
    } catch (error) {
      console.error('Error fetching logs for date:', error);
      throw error;
    }
  }

  // Get logs for date range
  async getLogsForDateRange(childId: string, startDate: string, endDate: string): Promise<FoodLog[]> {
    try {
      const logs = await this.getFoodLogs(childId, { startDate, endDate });
      return logs;
    } catch (error) {
      console.error('Error fetching logs for date range:', error);
      throw error;
    }
  }

  // Get today's logs
  async getTodaysLogs(childId: string): Promise<FoodLog[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return this.getLogsForDate(childId, today);
  }

  // Get this week's logs
  async getThisWeeksLogs(childId: string): Promise<FoodLog[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    
    return this.getLogsForDateRange(childId, startDate, endDate);
  }

  // Group logs by date
  groupLogsByDate(logs: FoodLog[]): { [date: string]: FoodLog[] } {
    return logs.reduce((grouped, log) => {
      const date = log.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
      return grouped;
    }, {} as { [date: string]: FoodLog[] });
  }

  // Group logs by meal type
  groupLogsByMealType(logs: FoodLog[]): { [mealType: string]: FoodLog[] } {
    return logs.reduce((grouped, log) => {
      const mealType = log.mealType;
      if (!grouped[mealType]) {
        grouped[mealType] = [];
      }
      grouped[mealType].push(log);
      return grouped;
    }, {} as { [mealType: string]: FoodLog[] });
  }

  // Get meal completion for date
  getMealCompletion(logs: FoodLog[], date: string): { 
    breakfast: boolean; 
    lunch: boolean; 
    dinner: boolean; 
    snack: boolean;
    totalMeals: number;
  } {
    const dayLogs = logs.filter(log => log.date === date);
    const mealTypes = new Set(dayLogs.map(log => log.mealType));
    
    return {
      breakfast: mealTypes.has('breakfast'),
      lunch: mealTypes.has('lunch'),
      dinner: mealTypes.has('dinner'),
      snack: mealTypes.has('snack'),
      totalMeals: mealTypes.size
    };
  }

  // Calculate streak (consecutive days with logs)
  calculateLoggingStreak(logs: FoodLog[]): number {
    if (logs.length === 0) return 0;
    
    const dates = [...new Set(logs.map(log => log.date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const logDate of dates) {
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (logDate === expectedDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Get most logged foods
  getMostLoggedFoods(logs: FoodLog[], limit: number = 5): { foodName: string; count: number }[] {
    const foodCounts: { [foodName: string]: number } = {};
    
    logs.forEach(log => {
      log.foods.forEach(food => {
        foodCounts[food.foodName] = (foodCounts[food.foodName] || 0) + 1;
      });
    });
    
    return Object.entries(foodCounts)
      .map(([foodName, count]) => ({ foodName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get favorite meal times
  getFavoriteMealTimes(logs: FoodLog[]): { [mealType: string]: number } {
    const mealCounts: { [mealType: string]: number } = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };
    
    logs.forEach(log => {
      mealCounts[log.mealType]++;
    });
    
    return mealCounts;
  }

  // Calculate average daily calories
  calculateAverageDailyCalories(logs: FoodLog[]): number {
    if (logs.length === 0) return 0;
    
    const dailyCalories = this.groupLogsByDate(logs);
    const totalCalories = Object.values(dailyCalories).reduce((total, dayLogs) => {
      const dayTotal = dayLogs.reduce((daySum, log) => daySum + log.totalNutrition.calories, 0);
      return total + dayTotal;
    }, 0);
    
    const totalDays = Object.keys(dailyCalories).length;
    return totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
  }

  // Get nutrition compliance trends
  getNutritionTrends(summaries: DailyNutritionSummary[]): {
    calories: 'improving' | 'declining' | 'stable';
    protein: 'improving' | 'declining' | 'stable';
    consistency: number;
  } {
    if (summaries.length < 2) {
      return {
        calories: 'stable',
        protein: 'stable',
        consistency: summaries.length > 0 ? 100 : 0
      };
    }
    
    // Calculate trends based on compliance percentages
    const recentSummaries = summaries.slice(-7); // Last 7 days
    const olderSummaries = summaries.slice(-14, -7); // Previous 7 days
    
    const recentCaloriesAvg = recentSummaries.reduce((sum, s) => sum + s.compliance.calories, 0) / recentSummaries.length;
    const olderCaloriesAvg = olderSummaries.length > 0 
      ? olderSummaries.reduce((sum, s) => sum + s.compliance.calories, 0) / olderSummaries.length 
      : recentCaloriesAvg;
    
    const recentProteinAvg = recentSummaries.reduce((sum, s) => sum + s.compliance.protein, 0) / recentSummaries.length;
    const olderProteinAvg = olderSummaries.length > 0 
      ? olderSummaries.reduce((sum, s) => sum + s.compliance.protein, 0) / olderSummaries.length 
      : recentProteinAvg;
    
    const caloriesTrend = recentCaloriesAvg > olderCaloriesAvg + 5 ? 'improving' 
      : recentCaloriesAvg < olderCaloriesAvg - 5 ? 'declining' : 'stable';
    
    const proteinTrend = recentProteinAvg > olderProteinAvg + 5 ? 'improving' 
      : recentProteinAvg < olderProteinAvg - 5 ? 'declining' : 'stable';
    
    // Calculate consistency (percentage of days with logs in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = summaries.filter(s => new Date(s.date) >= thirtyDaysAgo);
    const consistency = Math.round((recentLogs.length / 30) * 100);
    
    return {
      calories: caloriesTrend,
      protein: proteinTrend,
      consistency
    };
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Format short date
  formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  }

  // Get relative date (today, yesterday, etc.)
  getRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return this.formatShortDate(dateString);
    }
  }

  // Check if date is today
  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Get current date in YYYY-MM-DD format
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Get date range for week
  getWeekDateRange(date: Date): { start: string; end: string } {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week (Saturday)
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  // Get date range for month
  getMonthDateRange(date: Date): { start: string; end: string } {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  // Clear food logs data
  clearFoodLogsData(): void {
    this.foodLogsSubject.next([]);
    this.dailySummarySubject.next(null);
  }

  // Get current food logs from subject
  getCurrentFoodLogs(): FoodLog[] {
    return this.foodLogsSubject.value;
  }

  // Get current daily summary from subject
  getCurrentDailySummary(): DailyNutritionSummary | null {
    return this.dailySummarySubject.value;
  }
}