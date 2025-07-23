/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-copy-doc',
  standalone: true,
  template: `
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.91797 7.81732V9.56732C9.91797 11.9007 8.98463 12.834 6.6513 12.834H4.43464C2.1013 12.834 1.16797 11.9007 1.16797 9.56732V7.35065C1.16797 5.01732 2.1013 4.08398 4.43464 4.08398H6.18464" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.91693 7.81732H8.05026C6.65026 7.81732 6.18359 7.35065 6.18359 5.95065V4.08398L9.91693 7.81732Z" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.76562 1.16602H9.09896" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.08203 2.91602C4.08203 1.94768 4.8637 1.16602 5.83203 1.16602H7.36036" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.8345 4.66602V8.27685C12.8345 9.18102 12.0995 9.91602 11.1953 9.91602" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.832 4.66602H11.082C9.76953 4.66602 9.33203 4.22852 9.33203 2.91602V1.16602L12.832 4.66602Z" stroke="#3815FF" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
})
export class CopyDocIconComponent {
  @Input() size: string = '16';  
  @Input() color: string = '#44546F';  
}