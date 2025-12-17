import { Component, Input, OnInit } from '@angular/core';
import { IPayment } from '../../interfaces/IPayment';
import { INotificationPreview } from '../../interfaces/INotificationPreview';
import { IRefundContactDetails } from '../../interfaces/IRefundContactDetails';
import { NotificationPreviewRequest } from '../../interfaces/NotificationPreviewRequest';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class NotificationPreviewComponent implements OnInit {
  @Input() payment: IPayment;
  @Input() contactDetails: IRefundContactDetails;
  @Input() refundReason: string;
  @Input() refundAmount: number;
  @Input() paymentReference: string;
  @Input() refundReference: string;
  @Input() previewJourney: string;
  @Input() notificationSent: INotificationPreview;

  @Output() notificationPreviewEvent = new EventEmitter<INotificationPreview>();

  notification: INotificationPreview;
  notificationPreviewRequest: NotificationPreviewRequest;
  today: number = Date.now();
  //   errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
  errorMessage = null

  constructor(private errorHandlerService: ErrorHandlerService,
    private notificationService: NotificationService) { }

  ngOnInit() {

    if (this.previewJourney != undefined && this.previewJourney != null && this.previewJourney === 'Notifications sent') {

      this.notification = this.notificationSent;

      if (this.notification != undefined && this.notification != null && this.notification.template_type === 'letter') {
        this.notification.body = this.notification.body.replace(/\r\n/g, '<br/>');
      }
    } else {

      const notficationPreviewRequestBody = new NotificationPreviewRequest(this.payment, this.contactDetails,
        this.refundReason, this.refundAmount, this.refundReference, this.paymentReference);

      this.notificationService.getNotificationPreview(notficationPreviewRequestBody).subscribe(
        res => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(false, false, '');
          this.notification = JSON.parse(res);

          if (this.notification != undefined && this.notification != null && this.notification.template_type === 'letter') {
            this.notification.body = this.notification.body.replace(/\r\n/g, '<br/>');
          }
        },
        (error: any) => {
          this.errorMessage = this.errorHandlerService.getServerErrorMessage(true, false, '');
          console.log(this.errorMessage);
        }
      );

      this.notificationPreviewEvent.emit(this.notification);

    }
  }

}
