import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaymentLibComponent } from '../../payment-lib.component';
import { PbaPaymentComponent } from './pba-payment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Add remission component', () => {
  let component: PbaPaymentComponent,
  fixture: ComponentFixture<PbaPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PbaPaymentComponent],
      providers: [PaymentLibComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PbaPaymentComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });
});
