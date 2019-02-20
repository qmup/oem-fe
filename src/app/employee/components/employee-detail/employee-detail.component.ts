import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

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

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
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

}
