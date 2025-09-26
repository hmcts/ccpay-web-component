import {ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {PaymentLibService} from './payment-lib.service';
import {IBSPayments} from './interfaces/IBSPayments';
import {OrderslistService} from './services/orderslist.service';
import {IPayment} from './interfaces/IPayment';
import {IPaymentGroup} from "./interfaces/IPaymentGroup";
import {IRefundList} from "./interfaces/IRefundList";
import {IFee} from "./interfaces/IFee";
import {IRemission} from "./interfaces/IRemission";
import {AddRetroRemissionRequest} from "./interfaces/AddRetroRemissionRequest";


@Component({
    selector: 'ccpay-payment-lib',
    template: `
  <ccpay-refund-list [USERID]="USERID" [LOGGEDINUSERROLES]="LOGGEDINUSERROLES" [LOGGEDINUSEREMAIL]="LOGGEDINUSEREMAIL" *ngIf="viewName === 'refund-list'"></ccpay-refund-list>
    <ccpay-payment-list *ngIf="viewName === 'payment-list'"></ccpay-payment-list>
    <ccpay-refund-status
    [LOGGEDINUSERROLES]="LOGGEDINUSERROLES"
    [API_ROOT]="API_ROOT"
    *ngIf="viewName === 'refundstatuslist'"> </ccpay-refund-status >
    <ccpay-payment-view [LOGGEDINUSERROLES]="LOGGEDINUSERROLES" *ngIf="viewName === 'payment-view'"
    [isTurnOff]="ISTURNOFF" [isTakePayment]="TAKEPAYMENT"  [caseType]="CASETYPE"
    [ISPAYMENTSTATUSENABLED] = "ISPAYMENTSTATUSENABLED"
    ></ccpay-payment-view>

    <ccpay-process-refund *ngIf="viewName === 'process-refund'"
    [refundReference]="refundReference"
    [refundlistsource]="refundlistsource"
    ></ccpay-process-refund>
    <ccpay-pba-payment *ngIf="viewName === 'pba-payment'"
    [pbaPayOrderRef]="pbaPayOrderRef"
    ></ccpay-pba-payment>
    <ccpay-case-transactions [isTakePayment]="isTakePayment" [isFromServiceRequestPage]="isFromServiceRequestPage" [LOGGEDINUSERROLES]="LOGGEDINUSERROLES" *ngIf="viewName === 'case-transactions'"></ccpay-case-transactions>
    <app-mark-unidentified-payment *ngIf="viewName === 'unidentifiedPage'"
    [caseType]="CASETYPE"></app-mark-unidentified-payment>
    <app-mark-unsolicited-payment *ngIf="viewName === 'unsolicitedPage'"
    [caseType]="CASETYPE"></app-mark-unsolicited-payment>
    <app-allocate-payments *ngIf="viewName === 'allocate-payments'"
    [isTurnOff]="ISTURNOFF"
    [caseType]="CASETYPE"
    ></app-allocate-payments>
    <ccpay-fee-summary *ngIf="viewName === 'fee-summary'"
      [ccdCaseNumber]="CCD_CASE_NUMBER"
      [paymentGroupRef]="paymentGroupReference"
      [isTurnOff]="ISTURNOFF"
      [caseType]="CASETYPE"
      [telephonySelectionEnable] ="telephonySelectionEnable"
      ></ccpay-fee-summary>
    <ccpay-reports *ngIf="viewName === 'reports'"
    [ISPAYMENTSTATUSENABLED] = "ISPAYMENTSTATUSENABLED"
    ></ccpay-reports>
    `,
    providers: [{ provide: 'PAYMENT_LIB', useExisting: forwardRef(() => PaymentLibComponent) }],
    standalone: false
})

export class PaymentLibComponent implements OnInit {
  @Input('API_ROOT') API_ROOT: string;
  @Input('BULKSCAN_API_ROOT') BULKSCAN_API_ROOT: string;
  @Input('REFUNDS_API_ROOT') REFUNDS_API_ROOT: string;
  @Input('NOTIFICATION_API_ROOT') NOTIFICATION_API_ROOT: string;
  @Input('CARDPAYMENTRETURNURL') CARDPAYMENTRETURNURL: string;
  @Input('CCD_CASE_NUMBER') CCD_CASE_NUMBER: string;
  @Input('EXC_REFERENCE') EXC_REFERENCE: string;
  @Input('PAYMENT_METHOD') PAYMENT_METHOD: string;
  @Input('VIEW') VIEW: string;
  @Input('VIEWSERVICE') VIEWSERVICE: string;
  @Input('PAYMENT_GROUP_REF') PAYMENT_GROUP_REF?: string;
  @Input('TAKEPAYMENT') TAKEPAYMENT: boolean;
  @Input('SERVICEREQUEST') SERVICEREQUEST: string;
  @Input('DCN_NUMBER') DCN_NUMBER: string;
  @Input('SELECTED_OPTION') SELECTED_OPTION: string;
  @Input('ISBSENABLE') ISBSENABLE: Boolean;
  @Input('ISSFENABLE') ISSFENABLE: boolean;
  @Input('ISTURNOFF') ISTURNOFF: boolean;
  @Input('CASETYPE') CASETYPE: string;
  @Input('ISPAYMENTSTATUSENABLED') ISPAYMENTSTATUSENABLED: boolean;
  @Input('rootUrl') rootUrl: boolean;
  @Input('REFUNDLIST') REFUNDLIST: string;
  @Input('USERID') USERID: string;
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: any[];
  @Input('LOGGEDINUSEREMAIL') LOGGEDINUSEREMAIL: string;
  @Input('isFromServiceRequestPage') isFromServiceRequestPage: boolean;
  @Input('telephonySelectionEnable') telephonySelectionEnable: boolean;



  paymentMethod: string;
  bspaymentdcn: string;
  unProcessedPaymentServiceId: string = null;
  paymentGroupReference: string;
  paymentReference: string;
  refundReference: string;
  isFromPayBubble: boolean = false;
  refundlistsource: any;
  viewName: string;
  isTurnOff: boolean;
  caseType: string;
  unProcessedPayment: IBSPayments = null;
  isRefundStatusView: boolean;
  isRedirectFromCaseTransactionPage: string;
  isCallFromRefundList: boolean;
  isFromRefundStatusPage: boolean;
  iscancelClicked: boolean;
  isFromPaymentDetailPage: boolean;
  pbaPayOrderRef: IPayment;
  isTakePayment: boolean;

  orderDetail: any[];
  orderRef: string;
  orderStatus: string;
  orderParty: string;
  orderCreated: Date;
  orderCCDEvent: string;
  serviceRequestValue: string;
  orderAddBtnEnable: boolean;
  orderFeesTotal: number = 0.00;
  orderRemissionTotal: number = 0.00;
  orderTotalPayments: number = 0.00;
  orderPendingPayments: number = 0.00;

  paymentGroup:IPaymentGroup
  overPaymentAmount: number = 0.00;
  refunds: IRefundList[];

  constructor(private paymentLibService: PaymentLibService,
    private cd: ChangeDetectorRef,
    private OrderslistService: OrderslistService) { }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }


  ngOnInit() {

    this.paymentLibService.setApiRootUrl(this.API_ROOT);
    this.paymentLibService.setBulkScanApiRootUrl(this.BULKSCAN_API_ROOT);
    this.paymentLibService.setRefundndsApiRootUrl(this.REFUNDS_API_ROOT);
    this.paymentLibService.setNoticationApiRootUrl(this.NOTIFICATION_API_ROOT);
    this.paymentLibService.setCardPaymentReturnUrl(this.CARDPAYMENTRETURNURL);

    if (this.LOGGEDINUSERROLES.length > 0) {
      this.OrderslistService.setUserRolesList(this.LOGGEDINUSERROLES);
    }
    if (this.PAYMENT_GROUP_REF) {
      this.paymentGroupReference = this.PAYMENT_GROUP_REF;
    }
    if (this.DCN_NUMBER) {
      this.bspaymentdcn = this.DCN_NUMBER;
    }
    if (this.REFUNDLIST === "true") {
      this.VIEW = 'refund-list';
      this.viewName = this.VIEW;
    }
    if (this.VIEW === 'fee-summary') {
      this.viewName = 'fee-summary';
    } else if (this.VIEW !== 'reports' && this.VIEW !== 'refund-list') {
      this.viewName = 'case-transactions';
    } else {
      this.viewName = this.VIEW;
    }

    if (this.isTakePayment) {
      this.TAKEPAYMENT = true;
    }
    if (this.API_ROOT == 'api/payment-history') {
      this.isFromPayBubble = true;
    }
  }


  /**
   * Adds a remission to the payment group using data from the provided form group.
   *
   * This method checks if the `paymentGroup` is not null before attempting to add the remission.
   * If the `paymentGroup` exists, a new remission is created using the values from the provided
   * form group (`currentRemissionFormGroup`), and it is pushed into the `remissions` array of the payment group.
   *
   * @param {AddRetroRemissionRequest} currentRemissionFormGroup - The form group containing remission data
   *                                                               (e.g., `hwf_amount`, `hwf_reference`).
   */
  addRemission(currentRemissionFormGroup: AddRetroRemissionRequest) {

    if (this.paymentGroup != null) {

      const remission: IRemission = {

        remission_reference: null,
        hwf_reference: currentRemissionFormGroup.hwf_reference,
        hwf_amount: currentRemissionFormGroup.hwf_amount,
        beneficiary_name: null,
        ccd_case_number: null,
        fee_code: null,
        date_created: null,
        fee_id: null,
        issue_refund_add_refund_add_remission: false,
        add_refund: false,
        overall_balance:currentRemissionFormGroup.hwf_amount,
        acollection_of_fess: true
      };
      this.paymentGroup.remissions.push(remission);
    }
  }

  /**
   * This method is used to set the paymentGroup for the add remission journey.
   * @param updatedPaymentGroup this is an updated paymentGroup version.
   */
  addPaymentGroup(updatedPaymentGroup:IPaymentGroup){
    if (this.paymentGroup == null){
        this.paymentGroup = updatedPaymentGroup;
    }
  }


  /**
   * Calculates the total remission amount for the current payment group.
   *
   * This method checks if the payment group contains any remissions and, if so,
   * sums up the `hwf_amount` of all remissions using the `reduce()` method.
   * If no remissions are found, it returns a default value of 0.
   *
   * @returns {number} The total remission amount, or 0 if no remissions are present.
   */

  getTotalRemission(): number {
    let remissionTotal = 0;
    if (this.paymentGroup.remissions) {
      remissionTotal = this.paymentGroup.remissions.reduce((totalRemission, remission) => totalRemission + remission.hwf_amount, 0);
    }
    return remissionTotal;
  }

  /**
   * Calculates the total fee amount for the current payment group.
   *
   * This method checks if the payment group contains any fees and, if so,
   * sums up the `calculated_amount` of all fees using the `reduce()` method.
   * If no fees are found, it returns a default value of 0.
   *
   * @returns {number} The total fee amount, or 0 if no fees are present.
   */
  getTotalFees(): number {
    let feesTotal = 0;
    if (this.paymentGroup.fees) {
      feesTotal = this.paymentGroup.fees.reduce((totalFees, fee) => totalFees + fee.calculated_amount, 0);
    }
    return feesTotal;
  }

  /**
   * Calculates the total payment amount for the current payment group.
   *
   * This method checks if the payment group contains any payments and, if so,
   * sums up the `amount` of all payments using the `reduce()` method.
   * If no payments are found, it returns a default value of 0.
   *
   * @returns {number} The total payment amount, or 0 if no payments are present.
   */
  getTotalPayments(): number {
    let paymentsTotal = 0;
    if (this.paymentGroup.payments) {
      paymentsTotal = this.paymentGroup.payments.reduce((totalFees, payment) => totalFees + payment.amount, 0);
    }
    return paymentsTotal;
  }


  // Refunds libs section.

  /**
   * This function is used to find out if the current refunds list are in progress for the fee passed as parameter
   * @param fee this is the fee used to find out if the refunds are in progress.
   */
  isTheCurrentRefundInProcessForThisFee(fee: IFee): boolean{
    // No refunds
    if (this.refunds == null || this.refunds.length === 0) {
      return false;
    }
    return !this.isTheCurrentRefundRejectedForTheFee(fee.id.toString());
  }

  /**
   * This function is used to find out if in current list of refunds all refunds has been rejected
   * for the fee passed as parameter.
   * @param feeCode this is the fee code used to find out all refunds rejected refunds.
   */
  isTheCurrentRefundRejectedForTheFee(feeCode: string): boolean {

    let refundsByFee = this.refunds.filter(refund => refund.fee_ids === feeCode);
    let refundsByFeeAndRejected = this.refunds.filter(refund => refund.refund_status.name === 'Rejected');

    // Refunds > 0  and overPayment --> refunds in process or Rejected.
    if (refundsByFee.length === refundsByFeeAndRejected.length) {
      return true;
    }
    return false;
  }


  /**
   * Rounds very small values to zero if they fall below a specified threshold.
   *
   * This is useful for eliminating floating-point precision errors that result in
   * extremely small non-zero values (e.g., 1.1368683772161603e-13) which should
   * logically be treated as zero.
   *
   * @param value - The numeric value to evaluate and potentially round.
   * @param threshold - The minimum absolute value considered significant. Defaults to 1e-10.
   * @returns The original value if it's above the threshold, or 0 if it's below.
   *
   * @example
   * roundTinyValue(1.1368683772161603e-13); // returns 0
   * roundTinyValue(0.00001); // returns 0.00001
   */
  roundTinyValue(value: number, threshold: number = 1e-4): number {
    return Math.abs(value) < threshold ? 0 : value;
  }


  getRoundedOverPayment(): number {
    return this.roundTinyValue(this.overPaymentAmount);
  }
}



