import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-phase-banner',
    templateUrl: './phase-banner.component.html',
    styleUrls: ['./phase-banner.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PhaseBannerComponent implements OnInit {
  @Input('type') type: string;

  constructor() { }

  ngOnInit() {
  }

}
