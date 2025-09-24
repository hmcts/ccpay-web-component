import { Component, OnInit, Output, Input, EventEmitter, Inject } from '@angular/core';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { IBSPayments } from '../../interfaces/IBSPayments';
import { Router } from '@angular/router';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { OrderslistService } from '../../services/orderslist.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ccpay-app-unprocessed-payments',
    templateUrl: './unprocessed-payments.component.html',
    styleUrls: ['./unprocessed-payments.component.scss'],
    imports: [CommonModule]
})
export class UnprocessedPaymentsComponent implements OnInit {

  @Input('FEE_RECORDS_EXISTS') FEE_RECORDS_EXISTS: boolean;
  @Input('PAYMENTREF') PAYMENTREF: string;
  @Input('ISTURNOFF') ISTURNOFF: boolean;
  @Input('IS_BUTTON_ENABLE') IS_BUTTON_ENABLE: boolean;
  @Input('IS_OS_AMT_AVAILABLE') IS_OS_AMT_AVAILABLE: boolean;
  @Input('ISSFENABLE') ISSFENABLE: boolean;
  @Input('PAYMENTSLENGTH') PAYMENTSLENGTH: Number;
  @Input('LEVEL') LEVEL: Number;

  @Output() selectedUnprocessedFeeEvent: EventEmitter<string> = new EventEmitter();
  @Output() getUnprocessedFeeCount: EventEmitter<string> = new EventEmitter();

  viewStatus = 'main';
  unassignedRecordList: IBSPayments;
  upPaymentErrorMessage: string = null;
  ccdCaseNumber: string;
  recordId: string = null;
  isRecordExist: boolean = false;
  dcnNumber: string = null;
  selectedOption: string;
  isUnprocessedRecordSelected: boolean = true;
  isAllocateToExistingFeebtnEnabled: boolean = false;
  isMarkAsUnidentifiedbtnEnabled: boolean = false;
  isAllocatedToNewFeebtnEnabled: boolean = false;
  isExceptionCase: boolean = false;
  serviceId: string = null;
  isBulkScanEnable;
  isTurnOff: boolean = true;
  isStFixEnable;
  unassignedRecordSelectedList: IBSPayments;
  unassignedRecordListLength: number = 0;
  showContent: boolean;

  constructor(private router: Router,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibComponent,
    private paymentViewService: PaymentViewService,
    private OrderslistService: OrderslistService
  ) { }

  ngOnInit() {
    // Todo ...
    this.ccdCaseNumber = this.paymentLibComponent.CCD_CASE_NUMBER;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION.toLocaleLowerCase();
    this.dcnNumber = this.paymentLibComponent.DCN_NUMBER;
    this.isBulkScanEnable = this.paymentLibComponent.ISBSENABLE;
    this.isTurnOff = this.paymentLibComponent.ISTURNOFF;
    this.isStFixEnable = this.paymentLibComponent.ISSFENABLE;
    this.OrderslistService.getFeeExists().subscribe((data) => this.FEE_RECORDS_EXISTS = data);
    this.getUnassignedPaymentlist();

  }

  getUnassignedPaymentlist() {
    if (this.selectedOption === 'dcn') {
      this.bulkScaningPaymentService.getBSPaymentsByDCN(this.dcnNumber).subscribe(
        unassignedPayments => {
          //  unassignedPayments['data'].map(data => data.expandable=false);
          if (unassignedPayments['data'] && unassignedPayments['data'].payments) {
            this.setValuesForUnassignedRecord(unassignedPayments['data']);
          } else if (unassignedPayments['payments']) {
            this.setValuesForUnassignedRecord(unassignedPayments);
          } else {
            this.upPaymentErrorMessage = 'error';
            this.getUnprocessedFeeCount.emit('0');
          }
        },
        (error: any) => {
          this.upPaymentErrorMessage = error;
          this.getUnprocessedFeeCount.emit('0');
        }
      );
    } else {
      this.bulkScaningPaymentService.getBSPaymentsByCCD(this.ccdCaseNumber).subscribe(
        unassignedPayments => {
          //  unassignedPayments['data'].map(data => data.expandable=false);
          if (unassignedPayments['data'] && unassignedPayments['data'].payments) {
            this.setValuesForUnassignedRecord(unassignedPayments['data']);
          } else if (unassignedPayments['payments']) {
            this.setValuesForUnassignedRecord(unassignedPayments);
          } else {
            this.upPaymentErrorMessage = 'error';
            this.getUnprocessedFeeCount.emit('0');
          }
        },
        (error: any) => {
          this.upPaymentErrorMessage = error;
          this.getUnprocessedFeeCount.emit('0');
        }
      );
    }

  }

