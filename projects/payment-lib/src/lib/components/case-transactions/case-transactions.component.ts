import { Component, OnInit, Input } from '@angular/core';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { CaseTransactionsService } from '../../services/case-transactions/case-transactions.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { OrderslistService } from '../../services/orderslist.service';
import { IFee } from '../../interfaces/IFee';
import { IPayment } from '../../interfaces/IPayment';
import { IRemission } from '../../interfaces/IRemission';
import { IPaymentView } from '../../interfaces/IPaymentView';
import { IOrderReferenceFee } from '../../interfaces/IOrderReferenceFee';
import { Router } from '@angular/router';
import { ServiceRequestComponent } from '../../components/service-request/service-request.component';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-case-transactions',
  templateUrl: './case-transactions.component.html',
  styleUrls: ['./case-transactions.component.css']
})
export class CaseTransactionsComponent implements OnInit {
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: string[];
  @Input() isTakePayment: boolean;
  takePayment: boolean;
  servicerequest: string;
  ccdCaseNumber: string;
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
  viewStatus = 'main';
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

  //Order changes
  orderDetail: any[] = [];

  isAddRemissionEnable: boolean = false;
  orderRemissionDetails: any[] = [];
  orderLevelFees: IOrderReferenceFee[] = [];
  ispaymentGroupApisuccess: boolean = false;
  cpoDetails: any = null;
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
  isCPODown: boolean;
  test: boolean;
  isPBA: boolean = false;
  isIssueRefunfBtnEnable: boolean = false;
  isAddRemissionBtnEnabled: boolean = false;
  isRefundRemissionBtnEnable: boolean = false;
  allowedRolesToAccessRefund = ['payments-refund-approver', 'payments-refund'];
  isEligible4PBAPayment = ['pui-finance-manager', 'pui-user-manager', 'pui-organisation-manager', 'pui-case-manager'];
  currentDate = new Date();
  isFromServiceRequestPage: boolean;
  navigationpage: string;
  remissionFeeAmt: number;
  constructor(private router: Router,
    private paymentViewService: PaymentViewService,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    private caseTransactionsService: CaseTransactionsService,
    private paymentLibComponent: PaymentLibComponent,
    private OrderslistService: OrderslistService
  ) { }

