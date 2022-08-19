import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { v4 as uuidv4 } from 'uuid';
import {IPayment} from '../../interfaces/IPayment';
import {PaymentLibService} from '../../payment-lib.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../shared/logger/logger.service';
import {IPaymentGroup} from '../../interfaces/IPaymentGroup';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentToPayhubRequest } from '../../interfaces/PaymentToPayhubRequest';
import { PayhubAntennaRequest } from '../../interfaces/PayhubAntennaRequest';
import { UnidentifiedPaymentsRequest } from '../../interfaces/UnidentifiedPaymentsRequest';
import { UnsolicitedPaymentsRequest } from '../../interfaces/UnsolicitedPaymentsRequest';
import { Meta } from '@angular/platform-browser';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IAllocationPaymentsRequest } from '../../interfaces/IAllocationPaymentsRequest';
import {IOrderReferenceFee} from '../../interfaces/IOrderReferenceFee';
import { BehaviorSubject } from 'rxjs';
import { IserviceRequestPbaPayment } from '../../interfaces/IserviceRequestPbaPayment';
import { IserviceRequestCardPayment } from '../../interfaces/IserviceRequestCardPayment';
import { RefundsRequest } from '../../interfaces/RefundsRequest';
import { AddRetroRemissionRequest } from '../../interfaces/AddRetroRemissionRequest';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
import { PostIssueRefundRetroRemission } from '../../interfaces/PostIssueRefundRetroRemission';
import { error } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class PaymentViewService {
  private ordersList  = <BehaviorSubject<IOrderReferenceFee[]>>new BehaviorSubject([]);

  private meta: Meta;

  constructor(private http: HttpClient,
              private https: WebComponentHttpClient,
              private logger: LoggerService,
              private errorHandlerService: ErrorHandlerService,
              private paymentLibService: PaymentLibService) { }

  getPaymentDetails(paymentReference: string, paymentMethod: string): Observable<IPayment> {
    this.logger.info('Payment-view-service getPaymentDetails for: ', paymentReference);

    return this.http.get<IPayment>(paymentMethod === 'card' || paymentMethod === 'cash' || paymentMethod === 'cheque' || paymentMethod === 'postal order' ?
          `${this.paymentLibService.API_ROOT}/card-payments/${paymentReference}` :
          `${this.paymentLibService.API_ROOT}/credit-account-payments/${paymentReference}`, {
        withCredentials: true
      })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getPaymentGroupDetails(paymentGroupReference: string): Observable<IPaymentGroup> {
    this.logger.info('Payment-view-service getPaymentGroupDetails for: ', paymentGroupReference);

    return this.http.get<IPayment>(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupReference}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
  getApportionPaymentDetails(paymentReference: string): Observable<IPaymentGroup> {
    this.logger.info('Payment-view-service getPaymentGroupDetails for: ', paymentReference);

    return this.http.get<IPayment>(`${this.paymentLibService.API_ROOT}/payment-groups/fee-pay-apportion/${paymentReference}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
  getPBAaccountDetails(): Observable<any> {
    const url = `${this.paymentLibService.API_ROOT}/pba-accounts`;
    return this.http.get(url, { withCredentials: true }).pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  postWays2PayCardPayment(serviceRef: string, body: IserviceRequestCardPayment): Observable<any> {
    const url = `${this.paymentLibService.API_ROOT}/service-request/${serviceRef}/card-payments`;
    const rurl = this.paymentLibService.CARDPAYMENTRETURNURL.replace('.prod', '');
    body['return-url'] = `${rurl}/payment`;
    return this.https.post(url, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  
  postPBAaccountPayment(serviceRef: string, body: IserviceRequestPbaPayment): Observable<any> {
    let randomKey = 'idam-key-' + Math.random().toString().split('.').join('-');
    body['idempotency_key'] = randomKey; 
    const url = `${this.paymentLibService.API_ROOT}/service-request/${serviceRef}/pba-payments`;
    return this.https.post(url, body);
  }

  postBSPayments(body: AllocatePaymentRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/bulk-scan-payments`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postBSUnidentifiedPayments(body: UnidentifiedPaymentsRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-allocations`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postBSUnsolicitedPayments(body: UnsolicitedPaymentsRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-allocations`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postBSAllocationPayments(body: IAllocationPaymentsRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-allocations`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  postPaymentGroupWithRemissions(paymentGroupReference: string, feeId: number, body: AddRemissionRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupReference}/fees/${feeId}/remissions`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  deleteFeeFromPaymentGroup(feeId: number): Observable<any> {
        this.logger.info('Payment-view-service deleteFeeFromPaymentGroup for: ', feeId);
    return this.https.delete(`${this.paymentLibService.API_ROOT}/fees/${feeId}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  postPaymentToPayHub(body: PaymentToPayhubRequest, paymentGroupRef: string): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupRef}/card-payments`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  postPaymentAntennaToPayHub(body: PayhubAntennaRequest, paymentGroupRef: string): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupRef}/telephony-card-payments`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  downloadSelectedReport(reportName: string, startDate: string, endDate:string): Observable<any> {
    const url = `${this.paymentLibService.API_ROOT}/report/data?date_from=${startDate}&date_to=${endDate}&report_type=${reportName}`;
    return this.https.get(url, { withCredentials: true }).pipe( catchError(this.errorHandlerService.handleError));
  }
  downloadFailureReport(startDate: string, endDate:string): Observable<any> {
    const url = `${this.paymentLibService.API_ROOT}/payment-failures/failure-report?date_from=${startDate}&date_to=${endDate}`;
    return this.https.get(url, { withCredentials: true }).pipe( catchError(this.errorHandlerService.handleError));
  }
  getBSfeature(): Observable<any> {
    return this.https.get('api/payment-history/bulk-scan-feature', { withCredentials: true }).pipe( catchError(this.errorHandlerService.handleError));
  }
  getSiteID(): Observable<any> {
    return this.https.get('api/payment-history/refdata/legacy-sites', { withCredentials: true }).pipe( catchError(this.errorHandlerService.handleError));
  }
  getPartyDetails(caseNumber: string): Observable<any> {
    const url = `${this.paymentLibService.API_ROOT}/case-payment-orders?case_ids=${caseNumber}`;
    return this.https.get(url, { withCredentials: true }).pipe( catchError(this.errorHandlerService.handleError));
  }
  
  setOrdersList(orderLevelFees: IOrderReferenceFee[]): void {
    this.ordersList.next(Object.assign([], orderLevelFees));
}
  getOrdersList() {
    return this.ordersList;
  }

  //issue refund
  postRefundsReason(body: PostRefundRetroRemission): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/refund-for-payment`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // retro remissions
  postPaymentGroupWithRetroRemissions(paymentGroupReference: string, feeId: number, body: AddRetroRemissionRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.API_ROOT}/payment-groups/${paymentGroupReference}/fees/${feeId}/retro-remission`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  postRefundRetroRemission(body:PostIssueRefundRetroRemission) {
    return this.https.post(`${this.paymentLibService.API_ROOT}/refund-retro-remission`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
 getPaymentFailure(paymentReference: string): Observable<any> {
    return this.https.get(`${this.paymentLibService.API_ROOT}/payment-failures/${paymentReference}`, {
      withCredentials: true
    }).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
}
