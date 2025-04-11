import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

import {ICardDetails} from '../../interfaces/ICardDetails';
import {PaymentLibService} from '../../payment-lib.service';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';


@Injectable({
  providedIn: 'root'
})
export class CardDetailsService {

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private errorHandlerService: ErrorHandlerService,
              private paymentLibService: PaymentLibService) { }

  getCardDetails(paymentReference: string): Observable<ICardDetails> {
    this.logger.info('Card-detail-service getCardDetails for: ', paymentReference);

    return this.http.get<ICardDetails>(`${this.paymentLibService.API_ROOT}/card-payments/${paymentReference}/details`, {
        withCredentials: true
      })
      .pipe(
        catchError(this.errorHandlerService.handleError)
      );
  }
}
