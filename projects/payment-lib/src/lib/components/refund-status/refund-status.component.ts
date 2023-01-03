import { Component, OnInit, Input } from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { IRefundList } from '../../interfaces/IRefundList';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { Router } from '@angular/router';
import { OrderslistService } from '../../services/orderslist.service';
import { IRefundStatus } from '../../interfaces/IRefundStatus';
import { IResubmitRefundRequest } from '../../interfaces/IResubmitRefundRequest';
import { PaymentLibComponent } from '../../payment-lib.component';

@Component({
  selector: 'ccpay-refund-status',
  templateUrl: './refund-status.component.html',
  styleUrls: ['./refund-status.component.css']
})
export class RefundStatusComponent implements OnInit {
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: string[] = [];
  @Input('API_ROOT') API_ROOT: string;
  @Input() ccdCaseNumber: string;
  @Input() isTurnOff: boolean;
  @Input() isEliginbleToAccess: boolean;
  refundStatusForm: FormGroup;
  selectedRefundReason: string;
  rejectedRefundList: IRefundList[] = [];
  approvalStatus = 'Sent for approval';
  rejectStatus = 'Update required';
  // approvalStatus = 'sent for approval';
  // rejectStatus = 'sent back';
  errorMessage = null;
  viewName: string;
  refundReason: string;
  refundlist: IRefundList;
  bsPaymentDcnNumber: string;
  isCallFromRefundList: boolean;
  refundButtonState: string = '';
  isAmountEmpty: boolean = false;
  isReasonEmpty: boolean = false;
  amountHasError: boolean = false;
  isRemissionLessThanFeeError: boolean = false;
  refundHasError: boolean = false;
  refundReasons: any[] = [];
  refundStatusHistories: IRefundStatus[];
  refundReference: string;
  refundAmount: string;
  refundCode: string;
  isRefundBtnDisabled: boolean = true;
  isFromPayBubble: boolean = false;
  oldRefundReason: string;
  refundreason: string;
  navigationpage: string;
  isLastUpdatedByCurrentUser: boolean = true;
  isProcessRefund: boolean = false;
  changedAmount: number;
  constructor(private formBuilder: FormBuilder,
    private refundService: RefundsService,
    private paymentLibComponent: PaymentLibComponent,
    private paymentViewService: PaymentViewService,
    private router: Router,
    private OrderslistService: OrderslistService) { }

