import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentLibComponent } from '../../payment-lib.component';
import { ContactDetailsComponent } from './contact-details.component';
import { NotificationService} from "../../services/notification/notification.service";

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  beforeEach(() => {
    const emptyServiceStub = () => ({  });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: NotificationService, useFactory: emptyServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`pageTitle has default value`, () => {
    expect(component.pageTitle).toEqual(`Payment status history`);
  });
});
