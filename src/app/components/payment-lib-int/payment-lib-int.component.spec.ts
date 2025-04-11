import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';

import { PaymentLibIntComponent } from './payment-lib-int.component';

describe('PaymentLibIntComponent', () => {
  let component: PaymentLibIntComponent;
  let fixture: ComponentFixture<PaymentLibIntComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    const routerStub = () => ({
      routeReuseStrategy: { shouldReuseRoute: {} },
      onSameUrlNavigation: {},
      navigateByUrl: arg => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ PaymentLibIntComponent ],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useValue: {
          params: of({ ccdCaseNumber: '1111-2222-3333-4444' }),
          snapshot: {
            queryParams: {
              takePayment: true,
              view: 'case-transations',
              dcn: '121212121212121212121'
            }
          }
        }
      }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentLibIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
