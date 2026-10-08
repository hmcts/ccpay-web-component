import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBSPayments } from '../../interfaces/IBSPayments';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';


@Injectable({
  providedIn: 'root'
})
export class BulkScaningPaymentService {

  constructor(private http: HttpClient,
    private https: WebComponentHttpClient,
    private errorHandlerService: ErrorHandlerService,
    private paymentLibService: PaymentLibService
  ) { }

  getBSPaymentsByCCD(ccdCaseNumber: string): Observable<IBSPayments> {
    return this.http.get<IBSPayments>(`${this.paymentLibService.BULKSCAN_API_ROOT}/cases/${ccdCaseNumber}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
  getBSPaymentsByDCN(dcn: string): Observable<IBSPayments> {
    return this.http.get<IBSPayments>(`${this.paymentLibService.BULKSCAN_API_ROOT}/cases?document_control_number=${dcn}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
  postBSAllocatePayment(body: AllocatePaymentRequest, paymentRef: string): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentRef}/bulk-scan-payments`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postBSPaymentStrategic(body: AllocatePaymentRequest, paymentGroupRef: string): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupRef}/bulk-scan-payments-strategic`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postBSWoPGStrategic(body: AllocatePaymentRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/bulk-scan-payments-strategic`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  patchBSChangeStatus(dcnNumber: string, status: string): Observable<any> {
    return this.https.patch(`${this.paymentLibService.API_ROOT}/bulk-scan-payments/${dcnNumber}/status/${status}`, status).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  calculateOutStandingAmount(paymentGroup: IPaymentGroup): number {
    let feesTotal = 0.00,
      paymentsTotal = 0.00,
      remissionsTotal = 0.00;

    if (paymentGroup.fees) {
      paymentGroup.fees.forEach(fee => {
        feesTotal = feesTotal + fee.calculated_amount;
      });
    }

    if (paymentGroup.payments) {
      paymentGroup.payments.forEach(payment => {
        if (payment.status.toUpperCase() === 'SUCCESS') {
          paymentsTotal = paymentsTotal + payment.amount;
        }
      });
    }

    if (paymentGroup.remissions) {
      paymentGroup.remissions.forEach(remission => {
        remissionsTotal = remissionsTotal + remission.hwf_amount;
      });
    }

    // Summing GBP amounts as floats (e.g. 1789.64 + 387.00) can drift beyond 2dp
    // (eg 2176.6400000000003), so ensure result is rounded to 2 dp
    return Number((feesTotal - remissionsTotal - paymentsTotal).toFixed(2));
  }

  removeUnwantedString(input: string, replaceText: string) {
    const pattern = /[\_]/gi;
    return input.replace(pattern, replaceText);
  }

  downloadSelectedReport(reportName: string, startDate: string, endDate: string): Observable<any> {
    return this.https.get(`${this.paymentLibService.BULKSCAN_API_ROOT}/report/data?date_from=${startDate}&date_to=${endDate}&report_type=${reportName}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
}
