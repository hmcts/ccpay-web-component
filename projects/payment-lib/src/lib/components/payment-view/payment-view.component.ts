import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit} from '@angular/core';
import {PaymentViewService} from '../../services/payment-view/payment-view.service';
import {NotificationService} from '../../services/notification/notification.service';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import {IFee} from '../../interfaces/IFee';
import {IPayment} from '../../interfaces/IPayment';
import {IRemission} from '../../interfaces/IRemission';
import {PostRefundRetroRemission} from '../../interfaces/PostRefundRetroRemission';
import {IPaymentFailure} from '../../interfaces/IPaymentFailure';
import {OrderslistService} from '../../services/orderslist.service';
import {IRefundContactDetails} from '../../interfaces/IRefundContactDetails';
import {AddRemissionComponent} from '../add-remission/add-remission.component';
import {CommonModule} from '@angular/common';
import {StatusHistoryComponent} from '../status-history/status-history.component';
import {ServiceRequestComponent} from '../service-request/service-request.component';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import {NotificationPreviewComponent} from '../notification-preview/notification-preview.component';
import {CcdHyphensPipe} from '../../pipes/ccd-hyphens.pipe';
import {CapitalizePipe} from '../../pipes/capitalize.pipe';
import {RpxTranslationModule} from 'rpx-xui-translation';
import type {PaymentLibComponent } from '../../payment-lib.component';

type PaymentLibAlias = PaymentLibComponent;

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss'],
  providers: [{ provide: 'PAYMENT_VIEW', useExisting: forwardRef(() => PaymentViewComponent) }],
  imports: [
    CommonModule, forwardRef(() => AddRemissionComponent),
    StatusHistoryComponent, forwardRef(() => ServiceRequestComponent),
    ContactDetailsComponent,
    NotificationPreviewComponent,
    CcdHyphensPipe,
    CapitalizePipe,
    RpxTranslationModule
  ],
  standalone: true
})

export class PaymentViewComponent implements OnInit {
  @Input() isTurnOff: boolean;
  @Input() isTakePayment: boolean;
  @Input() caseType: boolean;
  @Input() orderRef: string;
  @Input() orderStatus: string;
  @Input() orderTotalPayments: number;
  @Input() payment: IPayment;
  @Input() LOGGEDINUSERROLES: string[];
  @Input() ISPAYMENTSTATUSENABLED: string;
  @Input() orderParty: string;
  @Input() orderCreated: Date;
  @Input() orderCCDEvent: string;
  @Input() orderFeesTotal: number;
  @Input() orderRemissionTotal: number;
  @Input() orderDetail: any[];
  fees: any;
  isFullyRefund: boolean;
  @Input("isServiceRequest") isServiceRequest: string;
  errorMsg: string;
  paymentGroup: IPaymentGroup;
  errorMessage: string;
  ccdCaseNumber: string;
  selectedOption: string;
  dcnNumber: string;
  isStatusAllocated: boolean;
  isRemissionsMatch: boolean;
  feeId: IFee;
  viewStatus: string;
  isRefundRemission: boolean = false;
  isStrategicFixEnable: boolean;
  isAddFeeBtnEnabled: boolean = false;
  isIssueRefunfBtnEnable: boolean = false;
  allowedRolesToAccessRefund = ['payments-refund-approver', 'payments-refund'];
  remissions: IRemission[] = [];
  allPaymentsFailure: IPaymentFailure[] = [];
  selectedPaymentsStatus: IPaymentFailure;
  remissionFeeAmt: number;
  isRefundRemissionBtnEnable: boolean;
  serviceReference: string;
  isFromServiceRequestPage: boolean;
  isFromPaymentDetailPage: boolean;
  paymentFees: IFee[];
  paymentType: string;
  isContinueBtnDisabled: boolean = true;
  viewCompStatus: string;
  contactDetailsObj: IRefundContactDetails
  notification: any;
  isConfirmationBtnDisabled: boolean;
  refundReference: string;
  refundAmount: string;
  templateInstructionType: string;
  notificationPreview: boolean;
  constructor(private paymentViewService: PaymentViewService,
    private notificationService: NotificationService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private cd: ChangeDetectorRef,
    private OrderslistService: OrderslistService) {
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION;
    this.dcnNumber = this.paymentLibComponent.DCN_NUMBER;
    this.isTurnOff = this.paymentLibComponent.ISTURNOFF;
    this.serviceReference = this.paymentLibComponent.paymentGroupReference;
    this.viewStatus = 'paymentview';
    this.paymentViewService.getApportionPaymentDetails(this.paymentLibComponent.paymentReference).subscribe(
      paymentGroup => {
        let fees = [];
        paymentGroup.fees.forEach(fee => {
          this.isRemissionsMatch = false;

          paymentGroup.remissions.forEach(rem => {
            if (rem.fee_code === fee.code) {
              this.isRemissionsMatch = true;
              fee['remissions'] = rem;
              fees.push(fee);
            }
          });
          if (!this.isRemissionsMatch) {
            fees.push(fee);
          }
        });
        paymentGroup.fees = fees
        this.paymentFees = fees;
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
        const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
        this.paymentLibComponent.addPaymentGroup(this.paymentGroup);
      },
      (error: any) => this.errorMessage = error
    );
    this.paymentViewService.getPaymentFailure(this.paymentLibComponent.paymentReference).subscribe({
      next: (res) => {
        JSON.parse(res).payment_failure_list.reverse().forEach(payments => {

          this.allPaymentsFailure.push(payments.payment_failure_initiated);
          if (payments.payment_failure_closed) {
            this.allPaymentsFailure.push(payments.payment_failure_closed);
          }
        });
        this.allPaymentsFailure = this.allPaymentsFailure.reverse();
      },
      error: (e) => {
        this.allPaymentsFailure = [];
        this.errorMsg = "Server error"
      }
    })
  }

