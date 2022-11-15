import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import {PaymentLibService} from '../../payment-lib.service';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import { IRefundsNotifications } from '../../interfaces/IRefundsNotifications';
import { NotificationPreviewRequest } from '../../interfaces/NotificationPreviewRequest';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient,
    private https: WebComponentHttpClient,
              private errorHandlerService: ErrorHandlerService,
              private paymentLibService: PaymentLibService
              ) { }

  getRefundNotification(reference: string): Observable<IRefundsNotifications> {
    return this.http.get<IRefundsNotifications>(`${this.paymentLibService.NOTIFICATION_API_ROOT}/notifications/${reference}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getAddressByPostcode(postcode: string): Observable<any> {
    return this.http.get<any>(`${this.paymentLibService.NOTIFICATION_API_ROOT}/search/places/v1/postcode?postcode=${postcode}`, {
      withCredentials: true
    })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }

  getNotificationPreview(body: NotificationPreviewRequest): Observable<any> {
    return this.https.post(`${this.paymentLibService.NOTIFICATION_API_ROOT}/doc-preview`, body).pipe(
      catchError(this.errorHandlerService.handleError));
  }
}
