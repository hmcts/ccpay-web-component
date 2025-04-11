import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreviewComponent } from './notification-preview.component';

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: []
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
