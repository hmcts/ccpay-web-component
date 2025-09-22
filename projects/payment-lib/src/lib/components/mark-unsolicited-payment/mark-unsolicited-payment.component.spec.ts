import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { MarkUnsolicitedPaymentComponent } from './mark-unsolicited-payment.component';
import { PaymentLibComponent } from '../../payment-lib.component';

describe('MarkUnsolicitedPaymentComponent', () => {
  let component: MarkUnsolicitedPaymentComponent;
  let fixture: ComponentFixture<MarkUnsolicitedPaymentComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const bulkScaningPaymentServiceStub = () => ({
      removeUnwantedString: (method, string) => ({}),
      postBSWoPGStrategic: postStrategicBody => ({ subscribe: f => f({}) }),
      patchBSChangeStatus: (dcn_reference, string) => ({
        subscribe: f => f({})
      }),
      getBSPaymentsByDCN: bspaymentdcn => ({ subscribe: f => f({}) })
    });
    const paymentViewServiceStub = () => ({
      getSiteID: () => ({ subscribe: f => f({}) }),
      postBSPayments: requestBody => ({ subscribe: f => f({}) }),
      postBSUnsolicitedPayments: reqBody => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        {
          provide: BulkScaningPaymentService,
          useFactory: bulkScaningPaymentServiceStub
        },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MarkUnsolicitedPaymentComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('reasonHasError has default value', () => {
    expect(component.reasonHasError).toEqual(false);
  });

  it('isReasonEmpty has default value', () => {
    expect(component.isReasonEmpty).toEqual(false);
  });

  it('reasonMinHasError has default value', () => {
    expect(component.reasonMinHasError).toEqual(false);
  });

  it('reasonMaxHasError has default value', () => {
    expect(component.reasonMaxHasError).toEqual(false);
  });

  it('responsibleOfficeHasError has default value', () => {
    expect(component.responsibleOfficeHasError).toEqual(false);
  });

  it('isResponsibleOfficeEmpty has default value', () => {
    expect(component.isResponsibleOfficeEmpty).toEqual(false);
  });

  it('isConfirmButtondisabled has default value', () => {
    expect(component.isConfirmButtondisabled).toEqual(false);
  });

  it('isContinueButtondisabled has default value', () => {
    expect(component.isContinueButtondisabled).toEqual(false);
  });

  it('isStrategicFixEnable has default value', () => {
    expect(component.isStrategicFixEnable).toEqual(true);
  });
  it('should return default error message when status is 500', () => {
    const result = component.getErrorMessage(true, 500, 'Custom error message', 'Sample error');
    expect(result.title).toBe('Something went wrong');
    expect(result.body).toBe('Please try again later');
    expect(result.showError).toBe(true);
  });

  it('should return custom error message when status is not 500 and errorMsg is provided', () => {
    const result = component.getErrorMessage(true, 404, 'Custom error message', 'Sample error');
    expect(result.title).toBe('Something went wrong');
    expect(result.body).toBe('Custom error message');
    expect(result.showError).toBe(true);
  });

  it('should return bodyTxt as error message when status is not 500 and errorMsg is undefined', () => {
    const result = component.getErrorMessage(true, 404, undefined, 'Sample error');
    expect(result.title).toBe('Something went wrong');
    expect(result.body).toBe('Sample error');
    expect(result.showError).toBe(true);
  });

  it('should parse and return bodyTxt when error format is "<number> - <message>"', () => {
    const result = component.getErrorMessage(true, 404, undefined, '404 - Not Found');
    expect(result.title).toBe('Something went wrong');
    expect(result.body).toBe('Not Found');
    expect(result.showError).toBe(true);
  });

  it('should return full error message if format is not "<number> - <message>"', () => {
    const result = component.getErrorMessage(true, 404, undefined, 'An unexpected error occurred');
    expect(result.title).toBe('Something went wrong');
    expect(result.body).toBe('An unexpected error occurred');
    expect(result.showError).toBe(true);
  });

});
