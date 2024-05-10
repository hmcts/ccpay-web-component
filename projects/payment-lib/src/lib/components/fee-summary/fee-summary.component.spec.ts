import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FeeSummaryComponent } from './fee-summary.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BulkScaningPaymentService} from "../../services/bulk-scaning-payment/bulk-scaning-payment.service";

describe('Fee Summary component', () => {
  let component: FeeSummaryComponent,
  fixture: ComponentFixture<FeeSummaryComponent>;

  beforeEach(() => {
    const paymentLibComponentStub = () => ({ viewName: {} });
    const emptyServiceStub = () => ({  });
    TestBed.configureTestingModule({
      declarations: [FeeSummaryComponent],
      providers: [
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: BulkScaningPaymentService, useFactory: emptyServiceStub},
        { provide: PaymentViewService, useFactory: emptyServiceStub}
        ],
      imports: [
        CommonModule,
        HttpClientModule,
        RouterModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSummaryComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

});
