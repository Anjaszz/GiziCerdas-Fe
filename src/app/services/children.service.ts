// services/children.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Child, CreateChildRequest, UpdateChildRequest } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  private apiService = inject(ApiService);
  
  private childrenSubject = new BehaviorSubject<Child[]>([]);
  public children$ = this.childrenSubject.asObservable();
  
  private selectedChildSubject = new BehaviorSubject<Child | null>(null);
  public selectedChild$ = this.selectedChildSubject.asObservable();

  constructor() {
    this.loadChildren();
  }

  // Get all children
  async getChildren(): Promise<Child[]> {
    try {
      const children = await this.apiService.getAsync<Child[]>('/children');
      this.childrenSubject.next(children);
      
      // Set first child as selected if none is selected
      if (children.length > 0 && !this.selectedChildSubject.value) {
        this.setSelectedChild(children[0]);
      }
      
      return children;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  }

  // Load children from API
  async loadChildren(): Promise<void> {
    await this.getChildren();
  }

  // Get specific child by ID
  async getChildById(childId: string): Promise<Child> {
    try {
      const child = await this.apiService.getAsync<Child>(`/children/${childId}`);
      return child;
    } catch (error) {
      console.error('Error fetching child:', error);
      throw error;
    }
  }

  // Add new child
  async addChild(childData: CreateChildRequest): Promise<Child> {
    try {
      const newChild = await this.apiService.postAsync<Child>('/children', childData);
      
      // Update local children list
      const currentChildren = this.childrenSubject.value;
      this.childrenSubject.next([...currentChildren, newChild]);
      
      // Set as selected child if it's the first one
      if (currentChildren.length === 0) {
        this.setSelectedChild(newChild);
      }
      
      return newChild;
    } catch (error) {
      console.error('Error adding child:', error);
      throw error;
    }
  }

  // Update child
  async updateChild(childId: string, updateData: UpdateChildRequest): Promise<Child> {
    try {
      const updatedChild = await this.apiService.putAsync<Child>(`/children/${childId}`, updateData);
      
      // Update local children list
      const currentChildren = this.childrenSubject.value;
      const updatedChildren = currentChildren.map(child => 
        child._id === childId ? updatedChild : child
      );
      this.childrenSubject.next(updatedChildren);
      
      // Update selected child if it's the one being updated
      const selectedChild = this.selectedChildSubject.value;
      if (selectedChild && selectedChild._id === childId) {
        this.selectedChildSubject.next(updatedChild);
      }
      
      return updatedChild;
    } catch (error) {
      console.error('Error updating child:', error);
      throw error;
    }
  }

  // Delete child
  async deleteChild(childId: string): Promise<void> {
    try {
      await this.apiService.deleteAsync(`/children/${childId}`);
      
      // Remove from local children list
      const currentChildren = this.childrenSubject.value;
      const filteredChildren = currentChildren.filter(child => child._id !== childId);
      this.childrenSubject.next(filteredChildren);
      
      // Update selected child if the deleted one was selected
      const selectedChild = this.selectedChildSubject.value;
      if (selectedChild && selectedChild._id === childId) {
        const newSelectedChild = filteredChildren.length > 0 ? filteredChildren[0] : null;
        this.selectedChildSubject.next(newSelectedChild);
      }
      
    } catch (error) {
      console.error('Error deleting child:', error);
      throw error;
    }
  }

  // Set selected child
  setSelectedChild(child: Child | null): void {
    this.selectedChildSubject.next(child);
    
    // Store in localStorage for persistence
    if (child) {
      localStorage.setItem('selectedChildId', child._id);
    } else {
      localStorage.removeItem('selectedChildId');
    }
  }

  // Get selected child
  getSelectedChild(): Child | null {
    return this.selectedChildSubject.value;
  }

  // Get selected child ID
  getSelectedChildId(): string | null {
    const selectedChild = this.selectedChildSubject.value;
    return selectedChild ? selectedChild._id : null;
  }

  // Restore selected child from localStorage
  async restoreSelectedChild(): Promise<void> {
    const storedChildId = localStorage.getItem('selectedChildId');
    if (storedChildId) {
      const children = this.childrenSubject.value;
      const storedChild = children.find(child => child._id === storedChildId);
      if (storedChild) {
        this.setSelectedChild(storedChild);
      } else {
        // If stored child not found in current list, try to fetch it
        try {
          const child = await this.getChildById(storedChildId);
          this.setSelectedChild(child);
        } catch (error) {
          console.warn('Stored child not found, clearing selection');
          localStorage.removeItem('selectedChildId');
        }
      }
    }
  }

  // Calculate age in months
  calculateAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();
    
    // Adjust if the day hasn't occurred yet this month
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  }

  // Calculate age in years and months
  calculateAge(birthDate: string): { years: number; months: number } {
    const totalMonths = this.calculateAgeInMonths(birthDate);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return { years, months };
  }

  // Format age for display
  formatAge(birthDate: string): string {
    const { years, months } = this.calculateAge(birthDate);
    
    if (years === 0) {
      return `${months} bulan`;
    } else if (months === 0) {
      return `${years} tahun`;
    } else {
      return `${years} tahun ${months} bulan`;
    }
  }

  // Get children count
  getChildrenCount(): number {
    return this.childrenSubject.value.length;
  }

  // Check if user has children
  hasChildren(): boolean {
    return this.getChildrenCount() > 0;
  }

  // Search children by name
  searchChildren(query: string): Child[] {
    const children = this.childrenSubject.value;
    if (!query.trim()) {
      return children;
    }
    
    return children.filter(child => 
      child.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Sort children by different criteria
  sortChildren(criteria: 'name' | 'age' | 'created', order: 'asc' | 'desc' = 'asc'): Child[] {
    const children = [...this.childrenSubject.value];
    
    return children.sort((a, b) => {
      let comparison = 0;
      
      switch (criteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          comparison = a.ageInMonths - b.ageInMonths;
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }

  // Clear all data (for logout)
  clearData(): void {
    this.childrenSubject.next([]);
    this.selectedChildSubject.next(null);
    localStorage.removeItem('selectedChildId');
  }
}