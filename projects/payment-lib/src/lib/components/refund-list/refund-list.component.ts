import {Component, OnInit, Input} from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { IRefundList } from '../../interfaces/IRefundList';

@Component({
  selector: 'ccpay-refund-list',
  templateUrl: './refund-list.component.html',
  styleUrls: ['./refund-list.component.css']
})
export class RefundListComponent implements OnInit {
  @Input('USERID') USERID: string;
  @Input('LOGGEDINUSERROLES') LOGGEDINUSERROLES: any[];
  @Input('LOGGEDINUSEREMAIL') LOGGEDINUSEREMAIL:string;

  constructor(private refundService: RefundsService) {
  }

  tableApprovalHeader: string;
  tableRejectedHeader: string;
  submittedRefundList: IRefundList[] = [];
  rejectedRefundList: IRefundList[] = [];
  approvalStatus = 'Sent for approval';
  rejectStatus = 'Update required';
  // approvalStatus = 'sent for approval';
  // rejectStatus = 'sent back';
  errorMessage = null;
  isApproveTableVisible:boolean;
  isRejectTableVisible:boolean;
  dropdownvalue: string;
  isAuthorized: boolean = true;
  userLst
  ngOnInit() {
    
    this.userLst = this.LOGGEDINUSERROLES;

    
    if(this.LOGGEDINUSERROLES.some(i =>i.includes('payments-refund-approver'))){
      this.isAuthorized = true;
    } else {
      this.isApproveTableVisible = false;
      this.isAuthorized = false;
    }

  
    this.tableApprovalHeader = 'Refunds to be approved';
    this.tableRejectedHeader = 'Refunds returned to caseworker';

   if(this.isAuthorized) {
    this.refundService.getRefundList(this.approvalStatus,true).subscribe(
      refundList => {
        this.submittedRefundList = refundList['refund_list'];
        this.isApproveTableVisible = true;
      }
    ),
    (error: any) => {
      this.errorMessage = error.replace(/"/g,"");
    };
  }

    this.refundService.getRefundList(this.rejectStatus,false).subscribe(
      refundList => {
        this.rejectedRefundList = refundList['refund_list'];
        this.isRejectTableVisible = true;
      }
    ),
    (error: any) => {
      this.errorMessage = error.replace(/"/g,"");
    };

  }
  
}