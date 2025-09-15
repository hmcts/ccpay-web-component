import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {PbaPaymentComponent} from './pba-payment.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core'

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
