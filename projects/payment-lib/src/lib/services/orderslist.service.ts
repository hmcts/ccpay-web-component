import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {IOrderReferenceFee} from '../interfaces/IOrderReferenceFee';
import { IRefundList } from '../interfaces/IRefundList';
import { IPaymentView } from '../interfaces/IPaymentView';  

@Injectable({
  providedIn: 'root'
})
export class OrderslistService {
  private ordersList: BehaviorSubject<IOrderReferenceFee[]> = new BehaviorSubject<IOrderReferenceFee[]>(null);
  private refundView: BehaviorSubject<IRefundList> = new BehaviorSubject<IRefundList>(null);
  private caseType = new BehaviorSubject("");
  getcaseType = this.caseType.asObservable();
  private feeExists = new BehaviorSubject<boolean>(null);
  getFeeExist = this.feeExists.asObservable();
  private ccdCaseNumber = new BehaviorSubject("");
  getCCDCaseNumberforRefund = this.ccdCaseNumber.asObservable();
  private isFromServiceRequestPage = new BehaviorSubject<boolean>(null);
  getisFromServiceRequestPage = this.isFromServiceRequestPage.asObservable();
  private OrderRefId = new BehaviorSubject("");
  getOrderRefId = this.OrderRefId.asObservable();
  private navigationPage = new BehaviorSubject("");
  getnavigationPage = this.navigationPage.asObservable();

  private orderRef = new BehaviorSubject("");
  getorderRef = this.orderRef.asObservable();
  private orderCCDEvent = new BehaviorSubject("");
  getorderCCDEvent = this.caseType.asObservable();
  private orderCreated = new BehaviorSubject<Date>(null);
  getorderCreated = this.orderCreated.asObservable();
  private orderParty = new BehaviorSubject("");
  getorderParty = this.orderParty.asObservable();
  private orderRemissionTotal = new BehaviorSubject<number>(null);
  getorderRemissionTotal = this.orderRemissionTotal.asObservable();
  private orderFeesTotal = new BehaviorSubject<number>(null);
  getorderFeesTotal = this.orderFeesTotal.asObservable();
  private orderTotalPayments = new BehaviorSubject<number>(null);
  getorderTotalPayments = this.orderTotalPayments.asObservable();
  private rolesList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  private orderDetail: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  private paymentPageView: BehaviorSubject<IPaymentView> = new BehaviorSubject<IPaymentView>(null);

  constructor() { }

  setOrdersList(orderLevelFees: IOrderReferenceFee[]): void {
    this.ordersList.next(Object.assign([], orderLevelFees));
  }
  getOrdersList() {
    return this.ordersList;
  }

  setRefundView(refundList: IRefundList): void {
    this.refundView.next(Object.assign([], refundList));
  }
  getRefundView() {
    return this.refundView;
  }

  setCaseType(caseType: string){
    this.caseType.next(caseType);
  }
  getCaseType(){
    return this.caseType;
  }

  setCCDCaseNumber(ccdCaseNumber: string){
    this.ccdCaseNumber.next(ccdCaseNumber);
  }
  getCCDCaseNumber(){
    return this.ccdCaseNumber;
  }

  setFeeExists(feeExists: boolean){
    this.feeExists.next(feeExists);
  }
  getFeeExists(){
    return this.feeExists;
  } 

  setisFromServiceRequestPage(isFromServiceRequestPage: boolean){
    this.isFromServiceRequestPage.next(isFromServiceRequestPage);
  }
  getisFromServiceRequestPages(){
    return this.isFromServiceRequestPage;
  }

  setOrderRefId(OrderRefId: string){
    this.OrderRefId.next(OrderRefId);
  }
  getSelectedOrderRefId(){
    return this.OrderRefId;
  }

  setnavigationPage(navigationPage: string){
    this.navigationPage.next(navigationPage);
  }
  getnavigationPageValue(){
    return this.navigationPage;
  }

  setpaymentPageView(paymentpageList: IPaymentView): void {
    this.paymentPageView.next(Object.assign([], paymentpageList));
  }
  getpaymentPageView() {
    return this.paymentPageView;
  }

  setUserRolesList(rolesList:any[]): void {
    this.rolesList.next(Object.assign([], rolesList));
  }
  getUserRolesList() {
    return this.rolesList;
  }

  setorderDetail(orderDetail:any[]): void {
    this.orderDetail.next(Object.assign([], orderDetail));
  }
  getorderDetail() {
    return this.orderDetail;
  }

  setOrderRef(orderRef: string){
    this.orderRef.next(orderRef);
  }
  getorderRefs(){
    return this.orderRef;
  }

  setorderCCDEvent(orderCCDEvent: string){
    this.orderCCDEvent.next(orderCCDEvent);
  }
  getorderCCDEvents(){
    return this.orderCCDEvent;
  }

  setorderCreated(orderCreated: Date){
    this.orderCreated.next(orderCreated);
  }
  getorderCreateds(){
    return this.orderCreated;
  }

  setorderParty(orderParty: string){
    this.orderParty.next(orderParty);
  }
  getorderPartys(){
    return this.orderParty;
  }

  setorderRemissionTotal(orderRemissionTotal: number){
    this.orderRemissionTotal.next(orderRemissionTotal);
  }
  getorderRemissionTotals(){
    return this.orderRemissionTotal;
  }

  setorderFeesTotal(orderFeesTotal: number){
    this.orderFeesTotal.next(orderFeesTotal);
  }
  getorderFeesTotals(){
    return this.orderFeesTotal;
  }

  setorderTotalPayments(orderTotalPayments: number){
    this.orderTotalPayments.next(orderTotalPayments);
  }
  getoorderTotalPaymentss(){
    return this.orderTotalPayments;
  }
}
