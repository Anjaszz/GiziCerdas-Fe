import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
     name: 'discountType',
     standalone: true,
})
export class DiscountTypePipe implements PipeTransform {
     transform(
          isFixed: boolean,
          hasCashback: boolean,
          services: number
     ): string {
          if (isFixed && !hasCashback && !services) {
               return 'Fixed';
          } else if (!isFixed && hasCashback && !services) {
               return 'Cashback';
          } else if (!isFixed && !hasCashback && services) {
               return 'Per Service';
          } else {
               return 'Unknown';
          }
     }
}

@Pipe({
     name: 'discountSelector',
     standalone: true,
})
export class DiscountSelectorPipe implements PipeTransform {
     transform(
          isFixed: boolean,
          isFixedDiscount: number,
          discount_type: string,
          hasCashback: boolean,
          cashback: number,
          cashback_type: string,
          services: number
     ): string | number {
          if (isFixed && !hasCashback && !services) {
               if (discount_type === 'nominal') {
                    return `${this.formattedPrice(isFixedDiscount)} IDR`;
               } else if (discount_type === 'percent') {
                    return `${isFixedDiscount}%`;
               } else {
                    return 'Unknown';
               }
          } else if (!isFixed && hasCashback && !services) {
               if (cashback_type === 'nominal') {
                return `${this.formattedPrice(cashback)} IDR`;
               } else if (cashback_type === 'percent') {
                    return `${cashback}%`;
               } else {
                    return 'Unknown';
               }
          } else if (!isFixed && !hasCashback && services) {
              if (services > 0 && services < 10) {
                return `0${services} Services`
              }
               return services;
          } else {
               return 'Unknown';
          }
     }

     formattedPrice(value: number): string {
          const formattedPrice = Number(value).toLocaleString('id-ID', {
               style: 'decimal',
               minimumFractionDigits: 0,
               maximumFractionDigits: 0,
          });
          return formattedPrice;
     }
}
