import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionStatus',
  standalone: true
})
export class TransactionStatusPipe implements PipeTransform {
  transform(status: string | number | null | undefined): string {
    if (status === null || status === undefined) return '-';
    
    // Convert to number if it's a string
    const statusCode = typeof status === 'string' ? parseInt(status, 10) : status;
    
    switch (statusCode) {
      case 1:
        return 'Bermasalah';
      case 2:
        return 'Dibatalkan';
      case 3:
        return 'Menuju Alamat Akhir';
      case 4:
        return 'Selesai';
      case 5:
        return 'Menunggu Pickup';
      case 7:
        return 'Dalam Pengiriman';
      default:
        return `Status ${status}`;
    }
  }
}