import {Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {RefundsService} from '../../services/refunds/refunds.service';
import { IRefundAction } from '../../interfaces/IRefundAction';
import { IRefundList } from '../../interfaces/IRefundList';
import { IRefundRejectReason } from '../../interfaces/IRefundRejectReason';
import { OrderslistService } from '../../services/orderslist.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'ccpay-process-refund',
  templateUrl: './process-refund.component.html',
  styleUrls: ['./process-refund.component.css']
})
export class ProcessRefundComponent implements OnInit {
  @Input() refundReference: string;
  @Input() refundlistsource: IRefundList;

  processRefundForm: FormGroup;

  errorMessage =  this.getErrorMessage(false, '', '', '');
  sendmeback: string = null;
  viewStatus: string;
  refundActionList: IRefundAction[] = []; 
  refundRejectReasonList: IRefundRejectReason[] = []; 
  isSendMeBackClicked: boolean = false;
  isRejectClicked: boolean = false;
  isOtherClicked: boolean = false;
  isSuccesspageEnable: boolean = false;

  refundActionsHasError: boolean = false;
  refundRejectReasonHasError: boolean = false;
  isReasonFieldEmpty: boolean = false;
  isReasonFieldInvalid: boolean = false;
  reasonFieldMinHasError: boolean = false;
  reasonFieldMaxHasError: boolean = false;
  isReasonEmpty: boolean = false;
  isReasonInvalid: boolean = false;
  successMsg: string = null;
  navigationpage: string;
  ccdCaseNumber: string;
  isFromRefundListPage: boolean;

