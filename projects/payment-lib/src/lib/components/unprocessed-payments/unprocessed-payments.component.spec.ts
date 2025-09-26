import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { Router } from '@angular/router';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { OrderslistService } from '../../services/orderslist.service';
import { FormsModule } from '@angular/forms';
import { UnprocessedPaymentsComponent } from './unprocessed-payments.component';

describe('UnprocessedPaymentsComponent', () => {
  let component: UnprocessedPaymentsComponent;
  let fixture: ComponentFixture<UnprocessedPaymentsComponent>;

  beforeEach(() => {
    const bulkScaningPaymentServiceStub = () => ({
      getBSPaymentsByDCN: dcnNumber => ({ subscribe: f => f({}) }),
      getBSPaymentsByCCD: ccdCaseNumber => ({ subscribe: f => f({}) }),
      removeUnwantedString: (method, string) => ({})
    });
    const paymentLibComponentStub = () => ({
      CCD_CASE_NUMBER: {},
      SELECTED_OPTION: { toLocaleLowerCase: () => ({}) },
      DCN_NUMBER: {},
      ISBSENABLE: {},
      ISTURNOFF: {},
      ISSFENABLE: {},
      CASETYPE: {},
      bspaymentdcn: {},
      viewName: {},
      unProcessedPaymentServiceId: {},
      isTurnOff: {},
      paymentGroupReference: {}
    });
    const routerStub = () => ({ navigateByUrl: arg => ({}) });
    const paymentViewServiceStub = () => ({});
    const orderslistServiceStub = () => ({
      getFeeExists: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        HttpClientTestingModule,
        UnprocessedPaymentsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: BulkScaningPaymentService,
          useValue: {
            getBSPaymentsByDCN: (dcnNumber: any) => ({ subscribe: (f: any) => f({}) }),
            getBSPaymentsByCCD: (ccdCaseNumber: any) => ({ subscribe: (f: any) => f({}) }),
            removeUnwantedString: (method: any, string: any) => ({})
          }
        },
        { 
          provide: 'PAYMENT_LIB', 
          useValue: {
            CCD_CASE_NUMBER: 'test-case-number',
            SELECTED_OPTION: { toLocaleLowerCase: () => 'test' },
            DCN_NUMBER: 'test-dcn',
            ISBSENABLE: true,
            ISTURNOFF: false,
            ISSFENABLE: true,
            CASETYPE: 'test-case-type',
            bspaymentdcn: 'test-dcn',
            viewName: 'test-view',
            unProcessedPaymentServiceId: 'test-id',
            isTurnOff: false,
            paymentGroupReference: 'test-ref'
          }
        },
        { 
          provide: Router, 
          useValue: { 
            navigateByUrl: (arg: any) => Promise.resolve(true) 
          }
        },
        { 
          provide: PaymentViewService, 
          useValue: {
            getBSfeature: () => ({ subscribe: (f: any) => f({}) }),
            getPaymentGroups: () => ({ subscribe: (f: any) => f([]) }),
            getPaymentGroupDetails: () => ({ subscribe: (f: any) => f({}) })
          }
        },
        { 
          provide: OrderslistService, 
          useValue: {
            getFeeExists: () => ({ subscribe: (f: any) => f({}) })
          }
        }
      ]
    });
    fixture = TestBed.createComponent(UnprocessedPaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('viewStatus has default value', () => {
    expect(component.viewStatus).toEqual('main');
  });

  it('isRecordExist has default value', () => {
    expect(component.isRecordExist).toEqual(false);
  });

  it('isUnprocessedRecordSelected has default value', () => {
    expect(component.isUnprocessedRecordSelected).toEqual(true);
  });

  it('isAllocateToExistingFeebtnEnabled has default value', () => {
    expect(component.isAllocateToExistingFeebtnEnabled).toEqual(false);
  });

  it('isMarkAsUnidentifiedbtnEnabled has default value', () => {
    expect(component.isMarkAsUnidentifiedbtnEnabled).toEqual(false);
  });

  it('isAllocatedToNewFeebtnEnabled has default value', () => {
    expect(component.isAllocatedToNewFeebtnEnabled).toEqual(false);
  });

  it('isExceptionCase has default value', () => {
    expect(component.isExceptionCase).toEqual(false);
  });

  it('isTurnOff has default value', () => {
    expect(component.isTurnOff).toEqual(true);
  });

  it('unassignedRecordListLength has default value', () => {
    expect(component.unassignedRecordListLength).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
        OrderslistService
      );
      spyOn(component, 'getUnassignedPaymentlist').and.callThrough();
      spyOn(orderslistServiceStub, 'getFeeExists').and.callThrough();
      component.ngOnInit();
      expect(component.getUnassignedPaymentlist).toHaveBeenCalled();
      expect(orderslistServiceStub.getFeeExists).toHaveBeenCalled();
    });
  });

  // describe('getUnassignedPaymentlist', () => {
  //   it('makes expected calls', () => {
  //     const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
  //       BulkScaningPaymentService
  //     );
  //     spyOn(component, 'setValuesForUnassignedRecord').and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'getBSPaymentsByDCN'
  //     ).and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'getBSPaymentsByCCD'
  //     ).and.callThrough();
  //     component.getUnassignedPaymentlist();
  //     expect(component.setValuesForUnassignedRecord).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.getBSPaymentsByDCN
  //     ).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.getBSPaymentsByCCD
  //     ).toHaveBeenCalled();
  //   });
  // });
});
