import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditReminderPage } from './edit-reminder.page';

describe('EditReminderPage', () => {
  let component: EditReminderPage;
  let fixture: ComponentFixture<EditReminderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReminderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
