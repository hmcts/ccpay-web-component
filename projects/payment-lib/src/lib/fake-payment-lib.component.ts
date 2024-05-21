import {PaymentLibComponent} from "./payment-lib.component";
import {Component} from "@angular/core";

@Component({
  selector: 'ccpay-payment-lib',
  template: '',
})

export class FakePaymentLibComponent implements Partial<PaymentLibComponent>{
  viewName: string;

}
