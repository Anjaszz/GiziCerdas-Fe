import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'deliveryType',
    standalone: true,
})
export class DeliveryTypePipe implements PipeTransform {
    transform(canPickup: number, canDrop: number): string {
      
        if (canPickup === 1 && canDrop === 0) {
            return 'Pick Up';
        } else if (canPickup === 1 && canDrop === 1) {
            return 'Pick Up & Drop';
        } else if (canPickup === 0 && canDrop === 1) {
            return 'Drop';
        } else {
            return 'Unknown';
        }
    }
}
