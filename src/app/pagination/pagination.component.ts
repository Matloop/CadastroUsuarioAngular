import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination">
      <button (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button (click)="changePage(currentPage + 1)"
              [disabled]="currentPage >= totalPages">Próxima</button>
    </div>
  `,
  styles: [`
    .pagination {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      align-items: center;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Input() totalItems!: number;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageChange.emit(newPage);
    }
  }
}
