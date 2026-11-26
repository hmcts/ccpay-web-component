# CcpayWebComponent

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## GOV.UK Frontend

Component templates use [GOV.UK Frontend](https://design-system.service.gov.uk/components/) classes (`govuk-*`) only. The legacy GOV.UK Elements / GOV.UK Template classes (`button`, `heading-large`, `form-hint`, `error-summary`, …) are no longer emitted.

Host applications must install `govuk-frontend` v6, compile its Sass and serve its font and image assets. The library initialises GOV.UK JavaScript within the web component and re-initialises components when Angular renders new views. The host page must include the standard `govuk-template`, `govuk-template__body`, `js-enabled` and `govuk-frontend-supported` classes described in the [GOV.UK Frontend installation guidance](https://frontend.design-system.service.gov.uk/installing-with-npm/).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding changes

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Wire-mock 

cd wire-mock

java -jar wiremock-standalone-2.18.0.jar --port 9999 --verbose --match-headers basicAuthCredentails username=payment password=payment

## Cant_pickup_in_dashboard
