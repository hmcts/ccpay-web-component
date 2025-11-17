import { TestBed } from '@angular/core/testing';
import { OrderslistService } from './orderslist.service';

describe('OrderslistService', () => {
  let service: OrderslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [OrderslistService] });
    service = TestBed.inject(OrderslistService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
