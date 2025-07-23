import { Component } from '@angular/core';

@Component({
	selector: 'ic-sun',
	template: `
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.99935 1.66602V3.33268M9.99935 16.666V18.3327M4.10783 4.10763L5.28283 5.28263M14.7161 14.7159L15.8911 15.8909M1.66602 9.99935H3.33268M16.666 9.99935H18.3327M5.28283 14.7159L4.10783 15.8909M15.8911 4.10763L14.7161 5.28263M13.3327 9.99935C13.3327 11.8403 11.8403 13.3327 9.99935 13.3327C8.1584 13.3327 6.66602 11.8403 6.66602 9.99935C6.66602 8.1584 8.1584 6.66602 9.99935 6.66602C11.8403 6.66602 13.3327 8.1584 13.3327 9.99935Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	`,
	standalone: true,
})
export class IconSun {}
