import { Component, OnInit, Input } from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { IRefundList } from '../../interfaces/IRefundList';
import { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { Router } from '@angular/router';
import { OrderslistService } from '../../services/orderslist.service';
import { IRefundReasons } from '../../interfaces/IRefundReasons';
import { IRefundStatus } from '../../interfaces/IRefundStatus';
const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-refund-status',
  templateUrl: './refund-status.component.html',
  styleUrls: ['./refund-status.component.css']
})
export class RefundStatusComponent implements OnInit {
  @Input() isOldPcipalOff: string;
  @Input() isNewPcipalOff: string;
  @Input() ccdCaseNumber: string;
  @Input() isTurnOff: boolean;
  refundStatusForm: FormGroup;
  selectedRefundReason: string;
  rejectedRefundList: IRefundList[] = [];
  approvalStatus = 'sent for approval';
  rejectStatus = 'sent back';
  errorMessage = null;
  viewName: string;
  refundReason: string;
  refundlist: IRefundList;
  bsPaymentDcnNumber: string;
  isCallFromRefundList: boolean;
  refundButtonState: String;
  isAmountEmpty: boolean = false;
  isReasonEmpty: boolean = false;
  amountHasError: boolean = false;
  isRemissionLessThanFeeError: boolean = false;
  refundHasError: boolean = false;
  refundReasons: any[] = [];
  refundStatusHistories: IRefundStatus[];

  constructor(private formBuilder: FormBuilder,
    private refundService: RefundsService,
    private paymentLibComponent: PaymentLibComponent,
    private paymentViewService: PaymentViewService,
    private router: Router,
    private OrderslistService: OrderslistService) { }

  ngOnInit() {
    this.resetRemissionForm([false, false, false, false], 'All');
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.isCallFromRefundList = this.paymentLibComponent.isCallFromRefundList;
    if (this.paymentLibComponent.isRefundStatusView) {
      this.viewName = 'refundview';
      this.OrderslistService.getRefundView().subscribe((data) => this.refundlist = data);
      this.OrderslistService.getCCDCaseNumberforRefund.subscribe((data) => this.ccdCaseNumber = data);
    } else {
      this.viewName = 'refundstatuslist';
      this.refundService.getRefundStatusList(this.ccdCaseNumber).subscribe(
        refundList => {
          this.rejectedRefundList = refundList['data']['refund_list'];
        }
      ),
        (error: any) => {
          this.errorMessage = error;
        };
    }
    this.refundStatusForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{2})?$')
      ])),
      refundReason: new FormControl('', Validators.compose([Validators.required])),
      reason: new FormControl()
    });

    this.getRefundsStatusHistoryList();
    this.refundButtonState = this.refundlist.refund_status.name;
  }

  getRefundsStatusHistoryList() {
    this.refundService.getRefundStatusHistory(this.refundlist.refund_reference).subscribe(
      statusHistoryList => {
        this.refundStatusHistories = statusHistoryList['data'];
      }
    ),
      (error: any) => {
        this.errorMessage = error;
      };
  }

  goToRefundView(refundlist: IRefundList) {
    this.OrderslistService.setRefundView(refundlist);
    this.OrderslistService.setCCDCaseNumber(this.ccdCaseNumber);
    this.paymentLibComponent.viewName = 'refundstatuslist';
    this.paymentLibComponent.isRefundStatusView = true;
    this.refundlist = refundlist;
  }

  loadCaseTransactionPage() {
    this.paymentLibComponent.isRefundStatusView = false;
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentViewService.getBSfeature().subscribe(
      features => {
        let result = JSON.parse(features).filter(feature => feature.uid === BS_ENABLE_FLAG);
        this.paymentLibComponent.ISBSENABLE = result[0] ? result[0].enable : false;
      },
      err => {
        this.paymentLibComponent.ISBSENABLE = false;
      }
    );

    let partUrl = `selectedOption=${this.paymentLibComponent.SELECTED_OPTION}`;
    partUrl += this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
    partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    partUrl += this.paymentLibComponent.ISSFENABLE ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;
    partUrl += this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
    partUrl += this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
    let url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&${partUrl}`;
    this.router.navigateByUrl(url);
  }

  gotoReviewAndReSubmitPage() {
    this.viewName = 'reviewandsubmitview';
    this.refundService.getRefundReasons().subscribe(
      refundReasons => {
        this.refundReasons = refundReasons['data'];
      });
  }
  gotoRefundReasonPage() {
    this.viewName = 'refundreasonpage';
  }

  goToReviewAndSubmitView() {
    const remissionctrls = this.refundStatusForm.controls
    if (this.refundStatusForm.dirty) {
      if (remissionctrls['amount'].value == '') {
        this.resetRemissionForm([true, false, false, false], 'amount');
      }
      else if (remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid) {
        this.resetRemissionForm([false, true, false, false], 'amount');
      }
      else if (remissionctrls['reason'].value == '') {
        this.resetRemissionForm([false, false, false, true], 'reason');
      } else {
        this.refundlist.reason = remissionctrls['reason'].value;
        this.viewName = 'reviewandsubmitview';
      }
    }

  }

  resetRemissionForm(val, field) {
    if (field === 'All') {
      this.isAmountEmpty = val[0];
      this.amountHasError = val[1];
      this.isRemissionLessThanFeeError = val[2];
      this.isReasonEmpty = val[3];
    } else if (field === 'amount' || field === 'All') {
      this.isAmountEmpty = val[0];
      this.amountHasError = val[1];
      this.isRemissionLessThanFeeError = val[2];
    } else if (field === 'reason' || field === 'All') {
      this.isReasonEmpty = val[3];
    }
  }

  selectRadioButton(key, value) {
    this.refundHasError = false;
    this.selectedRefundReason = key;
    if (key === 'Other') {
      this.refundHasError = false;
      this.refundReason = key;
    }
  }

}
