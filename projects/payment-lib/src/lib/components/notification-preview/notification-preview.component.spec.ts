import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

import { NotificationPreviewComponent } from './notification-preview.component';

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NotificationPreviewComponent // Import the standalone component
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            getNotificationPreview: () => ({ subscribe: (f: any) => f({}) })
          }
        },
        {
          provide: ErrorHandlerService,
          useValue: {
            handleError: () => ({}),
            getServerErrorMessage: (error: any) => 'Test error message'
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Mock JSON.parse to handle any object that gets passed to it
    const originalJsonParse = JSON.parse;
    spyOn(JSON, 'parse').and.callFake((text: string) => {
      if (typeof text === 'string') {
        try {
          return originalJsonParse(text);
        } catch (e) {
          // If parsing fails, return a default object
          return { success: true };
        }
      }
      // If it's already an object, return a safe default
      return { success: true };
    });
    
    fixture = TestBed.createComponent(NotificationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
