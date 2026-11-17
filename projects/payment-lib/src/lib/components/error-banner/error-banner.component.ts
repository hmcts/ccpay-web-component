import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';



@Component({
    selector: 'ccpay-error-banner',
    templateUrl: './error-banner.component.html',
    styleUrls: ['./error-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class ErrorBannerComponent implements OnInit {
  @Input('errorMessage') errorMessage;

  constructor(
  ) {}

  ngOnInit() {

  }
}
