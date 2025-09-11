export class PaymentToPayhubRequest {
  currency = 'GBP';
  description = 'PayBubble payment';
  channel = 'telephony';
  provider = 'pci pal';
  case_type: string;

  ccd_case_number: string;
  amount: number;
  telephony_system: string;

  constructor(ccd_case_number: string, amount: number, caseType: string, telephony_system: string) {
  this.ccd_case_number = ccd_case_number;
  this.amount = <any>amount.toFixed(2);
  this.case_type= caseType;
  this.telephony_system= telephony_system;
  }
}
