import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  pageTitle = 'Payment-web-component';
  type = 'BETA';

  constructor(private router: Router) {
    this.router.navigate(['/cases']);
  }
}
