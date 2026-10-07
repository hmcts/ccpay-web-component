import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core'
import { CaseTransactionsComponent } from './case-transactions.component';
import { PaymentViewService} from "../../services/payment-view/payment-view.service";
import { BulkScaningPaymentService} from "../../services/bulk-scaning-payment/bulk-scaning-payment.service";
import { CaseTransactionsService} from "../../services/case-transactions/case-transactions.service";

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('CaseTransactionsComponent', () => {
  let component: CaseTransactionsComponent;
  let fixture: ComponentFixture<CaseTransactionsComponent>;


  beforeEach(() => {
    const paymentLibComponentStub = () => ({
      viewName: {}
    });
    const emptyServiceStub = () => ({  });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ RpxTranslateMockPipe ],
      providers:[
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: BulkScaningPaymentService, useFactory: emptyServiceStub },
        { provide: CaseTransactionsService, useFactory: emptyServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CaseTransactionsComponent);
    component = fixture.componentInstance;
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(CaseTransactionsComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates order fees without currency precision drift', () => {
    component.paymentGroups = [paymentGroupWithTwoFees()];

    component.calculateOrderFeesAmounts();

    expect(component.orderFeesTotal).toBe(2176.64);
  });

  it('calculates order detail fees without currency precision drift', () => {
    component.isFromServiceRequestPage = false;
    component.paymentGroups = [paymentGroupWithTwoFees()];

    component.goToOrderViewDetailSection({ orderRefId: 'group', orderCreated: new Date() });

    expect(component.orderFeesTotal).toBe(2176.64);
  });

  it('calculates case totals without currency precision drift', () => {
    component.isTurnOff = false;
    component.paymentGroups = [paymentGroupWithTwoFees()];

    component.calculateAmounts();

    expect(component.totalFees).toBe(2176.64);
  });

  it('calculates refund amounts without currency precision drift', () => {
    component.isTurnOff = true;
    component.paymentGroups = [{
      fees: [{ calculated_amount: 1789.64 }, { calculated_amount: 387.00 }],
      payments: [{ amount: 3000, status: 'SUCCESS' }],
      remissions: []
    }];

    expect(component.calculateRefundAmount()).toBe(823.36);
  });
});

function paymentGroupWithTwoFees(): any {
  return {
    payment_group_reference: 'group',
    fees: [
      { calculated_amount: 1789.64, over_payment: 0 },
      { calculated_amount: 387.00, over_payment: 0 }
    ],
    payments: [],
    remissions: [],
    service_request_status: 'Not paid'
  };
}
