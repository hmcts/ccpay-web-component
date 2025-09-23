// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, OnInit, Output} from '@angular/core';
import {IPayment} from '../../interfaces/IPayment';
import {IRemission} from '../../interfaces/IRemission';
import {IPaymentView} from '../../interfaces/IPaymentView';
import {IOrderReferenceFee} from '../../interfaces/IOrderReferenceFee';
import {IFee} from '../../interfaces/IFee';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import {Router} from '@angular/router';
import {PaymentViewService} from '../../services/payment-view/payment-view.service';
import {NotificationService} from '../../services/notification/notification.service';
import {OrderslistService} from '../../services/orderslist.service';
import {IRefundContactDetails} from '../../interfaces/IRefundContactDetails';
import {PostRefundRetroRemission} from '../../interfaces/PostRefundRetroRemission';
import {AddRemissionComponent} from '../add-remission/add-remission.component';
import {CommonModule} from '@angular/common';
import {PaymentViewComponent} from '../payment-view/payment-view.component';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import {NotificationPreviewComponent} from '../notification-preview/notification-preview.component';
import {CaseTransactionsComponent} from '../case-transactions/case-transactions.component';
import {CcdHyphensPipe} from '../../pipes/ccd-hyphens.pipe';
import {CapitalizePipe} from '../../pipes/capitalize.pipe';
import {RpxTranslationModule} from 'rpx-xui-translation';
import type { PaymentLibComponent } from '../../payment-lib.component';

type PaymentLibAlias = PaymentLibComponent;

@Component({
  selector: 'ccpay-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
  providers: [{ provide: 'SERVICE_REQUEST', useExisting: forwardRef(() => ServiceRequestComponent) }],
  imports: [
    forwardRef(() => AddRemissionComponent),
    CommonModule,
    forwardRef(() => PaymentViewComponent),
    forwardRef(() => ContactDetailsComponent),
    forwardRef(() => NotificationPreviewComponent),
    forwardRef(() => CaseTransactionsComponent),
    CcdHyphensPipe,
    CapitalizePipe,
    RpxTranslationModule
  ],
  standalone: true
})
export class ServiceRequestComponent implements OnInit {
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: string[];
  @Input('viewStatus') viewStatus: string;
  @Input('orderDetail') orderDetail: any[];
  @Input('orderRef') orderRef: string;
  @Input('orderStatus') orderStatus: string;
  @Input('orderParty') orderParty: string;
  @Input('orderCreated') orderCreated: Date;
  @Input('orderCCDEvent') orderCCDEvent: string;
  @Input('orderFeesTotal') orderFeesTotal: number;
  @Input('orderTotalPayments') orderTotalPayments: number;
  @Input('orderRemissionTotal') orderRemissionTotal: number;
  @Input('paymentGroupList') paymentGroupList: IPaymentGroup;
  @Input('takePayment') takePayment: boolean;
  @Input('ccdCaseNumber') ccdCaseNumber: boolean;
  @Input("isServiceRequest") isServiceRequest: string;
  @Output() goToServiceRquestComponent: EventEmitter<any> = new EventEmitter();

  viewCompStatus;
  servicerequest: string;
  paymentType: string;
  excReference: string;
  paymentGroups: any[] = [];
  payments: IPayment[] = [];
  nonPayments: IPayment[] = [];
  allPayments: IPayment[] = [];
  remissions: IRemission[] = [];
  paymentFees: IFee[];
  fees: any;
  errorMessage: string;
  totalFees: number;
  totalPayments: number;
  totalNonOffPayments: number;
  totalRemissions: number;
  selectedOption: string;
  dcnNumber: string;
  paymentRef: string;
  isTurnOff: boolean;
  isRefundRemission: boolean = true;
  isStrategicFixEnable: boolean;
  isAddFeeBtnEnabled: boolean = true;
  isExceptionRecord: boolean = false;
  isUnprocessedRecordSelected: boolean = false;
  exceptionRecordReference: string;
  isAnyFeeGroupAvilable: boolean = true;
  isHistoricGroupAvailable: boolean = false;
  isBulkScanEnable;
  isRemissionsMatch: boolean;
  isRemoveBtnDisabled: boolean = false;
  feeId: IFee;
  clAmountDue: number = 0;
  unprocessedRecordCount: number;
  isFeeRecordsExist: boolean = false;
  isGrpOutstandingAmtPositive: boolean = false;
  totalRefundAmount: Number;
  caseType: String;
  isConfirmationBtnDisabled: boolean;
  refundReference: string;
  refundAmount: string;
  payment: IPayment;
  paymentGroup: IPaymentGroup;
  paymentView: IPaymentView;

