/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'info-circle-icon',
  standalone: true,
  template: `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99935 18.3327C14.5827 18.3327 18.3327 14.5827 18.3327 9.99935C18.3327 5.41602 14.5827 1.66602 9.99935 1.66602C5.41602 1.66602 1.66602 5.41602 1.66602 9.99935C1.66602 14.5827 5.41602 18.3327 9.99935 18.3327Z" stroke="#FF4242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 6.66602V10.8327" stroke="#FF4242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.99609 13.334H10.0036" stroke="#FF4242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `
})
export class InfoCircleIcon {}