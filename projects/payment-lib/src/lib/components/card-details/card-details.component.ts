import { Component, OnInit } from '@angular/core';
import { CardDetailsService } from '../../services/card-details/card-details.service';
import {ICardDetails} from '../../interfaces/ICardDetails';
import { PaymentLibComponent } from '../../payment-lib.component';

@Component({
    selector: 'ccpay-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.css'],
    standalone: false
})
export class CardDetailsComponent implements OnInit {
  pageTitle: string = 'Card details';
  cardDetails: ICardDetails;
  paymentReference: string;
  errorMessage: string;

  constructor(private cardDetailsService: CardDetailsService,
              private paymentLibComponent: PaymentLibComponent) { }

  ngOnInit() {
    this.cardDetailsService.getCardDetails(this.paymentLibComponent.paymentReference).subscribe(
      cardDetails => this.cardDetails = cardDetails,
      (error: any) => this.errorMessage = <any>error
    );
  }

  get getPaymentReference(): string {
    return this.paymentReference;
  }

}
