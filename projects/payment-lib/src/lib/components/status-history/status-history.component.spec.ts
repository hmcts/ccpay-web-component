import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { StatusHistoryService } from '../../services/status-history/status-history.service';
import { StatusHistoryComponent } from './status-history.component';

describe('StatusHistoryComponent', () => {
  let component: StatusHistoryComponent;
  let fixture: ComponentFixture<StatusHistoryComponent>;
  let statusHistoryServiceSpy: jasmine.SpyObj<StatusHistoryService>;
  let paymentViewServiceSpy: jasmine.SpyObj<PaymentViewService>;

  const paymentLibComponentStub = {
    paymentReference: 'RC-123',
    paymentMethod: 'card'
  };

  beforeEach(() => {
    statusHistoryServiceSpy = jasmine.createSpyObj('StatusHistoryService', ['getPaymentStatusesByReference']);
    paymentViewServiceSpy = jasmine.createSpyObj('PaymentViewService', ['getApportionPaymentDetails']);

    TestBed.configureTestingModule({
      imports: [StatusHistoryComponent],
      providers: [
        { provide: StatusHistoryService, useValue: statusHistoryServiceSpy },
        { provide: PaymentViewService, useValue: paymentViewServiceSpy },
        { provide: 'PAYMENT_LIB', useValue: paymentLibComponentStub }
      ]
    });

    fixture = TestBed.createComponent(StatusHistoryComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('pageTitle has default value', () => {
    expect(component.pageTitle).toEqual('Payment status history');
  });

  describe('ngOnInit', () => {
    it('calls both services with payment reference and method', () => {
      paymentViewServiceSpy.getApportionPaymentDetails.and.returnValue(of({
        payments: [{ channel: 'online', method: 'card' }]
      } as any));
      statusHistoryServiceSpy.getPaymentStatusesByReference.and.returnValue(of({
        status_histories: []
      } as any));

      component.ngOnInit();

      expect(paymentViewServiceSpy.getApportionPaymentDetails).toHaveBeenCalledWith('RC-123');
      expect(statusHistoryServiceSpy.getPaymentStatusesByReference).toHaveBeenCalledWith('RC-123', 'card');
    });

    it('sets display reasons and failure reason column for fallible channel/method', () => {
      paymentViewServiceSpy.getApportionPaymentDetails.and.returnValue(of({
        payments: [{ channel: 'online', method: 'card' }]
      } as any));
      statusHistoryServiceSpy.getPaymentStatusesByReference.and.returnValue(of({
        status_histories: [
          { status: 'success' },
          { status: 'failed' },
          { status: 'cancelled' }
        ]
      } as any));

      component.ngOnInit();

      expect(component.isDisplayReasons).toEqual([false, true, true]);
      expect(component.isDisplayFailureReasonColumn).toBeTrue();
    });

    it('clears display reasons and hides failure reason column for non-fallible channel/method', () => {
      paymentViewServiceSpy.getApportionPaymentDetails.and.returnValue(of({
        payments: [{ channel: 'bulk', method: 'cheque' }]
      } as any));
      statusHistoryServiceSpy.getPaymentStatusesByReference.and.returnValue(of({
        status_histories: [
          { status: 'failed' }
        ]
      } as any));

      component.ngOnInit();

      expect(component.isDisplayReasons).toEqual([]);
      expect(component.isDisplayFailureReasonColumn).toBeFalse();
    });

    it('sets errorMessage when either request errors', () => {
      const errorResponse = {
        replace: () => 'TestError'
      };
      paymentViewServiceSpy.getApportionPaymentDetails.and.returnValue(
        throwError(errorResponse) as any
      );
      statusHistoryServiceSpy.getPaymentStatusesByReference.and.returnValue(of({
        status_histories: []
      } as any));

      component.ngOnInit();

      expect(component.errorMessage).toBe('TestError');
    });
  });
});
