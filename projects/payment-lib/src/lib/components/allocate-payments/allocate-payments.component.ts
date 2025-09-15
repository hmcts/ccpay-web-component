import { Component, OnInit, Input, Inject, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { CaseTransactionsService } from '../../services/case-transactions/case-transactions.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { IBSPayments } from '../../interfaces/IBSPayments';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IAllocationPaymentsRequest } from '../../interfaces/IAllocationPaymentsRequest';
import { IOrderReferenceFee } from '../../interfaces/IOrderReferenceFee';
import { OrderslistService } from '../../services/orderslist.service';
type PaymentLibAlias = PaymentLibComponent;



@Component({
    selector: 'app-allocate-payments',
    templateUrl: './allocate-payments.component.html',
    styleUrls: ['./allocate-payments.component.scss'],
    standalone: false
})
export class AllocatePaymentsComponent implements OnInit {
  @Input() isTurnOff: boolean;
  @Input() caseType: string;
  @Output() public reasonEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() public explanationEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  overUnderPaymentForm: FormGroup;
  viewStatus: string;
  ccdCaseNumber: string;
  bspaymentdcn: string;
  recordId: string;
  feedbackUrlLabel: string;
  unAllocatedPayment: IBSPayments = {
    amount: 0
  };
  siteID: string = null;
  // errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
  errorMessage = null
  paymentGroup: IPaymentGroup;
  paymentGroups: IPaymentGroup[] = [];
  remainingAmount: number;
  isRemainingAmountGtZero: boolean;
  isMoreDetailsBoxHide: boolean = true;
  isRemainingAmountLtZero: boolean;
  afterFeeAllocateOutstanding: number;
  amountForAllocation: number;
  isConfirmButtondisabled: boolean = false;
  isContinueButtondisabled: boolean = true;
  otherPaymentExplanation: string = null;
  selectedOption: string = null;
  isFeeAmountZero: boolean = false;

  paymentReasonHasError: boolean = false;
  paymentExplanationHasError: boolean = false;
  isPaymentDetailsEmpty: boolean = false;
  isPaymentDetailsInvalid: boolean = false;
  paymentDetailsMinHasError: boolean = false;
  paymentDetailsMaxHasError: boolean = false;
  isUserNameEmpty: boolean = false;
  isUserNameInvalid: boolean = false;
  ccdReference: string = null;
  exceptionReference: string = null;
  paymentReason: string = null;
  paymentExplanation: string = null;
  userName: string = null;
  paymentSectionLabel: any;
  paymentRef: string = null;
  isStrategicFixEnable: boolean = true;
  orderLevelFees: IOrderReferenceFee[] = [];
  cookieUserName: string[] = [];
  enCookieUserName: any;
  userNameField: string = null;

  reasonList: { [key: string]: { [key: string]: string } } = {
    overPayment: {
      hwfReward: 'Help with Fees (HWF) awarded.  Please include the HWF reference number in the explanatory note',
      wrongFee: 'Incorrect payment received',
      notIssueCase: 'Unable to issue case',
      otherDeduction: 'Other'
    },
    shortFall: {
      helpWithFee: 'Help with Fees (HWF) application declined',
      wrongFee: 'Incorrect payment received',
      other: 'Other'
    }
  }
  explanationList = {
    overPayment: {
      referRefund: 'Details in case notes.  Refund due',
      noRefund: 'Details in case notes. No refund due',
      noCase: 'No case created.  Refund due',
      other: 'Other'
    },
    shortFall: {
      holdCase: 'I have put a stop on the case and contacted the applicant requesting the balance of payment',
      heldCase: 'I have put a stop on the case.  The applicant needs to be contacted to request the balance of payment',
      other: 'Other'
    }
  }

  refund = {
    reason: {
      duplicate: 'Duplicate payment',
      humanerror: 'Human error',
      caseWithdrawn: 'Case withdrawn',
      other: 'Other'
    }
  }


  constructor(
    private errorHandlerService: ErrorHandlerService,
    private caseTransactionsService: CaseTransactionsService,
    private formBuilder: FormBuilder,
    private paymentViewService: PaymentViewService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    private OrderslistService: OrderslistService) { }

  ngOnInit() {
    this.viewStatus = 'mainForm';
    if (this.paymentLibComponent.paymentGroupReference !== null) {
      this.viewStatus = 'allocatePaymentConfirmation';
    }

    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.bspaymentdcn = this.paymentLibComponent.bspaymentdcn;
    this.paymentRef = this.paymentLibComponent.paymentGroupReference;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION;
    this.isStrategicFixEnable = this.paymentLibComponent.ISSFENABLE;
    this.isTurnOff = this.paymentLibComponent.isTurnOff;
    this.overUnderPaymentForm = this.formBuilder.group({
      moreDetails: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        Validators.pattern('^([a-zA-Z0-9\\s,\\.]*)$')
      ])),
      userName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9\\s]*)$')
      ])),
    });
    this.OrderslistService.getOrdersList().subscribe((data) =>
      this.orderLevelFees = data.filter(data => data.orderStatus !== 'Paid'));
    this.OrderslistService.getCaseType().subscribe((data) => this.caseType = data);
    this.getUnassignedPayment();
  }
  getGroupOutstandingAmount(paymentGroup: IPaymentGroup): number {
    return this.bulkScaningPaymentService.calculateOutStandingAmount(paymentGroup);
  }


  getExplanationValue(inputValue: string):void{
    this.paymentExplanation = inputValue;
    this.explanationEventEmitter.emit(this.paymentExplanation);
  };

  getReasonValue(inputValue: string):void{
    this.paymentReason = inputValue;
    this.reasonEventEmitter.emit(this.paymentReason);
  };

  getPaymentGroupDetails() {

    if (!this.isTurnOff) {
      this.paymentViewService.getPaymentGroupDetails(this.paymentRef).subscribe(
        paymentGroup => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          this.paymentGroup = paymentGroup;
          this.saveAndContinue();
        },
        (error: any) => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
        }
      );
    } else {
      this.caseTransactionsService.getPaymentGroups(this.ccdCaseNumber).subscribe(
        paymentGroups => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          this.paymentGroups = paymentGroups['payment_groups'].filter(paymentGroup => {
            paymentGroup.fees.forEach(fee => {
              if (fee.calculated_amount === 0) {
                this.isFeeAmountZero = true
              }
            });
            let fstCon = this.getGroupOutstandingAmount(<IPaymentGroup>paymentGroup),
              scndCn = fstCon > 0 || (fstCon == 0 && this.isFeeAmountZero) && paymentGroup.payment_group_reference === this.paymentRef;
            return this.paymentRef ? scndCn : fstCon > 0 || (fstCon == 0 && this.isFeeAmountZero);
          });
        },
        (error: any) => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
        }
      );
    }

  }

  selectedPaymentGroup(paymentGroup: IPaymentGroup) {
    this.isContinueButtondisabled = false;
    this.paymentGroup = paymentGroup;
  }

  gotoCasetransationPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.isTurnOff = this.isTurnOff;
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.ISBSENABLE = true;
  }

  gotoSummaryPage(event: any) {
    event.preventDefault();
    this.paymentLibComponent.viewName = 'fee-summary';
    this.paymentLibComponent.isTurnOff = this.isTurnOff;
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.ISBSENABLE = true;
  }

  cancelAllocatePayment(event: any) {
    event.preventDefault();
    this.resetForm([false, false, false, false, false, false, false, false], 'all');
    if (!this.isTurnOff) {
      this.paymentLibComponent.viewName = 'fee-summary';
      this.paymentLibComponent.isTurnOff = this.isTurnOff;
      this.paymentLibComponent.TAKEPAYMENT = true;
      this.paymentLibComponent.ISBSENABLE = true;
    } else {
      this.viewStatus = 'mainForm';
    }
  }
  confirmAllocatePayement() {
    this.enCookieUserName = document.cookie.split(";").find(row => row.includes("user-info")).split("=")[1].split(";");
    this.cookieUserName = JSON.parse(decodeURIComponent(this.enCookieUserName));

    const fullName = this.cookieUserName['forename'] + ' ' + this.cookieUserName['surname'];

    const paymentDetailsField = this.overUnderPaymentForm.controls.moreDetails,
      paymentFormError = this.overUnderPaymentForm.controls.moreDetails.errors,
      userNameField = fullName,
      isEmptyCondtion = this.paymentReason && this.paymentExplanation,
      isOtherOptionSelected = this.paymentExplanation === 'Other';

    this.resetForm([false, false, false, false, false, false, false, false], 'all');
    if ((!this.isRemainingAmountGtZero && !this.isRemainingAmountLtZero) || isEmptyCondtion && (!isOtherOptionSelected && userNameField.length > 0 || isOtherOptionSelected && userNameField.length > 0 && paymentDetailsField.valid)) {
      this.isConfirmButtondisabled = true;
      this.otherPaymentExplanation = this.paymentExplanation === 'Other' ? paymentDetailsField.value : this.paymentExplanation;
      this.userName = userNameField;
      this.finalServiceCall();
    } else {
      if (!this.paymentReason) {
        this.resetForm([true, false, false, false, false, false, false, false], 'reason');
      }
      if (!this.paymentExplanation) {
        this.resetForm([false, true, false, false, false, false, false, false], 'explanation');
      }
      if (this.paymentExplanation && isOtherOptionSelected) {
        if (paymentDetailsField.value == '') {
          this.resetForm([false, false, true, false, false, false, false, false], 'other');
        }
        if (paymentDetailsField.value != '' && paymentDetailsField.invalid) {
          this.resetForm([false, false, false, true, false, false, false, false], 'other');
        }
        if (paymentFormError && paymentFormError.minlength && paymentFormError.minlength.actualLength < 3) {
          this.resetForm([false, false, false, false, true, false, false, false], 'other');
        }
        if (paymentFormError && paymentFormError.maxlength && paymentFormError.maxlength.actualLength > 255) {
          this.resetForm([false, false, false, false, false, true, false, false], 'other');
        }
      }
      if (userNameField.length === 0) {
        this.resetForm([false, false, false, false, false, false, true, false], 'username');
      }
    }
  }
  resetForm(vals, field) {
    if (field === 'reason' || field === 'all') {
      this.paymentReasonHasError = vals[0];
    }
    if (field === 'explanation' || field === 'all') {
      this.paymentExplanationHasError = vals[1];
    }
    if (field === 'other' || field === 'all') {
      this.isPaymentDetailsEmpty = vals[2];
      this.isPaymentDetailsInvalid = vals[3];
      this.paymentDetailsMinHasError = vals[4];
      this.paymentDetailsMaxHasError = vals[5];
    }
    if (field === 'username' || field === 'all') {
      this.isUserNameEmpty = vals[6];
      this.isUserNameInvalid = vals[7];
    }
  }
  finalServiceCall() {
    if (!this.isStrategicFixEnable) {
      let allocatedRequest = {
        reason: this.paymentReason,
        allocation_status: 'Allocated',
        explanation: this.otherPaymentExplanation,
        payment_allocation_status: {
          description: '',
          name: 'Allocated'
        },
        payment_group_reference: this.paymentGroup.payment_group_reference,
        case_type: this.caseType,
        user_name: this.userName
      }
      const postStrategicBody = new AllocatePaymentRequest
        (this.ccdReference, this.unAllocatedPayment, this.caseType, this.exceptionReference, allocatedRequest);
      this.bulkScaningPaymentService.postBSPaymentStrategic(postStrategicBody, this.paymentGroup.payment_group_reference).subscribe(
        res => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          let response = JSON.parse(res);
          if (response.success) {
            this.gotoCasetransationPage();
          }
        },
        (error: any) => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
          window.scrollTo(0, 0);
          this.isConfirmButtondisabled = false;
        });

    } else {
      this.bulkScaningPaymentService.patchBSChangeStatus(this.unAllocatedPayment.dcn_reference, 'PROCESSED').subscribe(
        res1 => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          let response1 = JSON.parse(res1);
          if (response1.success) {
            const requestBody = new AllocatePaymentRequest
              (this.ccdReference, this.unAllocatedPayment, this.siteID, this.exceptionReference);
            this.bulkScaningPaymentService.postBSAllocatePayment(requestBody, this.paymentGroup.payment_group_reference).subscribe(
              res2 => {
                this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
                let response2 = JSON.parse(res2);
                const reqBody = new IAllocationPaymentsRequest
                  (response2['data'].payment_group_reference, response2['data'].reference, this.paymentReason, this.otherPaymentExplanation, this.userName);
                if (response2.success) {
                  this.paymentViewService.postBSAllocationPayments(reqBody).subscribe(

                    res3 => {
                      this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
                      let response3 = JSON.parse(res3);
                      if (response3.success) {
                        this.gotoCasetransationPage();
                      }
                    },
                    (error: any) => {
                      this.bulkScaningPaymentService.patchBSChangeStatus(this.unAllocatedPayment.dcn_reference, 'COMPLETE').subscribe();
                      this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
                      window.scrollTo(0, 0);
                      this.isConfirmButtondisabled = false;
                    }
                  );
                }
              },
              (error: any) => {
                this.bulkScaningPaymentService.patchBSChangeStatus(this.unAllocatedPayment.dcn_reference, 'COMPLETE').subscribe();
                this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
                window.scrollTo(0, 0);
                this.isConfirmButtondisabled = false;
              }
            );
          }
        },
        (error: any) => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
          window.scrollTo(0, 0);
          this.isConfirmButtondisabled = false;
        }
      );
    }
  }

  saveAndContinue() {
    if (this.paymentGroup) {
      this.isMoreDetailsBoxHide = true;
      this.overUnderPaymentForm.get('moreDetails').reset();
      this.overUnderPaymentForm.get('moreDetails').setValue('');
      this.overUnderPaymentForm.get('userName').reset();
      this.overUnderPaymentForm.get('userName').setValue('');
      this.paymentReason = '';
      this.paymentExplanation = '';
      let GroupOutstandingAmount = this.getGroupOutstandingAmount(this.paymentGroup);
      const remainingToBeAssigned = this.unAllocatedPayment.amount - GroupOutstandingAmount;
      this.isRemainingAmountGtZero = remainingToBeAssigned > 0;
      this.isRemainingAmountLtZero = remainingToBeAssigned < 0;
      this.paymentSectionLabel = this.isRemainingAmountGtZero ? {
        title: 'There is an Over payment of',
        reason: 'Provide a reason. This will be used in the Refund process.',
      } : this.isRemainingAmountLtZero ? {
        title: 'There is an Under payment of',
        reason: 'Provide a reason',
      } : {
        title: 'Amount left to be allocated',
        reason: '',
      };
      this.feedbackUrlLabel = this.isRemainingAmountGtZero ? 'CONFIRMALLOCATION_SURPLUS' : this.isRemainingAmountLtZero ? 'CONFIRMALLOCATION_SHORTFALL' : 'CONFIRMALLOCATION';
      this.remainingAmount = this.isRemainingAmountGtZero ? remainingToBeAssigned : this.isRemainingAmountLtZero ? remainingToBeAssigned * -1 : 0;
      this.afterFeeAllocateOutstanding = remainingToBeAssigned >= 0 ? 0 : (remainingToBeAssigned * -1);
      this.amountForAllocation = GroupOutstandingAmount >= this.unAllocatedPayment.amount ? this.unAllocatedPayment.amount : GroupOutstandingAmount;
      if (this.isTurnOff) {
        this.viewStatus = 'allocatePaymentConfirmation';
      }
    }
  }
  getUnassignedPayment() {
    this.bulkScaningPaymentService.getBSPaymentsByDCN(this.bspaymentdcn).subscribe(
      unassignedPayments => {
        this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
        this.unAllocatedPayment = unassignedPayments['data'].payments.filter(payment => {
          return payment && payment.dcn_reference == this.bspaymentdcn;
        })[0];
        this.siteID = unassignedPayments['data'].responsible_service_id;
        const beCcdNumber = unassignedPayments['data'].ccd_reference,
          beExceptionNumber = unassignedPayments['data'].exception_record_reference,
          exceptionReference = beCcdNumber ? beCcdNumber === this.ccdCaseNumber ? null : this.ccdCaseNumber : this.ccdCaseNumber;
        this.ccdReference = beCcdNumber ? beCcdNumber : null;
        this.exceptionReference = beExceptionNumber ? beExceptionNumber : exceptionReference;
        this.getPaymentGroupDetails();
      },
      (error: any) => {
        this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
      }
    );
  }
  selectRadioButton(key, type) {
    this.isMoreDetailsBoxHide = true;
    if (type === 'explanation' && key === 'other') {
      this.isPaymentDetailsEmpty = false;
      this.isPaymentDetailsInvalid = false;
      this.paymentDetailsMinHasError = false;
      this.paymentDetailsMaxHasError = false;
      this.isMoreDetailsBoxHide = false;
    }
  }
  OrderListSelectEvent(orderef: any) {
    this.isContinueButtondisabled = false;
    this.recordId = orderef;
  }

  redirectToOrderFeeSearchPage() {
    // this.paymentLibComponent.bspaymentdcn = null;
    this.paymentLibComponent.paymentGroupReference = this.recordId;
    this.paymentLibComponent.isTurnOff = this.isTurnOff;
    this.paymentLibComponent.viewName = 'fee-summary';
  }
}
