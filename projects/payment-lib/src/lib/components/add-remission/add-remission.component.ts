import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IFee } from '../../interfaces/IFee';
import {Router} from '@angular/router';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-add-remission',
  templateUrl: './add-remission.component.html',
  styleUrls: ['./add-remission.component.scss']
})
export class AddRemissionComponent implements OnInit {
  @Input() fee: IFee;
  @Input() ccdCaseNumber: string;
  @Input() service: string;
  @Input() paymentGroupRef: string;
  @Input() isTurnOff: boolean;
  @Input() isOldPcipalOff: boolean;
  @Input() isNewPcipalOff: boolean;
  @Input() isStrategicFixEnable: boolean;
  @Output() cancelRemission: EventEmitter<void> = new EventEmitter();

  remissionForm: FormGroup;
  hasErrors = false;
  viewStatus = 'main';
  errorMessage = null;
  option: string = null;
  isConfirmationBtnDisabled: boolean = false;
  bsPaymentDcnNumber: string;

  isRemissionCodeEmpty: boolean = false;
  remissionCodeHasError: boolean = false;
  isAmountEmpty: boolean = false;
  amountHasError: boolean = false;
  isRemissionLessThanFeeError: boolean = false;
  totalAfterRemission: number;
  isFeeAmountZero: boolean;
  isRemissionsMatch: boolean;
  outStandingAmount: number;
  paymentGroup: IPaymentGroup;
  isPaymentExist: boolean;
  isRemissionsExist: boolean;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent,
    private bulkScaningPaymentService: BulkScaningPaymentService) { }

  ngOnInit() {
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
      ]))
    });
    this.viewStatus = 'main';
  }

  addRemission() {
    this.resetRemissionForm([false, false, false, false, false], 'All');
    const remissionctrls=this.remissionForm.controls,
      isRemissionLessThanFee = this.fee.calculated_amount > remissionctrls.amount.value; 
    if (this.remissionForm.dirty && this.remissionForm.valid && isRemissionLessThanFee) {
      this.viewStatus = 'confirmation';
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
    }
  }

  confirmRemission() {
    this.isConfirmationBtnDisabled = true;
    const newNetAmount = this.remissionForm.controls.amount.value,
     remissionAmount = this.fee.net_amount - newNetAmount,
     requestBody = new AddRemissionRequest
    (this.ccdCaseNumber, this.fee, remissionAmount, this.remissionForm.controls.remissionCode.value, this.service);
    this.paymentViewService.postPaymentGroupWithRemissions(decodeURIComponent(this.paymentGroupRef).trim(), this.fee.id, requestBody).subscribe(
      response => {
        if (JSON.parse(response).success) {
          let LDUrl = this.isTurnOff ? '&isTurnOff=Enable' : '&isTurnOff=Disable'
            LDUrl += this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable'
            LDUrl += this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable'
          if (this.paymentLibComponent.bspaymentdcn) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}?view=fee-summary&selectedOption=${this.option}&paymentGroupRef=${this.paymentGroupRef}&dcn=${this.paymentLibComponent.bspaymentdcn}${LDUrl}`);
          }else {
            // this.getPaymentGroup();
            // // this.gotoCasetransationPage();
            // console.log("Santosh"+this.outStandingAmount);
            // if(this.outStandingAmount === 0)
            // {
            //   this.gotoCasetransationPage();
            // }
            this.gotoSummaryPage();
          }

        }
      },
      (error: any) => {
        this.errorMessage = error;
        this.isConfirmationBtnDisabled = false;
      }
    );
  }

  gotoSummaryPage() {
    this.getPaymentGroup();
    if(this.outStandingAmount === 0) {
      this.gotoCasetransationPage();
    }
    this.paymentLibComponent.viewName = 'fee-summary';
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
  

    const url = `/payment-history/${this.ccdCaseNumber}?view=fee-summary&paymentGroupRef=${this.paymentGroupRef}&selectedOption=${this.option}${partUrl}`;
    this.router.navigateByUrl(url).then(() => {
      window.location.reload();
    });
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
     partUrl += this.paymentLibComponent.ISNEWPCIPALOFF ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
     partUrl += this.paymentLibComponent.ISOLDPCIPALOFF ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';

    const url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&selectedOption=${this.option}${partUrl}`;
    this.router.navigateByUrl(url);
  }

  getPaymentGroup() {
    let fees = [];
    this.paymentViewService.getPaymentGroupDetails(this.paymentGroupRef).subscribe(
      paymentGroup => {
        this.paymentGroup = paymentGroup;
        this.isPaymentExist = paymentGroup.payments ? paymentGroup.payments.length > 0 : false;
        this.isRemissionsExist = paymentGroup.remissions ? paymentGroup.remissions.length > 0 : false;

        if (paymentGroup.fees) {
          paymentGroup.fees.forEach(fee => {
              this.totalAfterRemission  = this.totalAfterRemission  + fee.net_amount;
              if(fee.calculated_amount === 0) {
                this.isFeeAmountZero = true;
              }
              this.isRemissionsMatch = false;
              paymentGroup.remissions.forEach(rem => {
                if(rem.fee_code === fee.code) {
                  this.isRemissionsMatch = true;
                  fee['remissions'] = rem;
                  fees.push(fee);
                }
              });
    
              if(!this.isRemissionsMatch) {
                fees.push(fee);
              }
          });
          paymentGroup.fees = fees;
        }

        this.outStandingAmount = this.bulkScaningPaymentService.calculateOutStandingAmount(paymentGroup);
      },
      (error: any) => this.errorMessage = error
    );
  }
}
