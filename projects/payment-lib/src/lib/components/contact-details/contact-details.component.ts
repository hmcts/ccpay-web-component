import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PaymentLibComponent } from '../../payment-lib.component';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'ccpay-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input('isEditOperation') isEditOperation: boolean;
  @Input('isEditOperationInRefundList') isEditOperationInRefundList: boolean;
  @Input('addressObj') addressObj: any;
  @Output() assignContactDetails: EventEmitter<any> = new EventEmitter();
  @Output() assignContactDetailsInFefundsList: EventEmitter<any> = new EventEmitter();
  @Output() redirectToIssueRefund: EventEmitter<any> = new EventEmitter();
  pageTitle: string = 'Payment status history';
  errorMessage: string;
  isEmailSAddressClicked: boolean = true;
  isShowPickAddress:  boolean = false;
  isPostcodeClicked: boolean = false;
  isManualAddressClicked: boolean = false;
  emailAddressForm: FormGroup;
  postCodeForm: FormGroup;
  manualAddressForm: FormGroup;
  addressPostcodeList:any[] = [];
  postcodeAddress:any;
  isAddressBoxEmpty: boolean = false;

  isEmailEmpty: boolean = false;
  emailHasError: boolean = false;
  isPostcodeEmpty: boolean = false;
  postcodeHasError: boolean = false;
  isaddressLine1Empty: boolean = false;
  addressLine1HasError: boolean = false;
  addressLine2HasError: boolean = false;
  isTownOrCityEmpty: boolean = false;
  townOrCityHasError: boolean = false;
  isCountyEmpty: boolean = false;
  countyHasError: boolean = false;
  isMPostcodeEmpty: boolean = false;
  mpostcodeHasError: boolean = false;
  isCountryEmpty: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private paymentLibComponent: PaymentLibComponent) { }

  ngOnInit() {
    this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,false,false], 'all');

    this.emailAddressForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
    this.postCodeForm = this.formBuilder.group({
      postcode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([A-Za-z]{1,2}[0-9]{1,2}[A-Za-z]{0,1} ?[0-9][A-Za-z]{2})')
      ]))
    });
    this.manualAddressForm = this.formBuilder.group({
      addressl1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\\s,\'-]*$')
      ])),
      addressl2: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9\\s,\'-]*$')
      ])),
      townorcity: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\\s,\'-]*$')
      ])),
      county: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9\\s,\'-]*$')
      ])),
      mpostcode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([A-Za-z]{1,2}[0-9]{1,2}[A-Za-z]{0,1} ?[0-9][A-Za-z]{2})')
      ])),
      country: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    if(this.addressObj !== undefined && this.addressObj !== '') {
      this.setEditDetails();
    }
    if(this.isEditOperationInRefundList === undefined) {
      this.isEditOperationInRefundList = false;
    }
  }
  setEditDetails() {
    if(this.addressObj.notification_type === 'EMAIL') {
      this.isEmailSAddressClicked = true;
      this.isPostcodeClicked = false;
      this.isManualAddressClicked = false;
      this.emailAddressForm.setValue({ email: this.addressObj.contact_details.email });
    } else if(this.addressObj.notification_type === 'LETTER') {
      this.isEmailSAddressClicked = false;
      this.isPostcodeClicked = true;
      this.isManualAddressClicked = true;
      this.manualAddressForm.patchValue({ 
        addressl1: this.addressObj.contact_details.address_line,
        townorcity: this.addressObj.contact_details.city,
        county: this.addressObj.contact_details.county,
        country: this.addressObj.contact_details.country,
        mpostcode: this.addressObj.contact_details.postal_code
      });
    }
  }

  selectContactOption(type, isLinkedClied) {
    this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false], 'all');
    if( type === 'Email' && isLinkedClied === 'false'){
      this.isEmailSAddressClicked = true;
      this.isPostcodeClicked = false;
      this.isManualAddressClicked = false;
    } else if(type === 'Postcode' && isLinkedClied === 'false') {
      this.isEmailSAddressClicked = false;
      this.isPostcodeClicked = true;
      this.isManualAddressClicked = false;
    } else if(type === 'Postcode' && isLinkedClied === 'true') {
      this.isEmailSAddressClicked = false;
      this.isPostcodeClicked = true;
      this.isManualAddressClicked = true;

    }
  }

  finalFormSubmit() {
    this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false], 'all');
    if( this.isEmailSAddressClicked ){
      const emailField = this.emailAddressForm.controls.email;
      if (this.emailAddressForm.valid) {
        if(!this.isEditOperationInRefundList) {
        this.assignContactDetails.emit( {
          email: emailField.value,
          notification_type: 'EMAIL'
        } );
      } else {
        this.assignContactDetailsInFefundsList.emit({
          email: emailField.value,
          notification_type: 'EMAIL'
        } );
      }
      } else {
        if( emailField.value == '' ) {
          this.resetForm([true,false,false,false,false,false,false,false,false,false,false,false,false,false], 'email');
        }
        if(emailField.value != '' && emailField.invalid ) {
          this.resetForm([false,true,false,false,false,false,false,false,false,false,false,false,false,false], 'email');
        }
      }
    } else if( this.isPostcodeClicked && !this.isManualAddressClicked ) {
      this.postcodeValidation('FS');
    } else if(this.isPostcodeClicked && this.isManualAddressClicked) {
      const fieldCtrls = this.manualAddressForm.controls;
      if (this.manualAddressForm.valid) {
        if(!this.isEditOperationInRefundList) {
        this.assignContactDetails.emit({
          address_line: fieldCtrls.addressl1.value+' '+fieldCtrls.addressl2.value,
          city: fieldCtrls.townorcity.value,
          county: fieldCtrls.county.value,
          postal_code: fieldCtrls.mpostcode.value,
          country: fieldCtrls.country.value,
          notification_type: 'LETTER'
        });
      } else {
        this.assignContactDetailsInFefundsList.emit({
          address_line: fieldCtrls.addressl1.value+' '+fieldCtrls.addressl2.value,
          city: fieldCtrls.townorcity.value,
          county: fieldCtrls.county.value,
          postal_code: fieldCtrls.mpostcode.value,
          country: fieldCtrls.country.value,
          notification_type: 'LETTER'
        });
      }
      } else {
        if( fieldCtrls.addressl1.value == '' ) {
          this.resetForm([false,false,false,false,true,false,false,false,false,false,false,false,false,false], 'address1');
        }
        if(fieldCtrls.addressl1.value != '' && fieldCtrls.addressl1.invalid ) {
          this.resetForm([false,false,false,false,false,true,false,false,false,false,false,false,false,false], 'address1');
        }
        if(fieldCtrls.addressl2.value != '' && fieldCtrls.addressl2.invalid ) {
          this.resetForm([false,false,false,false,false,false,true,false,false,false,false,false,false,false], 'address2');
        }
        if( fieldCtrls.townorcity.value == '' ) {
          this.resetForm([false,false,false,false,false,false,false,true,false,false,false,false,false,false], 'town');
        }
        if(fieldCtrls.townorcity.value != '' && fieldCtrls.townorcity.invalid ) {
          this.resetForm([false,false,false,false,false,false,false,false,true,false,false,false,false,false], 'town');
        }
        if( fieldCtrls.county.value == '' ) {
          this.resetForm([false,false,false,false,false,false,false,false,false,true,false,false,false,false], 'county');
        }
        if(fieldCtrls.county.value != '' && fieldCtrls.county.invalid ) {
          this.resetForm([false,false,false,false,false,false,false,false,false,false,true,false,false,false], 'county');
        }
        if( fieldCtrls.mpostcode.value == '' ) {
          this.resetForm([false,false,false,false,false,false,false,false,false,false,false,true,false,false], 'mpostcode');
        }
        if(fieldCtrls.mpostcode.value != '' && fieldCtrls.mpostcode.invalid ) {
          this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,true,false], 'mpostcode');
        }
        if( fieldCtrls.country.value == '' ) {
          this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,false,true], 'country');
        }
      }

    }

  }

  postcodeValidation(str) {
    this.resetForm([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false], 'all');
    const postcodeField = this.postCodeForm.controls.postcode;
    if (this.postCodeForm.valid) {
      if(str === 'FA') {
        this.notificationService.getAddressByPostcode(postcodeField.value).subscribe(
          refundsNotification => {
            this.addressPostcodeList = refundsNotification['results'];
            this.isShowPickAddress = refundsNotification['header'].totalresults > 0;
            if(!this.isShowPickAddress) {
              this.resetForm([false,false,false,true,false,false,false,false,false,false,false,false,false], 'postcode');
            }
          }
        ),
        (error: any) => {
          this.isShowPickAddress = false;
          this.errorMessage = error.replace(/"/g,"");
        }; 
      } else if (str === 'FS') {
        if(this.postcodeAddress !== undefined && this.postcodeAddress) {
          this.isAddressBoxEmpty = false;
          let addressLine="";
          let addressArray = this.postcodeAddress.ADDRESS.split(",");
          for( let i=0; i<addressArray.length-2; i++ ) {
            addressLine +=addressArray[i]; 
          }
          const addressObject = {
            address_line: addressLine,
            city: this.postcodeAddress.POST_TOWN,
            county: this.postcodeAddress.LOCAL_CUSTODIAN_CODE_DESCRIPTION,
            postal_code: this.postcodeAddress.POSTCODE,
            country: 'United Kingdom',
            notification_type: 'LETTER'
          };
          if(!this.isEditOperationInRefundList) {
          this.assignContactDetails.emit(addressObject);
        } else  {
          this.assignContactDetailsInFefundsList.emit(addressObject);
        }
        } else {
          this.isAddressBoxEmpty = true;
        }
      }
    } else {
      if( postcodeField.value == '' ) {
        this.resetForm([false,false,true,false,false,false,false,false,false,false,false,false,false], 'postcode');
      }
      if(postcodeField.value != '' && postcodeField.invalid ) {
        this.resetForm([false,false,false,true,false,false,false,false,false,false,false,false,false], 'postcode');
      }
    }
  }
  redirection(event:any) {
    this.redirectToIssueRefund.emit(event);
  }
  resetForm(val, field) {
    if(field==='email' || field==='all') {
      this.isEmailEmpty = val[0];
      this.emailHasError = val[1];
    }
    if(field==='postcode' || field==='all') {
      this.isPostcodeEmpty = val[2];
      this.postcodeHasError = val[3];
    }
    if(field==='address1' || field==='all') {
      this.isaddressLine1Empty = val[4];
      this.addressLine1HasError = val[5];
    }
    if(field==='address2' || field==='all') {
      this.addressLine2HasError = val[6];
    }
    if(field==='town' || field==='all') {
      this.isTownOrCityEmpty = val[7];
      this.townOrCityHasError = val[8];
    }
    if(field==='county' || field==='all') {
      this.isCountyEmpty = val[9];
      this.countyHasError = val[10];
    }
    if(field==='mpostcode' || field==='all') {
      this.isMPostcodeEmpty = val[11];
      this.mpostcodeHasError = val[12];
    }
    if(field==='country' || field==='all') {
      this.isCountryEmpty = val[13];
    }
  
  }
}
