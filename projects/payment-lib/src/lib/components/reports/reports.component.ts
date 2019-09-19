import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'ccpay-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportsForm: FormGroup;
  startDate: string;
  endDate: string;
 // maxDate: string;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.fromValidation();
    //this.maxDate = new Date().getTime();   
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
 }

  fromValidation() {
    this.reportsForm = this.formBuilder.group({
      selectedreport: new FormControl('') ,
      startDate: new FormControl(''),
      endDate: new FormControl('') });
      
}

onSelectionChange(value: string) {
  
}


  downloadReport(){
    alert('Ready for Download!!');
  }
}
