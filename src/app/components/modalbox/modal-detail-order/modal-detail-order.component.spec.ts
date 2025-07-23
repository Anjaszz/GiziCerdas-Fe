import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailOrderComponent } from './modal-detail-order.component';

describe('ModalDetailOrderComponent', () => {
  let component: ModalDetailOrderComponent;
  let fixture: ComponentFixture<ModalDetailOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
