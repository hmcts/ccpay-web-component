import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderslistService } from '../../services/orderslist.service';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            params: { subscribe: (f: any) => f({}) },
            queryParams: { subscribe: (f: any) => f({}) }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
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
