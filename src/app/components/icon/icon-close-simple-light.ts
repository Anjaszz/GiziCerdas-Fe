import { Component } from '@angular/core';

@Component({
    selector: 'ic-close-simple-light',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `,
    standalone: true,
})
export class IconCloseSimpleLight {}
