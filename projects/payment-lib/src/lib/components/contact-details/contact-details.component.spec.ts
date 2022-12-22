import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentLibComponent } from '../../payment-lib.component';
import { ContactDetailsComponent } from './contact-details.component';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  beforeEach(() => {
    const paymentLibComponentStub = () => ({
      paymentReference: {},
      paymentMethod: {}
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ContactDetailsComponent],
      providers: [
        { provide: PaymentLibComponent, useFactory: paymentLibComponentStub }
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
