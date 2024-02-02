import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import {PhaseBannerComponent} from './components/shared/phase-banner/phase-banner.component';
import { NavigationComponent } from './components/shared/navigation/navigation.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { PaymentLibIntComponent } from './components/payment-lib-int/payment-lib-int.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CcdSearchComponent } from './components/ccd-search/ccd-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentLibModule } from '../../projects/payment-lib/src/lib/payment-lib.module';
import { RpxTranslationModule } from 'rpx-xui-translation';

@NgModule({
  declarations: [
    AppComponent,
    PhaseBannerComponent,
    NavigationComponent,
    CaseListComponent,
    PaymentLibIntComponent,
    HeaderComponent,
    FooterComponent,
    CcdSearchComponent
  ],
  imports: [
    BrowserModule,
    PaymentLibModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    RpxTranslationModule.forRoot({
      baseUrl: '/api/translation',
      debounceTimeMs: 300,
      validity: {
        days: 1
      },
      testMode: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
