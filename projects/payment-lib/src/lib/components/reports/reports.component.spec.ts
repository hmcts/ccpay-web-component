import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { XlFileService } from '../../services/xl-file/xl-file.service';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const bulkScaningPaymentServiceStub = () => ({
      downloadSelectedReport: (
        selectedReportName,
        selectedStartDate,
        selectedEndDate
      ) => ({ subscribe: f => f({}) })
    });
    const errorHandlerServiceStub = () => ({
      getServerErrorMessage: arg => ({})
    });
    const paymentViewServiceStub = () => ({
      downloadSelectedReport: (
        selectedReportName,
        selectedStartDate,
        selectedEndDate
      ) => ({ subscribe: f => f({}) })
    });
    const xlFileServiceStub = () => ({
      exportAsExcelFile: (arg, arg1) => ({})
    });

    const paymentLibComponentStub = () => ({
      viewName: {}
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReportsComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        {
          provide: BulkScaningPaymentService,
          useFactory: bulkScaningPaymentServiceStub
        },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: XlFileService, useFactory: xlFileServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('isDownLoadButtondisabled has default value', () => {
    expect(component.isDownLoadButtondisabled).toEqual(false);
  });

  it('isStartDateLesthanEndDate has default value', () => {
    expect(component.isStartDateLesthanEndDate).toEqual(false);
  });

  it('isDateRangeBetnWeek has default value', () => {
    expect(component.isDateRangeBetnWeek).toEqual(false);
  });

  it('paymentGroups has default value', () => {
    expect(component.paymentGroups).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'fromValidation').and.callThrough();
      component.ngOnInit();
      expect(component.fromValidation).toHaveBeenCalled();
    });
  });

  // describe('getSelectedFromDate', () => {
  //   it('makes expected calls', () => {
  //     spyOn(component, 'validateDates').and.callThrough();
  //     component.getSelectedFromDate();
  //     expect(component.validateDates).toHaveBeenCalled();
  //   });
  // });

  describe('fromValidation', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.fromValidation();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  // describe('downloadReport', () => {
  //   it('makes expected calls', () => {
  //     const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
  //       BulkScaningPaymentService
  //     );
  //     const errorHandlerServiceStub: ErrorHandlerService = fixture.debugElement.injector.get(
  //       ErrorHandlerService
  //     );
  //     const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
  //       PaymentViewService
  //     );
  //     const xlFileServiceStub: XlFileService = fixture.debugElement.injector.get(
  //       XlFileService
  //     );
  //     spyOn(component, 'tranformDate').and.callThrough();
  //     spyOn(component, 'applyDateFormat').and.callThrough();
  //     spyOn(component, 'convertToFloatValue').and.callThrough();
  //     spyOn(component, 'getFileName').and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'downloadSelectedReport'
  //     ).and.callThrough();
  //     spyOn(errorHandlerServiceStub, 'getServerErrorMessage').and.callThrough();
  //     spyOn(paymentViewServiceStub, 'downloadSelectedReport').and.callThrough();
  //     spyOn(xlFileServiceStub, 'exportAsExcelFile').and.callThrough();
  //     component.downloadReport();
  //     expect(component.tranformDate).toHaveBeenCalled();
  //     expect(component.applyDateFormat).toHaveBeenCalled();
  //     expect(component.convertToFloatValue).toHaveBeenCalled();
  //     expect(component.getFileName).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.downloadSelectedReport
  //     ).toHaveBeenCalled();
  //     expect(errorHandlerServiceStub.getServerErrorMessage).toHaveBeenCalled();
  //     expect(paymentViewServiceStub.downloadSelectedReport).toHaveBeenCalled();
  //     expect(xlFileServiceStub.exportAsExcelFile).toHaveBeenCalled();
  //   });
  // });
});
