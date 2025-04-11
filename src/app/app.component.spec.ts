import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavigationComponent } from './components/shared/navigation/navigation.component';
import { PhaseBannerComponent } from './components/shared/phase-banner/phase-banner.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        PhaseBannerComponent,
        CaseListComponent
      ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'cases', component: CaseListComponent }
      ])]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
