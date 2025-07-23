import { Component, Input } from '@angular/core';

@Component({
   selector: 'table-badge',
   standalone: true,
   imports: [],
   template: `
      <div
         class="py-2 bg-elevation-surface rounded-md grid place-items-center brightness-95"
      >
         <p class="text-xs text-text-subtler font-medium">{{ content }}</p>
      </div>
   `,
})
export class TableBadgeComponent {
   @Input({ required: true })
   content: string = '';
}
