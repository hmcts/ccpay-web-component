import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle = 'Payment-web-component';
  type = 'BETA';

  constructor(private router: Router) {
    this.router.navigate(['/cases']);
  }
}
