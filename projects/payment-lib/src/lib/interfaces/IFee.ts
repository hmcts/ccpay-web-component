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
}
