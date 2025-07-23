// models/food.models.ts - Food Log related interfaces

// Food item from database
export interface Food {
    _id: string;
    name: string;
    category: 'fruit' | 'vegetable' | 'grain' | 'protein' | 'dairy' | 'snack' | 'beverage' | 'other';
    nutritionPer100g: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber?: number;
      sugar?: number;
      sodium?: number;
      calcium?: number;
      iron?: number;
      vitaminC?: number;
    };
    unit: 'gram' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp';
    commonPortions?: {
      name: string;
      grams: number;
    }[];
    isCommon: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  // Food log entry
  export interface FoodLog {
    _id: string;
    childId: string;
    date: string; // YYYY-MM-DD format
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodEntry[];
    totalNutrition: NutritionSummary;
    notes?: string;
    mood?: 'happy' | 'neutral' | 'sad' | 'fussy';
    appetite?: 'poor' | 'normal' | 'good' | 'excellent';
    createdAt: string;
    updatedAt: string;
  }
  
  // Individual food entry in a meal
  export interface FoodEntry {
    foodId: string;
    foodName: string;
    amount: number; // in grams or ml
    unit: string;
    nutrition: NutritionSummary;
    portionDescription?: string; // e.g., "1 medium apple"
  }
  
  // Nutrition summary
  export interface NutritionSummary {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    calcium?: number;
    iron?: number;
    vitaminC?: number;
  }
  
  // Create food log request
  export interface CreateFoodLogRequest {
    childId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: {
      foodId: string;
      amount: number;
      unit: string;
      portionDescription?: string;
    }[];
    notes?: string;
    mood?: 'happy' | 'neutral' | 'sad' | 'fussy';
    appetite?: 'poor' | 'normal' | 'good' | 'excellent';
  }
  
  // Update food log request
  export interface UpdateFoodLogRequest {
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods?: {
      foodId: string;
      amount: number;
      unit: string;
      portionDescription?: string;
    }[];
    notes?: string;
    mood?: 'happy' | 'neutral' | 'sad' | 'fussy';
    appetite?: 'poor' | 'normal' | 'good' | 'excellent';
  }
  
  // Daily nutrition summary
  export interface DailyNutritionSummary {
    date: string;
    childId: string;
    totalNutrition: NutritionSummary;
    mealBreakdown: {
      breakfast: NutritionSummary;
      lunch: NutritionSummary;
      dinner: NutritionSummary;
      snack: NutritionSummary;
    };
    targets: NutritionTargets;
    compliance: {
      calories: number; // percentage
      protein: number;
      carbs: number;
      fat: number;
    };
    mealsLogged: number;
    totalLogs: number;
  }
  
  // Nutrition targets based on age
  export interface NutritionTargets {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    calcium?: number;
    iron?: number;
    vitaminC?: number;
  }
  
  // Food search filters
  export interface FoodSearchFilters {
    query?: string;
    category?: string;
    isCommon?: boolean;
    limit?: number;
    offset?: number;
  }
  
  // Weekly nutrition report
  export interface WeeklyNutritionReport {
    childId: string;
    startDate: string;
    endDate: string;
    averageNutrition: NutritionSummary;
    dailySummaries: DailyNutritionSummary[];
    overallCompliance: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    trendsAnalysis: {
      calories: 'increasing' | 'decreasing' | 'stable';
      protein: 'increasing' | 'decreasing' | 'stable';
      consistency: number; // percentage of days with logs
    };
    recommendations: string[];
  }
  
  // Food log statistics
  export interface FoodLogStats {
    childId: string;
    totalLogs: number;
    logsThisWeek: number;
    logsThisMonth: number;
    averageLogsPerDay: number;
    mostLoggedMeal: string;
    favoriteFood: string;
    nutritionConsistency: number; // percentage
    lastLogDate: string;
  }