  isAddRemissionEnable: boolean = false;
  orderRemissionDetails: any[] = [];
  orderLevelFees: IOrderReferenceFee[] = [];
  cpoDetails: any []= [];
  serviceRequestValue: string;
  orderAddBtnEnable: boolean;
  isFromPaymentDetailPage: boolean;
  contactDetailsObj: IRefundContactDetails
  notification: any;
  isCPODown: boolean;
  test: boolean;
  isPBA: boolean = false;
  isIssueRefunfBtnEnable: boolean = false;
  isAddRemissionBtnEnabled: boolean = false;
  isRefundRemissionBtnEnable: boolean = false;
  allowedRolesToAccessRefund = ['payments-refund-approver', 'payments-refund'];
  isFromServiceRequestPage: boolean;
  navigationpage: string;
  remissionFeeAmt: number;
  isContinueBtnDisabled: boolean = true;
  isFullyRefund: boolean;
  templateInstructionType: string;
  notificationPreview: boolean;

  constructor(
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private paymentViewService: PaymentViewService,
    private OrderslistService: OrderslistService,
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.isTurnOff = this.paymentLibComponent.ISTURNOFF;
    this.isServiceRequest = 'false';
    if (this.viewStatus === undefined) {
      this.viewStatus = this.paymentLibComponent.viewName;
    }
    if (this.paymentLibComponent.isFromServiceRequestPage && this.paymentLibComponent.isFromPaymentDetailPage) {
      this.OrderslistService.getorderRefs().subscribe((data) => this.orderRef = data);
      this.OrderslistService.getorderCCDEvents().subscribe((data) => this.orderCCDEvent = data);
      this.OrderslistService.getorderCreateds().subscribe((data) => this.orderCreated = data);
      this.OrderslistService.getorderDetail().subscribe((data) => this.orderDetail = data);
      this.OrderslistService.getorderPartys().subscribe((data) => this.orderParty = data);
      this.OrderslistService.getorderRemissionTotals().subscribe((data) => this.orderRemissionTotal = data);
      this.OrderslistService.getorderFeesTotals().subscribe((data) => this.orderFeesTotal = data);
      this.OrderslistService.getoorderTotalPaymentss().subscribe((data) => this.orderTotalPayments = data);
    }
    if (this.paymentLibComponent.isFromServiceRequestPage && this.paymentLibComponent.TAKEPAYMENT) {
      this.isServiceRequest = 'false';
    }

  }
  goToServiceRequestPage() {
    this.goToServiceRquestComponent.emit();
  }

  goToCaseTransationPage(event: any) {
    event.preventDefault();
    this.OrderslistService.setnavigationPage('servicerequestpage');
    this.OrderslistService.setisFromServiceRequestPage(false);
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.ISBSENABLE = true;
    this.paymentLibComponent.isTakePayment = this.paymentLibComponent.TAKEPAYMENT;
    if (this.takePayment) {
      this.paymentLibComponent.isTakePayment = this.takePayment;
    }
    //this.paymentLibComponent.SERVICEREQUEST = "true";
    this.paymentLibComponent.isFromServiceRequestPage = false;
    if (this.isServiceRequest !== 'false') {
      this.paymentLibComponent.isFromServiceRequestPage = true;
    }
    this.paymentLibComponent.isFromRefundStatusPage = false;
    this.paymentLibComponent.viewName = 'case-transactions';
    this.resetOrderData();

    // Check we on XUI
    if (this.router.url.startsWith('/cases/case-details/')) {
      // Use ccpay-case-transactions component
      this.viewStatus = 'case-transactions';
    } else {
      // Reload Paybubble case-transactions page.
      let partUrl = this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
      if (this.isServiceRequest === 'false') {
        partUrl += this.paymentLibComponent.TAKEPAYMENT ? '&takePayment=true' : '&takePayment=false';
      }
      partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
      partUrl += this.isServiceRequest !== 'false' ? '&servicerequest=true' : '&servicerequest=false';
      partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;
      const url = `/payment-history/${this.paymentLibComponent.CCD_CASE_NUMBER}?view=case-transactions&selectedOption=${this.paymentLibComponent.SELECTED_OPTION}${partUrl}`;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl(url);
    }
  }

