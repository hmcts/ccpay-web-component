import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator, FormArray } from '@angular/forms';
import { IFee } from '../../interfaces/IFee';
import {Router} from '@angular/router';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPayment } from '../../interfaces/IPayment';
import { RefundsService } from '../../services/refunds/refunds.service';
import { IRefundReasons } from '../../interfaces/IRefundReasons';
import { RefundsRequest } from '../../interfaces/RefundsRequest';
import { AddRetroRemissionRequest } from '../../interfaces/AddRetroRemissionRequest';
import { IssueRefundRequest } from '../../interfaces/IssueRefundRequest';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
import { PostIssueRefundRetroRemission } from '../../interfaces/PostIssueRefundRetroRemission';
import {ChangeDetectorRef} from '@angular/core';
import { IRemission } from '../../interfaces/IRemission';
import { OrderslistService } from '../../services/orderslist.service';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-add-remission',
  templateUrl: './add-remission.component.html',
  styleUrls: ['./add-remission.component.scss']
})
export class AddRemissionComponent implements OnInit {
  @Input() fee: IFee;
  @Input() fees: any [];
  @Input() payment: IPayment;
  @Input() remission: IRemission;
  @Input() ccdCaseNumber: string;
  @Input() caseType: string;
  @Input() viewCompStatus: string;
  @Input() paymentGroupRef: string;
  @Input() isTurnOff: boolean;
  @Input() isRefundRemission: boolean;
  @Input() isOldPcipalOff: boolean;
  @Input() isNewPcipalOff: boolean;
  @Input() isStrategicFixEnable: boolean;
  @Input() paidAmount: any;
  @Input() isFromRefundListPage: boolean;
  @Input() isFromPaymentDetailPage: boolean;
  @Input() isFromServiceRequestPage: boolean;
  @Input() feeamount: number;
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: string[];
  @Input('orderDetail') orderDetail: any[];
  @Input('orderRef') orderRef: string;
  @Input('orderStatus') orderStatus: string;
  @Input('orderParty') orderParty: string;
  @Input('orderCreated') orderCreated: Date;
  @Input('orderCCDEvent') orderCCDEvent: string;
  @Input('takepayment') takePayment: boolean;
  @Input('orderFeesTotal') orderFeesTotal: number;
  @Input('orderTotalPayments') orderTotalPayments: number;
  @Input('orderRemissionTotal') orderRemissionTotal: number;
  @Output() cancelRemission: EventEmitter<void> = new EventEmitter();
  //@Output() refundListReason: EventEmitter<any> = new EventEmitter({reason:string, code:string});
  @Output() refundListReason = new EventEmitter<{reason: string, code: string}>();
  @Output() refundListAmount: EventEmitter<string> = new EventEmitter();

  refund = {
    reason: {
      duplicate: 'Duplicate payment',
      humanerror: 'Human error',
      caseWithdrawn: 'Case withdrawn',
      other: 'Other'
    }
  }

