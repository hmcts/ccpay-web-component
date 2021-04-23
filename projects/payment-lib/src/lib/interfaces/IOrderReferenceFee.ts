export interface IOrderReferenceFee {
  orderRefId: number;
  orderTotalFees: number;
  orderStatus: string;
  orderParty: string;
  orderCCDEvent: string;
  orderCreated: Date;
  orderAddBtnEnable: boolean;
}