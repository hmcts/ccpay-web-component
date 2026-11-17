import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    template: `
    <h1>This is not the page you were looking for!</h1>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PageNotFoundComponent { }
