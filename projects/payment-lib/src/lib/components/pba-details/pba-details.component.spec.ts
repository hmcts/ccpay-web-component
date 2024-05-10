import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PbaDetailsComponent } from './pba-details.component';

describe('PbaDetailsComponent', () => {
  let component: PbaDetailsComponent;
  let fixture: ComponentFixture<PbaDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PbaDetailsComponent]
    });
    fixture = TestBed.createComponent(PbaDetailsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
