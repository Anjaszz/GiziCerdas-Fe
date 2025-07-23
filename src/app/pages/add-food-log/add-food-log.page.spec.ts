import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFoodLogPage } from './add-food-log.page';

describe('AddFoodLogPage', () => {
  let component: AddFoodLogPage;
  let fixture: ComponentFixture<AddFoodLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
