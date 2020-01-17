import { Component, OnInit } from '@angular/core';
import {PaymentLibComponent} from '../../payment-lib.component';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import {CaseTransactionsService} from '../../services/case-transactions/case-transactions.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import {IFee} from '../../interfaces/IFee';
import {IPayment} from '../../interfaces/IPayment';
import {IRemission} from '../../interfaces/IRemission';
import {Router} from '@angular/router';

@Component({
  selector: 'ccpay-case-transactions',
  templateUrl: './case-transactions.component.html',
  styleUrls: ['./case-transactions.component.css']
})
export class CaseTransactionsComponent implements OnInit {
  takePayment: boolean;
  ccdCaseNumber: string;
  paymentGroups: any[] = [];
  payments: IPayment[] = [];
  nonPayments: IPayment[] = [];
  allPayments: IPayment[] = [];
  remissions: IRemission[] = [];
  fees: IFee[] = [];
  errorMessage: string;
  totalFees: number;
  totalPayments: number;
  totalRemissions: number;
  selectedOption: string;
  dcnNumber: string;
  isAddFeeBtnEnabled: boolean = true;
  isUnprocessedRecordSelected: boolean = false;
  exceptionRecordReference: string;
  isFeeRecordsExist: boolean = false;
  isGrpOutstandingAmtPositive: boolean = false;
  totalRefundAmount:Number;
  isBulkScanEnable;
  unprocessedRecordCount: number;
  constructor(private router: Router,
  private bulkScaningPaymentService: BulkScaningPaymentService,
  private caseTransactionsService: CaseTransactionsService,
  private paymentLibComponent: PaymentLibComponent) { }

  ngOnInit() {
    this.isGrpOutstandingAmtPositive = false;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.takePayment = this.paymentLibComponent.TAKEPAYMENT;
    this.isBulkScanEnable = this.paymentLibComponent.ISBSENABLE;

    this.caseTransactionsService.getPaymentGroups(this.ccdCaseNumber).subscribe(
      paymentGroups => {
        this.paymentGroups = paymentGroups['payment_groups'];
        this.calculateAmounts();
        this.totalRefundAmount = this.calculateRefundAmount();
      },
      (error: any) => {
        this.errorMessage = <any>error;
        this.setDefaults();
      }
    );

    this.dcnNumber = this.paymentLibComponent.DCN_NUMBER;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION.toLocaleLowerCase();
  }

  setDefaults(): void {
    this.totalPayments = 0.00;
    this.totalRemissions = 0.00;
    this.totalFees = 0.00;
}
getAllocationStatus(payments: any){

  // let paymentAllocation = payments.payment_allocation,
  //     isAllocationStatusExist = paymentAllocation.length >0;
  // return isAllocationStatusExist ? paymentAllocation[0].allocation_status : '-';
  return "-";

}

