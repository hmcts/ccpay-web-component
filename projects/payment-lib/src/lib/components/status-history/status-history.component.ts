import { Component, OnInit, Input } from '@angular/core';
import { IStatusHistories } from '../../interfaces/IStatusHistories';
import { StatusHistoryService } from '../../services/status-history/status-history.service';
import { PaymentLibComponent } from '../../payment-lib.component';

@Component({
  selector: 'ccpay-payment-statuses',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.css']
})
export class StatusHistoryComponent implements OnInit {
  @Input() isTakePayment: boolean;
  pageTitle: string = 'Payment status history';
  statuses: IStatusHistories;
  errorMessage: string;

  constructor(private statusHistoryService: StatusHistoryService,
              private paymentLibComponent: PaymentLibComponent) { }

  ngOnInit() {
    this.statusHistoryService.getPaymentStatusesByReference(this.paymentLibComponent.paymentReference, this.paymentLibComponent.paymentMethod).subscribe(
      statuses => this.statuses = statuses,
      (error: any) => this.errorMessage = <any>error.replace(/"/g,"")
    );
    
  }

}
