import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PbaDetailsComponent } from './pba-details.component';
import { PaymentViewService } from "../../services/payment-view/payment-view.service"

describe('PbaDetailsComponent', () => {
  let component: PbaDetailsComponent;
  let fixture: ComponentFixture<PbaDetailsComponent>;
  const emptyServiceStub = () => ({  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PbaDetailsComponent],
      providers: [
        { provide: PaymentViewService, useFactory: emptyServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PbaDetailsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
