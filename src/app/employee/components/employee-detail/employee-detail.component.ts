import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { Manager } from 'src/app/manager/models/manager';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  employee: Employee = new Employee();
  isShowMore = false;
  id: number;
  sub: any;
  managerName: string;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private managerService: ManagerService,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getEmployeeDetail(this.id);
    });
  }

  getEmployeeDetail(id: number) {
    this.employeeService.getById(id)
      .then(
        (response: Employee) => {
          this.employee = response;
        }
      );
  }

  getManager() {
    this.managerService.getAll()
      .then(
        (response: Manager[]) => {
          this.managerName = response.find((manager: Manager) => manager.id === this.employee.managerId).fullName;
        }
      );
  }
}
