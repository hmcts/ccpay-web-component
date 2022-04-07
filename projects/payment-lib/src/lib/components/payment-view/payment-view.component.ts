import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { IFee } from '../../interfaces/IFee';
import { IPayment } from '../../interfaces/IPayment';
import { IRemission } from '../../interfaces/IRemission';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';
import { ChangeDetectorRef } from '@angular/core';
import { OrderslistService } from '../../services/orderslist.service';
import { IRefundContactDetails } from '../../interfaces/IRefundContactDetails';

@Component({
  selector: 'ccpay-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {
  @Input() isTurnOff: boolean;
  @Input() isTakePayment: boolean;
  @Input() caseType: boolean;
  @Input() isNewPcipalOff: boolean;
  @Input() isOldPcipalOff: boolean;
  @Input() orderRef: string;
  @Input() orderStatus: string;
  @Input() orderTotalPayments: number;
  @Input() payment: IPayment;
  @Input() LOGGEDINUSERROLES: string[];
  @Input() orderParty: string;
  @Input() orderCreated: Date;
  @Input() orderCCDEvent: string;
  @Input() orderFeesTotal: number;
  @Input() orderRemissionTotal: number;
  @Input() orderDetail: any[];
  fees: any;
  isFullyRefund: boolean;
  @Input("isServiceRequest") isServiceRequest: string;

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
  constructor(private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent,
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
        this.paymentFees =fees;
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
        const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
       
      },
      (error: any) => this.errorMessage = error
    );

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
    if(this.chkIsAddRemissionBtnEnable(fee)) {
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
    if(paymentGroup !== null && paymentGroup !== undefined)
    {
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
    this.fees  = { id: obj.id, 
      code: obj.code,
      version:obj.version, 
      apportion_amount: obj.apportion_amount,
      calculated_amount: obj.calculated_amount,
      updated_volume: obj.updated_volume ? obj.updated_volume : obj.volume,
      volume: obj.volume,
      refund_amount:obj.over_payment };
    const requestBody = new PostRefundRetroRemission(this.contactDetailsObj,this.fees, this.paymentGroup.payments[0].reference, 'RR037', 
    this.paymentGroup.fees[0].over_payment);
    this.paymentViewService.postRefundsReason(requestBody).subscribe(
      response => {
          if (JSON.parse(response)) {
            this.viewCompStatus  = '';
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
  addRefundForRemission(payment: IPayment, remission: IRemission[],fees:any) {
 if(this.chkIsIssueRefundBtnEnable(payment)) {
    this.payment = payment;
    this.paymentViewService.getApportionPaymentDetails(this.payment.reference).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(this.payment.reference));
        this.payment = this.paymentGroup.payments[0];
        this.remissions = remission;
        this.remissionFeeAmt = fees.filter(data=>data.code === this.remissions['fee_code'])[0].net_amount;
        this.viewStatus = 'addrefundforremission';
        // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
      },
      (error: any) => this.errorMessage = error
    );
 }
  }

 
  issueRefund(paymentgrp: IPaymentGroup) {
    if (paymentgrp !== null &&  paymentgrp !== undefined) {
      if(this.chkIsIssueRefundBtnEnable(paymentgrp.payments[0])) {
        if(paymentgrp.payments[0].over_payment > 0) {
          this.viewCompStatus  = 'overpayment';
        } else {
          this.paymentGroup = paymentgrp;
          this.viewStatus = 'issuerefund';
          this.isRefundRemission = true;
          this.paymentLibComponent.isFromPaymentDetailPage = true;
          this.isFromPaymentDetailPage = true;
          this.isFromServiceRequestPage = false;
        }
      }
    }
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
    if (!payment.issue_refund_add_refund_add_remission){
      return false;
    } else if (payment.issue_refund && payment.refund_enable && payment.issue_refund_add_refund_add_remission) {
      return true
    } else {
      return false;
    }
  }
  }

  chkIsAddRefundBtnEnable(remission: IRemission): boolean {
    if (remission !== null && remission !== undefined) {
    if (!remission.issue_refund_add_refund_add_remission){
      return false;
    } else if (remission.add_refund && remission.issue_refund_add_refund_add_remission) {
      return true
    } else {
      return false;
    }
  }
  }

  chkIsAddRemissionBtnEnable(fee: IFee): boolean {
    if (fee !== null && fee !== undefined) {
    if (!fee.issue_refund_add_refund_add_remission){
      return false;
    } else if (fee.remission_enable && fee.issue_refund_add_refund_add_remission) {
      return true
    } else {
      return false;
    }
  }
}
  selectPymentOption(paymentType: string) {
    this.paymentType = paymentType;
    this.isContinueBtnDisabled = false;
  }
  continuePayment(paymentgrp: IPaymentGroup) {
    
    if (this.paymentType === 'op') {
      this.isFullyRefund = false
      this.viewCompStatus  = 'overPaymentAddressCapture';
    } else if(this.paymentType === 'fp') {
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
    this.viewCompStatus  = 'overpayment';
  }
  getContactDetails(obj:IRefundContactDetails) {
    this.contactDetailsObj = obj;
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

  // chkForPBAPayment(): boolean {
  //   if (this.paymentGroup !== null &&  this.paymentGroup !== undefined) {
  //   let payment = this.paymentGroup.payments[0];
  //   if (payment.method.toLocaleLowerCase() === 'payment by account' && this.allowFurtherAccessAfter4Days(payment)) {
  //     return true;
  //   }
  //   return false;
  // }
  // }

  // chkForAddRemission(feeCode: string): boolean {
  //   if (this.chkForPBAPayment() && this.check4AllowedRoles2AccessRefund() && this.allowFurtherAccessAfter4Days(this.paymentGroup.payments[0])) {
  //     if (this.paymentGroup.remissions && this.paymentGroup.remissions.length > 0) {
  //       for (const remission of this.paymentGroup.remissions) {
  //         if (remission.fee_code === feeCode) {
  //           return false;
  //         }
  //       }
  //       return true;
  //     }
  //     return true;

  //   } else {
  //     return false;
  //   }
  // }

  // check4AllowedRoles2AccessRefund = (): boolean => {
  //   return this.allowedRolesToAccessRefund.some(role =>
  //     this.LOGGEDINUSERROLES.indexOf(role) !== -1
  //   );
  // }

  // allowFurtherAccessAfter4Days = (payment: IPayment): boolean => {
  //   if(payment !== null && payment !== undefined) {
  //   let tmp4DayAgo = new Date();
  //   tmp4DayAgo.setDate(tmp4DayAgo.getDate() - 4);
  //   return tmp4DayAgo >= new Date(payment.date_created);
  //   }
  // }

  // chkIsRefundRemissionBtnEnable(): boolean {
  //   if (this.paymentGroup !== null &&  this.paymentGroup !== undefined) {
  //   this.paymentGroup.payments.forEach(payment => {
  //         if (payment.method.toLocaleLowerCase() === 'payment by account' && payment.status.toLocaleLowerCase() === 'success' && this.allowFurtherAccessAfter4Days(payment)) {
  //           this.isRefundRemissionBtnEnable = true;
  //         }
  //       });
  //   if (this.isRefundRemissionBtnEnable) {
  //     return true;
  //   } else {
  //     return false;
  //   };
  // }
  // }

}