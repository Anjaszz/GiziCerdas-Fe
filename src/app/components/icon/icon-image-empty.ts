import { Component } from '@angular/core';

@Component({
    selector: 'ic-image-empty',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.5"
                width="28"
                height="28"
                rx="6"
                fill="black"
                fill-opacity="0.1"
            />
            <path
                d="M24.52 18.82L21.39 11.5C20.82 10.16 19.97 9.40001 19 9.35001C18.04 9.30001 17.11 9.97001 16.4 11.25L14.5 14.66C14.1 15.38 13.53 15.81 12.91 15.86C12.28 15.92 11.65 15.59 11.14 14.94L10.92 14.66C10.21 13.77 9.33 13.34 8.43 13.43C7.53 13.52 6.76 14.14 6.25 15.15L4.52 18.6C3.9 19.85 3.96 21.3 4.69 22.48C5.42 23.66 6.69 24.37 8.08 24.37H20.84C22.18 24.37 23.43 23.7 24.17 22.58C24.93 21.46 25.05 20.05 24.52 18.82Z"
                fill="black"
                fill-opacity="0.3"
            />
            <path
                d="M9.47 10.38C11.3367 10.38 12.85 8.86672 12.85 7C12.85 5.13327 11.3367 3.62 9.47 3.62C7.60328 3.62 6.09 5.13327 6.09 7C6.09 8.86672 7.60328 10.38 9.47 10.38Z"
                fill="black"
                fill-opacity="0.3"
            />
        </svg>
    `,
    standalone: true,
})
export class IconImageEmpty {}
