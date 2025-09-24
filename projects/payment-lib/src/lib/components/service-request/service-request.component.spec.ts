import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceRequestComponent } from './service-request.component';
import { 
  RpxTranslateMockPipe, 
  CcdHyphensMockPipe,
  createPaymentLibComponentStub,
  createPaymentViewServiceStub,
  createNotificationServiceStub,
  createOrderslistServiceStub,
  createChangeDetectorRefStub,
  createRouterStub,
  COMMON_TEST_IMPORTS
} from '../../testing/test-helpers';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { NotificationService } from '../../services/notification/notification.service';
import { OrderslistService } from '../../services/orderslist.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

describe('ServiceRequestComponent', () => {
  let component: ServiceRequestComponent;
  let fixture: ComponentFixture<ServiceRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...COMMON_TEST_IMPORTS],
      declarations: [ RpxTranslateMockPipe, CcdHyphensMockPipe ],
      providers: [
        { provide: 'PAYMENT_LIB', useFactory: createPaymentLibComponentStub },
        { provide: PaymentViewService, useFactory: createPaymentViewServiceStub },
        { provide: NotificationService, useFactory: createNotificationServiceStub },
        { provide: OrderslistService, useFactory: createOrderslistServiceStub },
        { provide: ChangeDetectorRef, useFactory: createChangeDetectorRefStub },
        { provide: Router, useFactory: createRouterStub }
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
