import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Employee } from 'src/app/employee/models/employee';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnChanges {
  @Input() isLogin: boolean;
  userAccount: Employee = new Employee();

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnChanges() {
    this.userAccount = this.globalService.getUserAccount();
  }

}
