import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/employee/models/employee';

@Component({
  selector: 'app-profile-update-information',
  templateUrl: './profile-update-information.component.html',
  styleUrls: ['./profile-update-information.component.scss']
})
export class ProfileUpdateInformationComponent implements OnInit {

  info: Employee;
  optionsSex = [];
  gender: number;

  constructor() { }

  ngOnInit() {
    this.optionsSex = [
      { value: 1, label: 'Nam'},
      { value: 2, label: 'Nữ'},
    ];
    if (this.info.sex === true) {
      this.gender = 1;
    } else {
      this.gender = 2;
    }
  }

  changeAddress(e: any) {
    this.info.address = e;
  }

  updateEmployee() {

  }

}
