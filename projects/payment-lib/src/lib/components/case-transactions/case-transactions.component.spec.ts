import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core'
import { CaseTransactionsComponent } from './case-transactions.component';
import { PaymentViewService} from "../../services/payment-view/payment-view.service";
import { BulkScaningPaymentService} from "../../services/bulk-scaning-payment/bulk-scaning-payment.service";
import { CaseTransactionsService} from "../../services/case-transactions/case-transactions.service";
import { PaymentLibComponent } from '../../payment-lib.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('CaseTransactionsComponent', () => {
  let component: CaseTransactionsComponent;
  let fixture: ComponentFixture<CaseTransactionsComponent>;


  beforeEach(() => {
    const emptyServiceStub = () => ({  });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ RpxTranslateMockPipe ],
      providers:[
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: BulkScaningPaymentService, useFactory: emptyServiceStub },
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
});
