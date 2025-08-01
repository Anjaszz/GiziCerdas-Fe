/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-trash-essential',
  standalone: true,
  template: `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 3.98763C11.78 3.76763 9.54667 3.6543 7.32 3.6543C6 3.6543 4.68 3.72096 3.36 3.8543L2 3.98763" stroke="#8993A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.66797 3.31398L5.81464 2.44065C5.9213 1.80732 6.0013 1.33398 7.12797 1.33398H8.87464C10.0013 1.33398 10.088 1.83398 10.188 2.44732L10.3346 3.31398" stroke="#8993A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5669 6.09375L12.1336 12.8071C12.0603 13.8537 12.0003 14.6671 10.1403 14.6671H5.86026C4.00026 14.6671 3.94026 13.8537 3.86693 12.8071L3.43359 6.09375" stroke="#8993A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.88672 11H9.10672" stroke="#8993A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.33203 8.33398H9.66536" stroke="#8993A5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
})
export class TrashEssentialIcon {
  @Input() size: string = '16';  
  @Input() color: string = '#44546F';  
}