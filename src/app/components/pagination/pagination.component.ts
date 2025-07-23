// pagination.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconModule } from '../icon/icon.module'



@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage: number = 1
  @Input() nextPage: number | null = null
  @Input() itemsPerPage: number = 15
  @Input() variant: 'default' | 'simple' | 'minimal' = 'default'
  @Output() pageChange = new EventEmitter<number>()

  get visiblePages(): number[] {
    const pages: number[] = []
    
  
    if (this.currentPage > 1) {
      pages.push(this.currentPage - 1)
    }
    
    // Tambahkan halaman saat ini
    pages.push(this.currentPage)
    
    // Tambahkan halaman selanjutnya jika ada nextPage
    if (this.nextPage !== null) {
      pages.push(this.nextPage)
    }

    return pages
  }

  onPageChange(page: number): void {
    // Izinkan navigasi ke halaman sebelumnya jika tidak di halaman 1
    // Izinkan navigasi ke halaman selanjutnya jika ada nextPage
    if (
      (page < this.currentPage && this.currentPage > 1) || // Previous page
      (page > this.currentPage && this.nextPage !== null)   // Next page
    ) {
      this.pageChange.emit(page)
    }
  }
}