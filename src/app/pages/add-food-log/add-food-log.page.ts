// pages/food-logs/add-food-log/add-food-log.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  addOutline,
  searchOutline,
  restaurantOutline,
  scaleOutline,
  removeCircleOutline,
  saveOutline,
  timeOutline,
  happyOutline,
  documentTextOutline
} from 'ionicons/icons';
import { FoodLogsService } from '../../services/food-logs.service';
import { FoodService } from '../../services/food.service';
import { ChildrenService } from '../../services/children.service';
import { Food, CreateFoodLogRequest, NutritionSummary, FoodEntry } from '../../models/food.models';
import { Child } from '../../models/app.models';

interface SelectedFood {
  food: Food;
  amount: number;
  unit: string;
  nutrition: NutritionSummary;
  portionDescription?: string;
}

@Component({
  selector: 'app-add-food-log',
  templateUrl: './add-food-log.page.html',
  styleUrls: ['./add-food-log.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast,
    FormsModule
  ]
})
export class AddFoodLogPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private foodLogsService = inject(FoodLogsService);
  private foodService = inject(FoodService);
  private childrenService = inject(ChildrenService);

  childId: string = '';
  child: Child | null = null;
  addFoodLogForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Form step tracking
  currentStep: 1 | 2 | 3 = 1;

  // Food search and selection
  searchQuery = '';
  searchResults: Food[] = [];
  commonFoods: Food[] = [];
  selectedFoods: SelectedFood[] = [];
  totalNutrition: NutritionSummary = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Current food being added
  currentFood: Food | null = null;
  currentAmount = 100;
  currentUnit = 'gram';

  // UI states
  isSearching = false;
  showFoodSelector = false;
  showAmountSelector = false;

  constructor() {
    addIcons({
      arrowBackOutline,
      addOutline,
      searchOutline,
      restaurantOutline,
      scaleOutline,
      removeCircleOutline,
      saveOutline,
      timeOutline,
      happyOutline,
      documentTextOutline
    });

    this.addFoodLogForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      mealType: ['breakfast', [Validators.required]],
      notes: ['', [Validators.maxLength(500)]],
      mood: [''],
      appetite: ['']
    });
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    
    // Get meal type from query params if provided
    const mealType = this.route.snapshot.queryParamMap.get('mealType');
    if (mealType) {
      this.addFoodLogForm.patchValue({ mealType });
    }
    
    if (this.childId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      // Load common foods
      await this.loadCommonFoods();
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      this.showToastMessage('Gagal memuat data', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async loadCommonFoods() {
    try {
      this.commonFoods = await this.foodService.getCommonFoods();
    } catch (error) {
      console.error('Error loading common foods:', error);
    }
  }

  // Step navigation
  nextStep() {
    if (this.currentStep < 3) {
      if (this.isStepValid(this.currentStep)) {
        this.currentStep++;
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.selectedFoods.length > 0;
      case 2:
        return !!this.addFoodLogForm.get('mealType')?.value && 
               !!this.addFoodLogForm.get('date')?.value;
      case 3:
        return this.addFoodLogForm.valid;
      default:
        return false;
    }
  }

  // Food search
  async searchFoods() {
    if (this.searchQuery.trim().length < 2) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    try {
      this.searchResults = await this.foodService.searchFoods({
        query: this.searchQuery,
        limit: 20
      });
    } catch (error) {
      console.error('Error searching foods:', error);
      this.showToastMessage('Gagal mencari makanan', 'danger');
    } finally {
      this.isSearching = false;
    }
  }

  // Food selection
  selectFood(food: Food) {
    this.currentFood = food;
    this.currentAmount = 100;
    this.currentUnit = food.unit;
    this.showAmountSelector = true;
    this.showFoodSelector = false;
  }

  addSelectedFood() {
    if (!this.currentFood) return;

    const amountInGrams = this.foodService.convertToGrams(
      this.currentAmount, 
      this.currentUnit, 
      this.currentFood
    );

    const nutrition = this.foodService.calculateNutrition(this.currentFood, amountInGrams);

    const selectedFood: SelectedFood = {
      food: this.currentFood,
      amount: this.currentAmount,
      unit: this.currentUnit,
      nutrition,
      portionDescription: this.getPortionDescription()
    };

    this.selectedFoods.push(selectedFood);
    this.calculateTotalNutrition();
    
    // Reset selection
    this.currentFood = null;
    this.showAmountSelector = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  removeSelectedFood(index: number) {
    this.selectedFoods.splice(index, 1);
    this.calculateTotalNutrition();
  }

  calculateTotalNutrition() {
    this.totalNutrition = this.foodService.sumNutrition(
      this.selectedFoods.map(sf => sf.nutrition)
    );
  }

  getPortionDescription(): string {
    if (!this.currentFood) return '';
    
    if (this.currentUnit === 'piece') {
      return `${this.currentAmount} ${this.currentAmount === 1 ? 'buah' : 'buah'}`;
    } else if (this.currentUnit === 'cup') {
      return `${this.currentAmount} gelas`;
    } else if (this.currentUnit === 'tbsp') {
      return `${this.currentAmount} sendok makan`;
    } else if (this.currentUnit === 'tsp') {
      return `${this.currentAmount} sendok teh`;
    } else {
      return `${this.currentAmount}${this.currentUnit}`;
    }
  }

  // Form submission
  async onSubmit() {
    if (this.addFoodLogForm.valid && this.selectedFoods.length > 0) {
      this.isLoading = true;
      try {
        const formData = this.addFoodLogForm.value;
        
        const foodLogData: CreateFoodLogRequest = {
          childId: this.childId,
          date: formData.date,
          mealType: formData.mealType,
          foods: this.selectedFoods.map(sf => ({
            foodId: sf.food._id,
            amount: this.foodService.convertToGrams(sf.amount, sf.unit, sf.food),
            unit: 'gram',
            portionDescription: sf.portionDescription
          })),
          notes: formData.notes || undefined,
          mood: formData.mood || undefined,
          appetite: formData.appetite || undefined
        };
        
        await this.foodLogsService.addFoodLog(foodLogData);
        
        const mealInfo = this.foodService.getMealTypeInfo(formData.mealType);
        this.showToastMessage(`${mealInfo.label} berhasil dicatat!`, 'success');
        
        // Navigate back to food logs after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/food-logs', this.childId]);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal menyimpan log makanan. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.showToastMessage('Pastikan semua data telah diisi dengan benar', 'warning');
    }
  }

  // Navigation
  goBack() {
    this.router.navigate(['/food-logs', this.childId]);
  }

  // Utility methods
  getMealTypeInfo(mealType: string) {
    return this.foodService.getMealTypeInfo(mealType);
  }

  getFoodCategoryInfo(category: string) {
    return this.foodService.getFoodCategoryInfo(category);
  }

  getMoodInfo(mood: string) {
    return this.foodService.getMoodInfo(mood);
  }

  getAppetiteInfo(appetite: string) {
    return this.foodService.getAppetiteInfo(appetite);
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  getNutritionTargets() {
    if (!this.child) return null;
    const ageInMonths = this.childrenService.calculateAgeInMonths(this.child.birthDate);
    return this.foodService.getNutritionTargets(ageInMonths);
  }

  getCompliancePercentage(consumed: number, target: number): number {
    return this.foodService.calculateCompliance(consumed, target);
  }

  getComplianceColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  toggleFoodSelector() {
    this.showFoodSelector = !this.showFoodSelector;
    if (this.showFoodSelector) {
      this.showAmountSelector = false;
    }
  }

  cancelFoodSelection() {
    this.currentFood = null;
    this.showAmountSelector = false;
    this.showFoodSelector = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  updateAmount(amount: number) {
    this.currentAmount = Math.max(0.1, amount);
  }

  updateUnit(unit: string) {
    this.currentUnit = unit;
  }

  getAvailableUnits(): string[] {
    if (!this.currentFood) return ['gram'];
    
    const units = ['gram', 'kg'];
    
    if (this.currentFood.unit === 'ml' || this.currentFood.category === 'beverage') {
      units.push('ml');
    }
    
    if (this.currentFood.commonPortions?.length) {
      units.push('piece');
    }
    
    units.push('cup', 'tbsp', 'tsp');
    
    return units;
  }

    // Math wrapper methods for template access
    mathMin(a: number, b: number): number {
      return Math.min(a, b);
    }
  
    mathMax(a: number, b: number): number {
      return Math.max(a, b);
    }
  
    mathRound(value: number): number {
      return Math.round(value);
    }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Wrapper methods for template access
  calculateNutritionWrapper(food: Food, amountInGrams: number): NutritionSummary {
    return this.foodService.calculateNutrition(food, amountInGrams);
  }

  convertToGramsWrapper(amount: number, unit: string, food: Food): number {
    return this.foodService.convertToGrams(amount, unit, food);
  }
}