import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Category {
  _id: string;
  title: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  data: {
    categories: Category[];
    pages: number;
    total?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `https://inspira-blog-api.vercel.app/api/v1/category`;

  constructor(private http: HttpClient) {}

  getPagedCategories(page: number, itemsPerPage: number, search: string = ''): Observable<{
    items: Category[];
    total: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('q', search);
    
    return this.http.get<CategoryResponse>(this.baseUrl, { params })
      .pipe(
        map(response => ({
          items: response.data.categories,
          total: response.data.pages * itemsPerPage // Approximate total items
        }))
      );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}