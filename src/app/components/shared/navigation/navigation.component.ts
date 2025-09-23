import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  todaysDate = Date.now();
  name = '';
  advancedSearchedOpen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {}
    ngOnInit() {
    }


}
