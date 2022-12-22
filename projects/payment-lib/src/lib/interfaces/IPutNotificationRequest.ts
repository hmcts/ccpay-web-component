import { IRefundContactDetails } from './IRefundContactDetails';

export class IPutNotificationRequest {
  recipient_email_address?: string;
  recipient_postal_address?: IRefundContactDetails
  
    constructor(contactDetails: any, notificationType: string) {
      if(notificationType === 'EMAIL') {
        this.recipient_email_address = contactDetails;
      } else if(notificationType === 'LETTER') {
        this.recipient_postal_address = contactDetails;
      }
    } 
}