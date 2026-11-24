# CcpayWebComponent

This project uses Angular 22.2 and TypeScript 6.0.

Use the Node.js version in `.nvmrc` (`nvm use`), then install dependencies with `yarn install --immutable`. Angular 22 requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding changes

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `yarn build` to build the payment library, or `yarn build-prod` for its production package. Run `yarn ng build ccpay-web-component --configuration production` to build the demo application. Build artifacts are stored in `dist/`.

## Running unit tests

Run `yarn test --watch=false --browsers=ChromeHeadless --progress=false` to execute both projects' unit tests via [Karma](https://karma-runner.github.io). Chrome must be installed. To run one project, use `yarn ng test payment-lib` or `yarn ng test ccpay-web-component`.

## Upgrade compatibility

The library's Angular peer dependencies require Angular 22. Browser targets follow Angular 22's baseline of 7 May 2026.

The translation package is pinned to the Angular 22 prerelease `rpx-xui-translation@1.2.20-angular-22-upgrade`, with RxJS 7.8. The payment library declares both packages as peer dependencies so consumers install the supported versions.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Wire-mock 

cd wire-mock

java -jar wiremock-standalone-2.18.0.jar --port 9999 --verbose --match-headers basicAuthCredentails username=payment password=payment

## Cant_pickup_in_dashboard
