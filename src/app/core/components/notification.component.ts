import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <div class="btn-group" mdbDropdown>
      <i class="fa fa-bell" classInside="dropdown-toggle" mdbDropdownToggle class="waves-effect"
                mdbWavesEffect></i>
      <div class="dropdown-menu dropdown-primary">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
        <div class="divider dropdown-divider"></div>
        <a class="dropdown-item" href="#">Separated link</a>
      </div>
    </div>
  `,
  styles: [`

  `]
})
export class NotificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
