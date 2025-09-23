import { Component, OnInit } from '@angular/core';

import { ICase } from '../../interfaces/ICase';
import { CASES } from './mock-case-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent implements OnInit {
  pageTitle: string = 'Case list';
  cases: ICase[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.cases = CASES;
  }

}
