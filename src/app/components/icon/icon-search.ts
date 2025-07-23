/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
    selector: 'ic-search',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="8.54167"
                cy="8.74992"
                rx="5.41667"
                ry="5.41667"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="square"
            />
            <path
                d="M13.125 13.3333L16.4583 16.6666"
                stroke="currentColor"
                [attr.stroke-width]="strokeW"
                stroke-linecap="square"
            />
        </svg>
    `,
    standalone: true,
})
export class IconSearch {
    @Input() strokeW: string = '1.5';
}
