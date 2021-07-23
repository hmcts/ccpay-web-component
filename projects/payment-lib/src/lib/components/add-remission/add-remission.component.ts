import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { IFee } from '../../interfaces/IFee';
import {Router} from '@angular/router';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPayment } from '../../interfaces/IPayment';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-add-remission',
  templateUrl: './add-remission.component.html',
  styleUrls: ['./add-remission.component.scss']
})
export class AddRemissionComponent implements OnInit {
  @Input() fee: IFee;
  @Input() payment: IPayment;
  @Input() ccdCaseNumber: string;
  @Input() caseType: string;
  @Input() viewCompStatus: string;
  @Input() paymentGroupRef: string;
  @Input() isTurnOff: boolean;
  @Input() isRefundRemission: boolean;
  @Input() isOldPcipalOff: boolean;
  @Input() isNewPcipalOff: boolean;
  @Input() isStrategicFixEnable: boolean;
  @Input() orderStatus: string;
  @Input() paidAmount: any;
  @Output() cancelRemission: EventEmitter<void> = new EventEmitter();

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
  remissionReference: string;
  paymentExplanationHasError: boolean = false;
  refundReason:string;
  remessionPayment:IPayment;
  isRemissionCodeEmpty: boolean = false;
  remissionCodeHasError: boolean = false;
  isAmountEmpty: boolean = false;
  isReasonEmpty: boolean = false;
  amountHasError: boolean = false;
  isRemissionLessThanFeeError: boolean = false;
  refundHasError:boolean = false;
  isPaymentSuccess: boolean = false;
  remissionamt:number;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent) { }

  ngOnInit() {
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
      remissionCode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9]{3})-([a-zA-Z0-9]{3})-([a-zA-Z0-9]{3})$')
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]{2})?$')
      ])),
      refundReason: new FormControl('', Validators.compose([Validators.required])),
      reason: new FormControl()
    });
    if(this.viewCompStatus === ''){
    this.viewStatus = 'main';
    }
    this.paymentLibComponent.CCD_CASE_NUMBER
  }

  addRemission() {
    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
      this.remissionForm.controls['refundReason'].setErrors(null);
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

  addRemissionCode() {
    this.resetRemissionForm([false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
    if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
      this.viewStatus = 'applyremissioncode';
      this.viewCompStatus = '';
    }else {

      if(remissionctrls['remissionCode'].value == '' ) {
        this.resetRemissionForm([true, false, false, false, false], 'remissionCode');
      }
      if(remissionctrls['remissionCode'].value != '' && remissionctrls['remissionCode'].invalid ) {
        this.resetRemissionForm([false, true, false, false, false], 'remissionCode');
      }
      if(remissionctrls['remissionCode'].value != '' && remissionctrls['remissionCode'].valid ) {
        this.viewStatus = 'applyremissioncode';
        this.viewCompStatus = '';
      }

    }
  }


  // onSelectionChange(value: string) {
  //   this.selectedValue = value;
  //   this.hasErrors = false;
  // }


  continueRemission(){
    this.resetRemissionForm([false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
    if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
      this.viewCompStatus = '';
      this.viewStatus = "applyremissioncode";
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
      if(remissionctrls.amount.valid && !isRemissionLessThanFee){
        this.resetRemissionForm([false, false, false, false, true], 'amount');
      }
    
    }
 
  }

  resetRemissionForm(val, field){
    if(field==='remissionCode' || field==='All') {
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

  confirmRemission() {
    this.isConfirmationBtnDisabled = true;
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }

    if(this.remessionPayment.status === 'Success') {
      this.remissionamt = this.fee.calculated_amount - this.remissionForm.controls.amount.value;
    } else {
      this.remissionamt = this.remissionForm.controls.amount.value;
    }
    this.remissionamt = this.fee.calculated_amount - this.remissionForm.controls.amount.value;
    const newNetAmount = this.remissionForm.controls.amount.value,
    // remissionAmount = this.fee.calculated_amount - newNetAmount,
     requestBody = new AddRemissionRequest
    (this.ccdCaseNumber, this.fee, this.remissionamt, this.remissionForm.controls.remissionCode.value, this.caseType, this.retroRemission);
    this.paymentViewService.postPaymentGroupWithRemissions(decodeURIComponent(this.paymentGroupRef).trim(), this.fee.id, requestBody).subscribe(
      response => {
        if (JSON.parse(response).success) {

          if (this.retroRemission) {
            this.viewCompStatus  = '';
            this.viewStatus = 'remissionconfirmationpage';
            this.remissionReference =JSON.parse(response).data.remission_reference;

          } else {
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

        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
      }
    );
  }

  confirmRefund() {
    this.isConfirmationBtnDisabled = true;
    if( this.isRefundRemission) {
      this.retroRemission = true;
    }
    this.viewCompStatus  = '';
    this.viewStatus = 'refundconfirmationpage';
  }

  gotoConfirmationPage(payment: IPayment) {
   // if (this.selectedValue == 'No') {
    this.resetRemissionForm([false, false, false, false, false], 'All');
    var remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
    if (this.remissionForm.dirty ) {
      if(remissionctrls['amount'].value == '' ) {
        this.resetRemissionForm([false, false, true, false, false], 'amount');
      } else if(remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid ) {
        this.resetRemissionForm([false, false, false, true, false], 'amount');
      } else if(remissionctrls.amount.valid && !isRemissionLessThanFee){
        this.resetRemissionForm([false, false, false, false, true], 'amount');
      } else {
        this.viewCompStatus = '';
        this.viewStatus = "checkremissionpage";
      }
    }
  // }  else {
  //   this.viewCompStatus = '';
  //   this.viewStatus = "checkremissionpage";
  // }
  }

  gotoremissionPage() {
    this.viewStatus = '';
    this.selectedValue = 'yes';
    this.viewCompStatus = "addremission";
    this.isRefundRemission = true;
  }

  gotoRefundPage() {
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
    this.isRefundRemission = true;
  }

  gotoRefundConfirmation(payment: IPayment) {
    this.refundReason = this.remissionForm.controls['refundReason'].value;
    if(!this.refundReason) {
      this.refundHasError = true;
    } else if(this.refundReason == 'Other' && (this.remissionForm.controls['reason'].value == '' || this.remissionForm.controls['reason'].value == null)) {
        this.resetRemissionForm([false, false, false, true, false, true], 'reason');
    } else if (this.refundReason == 'Other' && this.remissionForm.controls['reason'].value !== '') {
      this.refundHasError = false;
      this.refundReason = this.remissionForm.controls['reason'].value;
      this.viewCompStatus = '';
      this.viewStatus = 'checkrefundpage';
    } else {
    this.viewCompStatus = '';
    this.viewStatus = 'checkrefundpage';
    }
  }

  changeRefundReason() {
    this.remissionForm.controls['refundReason'].setValue('Duplicate payment');
    this.refundHasError = false;
    this.viewCompStatus = 'issuerefund';
    this.viewStatus = '';
    this.isRefundRemission = true;
  }

  selectRadioButton(key, type) {
    this.refundHasError = false;
    this.refundReason = this.remissionForm.controls['refundReason'].value;
    if(key === 'Other') {
      this.refundHasError = false;
      this.refundReason = key;
    }
    // this.isMoreDetailsBoxHide = true;
    // if( type === 'explanation' && key === 'other' ){
    //   this.isPaymentDetailsEmpty = false;
    //   this.isPaymentDetailsInvalid = false;
    //   this.paymentDetailsMinHasError = false;
    //   this.paymentDetailsMaxHasError = false;
    //   this.isMoreDetailsBoxHide = false;
    // }
  }

  cancelRefundRemission() {
    this.viewCompStatus = '';
    this.selectedValue = 'yes';
    this.viewStatus = "applyremissioncode";
  }

  gotoCasetransationPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    this.paymentLibComponent.ISNEWPCIPALOFF = this.isNewPcipalOff;
    this.paymentLibComponent.ISOLDPCIPALOFF = this.isOldPcipalOff;

    this.paymentViewService.getBSfeature().subscribe(
      features => {
        let result = JSON.parse(features).filter(feature => feature.uid === BS_ENABLE_FLAG);
        this.paymentLibComponent.ISBSENABLE = result[0] ? result[0].enable : false;
      },
      err => {
        this.paymentLibComponent.ISBSENABLE = false;
      }
    );

    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
     partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
     partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
     partUrl += this.isStrategicFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
     partUrl += `&caseType=${this.caseType}`;
     partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
     partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';

    const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&selectedOption=${this.option}${partUrl}`;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(url);
  }

}