  ngOnInit() {

   // if (this.check4AllowedRoles2AccessRefund()) {
    this.resetRemissionForm([false, false, false, false], 'All');
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.isCallFromRefundList = this.paymentLibComponent.isCallFromRefundList;
    // if(this.paymentLibComponent.isFromRefundStatusPage) {
    //   this.viewName = 'reviewandsubmitview';
    // }
    if(this.API_ROOT == 'api/payment-history') {
      this.isFromPayBubble = true;
    }
    if (this.paymentLibComponent.isRefundStatusView) {
      this.viewName = 'refundview';
      this.OrderslistService.getRefundView().subscribe((data) => this.refundlist = data);
      this.OrderslistService.getCCDCaseNumberforRefund.subscribe((data) => this.ccdCaseNumber = data);
    } else {
      this.viewName = 'refundstatuslist';
      if(this.isEliginbleToAccess) {
        this.refundService.getRefundStatusList(this.ccdCaseNumber).subscribe(
          refundList => {
            this.rejectedRefundList = refundList['refund_list'];
          }
        ),
        (error: any) => {
          this.errorMessage = error.replace(/"/g,"");
        };
      } else {
        this.rejectedRefundList = [];
      }

    }


      this.refundStatusForm = this.formBuilder.group({
        amount: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
        ])),
        refundReason: new FormControl('', Validators.compose([Validators.required])),
        reason: new FormControl()
      });

      if(this.refundlist !== undefined) {
        this.getRefundsStatusHistoryList();

        if (this.LOGGEDINUSERROLES.some(i => i.includes('payments-refund-approver'))) {
          this.isProcessRefund = true;
          this.refundButtonState = this.refundlist.refund_status.name;
          return;
        }

        if (this.LOGGEDINUSERROLES.some(i => i.includes('payments-refund'))) {
          this.isProcessRefund = false;
          this.refundButtonState = this.refundlist.refund_status.name;
        }
      }
   //}
  }

  getRefundsStatusHistoryList() {
    if(this.refundlist !== undefined) {
    this.refundService.getRefundStatusHistory(this.refundlist.refund_reference).subscribe(
      statusHistoryList => {
        this.refundStatusHistories = statusHistoryList.status_history_dto_list;
        this.isLastUpdatedByCurrentUser = statusHistoryList.last_updated_by_current_user;
      }
    ),
      (error: any) => {
        this.errorMessage = error.replace(/"/g,"");
      };
    }
  }

  goToRefundView(refundlist: IRefundList, navigationpage: string) {
    this.OrderslistService.setRefundView(refundlist);
    this.OrderslistService.setCCDCaseNumber(this.ccdCaseNumber);
    this.paymentLibComponent.viewName = 'refundstatuslist';
    this.paymentLibComponent.isRefundStatusView = true;
    this.refundlist = refundlist;
    this.OrderslistService.setnavigationPage(navigationpage);
  }

  loadCaseTransactionPage() {
    this.OrderslistService.setnavigationPage('casetransactions');
    this.OrderslistService.setisFromServiceRequestPage(false);
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.ISBSENABLE = true;
    this.paymentLibComponent.isRefundStatusView = false;
  }

  loadRefundListPage() {
    this.OrderslistService.getnavigationPageValue().subscribe((data) => this.navigationpage = data);
    if (this.navigationpage === 'casetransactions') {
      this.loadCaseTransactionPage();
    } else {
      this.paymentLibComponent.viewName = 'refund-list';
    }
  }

  gotoReviewDetailsPage(event:any) {
   // event.preventDefault();
    this.errorMessage = false;
    this.paymentLibComponent.isRefundStatusView = true;
    this.ngOnInit();
  }

  gotoReviewAndReSubmitPage() {
    this.viewName = 'reviewandsubmitview';
    this.oldRefundReason = this.refundlist.reason;
    this.changedAmount = this.refundlist.amount;
    this.refundreason = this.refundStatusHistories.filter(data => data.status.toLowerCase() === 'update required')[0].notes;
    this.refundService.getRefundReasons().subscribe(
      refundReasons => {
        this.refundReasons = refundReasons;
      });
  }
  gotoRefundReasonPage() {
    this.isRefundBtnDisabled = false;
    this.paymentLibComponent.REFUNDLIST = "true";
    this.paymentLibComponent.isFromRefundStatusPage = true;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.errorMessage = false;
    this.viewName = 'issuerefund';
  }

  gotoAmountPage() {
    this.errorMessage = false;
    this.paymentLibComponent.REFUNDLIST = "true";
    this.isRefundBtnDisabled = false;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.paymentLibComponent.isFromRefundStatusPage = true;
    this.viewName = 'processretroremissonpage';
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

  getRefundListReason(refundListReason: any) {
    if (this.paymentLibComponent.isFromRefundStatusPage && !this.paymentLibComponent.iscancelClicked) {
      this.refundlist.reason = refundListReason.reason;
      this.refundCode = refundListReason.code;
    } else {
      this.isRefundBtnDisabled = true;
    }
    this.viewName = 'reviewandsubmitview';
    this.paymentLibComponent.CCD_CASE_NUMBER = this.ccdCaseNumber;
  }

  getRefundAmount(amount: number) {
    if (this.paymentLibComponent.isFromRefundStatusPage && !this.paymentLibComponent.iscancelClicked) {
      if (amount > 0) {
        this.changedAmount = amount;
        // this.refundlist.amount = amount;
      }
    } else {
      this.isRefundBtnDisabled = true;
    }
    this.viewName = 'reviewandsubmitview';
    this.paymentLibComponent.CCD_CASE_NUMBER = this.ccdCaseNumber;
  }

  gotoReviewRefundConfirmationPage() {
    if (this.oldRefundReason === this.refundlist.reason) {
      this.refundCode = '';
    }
    const resubmitRequest = new IResubmitRefundRequest(this.refundCode,  this.changedAmount);
    this.refundService.patchResubmitRefund(resubmitRequest, this.refundlist.refund_reference).subscribe(
      response => {
        if (JSON.parse(response)) {
          this.refundReference = JSON.parse(response).refund_reference;
          this.refundAmount = JSON.parse(response).refund_amount;
          this.viewName = 'reviewrefundconfirmationpage';
        }
      },
      (error: any) => {
        this.errorMessage = error.replace(/"/g,"");
      }
    );

  }

  goToRefundProcessComponent(refundReference: string, refundList: IRefundList) {
    this.paymentLibComponent.refundlistsource = refundList;
    this.paymentLibComponent.refundReference = refundReference;
    this.paymentLibComponent.viewName = 'process-refund';
  }

}
