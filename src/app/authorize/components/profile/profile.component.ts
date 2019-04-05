import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  info: Employee;

  constructor(
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.info = this.globalService.getUserAccount();
  }

}
