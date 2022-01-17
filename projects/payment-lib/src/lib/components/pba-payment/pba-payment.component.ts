import { Component, OnInit, Input} from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IserviceRequestCardPayment } from '../../interfaces/IserviceRequestCardPayment';
import { IserviceRequestPbaPayment } from '../../interfaces/IserviceRequestPbaPayment';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-pba-payment',
  templateUrl: './pba-payment.component.html',
  styleUrls: ['./pba-payment.component.scss']
})
export class PbaPaymentComponent implements OnInit {
  @Input() pbaPayOrderRef: any;
  viewStatus: string;
  pbaAccountList: string[];
  errorMsg: any;
  isCardPaymentSuccess: boolean = true;
  isInSufficiantFund: boolean = false;
  isPBAAccountNotExist: boolean = false;
  isPBAServerError: boolean = false;
  isGetPBAAccountSucceed: boolean = false;
  selectedPbaAccount: string = '';
  pbaAccountRef: string = '';

  isContinueButtondisabled: boolean = true;
  isPBAAccountPaymentSuccess: boolean = false;
  pbaAccountrPaymentResult: any;

  constructor(private  paymentLibComponent: PaymentLibComponent,
    private paymentViewService: PaymentViewService) {}

  ngOnInit() {
    this.pbaPayOrderRef = this.paymentLibComponent.pbaPayOrderRef;
    this.viewStatus = 'pba-payment';
    this.errorMsg = null;
    this.paymentViewService.getPBAaccountDetails()
    .subscribe(
      result => {
        this.isGetPBAAccountSucceed = true;
        this.pbaAccountList = result.organisationEntityResponse.paymentAccount;
      },
      error => {
        this.errorMsg = error;
      }
    );

  }
  selectpbaaccount(args) {
    if(args.currentTarget.id === 'pbaAccountNumber') {
      this.selectedPbaAccount = args.target.value; 
    }
    if(args.currentTarget.id === 'pbaAccountRef') {
      this.pbaAccountRef = args.target.value; 
    }
    if(this.selectedPbaAccount !== '' && this.pbaAccountRef !== "") {
      this.isContinueButtondisabled = false;
    } else {
      this.isContinueButtondisabled = true;
    }
  }
  saveAndContinue() {
    this.isInSufficiantFund = false;
    this.isPBAAccountNotExist = false;
    this.isPBAServerError = false;
    this.isPBAAccountPaymentSuccess = false;
    if ( this.pbaAccountList.indexOf(this.selectedPbaAccount) !== -1 ) {
      const requestBody = new IserviceRequestPbaPayment(
        this.selectedPbaAccount, this.pbaPayOrderRef.orderTotalFees, this.pbaAccountRef);
      this.paymentViewService.postPBAaccountPayment(this.pbaPayOrderRef.orderRefId, requestBody)
      .subscribe(
        r => {
          this.pbaAccountrPaymentResult = JSON.parse(r).data;
          this.isPBAAccountPaymentSuccess = true;
        },
        e => {
          if(e.status == '402') {
            this.isInSufficiantFund = true;
          } else if(e.status == '410' || e.status == '412') {
            this.isPBAAccountNotExist = true;
          } else {
            this.isPBAServerError = true;
          }
        }
      );
    } else {
      this.isPBAServerError = true;
    }
  }
  cardPayment() {
    this.isCardPaymentSuccess = true;
    const requestBody = new IserviceRequestCardPayment (
      this.pbaPayOrderRef.orderTotalFees);
    this.paymentViewService.postWays2PayCardPayment(this.pbaPayOrderRef.orderRefId, requestBody)
    .subscribe(
      result => {
        const paymentUrl = JSON.parse(result).next_url;
        window.location.href = paymentUrl;
      },
      error => {
        this.isCardPaymentSuccess = false;
      }
    );

  }
  gotoCasetransationPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = false;
    this.paymentLibComponent.ISBSENABLE = true;
    this.paymentLibComponent.isFromServiceRequestPage = true;
  }
}
