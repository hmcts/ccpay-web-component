import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IRefundList } from '../../interfaces/IRefundList';
import { OrderslistService } from '../../services/orderslist.service';
import { TableComponent } from './table.component';
import {ActivatedRoute} from "@angular/router";

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const emptyServiceStub = () => ({  });

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const paymentLibComponentStub = () => ({
      refundlistsource: {},
      refundReference: {},
      viewName: {},
      CCD_CASE_NUMBER: {},
      isRefundStatusView: {},
      isCallFromRefundList: {}
    });
    const orderslistServiceStub = () => ({ setRefundView: refundData => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TableComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        { provide: ActivatedRoute, useFactory: emptyServiceStub}
      ]
    });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  // it('displayedColumns has default value', () => {
  //   expect(component.displayedColumns).toEqual([
  //     'ccd_case_number',
  //     'refund_reference',
  //     'reason',
  //     'user_full_name',
  //     'date_updated',
  //     'Action'
  //   ]);
  // });

  // describe('ngAfterViewInit', () => {
  //   it('makes expected calls', () => {
  //     const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
  //       ChangeDetectorRef
  //     );
  //     spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
  //     component.ngAfterViewInit();
  //     expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
  //   });
  // });
});
