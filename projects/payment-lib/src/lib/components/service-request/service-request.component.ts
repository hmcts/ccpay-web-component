import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPayment } from '../../interfaces/IPayment';
import { IRemission } from '../../interfaces/IRemission';
import { IPaymentView } from '../../interfaces/IPaymentView';
import { IOrderReferenceFee } from '../../interfaces/IOrderReferenceFee';
import { IFee } from '../../interfaces/IFee';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { Router } from '@angular/router';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { OrderslistService } from '../../services/orderslist.service';

@Component({
  selector: 'ccpay-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
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
  @Input('takePayment') takePayment: boolean;
  @Input('ccdCaseNumber') ccdCaseNumber: boolean;
  @Input("isServiceRequest") isServiceRequest: string;
  @Output() goToServiceRquestComponent: EventEmitter<any> = new EventEmitter();


  servicerequest: string;
  // ccdCaseNumber: string;
  excReference: string;
  paymentGroups: any[] = [];
  payments: IPayment[] = [];
  nonPayments: IPayment[] = [];
  allPayments: IPayment[] = [];
  remissions: IRemission[] = [];
  fees: IFee[] = [];
  errorMessage: string;
  totalFees: number;
  totalPayments: number;
  totalNonOffPayments: number;
  totalRemissions: number;
  selectedOption: string;
  dcnNumber: string;
  paymentRef: string;
  isTurnOff: boolean;
  isNewPcipalOff: boolean;
  isRefundRemission: boolean = true;
  isOldPcipalOff: boolean;
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
  // lsCcdNumber: any = ls.get<any>('ccdNumber');
  payment: IPayment;
  paymentGroup: IPaymentGroup;
  paymentView: IPaymentView;


  isAddRemissionEnable: boolean = false;
  orderRemissionDetails: any[] = [];
  orderLevelFees: IOrderReferenceFee[] = [];
  cpoDetails: any = null;
  serviceRequestValue: string;
  orderAddBtnEnable: boolean;

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

  constructor(
    private paymentLibComponent: PaymentLibComponent,
    private paymentViewService: PaymentViewService,
    private OrderslistService: OrderslistService,
    private router: Router) { }

  ngOnInit() {
    this.isServiceRequest = 'false';
    if (this.viewStatus === undefined) {
      this.viewStatus = this.paymentLibComponent.viewName;
    }
    if(this.paymentLibComponent.isFromServiceRequestPage && this.paymentLibComponent.isFromPaymentDetailPage) {
      if(this.paymentLibComponent.isFromPaymentDetailPage && this.paymentLibComponent.isFromServiceRequestPage) {
      this.OrderslistService.getorderRefs().subscribe((data) => this.orderRef = data);
      this.OrderslistService.getorderCCDEvents().subscribe((data) => this.orderCCDEvent = data);
      this.OrderslistService.getorderCreateds().subscribe((data) => this.orderCreated = data);
      this.OrderslistService.getorderDetail().subscribe((data) => this.orderDetail = data);
      this.OrderslistService.getorderPartys().subscribe((data) => this.orderParty = data);
      this.OrderslistService.getorderRemissionTotals().subscribe((data) => this.orderRemissionTotal = data);
      this.OrderslistService.getorderFeesTotals().subscribe((data) => this.orderFeesTotal = data);
      this.OrderslistService.getoorderTotalPaymentss().subscribe((data) => this.orderTotalPayments = data);
    }
   
    
    }
    if(this.paymentLibComponent.isFromServiceRequestPage && this.paymentLibComponent.TAKEPAYMENT) {
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
    if(this.isServiceRequest !== 'false') {
      this.paymentLibComponent.isFromServiceRequestPage = true;
    }
    this.paymentLibComponent.isFromRefundStatusPage = false;
    this.paymentLibComponent.viewName = 'case-transactions';
    this.resetOrderData();
   let  partUrl = this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    if(this.isServiceRequest === 'false') {
      partUrl += this.paymentLibComponent.TAKEPAYMENT ? '&takePayment=true' : '&takePayment=false';
    }
    partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    partUrl += this.isServiceRequest !== 'false' ? '&servicerequest=true' : '&servicerequest=false';
    partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;
    partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
    partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
    const url = `/payment-history/${this.paymentLibComponent.CCD_CASE_NUMBER}?view=case-transactions&selectedOption=${this.paymentLibComponent.SELECTED_OPTION}${partUrl}`;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl(url);
  }

  addRemission(fee: IFee) {
    if(this.chkIsAddRemissionBtnEnable(fee)) {
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
      (error: any) => this.errorMessage = error.replace(/"/g,"")
    );
  }
  }

  addRefundForRemission(payment: IPayment, remission: IRemission[],fees:any) {
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.paymentViewService.getApportionPaymentDetails(payment.reference).subscribe(
      paymentGroup => {
        //this.paymentGroup = paymentGroup;

       // this.paymentGroup.payments = this.paymentGroup.payments.filter
          //(paymentGroupObj => paymentGroupObj.reference === payment.reference);
        this.payment = <any>'true';
       // this.remissions = remission;
        //this.remissionFeeAmt = fees.filter(data=>data.code === this.remissions['fee_code'])[0].net_amount;
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
    if (payment !== null && payment !== undefined) {
    if( this.chkIsIssueRefundBtnEnable(payment)) {
    this.viewStatus = 'issuerefund';
    this.payment = payment;
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.isRefundRemission = true;
    }
  }
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

  chkIsAddRemissionBtnEnable(fee: IFee): boolean {
    if (fee !== null && fee !== undefined) {
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

  // chkForAddRemission(feeCode: string): boolean {
  //   if (this.chkForPBAPayment() && this.check4AllowedRoles2AccessRefund()) {
  //     if (this.orderDetail[0]['remissions'].length > 0) {
  //       for (const remission of this.orderDetail[0]['remissions']) {
  //         if (remission.fee_code === feeCode) {
  //           return false;
  //         }
  //       }
  //     }
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // chkForPBAPayment(): boolean {
  //   if (this.orderDetail !== null &&  this.orderDetail !== undefined) {
  //   this.orderDetail.forEach(orderDetail => {
  //     if (orderDetail.payments) {
  //       orderDetail.payments.forEach(payment => {
  //         if (payment.method.toLocaleLowerCase() === 'payment by account' && this.allowFurtherAccessAfter4Days(payment)) {
  //           this.paymentLibComponent.paymentReference = payment.reference;
  //           this.isPBA = true;
  //         }
  //       });
  //     }
  //   });
  //   if (this.isPBA) {
  //     return true;
  //   } else {
  //     return false;
  //   };
  // }
  // }
  // chkIssueRefundBtnEnable(payment: IPayment): boolean {
  //   if (this.check4AllowedRoles2AccessRefund() && this.allowFurtherAccessAfter4Days(payment) &&
  //     payment.method === 'payment by account' && payment.status.toLocaleLowerCase() === 'success') {
  //     this.isIssueRefunfBtnEnable = true;
  //   }
  //   if (this.isIssueRefunfBtnEnable) {
  //     return true;
  //   } else {
  //     return false;
  //   };
  // }

  // chkIsRefundRemissionBtnEnable(): boolean {
  //   if (this.orderDetail !== null &&  this.orderDetail !== undefined) {
  //     this.paymentLibComponent.isFromServiceRequestPage = true;
  //   this.orderDetail.forEach(orderDetail => {
  //     if (orderDetail.payments) {
  //       orderDetail.payments.forEach(payment => {
  //         if (payment.method.toLocaleLowerCase() === 'payment by account' && payment.status.toLocaleLowerCase() === 'success' && this.allowFurtherAccessAfter4Days(payment)) {
  //           this.isRefundRemissionBtnEnable = true;
  //         }
  //       });
  //     }
  //   });
  //   if (this.isRefundRemissionBtnEnable) {
  //     return true;
  //   } else {
  //     return false;
  //   };
  // }
  // }

  // check4AllowedRoles2AccessRefund = (): boolean => {
  //   return this.allowedRolesToAccessRefund.some(role =>
  //     this.LOGGEDINUSERROLES.indexOf(role) !== -1
  //   );
  // }

  // allowFurtherAccessAfter4Days = (payment: IPayment): boolean => {
  //   if (payment !== null && payment !== undefined) {
  //   let tmp4DayAgo = new Date();
  //   tmp4DayAgo.setDate(tmp4DayAgo.getDate() - 4);
  //   return tmp4DayAgo >= new Date(payment.date_created);
  //   }
  // }


  // goToServiceRequestPage(event: any) {
  //   event.preventDefault();
  //   this.isFromServiceRequestPage = true;
  //   this.viewStatus = 'main'
  //   this.paymentLibComponent.viewName = 'case-transactions';
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //   this.router.onSameUrlNavigation = 'reload';
  // }

}
