import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { Schedule, ScheduleModel } from '../../models/schedule';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { Employee } from 'src/app/employee/models/employee';
import { PlacePagination, ManageWorkplace } from 'src/app/place/models/place';
import { ToastService } from 'ng-uikit-pro-standard';
import { ScheduleDetailComponent } from '../schedule-detail/schedule-detail.component';
import { PaginationResponse, AssignTask } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';
import { TaskBasicService } from '../../service/task-basic.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { ZoneService } from 'src/app/place/services/zone.service';
import { ZonePagination } from 'src/app/place/models/zone';
import { Task } from '../../models/task';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  id: number;
  sorted = false;
  timeTo: any;
  timeFrom: any;
  scheduleList: Schedule[] = [];
  scheduleResponse: PaginationResponse = new PaginationResponse();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  scheduleCM: ScheduleModel = new ScheduleModel();
  week = [];
  workplaceList = [];
  employeeList = [];
  modalRef: BsModalRef;
  userAccount: Employee;
  fieldSort = 'id';
  sortBoolean = false;
  sortValue = '';
  searchValue = '';
  currentCompany: any;
  currentZone: any;
  currentWorkplace: any;
  companyList = [];
  zoneList = [];
  placeList = [];
  isSelectCompany = false;
  isSelectWorkplace = false;
  isSelectZone = false;
  taskBasicList = [];
  taskBasic = [];
  selectedTaskBasic = [];
  currentPage = 0;
  currentSize: number;
  selectedDay = [];
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();

  constructor(
    private scheduleService: ScheduleService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private modalService: BsModalService,
    private globalService: GlobalService,
    private workplaceService: PlaceService,
    private taskBasicService: TaskBasicService,
    private companyService: CompanyService,
    private zoneService: ZoneService,
  ) { }

  ngOnInit() {
    this.week = this.globalService.week;
    this.userAccount = this.globalService.getUserAccount();
    this.getSchedule();
    this.getEmployee();
    this.getCompany();
  }


  sort(field: string) {
    this.sortBoolean = ! this.sortBoolean;
    if (this.sortBoolean) {
      this.sortValue = 'asc';
    } else {
      this.sortValue = 'desc';
    }
    this.fieldSort = field;
    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getAll(this.searchValue, this.userAccount.id, this.sortValue, this.fieldSort, this.currentPage, 10)
      .then(
        (response: PaginationResponse) => {
          this.scheduleList = response.content;
          this.scheduleList.forEach((element: any) => {
            element.endTime = new Date(element.startTime).getTime() + element.duration;
          });
          this.scheduleResponse = response;
          this.scheduleList.forEach(element => {
            element.dayList = element.daysOfWeek.split(',');
          });
        }
      );
  }

  suggestTaskBasic() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', 0, 99)
      .then(
        (response: any) => {
          this.taskBasicList = response.content;
          this.workplaceService.getTaskBasic(this.manageWorkplace.workplaceId)
            .then(
              (response2) => {
                this.taskBasic = response2;
                this.taskBasicList.forEach((element1, i) => {
                  this.taskBasic.forEach((element2, j) => {
                    if (element1.id === element2.id) {
                      element1.checked = true;
                      this.selectedTaskBasic.push(element1);
                      i++;
                      j = 0;
                    }
                  });
                });
              }
            );
        }
      );
  }

  changeCheckbox(id: number, event: any) {
    if (event.checked && !this.selectedTaskBasic.includes((task: Task) => task.id === id)) {
      this.selectedTaskBasic.push(this.taskBasicList.find(task => task.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(task => task.id !== id);
    }
  }

  getEmployee() {
    this.employeeService.getAvailableEmployee(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map((employee) => {
            return {
              value: employee.id,
              label: employee.fullName,
              icon: employee.picture
            };
          });
        }
      );
  }

  getCompany() {
    this.companyService.getCompanyByManager(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.companyList = response.content.map((company) => {
            return {
              value: company.id,
              label: company.name,
              icon: company.picture
            };
          });
        }
      );
  }

  selectCompany(e: any) {
    this.manageWorkplace.companyId = e.value;
    this.isSelectCompany = true;
    this.isSelectWorkplace = false;
    this.currentCompany = e;
    this.getZone(e.value);
  }

  selectEmployee(e: any) {
    this.assignTask.assigneeId = e.value;
  }

  getZone(companyId: number) {
    this.zoneService.getAll(this.userAccount.id, companyId, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneList = response.listOfZone.content.map((zone) => {
            return {
              value: zone.id,
              label: zone.name,
              icon: zone.picture
            };
          });
        }
      );
  }

  selectZone(e: any) {
    this.manageWorkplace.zoneId = e.value;
    this.currentZone = e;
    this.isSelectZone = true;
    this.getWorkplace(e.value);
  }

  getWorkplace(zoneId: number) {
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, zoneId, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map((place) => {
            return {
              value: place.id,
              label: `${place.name}`,
              icon: place.picture
            };
          });
        }
      );
  }

  selectWorkplace(e: any) {
    this.isSelectWorkplace = true;
    this.manageWorkplace.workplaceId = e.value;
    this.currentWorkplace = e;
    this.suggestTaskBasic();
  }

  changeDuration(e: any) {
    console.log(e);
    this.scheduleCM.duration = e;
  }

  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openDetailModal(id: number) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { scheduleId: id }
    };
    this.modalRef = this.modalService.show( ScheduleDetailComponent , modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getSchedule());
  }

  switch(e: any, id: number) {
    e.target.checked ?
      this.scheduleService.updateField(id, 'status', 1)
        .then(
          () => this.getSchedule()
        ) :
      this.scheduleService.updateField(id, 'status', 0)
        .then(
          () => this.getSchedule()
        );
  }

  createSchedule() {
    const option = 1;
    this.scheduleCM.taskBasics = this.selectedTaskBasic;
    this.scheduleCM.duration *= 60000;
    this.scheduleCM.assignerId = this.userAccount.id;
    this.scheduleCM.workplaceId = this.currentWorkplace.value;
    this.scheduleCM.status = 1;
    this.scheduleCM.daysOfWeek = this.week.filter(d => d.check === true).map(d => d.id).join(',');
    this.scheduleService.create(this.scheduleCM, option)
      .then(
        () => {
          this.scheduleCM.duration /= 60000;
          this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.scheduleList = [],
          this.getSchedule();
        },
        () => {
          this.toastService.success('Đã có lỗi xảy ra', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
        }
      );
  }

  changePage1(event) {
    this.currentPage = event - 1;
  }

  removeSchedule() {
    const options = { positionClass: 'toast-bottom-right' };
      this.scheduleService.updateField(this.id, 'status', 2)
      .then(
        () => {
          this.toastService.success('Xóa công việc thành công', '', options);
          this.deleteModal.hide();
          this.scheduleList = [];
          this.getSchedule();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', options);
        }
      );
  }
}
