export class IserviceRequestPbaPayment {
    account_number: string;
    amount: string
    currency: string
    customer_reference: string
    
    constructor(account_number : string,  amount : string, customer_reference: string) {
        this.account_number = account_number;
        this.amount = amount;
        this.currency = 'GBP';
        this.customer_reference = customer_reference;
    } 
}
    