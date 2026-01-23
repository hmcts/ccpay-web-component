import { Component, Input, OnInit, forwardRef, isStandalone, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { formatDate } from "@angular/common";
import type { PaymentLibComponent } from '../../payment-lib.component';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { RefundsService } from '../../services/refunds/refunds.service';
import {XlFileService} from '../../services/xl-file/xl-file.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
type PaymentLibAlias = PaymentLibComponent;

@Component({
    selector: 'ccpay-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: false
})
export class ReportsComponent implements OnInit {
  @Input('ISPAYMENTSTATUSENABLED') ISPAYMENTSTATUSENABLED: boolean = true;
  fmt = 'dd/MM/yyyy';
  loc = 'en-US';
  reportsForm: FormGroup;
  startDate: string;
  endDate: string;
  errorMeaagse: string;
  ccdCaseNumber: string;
  isDownLoadButtondisabled:Boolean = false;
  isStartDateLesthanEndDate: Boolean = false;
  isDateBetwnMonth: Boolean = false;
  isDateRangeBetnWeek: Boolean = false;
  errorMessage = null;
  paymentGroups: IPaymentGroup[] = [];

  constructor(
    private xlFileService: XlFileService,
    private errorHandlerService: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private bulkScaningPaymentService: BulkScaningPaymentService,
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private paymentViewService: PaymentViewService,
    private refundsService: RefundsService) { }

  ngOnInit() {
    this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
    this.fromValidation();
   }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
 }

 getSelectedFromDate(): void {
 this.validateDates(this.reportsForm.get('selectedreport').value);
 }

 validateDates(reportName){
  const selectedStartDate = this.tranformDate(this.reportsForm.get('startDate').value),
    selectedEndDate = this.tranformDate(this.reportsForm.get('endDate').value);
  const isDateRangeMoreThanWeek = (<any>new Date(selectedStartDate) - <any>new Date(selectedEndDate))/(1000 * 3600 * -24) > 7;
  const isDateRangeMoreThanMonth = (<any>new Date(selectedStartDate) - <any>new Date(selectedEndDate))/(1000 * 3600 * -24) > 30;
  if(new Date(selectedStartDate) > new Date(selectedEndDate) && selectedEndDate !== ''){
    this.reportsForm.get('startDate').setValue('');
    this.isDateRangeBetnWeek = false;
    this.isDateBetwnMonth = false;
    this.isStartDateLesthanEndDate = true;
  } else if(reportName && reportName ==='SURPLUS_AND_SHORTFALL' && isDateRangeMoreThanWeek ) {
    this.isDateRangeBetnWeek = true;
    this.isDateBetwnMonth = false;
    this.isStartDateLesthanEndDate = false;
  } else if(reportName && (reportName ==='PAYMENT_FAILURE_EVENT'|| reportName ==="TELEPHONY_PAYMENTS" || reportName ==='REFUNDS') && isDateRangeMoreThanMonth ) {
    this.isDateRangeBetnWeek = false;
    this.isDateBetwnMonth = true;
    this.isStartDateLesthanEndDate = false;
  } else {
    this.isDateBetwnMonth = false;
    this.isDateRangeBetnWeek = false;
    this.isStartDateLesthanEndDate = false;
  }

 }

  fromValidation() {
    this.reportsForm = this.formBuilder.group({
      selectedreport: new FormControl('') ,
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
}

downloadReport(){
  this.isDownLoadButtondisabled = true;
  const dataLossRptDefault = [{loss_resp:'',payment_asset_dcn:'',env_ref:'',env_item:'',resp_service_id:'',resp_service_name:'',date_banked:'',bgc_batch:'',payment_method:'',amount:''}],
    unProcessedRptDefault = [{resp_service_id:'',resp_service_name:'',exception_ref:'',ccd_ref:'',date_banked:'',bgc_batch:'',payment_asset_dcn:'',env_ref:'',env_item:'',payment_method:'',amount:''}],
    processedUnallocated =[{resp_service_id:'',resp_service_name:'',allocation_status:'',receiving_office:'',allocation_reason:'',ccd_exception_ref:'',ccd_case_ref:'',payment_asset_dcn:'',env_ref:'',env_item:'',date_banked:'',bgc_batch:'',payment_method:'',amount:'',updated_by:''}],
    shortFallsRptDefault = [{resp_service_id:'',resp_service_name:'',surplus_shortfall:'',balance:'',payment_amount:'',ccd_case_reference:'',ccd_exception_reference:'',processed_date:'', reason:'', explanation:'', user_name:''}],
    telephonyPaymentsRptDefault = [{service_name:'',ccd_Reference:'',payment_reference:'',fee_code:'',payment_date:'',amount:'', payment_status:''}],
    paymentFailureRptDefault = [{payment_reference:'',ccd_reference:'',document_control_number:'',org_id:'',service_name:'',failure_reference:'',failure_reason:'',disputed_amount:'',event_name:'',event_date:'',representment_status:'',representment_date:'',refund_reference:'',refund_amount:'',refund_date:''}],
    refundsRptDefault = [{date_created:'',date_updated:'',amount:'',RF_reference:'',payment_reference:'',ccd_case_number:'',service_type:'',refund_status:'',refund_status_reason:''}],
    selectedReportName = this.reportsForm.get('selectedreport').value,
    selectedStartDate = this.tranformDate(this.reportsForm.get('startDate').value),
    selectedEndDate = this.tranformDate(this.reportsForm.get('endDate').value);

    if(selectedReportName === 'PROCESSED_UNALLOCATED' || selectedReportName === 'SURPLUS_AND_SHORTFALL' ){
      this.paymentViewService.downloadSelectedReport(selectedReportName,selectedStartDate,selectedEndDate).subscribe(
        response =>  {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          const result = JSON.parse(response);
          let res= {data: this.applyDateFormat(result)};
          if(res['data'].length === 0 && selectedReportName === 'PROCESSED_UNALLOCATED' ){
            res.data= processedUnallocated;
          } else if(res['data'].length === 0 && selectedReportName === 'SURPLUS_AND_SHORTFALL' ) {
            res.data= shortFallsRptDefault;
          }
          if(result['data'].length > 0) {
            for( var i=0; i< res['data'].length; i++) {
              if(res['data'][i]["payment_asset_dcn"] !== undefined) {
                res['data'][i]['env_ref'] = res['data'][i]["payment_asset_dcn"].substr(0,13);
                res['data'][i]['env_item'] = res['data'][i]["payment_asset_dcn"].substr(13,21);
              }
              if(res['data'][i]["amount"] !== undefined) {
                res['data'][i]['amount'] = this.convertToFloatValue(res['data'][i]['amount']);
              }
              if(res['data'][i]["balance"] !== undefined) {
                res['data'][i]['balance'] = this.convertToFloatValue(res['data'][i]["balance"]);
              }
              let Op = res['data'][i]["surplus_shortfall"];
              if(Op !== undefined) {
                res['data'][i]['surplus_shortfall'] = Op =="Surplus" ? "Over payment":"Under payment";
              }
              if(res['data'][i]["payment_amount"] !== undefined) {
                res['data'][i]['payment_amount'] = this.convertToFloatValue(res['data'][i]['payment_amount']);
              }
            }
          }
          this.isDownLoadButtondisabled = false;
          this.xlFileService.exportAsExcelFile(res['data'], this.getFileName(this.reportsForm.get('selectedreport').value, selectedStartDate, selectedEndDate));
        },
        (error: any) => {
          this.isDownLoadButtondisabled = false;
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
        })

    } else if(selectedReportName === 'PAYMENT_FAILURE_EVENT') {

      this.paymentViewService.downloadFailureReport(selectedStartDate,selectedEndDate).subscribe(
        response =>  {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          const result = {data: JSON.parse(response)['payment_failure_report_list']};
          let res = {data: this.applyDateFormat(result)};
          if (result['data'].length > 0) {
            for ( var i=0; i< res['data'].length; i++) {
              if (res['data'][i]["disputed_amount"] !== undefined) {
                res['data'][i]['disputed_amount'] = this.convertToFloatValue(res['data'][i]["disputed_amount"]);
              }
              if (res['data'][i]["representment_status"] !== undefined) {
                res['data'][i]['representment_status'] = res['data'][i]["representment_status"].toLowerCase() === 'yes' ? 'Success' : 'Failure';
              }
              if (res['data'][i]['representment_status'] === undefined) {
                res['data'][i]['representment_status'] = 'No representment received';
              }
              if (res['data'][i]['representment_date'] === undefined) {
                res['data'][i]['representment_date'] = 'N/A';
              }
              if (res['data'][i]['refund_reference'] === undefined) {
                res['data'][i]['refund_reference'] = 'No refund available';
              }
              if (res['data'][i]['refund_amount'] === undefined) {
                res['data'][i]['refund_amount'] = 'N/A';
              }
              if (res['data'][i]['refund_date'] === undefined) {
                res['data'][i]['refund_date'] = 'N/A';
              }
              if (res['data'][i]['document_control_number'] === undefined) {
                res['data'][i]['document_control_number'] = 'N/A';
              }
            }
          }
          else{
            res.data = paymentFailureRptDefault;
          }
          this.isDownLoadButtondisabled = false;
          this.xlFileService.exportAsExcelFile(res['data'], this.getFileName(this.reportsForm.get('selectedreport').value, selectedStartDate, selectedEndDate ));

        },
        (error: any) => {
          this.isDownLoadButtondisabled = false;
          const errorContent = error.replace(/[^a-zA-Z ]/g, '').trim();
          const statusCode = error.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ')[0];
          if(statusCode === '404') {
            this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, true, errorContent);
          }else {
            this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
          }
        })

    } else if(selectedReportName === 'TELEPHONY_PAYMENTS') {

            this.paymentViewService.downloadTelephonyPaymentsReport(selectedStartDate,selectedEndDate).subscribe(
              response =>  {
                this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');

                const result = {data: JSON.parse(response)['telephony_payments_report_list']};
                let res= {data: this.applyDateFormat(result)};
                //res.data= telephonyPaymentsRptDefault;
                if(result['data'].length > 0) {
                   for( var i=0; i< res['data'].length; i++) {
                     if(res['data'][i]["Amount"] !== undefined) {
                        res['data'][i]['Amount'] = this.convertToFloatValue(res['data'][i]['Amount']);
                     }
                  }
                }else{
                  res.data = telephonyPaymentsRptDefault;
                }
                this.isDownLoadButtondisabled = false;
                this.xlFileService.exportAsExcelFile(res['data'], this.getFileName(this.reportsForm.get('selectedreport').value, selectedStartDate, selectedEndDate ));

              },
              (error: any) => {
                this.isDownLoadButtondisabled = false;
                const errorContent = error.replace(/[^a-zA-Z ]/g, '').trim();
                const statusCode = error.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ')[0];
                if(statusCode === '404') {
                  this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, true, errorContent);
                }else {
                  this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
                }
              })

          } else if(selectedReportName === 'REFUNDS' ){

            this.refundsService.downloadRefundsReport(selectedStartDate,selectedEndDate).subscribe(
                          response =>  {
                            this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');

                            const result = {data: JSON.parse(response)['refunds_report_list']};
                            let res= {data: this.applyDateFormat(result)};

                            if(result['data'].length > 0) {
                               for( var i=0; i< res['data'].length; i++) {
                                 if(res['data'][i]["amount"] !== undefined) {
                                    res['data'][i]['amount'] = this.convertToFloatValue(res['data'][i]['amount']);
                                 }
                              }
                            }else{
                              res.data = refundsRptDefault;
                            }
                            this.isDownLoadButtondisabled = false;
                            this.xlFileService.exportAsExcelFile(res['data'], this.getFileName(this.reportsForm.get('selectedreport').value, selectedStartDate, selectedEndDate ));

                          },
                          (error: any) => {
                            this.isDownLoadButtondisabled = false;
                            const errorContent = error.replace(/[^a-zA-Z ]/g, '').trim();
                            const statusCode = error.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ')[0];
                            if(statusCode === '404') {
                              this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, true, errorContent);
                            }else {
                              this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
                            }
                          })

        } else {
      this.bulkScaningPaymentService.downloadSelectedReport(selectedReportName,selectedStartDate,selectedEndDate).subscribe(
        response =>  {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          const result = JSON.parse(response);
          let res = {data: this.applyDateFormat(result)};
          if(res['data'].length === 0 && selectedReportName === 'DATA_LOSS' ){
            res.data= dataLossRptDefault;
          } else if(res['data'].length === 0 && selectedReportName === 'UNPROCESSED'){
            res.data = unProcessedRptDefault;
          }
          if(result['data'].length > 0) {
          for( var i=0; i< res['data'].length; i++) {
            if(res['data'][i]["amount"] !== undefined) {
              res['data'][i]['amount'] = this.convertToFloatValue(res['data'][i]['amount']);
            }
            if(res['data'][i]["payment_asset_dcn"] !== undefined) {
            res['data'][i]['env_ref'] = res['data'][i]["payment_asset_dcn"].substr(0,13);
            res['data'][i]['env_item'] = res['data'][i]["payment_asset_dcn"].substr(13,21);
          }
        }
        }
          this.isDownLoadButtondisabled = false;
          this.xlFileService.exportAsExcelFile(res['data'], this.getFileName(this.reportsForm.get('selectedreport').value, selectedStartDate, selectedEndDate ));
        },
        (error: any) => {
          this.isDownLoadButtondisabled = false;
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
        })
    }
  }

  getFileName(selectedOption: string, startDate: string, endDate: string ) {
    const loc = 'en-US',
      stDt = formatDate(startDate, 'ddMMyy', loc),
      enDt = formatDate(endDate, 'ddMMyy', loc),
      now = new Date(),
      currentDate = formatDate(now, 'ddMMyy', loc),
      timestamp = `${currentDate}_${this.getTwodigit(now.getHours())}${this.getTwodigit(now.getMinutes())}${this.getTwodigit(now.getSeconds())}`,
      selectedOptionTxt = this.getCamelCaseString(selectedOption);

      return selectedOptionTxt+'_'+stDt+'_To_'+enDt+'_Run_'+ timestamp;
  }
  tranformDate(strDate: string) {
    let result = '';
    if (strDate) {
      let parts = strDate.split('-');
      result = `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return result;
  }
  getTwodigit(input: number){
    return ("0" + input).slice(-2);
  }
  getCamelCaseString(selectedOption) {
    let result;
    switch(selectedOption) {
      case 'UNPROCESSED': {
        result = 'Unprocessed';
        break;
      }
      case 'DATA_LOSS': {
        result = 'Data_Loss';
        break;
      }
      case 'PROCESSED_UNALLOCATED': {
        result = 'Processed_Unallocated';
        break;
      }
      case 'SURPLUS_AND_SHORTFALL': {
        result = 'Over Payment_Under Payment';
        break;
      }
      case 'PAYMENT_FAILURE_EVENT': {
        result = 'Payment failure event';
        break;
      }
      case 'TELEPHONY_PAYMENTS': {
              result = 'Telephony Payments';
              break;
            }
      case 'REFUNDS': {
        result = 'Refunds';
        break;
      }
      default: {
        result = selectedOption;
        break;
      }
   }
   return result;
  }
  applyDateFormat(res) {
    return res['data'].map(value => {
      if (value['date_banked']) {
        value['date_banked'] = formatDate(value['date_banked'], this.fmt, this.loc);
      }
      if (value['event_date'] && value['event_date'].indexOf(',') === -1) {
        value['event_date'] = formatDate(value['event_date'], this.fmt, this.loc);
      } else if (value['event_date'] && value['event_date'].indexOf(',') !== -1) {
        value['event_date'] = this.multiDateFormater(value['event_date'])
      }

      if (value['representment_date'] && value['representment_date'].indexOf(',') === -1) {
        value['representment_date'] = formatDate(value['representment_date'], this.fmt, this.loc);
      } else if (value['representment_date'] && value['representment_date'].indexOf(',') !== -1) {
        value['representment_date'] = this.multiDateFormater(value['representment_date'])
      }

      if (value['refund_date'] && value['refund_date'].indexOf(',') === -1) {
        value['refund_date'] = formatDate(value['refund_date'], this.fmt, this.loc);
      } else if (value['refund_date'] && value['refund_date'].indexOf(',') !== -1) {
        value['refund_date'] = this.multiDateFormater(value['refund_date'])
      }

      if (value['Payment Date']) {
              value['Payment Date'] = formatDate(value['Payment Date'], this.fmt, this.loc);
      }

      if (value['date_created'] && value['date_created'].indexOf(',') === -1) {
        value['date_created'] = formatDate(value['date_created'], 'dd/MM/yyyy HH:mm:ss', this.loc);
      } else if (value['date_created'] && value['date_created'].indexOf(',') !== -1) {
        value['date_created'] = value['date_created']
          .split(',')
          .map(date => formatDate(date, 'dd/MM/yyyy HH:mm:ss', this.loc))
          .join(',');
      }

      if (value['date_updated'] && value['date_updated'].indexOf(',') === -1) {
        value['date_updated'] = formatDate(value['date_updated'], 'dd/MM/yyyy HH:mm:ss', this.loc);
      } else if (value['date_updated'] && value['date_updated'].indexOf(',') !== -1) {
        value['date_updated'] = value['date_updated']
          .split(',')
          .map(date => formatDate(date, 'dd/MM/yyyy HH:mm:ss', this.loc))
          .join(',');
      }
      return value;
    });
  }
  multiDateFormater(dateStr) {
   return dateStr.split(',').map((date) => formatDate(date, this.fmt, this.loc)).join(',');
  }

  convertToFloatValue(amt) {
    return amt ? Number.parseFloat(amt).toFixed(2): '0.00';
  }
}
