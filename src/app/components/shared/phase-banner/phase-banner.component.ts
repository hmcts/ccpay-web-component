import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-phase-banner',
    templateUrl: './phase-banner.component.html',
    styleUrls: ['./phase-banner.component.css'],
    standalone: false
})
export class PhaseBannerComponent implements OnInit {
  @Input('type') type: string;

  constructor() { }

  ngOnInit() {
  }

}
