import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddChildPage } from './add-child.page';

describe('AddChildPage', () => {
  let component: AddChildPage;
  let fixture: ComponentFixture<AddChildPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
