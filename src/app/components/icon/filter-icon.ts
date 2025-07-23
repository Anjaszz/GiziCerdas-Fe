/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'ic-filter',
  standalone: true,
  template: `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5026 1.75H15.5026C16.4193 1.75 17.1693 2.5 17.1693 3.41667V5.25C17.1693 5.91667 16.7526 6.75 16.3359 7.16667L12.7526 10.3333C12.2526 10.75 11.9193 11.5833 11.9193 12.25V15.8333C11.9193 16.3333 11.5859 17 11.1693 17.25L10.0026 18C8.91927 18.6667 7.41927 17.9167 7.41927 16.5833V12.1667C7.41927 11.5833 7.08594 10.8333 6.7526 10.4167L3.58594 7.08333C3.16927 6.66667 2.83594 5.91667 2.83594 5.41667V3.5C2.83594 2.5 3.58594 1.75 4.5026 1.75Z" stroke="#8993A5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.10833 1.75L5 8.33333" stroke="#8993A5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>



  `
})
export class FilterIcon {}