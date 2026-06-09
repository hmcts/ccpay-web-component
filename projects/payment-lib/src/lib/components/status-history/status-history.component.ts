import { Component, OnInit, Input, Inject } from '@angular/core';
import { IStatusHistories } from '../../interfaces/IStatusHistories';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import { StatusHistoryService } from '../../services/status-history/status-history.service';
import {PaymentViewService} from '../../services/payment-view/payment-view.service';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
type PaymentLibAlias = PaymentLibComponent;

@Component({
  selector: 'ccpay-payment-statuses',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class StatusHistoryComponent implements OnInit {
  @Input() isTakePayment: boolean;
  pageTitle: string = 'Payment status history';
  statuses: IStatusHistories;
  isDisplayFailureReasonColumn: boolean = false;
  isDisplayReasons: boolean[] = [];
  errorMessage: string;

  constructor(private statusHistoryService: StatusHistoryService,
    private paymentViewService: PaymentViewService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias) { }

  ngOnInit() {
    forkJoin({
      paymentGroup: this.paymentViewService.getApportionPaymentDetails(this.paymentLibComponent.paymentReference),
      statuses: this.statusHistoryService.getPaymentStatusesByReference(this.paymentLibComponent.paymentReference,
                                                                        this.paymentLibComponent.paymentMethod)
    }).subscribe(
      ({ paymentGroup, statuses }) => {
        this.statuses = statuses;
        const firstPayment = paymentGroup &&
                             paymentGroup.payments &&
                             paymentGroup.payments.length > 0 ? paymentGroup.payments[0] : null;
        if (firstPayment &&
            (firstPayment.channel.toLowerCase() === 'telephony' || firstPayment.channel.toLowerCase() === 'online') &&
            (firstPayment.method.toLowerCase() === 'card')) {
          this.isDisplayReasons = this.statuses.status_histories.map(statusHistory =>
            statusHistory.status.toLowerCase() === 'failed' ||
            statusHistory.status.toLowerCase() === 'declined' ||
            statusHistory.status.toLowerCase() === 'cancelled' ||
            statusHistory.status.toLowerCase() === 'timed out' ||
            statusHistory.status.toLowerCase() === 'error'
          );
          this.isDisplayFailureReasonColumn = this.isDisplayReasons.some(isDisplayReason => isDisplayReason);
        } else {
          this.isDisplayReasons = [];
          this.isDisplayFailureReasonColumn = false;
        }
      },
      (error: any) => this.errorMessage = <any>error.replace(/"/g, "")
    );
  }

}
