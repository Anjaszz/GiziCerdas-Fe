import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateTrolley',
  standalone: true
})
export class CustomDateTrolleyPipe implements PipeTransform {
	transform(value: string | Date): string {
		// Assuming input is in ISO format
		const date = new Date(value);
	 
		// Define months for conversion
		const months = [
		  'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
		  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
		];
	 
		// Convert date to desired format
		const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
	 
		return formattedDate;
	   }
	 
  }


