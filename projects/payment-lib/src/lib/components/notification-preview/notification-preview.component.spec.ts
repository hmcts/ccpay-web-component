import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NotificationPreviewComponent } from './notification-preview.component';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  beforeEach(waitForAsync(() => {
    const notificationServiceStub = () => ({
      getNotificationPreview: requestBody => ({ subscribe: f => f('{}') })
    });
    const errorHandlerServiceStub = () => ({
      getServerErrorMessage: (showError, isServerError, errorMsg) => ({})
    });
    
    TestBed.configureTestingModule({
      imports: [NotificationPreviewComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        provideHttpClient(withInterceptorsFromDi())
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
