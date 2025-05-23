export class PayhubAntennaRequest {
  currency = 'GBP';
  case_type: string;
  ccd_case_number: string;
  amount: number;
  payment_method: string;

  constructor(ccd_case_number: string, amount: number, caseType: string, payment_method: string) {
    this.ccd_case_number = ccd_case_number;
    this.amount = <any>amount.toFixed(2);
    this.case_type = caseType;
    this.payment_method = payment_method;
  }
}
