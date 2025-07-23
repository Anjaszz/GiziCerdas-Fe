// models/app.models.ts

// Auth Models (already defined in auth.service.ts, but repeated here for clarity)
export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    profileImage?: string;
    createdAt?: string;
  }
  
  // Child Models
  export interface Child {
    _id: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female';
    parentId: string;
    profileImage?: string;
    notes?: string;
    ageInMonths: number;
    createdAt: string;
  }
  
  export interface CreateChildRequest {
    name: string;
    birthDate: string;
    gender: 'male' | 'female';
    notes?: string;
  }
  
  export interface UpdateChildRequest {
    name?: string;
    birthDate?: string;
    gender?: 'male' | 'female';
    notes?: string;
  }
  
  // Growth Record Models
  export interface GrowthRecord {
    _id: string;
    childId: string;
    weight: number; // kg
    height: number; // cm
    ageInMonths: number;
    bmi: number;
    nutritionStatus: 'severely_underweight' | 'underweight' | 'normal' | 'overweight' | 'obese';
    headCircumference?: number; // cm
    notes?: string;
    recordDate: string;
  }
  
  export interface CreateGrowthRecordRequest {
    childId: string;
    weight: number;
    height: number;
    headCircumference?: number;
    notes?: string;
  }
  
  export interface GrowthChartData {
    date: string;
    age: number;
    weight: number;
    height: number;
    bmi: number;
  }
  
  // Food Log Models
  export interface FoodLog {
    _id: string;
    childId: string;
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foodName: string;
    portion: string;
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber?: number; // grams
    sugar?: number; // grams
    sodium?: number; // mg
    photo?: string;
    notes?: string;
    logDate: string;
  }
  
  
  export interface CreateFoodLogRequest {
    childId: string;
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foodName: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    photo?: File;
    notes?: string;
  }
  
  export interface FoodLogResponse {
    foodLogs: FoodLog[];
    pagination: PaginationInfo;
  }
  
  export interface DailyNutritionSummary {
    date: string;
    summary: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
    };
    mealBreakdown: {
      breakfast: { calories: number; count: number };
      lunch: { calories: number; count: number };
      dinner: { calories: number; count: number };
      snack: { calories: number; count: number };
    };
    totalLogs: number;
  }
  
  export interface NutritionNeeds {
    childInfo: {
      name: string;
      ageInMonths: number;
      weight: number;
      height: number;
      bmi: number;
      nutritionStatus: string;
    };
    nutritionNeeds: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      water: number;
    };
    foodRecommendations: {
      category: string;
      items: string[];
    }[];
  }
  
  // Reminder Models
  export interface Reminder {
    _id: string;
    childId: string;
    type: 'meal' | 'vitamin' | 'checkup' | 'medication' | 'exercise' | 'other';
    title: string;
    description?: string;
    time: string; // Format: "HH:MM"
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    isActive: boolean;
    lastTriggered?: string; // ISO date string
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateReminderRequest {
    childId: string;
    type: 'meal' | 'vitamin' | 'checkup' | 'medication' | 'exercise' | 'other';
    title: string;
    description?: string;
    time: string; // Format: "HH:MM"
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    isActive: boolean;
  }
  
  export interface UpdateReminderRequest {
    type?: 'meal' | 'vitamin' | 'checkup' | 'medication' | 'exercise' | 'other';
    title?: string;
    description?: string;
    time?: string; // Format: "HH:MM"
    days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    isActive?: boolean;
  }
  
  // Reminder statistics for dashboard
  export interface ReminderStats {
    totalReminders: number;
    activeReminders: number;
    todaysReminders: number;
    upcomingToday: number;
    overdueReminders: number;
    remindersByType: {
      meal: number;
      vitamin: number;
      checkup: number;
      medication: number;
      exercise: number;
      other: number;
    };
  }
  
  // Education Models
  export interface EducationArticle {
    _id: string;
    title: string;
    content?: string;
    summary: string;
    category: string;
    ageGroup: '0-6m' | '6-12m' | '1-2y' | '2-5y' | '5-12y' | 'all';
    imageUrl?: string;
    author: string;
    readTime: number; // minutes
    tags: string[];
    isPublished: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EducationResponse {
    articles: EducationArticle[];
    pagination: PaginationInfo;
  }
  
  export interface CategoryCount {
    _id: string;
    count: number;
  }
  
  // Report Models
  export interface MonthlyProgressReport {
    period: string;
    childInfo: {
      name: string;
      ageInMonths: number;
    };
    growthRecords: GrowthRecord[];
    growthAnalysis: {
      recordsCount: number;
      weightChange: number;
      heightChange: number;
      bmiChange: number;
    };
    avgDailyNutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
      meals: number;
    };
    mealDistribution: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snack: number;
    };
    totalFoodLogs: number;
    daysWithLogs: number;
    totalDays: number;
    complianceRate: number;
  }
  
  export interface WeeklySummary {
    period: string;
    startDate: string;
    endDate: string;
    dailyData: {
      [key: string]: {
        date: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        mealCount: number;
      };
    };
    totalLogs: number;
  }
  
  export interface GrowthTrendAnalysis {
    childName: string;
    period: string;
    recordsCount: number;
    trends: {
      weight: {
        data: { date: string; age: number; value: number }[];
        trend: 'increasing' | 'decreasing' | 'stable';
      };
      height: {
        data: { date: string; age: number; value: number }[];
        trend: 'increasing' | 'decreasing' | 'stable';
      };
      bmi: {
        data: { date: string; age: number; value: number }[];
        trend: 'increasing' | 'decreasing' | 'stable';
      };
    };
  }
  
  export interface NutritionComplianceReport {
    period: string;
    targets: {
      calories: number;
      protein: number;
      meals: number;
    };
    compliance: {
      calorie: { date: string; value: number }[];
      protein: { date: string; value: number }[];
      mealFrequency: { date: string; value: number }[];
    };
    averageCompliance: {
      calorie: number;
      protein: number;
      mealFrequency: number;
    };
    daysTracked: number;
    totalLogs: number;
  }
  
  // Common Models
  export interface PaginationInfo {
    current: number;
    total: number;
    count: number;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
    details?: { field: string; message: string }[];
  }
  
  // Query Parameters
  export interface FoodLogQueryParams {
    date?: string;
    mealTime?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    limit?: number;
    page?: number;
  }
  
  export interface EducationQueryParams {
    category?: string;
    ageGroup?: '0-6m' | '6-12m' | '1-2y' | '2-5y' | '5-12y' | 'all';
    search?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface GrowthRecordsQueryParams {
    limit?: number;
    sort?: 'asc' | 'desc';
  }
  
  export interface ReportQueryParams {
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv';
    months?: number;
    days?: number;
  }

  
  
  // Enum-like constants
  export const MEAL_TIMES = {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
    SNACK: 'snack'
  } as const;
  
  export const GENDER_OPTIONS = {
    MALE: 'male',
    FEMALE: 'female'
  } as const;
  
  export const NUTRITION_STATUS = {
    SEVERELY_UNDERWEIGHT: 'severely_underweight',
    UNDERWEIGHT: 'underweight',
    NORMAL: 'normal',
    OVERWEIGHT: 'overweight',
    OBESE: 'obese'
  } as const;
  
  export const REMINDER_TYPES = {
    MEAL: 'meal',
    VITAMIN: 'vitamin',
    CHECKUP: 'checkup',
    MEDICATION: 'medication',
    EXERCISE: 'exercise'
  } as const;
  
  export const AGE_GROUPS = {
    '0_6M': '0-6m',
    '6_12M': '6-12m',
    '1_2Y': '1-2y',
    '2_5Y': '2-5y',
    '5_12Y': '5-12y',
    'ALL': 'all'
  } as const;
  
  export const DAYS_OF_WEEK = [
    'monday',
    'tuesday', 
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ] as const;