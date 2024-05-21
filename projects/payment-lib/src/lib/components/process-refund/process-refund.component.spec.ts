import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RefundsService } from '../../services/refunds/refunds.service';
import { OrderslistService } from '../../services/orderslist.service';
//import { FakePaymentLibComponent } from '../../fake-payment-lib.component';
import { ProcessRefundComponent } from './process-refund.component';
import { of } from 'rxjs';
import {FakePaymentLibComponent} from "../../fake-payment-lib.component";
import { PaymentLibComponent} from "../../payment-lib.component";

describe('ProcessRefundComponent', () => {
  let component: ProcessRefundComponent;
  let fixture: ComponentFixture<ProcessRefundComponent>;

  let form = new FormGroup({
    refundActionField: new FormControl(),
    refundRejectReasonField: new FormControl(),
    sendMeBackField: new FormControl(),
    enterReasonField: new FormControl()
  });

  form.setValue({refundActionField:"Approve",refundRejectReasonField:"",sendMeBackField:"Test Refund  Reason",enterReasonField:"Default Reason"});


  beforeEach(async () => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const refundsServiceStub = () => ({
      getRefundActions: refundReference => ({ subscribe: f => f({}) }),
      getRefundRejectReasons: () => ({ subscribe: f => f({}) }),
      patchRefundActions: (processRefundRequest, refundReference, status) => ({
        subscribe: f => f({})
      })
    });
    const orderslistServiceStub = () => ({
      getnavigationPageValue: () => ({ subscribe: f => f({}) })
    });
    //const paymentLibComponentStub = () => ({ viewName: {} });
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProcessRefundComponent, FakePaymentLibComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: RefundsService, useFactory: refundsServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        { provide: PaymentLibComponent, useValue: FakePaymentLibComponent }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProcessRefundComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('refundActionList has default value', () => {
    expect(component.refundActionList).toEqual([]);
  });

  it('refundRejectReasonList has default value', () => {
    expect(component.refundRejectReasonList).toEqual([]);
  });

  it('isSendMeBackClicked has default value', () => {
    expect(component.isSendMeBackClicked).toEqual(false);
  });

  it('isRejectClicked has default value', () => {
    expect(component.isRejectClicked).toEqual(false);
  });

  it('isOtherClicked has default value', () => {
    expect(component.isOtherClicked).toEqual(false);
  });

  it('isSuccesspageEnable has default value', () => {
    expect(component.isSuccesspageEnable).toEqual(false);
  });

  it('refundActionsHasError has default value', () => {
    expect(component.refundActionsHasError).toEqual(false);
  });

  it('refundRejectReasonHasError has default value', () => {
    expect(component.refundRejectReasonHasError).toEqual(false);
  });

  it('isReasonFieldEmpty has default value', () => {
    expect(component.isReasonFieldEmpty).toEqual(false);
  });

  it('isReasonFieldInvalid has default value', () => {
    expect(component.isReasonFieldInvalid).toEqual(false);
  });

  it('reasonFieldMinHasError has default value', () => {
    expect(component.reasonFieldMinHasError).toEqual(false);
  });

  it('reasonFieldMaxHasError has default value', () => {
    expect(component.reasonFieldMaxHasError).toEqual(false);
  });

  it('isReasonEmpty has default value', () => {
    expect(component.isReasonEmpty).toEqual(false);
  });

  it('isReasonInvalid has default value', () => {
    expect(component.isReasonInvalid).toEqual(false);
  });

  it('isConfirmButtondisabled has default value', () => {
    expect(component.isConfirmButtondisabled).toEqual(true);
  });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
  //       FormBuilder
  //     );
  //     const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
  //       RefundsService
  //     );
  //     spyOn(component, 'getErrorMessage').and.callThrough();
  //     spyOn(formBuilderStub, 'group').and.callThrough();
  //     spyOn(refundsServiceStub, 'getRefundActions').and.callThrough();
  //     component.ngOnInit();
  //     expect(component.getErrorMessage).toHaveBeenCalled();
  //     expect(formBuilderStub.group).toHaveBeenCalled();
  //     expect(refundsServiceStub.getRefundActions).toHaveBeenCalled();
  //   });
  // });

  describe('processRefundSubmit', () => {
    it('makes expected calls', () => {
      const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
        RefundsService
      );
      spyOn(component, 'resetForm').and.callThrough();
      spyOn(component, 'getErrorMessage').and.callThrough();
      const mockResponse = "Refund Approved";
      spyOn(refundsServiceStub, 'patchRefundActions').and.returnValue(of(mockResponse));
      component.processRefundForm = form;
      // component.processRefundForm.setValue({refundActionField : "Approve"});
      // component.processRefundForm.setValue({refundRejectReasonField : ""});
      component.processRefundSubmit();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.getErrorMessage).not.toHaveBeenCalled();
      expect(refundsServiceStub.patchRefundActions).not.toHaveBeenCalled();
    });
  });

  describe('loadRefundListPage', () => {
    it('makes expected calls', () => {
      const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
        OrderslistService
      );
      spyOn(orderslistServiceStub, 'getnavigationPageValue').and.callThrough();
      component.loadRefundListPage();
      expect(orderslistServiceStub.getnavigationPageValue).toHaveBeenCalled();
    });
  });
});