  get isCardPayment(): boolean {
    return this.paymentGroup.payments[0].method === 'card';
  }

  get isTelephonyPayment(): boolean {
    return this.paymentGroup.payments[0].channel === 'telephony';
  }

  public goToPaymentList(): void {
    this.paymentLibComponent.viewName = 'payment-list';
  }
  getOverPaymentValue() {
    let feesOverPayment = 0;
    this.paymentGroup.fees.forEach(fee => {
      feesOverPayment += fee.over_payment;
    });
    return feesOverPayment > 0 ? feesOverPayment : this.paymentLibComponent.overPaymentAmount

  }
  goToServiceRequestPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = false;
    this.paymentLibComponent.SERVICEREQUEST = 'true';
    this.paymentLibComponent.isFromServiceRequestPage = true;
    window.location.reload();
  }
  goToCaseTransationPage(event: any) {
    event.preventDefault();
    if (!this.paymentLibComponent.isFromServiceRequestPage) {
      this.OrderslistService.setnavigationPage('casetransactions');
      this.OrderslistService.setisFromServiceRequestPage(false);
      this.paymentLibComponent.viewName = 'case-transactions';
      this.paymentLibComponent.ISBSENABLE = true;
      this.resetOrderData();
    } else {
      this.OrderslistService.getorderRefs().subscribe((data) => this.orderRef = data);
      this.OrderslistService.getorderCCDEvents().subscribe((data) => this.orderCCDEvent = data);
      this.OrderslistService.getorderCreateds().subscribe((data) => this.orderCreated = data);
      this.OrderslistService.getorderDetail().subscribe((data) => this.orderDetail = data);
      this.OrderslistService.getorderPartys().subscribe((data) => this.orderParty = data);
      this.OrderslistService.getorderRemissionTotals().subscribe((data) => this.orderRemissionTotal = data);
      this.OrderslistService.getorderFeesTotals().subscribe((data) => this.orderFeesTotal = data);
      this.OrderslistService.getoorderTotalPaymentss().subscribe((data) => this.orderTotalPayments = data);
      this.viewStatus = 'order-full-view';
    }

  }

  addRemission(fee: IFee) {
    if (this.chkIsAddRemissionBtnEnable(fee)) {
      this.feeId = fee;
      this.paymentViewService.getApportionPaymentDetails(this.paymentGroup.payments[0].reference).subscribe(
        paymentGroup => {
          this.paymentGroup = paymentGroup;

          this.paymentGroup.payments = this.paymentGroup.payments.filter
            (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
          this.payment = this.paymentGroup.payments[0];
          this.paymentLibComponent.isFromPaymentDetailPage = true;
          this.viewStatus = 'addremission';
          this.isRefundRemission = true;
          this.cd.detectChanges();
        },
        (error: any) => this.errorMessage = error
      );
    }
  }

  checkForFees(paymentGroup: any) {
    if (paymentGroup !== null && paymentGroup !== undefined) {
      if (paymentGroup.fees !== null && paymentGroup.fees !== undefined) {
        return true;
      }

    }
    return false;
  }
  processRefund() {
    this.isConfirmationBtnDisabled = true;
    this.errorMessage = '';
    const obj = this.paymentGroup.fees[0];
    this.fees = [{
      id: obj.id,
      code: obj.code,
      version: obj.version,
      apportion_amount: obj.apportion_amount,
      calculated_amount: obj.calculated_amount,
      updated_volume: obj.updated_volume ? obj.updated_volume : obj.volume,
      volume: obj.volume,
      refund_amount: this.getOverPaymentValue()
    }];
    const requestBody = new PostRefundRetroRemission(this.contactDetailsObj, this.fees, this.paymentGroup.payments[0].reference, 'RR037',
      this.getOverPaymentValue(), 'op');
    this.paymentViewService.postRefundsReason(requestBody).subscribe(
      response => {
        if (JSON.parse(response)) {
          this.viewCompStatus = '';
          this.viewStatus = 'refundconfirmationpage';
          this.refundReference = JSON.parse(response).refund_reference;
          this.refundAmount = JSON.parse(response).refund_amount;
        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
        this.cd.detectChanges();
      })
  }
  gotoAddressPage(note?: IRefundContactDetails) {
    if (note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.errorMessage = '';
    this.viewCompStatus = 'overPaymentAddressCapture';
  }
  addRefundForRemission(payment: IPayment, remission: IRemission[], fees: any) {
    //if(!this.chkIsIssueRefundBtnEnable(payment)) {
    this.paymentViewService.getApportionPaymentDetails(payment.reference).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(payment.reference));
        this.payment = this.paymentGroup.payments[0];
        this.remissions = remission;
        this.remissionFeeAmt = fees.filter(data => data.code === this.remissions['fee_code'])[0].net_amount;
        this.viewStatus = 'addrefundforremission';
        // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
      },
      (error: any) => this.errorMessage = error
    );
    //}
  }

  goToPaymentViewComponent() {
    this.viewCompStatus = '';
    this.viewStatus = 'paymentview';
  }

  issueRefund(paymentgrp: IPaymentGroup) {

    this.paymentLibComponent.addPaymentGroup(this.paymentGroup);

    if (paymentgrp !== null && paymentgrp !== undefined) {
      if (this.chkIsIssueRefundBtnEnable(paymentgrp.payments[0])) {

        // No refund and no over payment --> showIssueRefundPage()
        if (!this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() == 0) {
          this.showIssueRefundPage(paymentgrp);
          return
        }
        // No refund and over payment --> showOverPayment()
        if (!this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() > 0) {
          this.showOverPayment();
          return
        }
        // Refunds > 0  and overPayment == 0 ---> refunds accepted. showIssueRefundPage(s)
        if (this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() == 0) {
          this.showIssueRefundPage(paymentgrp);
          return
        }
        // Refunds > 0 and overPayment > 0 --> refunds in process or Rejected.
        if (this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() > 0) {

          // rejected by fee refunds === refunds by fee it means that refund for the current fee is rejected.
          if (this.paymentLibComponent.isTheCurrentRefundRejectedForTheFee(this.paymentFees.at(0).id.toString())) {
            this.showOverPayment();
            return
          }
          // refunds in process Sent for approval,Approved
          this.showIssueRefundPage(paymentgrp);
          return
        }
      }
    }
  }


  isAnyRefundsForThisCase(){
    return (this.paymentLibComponent.refunds != null) && (this.paymentLibComponent.refunds.length > 0);
  }
  showOverPayment() {
    this.viewCompStatus = 'overpayment';
  }

  showIssueRefundPage(paymentgrp: IPaymentGroup) {

    this.paymentGroup = paymentgrp;
    this.viewStatus = 'issuerefund';
    this.isRefundRemission = true;
    this.paymentLibComponent.isFromPaymentDetailPage = true;
    this.isFromPaymentDetailPage = true;
    this.isFromServiceRequestPage = false;
  }

  getBalanceToBePaid(){
    return this.paymentLibComponent.overPaymentAmount
  }



  getRemissionByFeeCode(feeCode: string, remissions: IRemission[]): IRemission {
    if (remissions && remissions.length > 0) {
      for (const remission of remissions) {
        if (remission.fee_code === feeCode) {
          return remission;
        }
      }
    }
    return null;
  }

  chkIsIssueRefundBtnEnable(payment: IPayment): boolean {
    if (payment !== null && payment !== undefined) {
      return payment.issue_refund && payment.refund_enable
    } else {
      return false;
    }
  }

  chkIsAddRefundBtnEnable(remission: IRemission): boolean {
    if (remission !== null && remission !== undefined) {
      return remission.add_refund;
    } else {
      return false;
    }
  }


  canItBeRefunded(remission: IRemission): boolean {
    if (remission !== null && remission !== undefined) {
      if (remission.add_refund == false) {
        return false;
      }
      if (remission.overall_balance > 0) {
        return true;
      }
    }
    return false;
  }

  chkIsAddRemissionBtnEnable(fee: IFee): boolean {
    this.paymentLibComponent.addPaymentGroup(this.paymentGroup);
    if (fee !== null && fee !== undefined) {
      if (this.paymentLibComponent.overPaymentAmount > 0) {
        return fee.add_remission && fee.remission_enable && this.paymentLibComponent.isTheCurrentRefundInProcessForThisFee(fee);
      }
      return fee.add_remission && fee.remission_enable;
    } else {
      return false
    }
  }


  selectPymentOption(paymentType: string) {
    this.paymentType = paymentType;
    this.isContinueBtnDisabled = false;
  }
  continuePayment(paymentgrp: IPaymentGroup) {

    if (this.paymentType === 'op') {
      this.isFullyRefund = false
      this.viewCompStatus = 'overPaymentAddressCapture';
    } else if (this.paymentType === 'fp') {
      this.isFullyRefund = true
      this.paymentGroup = paymentgrp;
      this.viewStatus = 'issuerefund';
      this.viewCompStatus = "";
      this.isRefundRemission = true;
      this.paymentLibComponent.isFromPaymentDetailPage = true;
      this.isFromPaymentDetailPage = true;
      this.isFromServiceRequestPage = this.paymentLibComponent.isFromServiceRequestPage;
    }
  }
  gotoPaymentSelectPage(event: Event) {
    event.preventDefault();
    this.viewCompStatus = 'overpayment';
  }
  getContactDetails(obj: IRefundContactDetails) {
    this.contactDetailsObj = obj;
    this.notificationPreview = false;
    this.getTemplateInstructionType(this.paymentGroup.payments[0]);
    this.viewCompStatus = 'overpaymentcheckandanswer';

  }

  resetOrderData() {
    this.OrderslistService.setOrderRef(null);
    this.OrderslistService.setorderCCDEvent(null);
    this.OrderslistService.setorderCreated(null);
    this.OrderslistService.setorderDetail(null);
    this.OrderslistService.setorderParty(null);
    this.OrderslistService.setorderTotalPayments(null);
    this.OrderslistService.setorderRemissionTotal(null);
    this.OrderslistService.setorderFeesTotal(null);
  }

  goToPaymentFailuePage(payment: any) {
    this.viewStatus = 'payment-failure';
    this.selectedPaymentsStatus = payment;
  }
  goBackToPaymentView(event: any) {
    event.preventDefault();
    this.viewStatus = 'paymentview';
  }

  getTemplateInstructionType(payment: IPayment): void {

    if (payment == undefined || payment == null) {
      this.templateInstructionType = 'Template';
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
}
