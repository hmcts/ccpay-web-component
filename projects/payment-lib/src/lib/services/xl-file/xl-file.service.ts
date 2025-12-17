import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class XlFileService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet(excelFileName);
    var headers = [];

    if(excelFileName.match('Data_Loss')!== null){
      headers = ['loss_resp','payment_asset_dcn','env_ref','env_item','resp_service_id','resp_service_name','date_banked','bgc_batch','payment_method','amount'];
      worksheet = this.setDataLossReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet = this.addRowData(worksheet,json,headers);
    } else if(excelFileName.match('Unprocessed')!== null){
      headers = ['resp_service_id','resp_service_name','exception_ref','ccd_ref','date_banked','bgc_batch','payment_asset_dcn','env_ref','env_item','payment_method','amount'];
      worksheet =  this.setUnprocessedReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    } else if(excelFileName.match('Processed_Unallocated')!== null){
      headers = ['resp_service_id','resp_service_name','allocation_status','receiving_office','allocation_reason','ccd_exception_reference','ccd_case_reference','payment_asset_dcn','env_ref','env_item','date_banked','bgc_batch','payment_method','amount'];
      worksheet =  this.setProcessedUnallocatedReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    } else if(excelFileName.match('Payment failure')!== null){
      headers = ['payment_reference','ccd_reference','document_control_number','org_id','service_name','failure_reference','failure_reason','disputed_amount','event_name','event_date','representment_status','representment_date','refund_reference','refund_amount','refund_date'];
      worksheet =  this.setPaymentFailureReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    }else if(excelFileName.match('Telephony Payments')!== null){
      headers = ['Resp_Service Name','CCD_Ref','Payment Reference','Fee Code','Payment Date','Amount','Payment Status'];
      worksheet =  this.setTelphonyPaymentsReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    }else if(excelFileName.match('Refunds')!== null){
      headers = ['date_created','date_updated','amount','reason','refund_status','reference','payment_reference','ccd_case_number','service_type'];
      worksheet =  this.setRefundsReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    } else {
      headers = ['resp_service_id','resp_service_name','surplus_shortfall','balance','payment_amount','ccd_case_reference', 'ccd_exception_reference', 'processed_date', 'reason', 'explanation', 'user_name'];
      worksheet =  this.setShortFallReportHeaders(worksheet);
      worksheet = this.autoFitColumns(worksheet,json);
      worksheet =  this.addRowData(worksheet,json,headers);
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: EXCEL_TYPE });
          FileSaver.saveAs(blob, `${excelFileName + EXCEL_EXTENSION}`);
    });
  }

  private autoFitColumns (worksheet: ExcelJS.Worksheet,json:any) : ExcelJS.Worksheet {
    let objectMaxLength = [];
    let ColWidth = [];
    let obj = <any>Object;
      for (let i = 0; i < json.length; i++) {
        let value = obj.values(json[i]);
        let key = obj.keys(json[i]);
        for (let j = 0; j < value.length; j++) {
          if(value[j] === null){
            value[j] = '';
          }
          objectMaxLength[j] =
            key[j].length >= value[j].length
              ? key[j].length+2
              : value[j].length+1;
              if( value[j].length === undefined){
                objectMaxLength[j] =  key[j].length+2;
              }
        ColWidth.push({'width': +objectMaxLength[j]});
        }
      }
      worksheet.columns = ColWidth;
      return worksheet;
  }

  private addRowData (worksheet: ExcelJS.Worksheet,json:any,headers) : ExcelJS.Worksheet {
    for (let i = 0; i < headers.length; i++) {
      worksheet.columns[i].key = headers[i];
    }
      for (let i = 0; i < json.length; i++) {
        let row = json[i];
        for (let key in row) {
              if (row[key] && typeof row[key] === 'string') {
                row[key] = this.sanitizeString(row[key]);
              }
            }
        worksheet.addRow(row);
      }
      return worksheet;
  }

  private setDataLossReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
    worksheet.getCell('A1').value = "Loss_Resp";
    worksheet.getCell('B1').value = "Payment_Asset_DCN";
    worksheet.getCell('C1').value = "Envelope_Ref";
    worksheet.getCell('D1').value = "Envelope_Item";
    worksheet.getCell('E1').value = "Resp_Service ID";
    worksheet.getCell('F1').value = "Resp_Service Name";
    worksheet.getCell('G1').value = "Date_Banked";
    worksheet.getCell('H1').value = "BGC_Batch";
    worksheet.getCell('I1').value = "Payment_Method";
    worksheet.getCell('J1').value = "Amount";
    return worksheet;
  }

  private setUnprocessedReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
    worksheet.getCell('A1').value = "Resp_Service ID";
    worksheet.getCell('B1').value = "Resp_Service Name";
    worksheet.getCell('C1').value = "Exception_Ref";
    worksheet.getCell('D1').value = "CCD_Ref";
    worksheet.getCell('E1').value = "Date_Banked";
    worksheet.getCell('F1').value = "BGC_Batch";
    worksheet.getCell('G1').value = "Payment_Asset_DCN";
    worksheet.getCell('H1').value = "Envelope_Ref";
    worksheet.getCell('I1').value = "Envelope_Item";
    worksheet.getCell('J1').value = "Payment_Method";
    worksheet.getCell('K1').value = "Amount";
    return worksheet;
  }

  private setProcessedUnallocatedReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
    worksheet.getCell('A1').value = "Resp_Service ID";
    worksheet.getCell('B1').value = "Resp_Service Name";
    worksheet.getCell('C1').value = "Allocation_Status";
    worksheet.getCell('D1').value = "Receiving_Office";
    worksheet.getCell('E1').value = "Allocation_Reason";
    worksheet.getCell('F1').value = "CCD_Exception_Ref";
    worksheet.getCell('G1').value = "CCD_Case_Ref";
    worksheet.getCell('H1').value = "Payment_Asset_DCN";
    worksheet.getCell('I1').value = "Envelope_Ref";
    worksheet.getCell('J1').value = "Envelope_Item";
    worksheet.getCell('K1').value = "Date_Banked";
    worksheet.getCell('L1').value = "BGC_Batch";
    worksheet.getCell('M1').value = "Payment_Method";
    worksheet.getCell('N1').value = "Amount";
    return worksheet;
  }

  private setPaymentFailureReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
    worksheet.getCell('A1').value = "Payment reference";
    worksheet.getCell('B1').value = "CCD reference";
    worksheet.getCell('C1').value = "Document Control Number";
    worksheet.getCell('D1').value = "OrgID";
    worksheet.getCell('E1').value = "Service name";
    worksheet.getCell('F1').value = "Failure reference";
    worksheet.getCell('G1').value = "Failure reason";
    worksheet.getCell('H1').value = "Disputed amount";
    worksheet.getCell('I1').value = "Event name";
    worksheet.getCell('J1').value = "Event date";
    worksheet.getCell('K1').value = "Representment status";
    worksheet.getCell('L1').value = "Representment date";
    worksheet.getCell('M1').value = "Refund reference";
    worksheet.getCell('N1').value = "Refund amount";
    worksheet.getCell('O1').value = "Refund date";
    return worksheet;
  }

  private setShortFallReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
    worksheet.getCell('A1').value = "Resp_Service ID";
    worksheet.getCell('B1').value = "Resp_Service Name";
    worksheet.getCell('C1').value = "Over Payment_Under Payment";
    worksheet.getCell('D1').value = "Balance";
    worksheet.getCell('E1').value = "Payment_Amount";
    worksheet.getCell('F1').value = "CCD_Case_Ref";
    worksheet.getCell('G1').value = "Exception_Ref";
    worksheet.getCell('H1').value = "Processed_Date";
    worksheet.getCell('I1').value = "Reason";
    worksheet.getCell('J1').value = "Explanation";
    worksheet.getCell('K1').value = "Updated Name";
    return worksheet;
  }

    private setTelphonyPaymentsReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
      worksheet.getCell('A1').value = "Resp_Service Name";
      worksheet.getCell('B1').value = "CCD_Ref";
      worksheet.getCell('C1').value = "Payment Reference";
      worksheet.getCell('D1').value = "Fee Code";
      worksheet.getCell('E1').value = "Payment Date";
      worksheet.getCell('F1').value = "Amount";
      worksheet.getCell('G1').value = "Payment Status";
      return worksheet;
    }

   private setRefundsReportHeaders (worksheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
     worksheet.getCell('A1').value = "date_created";
     worksheet.getCell('B1').value = "date_updated";
     worksheet.getCell('C1').value = "amount";
     worksheet.getCell('D1').value = "reason";
     worksheet.getCell('E1').value = "refund_status";
     worksheet.getCell('F1').value = "reference";
     worksheet.getCell('G1').value = "payment reference";
     worksheet.getCell('H1').value = "ccd_case_number";
     worksheet.getCell('I1').value = "service_type";
     return worksheet;
   }

  private sanitizeString(value: string): string {
    if (value) {
        // Remove tabs, carriage returns, and newlines
        value = value.replace(/^[\t\r\n@]+|[\t\r\n@]/g, (match, offset) => offset === 0 ? '' : ' ');

        // Check if the first character is '-' or '=' or '+'
        if (value.charAt(0) === '-' || value.charAt(0) === '=' || value.charAt(0) === '+') {
             value = "'" + value;
        }
        return value;
      }
      return '';
    }

}
