export interface IRefundList {
    amount: number,
    ccd_case_number: string,
    date_created: string,
    date_updated: string,
    payment_reference: string,
    reason: string,
    refund_reference: string,
    refund_status: {
      description: string,
      name: string
    },
    user_full_name: string
  }