import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditChildPage } from './edit-child.page';

describe('EditChildPage', () => {
  let component: EditChildPage;
  let fixture: ComponentFixture<EditChildPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChildPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