  addRemission(fee: IFee) {
    if (this.chkIsAddRemissionBtnEnable(fee)) {
      this.feeId = fee;
      this.viewStatus = 'addremission';
      this.payment = this.orderDetail[0].payments[0];
      this.paymentViewService.getApportionPaymentDetails(this.orderDetail[0].payments[0].reference).subscribe(
        paymentGroup => {
          this.paymentGroup = paymentGroup;

          this.paymentGroup.payments = this.paymentGroup.payments.filter
            (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
          this.payment = this.paymentGroup.payments[0];

          //  const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
          //  this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;

        },
        (error: any) => this.errorMessage = error.replace(/"/g, "")
      );
    }
  }

  addRefundForRemission(payment: IPayment, remission: IRemission[], fees: any) {
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.paymentViewService.getApportionPaymentDetails(payment.reference).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;
        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj.reference === payment.reference);
        this.payment = this.paymentGroup.payments[0];
        this.remissions = remission;
        this.remissionFeeAmt = fees.filter(data => data.code === this.remissions['fee_code'])[0].net_amount;
        this.viewStatus = 'addrefundforremission';
        // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
      },
      (error: any) => this.errorMessage = error
    );
  }
  cancelRemoval() {
    this.viewStatus = 'main';
  }

  removeFee(fee: any) {
    this.isRemoveBtnDisabled = true;
    this.paymentViewService.deleteFeeFromPaymentGroup(fee).subscribe(
      (success: any) => {
        window.location.reload();
      },
      (error: any) => {
        this.errorMessage = error;
        this.isRemoveBtnDisabled = false;
      }
    );
  }

  issueRefund(payment: IPayment) {

    this.paymentLibComponent.addPaymentGroup(this.paymentGroup);

    if (payment !== null && payment !== undefined) {
      if (this.chkIsIssueRefundBtnEnable(payment)) {
        this.paymentViewService.getApportionPaymentDetails(payment.reference).subscribe(
          paymentGroup => {
            paymentGroup.payments = paymentGroup.payments.filter
              (paymentGroupObj => paymentGroupObj['reference'].includes(payment.reference));


            // No refund and no over payment --> showIssueRefundPage()
            if (!this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() == 0) {
              this.showIssueRefundPage(paymentGroup, payment);
              return
            }
            // No refund and over payment --> showOverPayment()
            if (!this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() > 0) {
              this.showOverPayment(paymentGroup, payment);
              return
            }
            // Refunds > 0  and overPayment == 0 ---> refunds accepted. showIssueRefundPage()
            if (this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() == 0) {
              this.showIssueRefundPage(paymentGroup, payment);
              return
            }
            // Refunds > 0 and overPayment > 0 --> refunds in process or Rejected.
            if (this.isAnyRefundsForThisCase() && this.getBalanceToBePaid() > 0) {

              // rejected by fee refunds === refunds by fee it means that refund for the current fee is rejected.
              if (this.paymentLibComponent.isTheCurrentRefundRejectedForTheFee(paymentGroup.fees.at(0).id.toString())) {
                this.showOverPayment(paymentGroup, payment);
                return
              }
              // refunds in process Sent for approval,Approved
              this.showIssueRefundPage(paymentGroup, payment);
              return
            }

          },
          (error: any) => this.errorMessage = error
        );
      }
    }
  }


  isAnyRefundsForThisCase(){
    return (this.paymentLibComponent.refunds != null) && (this.paymentLibComponent.refunds.length > 0);
  }

  showOverPayment(paymentgrp: IPaymentGroup, payment) {
    this.viewStatus = '';
    this.payment = payment;
    this.paymentGroupList = paymentgrp;
    this.viewCompStatus = 'overpayment';
  }

  showIssueRefundPage(paymentgrp: IPaymentGroup, payment) {
    this.viewStatus = 'issuerefund';
    this.viewCompStatus = '';
    this.paymentFees = paymentgrp.fees;
    this.payment = payment;
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.isRefundRemission = true;


    this.paymentGroup = paymentgrp;
    this.viewStatus = 'issuerefund';
    this.isRefundRemission = true;
    this.paymentLibComponent.isFromPaymentDetailPage = true;
    this.isFromPaymentDetailPage = true;
    this.isFromServiceRequestPage = false;
    this.paymentLibComponent.addPaymentGroup(paymentgrp);
  }

  getBalanceToBePaid(){
    return this.paymentLibComponent.overPaymentAmount
  }


  goToPayementView(paymentGroupReference: string, paymentReference: string, paymentMethod: string) {
    this.goToPaymentViewComponent({ paymentGroupReference, paymentReference, paymentMethod });
  }

  goToPaymentViewComponent(paymentGroup: any) {
    this.paymentLibComponent.paymentMethod = paymentGroup.paymentMethod;
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.paymentLibComponent.paymentGroupReference = paymentGroup.paymentGroupReference;
    this.paymentLibComponent.paymentReference = paymentGroup.paymentReference;
    this.OrderslistService.setOrderRef(this.orderRef);
    this.OrderslistService.setorderCCDEvent(this.orderCCDEvent);
    this.OrderslistService.setorderCreated(this.orderCreated);
    this.OrderslistService.setorderDetail(this.orderDetail);
    this.OrderslistService.setorderParty(this.orderParty);
    this.OrderslistService.setorderTotalPayments(this.orderTotalPayments);
    this.OrderslistService.setorderRemissionTotal(this.orderRemissionTotal);
    this.OrderslistService.setorderFeesTotal(this.orderFeesTotal);
    this.viewStatus = 'payment-view';
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
    if (fee !== null && fee !== undefined) {
      if (this.paymentLibComponent.getRoundedOverPayment() > 0) {
        return fee.add_remission && fee.remission_enable && this.paymentLibComponent.isTheCurrentRefundInProcessForThisFee(fee);
      }
      return fee.add_remission && fee.remission_enable;
    } else {
      return false
    }
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

  selectPymentOption(paymentType: string) {
    this.paymentType = paymentType;
    this.isContinueBtnDisabled = false;
  }
  goToPaymentViewComp() {
    this.viewCompStatus = '';
    this.viewStatus = 'paymentview';
  }
  continuePayment(paymentgrp: IPaymentGroup) {

    if (this.paymentType === 'op') {
      this.isFullyRefund = false
      this.viewStatus = '';
      this.viewCompStatus = 'overPaymentAddressCapture';
    } else if (this.paymentType === 'fp') {
      this.isFullyRefund = true
      this.paymentGroupList = paymentgrp;
      this.viewStatus = 'issuerefund';
      this.viewCompStatus = "";
      this.isRefundRemission = true;
      this.paymentLibComponent.isFromPaymentDetailPage = true;
      this.isFromPaymentDetailPage = true;
      this.isFromServiceRequestPage = this.paymentLibComponent.isFromServiceRequestPage;
    }
  }
  getContactDetails(obj: IRefundContactDetails) {
    this.contactDetailsObj = obj;
    this.viewStatus = '';
    this.viewCompStatus = 'overpaymentcheckandanswer';
    this.getTemplateInstructionType(this.paymentGroupList.payments[0]);
    this.notificationPreview = false;
  }
  gotoPaymentSelectPage(event: Event) {
    event.preventDefault();
    this.viewStatus = '';
    this.viewCompStatus = 'overpayment';
  }
  gotoAddressPage(note?: IRefundContactDetails) {
    if (note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.errorMessage = '';
    this.viewStatus = '';
    this.viewCompStatus = 'overPaymentAddressCapture';
  }
  processRefund() {
    this.isConfirmationBtnDisabled = true;
    this.errorMessage = '';
    const obj = this.paymentGroupList.fees[0];
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
    const requestBody = new PostRefundRetroRemission(this.contactDetailsObj, this.fees, this.paymentGroupList.payments[0].reference, 'RR037',
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

  getOverPaymentValue() {
    let feesOverPayment = 0;
    this.paymentGroupList.fees.forEach(fee => {
      feesOverPayment += fee.over_payment;
    });
    return feesOverPayment > 0 ? feesOverPayment : this.paymentLibComponent.overPaymentAmount;

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

  hasPaymentsRole(): boolean {
    return this.LOGGEDINUSERROLES.includes('payments');
  }
}
