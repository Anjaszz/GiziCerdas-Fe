import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGrowthRecordPage } from './add-growth-record.page';

describe('AddGrowthRecordPage', () => {
  let component: AddGrowthRecordPage;
  let fixture: ComponentFixture<AddGrowthRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrowthRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
