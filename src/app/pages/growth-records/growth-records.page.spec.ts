import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrowthRecordsPage } from './growth-records.page';

describe('GrowthRecordsPage', () => {
  let component: GrowthRecordsPage;
  let fixture: ComponentFixture<GrowthRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
