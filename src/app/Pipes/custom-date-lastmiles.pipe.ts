import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

@Pipe({
     name: 'customDateLastmiles',
     standalone: true,
})
export class CustomDateLastmilesPipe implements PipeTransform {
 
     transform(value: Date): string {
          const datePipe: DatePipe = new DatePipe('id-ID'); // 'id-ID' for Indonesian locale
          const dayOfWeek = datePipe.transform(value, 'EEEE');
          const dayOfMonth = datePipe.transform(value, 'dd');
          const month = datePipe.transform(value, 'MMMM'); // Use 'MMMM' for the full month name
          const year = datePipe.transform(value, 'yyyy');
          const time = datePipe.transform(value, 'hh:mm a');

          return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} ${time}`;
     }
}


@Pipe({
     name: 'customDatenoHour',
     standalone: true,
})
export class CustomDateNoHourPipe implements PipeTransform {
 
     transform(value: Date): string {
          const datePipe: DatePipe = new DatePipe('id-ID'); // 'id-ID' for Indonesian locale
          const dayOfWeek = datePipe.transform(value, 'EEEE');
          const dayOfMonth = datePipe.transform(value, 'dd');
          const month = datePipe.transform(value, 'MMMM'); // Use 'MMMM' for the full month name
          const year = datePipe.transform(value, 'yyyy');

          return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
     }
}

@Pipe({
     name: 'customHour24',
     standalone: true,
})
export class CustomHour24Pipe implements PipeTransform {
 
     transform(value: Date): string {
          const datePipe: DatePipe = new DatePipe('id-ID'); // 'id-ID' for Indonesian locale
          const time = datePipe.transform(value, 'HH:mm');

          return `${time}`;
     }
}