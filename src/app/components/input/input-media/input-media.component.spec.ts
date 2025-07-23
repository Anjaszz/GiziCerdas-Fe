import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputMediaComponent } from './input-media.component';

describe('InputMediaComponent', () => {
  let component: InputMediaComponent;
  let fixture: ComponentFixture<InputMediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InputMediaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
