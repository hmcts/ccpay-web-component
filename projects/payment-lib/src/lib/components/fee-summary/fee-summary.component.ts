import { Component, OnInit, Input } from '@angular/core';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IRemission } from '../../interfaces/IRemission';
import { IFee } from '../../interfaces/IFee';
import { PaymentToPayhubRequest } from '../../interfaces/PaymentToPayhubRequest';
import { PayhubAntennaRequest } from '../../interfaces/PayhubAntennaRequest';
import { SafeHtml } from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

const BS_ENABLE_FLAG = 'bulk-scan-enabling-fe';

@Component({
  selector: 'ccpay-fee-summary',
  templateUrl: './fee-summary.component.html',
  styleUrls: ['./fee-summary.component.scss']
})

export class FeeSummaryComponent implements OnInit {
  @Input() paymentGroupRef: string;
  @Input() ccdCaseNumber: string;
  @Input() isTurnOff: string;
  @Input() isOldPcipalOff: string;
  @Input() isNewPcipalOff: string;


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
  selectedOption:string;
  isBackButtonEnable: boolean = true;
  outStandingAmount: number;
  isFeeAmountZero: boolean = false;;
  totalAfterRemission: number = 0;
  isConfirmationBtnDisabled: boolean = false;
  isRemoveBtnDisabled: boolean = false;
  isPaymentExist: boolean = false;
  isRemissionsExist: Boolean = false;
  isRemissionsMatch = false;


  constructor(
    private router: Router,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    private location: Location,
    private paymentViewService: PaymentViewService,
    private paymentLibComponent: PaymentLibComponent
  ) {}

  ngOnInit() {
    this.viewStatus = 'main';
    this.bsPaymentDcnNumber = this.paymentLibComponent.bspaymentdcn;
    this.selectedOption = this.paymentLibComponent.SELECTED_OPTION.toLocaleLowerCase();

    if ((!this.isOldPcipalOff && this.isNewPcipalOff)) {
      this.platForm = '8x8';
    } else if ((this.isOldPcipalOff && !this.isNewPcipalOff)) {
      this.platForm = 'Antenna';
    } else if ((this.isOldPcipalOff && this.isNewPcipalOff)){
      this.platForm = '8x8';
    }

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
          if(unassignedPayments['data'].payments) {
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
          if(unassignedPayments['data'].payments) {
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
    if (this.service) {
      this.currentFee = fee;
      this.viewStatus = 'add_remission';
    }
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

  confirmRemoveFee(fee: IFee){
    this.isRemoveBtnDisabled = false;
    this.currentFee = fee;
    this.viewStatus = 'feeRemovalConfirmation';
  }

  removeFee(fee: any){
    this.isRemoveBtnDisabled = true;
    this.paymentViewService.deleteFeeFromPaymentGroup(fee).subscribe(
      (success: any) => {
          if (this.paymentGroup.fees && this.paymentGroup.fees.length > 1){
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
      partUrl +=this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
      partUrl +=this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      partUrl +=this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
      partUrl +=this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
      partUrl +=this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';

    let url = `/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true&${partUrl}`;
    this.router.navigateByUrl(url);
  }
  cancelRemission() {
    this.viewStatus = 'main';
  }
  redirectToFeeSearchPage(event: any, page?: string) {
    event.preventDefault();
    let partUrl =this.bsPaymentDcnNumber ? `&dcn=${this.bsPaymentDcnNumber}` : '';
      partUrl +=this.paymentLibComponent.ISBSENABLE ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      partUrl +=this.paymentLibComponent.ISTURNOFF ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
      partUrl +=this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
      partUrl +=this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';

    if(this.viewStatus === 'feeRemovalConfirmation' || this.viewStatus === 'add_remission') {
      this.viewStatus = 'main';
      return;
    }
    let url = `/fee-search?ccdCaseNumber=${this.ccdCaseNumber}&selectedOption=${this.paymentLibComponent.SELECTED_OPTION}&paymentGroupRef=${this.paymentGroupRef}${partUrl}`;
    this.router.navigateByUrl(url);
  }
  takePayment() {
    this.isConfirmationBtnDisabled = true;
    const seriveName = this.service ==='AA07' ? 'DIVORCE': this.service ==='AA08' ? 'PROBATE' : 'FPL',

      requestBody = new PaymentToPayhubRequest(this.ccdCaseNumber, this.outStandingAmount, this.service, seriveName),
      antennaReqBody = new PayhubAntennaRequest(this.ccdCaseNumber, this.outStandingAmount, this.service, seriveName);

    if(this.platForm === '8x8') {
      this.paymentViewService.postPaymentToPayHub(requestBody, this.paymentGroupRef).subscribe(
        response => {
          this.location.go(`payment-history?view=fee-summary`);
          this.payhubHtml = response;
          this.viewStatus = 'payhub_view';
          this.isBackButtonEnable=false;
        },
        (error: any) => {
          this.errorMessage = error;
          this.isConfirmationBtnDisabled = false;
          this.router.navigateByUrl('/pci-pal-failure');
        }
      );
    } else if(this.platForm === 'Antenna') {

      this.paymentViewService.postPaymentAntennaToPayHub(antennaReqBody, this.paymentGroupRef).subscribe(
        response => {
          this.isBackButtonEnable=false;
          window.location.href = '/pcipalThirdCall';
        },
        (error: any) => {
          this.errorMessage = error;
          this.isConfirmationBtnDisabled = false;
          this.router.navigateByUrl('/pci-pal-failure');
        }
      );
    }

  }

  pcipalFormFinalSubmit(response){
      let form = document.createElement('form');
      form.setAttribute('action', '/');
      form.setAttribute('enctype', 'application/x-www-form-urlencoded; charset=utf-8');
      form.setAttribute('method', 'post');
      form.setAttribute('target', '_self');
      let xBearerToken = document.createElement('input');
      xBearerToken.setAttribute('type', 'hidden');
      xBearerToken.setAttribute('name', 'X-BEARER-TOKEN');
      let xRefreshToken = document.createElement('input');
      xRefreshToken.setAttribute('type', 'hidden');
      xRefreshToken.setAttribute('name', 'X-REFRESH-TOKEN');
      form.appendChild(xBearerToken);
      form.appendChild(xRefreshToken);
      document.body.appendChild(form);
      form.submit();
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
}