  isConfirmButtondisabled: boolean = true;
  constructor(private RefundsService: RefundsService,
              private formBuilder: FormBuilder,
              private OrderslistService: OrderslistService,
              private paymentLibComponent: PaymentLibComponent,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.viewStatus = 'RefundProcess';
    this.RefundsService.getRefundActions(this.refundReference).subscribe(
      refundActionList => {
        this.refundActionList = <any>refundActionList;
      },
      err => {
        this.errorMessage = this.getErrorMessage(true, err.statusCode, err.err, err);
      }
    );
    this.processRefundForm = this.formBuilder.group({
      refundActionField: new FormControl('', Validators.compose([
        Validators.required
      ])),
      refundRejectReasonField: new FormControl('', Validators.compose([
        Validators.required
      ])),
      sendMeBackField: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        Validators.pattern('^([a-zA-Z0-9\\s,\\.]*)$'),

      ])),
      enterReasonField: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('^([a-zA-Z0-9.\\s]*)$'),
      ])),
    });
   this.ccdCaseNumber = this.refundlistsource.ccd_case_number;

   if((typeof this.paymentLibComponent.TAKEPAYMENT === 'string' && this.paymentLibComponent.TAKEPAYMENT === 'false') || (typeof this.paymentLibComponent.TAKEPAYMENT === 'boolean' && !this.paymentLibComponent.TAKEPAYMENT) ) {
    this.isFromRefundListPage = true;
   }
  }
  checkRefundActions(code: string) {
    this.refundActionsHasError = false;
    this.isReasonFieldEmpty = false;
    this.isReasonEmpty = false;
    this.isReasonInvalid = false;
    this.refundRejectReasonHasError = false;
    if(code === 'Return to caseworker') {
      this.isConfirmButtondisabled = true;
      this.isSendMeBackClicked = true;
      this.isRejectClicked = false;
      this.isOtherClicked = false;

    } else if (code === 'Approve') {
      this.isSendMeBackClicked = false;
      this.isConfirmButtondisabled = false;
      this.isRejectClicked = false;
      this.isOtherClicked = false;

    } else if (code === 'Reject') {
      this.isRejectClicked = true;
      this.isSendMeBackClicked = false;
      this.isOtherClicked = false;
      this.RefundsService.getRefundRejectReasons().subscribe(
        refundRejectReasonList => {
          this.refundRejectReasonList = <any>refundRejectReasonList;
        },
        err => {
          this.errorMessage = this.getErrorMessage(true, err.statusCode, err.err, err);
        }
      );
    } else if (code === 'RE005') {
      this.isOtherClicked = true;
    } else if (code !== 'RE005') {
      this.isOtherClicked = false;
    }
  }
  processRefundSubmit() {
    let processRefundRequest;
    let status;
    this.resetForm([false, false, false, false, false, false, false, false], 'all');
    const controls = this.processRefundForm.controls;
    const processFormError = controls.sendMeBackField.errors;

    if (this.processRefundForm.dirty && controls.refundActionField.valid 
      && (controls.refundActionField.value == 'Approve'
      || (controls.refundActionField.value == 'Reject' && controls.refundRejectReasonField.valid && controls.refundRejectReasonField.value != 'RE005')
      || (controls.refundActionField.value == 'Reject' && controls.refundRejectReasonField.value == 'RE005' && controls.enterReasonField.valid)
      || (controls.refundActionField.value == 'Return to caseworker' && controls.sendMeBackField.valid))) {
      if (controls.refundActionField.value === 'Approve'){
        status = 'APPROVE';
        processRefundRequest = {
          code:'',
          reason: ''
        };
      } else if (controls.refundActionField.value === 'Reject') {
        status = 'REJECT';

        processRefundRequest = {
          code: controls.refundRejectReasonField.value ? controls.refundRejectReasonField.value : '',
          reason: controls.refundRejectReasonField.value == 'RE005' ? controls.enterReasonField.value : ''
        };
      } else if (controls.refundActionField.value === 'Return to caseworker') {
        status = 'SENDBACK';

        processRefundRequest = {
          code: '',
          reason: controls.sendMeBackField.value
        };
      }
      this.RefundsService.patchRefundActions(processRefundRequest, this.refundReference, status).subscribe(
        response => {
          this.isSuccesspageEnable = true;
          // this.successMsg = JSON.parse(response)['data'];
          this.successMsg = response.replace(/['"]+/g, '');
        },
        err => {
          this.errorMessage = this.getErrorMessage(true, err.statusCode, err.err, err);
        }
      );
    } else {
      if(controls.refundActionField.value == "") {
        this.resetForm([true, false, false, false, false, false, false, false], 'action');
      }
      if(controls.refundActionField.value == 'Reject' && controls.refundRejectReasonField.value == "") {
        this.resetForm([false, true, false, false, false, false, false, false], 'rejectReason');
      }
      if(controls.refundActionField.value == 'Return to caseworker') {
        if(controls.sendMeBackField.value == '' ) {
          this.resetForm([false, false, true, false, false, false, false, false], 'addAreason');
        }
        if(controls.sendMeBackField.value != '' && controls.sendMeBackField.invalid ) {
          this.resetForm([false, false, false, true, false, false, false, false], 'addAreason');
        }
        if(processFormError && processFormError.minlength && processFormError.minlength.actualLength < 3 ) {
          this.resetForm([false, false, false, false, true, false, false, false], 'addAreason');
        }
        if(processFormError && processFormError.maxlength && processFormError.maxlength.actualLength > 255 ) {
          this.resetForm([false, false, false, false, false, true, false, false], 'addAreason');
        }
      }
      if(controls.refundActionField.value == 'Reject' && controls.refundRejectReasonField.value == 'RE005') {
        if(controls.enterReasonField.value === "") {
          this.resetForm([false, false, false, false, false, false, true, false], 'enterReason');
        }
        if(controls.enterReasonField.value!== "" && controls.enterReasonField.invalid) {
          this.resetForm([false, false, false, false, false, false, false, true], 'enterReason');
        }
      }
    }

  }
  getErrorMessage(isErrorExist, status, errorMsg, err) {
    let bodyTxt = 'Please try again later';
    if (status !== 500) {
      if (errorMsg !== undefined) {
        bodyTxt = errorMsg;
      } else {
        bodyTxt = err;
      }
      
    }
    return {
      title: 'Something went wrong',
      body: bodyTxt,
      showError: isErrorExist
    };
  }
  loadRefundListPage() {
    this.OrderslistService.getnavigationPageValue().subscribe((data) => this.navigationpage = data);
    if (this.navigationpage === 'casetransactions') {
      // window.location.href='/refund-list?takePayment=false&refundlist=true';
      // // this.OrderslistService.setnavigationPage('casetransactions');
      // // this.OrderslistService.setisFromServiceRequestPage(false);
      // // this.paymentLibComponent.VIEW ='case-transactions';
      // // this.paymentLibComponent.viewName = 'case-transactions';
      // // this.paymentLibComponent.ISBSENABLE = true;
      // // this.paymentLibComponent.isRefundStatusView = false;
      this.paymentLibComponent.viewName = 'refundstatuslist';
      this.paymentLibComponent.isRefundStatusView = true;
    } else {
      this.paymentLibComponent.viewName = 'refundstatuslist';
      this.paymentLibComponent.isRefundStatusView = true;
    }
  }
  loadRefundsHomePage() {
    if(typeof this.paymentLibComponent.TAKEPAYMENT === 'string' && this.paymentLibComponent.TAKEPAYMENT === 'false') {
      //window.location.href='/refund-list?takePayment=false&refundlist=true';
      this.paymentLibComponent.viewName = 'refund-list';
     }
     else {
      this.OrderslistService.setnavigationPage('casetransactions');
      this.OrderslistService.setisFromServiceRequestPage(false);
      this.paymentLibComponent.VIEW ='case-transactions';
      this.paymentLibComponent.viewName = 'case-transactions';
      this.paymentLibComponent.ISBSENABLE = true;
      this.paymentLibComponent.isRefundStatusView = false;
     }
  }
 redirecttoRefundListPage() {
   if((typeof this.paymentLibComponent.TAKEPAYMENT === 'string' && this.paymentLibComponent.TAKEPAYMENT === 'false') || (typeof this.paymentLibComponent.TAKEPAYMENT === 'boolean' && !this.paymentLibComponent.TAKEPAYMENT) ) {
   // window.location.href='/refund-list?takePayment=false&refundlist=true';
   this.paymentLibComponent.viewName = 'refund-list';
   }
   else {
    this.loadRefundListPage();
   }
  }
  // loadCaseTransactionPage() {
  //   this.paymentLibComponent.isRefundStatusView = false;
  //   this.paymentLibCo}mponent.TAKEPAYMENT = true;
  //   this.paymentLibComponent.viewName = 'case-transactions';
  //   this.paymentViewService.getBSfeature().subscribe(
  //     features => {
  //       let result = JSON.parse(features).filter(feature => feature.uid === BS_ENABLE_FLAG);
  //       this.paymentLibComponent.ISBSENABLE = result[0] ? result[0].enable : false;
  //     },
  //     err => {
  //       this.paymentLibComponent.ISBSENABLE = false;
  //     }
  //   );

  //   let partUrl = `selectedOption=${this.paymentLibComponent.SELECTED_OPTION}`;
  //   partUrl += this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
  //   partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
  //   partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
  //   partUrl += this.paymentLibComponent.ISSFENABLE ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
  //   partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;
  //   partUrl += this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
  //   partUrl += this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
  //   let url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&${partUrl}`;
  //   this.router.navigateByUrl(url);
  // }

  resetForm(vals, field) {
    if(field==='action' || field==='all') {
      this.refundActionsHasError = vals[0];
    }
    if(field==='rejectReason' || field==='all') {
      this.refundRejectReasonHasError = vals[1];
    }
    if(field==='addAreason' || field==='all') {
      this.isReasonFieldEmpty = vals[2];
      this.isReasonFieldInvalid = vals[3];
      this.reasonFieldMinHasError = vals[4];
      this.reasonFieldMaxHasError = vals[5];
    }
    if(field==='enterReason' || field==='all') {
      this.isReasonEmpty = vals[6];
      this.isReasonInvalid = vals[7];
    }
  }

  goToCaseReview() {
    this.router.navigate([`/cases/case-details/${this.ccdCaseNumber}`], {relativeTo: this.activeRoute});
  }
}
