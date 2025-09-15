import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ServiceRequestComponent } from './service-request.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceRequestComponent', () => {
  let component: ServiceRequestComponent;
  let fixture: ComponentFixture<ServiceRequestComponent>;
  const paymentLibComponentStub = () => ({ viewName: {} });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpxTranslateMockPipe ],
      providers: [
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
