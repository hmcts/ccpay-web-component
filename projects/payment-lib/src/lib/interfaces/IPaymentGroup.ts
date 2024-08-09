// TODO: define payment group
import {IFee} from './IFee';
import {IPayment} from './IPayment';
import {IRemission} from './IRemission';
import {IRefundList} from "./IRefundList";

export interface IPaymentGroup {
  payment_group_reference: string;
  payments: IPayment[];
  remissions: IRemission[];
  fees: IFee[];
  refunds: IRefundList[];
}
