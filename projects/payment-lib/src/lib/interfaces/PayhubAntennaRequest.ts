export class PayhubAntennaRequest {
  currency = 'GBP';
  case_type: string;
  ccd_case_number: string;
  amount: number;
  telephony_system: string;
  selected_option: string;
  dcn_number: string;
  take_payment: boolean;
  is_bulk_scanning: boolean;
  is_st_fix_enable: boolean;
  is_turn_off: string;
  is_payment_status_enabled: boolean;
  exc_reference : string;

  constructor(ccd_case_number: string, amount: number, caseType: string, telephony_system: string, selected_option: string,
              dcn_number: string,
              take_payment: boolean,
              is_bulk_scanning: boolean,
              is_st_fix_enable: boolean,
              is_turn_off: string,
              is_payment_status_enabled: boolean,
              exc_reference :string
  ) {
    this.ccd_case_number = ccd_case_number;
    this.amount = <any>amount.toFixed(2);
    this.case_type = caseType;
    this.telephony_system = telephony_system;
    this.selected_option = selected_option;
    this.dcn_number = dcn_number;
    this.take_payment = take_payment;
    this.is_bulk_scanning = is_bulk_scanning;
    this.is_st_fix_enable = is_st_fix_enable;
    this.is_turn_off = is_turn_off;
    this.is_payment_status_enabled = is_payment_status_enabled;
    this.exc_reference = exc_reference;
  }
}
