import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { NotificationService } from '../../services/notification/notification.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IRefundList } from '../../interfaces/IRefundList';
import { IRefundsNotifications } from '../../interfaces/IRefundsNotifications';
import { OrderslistService } from '../../services/orderslist.service';
import { IPutNotificationRequest } from '../../interfaces/IPutNotificationRequest';
import { IRefundContactDetails } from '../../interfaces/IRefundContactDetails';
import { IRefundStatus } from '../../interfaces/IRefundStatus';
import { IResubmitRefundRequest } from '../../interfaces/IResubmitRefundRequest';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { IPayment } from '../../interfaces/IPayment';
import { IFee } from '../../interfaces/IFee';
import { IRefundFee } from '../../interfaces/IRefundFee';
import { CommonModule } from '@angular/common';
import { NotificationPreviewComponent } from '../notification-preview/notification-preview.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { AddRemissionComponent } from '../add-remission/add-remission.component';
import { CcdHyphensPipe } from '../../pipes/ccd-hyphens.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
type PaymentLibAlias = PaymentLibComponent;

@Component({
  selector: 'ccpay-refund-status',
  templateUrl: './refund-status.component.html',
  styleUrls: ['./refund-status.component.css'],
  imports: [
    CommonModule,
    forwardRef(() => NotificationPreviewComponent),
    forwardRef(() => ContactDetailsComponent),
    forwardRef(() => AddRemissionComponent),
    CcdHyphensPipe,
    CapitalizePipe,
  ],
  standalone: true
})
export class RefundStatusComponent implements OnInit {
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: string[] = [];
  @Input('API_ROOT') API_ROOT: string;
  @Input() ccdCaseNumber: string;
  @Input() isTurnOff: boolean;
  @Input() orderParty: string;
  refundStatusForm: FormGroup;
  selectedRefundReason: string;
  rejectedRefundList: IRefundList[] = [];
  notificationList: any;
  notification: any;
  approvalStatus = 'Sent for approval';
  rejectStatus = 'Update required';
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
  refundNotifications: IRefundStatus[];
  isResendOperationSuccess: boolean = false;
  isEditDetailsClicked: boolean = false;
  isEditAddressDeatilsClicked: boolean = false;
  addressDetails: IRefundContactDetails;
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
  isRemissionsMatch: boolean;
  payment: IPayment;
  changeRefundReason: string;
  fees: IFee[];
  refundFees: IRefundFee[];
  paymentObj: IPayment;
  templateInstructionType: string;
  notificationSentViewIndex: number = -1;
  notificationPreview: boolean = false;
  notificationSentView: boolean = false;
  allowedRolesToAccessRefund = ['payments-refund-approver', 'payments-refund', 'payments'];

  constructor(private formBuilder: FormBuilder,
    private refundService: RefundsService,
    private notificationService: NotificationService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private OrderslistService: OrderslistService,
    private paymentViewService: PaymentViewService) { }

