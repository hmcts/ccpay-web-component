import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { IBSPayments } from '../../interfaces/IBSPayments';
import { UnidentifiedPaymentsRequest } from '../../interfaces/UnidentifiedPaymentsRequest';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
type PaymentLibAlias = PaymentLibComponent;

@Component({
    selector: 'app-mark-unidentified-payment',
    templateUrl: './mark-unidentified-payment.component.html',
    styleUrls: ['./mark-unidentified-payment.component.scss'],
    standalone: false
})
export class MarkUnidentifiedPaymentComponent implements OnInit {
  @Input() caseType: string;
  markPaymentUnidentifiedForm: FormGroup;
  viewStatus: string;
  ccdCaseNumber: string;
  bspaymentdcn: string;
  isInvesticationDetailEmpty: boolean = false;
  investicationDetailHasError: boolean = false;
  investicationDetailMinHasError: boolean = false;
  investicationDetailMaxHasError: boolean = false;
  errorMessage = this.getErrorMessage(false);
  unassignedRecord: IBSPayments;
  siteID: string = null;
  investigationComment: string;
  isConfirmButtondisabled: Boolean = false;
  ccdReference: string = null;
  exceptionReference: string = null;
  isStrategicFixEnable: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private paymentViewService: PaymentViewService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private bulkScaningPaymentService: BulkScaningPaymentService) { }

  ngOnInit() {
    this.viewStatus = 'mainForm';
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.bspaymentdcn = this.paymentLibComponent.bspaymentdcn;
    this.isStrategicFixEnable = this.paymentLibComponent.ISSFENABLE;
    this.getUnassignedPayment();

    this.markPaymentUnidentifiedForm = this.formBuilder.group({
      investicationDetail: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        Validators.pattern('^([a-zA-Z0-9\\s,\\.]*)$')
      ]))
    });
  }
  getUnassignedPayment() {
    this.bulkScaningPaymentService.getBSPaymentsByDCN(this.bspaymentdcn).subscribe(
      unassignedPayments => {
        this.errorMessage = this.getErrorMessage(false);
        this.unassignedRecord = unassignedPayments['data'].payments.filter(payment => {
          return payment && payment.dcn_reference == this.bspaymentdcn;
        })[0];
        this.siteID = unassignedPayments['data'].responsible_service_id;
        const beCcdNumber = unassignedPayments['data'].ccd_reference,
          beExceptionNumber = unassignedPayments['data'].exception_record_reference,
          exceptionReference = beCcdNumber ? beCcdNumber === this.ccdCaseNumber ? null : this.ccdCaseNumber : this.ccdCaseNumber;
        this.ccdReference = beCcdNumber ? beCcdNumber : null;
        this.exceptionReference = beExceptionNumber ? beExceptionNumber : exceptionReference;
      },
      (error: any) => {
        this.errorMessage = this.getErrorMessage(true);
      }
    );
  }
  trimUnderscore(method: string) {
    return this.bulkScaningPaymentService.removeUnwantedString(method, ' ');
  }
  saveAndContinue() {
    this.resetForm([false, false, false, false]);
    const investicationField = this.markPaymentUnidentifiedForm.controls.investicationDetail;
    const formerror = investicationField.errors;
    if (this.markPaymentUnidentifiedForm.dirty && this.markPaymentUnidentifiedForm.valid) {
      this.investigationComment = this.markPaymentUnidentifiedForm.controls.investicationDetail.value;
      this.viewStatus = 'unidentifiedContinueConfirm';
    } else {
      if (investicationField.value == '') {
        this.resetForm([true, false, false, false]);
      }
      if (investicationField.value != '' && investicationField.invalid) {
        this.resetForm([false, true, false, false]);
      }
      if (formerror && formerror.minlength && formerror.minlength.actualLength < 3) {
        this.resetForm([false, false, true, false]);
      }
      if (formerror && formerror.maxlength && formerror.maxlength.actualLength > 255) {
        this.resetForm([false, false, false, true]);
      }
    }
  }
  resetForm(val) {
    this.isInvesticationDetailEmpty = val[0];
    this.investicationDetailHasError = val[1];
    this.investicationDetailMinHasError = val[2];
    this.investicationDetailMaxHasError = val[3];
  }
  confirmPayments() {
    this.isConfirmButtondisabled = true;
    const reason = this.markPaymentUnidentifiedForm.get('investicationDetail').value;

    if (!this.isStrategicFixEnable) {
      let allocatedRequest = {
        allocation_status: 'Unidentified',
        payment_allocation_status: {
          description: '',
          name: 'Unidentified'
        },
        unidentified_reason: reason,
        user_id: this.caseType,
      }
      const postStrategicBody = new AllocatePaymentRequest
        (this.ccdReference, this.unassignedRecord, this.caseType, this.exceptionReference, allocatedRequest);
      this.bulkScaningPaymentService.postBSWoPGStrategic(postStrategicBody).subscribe(
        res => {
          this.errorMessage = this.getErrorMessage(false);
          let response = JSON.parse(res);
          if (response.success) {
            this.gotoCasetransationPage();
          }
        },
        (error: any) => {
          this.errorMessage = this.getErrorMessage(true);
          this.isConfirmButtondisabled = false;
        });
    } else {
      this.bulkScaningPaymentService.patchBSChangeStatus(this.unassignedRecord.dcn_reference, 'PROCESSED').subscribe(
        res1 => {
          this.errorMessage = this.getErrorMessage(false);
          const requestBody = new AllocatePaymentRequest
            (this.ccdReference, this.unassignedRecord, this.siteID, this.exceptionReference)
          this.paymentViewService.postBSPayments(requestBody).subscribe(
            res2 => {
              this.errorMessage = this.getErrorMessage(false);
              const response2 = JSON.parse(res2),
                reqBody = new UnidentifiedPaymentsRequest
                  (response2['data'].payment_group_reference, response2['data'].reference, reason);
              if (response2.success) {
                this.paymentViewService.postBSUnidentifiedPayments(reqBody).subscribe(
                  res3 => {
                    this.errorMessage = this.getErrorMessage(false);
                    const response3 = JSON.parse(res3);
                    if (response3.success) {
                      this.gotoCasetransationPage();
                    }
                  },
                  (error: any) => {
                    this.bulkScaningPaymentService.patchBSChangeStatus(this.unassignedRecord.dcn_reference, 'COMPLETE').subscribe();
                    this.errorMessage = this.getErrorMessage(true);
                    this.isConfirmButtondisabled = false;
                  }
                );
              }
            },
            (error: any) => {
              this.bulkScaningPaymentService.patchBSChangeStatus(this.unassignedRecord.dcn_reference, 'COMPLETE').subscribe();
              this.errorMessage = this.getErrorMessage(true);
              this.isConfirmButtondisabled = false;
            }
          );
        },
        (error: any) => {
          this.errorMessage = this.getErrorMessage(true);
          this.isConfirmButtondisabled = false;
        }
      );
    }
  }
  cancelMarkUnidentifiedPayments(type?: string) {
    if (type && type === 'cancel') {
      if (this.markPaymentUnidentifiedForm.get('investicationDetail').value !== "") {
        this.viewStatus = 'unidentifiedCancelConfirm';
      } else {
        this.gotoCasetransationPage();
      }
    } else {
      this.viewStatus = 'mainForm';
    }
  }

  gotoCasetransationPage() {
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.ISBSENABLE = true;
  }
  getErrorMessage(isErrorExist) {
    return {
      title: "There is a problem with the service",
      body: "Try again later",
      showError: isErrorExist
    };
  }
}
