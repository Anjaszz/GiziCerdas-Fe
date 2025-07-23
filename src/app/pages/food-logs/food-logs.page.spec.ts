import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodLogsPage } from './food-logs.page';

describe('FoodLogsPage', () => {
  let component: FoodLogsPage;
  let fixture: ComponentFixture<FoodLogsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
