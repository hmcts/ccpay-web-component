import { Component, ViewChild, Input, ChangeDetectorRef, Inject } from '@angular/core';
import type { PaymentLibComponent } from '../../payment-lib.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule} from "@angular/material/paginator";
import { CcdHyphensPipe} from "../../pipes/ccd-hyphens.pipe";
import { DatePipe} from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IRefundList } from '../../interfaces/IRefundList';
import { OrderslistService } from '../../services/orderslist.service';
import { ActivatedRoute, Router } from '@angular/router';
type PaymentLibAlias = PaymentLibComponent;
@Component({
  selector: 'ccpay-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CcdHyphensPipe, DatePipe],
})
export class TableComponent {
  @Input('DATASOURCE') DATASOURCE: any[];
  @Input('STATUS') STATUS: string;
  @Input('errorMessage') errorMessage: string;
  isApprovalFlow: boolean;
  // displayedColumns = ['ccdCaseNumber', 'refundReference', 'reason', 'createBy', 'updateDate', 'Action'];
  displayedColumns = ['ccd_case_number', 'refund_reference', 'user_full_name', 'date_created', 'date_updated', 'Action'];

  dataSource: MatTableDataSource<any>;
  userLst;
  serviceLst;
  actualcount: number;
  count: number;
  refundList: IRefundList[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Inject('PAYMENT_LIB') private paymentLibComponent: PaymentLibAlias,
    private cdRef: ChangeDetectorRef,
    private OrderslistService: OrderslistService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.errorMessage = this.errorMessage;
    if (this.STATUS.toLowerCase() === 'sent for approval') {
      this.isApprovalFlow = true;
    } else {
      this.isApprovalFlow = false;
    }
    this.refundList = this.DATASOURCE;
    this.dataSource = new MatTableDataSource(this.refundList);
    this.actualcount = this.dataSource.data.length;
    if (this.refundList !== undefined) {
      this.userLst = this.refundList.reduce((r, { user_full_name }) => (r[user_full_name] = '', r), {});
      this.userLst = Object.keys(this.userLst);
      this.userLst.sort((a, b) => a.toString().localeCompare(b));
      this.serviceLst = this.refundList.reduce((r, { service_type }) => (r[service_type] = '', r), {});
      this.serviceLst = Object.keys(this.serviceLst);
      this.serviceLst.sort((a, b) => a.toString().localeCompare(b));
    }

  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {

    this.dataSource.sort = this.sort;

    //const sortState: Sort = {active: 'date_updated', direction: 'desc'};
    // this.sort.active = sortState.active;
    // this.sort.direction = sortState.direction;
    // this.sort.sortChange.emit(sortState);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdRef.detectChanges();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectchange(args) {
    this.dataSource.filter = args.target.value;
    this.actualcount = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
  }
  goToRefundProcessComponent(refundReference: string, refundData: IRefundList) {
    this.paymentLibComponent.refundlistsource = refundData;
    this.paymentLibComponent.refundReference = refundReference;
    this.paymentLibComponent.viewName = 'process-refund';
  }
  goToRefundViewComponent(refundReference: string, refundData: IRefundList) {
    this.OrderslistService.setRefundView(refundData);
    this.paymentLibComponent.viewName = 'refundstatuslist';
    this.paymentLibComponent.CCD_CASE_NUMBER = refundData.ccd_case_number;
    this.paymentLibComponent.isRefundStatusView = true;
    this.paymentLibComponent.isCallFromRefundList = true;
  }
  goToCaseReview(ccdCaseNumber: string, refundData: IRefundList) {
    this.router.navigate([`/cases/case-details/${ccdCaseNumber}`], { relativeTo: this.activeRoute });
  }
}
