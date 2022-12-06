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
        postal_code?: string;
    }
    service_name?: string;

    constructor(payment: IPayment, contactDetails: IRefundContactDetails, refund_reason: string, refund_amount: number, refund_reference: string, payment_reference: string) {
        
        if (contactDetails !== undefined && contactDetails !== null) {
            this.notification_type = contactDetails.notification_type.toUpperCase();
        }

        if (payment !== undefined && payment !== null) {
            this.payment_reference = payment.reference;
            this.payment_method = payment.method;
            this.payment_channel = payment.channel;
            this.service_name = payment.service_name;
        } else {
            this.payment_reference = payment_reference;
        }

        this.personalisation = {
            ccd_case_number: (payment !== undefined && payment !== null) ? payment.ccd_case_number : '',
            refund_reason: refund_reason,
            refund_amount: refund_amount,
            refund_reference: refund_reference
        };

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

    }
}