import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator } from '@angular/forms';
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

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-add-remission',
  templateUrl: './add-remission.component.html',
  styleUrls: ['./add-remission.component.scss']
})
export class AddRemissionComponent implements OnInit {
  @Input() fee: IFee;
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
  @Input() orderStatus: string;
  @Input() paidAmount: any;
  @Input() isFromRefundListPage: boolean;
  @Output() cancelRemission: EventEmitter<void> = new EventEmitter();
  @Output() refundListReason: EventEmitter<string> = new EventEmitter();
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
  refundReasons: any[] = [];
  commonRefundReasons: any[] = [];
  showReasonText: boolean;
  isRefundReasonsSelected: boolean;
  // refundReasons:IRefundReasons[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent,
    private refundService: RefundsService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {


    if(this.remission) {
      this.cd.detectChanges();
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

    if(this.viewCompStatus === 'issuerefund'){
      this.refundService.getRefundReasons().subscribe(
        refundReasons => {
          this.refundReasons = refundReasons['data'].filter((data) => data.recently_used === false);
          this.cd.detectChanges();
          this.commonRefundReasons = refundReasons['data'].filter((data) => data.recently_used === true);
          this.cd.detectChanges();
        } );
      }

      // this.refundService.getUserDetails().subscribe(
      //   userdetail => {
      //     console.log(userdetail);
      //     console.log(userdetail['data']);
      //   } );
    this.paymentLibComponent.CCD_CASE_NUMBER
  }

  addRemission() {

    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value;
      this.remissionForm.controls['refundReason'].setErrors(null);
      this.remissionForm.controls['amount'].setErrors(null);
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
    this.resetRemissionForm([false, false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount >= remissionctrls.amount.value;
      this.remissionForm.controls['refundReason'].setErrors(null);
      this.remissionForm.controls['amount'].setErrors(null);
    if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
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
      if(remissionctrls.amount.valid && !isRemissionLessThanFee){
        this.resetRemissionForm([false, false, false, false, true], 'amount');
      }

    }
  }

  gotoAddRetroRemissionCodePage() {
    this.viewStatus = '';
    this.selectedValue = 'yes';
    this.viewCompStatus = "addremission";
    this.isRefundRemission = true;
    this.errorMessage = '';
  }

  gotoCheckRetroRemissionPage(payment: IPayment) {
    this.errorMessage = '';
    this.resetRemissionForm([false, false, false, false, false], 'All');
    var remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount >= remissionctrls.amount.value;
    if (this.remissionForm.dirty ) {
      if(remissionctrls['amount'].value == '' ) {
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
  }

  gotoProcessRetroRemissionPage() {
    this.viewStatus = '';
    this.viewCompStatus = 'addremission';
    this.isRefundRemission = true;
    this.errorMessage = '';
  }

  confirmRetroRemission() {
    this.isConfirmationBtnDisabled = true;
    this.retroRemission = true;
    this.remissionamt = this.remissionForm.controls.amount.value;

    // if(this.remessionPayment.status === 'Success') {
    //   if(this.fee.calculated_amount.toString() === this.remissionForm.controls.amount.value) {
    //     this.remissionamt =this.remissionForm.controls.amount.value
    //   }
    //   else
    //   {
    //     this.remissionamt = this.fee.calculated_amount - this.remissionForm.controls.amount.value;
    //   }

    // } else {
    //   this.remissionamt = this.remissionForm.controls.amount.value;
    // }
    const requestBody = new AddRetroRemissionRequest(this.remissionamt,this.remissionForm.controls.remissionCode.value )
    this.paymentViewService.postPaymentGroupWithRetroRemissions(decodeURIComponent(this.paymentGroupRef).trim(), this.fee.id, requestBody).subscribe(
      response => {
        if (JSON.parse(response)) {
          this.isRemissionApplied = true;
          this.viewCompStatus  = '';
          this.viewStatus = 'retroremissionconfirmationpage';
          this.remissionReference =JSON.parse(response).remission_reference;
          //if (this.retroRemission) {
          //   } else {
          //   let LDUrl = this.isTurnOff ? '&isTurnOff=Enable' : '&isTurnOff=Disable'
          //     LDUrl += `&caseType=${this.caseType}`
          //     LDUrl += this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable'
          //     LDUrl += this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable'
          //     if (this.paymentLibComponent.bspaymentdcn) {
          //       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          //       this.router.onSameUrlNavigation = 'reload';
          //       this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}?view=fee-summary&selectedOption=${this.option}&paymentGroupRef=${this.paymentGroupRef}&dcn=${this.paymentLibComponent.bspaymentdcn}${LDUrl}`);

          //     }else {
          //       this.gotoCasetransationPage();
          //     }
          // }

        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
        this.cd.detectChanges();
      }
    );
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
    this.errorMessage = '';
    this.refundReason = this.remissionForm.controls['refundReason'].value;
    if(!this.refundReason) {
      this.refundHasError = true;
    } else if(this.selectedRefundReason.includes('Other') && (this.remissionForm.controls['reason'].value == '' || this.remissionForm.controls['reason'].value == null)) {
        this.resetRemissionForm([false, false, false, true, false, true], 'reason');
    } else if (this.selectedRefundReason.includes('Other') && this.remissionForm.controls['reason'].value !== '') {
      this.refundHasError = false;
      this.refundReason +=  '-' + this.remissionForm.controls['reason'].value;
      this.selectedRefundReason = this.remissionForm.controls['reason'].value;
      if ( this.isFromRefundListPage ) {
        this.refundListReason.emit(this.selectedRefundReason);
      } else {
        this.viewCompStatus = '';
        this.viewStatus = 'checkissuerefundpage';
      }

    } else {
      if ( this.isFromRefundListPage ) {
        this.refundListReason.emit(this.selectedRefundReason);
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
  }

  changeIssueRefundReason() {
   // this.remissionForm.controls['refundReason'].setValue('Duplicate payment');
   this.errorMessage = '';
    this.refundHasError = false;
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
    // const requestBody = new IssueRefundRequest(this.payment.reference,'RR004-Retro remission',this.payment.amount);

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
    // const remissionctrls=this.remissionForm.controls;
    // remissionctrls['refundReason'].reset();
    this.isRefundReasonsSelected = true;
    this.showReasonText = false;
    this.refundHasError = false;
    this.selectedRefundReason = key;
    if(this.selectedRefundReason.includes('Other')) {
      this.showReasonText = true;
      this.refundHasError = false;
      this.refundReason = key;
    }
  }

  getFormattedCurrency(currency:number){
    if(currency.toString().includes(".")){
      return currency
    }
     return currency.toString().concat(".00");
  }

  selectchange(args) {
    // const remissionctrls=this.remissionForm.controls;
    // remissionctrls['refundReason'].reset();
    this.isRefundReasonsSelected = false;
    this.showReasonText = false;
    this.refundHasError = false;
    this.selectedRefundReason = args.target.options[args.target.options.selectedIndex].id;
    if(this.selectedRefundReason.includes('Other')) {
      this.showReasonText = true;
      this.refundHasError = false;
      this.refundReason = args.target.options[args.target.options.selectedIndex].id;
    }


  }


  
  gotoPaymentDetailsPage(){
    this.errorMessage = '';
    this.viewStatus = 'main'
    console.log("GO TO PAY HIST");
    this.paymentLibComponent.viewName = 'payment-view';
    this.paymentLibComponent.TAKEPAYMENT = false;
    this.paymentLibComponent.ISTURNOFF = this.isTurnOff;
    this.paymentLibComponent.ISNEWPCIPALOFF = this.isNewPcipalOff;
    this.paymentLibComponent.ISOLDPCIPALOFF = this.isOldPcipalOff;
    console.log(this.paymentLibComponent)

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
     partUrl += '&prev=true'

    const url = `/payment-history/${this.ccdCaseNumber}?&selectedOption=${this.option}${partUrl}`;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(url);
  }

  gotoCasetransationPage() {
    this.errorMessage = '';
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

  // continueRemission(){
  //   this.resetRemissionForm([false, false, false, false, false], 'All');
  //   const remissionctrls=this.remissionForm.controls,
  //     isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value;
  //   if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
  //     this.viewCompStatus = '';
  //     this.viewStatus = "processretroremissonpage";
  //   }else {

  //     if(remissionctrls['remissionCode'].value == '' ) {
  //       this.resetRemissionForm([true, false, false, false, false], 'remissionCode');
  //     }
  //     if(remissionctrls['remissionCode'].value != '' && remissionctrls['remissionCode'].invalid ) {
  //       this.resetRemissionForm([false, true, false, false, false], 'remissionCode');
  //     }
  //     if(remissionctrls['amount'].value == '' ) {
  //       this.resetRemissionForm([false, false, true, false, false], 'amount');
  //     }
  //     if(remissionctrls['amount'].value != '' && remissionctrls['amount'].invalid ) {
  //       this.resetRemissionForm([false, true, false, true, false], 'amount');
  //     }
  //     if(remissionctrls['reason'].value == '') {
  //       this.resetRemissionForm([false, false, false, true, false, true], 'reason');
  //     }
  //     if(remissionctrls.amount.valid && !isRemissionLessThanFee){
  //       this.resetRemissionForm([false, false, false, false, true], 'amount');
  //     }

  //   }

  // }

}
