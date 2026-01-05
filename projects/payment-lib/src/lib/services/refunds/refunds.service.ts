import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRefundReasons } from '../../interfaces/IRefundReasons';
import { IPatchRefundAction } from '../../interfaces/IPatchRefundAction';
import { IRefundList } from '../../interfaces/IRefundList';
import { IssueRefundRequest } from '../../interfaces/IssueRefundRequest';
import { IResubmitRefundRequest } from '../../interfaces/IResubmitRefundRequest';
import { IRefundStatusHistory } from '../../interfaces/IRefundStatusHistory';
import { IPutNotificationRequest } from '../../interfaces/IPutNotificationRequest';

@Injectable({
  providedIn: 'root'
})
export class RefundsService {

  constructor(private http: HttpClient,
    private https: WebComponentHttpClient,
    private errorHandlerService: ErrorHandlerService,
    private paymentLibService: PaymentLibService,
    private meta: Meta
  ) { }

  getRefundReasons(): Observable<IRefundReasons[]> {
    return this.http.get<IRefundReasons[]>(`${this.paymentLibService.REFUNDS_API_ROOT}/reasons`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getRefundRejectReasons(): Observable<any> {
    return this.http.get<any>(`${this.paymentLibService.REFUNDS_API_ROOT}/rejection-reasons`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getRefundActions(refundReference: string): Observable<any> {
    return this.http.get<any>(`${this.paymentLibService.REFUNDS_API_ROOT}/${refundReference}/actions`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  patchRefundActions(body: IPatchRefundAction, refundReference: string, reviewerAction: string): Observable<any> {
    // const opts = this.addHeaders({});
    return this.https.patch(`${this.paymentLibService.REFUNDS_API_ROOT}/${refundReference}/action/${reviewerAction}`, body)
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getRefundList(refundstatus?: string, selfexclusive?: boolean): Observable<IRefundList[]> {
    return this.http.get<IRefundList[]>(`${this.paymentLibService.REFUNDS_API_ROOT}?status=${refundstatus}&excludeCurrentUser=${selfexclusive}`,
      {
        withCredentials: true
      })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getRefundStatusHistory(reference?: string) {
    return this.http.get<IRefundStatusHistory>(`${this.paymentLibService.REFUNDS_API_ROOT}/${reference}/status-history`,
      {
        withCredentials: true
      })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getRefundStatusList(ccdCaseNumber: string): Observable<IRefundList[]> {
    return this.http.get<IRefundList[]>(`${this.paymentLibService.REFUNDS_API_ROOT}?ccdCaseNumber=${ccdCaseNumber}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.paymentLibService.REFUNDS_API_ROOT}/get-user-details`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  postIssueRefund(body: IssueRefundRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.REFUNDS_API_ROOT}/refund`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  putResendOrEdit(body: IPutNotificationRequest, refundRef: string, notificationType: string): Observable<any> {
    return this.https.put(`${this.paymentLibService.REFUNDS_API_ROOT}/resend/notification/${refundRef}?notificationType=${notificationType}`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  patchResubmitRefund(body: IResubmitRefundRequest, refund_reference: string): Observable<any> {
    // const opts = this.addHeaders({});
    return this.https.patch(`${this.paymentLibService.REFUNDS_API_ROOT}/resubmit/${refund_reference}`, body).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }


  postResetRefund(refund_reference: string): Observable<any> {
    return this.https.post(`${this.paymentLibService.REFUNDS_API_ROOT}/reissue-expired/${refund_reference}`,null).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  addHeaders(options: any): any {
    const csrfToken = this.meta.getTag('name=csrf-token');
    const headers = {};
    if (options.headers) {
      options.headers.forEach(element => {
        headers[element] = options.headers.get(element);
      });
    }
    headers['X-Requested-With'] = 'XMLHttpRequest';
    if (csrfToken.content === null) {
      if (document.cookie.split(';').find(row => row.startsWith('XSRF-TOKEN')) !== undefined) {
        headers['CSRF-Token'] = document.cookie.split(';').find(row => row.startsWith('XSRF-TOKEN')).split('=')[1];
      } else {
        headers['CSRF-Token'] = document.cookie.split(';').find(row => row.startsWith(' XSRF-TOKEN')).split('=')[1];
      }
    } else {
      headers['CSRF-Token'] = csrfToken.content;
    }
    options.headers = new HttpHeaders(headers);
    options.responseType = 'text';
    return options;
  }
}
