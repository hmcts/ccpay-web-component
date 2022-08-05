import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PaymentLibService } from './payment-lib.service';
import { IBSPayments } from './interfaces/IBSPayments';
import { OrderslistService } from './services/orderslist.service';
import { IPayment } from './interfaces/IPayment';

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
      ></ccpay-fee-summary>
    <ccpay-reports *ngIf="viewName === 'reports'"></ccpay-reports>
    `
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
  @Input('rootUrl') rootUrl: boolean;
  @Input('REFUNDLIST') REFUNDLIST: string;
  @Input('USERID') USERID: string;
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: any[];
  @Input('LOGGEDINUSEREMAIL') LOGGEDINUSEREMAIL: string;
  @Input('isFromServiceRequestPage') isFromServiceRequestPage: boolean;

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
  iscancelClicked : boolean;
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

    if(this.LOGGEDINUSERROLES.length > 0) {
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
  }
}
