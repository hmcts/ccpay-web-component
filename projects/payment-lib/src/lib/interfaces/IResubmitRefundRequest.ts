import { IFee } from "./IFee";
import { IRefundContactDetails } from "./IRefundContactDetails";
export class IResubmitRefundRequest {
  refund_reason: string;
  amount: number;
  contact_details: IRefundContactDetails;
  refund_fees: IFee[];
  
    constructor(refund_reason : string, amount: number,contact_details:any,refund_fees: any[]) {
      this.refund_reason= refund_reason;
      this.amount = amount;
      this.contact_details = contact_details;
      this.refund_fees = refund_fees;
    } 
  }
  