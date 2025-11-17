import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AllocatePaymentsComponent } from './allocate-payments.component';
import { CaseTransactionsService} from "../../services/case-transactions/case-transactions.service";
import { PaymentViewService} from "../../services/payment-view/payment-view.service";
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { OrderslistService } from '../../services/orderslist.service';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import { WebComponentHttpClient } from '../../services/shared/httpclient/webcomponent.http.client';
import { PaymentLibComponent } from '../../payment-lib.component';

describe('AllocatePaymentsComponent (basic setup)', () => {
  let component: AllocatePaymentsComponent;
  let fixture: ComponentFixture<AllocatePaymentsComponent>;

  beforeEach(() => {
    const emptyServiceStub = () => ({  });
    const bulkScaningPaymentServiceStub = () => ({
      calculateOutStandingAmount: paymentGroup => ({}),
      postBSPaymentStrategic: (postStrategicBody, payment_group_reference) => ({ subscribe: f => f({}) }),
      patchBSChangeStatus: (dcn_reference, string) => ({ subscribe: f => f({}) }),
      postBSAllocatePayment: (requestBody, payment_group_reference) => ({ subscribe: f => f({}) }),
      getBSPaymentsByDCN: bspaymentdcn => ({ subscribe: f => f({}) })
    });
    const errorHandlerServiceStub = () => ({
      getServerErrorMessage: arg => ({})
    });
    const orderslistServiceStub = () => ({
      getOrdersList: () => ({ subscribe: f => f({}) }),
      getCaseType: () => ({ subscribe: f => f({}) })
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: CaseTransactionsService, useFactory: emptyServiceStub },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: BulkScaningPaymentService, useFactory: bulkScaningPaymentServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    fixture = TestBed.createComponent(AllocatePaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('AllocatePaymentsComponent', () => {
  let component: AllocatePaymentsComponent;
  let fixture: ComponentFixture<AllocatePaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Import HttpClientModule
      // imports : [WebComponentHttpClient],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AllocatePaymentsComponent],
      providers: [
        { provide: CaseTransactionsService, useClass: CaseTransactionsService },
        { provide: PaymentViewService, useClass: PaymentViewService },
        { provide: WebComponentHttpClient, useValue: {} },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent }
      ]
    });
    fixture = TestBed.createComponent(AllocatePaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should emit the correct value via reasonEventEmitter', () => {
    spyOn(component.reasonEventEmitter, 'emit'); // Spy on the emitter
    const testValue = 'testReason';

    component.getReasonValue(testValue); // Call the method

    expect(component.reasonEventEmitter.emit).toHaveBeenCalledWith(testValue); // Assert the emitted value
  });

  it('should emit the correct value via explanationEventEmitter', () => {
    spyOn(component.explanationEventEmitter, 'emit'); // Spy on the emitter
    const testValue = 'testReason';

    component.getExplanationValue(testValue); // Call the method

    expect(component.explanationEventEmitter.emit).toHaveBeenCalledWith(testValue); // Assert the emitted value
  });
});

