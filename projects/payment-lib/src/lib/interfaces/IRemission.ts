export interface IRemission {
  remission_reference: string;
  hwf_reference: string;
  hwf_amount: number;
  beneficiary_name: string;
  ccd_case_number: string;
  fee_code: string;
  date_created: string;
  fee_id: number;
  issue_refund_add_refund_add_remission: boolean;
  add_refund: boolean;
  overall_balance:number;
  acollection_of_fess: boolean;
}
