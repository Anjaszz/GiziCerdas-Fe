// services/food.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Food, FoodSearchFilters, NutritionSummary, NutritionTargets } from '../models/food.models';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiService = inject(ApiService);
  
  private foodsSubject = new BehaviorSubject<Food[]>([]);
  public foods$ = this.foodsSubject.asObservable();

  private commonFoodsSubject = new BehaviorSubject<Food[]>([]);
  public commonFoods$ = this.commonFoodsSubject.asObservable();

  constructor() {}

  // Search foods with filters
  async searchFoods(filters: FoodSearchFilters = {}): Promise<Food[]> {
    try {
      const foods = await this.apiService.getAsync<Food[]>('/foods/search', filters);
      this.foodsSubject.next(foods);
      return foods;
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // Get common foods for quick selection
  async getCommonFoods(): Promise<Food[]> {
    try {
      const foods = await this.apiService.getAsync<Food[]>('/foods/common');
      this.commonFoodsSubject.next(foods);
      return foods;
    } catch (error) {
      console.error('Error fetching common foods:', error);
      throw error;
    }
  }

  // Get food by ID
  async getFoodById(foodId: string): Promise<Food> {
    try {
      return await this.apiService.getAsync<Food>(`/foods/${foodId}`);
    } catch (error) {
      console.error('Error fetching food:', error);
      throw error;
    }
  }

  // Get foods by category
  async getFoodsByCategory(category: string): Promise<Food[]> {
    try {
      const foods = await this.apiService.getAsync<Food[]>(`/foods/category/${category}`);
      return foods;
    } catch (error) {
      console.error('Error fetching foods by category:', error);
      throw error;
    }
  }

  // Calculate nutrition for amount
  calculateNutrition(food: Food, amountInGrams: number): NutritionSummary {
    const multiplier = amountInGrams / 100; // nutrition is per 100g
    
    return {
      calories: Math.round(food.nutritionPer100g.calories * multiplier),
      protein: Math.round(food.nutritionPer100g.protein * multiplier * 10) / 10,
      carbs: Math.round(food.nutritionPer100g.carbs * multiplier * 10) / 10,
      fat: Math.round(food.nutritionPer100g.fat * multiplier * 10) / 10,
      fiber: food.nutritionPer100g.fiber ? Math.round(food.nutritionPer100g.fiber * multiplier * 10) / 10 : undefined,
      sugar: food.nutritionPer100g.sugar ? Math.round(food.nutritionPer100g.sugar * multiplier * 10) / 10 : undefined,
      sodium: food.nutritionPer100g.sodium ? Math.round(food.nutritionPer100g.sodium * multiplier * 10) / 10 : undefined,
      calcium: food.nutritionPer100g.calcium ? Math.round(food.nutritionPer100g.calcium * multiplier * 10) / 10 : undefined,
      iron: food.nutritionPer100g.iron ? Math.round(food.nutritionPer100g.iron * multiplier * 10) / 10 : undefined,
      vitaminC: food.nutritionPer100g.vitaminC ? Math.round(food.nutritionPer100g.vitaminC * multiplier * 10) / 10 : undefined
    };
  }

  // Sum multiple nutrition summaries
  sumNutrition(nutritions: NutritionSummary[]): NutritionSummary {
    return nutritions.reduce((total, nutrition) => ({
      calories: total.calories + nutrition.calories,
      protein: Math.round((total.protein + nutrition.protein) * 10) / 10,
      carbs: Math.round((total.carbs + nutrition.carbs) * 10) / 10,
      fat: Math.round((total.fat + nutrition.fat) * 10) / 10,
      fiber: total.fiber !== undefined && nutrition.fiber !== undefined 
        ? Math.round((total.fiber + nutrition.fiber) * 10) / 10 
        : total.fiber || nutrition.fiber,
      sugar: total.sugar !== undefined && nutrition.sugar !== undefined 
        ? Math.round((total.sugar + nutrition.sugar) * 10) / 10 
        : total.sugar || nutrition.sugar,
      sodium: total.sodium !== undefined && nutrition.sodium !== undefined 
        ? Math.round((total.sodium + nutrition.sodium) * 10) / 10 
        : total.sodium || nutrition.sodium,
      calcium: total.calcium !== undefined && nutrition.calcium !== undefined 
        ? Math.round((total.calcium + nutrition.calcium) * 10) / 10 
        : total.calcium || nutrition.calcium,
      iron: total.iron !== undefined && nutrition.iron !== undefined 
        ? Math.round((total.iron + nutrition.iron) * 10) / 10 
        : total.iron || nutrition.iron,
      vitaminC: total.vitaminC !== undefined && nutrition.vitaminC !== undefined 
        ? Math.round((total.vitaminC + nutrition.vitaminC) * 10) / 10 
        : total.vitaminC || nutrition.vitaminC
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  }

  // Get nutrition targets based on age
  getNutritionTargets(ageInMonths: number): NutritionTargets {
    // Based on Indonesian RDA for children
    if (ageInMonths <= 6) {
      return {
        calories: 550,
        protein: 9,
        carbs: 82,
        fat: 20,
        fiber: 0,
        calcium: 200,
        iron: 0.3,
        vitaminC: 40
      };
    } else if (ageInMonths <= 12) {
      return {
        calories: 800,
        protein: 15,
        carbs: 120,
        fat: 30,
        fiber: 10,
        calcium: 250,
        iron: 7,
        vitaminC: 50
      };
    } else if (ageInMonths <= 24) {
      return {
        calories: 1125,
        protein: 20,
        carbs: 155,
        fat: 44,
        fiber: 12,
        calcium: 650,
        iron: 8,
        vitaminC: 40
      };
    } else if (ageInMonths <= 60) {
      return {
        calories: 1400,
        protein: 35,
        carbs: 200,
        fat: 50,
        fiber: 15,
        calcium: 700,
        iron: 9,
        vitaminC: 45
      };
    } else {
      return {
        calories: 1800,
        protein: 45,
        carbs: 250,
        fat: 65,
        fiber: 20,
        calcium: 1000,
        iron: 13,
        vitaminC: 50
      };
    }
  }

  // Calculate compliance percentage
  calculateCompliance(consumed: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((consumed / target) * 100), 150); // Cap at 150%
  }

  // Get food categories
  getFoodCategories(): { value: string; label: string; icon: string; color: string }[] {
    return [
      {
        value: 'fruit',
        label: 'Buah-buahan',
        icon: '🍎',
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      {
        value: 'vegetable',
        label: 'Sayuran',
        icon: '🥬',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      {
        value: 'grain',
        label: 'Biji-bijian',
        icon: '🌾',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      {
        value: 'protein',
        label: 'Protein',
        icon: '🥩',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      {
        value: 'dairy',
        label: 'Susu & Olahannya',
        icon: '🥛',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      {
        value: 'snack',
        label: 'Camilan',
        icon: '🍪',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      {
        value: 'beverage',
        label: 'Minuman',
        icon: '🥤',
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
      },
      {
        value: 'other',
        label: 'Lainnya',
        icon: '🍽️',
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      }
    ];
  }

  // Get food category info
  getFoodCategoryInfo(category: string) {
    const categories = this.getFoodCategories();
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  }

  // Get meal type info
  getMealTypeInfo(mealType: string): { icon: string; label: string; color: string; timeRange: string } {
    switch (mealType) {
      case 'breakfast':
        return {
          icon: '🌅',
          label: 'Sarapan',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          timeRange: '06:00 - 10:00'
        };
      case 'lunch':
        return {
          icon: '☀️',
          label: 'Makan Siang',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          timeRange: '11:00 - 14:00'
        };
      case 'dinner':
        return {
          icon: '🌙',
          label: 'Makan Malam',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          timeRange: '17:00 - 20:00'
        };
      case 'snack':
        return {
          icon: '🍪',
          label: 'Camilan',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          timeRange: 'Kapan saja'
        };
      default:
        return {
          icon: '🍽️',
          label: 'Lainnya',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          timeRange: ''
        };
    }
  }

  // Get mood info
  getMoodInfo(mood: string): { icon: string; label: string; color: string } {
    switch (mood) {
      case 'happy':
        return {
          icon: '😊',
          label: 'Senang',
          color: 'text-green-600'
        };
      case 'neutral':
        return {
          icon: '😐',
          label: 'Biasa',
          color: 'text-gray-600'
        };
      case 'sad':
        return {
          icon: '😢',
          label: 'Sedih',
          color: 'text-blue-600'
        };
      case 'fussy':
        return {
          icon: '😤',
          label: 'Rewel',
          color: 'text-red-600'
        };
      default:
        return {
          icon: '😐',
          label: 'Tidak Dicatat',
          color: 'text-gray-400'
        };
    }
  }

  // Get appetite info
  getAppetiteInfo(appetite: string): { icon: string; label: string; color: string } {
    switch (appetite) {
      case 'excellent':
        return {
          icon: '😋',
          label: 'Sangat Baik',
          color: 'text-green-600'
        };
      case 'good':
        return {
          icon: '🙂',
          label: 'Baik',
          color: 'text-blue-600'
        };
      case 'normal':
        return {
          icon: '😐',
          label: 'Normal',
          color: 'text-gray-600'
        };
      case 'poor':
        return {
          icon: '😞',
          label: 'Kurang',
          color: 'text-red-600'
        };
      default:
        return {
          icon: '😐',
          label: 'Tidak Dicatat',
          color: 'text-gray-400'
        };
    }
  }

  // Convert units
  convertToGrams(amount: number, unit: string, food: Food): number {
    switch (unit) {
      case 'gram':
      case 'g':
        return amount;
      case 'ml':
        return amount; // Assume 1ml = 1g for liquids
      case 'kg':
        return amount * 1000;
      case 'piece':
        // Use average weight for common foods
        const pieceWeight = this.getPieceWeight(food);
        return amount * pieceWeight;
      case 'cup':
        return amount * 240; // 1 cup = 240g
      case 'tbsp':
        return amount * 15; // 1 tbsp = 15g
      case 'tsp':
        return amount * 5; // 1 tsp = 5g
      default:
        return amount;
    }
  }

  // Get estimated weight for one piece of food
  private getPieceWeight(food: Food): number {
    // Common piece weights (can be enhanced with database values)
    const commonWeights: { [key: string]: number } = {
      'apel': 150,
      'pisang': 120,
      'jeruk': 130,
      'telur': 50,
      'roti': 25,
      'biskuit': 5
    };

    const foodName = food.name.toLowerCase();
    for (const [key, weight] of Object.entries(commonWeights)) {
      if (foodName.includes(key)) {
        return weight;
      }
    }

    return 100; // Default weight
  }

  // Clear food data
  clearFoodData(): void {
    this.foodsSubject.next([]);
    this.commonFoodsSubject.next([]);
  }
}