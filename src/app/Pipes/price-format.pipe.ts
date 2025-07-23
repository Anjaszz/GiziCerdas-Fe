import { Pipe, PipeTransform } from '@angular/core';
import { DateSelected } from 'src/definition/global.definition';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: string): string {
    const formattedPrice = Number(value).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formattedPrice.replace('IDR', 'Rp.').replace(' ', '')
  }


}

@Pipe({
  name: 'lastTrackPipe',
  standalone: true
})
export class LastTrackPipe implements PipeTransform {

  transform(value: Date | undefined): string {
    if (!value) return '-';

    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - new Date(value).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Under 5 minutes
    if (diffInMinutes < 5) {
      return 'about moment ago';
    }

    // Between 5-10 minutes
    if (diffInMinutes >= 5 && diffInMinutes < 10) {
      return 'about 5 minutes ago';
    }

    // Multiple of 10 minutes and under 1 hour
    if (diffInMinutes >= 10 && diffInMinutes < 60) {
      const roundedMinutes = Math.floor(diffInMinutes / 10) * 10;
      return `about ${roundedMinutes} minutes ago`;
    }

    // Multiple of 1 hour and under 1 day
    if (diffInHours >= 1 && diffInHours < 24) {
      const hourText = diffInHours === 1 ? 'hour' : 'hours';
      return `about ${diffInHours} ${hourText} ago`;
    }

    // Multiple of 1 day and under 1 month (30 days)
    if (diffInDays >= 1 && diffInDays < 30) {
      const dayText = diffInDays === 1 ? 'day' : 'days';
      return `about ${diffInDays} ${dayText} ago`;
    }

    // Multiple of 1 month and under 1 year (365 days)
    if (diffInDays >= 30 && diffInDays < 365) {
      const monthText = Math.floor(diffInDays / 30) === 1 ? 'month' : 'months';
      return `about ${Math.floor(diffInDays / 30)} ${monthText} ago`;
    }

    // Default case (more than 1 year)
    return value.toLocaleDateString();
  }
}



@Pipe({
	name: 'findDateInvoice',
	standalone: true,
})
export class FindDateInvoice implements PipeTransform {
	transform(
		dayCalendar: number,
		monthCalendar: number,
		yearCalendar: number,
		dateSelected: DateSelected[] | undefined
	): boolean {
		const groupDate: DateSelected = {
			day: dayCalendar,
			month: monthCalendar,
			year: yearCalendar,
		};

		let finalResult: boolean = false;

		if (dateSelected !== undefined) {
			dateSelected.forEach((item) => {
				if (
					item.day === groupDate.day &&
					item.month === groupDate.month &&
					item.year === groupDate.year
				) {
					finalResult = true;
				}
			});
		}


		return finalResult;
	}
}

@Pipe({
    name: 'booleanize',
    standalone: true,
})
export class BooleanizePipe implements PipeTransform {
    transform(value: any): boolean {
        if (value === 'false') return false;
        return Boolean(value);
    }
}