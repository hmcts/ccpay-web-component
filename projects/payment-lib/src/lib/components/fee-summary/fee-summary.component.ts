import { Component, OnInit, Input } from '@angular/core';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IRemission } from '../../interfaces/IRemission';
import { IFee } from '../../interfaces/IFee';
import { PaymentToPayhubRequest } from '../../interfaces/PaymentToPayhubRequest';
import { SafeHtml } from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Component({
  selector: 'ccpay-fee-summary',
  templateUrl: './fee-summary.component.html',
  styleUrls: ['./fee-summary.component.scss']
})

export class FeeSummaryComponent implements OnInit {
  @Input() paymentGroupRef: string;
  @Input() ccdCaseNumber: string;

  paymentGroup: IPaymentGroup;
  errorMessage: string;
  viewStatus = 'main';
  currentFee: IFee;
  totalFee: number;
  payhubHtml: SafeHtml;
  service: string = null;
  isBackButtonEnable: boolean = true;
  isConfirmationBtnDisabled: boolean = false;
  isRemoveBtnDisabled: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent
  ) {}

  ngOnInit() {
    this.viewStatus = 'main';
    this.getPaymentGroup();
  }

  getRemissionByFeeCode(feeCode: string): IRemission {
    if (this.paymentGroup && this.paymentGroup.remissions && this.paymentGroup.remissions.length > 0) {
      for (const remission of this.paymentGroup.remissions) {
        if (remission.fee_code === feeCode) {
          return remission;
        }
      }
    }
    return null;
  }

  addRemission(fee: IFee) {
    if (this.service) {
      this.currentFee = fee;
      this.viewStatus = 'add_remission';
    }
  }

  getPaymentGroup() {
    this.paymentViewService.getPaymentGroupDetails(this.paymentGroupRef,
      this.paymentLibComponent.paymentMethod).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;
        this.totalFee = 0;
        if (this.paymentGroup.fees) {
          for (const fee of this.paymentGroup.fees) {
            this.totalFee = this.totalFee + fee.net_amount;
          }
        }
      },
      (error: any) => this.errorMessage = error
    );
  }

  confirmRemoveFee(fee: IFee){
    this.isRemoveBtnDisabled = false;
    this.currentFee = fee;
    this.viewStatus = 'feeRemovalConfirmation';
  }

  removeFee(fee: any){
    this.isRemoveBtnDisabled = true;
    this.paymentViewService.deleteFeeFromPaymentGroup(fee).subscribe(
      (success: any) => {
          if (this.paymentGroup.fees && this.paymentGroup.fees.length > 1){
          this.getPaymentGroup();
          this.viewStatus = 'main';
          return;
          }
          this.loadCaseTransactionPage();
      },
      (error: any) => {
          this.errorMessage = error;
          this.isRemoveBtnDisabled = false;
      }
    );
  }

 loadCaseTransactionPage() {
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.viewName = 'case-transactions';
  }
  cancelRemission() {
    this.viewStatus = 'main';
  }
  redirectToFeeSearchPage(event: any) {
    event.preventDefault();
    if(this.viewStatus === 'feeRemovalConfirmation' || this.viewStatus === 'add_remission') {
      this.viewStatus = 'main';
      return;
    }
    this.router.navigateByUrl(`/fee-search?ccdCaseNumber=${this.ccdCaseNumber}`);
  }
  takePayment() {
    this.isConfirmationBtnDisabled = true;
    const seriveName = this.service ==='AA07' ? 'DIVORCE': this.service ==='AA08' ? 'PROBATE' : '',
     requestBody = new PaymentToPayhubRequest(this.ccdCaseNumber, this.totalFee, this.service, seriveName);
    this.paymentViewService.postPaymentToPayHub(requestBody, this.paymentGroupRef).subscribe(
      response => {
        this.location.go(`payment-history?view=fee-summary`);
        this.payhubHtml = response;
        this.viewStatus = 'payhub_view';
        this.isBackButtonEnable=false;
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
      }
    );
  }
}
