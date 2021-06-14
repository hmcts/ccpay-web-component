import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {IOrderReferenceFee} from '../interfaces/IOrderReferenceFee';

@Injectable({
  providedIn: 'root'
})
export class OrderslistService {
  private ordersList: BehaviorSubject<IOrderReferenceFee[]> = new BehaviorSubject<IOrderReferenceFee[]>(null);
  private caseType = new BehaviorSubject("");
  getcaseType = this.caseType.asObservable();
  private feeExists = new BehaviorSubject<boolean>(null);
  getFeeExist = this.feeExists.asObservable();

  constructor() { }

  setOrdersList(orderLevelFees: IOrderReferenceFee[]): void {
    this.ordersList.next(Object.assign([], orderLevelFees));
  }
  getOrdersList() {
    return this.ordersList;
  }

  setCaseType(caseType: string){
    this.caseType.next(caseType);
  }
  getCaseType(){
    return this.caseType;
  }

  setFeeExists(feeExists: boolean){
    this.feeExists.next(feeExists);
  }
  getFeeExists(){
    return this.feeExists;
  }
}