  remissionForm: FormGroup;
  hasErrors = false;
  viewStatus = 'main';
  errorMessage = null;
  option: string = null;
  isConfirmationBtnDisabled: boolean = false;
  bsPaymentDcnNumber: string;
  selectedValue = 'yes';
  amount: any;
  retroRemission: boolean = false;
  remissionReference: string = '';
  refundReference: string;
  refundAmount: string;
  paymentExplanationHasError: boolean = false;
  refundReason:string;
  selectedRefundReason: string;
  displayRefundReason: string;
  refundCode:string;
  remessionPayment:IPayment;
  isRemissionCodeEmpty: boolean = false;
  remissionCodeHasError: boolean = false;
  isAmountEmpty: boolean = false;
  isReasonEmpty: boolean = false;
  amountHasError: boolean = false;
  isRemissionLessThanFeeError: boolean = false;
  refundHasError:boolean = false;
  isPaymentSuccess: boolean = false;
  isRemissionApplied: boolean = false;
  remissionamt:number;
  // refundReasons: any[] = [];
  commonRefundReasons: any[] = [];
  showReasonText: boolean;
  isRefundReasonsSelected: boolean;
  default: string;
  reasonLength: number;
  refundReasons:IRefundReasons[];
  pattern1: string;
  pattern2: string;
  sendOrderDetail: any[];
  sendOrderRef: string;
  component: { account_number: string; amount: number; case_reference: string; ccd_case_number: string; channel: string; currency: string; customer_reference: string; date_created: string; date_updated: string; description: string; method: string; organisation_name: string; payment_allocation: any[]; reference: string; service_name: string; site_id: string; status: string; };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent,
    private refundService: RefundsService,
    private cd: ChangeDetectorRef,
    private OrderslistService: OrderslistService) { }

  ngOnInit() {

      
    this.default = 'Select a different reason';
    this.pattern1 = '^([a-zA-Z0-9]{3})-([a-zA-Z0-9]{3})-([a-zA-Z0-9]{3})$';
    this.pattern2 = '^([A-Za-z]{2}[0-9]{2})-([0-9]{6})$';
    if(this.viewCompStatus !== '' && this.viewCompStatus !== undefined){
      this.viewStatus = '';
      }
    if(this.remission) {
    }
    if(this.fee) {
    this.amount = (this.fee.volume * this.fee.calculated_amount);
    }
    if (this.payment){
      this.remessionPayment = this.payment;
      if(this.payment.status === 'Success') {
        this.isPaymentSuccess = true;
      }
    }
    this.option = this.paymentLibComponent.SELECTED_OPTION;
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.remissionForm = this.formBuilder.group({
      remissionCode: new FormControl('', 
        Validators.compose([
        Validators.required,
        Validators.pattern(`(${this.pattern1})|(${this.pattern2})`)
      ]) 
      ),
      amount: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ])),
      refundReason: new FormControl('', Validators.compose([Validators.required])),
      refundDDReason: new FormControl('', Validators.compose([Validators.required])),
      reason: new FormControl(),
      feeAmount: new FormControl(),
    });
    const remissionctrls=this.remissionForm.controls;
    remissionctrls['refundDDReason'].setValue('Select a different reason', {onlySelf: true});
    
    if(this.viewCompStatus === ''){
    this.viewStatus = 'main';
    }
 
    if(this.viewCompStatus === 'issuerefund'){
      this.refundService.getRefundReasons().subscribe(
        refundReasons => { 
          this.refundReasons = refundReasons.filter((data) => data.recently_used === false);
          this.refundReasons = this.refundReasons.filter((data) => data.name !== 'Retrospective remission');
          this.cd.detectChanges();
          this.commonRefundReasons = refundReasons.filter((data) => data.recently_used === true);
          this.commonRefundReasons.sort((a, b) => a.toString().localeCompare(b));
          this.cd.detectChanges();
        } );
    }
    
    if(this.viewCompStatus === 'processretroremissonpage' && this.isFromRefundListPage){
      this.viewStatus = 'processretroremissonpage';
    }

  }


  addRemission() {
    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
      this.remissionForm.controls['refundReason'].setErrors(null);
      this.remissionForm.controls['refundDDReason'].setErrors(null);
    if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
      this.viewStatus = 'confirmation';
    }else {

      if(remissionctrls['remissionCode'].value == '' ) {
        this.resetRemissionForm([true, false, false, false, false, false], 'remissionCode');
      }
      if(remissionctrls['remissionCode'].value != '' && remissionctrls['remissionCode'].invalid ) {
        this.resetRemissionForm([false, true, false, false, false, false], 'remissionCode');
      }
      if(remissionctrls['amount'].value == '' ) {
        this.resetRemissionForm([false, false, true, false, false, false], 'amount');
      }
      if(remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid ) {
        this.resetRemissionForm([false, true, false, true, false, false], 'amount');
      }
      if(remissionctrls.amount.valid && !isRemissionLessThanFee){
        this.resetRemissionForm([false, false, false, false, true, false], 'amount');
      }
    }
  }

  confirmRemission() {
    this.isConfirmationBtnDisabled = true;
    const newNetAmount = this.remissionForm.controls.amount.value,
     remissionAmount = this.fee.net_amount - newNetAmount,
     requestBody = new AddRemissionRequest
    (this.ccdCaseNumber, this.fee, remissionAmount, this.remissionForm.controls.remissionCode.value, this.caseType);
    this.paymentViewService.postPaymentGroupWithRemissions(decodeURIComponent(this.paymentGroupRef).trim(), this.fee.id, requestBody).subscribe(
      response => {
        if (JSON.parse(response).success) {
          let LDUrl = this.isTurnOff ? '&isTurnOff=Enable' : '&isTurnOff=Disable'
            LDUrl += `&caseType=${this.caseType}`
            LDUrl += this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable'
            LDUrl += this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable'
          if (this.paymentLibComponent.bspaymentdcn) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}?view=fee-summary&selectedOption=${this.option}&paymentGroupRef=${this.paymentGroupRef}&dcn=${this.paymentLibComponent.bspaymentdcn}${LDUrl}`);
          }else {
            this.gotoCasetransationPage();
          }

        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
      }
    );
  }

  resetRemissionForm(val, field){
    if (field==='All'){
      this.isRemissionCodeEmpty = val[0];
      this.remissionCodeHasError = val[1];
      this.isAmountEmpty = val[2];
      this.amountHasError = val[3];
      this.isRemissionLessThanFeeError = val[4];
      this.isReasonEmpty = val[5];
    } else if(field==='remissionCode' || field==='All') {
      this.isRemissionCodeEmpty = val[0];
      this.remissionCodeHasError = val[1];
    } else if (field==='amount' || field==='All'){
      this.isAmountEmpty = val[2];
      this.amountHasError = val[3];
      this.isRemissionLessThanFeeError = val[4];
    } else if (field==='reason' || field==='All'){
      this.isReasonEmpty = val[5];
    }
  }

  // Add retro remission changes
  addRemissionCode() {
    this.errorMessage = false;
    this.viewStatus = '';
    this.isRefundRemission = false;
    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls
     // isRemissionLessThanFee = this.fee.calculated_amount >= remissionctrls.amount.value; 
      this.remissionForm.controls['refundReason'].setErrors(null);
      this.remissionForm.controls['refundDDReason'].setErrors(null);
      this.remissionForm.controls['amount'].setErrors(null);
    if (this.remissionForm.dirty && this.remissionForm.valid ) {
      this.viewCompStatus = '';
      this.viewStatus = "processretroremissonpage";
    }else {

      if(remissionctrls['remissionCode'].value == '' ) {
        this.resetRemissionForm([true, false, false, false, false], 'remissionCode');
      }
      if(remissionctrls['remissionCode'].value != '' && remissionctrls['remissionCode'].invalid ) {
        this.resetRemissionForm([false, true, false, false, false], 'remissionCode');
      }
      if(remissionctrls['amount'].value == '' ) {
        this.resetRemissionForm([false, false, true, false, false], 'amount');
      }
      if(remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid ) {
        this.resetRemissionForm([false, true, false, true, false], 'amount');
      }
      if(remissionctrls['reason'].value == '') {
        this.resetRemissionForm([false, false, false, true, false, true], 'reason');
      }
      if(remissionctrls.amount.valid){
        this.resetRemissionForm([false, false, false, false, true], 'amount');
      }
    
    }
  }


  gotoAddRetroRemissionCodePage() {
    this.errorMessage = false;
    if(this.isRefundRemission) {
      this.paymentLibComponent.iscancelClicked = true;
      this.refundListAmount.emit();
      this.paymentLibComponent.isFromRefundStatusPage = true;
      return;
    }
    if ( this.isFromRefundListPage ) {
      this.paymentLibComponent.iscancelClicked = true;
      this.refundListReason.emit({reason: this.selectedRefundReason, code: this.refundReason});
      this.paymentLibComponent.isFromRefundStatusPage = true;
      return;
    } 
    this.viewStatus = '';
    this.selectedValue = 'yes';
    this.viewCompStatus = "addremission";
    this.isRefundRemission = true;
    this.errorMessage = '';
    if(this.isFromPaymentDetailPage) {
      this.paymentLibComponent.viewName = 'payment-view';
    }
  }

  gotoCheckRetroRemissionPage(payment: IPayment) {
    this.paymentLibComponent.iscancelClicked = false;
    this.errorMessage = '';
    this.resetRemissionForm([false, false, false, false, false], 'All');
    if( !this.isRefundRemission) {
    var remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount >= remissionctrls.amount.value; 
    if (this.remissionForm.dirty ) {
      if(remissionctrls['amount'].value == '' || remissionctrls['amount'].value < 0) {
        this.resetRemissionForm([false, false, true, false, false], 'amount');
      } else if(remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid ) {
        this.resetRemissionForm([false, false, false, true, false], 'amount');
      } else if(remissionctrls.amount.valid && !isRemissionLessThanFee){
        this.resetRemissionForm([false, false, false, false, true], 'amount');
      } else {
          this.viewCompStatus = '';
          this.viewStatus = "checkretroremissionpage";
      }
    }
  } else {
    var remissionctrls=this.remissionForm.controls;
    //if (this.remissionForm.dirty ) {
      if(remissionctrls['amount'].value == '' || remissionctrls['amount'].value < 0 ) {
        this.resetRemissionForm([false, false, true, false, false], 'amount');
      } else {
          this.viewCompStatus = '';
          this.viewStatus = "checkretroremissionpage";
          this.refundListAmount.emit(remissionctrls['amount'].value);
      }
    //}
   
  }
  }

  gotoProcessRetroRemissionPage() {
    this.viewStatus = '';
    this.viewCompStatus = 'addremission';
    this.isRefundRemission = true;
    this.errorMessage = '';
  }

  confirmRetroRemission() {
    if(!this.isConfirmationBtnDisabled) {
    this.retroRemission = true;
    this.remissionamt = this.remissionForm.controls.amount.value;
    const requestBody = new AddRetroRemissionRequest(this.remissionamt,this.remissionForm.controls.remissionCode.value )
    this.paymentViewService.postPaymentGroupWithRetroRemissions(decodeURIComponent(this.paymentGroupRef).trim(), this.fee.id, requestBody).subscribe(
      response => {
        if (JSON.parse(response)) {
          this.isRemissionApplied = true;
          this.viewCompStatus  = '';
          this.viewStatus = 'retroremissionconfirmationpage';
          this.remissionReference =JSON.parse(response).remission_reference;
        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
        this.cd.detectChanges();
      }
    );
    }
  }

  processRefund() {
    this.errorMessage = '';
    this.isConfirmationBtnDisabled = true;
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }
    if (this.remissionReference === undefined || this.remissionReference === '') {
      this.remissionReference = this.remission.remission_reference;
    }
    const requestBody = new PostIssueRefundRetroRemission(this.remissionReference);
    this.paymentViewService.postRefundRetroRemission(requestBody).subscribe(
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
      })
  }

  // Issue Refund changes

  gotoIssueRefundConfirmation(payment: IPayment) {
    this.paymentLibComponent.iscancelClicked = false;
    if(this.paymentLibComponent.REFUNDLIST === "true") {
      this.isFromRefundListPage = true; 
    }
    this.errorMessage = '';
    this.refundReason = this.remissionForm.controls['refundReason'].value === null ? this.remissionForm.controls['refundDDReason'].value : this.remissionForm.controls['refundReason'].value;
    if(!this.refundReason || this.refundReason === 'Select a different reason') {
      this.refundHasError = true;
    } else if(this.selectedRefundReason.includes('Other') && (this.remissionForm.controls['reason'].value == '' || this.remissionForm.controls['reason'].value == null)) {
        this.resetRemissionForm([false, false, false, true, false, true], 'reason');
    } else if (this.selectedRefundReason.includes('Other') && this.remissionForm.controls['reason'].value !== '') {
      this.refundHasError = false;
      this.refundReason +=  '-' + this.remissionForm.controls['reason'].value;
      this.displayRefundReason = this.selectedRefundReason + '-' + this.remissionForm.controls['reason'].value;
      if ( this.isFromRefundListPage ) {
        this.refundListReason.emit({reason: this.displayRefundReason, code: this.refundReason});
      } else {
        this.viewCompStatus = '';
        this.viewStatus = 'checkissuerefundpage';
      }
      
    } else {
      this.displayRefundReason = this.selectedRefundReason;
      if ( this.isFromRefundListPage ) {
        this.paymentLibComponent.isFromRefundStatusPage = true;
        this.refundListReason.emit({reason: this.selectedRefundReason, code: this.refundReason});
      } else {
        this.viewCompStatus = '';
        this.viewStatus = 'checkissuerefundpage';
      }
   
    }
  }

  gotoIssueRefundPage() {
    this.errorMessage = '';
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
    this.isRefundRemission = true;
    this.errorMessage = false;
    this.refundHasError = false;
    this.isReasonEmpty = false;
  }

  gotoIssuePage(){
      this.viewCompStatus = 'issuerefundpage1';
  }

  changeIssueRefundReason() {
   // this.remissionForm.controls['refundReason'].setValue('Duplicate payment');
   this.errorMessage = '';
    this.refundHasError = false;
    this.isReasonEmpty = false;
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
    this.isRefundRemission = true;
  }

  confirmIssueRefund() {
    this.isConfirmationBtnDisabled = true;
    this.errorMessage = '';
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }
  
    const requestBody = new PostRefundRetroRemission(this.payment.reference,this.refundReason);
    this.paymentViewService.postRefundsReason(requestBody).subscribe(
      response => {
          if (JSON.parse(response)) {
            this.viewCompStatus  = '';
            this.viewStatus = 'refundconfirmationpage';
            this.refundReference =JSON.parse(response).refund_reference;
            if(JSON.parse(response).refund_amount) {
            this.refundAmount = JSON.parse(response).refund_amount;
            }
          }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
        this.cd.detectChanges();
      })
  }

// Retro Refund

  confirmRetroRefund() {
    this.isConfirmationBtnDisabled = true;
    this.errorMessage = '';
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }

    const requestBody = new PostRefundRetroRemission(this.payment.reference,'RR004-Retrospective remission');
    this.paymentViewService.postRefundsReason(requestBody).subscribe(
      response => {
          if (JSON.parse(response)) {
            this.viewCompStatus  = '';
            this.viewStatus = 'retrorefundconfirmationpage';
            this.refundReference =JSON.parse(response).refund_reference;
            if(JSON.parse(response).refund_amount) {
              this.refundAmount = JSON.parse(response).refund_amount;
              }
          }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
      });
  }

  selectRadioButton(key, value) {
    localStorage.setItem("myradio", key);
    const remissionctrls=this.remissionForm.controls;
    remissionctrls['refundDDReason'].setValue('Select a different reason', {onlySelf: true});
    remissionctrls['reason'].reset();
    this.isRefundReasonsSelected = true;
    this.errorMessage = false;
    this.isReasonEmpty = false;
    this.showReasonText = false;
    this.refundHasError = false;
    this.selectedRefundReason = key;
    if(this.selectedRefundReason.includes('Other')) {
      this.showReasonText = true;
      this.refundHasError = false;
      this.refundReason = key;
    }
  }

  selectchange(args) {
    const remissionctrls=this.remissionForm.controls;
    remissionctrls['refundReason'].reset();
    remissionctrls['reason'].reset();
    this.isRefundReasonsSelected = false;
    this.showReasonText = false;
    this.refundHasError = false;
    this.selectedRefundReason = args.target.options[args.target.options.selectedIndex].id;
    this.reasonLength = (29-this.selectedRefundReason.split('- ')[1].length);

    if(this.selectedRefundReason.includes('Other')) {
      this.showReasonText = true;
      this.refundHasError = false;
      this.refundReason = args.target.options[args.target.options.selectedIndex].id;
    }


  }

  gotoServiceRequestPage(event: any) {
    this.errorMessage ='';
    event.preventDefault();
    if (this.isFromServiceRequestPage && !this.isFromPaymentDetailPage) {
    this.viewStatus = 'order-full-view';
    this.viewCompStatus = '';
    } else if ( this.isFromRefundListPage ) {
        this.paymentLibComponent.iscancelClicked = true;
        this.refundListReason.emit({reason: this.selectedRefundReason, code: this.refundReason});
        this.paymentLibComponent.isFromRefundStatusPage = true;
    } else {
      this.paymentLibComponent.paymentMethod = this.payment.method;
      this.paymentLibComponent.paymentGroupReference = this.paymentLibComponent.paymentGroupReference
      this.paymentLibComponent.paymentReference = this.payment.reference;
      this.paymentLibComponent.viewName = 'payment-view';
      this.OrderslistService.setOrderRef(this.orderRef);
      this.OrderslistService.setorderCCDEvent(this.orderCCDEvent);
      this.OrderslistService.setorderCreated(this.orderCreated);
      this.OrderslistService.setorderDetail(this.orderDetail);
      this.OrderslistService.setorderParty(this.orderParty);
      this.OrderslistService.setorderTotalPayments(this.orderTotalPayments);
      this.OrderslistService.setorderRemissionTotal(this.orderRemissionTotal);
      this.OrderslistService.setorderFeesTotal(this.orderFeesTotal);
      this.viewStatus = 'payment-view';
      this.sendOrderDetail = this.orderDetail;
      this.sendOrderRef = this.orderRef;
      if(this.LOGGEDINUSERROLES === undefined) {
        this.OrderslistService.getUserRolesList().subscribe((data) => this.LOGGEDINUSERROLES = data);
      }
      this.viewCompStatus = '';
    }
    // if (this.paymentLibComponent.TAKEPAYMENT === undefined && this.paymentLibComponent.SERVICEREQUEST === undefined) {
    //   this.paymentLibComponent.SERVICEREQUEST = 'false';
    //   this.paymentLibComponent.TAKEPAYMENT = false;
    // }
    // if (this.isFromServiceRequestPage) {
    //   //this.paymentLibComponent.TAKEPAYMENT = false;
    //   this.paymentLibComponent.isFromRefundStatusPage = false;
    //   this.viewStatus = 'main'
    //   this.paymentLibComponent.viewName = 'case-transactions';
    //   this.OrderslistService.setisFromServiceRequestPage(true);
    //   this.OrderslistService.setnavigationPage('servicerequestpage');
    // }
    // if ( this.isFromRefundListPage ) {
    //   this.paymentLibComponent.iscancelClicked = true;
    //   this.refundListReason.emit({reason: this.selectedRefundReason, code: this.refundReason});
    //   this.paymentLibComponent.isFromRefundStatusPage = true;
    // } 
    // if(!this.paymentLibComponent.isFromRefundStatusPage)  {
    //     if(this.payment) {
    //       this.OrderslistService.setpaymentPageView({method: this.payment.method,payment_group_reference: this.paymentGroupRef, reference:this.payment.reference});
    //     }
    //     if (this.isFromServiceRequestPage) { 
    //       this.OrderslistService.setnavigationPage('servicerequestpage');
    //     } else {
    //       this.OrderslistService.setnavigationPage('paymentdetailspage');
    //     }
    //     this.errorMessage = '';
    //     this.paymentLibComponent.viewName = 'case-transactions';
    //     // this.paymentLibComponent.TAKEPAYMENT = true;
    //     this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    //     this.paymentLibComponent.ISNEWPCIPALOFF = this.isNewPcipalOff;
    //     this.paymentLibComponent.ISOLDPCIPALOFF = this.isOldPcipalOff;
    //     this.paymentLibComponent.isFromServiceRequestPage = true;  
    //     this.paymentLibComponent.ISBSENABLE = true;
    //     let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
    //     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    //     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    //     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    //     partUrl += `&caseType=${this.caseType}`;
    //     partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
    //     partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
    //     if(this.isFromPaymentDetailPage) {
    //       partUrl += this.paymentLibComponent.isFromPaymentDetailPage
    //     }
    //     if(!this.paymentLibComponent.TAKEPAYMENT) {
    //       this.paymentLibComponent.TAKEPAYMENT = undefined;
    //     }
    //     if ( this.paymentLibComponent.SERVICEREQUEST) {
    //       const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&selectedOption=${this.option}${partUrl}`;
    //       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //       this.router.onSameUrlNavigation = 'reload';
    //       this.router.navigateByUrl(url);
    //     } else {
    //       const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
    //       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //       this.router.onSameUrlNavigation = 'reload';
    //       this.router.navigateByUrl(url);
    //     }
       
    // } else {
    //   this.paymentLibComponent.viewName === 'refundstatuslist';
    //   this.paymentLibComponent.isFromRefundStatusPage = true;
    // }
  }

  gotoCasetransationPage() {
    this.OrderslistService.setnavigationPage('casetransactions');
    this.errorMessage = '';
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.VIEW = 'case-transactions';
    this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    this.paymentLibComponent.ISNEWPCIPALOFF = this.isNewPcipalOff;
    this.paymentLibComponent.ISOLDPCIPALOFF = this.isOldPcipalOff;
    this.paymentLibComponent.isFromServiceRequestPage = true;  
    this.resetOrderData();
    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
     partUrl += `&caseType=${this.caseType}`;
     partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
     partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
    const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(url);
  }

  gotoCasetransationPageCancelBtnClicked(event: Event) {
    event.preventDefault();
    if( !this.paymentLibComponent.isFromServiceRequestPage) {
      this.OrderslistService.setnavigationPage('casetransactions');
      this.OrderslistService.setisFromServiceRequestPage(false);
      this.paymentLibComponent.VIEW ='case-transactions';
      this.paymentLibComponent.viewName = 'case-transactions';
      this.paymentLibComponent.ISBSENABLE = true;
      this.paymentLibComponent.isRefundStatusView = false;
  //   this.OrderslistService.setnavigationPage('casetransactions');
  //   this.OrderslistService.setisFromServiceRequestPage(false);
  //   this.paymentLibComponent.VIEW ='case-transactions';
  //   this.paymentLibComponent.viewName = 'case-transactions';
  //   this.paymentLibComponent.ISBSENABLE = true;
  //   this.paymentLibComponent.isRefundStatusView = false;
  //   this.resetOrderData(); let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
  //   partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
  //   partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
  //   partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
  //   partUrl += `&caseType=${this.caseType}`;
  //   partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
  //   partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
  //  const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
  //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //  this.router.onSameUrlNavigation = 'reload';
  //  this.router.navigateByUrl(url);
    } else {  

    if (this.paymentLibComponent.REFUNDLIST) {
      this.paymentLibComponent.viewName = 'refund-list';
      return;
    }
    if (this.paymentLibComponent.TAKEPAYMENT === undefined && this.paymentLibComponent.SERVICEREQUEST === undefined) {
      this.paymentLibComponent.SERVICEREQUEST = 'false';
    }
    this.OrderslistService.setisFromServiceRequestPage(false);
    this.OrderslistService.setpaymentPageView({method: '',payment_group_reference: '', reference:''});
    this.OrderslistService.setnavigationPage('casetransactions');
    this.errorMessage = '';
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    this.paymentLibComponent.ISNEWPCIPALOFF = this.isNewPcipalOff;
    this.paymentLibComponent.ISOLDPCIPALOFF = this.isOldPcipalOff;
    this.paymentLibComponent.isFromServiceRequestPage = true;  
    this.paymentLibComponent.ISBSENABLE = true;
    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
     partUrl += `&caseType=${this.caseType}`;
     partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
     partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
     if(this.isFromPaymentDetailPage) {
       partUrl += this.paymentLibComponent.isFromPaymentDetailPage
     }

     if(!this.paymentLibComponent.SERVICEREQUEST) {
      const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl(url);
     } else {
      const url =`/payment-history/${this.ccdCaseNumber}?selectedOption=${this.option}${partUrl}`;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl(url);
     }
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


  getFormattedCurrency(currency:number){
    if(currency.toString().includes(".")){
      return currency
    }
     return currency.toString().concat(".00");
  }
  
}