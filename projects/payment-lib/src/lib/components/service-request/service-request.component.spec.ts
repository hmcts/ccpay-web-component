import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServiceRequestComponent } from './service-request.component';
import { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { NotificationService } from '../../services/notification/notification.service';
import { OrderslistService } from '../../services/orderslist.service';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceRequestComponent', () => {
  let component: ServiceRequestComponent;
  let fixture: ComponentFixture<ServiceRequestComponent>;
  const paymentLibComponentStub = () => ({ viewName: {} });

  beforeEach(waitForAsync(() => {
    const paymentViewServiceStub = () => ({
      postRefundRetroRemission: requestBody => ({ subscribe: f => f('{}') }),
      postRefundRetroRemissionContactDetails: requestBody => ({ subscribe: f => f('{}') })
    });
    const notificationServiceStub = () => ({
      getNotificationPreview: requestBody => ({ subscribe: f => f('{}') })
    });
    const orderslistServiceStub = () => ({
      setisFromServiceRequestPage: arg => ({}),
      setnavigationPage: arg => ({}),
      setpaymentPageView: arg => ({})
    });

    TestBed.configureTestingModule({
      declarations: [ RpxTranslateMockPipe ],
      providers: [
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
