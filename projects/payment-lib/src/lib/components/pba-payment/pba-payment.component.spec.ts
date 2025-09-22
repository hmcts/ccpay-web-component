import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {PbaPaymentComponent} from './pba-payment.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core'
import { PaymentLibComponent } from '../../payment-lib.component';
import { WebComponentHttpClient } from '../../services/shared/httpclient/webcomponent.http.client';
import { Meta } from '@angular/platform-browser';

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

  beforeEach(() => {
    const webComponentHttpClientStub = () => ({
      post: (url, body, options) => ({ subscribe: f => f({}) }),
      put: (url, body, options) => ({ subscribe: f => f({}) }),
      get: (url, options) => ({ subscribe: f => f({}) }),
      delete: (url, options) => ({ subscribe: f => f({}) })
    });
    const metaStub = () => ({
      getTag: (name) => ({ content: 'test' }),
      addTag: (tag) => ({}),
      updateTag: (tag) => ({})
    });
    
    TestBed.configureTestingModule({
    declarations: [RpxTranslateMockPipe],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule],
    providers: [
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: WebComponentHttpClient, useFactory: webComponentHttpClientStub },
        { provide: Meta, useFactory: metaStub },
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
