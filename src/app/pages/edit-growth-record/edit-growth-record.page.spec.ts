import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditGrowthRecordPage } from './edit-growth-record.page';

describe('EditGrowthRecordPage', () => {
  let component: EditGrowthRecordPage;
  let fixture: ComponentFixture<EditGrowthRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrowthRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
