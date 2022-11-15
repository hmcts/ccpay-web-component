import { IPayment } from './IPayment';
import { IRefundContactDetails } from './IRefundContactDetails';

export class NotificationPreviewRequest {
    notification_type?: string;
    payment_channel?: string;
    payment_method?: string;
    payment_reference?: string;
    personalisation?: {
        ccd_case_number?: string;
        refund_amount?: number;
        refund_reason?: string;
        refund_reference?: string;
    }
    recipient_email_address?: string;
    recipient_postal_address?: {
        address_line?: string;
        city?: string;
        county?: string;
        country?: string;
        postal_code?: String;
    }
    service_name?: string;

    constructor(payment: IPayment, contactDetails: IRefundContactDetails, refund_reason: string, refund_amount: number, refund_reference: string, payment_reference: string) {
        
        if (contactDetails) {
            this.notification_type = contactDetails.notification_type.toUpperCase();
        }
        this.payment_method = payment.method;
        this.payment_channel = payment.channel;
        if (payment) {
            this.payment_reference = payment.reference;
        } else {
            this.payment_reference = payment_reference;
        }

        this.personalisation = {
            ccd_case_number: payment.ccd_case_number,
            refund_reason: refund_reason,
            refund_amount: refund_amount,
            refund_reference: refund_reference
        };

        this.personalisation.ccd_case_number = payment.ccd_case_number;
        this.personalisation.refund_reason = refund_reason;
        this.personalisation.refund_amount = refund_amount;
        this.personalisation.refund_reference = refund_reference;

        if (this.notification_type === "EMAIL") {
            this.recipient_email_address = contactDetails.email;
            this.recipient_postal_address = null;
        } else if (this.notification_type === "LETTER") {
            this.recipient_postal_address = {
                address_line: contactDetails.address_line,
                city: contactDetails.city,
                county: contactDetails.county,
                country: contactDetails.country,
                postal_code: contactDetails.postal_code
            };
            this.recipient_email_address = null;
        }

        this.service_name = payment.service_name;
    }
}