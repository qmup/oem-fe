import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
  <nav aria-label="Page navigation example mt-2">
  <ul class="pagination mt-3">
    <li
      class="page-item"
      *ngFor="let p of pages"
      [ngClass]="{ 'active': p == currentPage }">
      <a class="page-link" (click)="change(p)">{{p}}</a>
    </li>
  </ul>
</nav>
  `,
  styles: []
})
export class PaginationComponent {

  @Input() pageSize: number;
  @Input() currentPage: number;
  @Input() totalPage: number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  pages: number[] = [];
  constructor() { }

  change(page: number) {
    this.changePage.emit(page);
  }

}
