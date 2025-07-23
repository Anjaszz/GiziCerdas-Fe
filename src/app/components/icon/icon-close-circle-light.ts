import { Component } from '@angular/core';

@Component({
    selector: 'ic-close-circle-light',
    template: `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.4998 7.50033L7.49984 12.5003M7.49984 7.50033L12.4998 12.5003M18.3332 10.0003C18.3332 14.6027 14.6022 18.3337 9.99984 18.3337C5.39746 18.3337 1.6665 14.6027 1.6665 10.0003C1.6665 5.39795 5.39746 1.66699 9.99984 1.66699C14.6022 1.66699 18.3332 5.39795 18.3332 10.0003Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `,
    standalone: true,
})
export class IconCloseCircleLight {}
