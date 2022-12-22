import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { RefundListComponent } from './refund-list.component';

describe('RefundListComponent', () => {
  let component: RefundListComponent;
  let fixture: ComponentFixture<RefundListComponent>;

  beforeEach(() => {
    const refundsServiceStub = () => ({
      getRefundList: (approvalStatus, arg1) => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RefundListComponent],
      providers: [{ provide: RefundsService, useFactory: refundsServiceStub }]
    });
    fixture = TestBed.createComponent(RefundListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('submittedRefundList has default value', () => {
    expect(component.submittedRefundList).toEqual([]);
  });

  it('rejectedRefundList has default value', () => {
    expect(component.rejectedRefundList).toEqual([]);
  });

  it('approvalStatus has default value', () => {
    expect(component.approvalStatus).toEqual('Sent for approval');
  });

  it('rejectStatus has default value', () => {
    expect(component.rejectStatus).toEqual('Update required');
  });

  it('isAuthorized has default value', () => {
    expect(component.isAuthorized).toEqual(true);
  });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
  //       RefundsService
  //     );
  //     spyOn(refundsServiceStub, 'getRefundList').and.callThrough();
  //     component.ngOnInit();
  //     expect(refundsServiceStub.getRefundList).toHaveBeenCalled();
  //   });
  // });
});