  calculateAmounts(): void {
    let feesTotal = 0.00,
     paymentsTotal = 0.00,
     remissionsTotal = 0.00,
     allocationStatus = null,
     isPaymentSuccess = false;

    this.paymentGroups.forEach(paymentGroup => {
      if (paymentGroup.fees) {
        paymentGroup.fees.forEach(fee => {
          feesTotal = feesTotal + fee.calculated_amount;
          this.fees.push(fee);
        });
      }
      this.totalFees = feesTotal;

      if (paymentGroup.payments) {
        
        paymentGroup.payments.forEach(payment => {
          allocationStatus = payment.payment_allocation;
          isPaymentSuccess = payment.status.toUpperCase() === 'SUCCESS';
          if (isPaymentSuccess) {
            paymentsTotal = paymentsTotal + payment.amount;
            this.payments.push(payment);
          }
          if (isPaymentSuccess && (allocationStatus[0].allocation_status === 'Allocated' || allocationStatus.length === 0)) {
            paymentsTotal = paymentsTotal + payment.amount;
            this.payments.push(payment);
          } else if(allocationStatus.length > 0 && allocationStatus[0].allocation_status !== 'Allocated') {
            payment.paymentGroupReference = paymentGroup.payment_group_reference
            this.nonPayments.push(payment);
          }
        });
      }
      this.totalPayments = paymentsTotal;

      if (paymentGroup.remissions) {
        paymentGroup.remissions.forEach(remisison => {
          remissionsTotal = remissionsTotal + remisison.hwf_amount;
          this.remissions.push(remisison);
        });
      }
      this.totalRemissions = remissionsTotal;
    });

  }
  calculateRefundAmount() {
    let totalRefundAmount = 0,
    isFeeAmountZero = false;
    this.paymentGroups.forEach(paymentGroup => {
      let grpOutstandingAmount = 0.00,
        feesTotal = 0.00,
        paymentsTotal = 0.00,
        remissionsTotal = 0.00;
      if (paymentGroup.fees) {
        this.isFeeRecordsExist = true;
        paymentGroup.fees.forEach(fee => {
          feesTotal = feesTotal + fee.calculated_amount;
          if(fee.calculated_amount === 0) {
            isFeeAmountZero = true
          }
        });

      }

      if (paymentGroup.payments) {
        paymentGroup.payments.forEach(payment => {
          if (payment.status.toUpperCase() === 'SUCCESS') {
            paymentsTotal = paymentsTotal + payment.amount;
          }
        });
      }

      if (paymentGroup.remissions) {
        paymentGroup.remissions.forEach(remission => {
          remissionsTotal = remissionsTotal + remission.hwf_amount;
        });
      }  
        grpOutstandingAmount = (feesTotal - remissionsTotal) - paymentsTotal;
        if (grpOutstandingAmount < 0) {
          if(totalRefundAmount === 0) {
            totalRefundAmount = grpOutstandingAmount;
          } else {
            totalRefundAmount = (totalRefundAmount + grpOutstandingAmount);
          }
        }
        else if(grpOutstandingAmount > 0 || (grpOutstandingAmount === 0 && isFeeAmountZero)) {
          this.isGrpOutstandingAmtPositive = true;
        }
    });
    return totalRefundAmount * -1;
  }
  getGroupOutstandingAmount(paymentGroup: IPaymentGroup): number {
    return this.bulkScaningPaymentService.calculateOutStandingAmount(paymentGroup);;
  }

  redirectToFeeSearchPage(event: any) {
    event.preventDefault();
    const url = this.isBulkScanEnable ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    this.router.navigateByUrl(`/fee-search?selectedOption=${this.selectedOption}&ccdCaseNumber=${this.ccdCaseNumber}${url}`);
  }

  redirectToReportsPage(event: any) {
    event.preventDefault();
    this.router.navigateByUrl(`/reports?selectedOption=${this.selectedOption}&ccdCaseNumber=${this.ccdCaseNumber}`);
  }

  redirectToFeesummaryPage(paymentRef: string) {
    this.loadFeeSummaryPage(paymentRef);
    this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}?view=fee-summary&selectedOption=${this.selectedOption}&paymentGroupRef=${paymentRef}`);
  }

  loadFeeSummaryPage(paymentRef: string) {
    this.paymentLibComponent.bspaymentdcn = null;
    this.paymentLibComponent.paymentGroupReference = paymentRef;
    this.paymentLibComponent.viewName = 'fee-summary';
  }

  goToPaymentViewComponent(paymentGroup: any) {
    this.paymentLibComponent.paymentMethod = paymentGroup.paymentMethod;
    this.paymentLibComponent.paymentGroupReference = paymentGroup.paymentGroupReference;
    this.paymentLibComponent.paymentReference = paymentGroup.paymentReference;
    this.paymentLibComponent.viewName = 'payment-view';
  }

  selectedUnprocessedFeeEvent(unprocessedRecordId: string) {
    if ( unprocessedRecordId ) {
      this.isAddFeeBtnEnabled = false
      this.isUnprocessedRecordSelected = true;
    } else {
      this.isAddFeeBtnEnabled = true;
      this.isUnprocessedRecordSelected = false;
    }
  }
  getUnprocessedFeeCount(unProcessedRecordCount: number) {
     this.unprocessedRecordCount = unProcessedRecordCount;
  }
  getRemissionDetails(remissions: any, feeCode: string) {
    return remissions.filter((remission)=>{
      return remission.fee_code === feeCode;
    });
  }
}
