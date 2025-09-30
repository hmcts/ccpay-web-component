import {Component, Inject, Input, OnInit} from '@angular/core';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import {PaymentViewService} from '../../services/payment-view/payment-view.service';
import {BulkScaningPaymentService} from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import {IRemission} from '../../interfaces/IRemission';
import {IFee} from '../../interfaces/IFee';
import {PaymentToPayhubRequest} from '../../interfaces/PaymentToPayhubRequest';
import {PayhubAntennaRequest} from '../../interfaces/PayhubAntennaRequest';
import {SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {OrderslistService} from '../../services/orderslist.service';
import type { PaymentLibComponent } from '../../payment-lib.component';


type PaymentLibAlias = PaymentLibComponent;


const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';
const ANTENNA_VALUE = 'Antenna';
const KERV_VALUE = 'Kerv';

@Component({
    selector: 'ccpay-fee-summary',
    templateUrl: './fee-summary.component.html',
    styleUrls: ['./fee-summary.component.scss'],
    standalone: false
})

export class FeeSummaryComponent implements OnInit {

  @Input() paymentGroupRef: string;
  @Input() ccdCaseNumber: string;
  @Input() isTurnOff: string;
  @Input() caseType: string;
  @Input() telephonySelectionEnable: boolean;


  paymentMethod: string;
  bsPaymentDcnNumber: string;
  paymentGroup: IPaymentGroup;
  errorMessage: string;
  viewStatus = 'main';
  currentFee: IFee;
  totalFee: number;
  payhubHtml: SafeHtml;
  service: string = "";
  platForm: string = "";
  upPaymentErrorMessage: string;
  selectedOption: string;
  isBackButtonEnable: boolean = true;
  outStandingAmount: number;
  isFeeAmountZero: boolean = false;
  totalAfterRemission: number = 0;
  isConfirmationBtnDisabled: boolean = false;
  isRemoveBtnDisabled: boolean = false;
  isPaymentExist: boolean = false;
  isRemissionsExist: Boolean = false;
  isRemissionsMatch = false;
  isStrategicFixEnable: boolean;

  constructor(
    private router: Router,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    private location: Location,
    private paymentViewService: PaymentViewService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private OrderslistService: OrderslistService
  ) { }

  ngOnInit() {
    this.viewStatus = 'main';
    this.caseType = this.paymentLibComponent.CASETYPE;
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION.toLocaleLowerCase();
    this.isStrategicFixEnable = this.paymentLibComponent.ISSFENABLE;
    this.OrderslistService.setCaseType(this.paymentLibComponent.CASETYPE);
    this.isTelephonySelectionEnableNull();


    this.platForm = 'Antenna';

    this.paymentViewService.getBSfeature().subscribe(
      features => {
        let result = JSON.parse(features).filter(feature => feature.uid === BS_ENABLE_FLAG);
        this.paymentLibComponent.ISBSENABLE = result[0] ? result[0].enable : false;
      },
      err => {
        this.paymentLibComponent.ISBSENABLE = false;
      }
    );
    if (this.bsPaymentDcnNumber) {
      this.getUnassignedPaymentlist();
    }
    this.getPaymentGroup();
  }

  getUnassignedPaymentlist() {
    if (this.selectedOption === 'dcn') {
      this.bulkScaningPaymentService.getBSPaymentsByDCN(this.paymentLibComponent.DCN_NUMBER).subscribe(
        unassignedPayments => {
          if (unassignedPayments['data'].payments) {
            this.service = unassignedPayments['data'].responsible_service_id;
          } else {
            this.upPaymentErrorMessage = 'error';
          }
        },
        (error: any) => this.upPaymentErrorMessage = error
      );
    } else {
      this.bulkScaningPaymentService.getBSPaymentsByCCD(this.ccdCaseNumber).subscribe(
        unassignedPayments => {
          if (unassignedPayments['data'].payments) {
            this.service = unassignedPayments['data'].responsible_service_id;
          } else {
            this.upPaymentErrorMessage = 'error';
          }
        },
        (error: any) => this.upPaymentErrorMessage = error
      );
    }

  }

  getRemissionByFeeCode(feeCode: string): IRemission {
    if (this.paymentGroup && this.paymentGroup.remissions && this.paymentGroup.remissions.length > 0) {
      for (const remission of this.paymentGroup.remissions) {
        if (remission.fee_code === feeCode) {
          return remission;
        }
      }
    }
    return null;
  }

  addRemission(fee: IFee) {
    this.currentFee = fee;
    this.viewStatus = 'add_remission';
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
            this.totalAfterRemission = this.totalAfterRemission + fee.net_amount;
            if (fee.calculated_amount === 0) {
              this.isFeeAmountZero = true;
            }
            if (paymentGroup.remissions) {
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
            } else {
              fees.push(fee);
            }
          });
          paymentGroup.fees = fees;
        }

        this.outStandingAmount = this.bulkScaningPaymentService.calculateOutStandingAmount(paymentGroup);
      },
      (error: any) => this.errorMessage = error.replace(/"/g, "")
    );
  }

  confirmRemoveFee(fee: IFee) {
    this.isRemoveBtnDisabled = false;
    this.currentFee = fee;
    this.viewStatus = 'feeRemovalConfirmation';
  }

  removeFee(fee: any) {
    this.isRemoveBtnDisabled = true;
    this.paymentViewService.deleteFeeFromPaymentGroup(fee).subscribe(
      (success: any) => {
        if (this.paymentGroup.fees && this.paymentGroup.fees.length > 1) {
          this.totalAfterRemission = 0;
          this.getPaymentGroup();
          this.viewStatus = 'main';
          return;
        }
        this.loadCaseTransactionPage();
      },
      (error: any) => {
        this.errorMessage = error;
        this.isRemoveBtnDisabled = false;
      }
    );
  }

  loadCaseTransactionPage() {
    this.paymentLibComponent.TAKEPAYMENT = true;
    this.paymentLibComponent.viewName = 'case-transactions';
    this.paymentViewService.getBSfeature().subscribe(
      features => {
        let result = JSON.parse(features).filter(feature => feature.uid === BS_ENABLE_FLAG);
        this.paymentLibComponent.ISBSENABLE = result[0] ? result[0].enable : false;
      },
      err => {
        this.paymentLibComponent.ISBSENABLE = false;
      }
    );

    let partUrl = `selectedOption=${this.paymentLibComponent.SELECTED_OPTION}`;
    partUrl += this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
    partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    partUrl += this.paymentLibComponent.ISSFENABLE ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;

    let url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&${partUrl}`;
    this.router.navigateByUrl(url);
  }
  cancelRemission() {
    this.viewStatus = 'main';
  }
  redirectToFeeSearchPage(event: any, page?: string) {
    event.preventDefault();
    let partUrl = this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
    partUrl += this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    partUrl += this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
    partUrl += this.paymentLibComponent.ISSFENABLE ? '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    partUrl += `&caseType=${this.paymentLibComponent.CASETYPE}`;

    if (this.viewStatus === 'feeRemovalConfirmation' || this.viewStatus === 'add_remission') {
      this.viewStatus = 'main';
      return;
    }
    let url = `/fee-search?ccdCaseNumber=${this.ccdCaseNumber}&selectedOption=${this.paymentLibComponent.SELECTED_OPTION}&paymentGroupRef=${this.paymentGroupRef}${partUrl}`;
    this.router.navigateByUrl(url);
  }
  takePayment() {
    this.isConfirmationBtnDisabled = true;
    const requestBody = new PaymentToPayhubRequest(this.ccdCaseNumber, this.outStandingAmount, this.caseType, this.paymentMethod),
      antennaReqBody = new PayhubAntennaRequest(this.ccdCaseNumber, this.outStandingAmount, this.caseType, this.paymentMethod);

    if (this.platForm === 'Antenna') {

      this.paymentViewService.postPaymentAntennaToPayHub(antennaReqBody, this.paymentGroupRef).subscribe(
        response => {
          this.isBackButtonEnable = false;
          window.location.href = '/makePaymentByTelephoneyProvider';
        },
        (error: any) => {
          this.errorMessage = error;
          this.isConfirmationBtnDisabled = false;
          this.router.navigateByUrl('/pci-pal-failure');
        }
      );
    }
  }

  goToAllocatePage(outStandingAmount: number, isFeeAmountZero: Boolean) {
    if (outStandingAmount > 0 || (outStandingAmount === 0 && isFeeAmountZero)) {
      this.paymentLibComponent.paymentGroupReference = this.paymentGroupRef;
      this.paymentLibComponent.viewName = 'allocate-payments';
    } else {
      this.loadCaseTransactionPage();
    }
  }
  isCheckAmountdueExist(amountDue: any) {
    return typeof amountDue === 'undefined';
  }

  getAntennaValue() : string{
    return ANTENNA_VALUE;
  }

  getKervValue() : string{
    return KERV_VALUE;
  }

  getPaymentMethod(): string {
    return this.paymentMethod;
  }

  setPaymentValue(value: string) {
    this.paymentMethod = value;
  }


  isTakePaymentButtonDisabled(): boolean {
    if (this.telephonySelectionEnable){
      return (this.paymentMethod === null || this.paymentMethod === undefined || this.paymentMethod === '');
    }
    return false;
  }

  isTelephonySelectionEnable() : boolean{
    return  this.telephonySelectionEnable && !this.bsPaymentDcnNumber;
  }

  isTelephonySelectionEnableNull() {
    if (this.telephonySelectionEnable === null || this.telephonySelectionEnable === undefined) {
      this.telephonySelectionEnable = false;
    }
  }
}
