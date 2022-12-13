import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator, FormArray } from '@angular/forms';
import { IFee } from '../../interfaces/IFee';
import {Router} from '@angular/router';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';

import { IPayment } from '../../interfaces/IPayment';
import { RefundsService } from '../../services/refunds/refunds.service';
import { NotificationService } from '../../services/notification/notification.service';
import { IRefundReasons } from '../../interfaces/IRefundReasons';
import { AddRetroRemissionRequest } from '../../interfaces/AddRetroRemissionRequest';
import { IRefundContactDetails } from '../../interfaces/IRefundContactDetails';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
import { PostIssueRefundRetroRemission } from '../../interfaces/PostIssueRefundRetroRemission';
import {ChangeDetectorRef} from '@angular/core';
import { IRemission } from '../../interfaces/IRemission';
import { OrderslistService } from '../../services/orderslist.service';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';
const resolvedPromise = Promise.resolve(null);

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
  @Input() isStrategicFixEnable: boolean;
  @Input() paidAmount: any;
  @Input() isFromRefundListPage: boolean;
  @Input() isFromPaymentDetailPage: boolean;
  @Input() isFromServiceRequestPage: boolean;
  @Input('isFullyRefund') isFullyRefund: boolean;
  @Input() feeamount: number;
  @Input() refundPaymentReference: string;
  @Input() isFromRefundStatusPage: boolean;
  @Input() changeRefundReason: string;
  @Input("isServiceRequest") isServiceRequest: string;
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
  @Output() refundFees: EventEmitter<IFee[]> = new EventEmitter<IFee[]>();
  refund = {
    reason: {
      duplicate: 'Duplicate payment',
      humanerror: 'Human error',
      caseWithdrawn: 'Case withdrawn',
      other: 'Other'
    }
  }
  contactDetailsObj: IRefundContactDetails;
  notification: any;
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
  elementId:any;
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
  paymentReference : string;
  class='';
  errorMsg = new Array();
  totalRefundAmount: number;
  quantityUpdated: number;
  fullRefund: boolean;
  allowedRefundAmount: number;
  isRemissionsMatch: boolean;
  paymentFees: IFee[];
  paymentGroup: IPaymentGroup;
  isStatusAllocated: boolean;
  isFromCheckAnsPage: boolean;
  refundAmtForFeeVolumes: number;
  paymentObj: IPayment;
  notificationPreview: boolean;
  
  component: { account_number: string; amount: number; case_reference: string; ccd_case_number: string; channel: string; currency: string; customer_reference: string; date_created: string; date_updated: string; description: string; method: string; organisation_name: string; payment_allocation: any[]; reference: string; service_name: string; site_id: string; status: string; };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private paymentViewService: PaymentViewService,
    private notificationService : NotificationService,
    private paymentLibComponent: PaymentLibComponent,
    private refundService: RefundsService,
    private cd: ChangeDetectorRef,
    private OrderslistService: OrderslistService) { }

  ngOnInit() {
    this.errorMessage = '';
    this.errorMsg = [];
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
      this.paymentReference = this.payment.reference;
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
      feesList: this.formBuilder.array([])
    });
    const remissionctrls=this.remissionForm.controls;
    remissionctrls['refundDDReason'].setValue('Select a different reason', {onlySelf: true});
    if(this.refundPaymentReference !== undefined && this.refundPaymentReference.length >0) {
      this.paymentReference = this.refundPaymentReference
    } else {
      this.paymentReference = (this.payment !== undefined) ? this.payment.reference : ''; 
    }
    

    if(this.isFromServiceRequestPage) {
      this.paymentViewService.getApportionPaymentDetails(this.paymentReference).subscribe(
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
          this.fees = fees;
          this.paymentGroup = paymentGroup;
          
          this.paymentGroup.payments = this.paymentGroup.payments.filter
            (paymentGroupObj => paymentGroupObj['reference'].includes(this.paymentLibComponent.paymentReference));
          // const paymentAllocation = this.paymentGroup.payments[0].payment_allocation;
          // this.isStatusAllocated = paymentAllocation.length > 0 && paymentAllocation[0].allocation_status === 'Allocated' || paymentAllocation.length === 0;
           this.refundFeesList();
        },
        (error: any) => this.errorMessage = error
      );
    }

    
    if (this.fees && this.viewCompStatus === 'issuerefund') {
      this.refundFeesList();
    }

    if(this.viewCompStatus === ''){
    this.viewStatus = 'main';
    }
 
    if(this.viewCompStatus === 'issuerefundpage1'){
      this.refundService.getRefundReasons().subscribe(
        refundReasons => {
          this.refundReasons = refundReasons.filter((data) => data.recently_used === false);
          this.refundReasons = this.refundReasons.filter((data) => data.name !== 'Retrospective remission' && data.name !== 'Overpayment');
          this.cd.detectChanges();
          this.commonRefundReasons = refundReasons.filter((data) => data.recently_used === true);
          this.commonRefundReasons.sort((a, b) => a.toString().localeCompare(b));
          this.cd.detectChanges();
        } );
        this.refundReason = this.changeRefundReason;
    }

    if(this.viewCompStatus === 'processretroremissonpage' && this.isFromRefundListPage){
      this.viewStatus = 'processretroremissonpage';
    }
    if(this.orderDetail !== undefined){
      this.paymentViewService.getApportionPaymentDetails(this.orderDetail[0].payments[0].reference).subscribe(
        paymentGroup => {
      this.fees = paymentGroup.fees;
      this.paymentReference = paymentGroup.payments[0].reference;
      },
      (error: any) => this.errorMessage = error
    );
    }

  }
  goToPaymentViewComponent() {
    this.paymentLibComponent.paymentMethod = this.payment.method;
    this.paymentLibComponent.paymentGroupReference = this.paymentGroupRef;
    this.paymentLibComponent.paymentReference = this.paymentReference;
    //this.PaymentViewComponent.viewCompStatus = 'overpayment';
    this.paymentLibComponent.viewName = 'payment-view';
  }
  refundFeesList() {
    const creds = this.remissionForm.controls.feesList as FormArray;
  // if(creds.controls.length > 0) {
      for(var i=0;i<this.fees.length;i++) {
        creds.push(this.formBuilder.group({
          id: this.fees[i].id,
          code: this.fees[i].code,
          volume: this.fees[i].volume,
          calculated_amount: this.fees[i].calculated_amount,
          apportion_amount: this.fees[i].apportion_amount,
          ccd_case_number: this.fees[i].ccd_case_number,
          description: this.fees[i].description,
          net_amount: this.fees[i].net_amount,
          version: this.fees[i].version,
          refund_amount : [''],
          selected:[''] ,
          updated_volume: this.fees[i].volume
        }));
   }
    this.cd.detectChanges();
  //}
  }

  get feesList()
  {
    const dd =this.remissionForm.get('feesList') as FormArray ;
    return this.remissionForm.get('feesList') as FormArray;
  }

  noneSelected(){
    if(this.isFullyRefund) {
      return false;
    } else {
      if(!this.feesList.controls.some(item => item.get('selected').value === true)) {
        this.errorMsg = [];
        [].forEach.call(document.querySelectorAll('input'), function (el) {
          el.classList.remove('inline-error-class');
        });
      }
      return  !this.feesList.controls.some(item => item.get('selected').value === true);
  }
  }
    
  check_en (i,v1: any, AppAmt,Volume) {
    const ele = document.getElementById(v1) as HTMLInputElement;
    const formArray = this.remissionForm.controls.feesList as FormArray;
  
    if(ele.checked){
      formArray.at(i).get('refund_amount').setValue(AppAmt);
      formArray.at(i).get('volume').setValue(Volume);
      formArray.at(i).get('selected').setValue(true);
      formArray.at(i).get('updated_volume').setValue(Volume);
      (<HTMLInputElement>document.getElementById('feeAmount_'+v1)).value = AppAmt;
      document.getElementById('feeAmount_'+v1).removeAttribute("disabled"); 
      if(Volume === 1) {
           (<HTMLInputElement>document.getElementById('VolumeUpdated_'+v1)).value = Volume;
      } else {
           (<HTMLInputElement>document.getElementById('feeVolumeUpdated_'+v1)).value = Volume;
      }
    
      if (document.getElementById('feeVolumeUpdated_'+v1) !== null) {
           document.getElementById('feeAmount_'+v1).removeAttribute("disabled"); 
           document.getElementById('feeVolumeUpdated_'+v1).removeAttribute("disabled");   
      }   
      this.cd.detectChanges(); 
    } else {
      this.errorMsg = [];  
      document.getElementById('feeAmount_'+v1).setAttribute("disabled", "true"); 
      this.remissionForm.value.feesList[i]["refund_amount"] = ''; 
      this.remissionForm.value.feesList[i]["volume"] = ''; 
      this.remissionForm.value.feesList[i]["selected"] = false; 
      (<HTMLInputElement>document.getElementById('feeAmount_'+v1)).value = '';
      if(Volume>1) {
        this.remissionForm.value.feesList[i]["volume"] = ''; 
       (<HTMLInputElement>document.getElementById('feeVolumeUpdated_'+v1)).value = '';
      }
      
      if (document.getElementById('feeVolumeUpdated_'+v1) !== null) {
      document.getElementById('feeVolumeUpdated_'+v1).removeAttribute("disabled");  
      }
      this.cd.detectChanges();
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
    // this.isFromCheckAnsPage = true;
    this.errorMsg = [];
    this.viewStatus = '';
    this.isRefundRemission = false;
    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls
     // isRemissionLessThanFee = this.fee.calculated_amount >= remissionctrls.amount.value;
      this.remissionForm.controls['refundReason'].setErrors(null);
      this.remissionForm.controls['refundDDReason'].setErrors(null);
      this.remissionForm.controls['amount'].setErrors(null);
    if (this.remissionForm.dirty && this.remissionForm.valid ) {
      if (!this.isFromCheckAnsPage) {
        this.viewCompStatus = '';
        this.viewStatus = "processretroremissonpage";
      } else {
        this.viewCompStatus = '';
        this.viewStatus = 'checkretroremissionpage';
      }
      
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
    this.isFromCheckAnsPage = false;
    this.errorMsg = [];
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
    this.errorMsg = [];
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
  gotoAmountRetroRemission() {
    this.isFromCheckAnsPage = false;
    this.viewStatus = 'processretroremissonpage';
    this.viewCompStatus = '';
    // this.isRefundRemission = true;
    this.errorMessage = '';
  }
  gotoProcessRetroRemissionPage() {
    this.isFromCheckAnsPage = true;
    this.viewStatus = '';
    this.viewCompStatus = 'addremission';
    this.isRefundRemission = true;
    this.errorMessage = '';
    this.errorMsg = [];
  }

  gotoProcessRetroRemission(note?: IRefundContactDetails) {
    if(note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.isFromCheckAnsPage = true;
    this.viewStatus = 'remissionAddressPage';
    this.viewCompStatus = '';
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
    this.errorMsg = [];
    this.isConfirmationBtnDisabled = true;
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }
    if (this.remissionReference === undefined || this.remissionReference === '') {
      this.remissionReference = this.remission.remission_reference;
    }
    const requestBody = new PostIssueRefundRetroRemission(this.remissionReference, this.contactDetailsObj);
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

    this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);


    this.errorMessage = '';
    this.errorMsg = [];
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
        if(this.isFromCheckAnsPage) {
          this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);
          this.isFromCheckAnsPage = false;
          this.viewStatus = 'checkissuerefundpage';
          this.viewCompStatus = '';
          this.notificationPreview = false;
          return;
        }
        this.viewCompStatus = '';
        this.viewStatus = 'contactDetailsPage';
      }

    } else {
      this.displayRefundReason = this.selectedRefundReason;
      if(this.isFromCheckAnsPage) {
        this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);
        this.isFromCheckAnsPage = false;
        this.viewStatus = 'checkissuerefundpage';
        this.viewCompStatus = '';
        this.notificationPreview = false;
        return;
      }
      if ( this.isFromRefundListPage ) {
        this.paymentLibComponent.isFromRefundStatusPage = true;
        this.refundListReason.emit({reason: this.selectedRefundReason, code: this.refundReason});
      } else {
        this.viewCompStatus = '';
        this.viewStatus = 'contactDetailsPage';
      }

    }
  }

  gotoIssueRefundPage() {
    this.errorMessage = '';
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
    this.isRefundRemission = true;
    this.errorMessage = false;
    this.errorMsg = [];
    this.refundHasError = false;
    this.isReasonEmpty = false;
  }

  gotoIssuePage(isFullyRefund: any){
if(isFullyRefund) {
  this.viewCompStatus = 'issuerefundpage1';
  this.getRefundReasons();
} else {
    [].forEach.call(document.querySelectorAll('input'), function (el) {
      el.classList.remove('inline-error-class');
    });

	  var checkboxs = document.getElementsByTagName('input');
	  this.errorMessage = '';
    this.totalRefundAmount = 0;
    this.errorMsg = [];                                    
			for (var j=0;j<checkboxs.length;j++)
			{
				if(checkboxs[j].checked)
				{
					this.fullRefund = false;
					let quantity: number = +(<HTMLInputElement>document.getElementById('feeVolume_'+checkboxs[j].value)).value;
          let amountToRefund: number = +(<HTMLInputElement>document.getElementById('feeAmount_'+checkboxs[j].value)).value;
					let apportionAmount: number = +(<HTMLInputElement>document.getElementById('feeApportionAmount_'+checkboxs[j].value)).value;
					let calculatedAmount: number = +(<HTMLInputElement>document.getElementById('calculatedAmount_'+checkboxs[j].value)).value; 
         
          if( amountToRefund === apportionAmount) {
            this.fullRefund = true;
          }

          if(amountToRefund === 0){
            this.elementId = 'feeAmount_'+checkboxs[j].value;
            this.errorMsg.push('You need to enter a refund amount');
            this.getErrorClass(this.elementId);
					}

         

          if (quantity === 1)
          {
            if(amountToRefund > 0 && amountToRefund > apportionAmount){
              this.elementId = 'feeAmount_'+checkboxs[j].value;
              this.errorMsg.push('The amount you want to refund is more than the amount paid');
              this.getErrorClass(this.elementId);
            }
          } 

					if(quantity > 1) {

						this.quantityUpdated = +(<HTMLInputElement>document.getElementById('feeVolumeUpdated_'+checkboxs[j].value)).value;

            if(this.quantityUpdated === 0){
              this.elementId = 'feeVolumeUpdated_'+checkboxs[j].value;
              this.errorMsg.push('You need to enter quantity')
              this.getErrorClass(this.elementId);
            }

            if (this.fullRefund && quantity !== this.quantityUpdated) {
              this.elementId = 'feeVolumeUpdated_'+checkboxs[j].value;
              this.errorMsg.push('The quantity you want to refund should be maximun available quantity');
              this.getErrorClass(this.elementId);
            }

            if (!this.fullRefund && this.quantityUpdated > 0 && amountToRefund > 0) {
              this.refundAmtForFeeVolumes = +(<HTMLInputElement>document.getElementById('feeVOl_'+checkboxs[j].value)).innerText;
              this.allowedRefundAmount = this.quantityUpdated * this.refundAmtForFeeVolumes;
              if( this.allowedRefundAmount !== amountToRefund) 
              {
                this.elementId = 'feeAmount_'+checkboxs[j].value;
                this.errorMsg.push('The Amount to Refund should be equal to the product of Fee Amount and quantity');
                this.getErrorClass(this.elementId);
              }
            }

            if(!this.fullRefund && amountToRefund > apportionAmount)
            {
              this.elementId = 'feeAmount_'+checkboxs[j].value;
              this.errorMsg.push('The amount you want to refund is more than the amount paid');
              this.getErrorClass(this.elementId);
            }
	
            if( !this.fullRefund && this.quantityUpdated >0 && this.quantityUpdated > quantity){
              this.elementId = 'feeVolumeUpdated_'+checkboxs[j].value;
              this.errorMsg.push('The quantity you want to refund is more than the available quantity');
              this.getErrorClass(this.elementId);
            }
        }
        //this.remissionForm.value.feesList.find(id=>id=checkboxs[j].value)['refund_amount'] = apportionAmount;
				}
			}

      if(this.errorMsg.length === 0) {
        if (this.isFromCheckAnsPage) {
          this.isFromCheckAnsPage = false;
          this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);
          this.fees = this.remissionForm.value.feesList.filter(value => value.selected===true);
          this.viewStatus = 'checkissuerefundpage'
          this.viewCompStatus = '';
          this.notificationPreview = false;
          return;
        } else if (this.isFromRefundStatusPage){
          var remissionctrls=this.remissionForm.controls;
          this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);
          this.refundListAmount.emit(this.totalRefundAmount.toString());
          this.fees = this.remissionForm.value.feesList.filter(value => value.selected===true);
          this.refundFees.emit(this.fees);
          return;
        }
        this.viewCompStatus = 'issuerefundpage1';
        this.getRefundReasons();
      }
    }
  }

  calAmtToRefund(value,amount,volume, i: any) {
     const volumeFee = amount/volume;
     const amtToRefund = value * volumeFee;
     const formArray = this.remissionForm.controls.feesList as FormArray;
     formArray.at(i).get('refund_amount').setValue(amtToRefund);
    // formArray.at(i).get('volume').setValue(value);
   //  (<HTMLInputElement>document.getElementById('feeAmount_'+i)).value = +amtToRefund;
    //  const formControl = this.remissionForm.controls.feesList['volume'].at(i);
    //  formControl.setValue(value);

  }
  gotoContactDetailsPage(note?: IRefundContactDetails) {
    if (note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.errorMessage = '';
    this.viewCompStatus = '';
    this.viewStatus = 'contactDetailsPage';
    this.isRefundRemission = true;
    this.errorMessage = false;
  }
  
  getRefundReasons(){
  if(this.viewCompStatus === 'issuerefundpage1'){
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
}
   getErrorClass(elementId) {
     if(this.errorMsg.length > 0) {
       const ele = document.getElementById(elementId);
       ele.classList.add('inline-error-class');
     }
      
  }

  changeIssueRefundReason() {
    this.isFromCheckAnsPage = true;
    this.errorMessage = '';
    this.errorMsg = [];
    this.refundHasError = false;
    this.isReasonEmpty = false;
    this.viewCompStatus = 'issuerefundpage1';
    this.viewStatus = '';
    this.isRefundRemission = true;
  }

  confirmIssueRefund(isFullyRefund: any) {
    this.isConfirmationBtnDisabled = true;
    this.errorMessage = '';
    this.errorMsg = [];
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }
    if(isFullyRefund) {
      this.totalRefundAmount = this.payment.amount;
    }
    if(!isFullyRefund) {
      this.fees = this.remissionForm.value.feesList.filter(value => value.selected===true);
    }
    this.fees  = this.fees.map(obj => ({ id: obj.id, 
                                        code: obj.code,
                                        version:obj.version, 
                                        apportion_amount: obj.apportion_amount,
                                        calculated_amount: obj.calculated_amount,
                                        updated_volume: obj.updated_volume ? obj.updated_volume : obj.volume,
                                        refund_amount:obj.refund_amount ? obj.refund_amount : this.totalRefundAmount }));
 
  
    const requestBody = new PostRefundRetroRemission(this.contactDetailsObj, this.fees,this.payment.reference, this.refundReason, 
      this.totalRefundAmount, 'op');
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

  gotoRefundReasonPage () {
    this.viewStatus = '';
    this.viewCompStatus = 'issuerefundpage1';
    
  }

// Retro Refund

  // confirmRetroRefund() {
  //   this.isConfirmationBtnDisabled = true;
  //   this.errorMessage = '';
  //   this.errorMsg = [];
  //   if( this.isRefundRemission) {
  //     this.retroRemission = true;
  //   }

  //   const requestBody = new PostRefundRetroRemission(this.payment.reference,'RR004-Retrospective remission', this.contactDetailsObj);
  //   this.paymentViewService.postRefundsReason(requestBody).subscribe(
  //     response => {
  //         if (JSON.parse(response)) {
  //           this.viewCompStatus  = '';
  //           this.viewStatus = 'retrorefundconfirmationpage';
  //           this.refundReference =JSON.parse(response).refund_reference;
  //           if(JSON.parse(response).refund_amount) {
  //             this.refundAmount = JSON.parse(response).refund_amount;
  //             }
  //         }
  //     },
  //     (error: any) => {
  //       this.errorMessage = error;
  //       this.isConfirmationBtnDisabled = false;
  //     });
  // }

  selectRadioButton(key, value) {
    localStorage.setItem("myradio", key);
    const remissionctrls=this.remissionForm.controls;
    remissionctrls['refundDDReason'].setValue('Select a different reason', {onlySelf: true});
    remissionctrls['reason'].reset();
    this.isRefundReasonsSelected = true;
    this.errorMessage = false;
    this.errorMsg = [];
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
  getContactDetails(obj:IRefundContactDetails, type) {
    this.contactDetailsObj = obj;
    this.viewCompStatus = '';
    this.viewStatus = type;
    this.notificationPreview = false;
  }

  gotoPartialFeeRefundScreen() {

    if (this.isFromRefundStatusPage){
      var remissionctrls=this.remissionForm.controls;
      this.refundListReason.emit({reason: this.displayRefundReason, code: this.refundReason});
      return;
    }
    this.refundHasError = false;
    this.viewCompStatus  = 'issuerefund';
    this.viewStatus = '';
  }

  

  gotoServiceRequestPage(event: any) {
    this.errorMessage ='';
    this.errorMsg = [];
    this.isFromCheckAnsPage = false;
    event.preventDefault();

    if (this.isFromRefundStatusPage){
      var remissionctrls=this.remissionForm.controls;
      this.totalRefundAmount = this.remissionForm.value.feesList.reduce((a, c) => a + c.refund_amount * c.selected, 0);
      this.refundListAmount.emit(this.totalRefundAmount.toString());
      return;
    }
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

  }
  gotoAddressPage(note?: IRefundContactDetails) {
    if (note) {
      this.notification = { contact_details: note, notification_type: note.notification_type };
    }
    this.errorMessage = '';
    this.viewCompStatus = 'addrefundforremission';
    this.viewStatus = '';
    this.isRefundRemission = true;
    this.errorMessage = false;
  }
  gotoRemissionSuccess(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.viewCompStatus = '';
    this.viewStatus = 'retroremissionconfirmationpage';
    this.isRefundRemission = true;
    this.errorMessage = false;
  }

  gotoCasetransationPage() {
    this.OrderslistService.setnavigationPage('casetransactions');
    this.errorMessage = '';
    this.errorMsg = [];
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.VIEW = 'case-transactions';
    this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.resetOrderData();
    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
     partUrl += `&caseType=${this.caseType}`;
    const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(url);
  }

  gotoCasetransationPageCancelBtnClicked(event: Event) {
    event.preventDefault();
    this.errorMsg = [];
    if( this.paymentLibComponent.isFromServiceRequestPage !== undefined && !this.paymentLibComponent.isFromServiceRequestPage) {
      this.OrderslistService.setnavigationPage('casetransactions');
      this.OrderslistService.setisFromServiceRequestPage(false);
      this.paymentLibComponent.VIEW ='case-transactions';
      this.paymentLibComponent.viewName = 'case-transactions';
      this.paymentLibComponent.ISBSENABLE = true;
      this.paymentLibComponent.isRefundStatusView = false;
    this.OrderslistService.setnavigationPage('casetransactions');
    this.OrderslistService.setisFromServiceRequestPage(false);
    this.paymentLibComponent.VIEW ='case-transactions';
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.ISBSENABLE = true;
    this.paymentLibComponent.isRefundStatusView = false;
    this.resetOrderData(); let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
    partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    partUrl += `&caseType=${this.caseType}`;
   const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=${this.paymentLibComponent.TAKEPAYMENT}&selectedOption=${this.option}${partUrl}`;
   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(url);
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
    this.paymentLibComponent.isFromServiceRequestPage = true;
    this.paymentLibComponent.ISBSENABLE = true;
    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
     partUrl += `&caseType=${this.caseType}`;
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

  changeRefundAmount() {  
    this.isFromCheckAnsPage = true;
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
  }

  getFormattedCurrency(currency:number){
    if(currency.toString().includes(".")){
      return currency
    }
     return currency.toString().concat(".00");
  }

  showNotificationPreview(): void {
    this.notificationPreview = true;
  }

  hideNotificationPreview(): void {
    this.notificationPreview = false;
  }

  getTemplateInstructionType(payment: IPayment, paymentReference?: string) {

  if (payment == undefined || payment == null || (paymentReference != undefined && paymentReference != null && payment.reference != paymentReference)) {
      this.paymentViewService.getPaymentDetails(paymentReference).subscribe(
        payment => {
          this.paymentObj = payment;
          return this.notificationService.getNotificationInstructionType(this.paymentObj.channel, this.paymentObj.method);
        },
        (error: any) => {
          return 'Template ABC';
        })
    } else {
      return this.notificationService.getNotificationInstructionType(payment.channel, payment.method);
    }
  }

}
