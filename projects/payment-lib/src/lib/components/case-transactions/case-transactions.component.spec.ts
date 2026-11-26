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
    const bulkScaningServiceStub = () => ({
      calculateOutStandingAmount: paymentGroup => {
        const fees = (paymentGroup?.fees || []).reduce((total, fee) => total + (fee.calculated_amount || 0), 0);
        const payments = (paymentGroup?.payments || [])
          .filter(payment => payment.status?.toUpperCase() === 'SUCCESS')
          .reduce((total, payment) => total + (payment.amount || 0), 0);
        const remissions = (paymentGroup?.remissions || []).reduce((total, remission) => total + (remission.hwf_amount || 0), 0);
        return Number((fees - remissions - payments).toFixed(2));
      }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ RpxTranslateMockPipe ],
      providers:[
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: BulkScaningPaymentService, useFactory: bulkScaningServiceStub },
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
  it('finds an eligible non-cancelled service request when cancelled and active requests coexist', () => {
    component.isTurnOff = false;
    component.paymentGroups = [
      {
        service_request_status: 'Cancelled',
        fees: [{ calculated_amount: 100, date_created: new Date() }]
      },
      {
        service_request_status: 'Not paid',
        fees: [{ calculated_amount: 100, date_created: new Date() }]
      }
    ];
    component.updateEligibleNonCancelledServiceRequest();
    expect(component.hasEligibleNonCancelledServiceRequest).toBe(true);
  });
  it('does not find an eligible request when all service requests are cancelled', () => {
    component.isTurnOff = false;
    component.paymentGroups = [
      {
        service_request_status: 'Cancelled',
        fees: [{ calculated_amount: 100, date_created: new Date() }]
      }
    ];
    component.updateEligibleNonCancelledServiceRequest();
    expect(component.hasEligibleNonCancelledServiceRequest).toBe(false);
  });
  it('does not find an eligible request when a non-cancelled request has no fees', () => {
    component.isTurnOff = false;
    component.paymentGroups = [
      { service_request_status: 'Not paid', fees: [] }
    ];
    component.updateEligibleNonCancelledServiceRequest();
    expect(component.hasEligibleNonCancelledServiceRequest).toBe(false);
  });
  it('finds an eligible request in turn-off mode when its outstanding amount is positive', () => {
    component.isTurnOff = true;
    component.paymentGroups = [
      {
        service_request_status: 'Not paid',
        fees: [{ calculated_amount: 100 }],
        payments: [],
        remissions: []
      }
    ];
    component.updateEligibleNonCancelledServiceRequest();
    expect(component.hasEligibleNonCancelledServiceRequest).toBe(true);
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
