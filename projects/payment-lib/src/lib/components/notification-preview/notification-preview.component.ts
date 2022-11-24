import { Component, Input, OnInit } from '@angular/core';
import { IPayment } from '../../interfaces/IPayment';
import { INotificationPreview } from '../../interfaces/INotificationPreview';
import { IRefundContactDetails } from '../../interfaces/IRefundContactDetails';
import { NotificationPreviewRequest } from '../../interfaces/NotificationPreviewRequest';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

@Component({
  selector: 'app-notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.scss']
})
export class NotificationPreviewComponent implements OnInit {
  @Input() payment: IPayment;
  @Input() contactDetails: IRefundContactDetails;
  @Input() refundReason: string;
  @Input() refundAmount: number;
  @Input() paymentReference: string;
  @Input() refundReference: string;

  notification: INotificationPreview;
  notificationPreviewRequest: NotificationPreviewRequest;
  today: number = Date.now();
  errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');

  constructor(private errorHandlerService: ErrorHandlerService,
    private notificationService: NotificationService) { }

  ngOnInit() {

    console.log('Notification app started');

    const notficationPreviewRequestBody = new NotificationPreviewRequest(this.payment, this.contactDetails,
      this.refundReason, this.refundAmount, this.refundReference, this.paymentReference);

    this.notificationService.getNotificationPreview(notficationPreviewRequestBody).subscribe(
      res => {
        this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');

        const JsonResponse = JSON.parse(res);
        console.log("2." + JsonResponse);
        this.notification = JsonResponse['data'];
        console.log("3." + this.notification);

        if (this.notification.template_type === 'letter') {
          this.notification.body = this.notification.body.replace(/\r\n/g, '<br/>');
        }
      },
      (error: any) => {
        this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
        console.log(this.errorMessage);
        window.scrollTo(0, 0);
      });

    console.log('Notification app loaded');
  }

}
