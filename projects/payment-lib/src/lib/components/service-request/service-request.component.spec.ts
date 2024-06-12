import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ServiceRequestComponent } from './service-request.component';
import {PaymentViewService} from "../../services/payment-view/payment-view.service";
import {NotificationService} from "../../services/notification/notification.service";

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceRequestComponent', () => {
  let component: ServiceRequestComponent;
  let fixture: ComponentFixture<ServiceRequestComponent>;
  const paymentLibComponentStub = () => ({ viewName: {} });
  const emptyServiceStub = () => ({  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpxTranslateMockPipe ],
      providers: [
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: NotificationService, useFactory: emptyServiceStub }
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
