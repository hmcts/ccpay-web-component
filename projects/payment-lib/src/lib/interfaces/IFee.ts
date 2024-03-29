export interface IFee {
  code: string;
  version: string;
  volume?: number;
  calculated_amount: number;
  net_amount: number;
  description: string;
  ccd_case_number: string;
  id: number;
  jurisdiction1: string;
  jurisdiction2: string;
  reference: string;
  memo_line: string;
  fee_amount?: number;
  apportion_amount?: number;
  allocated_amount?: number;
  is_fully_apportioned?: string;
  date_apportioned?: string;
  date_created?: string;
  date_updated?: string;
  amount_due?: number;
  remission_enable?: boolean;
  add_remission?: boolean;
  over_payment?: number; 
  refund_amount?: number;
  updated_volume?:number;
  selected?:any;
  issue_refund_add_refund_add_remission: boolean
}