  ngOnInit() {

    this.resetRemissionForm([false, false, false, false], 'All');
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.isCallFromRefundList = this.paymentLibComponent.isCallFromRefundList;
    if (this.API_ROOT == 'api/payment-history') {
      this.isFromPayBubble = true;
    }
    if (this.paymentLibComponent.isRefundStatusView) {
      this.viewName = 'refundview';
      this.OrderslistService.getRefundView().subscribe((data) => this.refundlist = data);
      this.OrderslistService.getCCDCaseNumberforRefund.subscribe((data) => this.ccdCaseNumber = data);
    } else {
      this.viewName = 'refundstatuslist';
      this.refundService.getRefundStatusList(this.ccdCaseNumber).subscribe(
        refundList => {
          this.rejectedRefundList = refundList['refund_list'];
        }
      ),
        (error: any) => {
          this.errorMessage = error.replace(/"/g, "");
        };
    }


    this.refundStatusForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ])),
      refundReason: new FormControl('', Validators.compose([Validators.required])),
      reason: new FormControl()
    });

    if (this.refundlist !== undefined) {
      this.getRefundsNotification();
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

  }

  getRefundsStatusHistoryList() {
    if (this.refundlist !== undefined) {
      this.refundService.getRefundStatusHistory(this.refundlist.refund_reference).subscribe(
        statusHistoryList => {
          this.refundStatusHistories = statusHistoryList.status_history_dto_list;
          this.isLastUpdatedByCurrentUser = statusHistoryList.last_updated_by_current_user;
        }
      ),
        (error: any) => {
          this.errorMessage = error.replace(/"/g, "");
        };
    }
  }

  getRefundsNotification() {
    this.notificationService.getRefundNotification(this.refundlist.refund_reference).subscribe(
      refundsNotification => {
        this.notificationList = refundsNotification['notifications'];
      }
    ),
      (error: any) => {
        this.errorMessage = error.replace(/"/g, "");
      };
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

  gotoReviewDetailsPage(event: any) {
    // event.preventDefault();
    this.errorMessage = false;
    this.paymentLibComponent.isRefundStatusView = true;
    this.ngOnInit();
  }

  gotoReviewAndReSubmitPage() {
    this.viewName = 'reviewandsubmitview';
    this.getTemplateInstructionType(this.paymentObj, this.refundlist.payment_reference);
    this.oldRefundReason = this.refundlist.reason;
    this.changedAmount = this.refundlist.amount;
    this.refundreason = this.refundStatusHistories.filter(data => data.status.toLowerCase() === 'update required')[0].notes;
    this.refundService.getRefundReasons().subscribe(
      refundReasons => {
        this.refundReasons = refundReasons;
      });
  }
  gotoRefundReasonPage(refundReason: string) {
    this.isRefundBtnDisabled = false;
    this.paymentLibComponent.REFUNDLIST = "true";
    this.paymentLibComponent.isFromRefundStatusPage = true;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.errorMessage = false;
    this.changeRefundReason = refundReason;
    this.viewName = 'issuerefundpage1';
  }

  gotoAmountPage() {
    this.errorMessage = false;
    this.paymentLibComponent.REFUNDLIST = "true";
    this.isRefundBtnDisabled = false;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.paymentLibComponent.isFromRefundStatusPage = true;
    if (this.refundlist.reason == 'Retrospective remission') {
      this.viewName = 'processretroremissonpage';
    } else {
      this.viewName = 'issuerefund';
    }
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
      if (refundListReason.reason != undefined && refundListReason.reason != null && refundListReason.reason != this.refundlist.reason) {
        this.refundlist.reason = refundListReason.reason;
        this.refundlist.reason_code = refundListReason.code.split('-')[0].trim();
        this.refundlist.code = refundListReason.code;
        this.refundCode = refundListReason.code;
      }
    } else {
      this.isRefundBtnDisabled = true;
    }
    this.notificationPreview = false;
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
    this.notificationPreview = false;
    this.viewName = 'reviewandsubmitview';
    this.paymentLibComponent.CCD_CASE_NUMBER = this.ccdCaseNumber;
  }

  getRefundFees(fees: IFee[]) {
    this.fees = fees;
    this.refundFees = this.fees.map(obj => ({
      fee_id: obj.id,
      code: obj.code,
      version: obj.version,
      volume: obj.updated_volume ? obj.updated_volume : obj.volume,
      refund_amount: obj.refund_amount
    }));
  }

  gotoReviewRefundConfirmationPage() {
    // if (this.oldRefundReason === this.refundlist.reason) {
    //   this.refundCode = '';
    // }
    if (this.refundFees === undefined) {
      this.refundFees = this.refundlist['refund_fees'];
    }
    if (this.refundlist.reason == 'Retrospective remission') {
      this.refundFees[0].refund_amount = this.changedAmount;
    }
    this.refundCode = this.refundlist.code;
    const resubmitRequest = new IResubmitRefundRequest(this.refundCode, this.changedAmount, this.refundlist.contact_details, this.refundFees);
    this.refundService.patchResubmitRefund(resubmitRequest, this.refundlist.refund_reference).subscribe(
      response => {
        if (JSON.parse(response)) {
          this.refundReference = JSON.parse(response).refund_reference;
          this.refundAmount = JSON.parse(response).refund_amount;
          this.viewName = 'reviewrefundconfirmationpage';
        }
      },
      (error: any) => {
        this.errorMessage = error.replace(/"/g, "");
      }
    );
  }

  gotoEditAddressDetails(note: IRefundsNotifications) {
    this.notification = note;
    this.isEditDetailsClicked = true;
    this.viewName = 'refundEditView'
  }
  getContactDetails(obj: IRefundContactDetails) {
    this.addressDetails = obj;
    this.getTemplateInstructionType(this.paymentObj, this.refundlist.payment_reference);
    this.notificationPreview = false;
    this.viewName = 'revieweditdetailsconfirmationpage';
  }
  getContactDetailsForRefundList(obj: IRefundContactDetails) {
    this.refundlist.contact_details = obj;
    this.getTemplateInstructionType(this.paymentObj, this.refundlist.payment_reference);
    this.notificationPreview = false;
    this.isEditDetailsClicked = false;
    this.isRefundBtnDisabled = false;
    this.viewName = 'reviewandsubmitview';
  }
  gotoEditDetailsPage(note?: any, view?: string) {
    if (note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.isEditDetailsClicked = true;
    this.viewName = view;
  }
  submitEditDetail() {
    this.isResendOperationSuccess = false;
    const contactDetails = this.addressDetails.notification_type === 'EMAIL' ? this.addressDetails.email :
      {
        address_line: this.addressDetails.address_line,
        city: this.addressDetails.city,
        county: this.addressDetails.county,
        country: this.addressDetails.country,
        postal_code: this.addressDetails.postal_code,
      };
    const resendRequest = new IPutNotificationRequest(contactDetails, this.addressDetails.notification_type);

    this.refundService.putResendOrEdit(resendRequest, this.refundlist.refund_reference, this.addressDetails.notification_type).subscribe(
      (response) => {
        this.isResendOperationSuccess = response;
      },
      (error: any) => {
        this.isResendOperationSuccess = false;
        this.errorMessage = error.replace(/"/g, "");
      }
    );
  }
  putResend(notification: IRefundsNotifications) {
    this.isResendOperationSuccess = false;
    const contactDetails = notification.notification_type === 'EMAIL' ? notification.contact_details.email :
      {
        address_line: notification.contact_details.address_line,
        city: notification.contact_details.city,
        county: notification.contact_details.county,
        country: notification.contact_details.country,
        postal_code: notification.contact_details.postal_code,
      };
    const resendRequest = new IPutNotificationRequest(contactDetails, notification.notification_type);

    this.refundService.putResendOrEdit(resendRequest, this.refundlist.refund_reference, notification.notification_type).subscribe(
      (response) => {
        this.isResendOperationSuccess = response;
      },
      (error: any) => {
        this.isResendOperationSuccess = false;
        this.errorMessage = error.replace(/"/g, "");
      }
    );

  }

  gotoRefundViewPageCancelBtnClicked(event: Event) {
    event.preventDefault();
    this.isEditDetailsClicked = false;
    this.viewName = 'refundview';
  }

  gotoRefundReviewAndSubmitViewPageCancelBtnClicked(event: Event) {
    event.preventDefault();
    this.isEditDetailsClicked = false;
    this.viewName = 'reviewandsubmitview';
  }

  goToRefundProcessComponent(refundReference: string, refundList: IRefundList) {
    this.paymentLibComponent.refundlistsource = refundList;
    this.paymentLibComponent.refundReference = refundReference;
    this.paymentLibComponent.isFromPayBubble = true;
    this.paymentLibComponent.viewName = 'process-refund';
  }

  getTemplateInstructionType(payment: IPayment, paymentReference: string): void {

    if (payment == undefined || payment == null || payment.reference != paymentReference) {

      this.paymentViewService.getPaymentDetails(paymentReference).subscribe(
        payment => {
          this.paymentObj = payment;
          this.paymentObj.reference = paymentReference;
          this.templateInstructionType = this.notificationService.getNotificationInstructionType(this.paymentObj.channel, this.paymentObj.method);
        },
        (error: any) => {
          this.templateInstructionType = 'Template';
        })
    } else {
      this.templateInstructionType = this.notificationService.getNotificationInstructionType(payment.channel, payment.method);
    }
  }

  showNotificationPreview(): void {
    this.notificationPreview = true;
  }

  hideNotificationPreview(): void {
    this.notificationPreview = false;
  }

  showNotificationSentView(index: number): void {
    this.notificationSentViewIndex = index;
    this.notificationSentView = true;
  }

  hideNotificationSentView(): void {
    this.notificationSentViewIndex = -1;
    this.notificationSentView = false;
  }

}
