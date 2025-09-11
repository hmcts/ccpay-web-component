import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'ccpay-error-banner',
    templateUrl: './error-banner.component.html',
    styleUrls: ['./error-banner.component.scss'],
    standalone: true,
    imports: []
})

export class ErrorBannerComponent implements OnInit {
  @Input('errorMessage') errorMessage;

  constructor(
  ) {}

  ngOnInit() {

  }
}
