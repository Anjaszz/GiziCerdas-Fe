import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
     name: 'displayOrderWeight',
     standalone: true,
})
export class DisplayOrderWeightPipe implements PipeTransform {
     transform(
          weight: string | null ,
          length: string | null ,
          width: string | null ,
          height: string | null 
     ): number | string  {
        const toNum = parseInt(weight ?? '0')

          const volume = (parseInt(length  ?? '0') * parseInt(width  ?? '0') * parseInt(height  ?? '0')) / 5000;

          if (toNum > volume) {
               return toNum;
          } else if (toNum < volume) {
               return volume;
          } else {
               return 0;
          }
     }
}
