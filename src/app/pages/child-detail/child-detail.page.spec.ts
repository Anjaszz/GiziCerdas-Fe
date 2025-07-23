import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildDetailPage } from './child-detail.page';

describe('ChildDetailPage', () => {
  let component: ChildDetailPage;
  let fixture: ComponentFixture<ChildDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
