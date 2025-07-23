import { Component } from '@angular/core';

@Component({
    selector: 'ic-close-simple-bold',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `,
    standalone: true,
})
export class IconCloseSimpleBold {}
