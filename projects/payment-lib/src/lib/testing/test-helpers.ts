import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

// Mock Pipes
@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
export class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'ccdHyphens',
  standalone: false
})
export class CcdHyphensMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'capitalize',
  standalone: false
})
export class CapitalizeMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

// Common Test Stubs
export const createFormBuilderStub = () => ({
  group: (config: any) => new FormGroup({}),
  array: (controls: any[]) => new FormArray(controls || []),
  control: (value: any) => new FormControl(value)
});

export const createRouterStub = () => ({
  routeReuseStrategy: { shouldReuseRoute: {} },
  onSameUrlNavigation: {},
  navigateByUrl: (arg: any) => Promise.resolve(true),
  navigate: (commands: any[]) => Promise.resolve(true)
});

export const createPaymentViewServiceStub = () => ({
  postPaymentGroupWithRemissions: (arg: any, id: any, requestBody: any) => of({}),
  postPaymentGroupWithRetroRemissions: (arg: any, id: any, requestBody: any) => of({}),
  postRefundRetroRemission: (requestBody: any) => of('{}'),
  postRefundsReason: (requestBody: any) => of({}),
  getBSfeature: () => of({}),
  getPaymentGroups: (ccdCaseNumber: string) => of([]),
  getPaymentGroupDetails: (paymentGroupRef: string) => of({}),
  patchPaymentGroupWithRemissions: (arg: any, id: any, requestBody: any) => of({})
});

export const createPaymentLibComponentStub = () => ({
  SELECTED_OPTION: {},
  bspaymentdcn: {},
  CCD_CASE_NUMBER: 'test-case-number',
  iscancelClicked: false,
  isFromRefundStatusPage: false,
  viewName: 'test-view',
  REFUNDLIST: [],
  TAKEPAYMENT: false,
  SERVICEREQUEST: {},
  ISTURNOFF: false,
  isFromServiceRequestPage: false,
  ISBSENABLE: false,
  isFromPaymentDetailPage: false,
  addPaymentGroup: () => ({}),
  paymentGroupResponse: {},
  paymentGroups: [],
  API_ROOT: 'http://test-api',
  USERID: 'test-user',
  LOGGEDINUSERROLES: ['test-role'],
  LOGGEDINUSEREMAIL: 'test@test.com'
});

export const createRefundsServiceStub = () => ({
  getRefundReasons: () => of([]),
  postRefund: (requestBody: any) => of({}),
  getRefundList: (userId: string) => of([])
});

export const createOrderslistServiceStub = () => ({
  setisFromServiceRequestPage: (arg: any) => ({}),
  setnavigationPage: (page: string) => ({}),
  setpaymentPageView: (view: any) => ({}),
  setOrderRef: (orderRef: string) => ({}),
  getOrderRef: () => 'test-order-ref'
});

export const createNotificationServiceStub = () => ({
  addNotification: (notification: any) => ({}),
  getNotifications: () => of([])
});

export const createChangeDetectorRefStub = () => ({
  detectChanges: () => ({}),
  markForCheck: () => ({})
});

export const createBulkScaningPaymentServiceStub = () => ({
  getBSPayments: () => of([]),
  postBSPayment: (requestBody: any) => of({}),
  putBSPayment: (dcn: string, requestBody: any) => of({})
});

// Common test imports
export const COMMON_TEST_IMPORTS = [
  HttpClientTestingModule
];

// Common test providers
export const COMMON_TEST_PROVIDERS = [
  { provide: FormBuilder, useFactory: createFormBuilderStub }
];
