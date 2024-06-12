import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {PbaPaymentComponent} from './pba-payment.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core'
import {PaymentViewService} from "../../services/payment-view/payment-view.service";

@Pipe({name: 'rpxTranslate'})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('PBA payment component', () => {
  let component: PbaPaymentComponent,
    fixture: ComponentFixture<PbaPaymentComponent>;
  const paymentLibComponentStub = () => ({ viewName: {} });
  const emptyServiceStub = () => ({  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpxTranslateMockPipe],
      providers: [
        {provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub},
        {provide: PaymentViewService, useFactory: emptyServiceStub}
      ],
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
