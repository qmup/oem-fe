import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { Manager } from '../../models/manager';
import { TaskService } from 'src/app/task/service/task.service';
import { Task } from 'src/app/task/models/task';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Employee } from 'src/app/employee/models/employee';
import { ZoneService } from 'src/app/place/services/zone.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { Company } from 'src/app/place/models/company';
import { Zone } from 'src/app/place/models/zone';
import { Place } from 'src/app/place/models/place';
import { PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './manager-detail.component.html',
  styleUrls: ['./manager-detail.component.scss']
})
export class ManagerDetailComponent implements OnInit {

  id: number;
  url: any;
  sub: any;
  @ViewChild('createEmployeeModal') createEmployeeModal: ModalDirective;
  @ViewChild('createWorkplaceModal') createWorkplaceModal: ModalDirective;
  @ViewChild('moreEmp') empToggle: any;
  @ViewChild('moreWP') workplaceToggle: any;
  manager: Manager = new Manager();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  filesToUpload: FileList;
  isShowMore1 = false;
  isShowMore2 = false;
  isSelectCompany = false;
  isSelectZone = false;
  employeeList: any[];
  employeeListByManager: Employee[] = [];
  employeeResponseByManager: PaginationResponse;
  workplaceListByManager: Place[] = [];
  workplaceResponseByManager: PaginationResponse;
  companyList: any[];
  zoneList: any[];
  placeList: any[];
  taskList: Task[];
  listEmployeeId: number[];
  listWorkplaceId: number[];

  constructor(
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private zoneService: ZoneService,
    private workplaceService: PlaceService
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getEmployeeByManager(this.id);
    });
    this.getInfo();
    this.getEmployeeTask();
    this.getEmployee();
    this.getCompany();
  }

  getInfo() {
    this.employeeService.getById(this.id)
      .then(
        (response: Manager) => {
          this.manager = response;
        }
      );
  }

  getEmployeeTask() {
    this.taskService.getTodayTask(1)
      .then(
        (response) => {
          this.taskList = response;
        }
      );
  }

  getEmployee() {
    this.employeeService.getAll()
      .then(
        (response: Employee[]) => {
          this.employeeList = response.map((employee) => {
            return {
              value: employee.id,
              label: employee.fullName,
              icon: employee.picture
            };
          });
        }
      );
  }

  getEmployeeByManager(managerId: number) {
    this.employeeService.getEmployeeByManager(managerId, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeListByManager = response.content;
          this.employeeResponseByManager = response;
        }
      );
  }

  getWorkplaceByManager(managerId: number) {
    // this.workplaceService.getWorkplaceByManager(managerId, '', 'id', 0, 99)
    //   .then(
    //     (response: PaginationResponse) => {
    //       this.workplaceListByManager = response.content;
    //       this.workplaceResponseByManager = response;
    //     }
    //   );
  }

  selectEmployee(e: any) {
  }

  getCompany() {
    this.companyService.getAll()
      .then(
        (response: Company[]) => {
          this.companyList = response.map((company) => {
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
    this.isSelectCompany = true;
    this.getZone(e.value);
  }

  getZone(compannyId: number) {
    this.zoneService.getByCompany(compannyId)
      .then(
        (response: Zone[]) => {
          this.zoneList = response.map((zone) => {
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
    this.isSelectZone = true;
    this.getWorkplace(e.value);
  }

  getWorkplace(zoneId: number) {
    this.workplaceService.getAll(zoneId)
      .then(
        (response: Place[]) => {
          this.placeList = response.map((place) => {
            return {
              value: place.id,
              label: place.name,
              icon: place.picture
            };
          });
        }
      );
  }

  selectWorkplace(e: any) {
    e.forEach(element => {
      this.listWorkplaceId.push(element.value);
    });
  }

  openCreateEmployeeModal() {
    this.createEmployeeModal.show();
  }

  openCreateWorkplaceModal() {
    this.createWorkplaceModal.show();
  }

  addEmployeeForManager() {

  }

  addWorkplaceForManager() {

  }

  toggleEmp() {
    this.empToggle.toggle();
    this.isShowMore1 = true;
  }

  toggleWorkplace() {
    this.workplaceToggle.toggle();
    this.isShowMore2 = true;
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i ++) {
      files += this.files[i].name;
       if (!(this.files.length - 1 === i)) {
         files += ',';
      }
    }
    return files;
 }

  startUpload(): void {
    const event: UploadInput = {
    type: 'uploadAll',
    url: 'your-path-to-backend-endpoint',
    method: 'POST',
    data: { foo: 'bar' },
    };
    this.files = [];
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();
  }

  onSelectFile(event: any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event1: any) => { // called once readAsDataURL is completed

        this.url = event1.target.result;

        this.manager.picture ? this.manager.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
