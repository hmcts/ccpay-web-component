import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { initAll } from 'govuk-frontend';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements AfterViewInit {
  pageTitle = 'Payment-web-component';
  type = 'BETA';

  constructor(private router: Router) {
    this.router.navigate(['/cases']);
  }

  ngAfterViewInit() {
    initAll();
  }
}
