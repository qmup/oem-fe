import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
  <nav aria-label="Page navigation example">
    <ul class="pagination pagination-circle pg-blue justify-content-center mt-3">
      <li class="page-item" [ngClass]="{ 'disabled': first }"><a class="page-link" mdbWavesEffect (click)="change(1)">Đầu</a></li>
      <li class="page-item" [ngClass]="{ 'disabled': first }">
        <a class="page-link" aria-label="Previous" mdbWavesEffect (click)="change(currentPage)">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <li
        class="page-item"
        *ngFor="let p of pages"
        [ngClass]="{ 'active': p - 1 == currentPage }">
        <a class="page-link" (click)="change(p)">{{p}}</a>
      </li>
      <li class="page-item" [ngClass]="{ 'disabled': last }">
        <a class="page-link" aria-label="Next" mdbWavesEffect (click)="change(currentPage + 2)">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
      <li class="page-item" [ngClass]="{ 'disabled': last }"><a class="page-link" mdbWavesEffect (click)="change(totalPage)">Cuối</a></li>
    </ul>
  </nav>
  `,
  styles: []
})
export class PaginationComponent implements OnChanges {

  @Input() pageSize: number;
  @Input() currentPage: number;
  @Input() totalPage: number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  first: boolean;
  last: boolean;
  pages: number[] = [];

  ngOnChanges() {
    this.pages = [];
    for (let i = 0; i < this.totalPage; i++) {
      this.pages.push(i + 1);
    }
    this.currentPage === 0 ? this.first = true : this.first = false;
    this.currentPage + 1 === this.totalPage ? this.last = true : this.last = false;
  }

  change(page: number) {
    this.changePage.emit(page);
  }

}
