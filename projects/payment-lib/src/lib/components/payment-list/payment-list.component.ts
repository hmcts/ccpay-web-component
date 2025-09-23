import { Component, Inject, OnInit } from '@angular/core';
import { PaymentListService } from '../../services/payment-list/payment-list.service';
import { IPayments } from '../../interfaces/IPayments';
import type { PaymentLibComponent } from '../../payment-lib.component';
type PaymentLibAlias = PaymentLibComponent;

@Component({
  selector: 'ccpay-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payments: IPayments;
  errorMessage: string;
  code: string;

  constructor(private paymentListService: PaymentListService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias) {
  }

  ngOnInit() {
    this.paymentListService.getPaymentByCcdCaseNumber(this.paymentLibComponent.CCD_CASE_NUMBER, this.paymentLibComponent.PAYMENT_METHOD)
      .subscribe(
        payments => this.payments = payments,
        (error: any) => this.errorMessage = <any>error
      );
  }

  loadPaymentViewComponent(paymentGroupReference: string, paymentReference: string, paymentMethod: string) {
    this.paymentLibComponent.paymentMethod = paymentMethod;
    this.paymentLibComponent.paymentGroupReference = paymentGroupReference;
    this.paymentLibComponent.paymentReference = paymentReference;
    this.paymentLibComponent.viewName = 'payment-view';
  }
}
