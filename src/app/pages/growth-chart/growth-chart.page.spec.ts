import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrowthChartPage } from './growth-chart.page';

describe('GrowthChartPage', () => {
  let component: GrowthChartPage;
  let fixture: ComponentFixture<GrowthChartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
