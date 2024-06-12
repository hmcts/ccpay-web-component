import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreviewComponent } from './notification-preview.component';
import {NotificationService} from "../../services/notification/notification.service";

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  const notificationServiceStub = () => ({
    getNotificationPreview: paymentReference => ({ subscribe: f => f({}) })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
