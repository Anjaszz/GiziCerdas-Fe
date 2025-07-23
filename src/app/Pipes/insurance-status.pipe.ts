import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'insuranceStatus',
  standalone: true
})
export class InsuranceStatusPipe implements PipeTransform {

  transform(value: string): string {
    return value === 'mandatory' ? 'Ya' : 'Tidak';
  }

}
