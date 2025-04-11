import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CaseListComponent } from './case-list.component';

describe('CaseListComponent', () => {
  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;

  beforeEach(waitForAsync(() => {
    const formBuilderStub = () => ({ group: object => ({  remissionCode:"HWF-A1B-23C",amount: 10,refundReason: "Test Reason", refundDDReason:"Test Default reason", reason:"Testing"}) });
    const routerStub = () => ({
      routeReuseStrategy: { shouldReuseRoute: {} },
      onSameUrlNavigation: {},
      navigateByUrl: arg => ({})
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ CaseListComponent ],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Router, useFactory: routerStub },
        { provide: RouterModule, useFactory: routerStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
