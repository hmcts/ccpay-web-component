import { Component, OnInit, Input, Inject } from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { IserviceRequestCardPayment } from '../../interfaces/IserviceRequestCardPayment';
import { IserviceRequestPbaPayment } from '../../interfaces/IserviceRequestPbaPayment';
import { CommonModule } from '@angular/common';
import { RpxTranslationModule, RpxLanguage } from 'rpx-xui-translation';
type PaymentLibAlias = PaymentLibComponent;

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
    selector: 'ccpay-pba-payment',
    templateUrl: './pba-payment.component.html',
    styleUrls: ['./pba-payment.component.scss'],
    imports: [
        CommonModule,
        RpxTranslationModule
    ]
})
export class PbaPaymentComponent implements OnInit {
  @Input() pbaPayOrderRef: any;
  viewStatus: string;
  pbaAccountList: string[];
  isPBAAccountHold: boolean = false;
  errorMsg: any;
  isCardPaymentSuccess: boolean = true;
  isInSufficiantFund: boolean = false;
  isPBAAccountNotExist: boolean = false;
  isPBAServerError: boolean = false;
  isGetPBAAccountSucceed: boolean = false;
  selectedPbaAccount: string = '';
  pbaAccountRef: string = '';
  isPbaAccountSelected: boolean = false;
  isCardPaymentSelected: boolean = false;
  isPBADropdownSelected: boolean = false;
  isContinueButtondisabled: boolean = true;
  isPBAAccountPaymentSuccess: boolean = false;
  pbaAccountrPaymentResult: any;
  orgName: string = '';

  constructor(@Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private paymentViewService: PaymentViewService) { }

  ngOnInit() {
    this.pbaPayOrderRef = this.paymentLibComponent.pbaPayOrderRef;
    this.viewStatus = 'pba-payment';
    this.errorMsg = null;
    this.paymentViewService.getPBAaccountDetails()
      .subscribe(
        result => {
          this.isGetPBAAccountSucceed = true;
          this.orgName = result.organisationEntityResponse.name;
          this.pbaAccountList = result.organisationEntityResponse.paymentAccount;
        },
        error => {
          this.errorMsg = error;
        }
      );

  }

  getPersistedLanguage(): RpxLanguage {
    return document.cookie.split(';').find((cookie) => cookie.trim().startsWith('exui-preferred-language' + '='))?.split('=')[1].trim() as RpxLanguage;
  }

  buttonCheck() {
    if (this.selectedPbaAccount !== '' && this.pbaAccountRef !== "") {
      this.isContinueButtondisabled = false;
    }
    else {
      this.isContinueButtondisabled = true;
    }
  }

  selectpbaaccount(args) {
    if (args.currentTarget.id === 'pbaAccountNumber') {
      this.isPBADropdownSelected = true;
      this.selectedPbaAccount = args.target.value;
      this.buttonCheck();
    }
    if (args.currentTarget.id === 'pbaAccountRef') {
      this.pbaAccountRef = args.target.value;
      this.buttonCheck();
    }
  }

  saveAndContinue() {

    if (this.isPbaAccountSelected) {
      this.isInSufficiantFund = false;
      this.isPBAAccountNotExist = false;
      this.isPBAServerError = false;
      this.isPBAAccountPaymentSuccess = false;
      this.isContinueButtondisabled = true;
      if (this.pbaAccountList.indexOf(this.selectedPbaAccount) !== -1) {
        const requestBody = new IserviceRequestPbaPayment(
          this.selectedPbaAccount, this.pbaPayOrderRef.orderTotalFees, this.pbaAccountRef, this.orgName);

        setTimeout(() => {
          this.paymentViewService.postPBAaccountPayment(this.pbaPayOrderRef.orderRefId, requestBody)
            .subscribe(
              r => {
                try {
                  this.pbaAccountrPaymentResult = JSON.parse(r);
                } catch (e) {
                  this.pbaAccountrPaymentResult = r;
                }
                this.isPBAAccountPaymentSuccess = true;
              },
              e => {
                if (e.status == '402') {
                  this.isInSufficiantFund = true;
                } else if (e.status == '410') {
                  this.isPBAAccountNotExist = true;
                } else if (e.status == '412') {
                  this.isPBAAccountHold = true;
                } else {
                  this.isPBAServerError = true;
                }
              }
            );

        }, 5000);
      } else {
        this.isPBAServerError = true;
      }
    } else if (this.isCardPaymentSelected) {
      this.cardPayment();
    }

  }
  cardPayment() {
    this.isCardPaymentSuccess = true;
    const requestBody = new IserviceRequestCardPayment(
      this.pbaPayOrderRef.orderTotalFees, this.getPersistedLanguage());
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
  selectPaymentMethod(type: string) {
    if (type === 'PBA') {
      this.isPbaAccountSelected = true;
      this.isCardPaymentSelected = false;
      this.isPBADropdownSelected = false
      this.isContinueButtondisabled = true;
      this.selectedPbaAccount = null;
    } else if (type === 'CARD') {
      this.isPbaAccountSelected = false;
      this.isCardPaymentSelected = true;
      this.isPBADropdownSelected = false
      this.isContinueButtondisabled = false;
    }
  }
  gotoCasetransationPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = false;
    this.paymentLibComponent.ISBSENABLE = true;
    this.paymentLibComponent.isFromServiceRequestPage = true;
  }
}
