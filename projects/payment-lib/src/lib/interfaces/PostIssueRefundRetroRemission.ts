import { IRefundContactDetails } from './IRefundContactDetails';

export class PostIssueRefundRetroRemission {
    remissionReference: string;
    contact_details: IRefundContactDetails;

    constructor(remissionReference : string, contactDeatils: any) {
      this.remissionReference= remissionReference;
      this.contact_details = contactDeatils;
    } 
}