import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {PbaPaymentComponent} from './pba-payment.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { WebComponentHttpClient } from '../../services/shared/httpclient/webcomponent.http.client';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('PBA payment component', () => {
  let component: PbaPaymentComponent,
    fixture: ComponentFixture<PbaPaymentComponent>;
  const paymentLibComponentStub = () => ({ viewName: {} });

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [RpxTranslateMockPipe],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule],
    providers: [
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        {
          provide: PaymentViewService,
          useValue: {
            postBSPayments: () => ({ subscribe: (f: any) => f({}) }),
            getBSfeature: () => ({ subscribe: (f: any) => f({}) }),
            getPaymentGroups: () => ({ subscribe: (f: any) => f([]) }),
            getPaymentGroupDetails: () => ({ subscribe: (f: any) => f({}) })
          }
        },
        {
          provide: WebComponentHttpClient,
          useValue: {
            get: () => ({ subscribe: (f: any) => f({}) }),
            post: () => ({ subscribe: (f: any) => f({}) }),
            put: () => ({ subscribe: (f: any) => f({}) }),
            patch: () => ({ subscribe: (f: any) => f({}) })
          }
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
});

    fixture = TestBed.createComponent(PbaPaymentComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });
});