  ngOnInit() {
    this.navigationpage  = '';
    if(this.OrderslistService.getpaymentPageView() !== null) {
      this.OrderslistService.getpaymentPageView().subscribe((data) => this.paymentView = data);
    }
    if((this.LOGGEDINUSERROLES === undefined || this.LOGGEDINUSERROLES.length === 0 )&&this.OrderslistService.getUserRolesList() !== null) {
      this.OrderslistService.getUserRolesList().subscribe((data) => this.LOGGEDINUSERROLES = data);
    }
    if(this.OrderslistService.getnavigationPageValue() !== null) {
      this.OrderslistService.getnavigationPageValue().subscribe((data) => this.navigationpage = data);
    }


    if (this.paymentView !== undefined && this.paymentView !== null && this.paymentView.payment_group_reference !== undefined && this.navigationpage === 'paymentdetailspage') {
      this.goToPayementView(this.paymentView.payment_group_reference, this.paymentView.reference, this.paymentView.method);
    }
    this.isGrpOutstandingAmtPositive = false;
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.caseType = this.paymentLibComponent.CASETYPE;
    if (this.paymentLibComponent.CCD_CASE_NUMBER === '') {
      this.ccdCaseNumber = this.paymentLibComponent.EXC_REFERENCE;
    }
    this.excReference = this.paymentLibComponent.EXC_REFERENCE;
    this.takePayment = this.paymentLibComponent.TAKEPAYMENT;

    this.servicerequest = this.paymentLibComponent.SERVICEREQUEST.toString();
    if (this.paymentLibComponent.SERVICEREQUEST.toString() === 'true') {
      this.serviceRequestValue = 'true';
    } else {
      this.serviceRequestValue = 'false';
    }
    this.isBulkScanEnable = this.paymentLibComponent.ISBSENABLE;
    this.dcnNumber = this.paymentLibComponent.DCN_NUMBER;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION.toLocaleLowerCase();
    this.isTurnOff = this.paymentLibComponent.ISTURNOFF;
    this.isStrategicFixEnable = this.paymentLibComponent.ISSFENABLE;
    if (!this.isTurnOff) {
      // if (this.lsCcdNumber !== this.ccdCaseNumber) {
      //   this.router.navigateByUrl(`/ccd-search?takePayment=true`);
      // }

      this.caseTransactionsService.getPaymentGroups(this.ccdCaseNumber).subscribe(
        paymentGroups => {
          this.isAnyFeeGroupAvilable =true;
          this.paymentGroups = paymentGroups['payment_groups'];
          this.calculateAmounts();
          this.calculateOrderFeesAmounts();
          this.calculateRefundAmount();
          if (this.isFromServiceRequestPage) {
            this.OrderslistService.getSelectedOrderRefId().subscribe((data) => this.orderRef = data);
            this.goToOrderViewDetailSection(this.orderRef);
          } else {
            this.paymentViewService.getPartyDetails(this.ccdCaseNumber).subscribe(
              response => {
                this.cpoDetails = JSON.parse(response).content[0];

              },
              (error: any) => {
                this.errorMessage = <any>error ? error.replace(/"/g,"") : "";
                this.isCPODown = true;
              }
            );

          }


        },
        (error: any) => {
          this.errorMessage = <any>error ? error.replace(/"/g,"") : "";
          this.isAnyFeeGroupAvilable = false;
          this.setDefaults();
        }
      );
    } else {
      this.caseTransactionsService.getPaymentGroups(this.ccdCaseNumber).subscribe(
        paymentGroups => {
          this.isAnyFeeGroupAvilable =true;
          this.paymentGroups = paymentGroups['payment_groups'];
          this.calculateAmounts();
          this.calculateOrderFeesAmounts();
          this.totalRefundAmount = this.calculateRefundAmount();
          this.paymentViewService.getPartyDetails(this.ccdCaseNumber).subscribe(
            response => {
              this.cpoDetails = JSON.parse(response).content[0];

            },
            (error: any) => {
              this.errorMessage = <any>error ? error.replace(/"/g,"") : "";
              this.setDefaults();
              this.isCPODown = true;
            }
          );

        },
        (error: any) => {
          this.errorMessage = <any>error ? error.replace(/"/g,"") : "";
          this.isAnyFeeGroupAvilable = false;
          this.setDefaults();
        }
      );
    }

    if( this.paymentGroups !== undefined) {
      this.checkForExceptionRecord();
    }

    if(this.OrderslistService.getisFromServiceRequestPages() !== null) {
      this.OrderslistService.getisFromServiceRequestPages().subscribe((data) => this.isFromServiceRequestPage = data);
    }

  }

  setDefaults(): void {
    this.totalPayments = 0.00;
    this.totalRemissions = 0.00;
    this.totalNonOffPayments = 0.00;
    this.totalFees = 0.00;
  }

  getAllocationStatus(payments: any) {

    let paymentAllocation = payments.payment_allocation,
      isAllocationStatusExist = paymentAllocation.length > 0;
    return isAllocationStatusExist ? paymentAllocation[0].allocation_status : '-';
    //return "-";

  }

  checkForExceptionRecord(): void {

    if (this.paymentGroups.length === 0 && (this.selectedOption.toLocaleLowerCase() === 'ccdorexception' || this.selectedOption.toLocaleLowerCase() === 'rc')) {
      this.bulkScaningPaymentService.getBSPaymentsByCCD(this.ccdCaseNumber).subscribe(
        recordData => {
          if (recordData['data'] && recordData['data'].exception_record_reference && recordData['data'].exception_record_reference.length > 0 && recordData['data'].ccd_reference > 0) {
            this.isExceptionRecord = false;
            this.isAddFeeBtnEnabled = true;
          }

          if (recordData['data'] && recordData['data'].exception_record_reference && recordData['data'].exception_record_reference.length > 0 && recordData['data'].ccd_reference === undefined) {
            this.isExceptionRecord = true;
            this.isAddFeeBtnEnabled = false;
          }

          if (recordData['data'] && recordData['data'].exception_record_reference && recordData['data'].exception_record_reference.length === undefined && recordData['data'].ccd_reference > 0) {
            this.isExceptionRecord = false;
            this.isAddFeeBtnEnabled = true;
          }
        });
    }

    if (this.paymentGroups.length === 0 && this.selectedOption.toLocaleLowerCase() === 'dcn') {
      if (this.paymentLibComponent.CCD_CASE_NUMBER.length > 0 && this.paymentLibComponent.EXC_REFERENCE.length > 0) {
        this.isExceptionRecord = false;
        this.isAddFeeBtnEnabled = true;
      } else if (this.paymentLibComponent.CCD_CASE_NUMBER.length === 0 && this.paymentLibComponent.EXC_REFERENCE.length > 0) {
        this.isExceptionRecord = true;
        this.isAddFeeBtnEnabled = false;
      } else {
        this.isExceptionRecord = false;
        this.isAddFeeBtnEnabled = true;
      }
    }
    if (this.paymentGroups.length > 0)
      this.paymentGroups.forEach(paymentGroup => {
        if (paymentGroup.payments) {
          paymentGroup.payments.forEach(payment => {
            if (payment.case_reference !== undefined && payment.ccd_case_number === undefined) {
              this.isExceptionRecord = true;
              this.isAddFeeBtnEnabled = false;
            } else {
              this.isExceptionRecord = false;
              this.isAddFeeBtnEnabled = true;
            }

          });
        }
      });
  }

  calculateOrderFeesAmounts(): void {
    let feesTotal = 0.00;
    this.paymentGroups.forEach(paymentGroup => {
      this.resetOrderVariables();
      if (paymentGroup.fees) {
        paymentGroup.fees.forEach(fee => {
          this.orderFeesTotal = this.orderFeesTotal + fee.calculated_amount
        }
        )
      }
      if (paymentGroup.remissions) {
        paymentGroup.remissions.forEach(remission => {
          this.orderRemissionTotal = this.orderRemissionTotal + remission.hwf_amount;
        });
      }

      if (paymentGroup.payments) {
        paymentGroup.payments.forEach(payment => {
          if (payment.status.toUpperCase() === 'SUCCESS') {
            this.orderTotalPayments = this.orderTotalPayments + payment.amount;
          }
        });
      }

      // this.orderPendingPayments = (this.orderFeesTotal - this.orderRemissionTotal) - this.orderTotalPayments;
      if (paymentGroup.service_request_status === 'Paid') {
        this.orderStatus = paymentGroup.service_request_status;
        this.orderAddBtnEnable = false;
      } else if (paymentGroup.service_request_status === 'Partially paid' || paymentGroup.service_request_status === 'Not paid') {
        this.orderStatus = paymentGroup.service_request_status;
        this.orderAddBtnEnable = true;
      } 

      //this.orderLevelFees.push({orderRefId:paymentGroup['payment_group_reference'],orderTotalFees: this.orderFeesTotal,orderStatus: this.orderStatus,orderParty:'Santosh', orderCCDEvent:'Case Creation',orderCreated: new Date(), orderAddBtnEnable: this.orderAddBtnEnable}); this.cpoDetails['createdTimestamp']
      if (this.cpoDetails !== null) {
        this.orderLevelFees.push({ orderRefId: paymentGroup['payment_group_reference'], orderTotalFees: this.orderFeesTotal, orderStatus: this.orderStatus, orderParty: this.cpoDetails['responsibleParty'], orderCCDEvent: this.cpoDetails['action'], orderCreated: paymentGroup['date_created'], orderAddBtnEnable: this.orderAddBtnEnable });

      } else {
        this.orderLevelFees.push({ orderRefId: paymentGroup['payment_group_reference'], orderTotalFees: this.orderFeesTotal, orderStatus: this.orderStatus, orderParty: '', orderCCDEvent: '', orderCreated: paymentGroup['date_created'], orderAddBtnEnable: this.orderAddBtnEnable });
      }

      if (this.orderStatus !== 'Paid') {
        this.OrderslistService.setOrdersList(this.orderLevelFees);
      }
    });
  };

  resetOrderVariables(): void {
    this.orderFeesTotal = 0.00;
    this.orderTotalPayments = 0.00;
    this.orderRemissionTotal = 0.00;
    this.orderPendingPayments = 0.00;
    this.isAddFeeBtnEnabled = true;

  };

  goToOrderViewDetailSection(orderReferenceObj: any) {
    if (this.isFromServiceRequestPage) {
      this.OrderslistService.setOrderRefId(orderReferenceObj);
      this.orderRef = orderReferenceObj;
    } else {
      this.OrderslistService.setOrderRefId(orderReferenceObj.orderRefId);
      this.orderRef = orderReferenceObj.orderRefId;
    }

    this.orderFeesTotal = 0.00;
    this.orderRemissionTotal = 0.00;
    this.orderTotalPayments = 0.00;
    this.orderPendingPayments = 0.00;

    this.orderDetail = this.paymentGroups.filter(x => x.payment_group_reference === this.orderRef);
    this.orderDetail.forEach(orderDetail => {
      if (orderDetail.fees) {
        orderDetail.fees.forEach(fee => {
          this.orderFeesTotal = this.orderFeesTotal + fee.calculated_amount;
        });
      }
      if (orderDetail.remissions) {
        orderDetail.remissions.forEach(remission => {
          this.orderRemissionTotal = this.orderRemissionTotal + remission.hwf_amount;
        });
        if (orderDetail.payments) {
          this.payment = orderDetail.payments[0];
          orderDetail.payments.forEach(payment => {
            if (payment.status.toUpperCase() === 'SUCCESS') {
              this.orderTotalPayments = this.orderTotalPayments + payment.amount;
            }
          });
        }
      }
      this.orderStatus = orderDetail.service_request_status;
    });
    //this.orderPendingPayments = (this.orderFeesTotal - this.orderRemissionTotal) - this.orderTotalPayments;
    // this.orderRef = orderReferenceObj.orderRefId;
    // if (this.orderPendingPayments <= 0.00) {
    //   this.orderStatus = 'Paid';
    // } else if (this.orderFeesTotal > 0 && (this.orderTotalPayments > 0 || this.orderRemissionTotal > 0) && (this.orderTotalPayments < this.orderPendingPayments)) {
    //   this.orderStatus = 'Partially paid'
    // } else {
    //   this.orderStatus = 'Not paid'
    // }


    if (this.cpoDetails !== null) {
      this.orderParty = this.cpoDetails['responsibleParty'];
      this.orderCreated = this.cpoDetails['createdTimestamp'];
      this.orderCCDEvent = this.cpoDetails['action'];
    } else {
      this.orderParty = '';
      this.orderCCDEvent = '';
      this.orderCreated = orderReferenceObj.orderCreated;
    }
    this.viewStatus = 'order-full-view';
  }

  redirectToOrderFeeSearchPage(event: any, orderef: any) {
    if(orderef.orderAddBtnEnable) {
    event.preventDefault();
    this.paymentLibComponent.bspaymentdcn = null;
    this.paymentLibComponent.paymentGroupReference = orderef.orderRefId;
    this.paymentLibComponent.isTurnOff = this.isTurnOff;
    this.paymentLibComponent.viewName = 'fee-summary';
    }
  }




  calculateAmounts(): void {
    let feesTotal = 0.00,
      paymentsTotal = 0.00,
      remissionsTotal = 0.00,
      nonOffLinePayment = 0.00;

    this.paymentGroups.forEach(paymentGroup => {
      if (paymentGroup.fees) {
        paymentGroup.fees.forEach(fee => {
          // new feature Apportionment toggle changes
          if (!this.isTurnOff) {
            if (fee.date_created) {
              let a = fee.amount_due === undefined;
              let b = fee.amount_due <= 0;
              this.clAmountDue = a ? this.clAmountDue + fee.net_amount : b ? this.clAmountDue + 0 : this.clAmountDue + fee.amount_due;
            }
            fee['payment_group_reference'] = paymentGroup['payment_group_reference'];
            this.fees.push(fee);
          } else {
            feesTotal = feesTotal + fee.calculated_amount;
            this.fees.push(fee);
          }

        });
      }
      if (this.isTurnOff) {
        this.totalFees = feesTotal;
      }

      if (paymentGroup.payments) {
        paymentGroup.payments.forEach(payment => {
          // new feature Apportionment toggle changes
          if (!this.isTurnOff) {
            let allocationLen = payment.payment_allocation;

            if (payment.status.toUpperCase() === 'SUCCESS') {
              paymentsTotal = paymentsTotal + payment.amount;
              if (allocationLen.length === 0 || allocationLen.length > 0 && allocationLen[0].allocation_status === 'Allocated') {
                nonOffLinePayment = nonOffLinePayment + payment.amount;
              }
              if (allocationLen.length > 0) {
                this.nonPayments.push(payment);
              }
            }
            if (allocationLen.length === 0) {
              this.payments.push(payment);
            }
            payment.paymentGroupReference = paymentGroup.payment_group_reference
            this.allPayments.push(payment);
          } else {
            if (payment.status.toUpperCase() === 'SUCCESS') {
              paymentsTotal = paymentsTotal + payment.amount;
              this.payments.push(payment);
            }
            payment.paymentGroupReference = paymentGroup.payment_group_reference
            this.allPayments.push(payment);
          }
        });
      }
      this.totalPayments = paymentsTotal;
      // new feature Apportionment toggle changes
      if (!this.isTurnOff) {
        this.totalNonOffPayments = nonOffLinePayment;
      }

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
    if (!this.isTurnOff) {
      let isNewPaymentGroup = false;

      this.paymentGroups.forEach((paymentGroup, index) => {
        let grpOutstandingAmount = 0.00,
          feesTotal = 0.00,
          paymentsTotal = 0.00,
          remissionsTotal = 0.00,
          fees = [];

        if (paymentGroup.fees) {
          // this.isFeeRecordsExist = true;
          paymentGroup.fees.forEach(fee => {
            feesTotal = feesTotal + fee.calculated_amount;

            this.isRemissionsMatch = false;
            if (paymentGroup.remissions) {
              paymentGroup.remissions.forEach(rem => {
                if (rem.fee_code === fee.code) {
                  this.isRemissionsMatch = true;
                  fee['remissions'] = rem;
                  // if(!fees.find(k => k.code=fee.code))
                  // {
                  fees.push(fee);
                  //}
                }
              });
            }
            if (!this.isRemissionsMatch) {
              fees.push(fee);
            }

            if (fee.date_created) {
              isNewPaymentGroup = true;
            } else {
              this.isHistoricGroupAvailable = true;
              this.paymentGroups[index]['old'] = true;
            }
          });
          this.paymentGroups[index].fees = fees;
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
        if (grpOutstandingAmount > 0 && isNewPaymentGroup) {
          this.isAnyFeeGroupAvilable = true;
          this.isFeeRecordsExist = true;
          this.paymentRef = paymentGroup.payment_group_reference;
        }
        if (paymentGroup.fees && paymentGroup.fees.length > 0 && grpOutstandingAmount <= 0 && isNewPaymentGroup) {
          this.isAnyFeeGroupAvilable = false;
        }
      });
      if ((!isNewPaymentGroup && this.isHistoricGroupAvailable) || (!isNewPaymentGroup && !this.isHistoricGroupAvailable)) {
        this.isAnyFeeGroupAvilable = false;
      }
    } else {
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
            if (fee.calculated_amount === 0) {
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
          if (totalRefundAmount === 0) {
            totalRefundAmount = grpOutstandingAmount;
          } else {
            totalRefundAmount = (totalRefundAmount + grpOutstandingAmount);
          }
        }
        else if (grpOutstandingAmount > 0 || (grpOutstandingAmount === 0 && isFeeAmountZero)) {
          this.isGrpOutstandingAmtPositive = true;
        }
      });
      return totalRefundAmount * -1;
    }
  }

  getGroupOutstandingAmount(paymentGroup: IPaymentGroup): number {
    return this.bulkScaningPaymentService.calculateOutStandingAmount(paymentGroup);
  }

  redirectToFeeSearchPage(event: any) {
    event.preventDefault();
    let url = this.isBulkScanEnable ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    url += this.isTurnOff ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    url += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    url +=`&caseType=${this.caseType}`;

    this.router.navigateByUrl(`/fee-search?selectedOption=${this.selectedOption}&ccdCaseNumber=${this.ccdCaseNumber}${url}`);
  }

  addRemission(fee: IFee) {
    if(this.chkForAddRemission(fee.code)) {
    this.feeId = fee;
    this.viewStatus = 'addremission';
    this.paymentViewService.getApportionPaymentDetails(this.payment.reference).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
        this.payment = this.paymentGroup.payments[0];
        // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
      },
      (error: any) => this.errorMessage = error? error.replace(/"/g,"") : ""
      );
    }
  }

  addRefundForRemission(payment: IPayment, remission: IRemission[],fees:any) {
    this.viewStatus = 'addrefundforremission';

    this.payment = payment;
    this.paymentViewService.getApportionPaymentDetails(this.payment.reference).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;

        this.paymentGroup.payments = this.paymentGroup.payments.filter
          (paymentGroupObj => paymentGroupObj['reference'].includes(this.payment.reference));
        this.payment = this.paymentGroup.payments[0];
        this.remissions = remission;
        this.remissionFeeAmt = fees.filter(data=>data.code === this.remissions['fee_code'])[0].net_amount;
        // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
        // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
      },
      (error: any) => this.errorMessage = error
    );
  }

  redirectToremissionPage(event: any) {
    event.preventDefault();
    this.paymentLibComponent.viewName = 'remission'
  }
  goToServiceRequestPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = false;
    this.paymentLibComponent.SERVICEREQUEST = 'true';
    this.paymentLibComponent.isFromServiceRequestPage = true;
    window.location.reload();
  }
  redirectToReportsPage(event: any) {
    event.preventDefault();
    this.router.navigateByUrl(`/reports?selectedOption=${this.selectedOption}&ccdCaseNumber=${this.ccdCaseNumber}`);
  }

  loadFeeSummaryPage(paymentGroup: IPaymentGroup) {
    this.paymentLibComponent.bspaymentdcn = null;
    this.paymentLibComponent.paymentGroupReference = paymentGroup.payment_group_reference;
    this.paymentLibComponent.isTurnOff = this.isTurnOff;
    this.paymentLibComponent.viewName = 'fee-summary';
  }

  goToPaymentViewComponent(paymentGroup: any) {
    this.paymentLibComponent.paymentMethod = paymentGroup.paymentMethod;
    this.paymentLibComponent.paymentGroupReference = paymentGroup.paymentGroupReference;
    this.paymentLibComponent.paymentReference = paymentGroup.paymentReference;
    this.paymentLibComponent.viewName = 'payment-view';
  }

  goToPayementView(paymentGroupReference: string, paymentReference: string, paymentMethod: string) {
    this.goToPaymentViewComponent({ paymentGroupReference, paymentReference, paymentMethod });
  }

  selectedUnprocessedFeeEvent(unprocessedRecordId: string) {
    if (unprocessedRecordId) {
      if (this.isTurnOff) {
        this.isAddFeeBtnEnabled = false;
      }
      this.isUnprocessedRecordSelected = true;
    } else {
      if (this.isTurnOff) {
        this.isAddFeeBtnEnabled = true;
      }
      this.isUnprocessedRecordSelected = false;
    }
  }

  getUnprocessedFeeCount(unProcessedRecordCount: number) {
    this.unprocessedRecordCount = unProcessedRecordCount;
  }

  calculateAmountDue(fee: IFee) {

    if (fee.date_created) {
      return fee.amount_due !== undefined ? fee.amount_due : fee.net_amount;
    } else {
      return "0.00";
    }
  }

  confirmRemoveFee(fee: IFee) {
    this.isRemoveBtnDisabled = false;
    this.feeId = fee;
    this.viewStatus = 'feeRemovalConfirmation';
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

  isCheckAmountdueExist(amountDue: any) {
    return typeof amountDue === 'undefined';
  }

  issueRefund(payment: IPayment) {
    if (payment !== null && payment !== undefined) {
    if(this.chkIssueRefundBtnEnable(payment)) {
    this.viewStatus = 'issuerefund';
    this.payment = payment;
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.isRefundRemission = true;
    }
  }
  }

  chkForAddRemission(feeCode: string): boolean {
    if (this.chkForPBAPayment() && this.check4AllowedRoles2AccessRefund()) {
      if (this.orderDetail[0]['remissions'].length > 0) {
        for (const remission of this.orderDetail[0]['remissions']) {
          if (remission.fee_code === feeCode) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }

  chkForPBAPayment(): boolean {
    if (this.orderDetail !== null &&  this.orderDetail !== undefined) {
    this.orderDetail.forEach(orderDetail => {
      if (orderDetail.payments) {
        orderDetail.payments.forEach(payment => {
          if (payment.method.toLocaleLowerCase() === 'payment by account' && this.allowFurtherAccessAfter4Days(payment)) {
            this.isPBA = true;
          }
        });
      }
    });
    if (this.isPBA) {
      return true;
    } else {
      return false;
    };
  }
  }

  chkIssueRefundBtnEnable(payment: IPayment): boolean {
    if (this.check4AllowedRoles2AccessRefund() && this.allowFurtherAccessAfter4Days(payment) &&
      payment.method === 'payment by account' && payment.status.toLocaleLowerCase() === 'success') {
      this.isIssueRefunfBtnEnable = true;
    }
    if (this.isIssueRefunfBtnEnable) {
      return true;
    } else {
      return false;
    };
  }

  chkIsRefundRemissionBtnEnable(): boolean {
    if (this.orderDetail !== null &&  this.orderDetail !== undefined) {
      this.paymentLibComponent.isFromServiceRequestPage = true;
    this.orderDetail.forEach(orderDetail => {
      if (orderDetail.payments) {
        orderDetail.payments.forEach(payment => {
          if (payment.method.toLocaleLowerCase() === 'payment by account' && payment.status.toLocaleLowerCase() === 'success' && this.allowFurtherAccessAfter4Days(payment)) {
            this.isRefundRemissionBtnEnable = true;
          }
        });
      }
    });
    if (this.isRefundRemissionBtnEnable) {
      return true;
    } else {
      return false;
    };
  }
  }

  check4AllowedRoles2AccessRefund = (): boolean => {
    return this.allowedRolesToAccessRefund.some(role =>
      this.LOGGEDINUSERROLES.indexOf(role) !== -1
    );
  }
  check4AllowedRoles2AccessPBApayment = (): boolean => {
    return this.isEligible4PBAPayment.some(role =>
      this.LOGGEDINUSERROLES.indexOf(role) !== -1
    );
  }

  allowFurtherAccessAfter4Days = (payment: IPayment): boolean => {
    if (payment !== null && payment !== undefined) {
    let tmp4DayAgo = new Date();
    tmp4DayAgo.setDate(tmp4DayAgo.getDate() - 4);
    return tmp4DayAgo >= new Date(payment.date_created);
    }
  }


  loadPBAAccountPage(orderRef: IPayment) {
    this.paymentLibComponent.pbaPayOrderRef = orderRef;
    this.paymentLibComponent.viewName = 'pba-payment';
  }
}