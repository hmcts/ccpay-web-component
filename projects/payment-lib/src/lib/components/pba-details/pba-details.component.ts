import { Component, Input, OnInit } from '@angular/core';
import { IPayment } from '../../interfaces/IPayment';

@Component({
    selector: 'ccpay-pba-details',
    templateUrl: './pba-details.component.html',
    styleUrls: ['./pba-details.component.css'],
    standalone: false
})
export class PbaDetailsComponent implements OnInit {
  @Input() payment: IPayment;

  constructor() { }

  ngOnInit() {
  }

}