  setValuesForUnassignedRecord(unassignedPayments) {

    this.unassignedRecordList = unassignedPayments.payments;
    if (this.unassignedRecordList) {
      this.unassignedRecordListLength = unassignedPayments.payments.length
    }
    this.serviceId = unassignedPayments.responsible_service_id;
    if (unassignedPayments['ccd_reference'] === undefined) {
      this.isExceptionCase = true;
    }
    // this.isRecordExist =  this.unassignedRecordList.length === 0;
    this.getUnprocessedFeeCount.emit(<any>this.unassignedRecordList.length);
    this.unprocessedPaymentSelectEvent(this.unassignedRecordList);
  }

  formatUnassignedRecordId(ID: Number) {
    return `unassignrecord-${ID}`;
  }

  trimUnderscore(method: string) {
    return this.bulkScaningPaymentService.removeUnwantedString(method, ' ');
  }

  redirectToFeeSearchPage(event: any, dcn_reference: any) {
    event.preventDefault();
    this.recordId = dcn_reference;
    let url = this.isBulkScanEnable ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    url += this.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    url += this.isStFixEnable ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    url += `&caseType=${this.paymentLibComponent.CASETYPE}`;

    this.router.navigateByUrl(`/fee-search?selectedOption=${this.selectedOption}&ccdCaseNumber=${this.ccdCaseNumber}&dcn=${this.recordId}${url}`);
  }

  loadUnsolicitedPage(viewName: string, dcn_reference: any) {
    this.recordId = dcn_reference;
    this.paymentLibComponent.bspaymentdcn = this.recordId;
    this.paymentLibComponent.viewName = viewName;
  }

  unprocessedPaymentSelectEvent(selectedRecordReference: any) {
    this.isUnprocessedRecordSelected = true;
    this.validateButtons();
    this.selectedUnprocessedFeeEvent.emit(selectedRecordReference);
  }

  resetButtons() {
    this.isUnprocessedRecordSelected = false;
    this.isAllocateToExistingFeebtnEnabled = false;
    this.isMarkAsUnidentifiedbtnEnabled = false;
    this.isAllocatedToNewFeebtnEnabled = false;
  }

  goToAllocatePage(dcn_reference: any) {
    this.paymentLibComponent.bspaymentdcn = dcn_reference;
    this.paymentLibComponent.unProcessedPaymentServiceId = this.serviceId
    this.paymentLibComponent.isTurnOff = this.ISTURNOFF;
    this.paymentLibComponent.ISSFENABLE = this.isStFixEnable;

    if (this.ISTURNOFF) {
      this.paymentLibComponent.paymentGroupReference = this.PAYMENTREF;
      this.paymentLibComponent.viewName = 'fee-summary';
    } else {
      this.paymentLibComponent.paymentGroupReference = null;
      this.paymentLibComponent.viewName = 'allocate-payments';
    }

  }

  validateButtons() {
    setTimeout(() => {
      if (this.isUnprocessedRecordSelected && this.isExceptionCase) {
        this.isMarkAsUnidentifiedbtnEnabled = true;
      } else if (this.isUnprocessedRecordSelected && !this.isExceptionCase && !this.FEE_RECORDS_EXISTS) {
        this.isAllocateToExistingFeebtnEnabled = false;
        this.isAllocatedToNewFeebtnEnabled = true;
      } else if (this.isUnprocessedRecordSelected && !this.isExceptionCase && this.FEE_RECORDS_EXISTS) {
        if (!this.ISTURNOFF) {
          this.isAllocateToExistingFeebtnEnabled = true;
          this.isAllocatedToNewFeebtnEnabled = false;
        } else {
          this.isAllocateToExistingFeebtnEnabled = this.IS_OS_AMT_AVAILABLE;
          this.isAllocatedToNewFeebtnEnabled = true;
        }
      }
    }, 4000);
  }

  unprocessedPaymentUnSelectEvent(event: any) {
    event.preventDefault();
    this.recordId = null;
    this.isUnprocessedRecordSelected = false;
    this.isAllocateToExistingFeebtnEnabled = false;
    this.isAllocatedToNewFeebtnEnabled = false;
    this.isMarkAsUnidentifiedbtnEnabled = false;
    //this.validateButtons();
    this.selectedUnprocessedFeeEvent.emit('');
  }

  showDetailRow(event: any, obj: any, i: any) {
    event.preventDefault();

    this.unassignedRecordSelectedList = obj;

  }
}
