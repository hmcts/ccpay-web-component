import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {PbaPaymentComponent} from './pba-payment.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
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
            getPaymentGroupDetails: () => ({ subscribe: (f: any) => f({}) }),
            getPBAaccountDetails: () => ({ subscribe: (f: any) => f({ organisationEntityResponse: { name: 'test', paymentAccount: [] } }) })
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
        provideHttpClient(withInterceptorsFromDi()),
        { provide: RpxTranslationService, useValue: { getTranslation$: (v: any) => of(v), getTranslationWithReplacements$: (v: any) => of(v) } }
    ]
});

    fixture = TestBed.createComponent(PbaPaymentComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays account no longer exists message', () => {
    component.viewStatus = 'pba-payment';
    component.isCardPaymentSuccess = true;
    component.isPBAAccountNotExist = true;
    component.selectedPbaAccount = 'PBA123';
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('Your PBA account');
    expect(text).toContain('(PBA123)');
    expect(text).toContain('no longer exists.');
  });

  it('displays account on hold message', () => {
    component.viewStatus = 'pba-payment';
    component.isCardPaymentSuccess = true;
    component.isPBAAccountHold = true;
    component.selectedPbaAccount = 'PBA123';
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('Your PBA account');
    expect(text).toContain('(PBA123)');
    expect(text).toContain('has been put on hold.');
  });
});
