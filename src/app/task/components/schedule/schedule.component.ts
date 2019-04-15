import { Component, OnInit, ViewChild, EventEmitter, TemplateRef } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { Schedule, ScheduleModel } from '../../models/schedule';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { Employee } from 'src/app/employee/models/employee';
import { PlacePagination, ManageWorkplace, Place } from 'src/app/place/models/place';
import { ToastService, UploadFile, UploadInput, UploadOutput, humanizeBytes } from 'ng-uikit-pro-standard';
import { ScheduleDetailComponent } from '../schedule-detail/schedule-detail.component';
import { PaginationResponse, AssignTask } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';
import { TaskBasicService } from '../../service/task-basic.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { ZoneService } from 'src/app/place/services/zone.service';
import { ZonePagination } from 'src/app/place/models/zone';
import { Task } from '../../models/task';
import { TaskBasicManager } from '../../models/task-basic';

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
  @ViewChild('createBT') createBasicTask: TemplateRef<any>;
  scheduleCM: ScheduleModel = new ScheduleModel();
  week = [];
  workplaceList = [];
  employeeList = [];
  modalRef: BsModalRef;
  userAccount: Employee;
  fieldSort = 'status';
  sortBoolean = false;
  sortValue = '';
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
  searchText = '';
  timeoutSearch: any;
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  selectAtLeastOneDay: boolean;
  selectAtLeastOneTaskBasic: boolean;
  option = 1;
  optionThisWeek = 1;
  optionNextWeek = 0;
  taskBasicCM: Task = new Task();
  filesToUpload: FileList;
  url: any;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  modalRef1: BsModalRef | null;

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
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.week = this.globalService.week;
    this.userAccount = this.globalService.getUserAccount();
    this.getSchedule();
    this.getEmployee();
    this.getCompany();
  }


  sort(field: string) {
    this.sortBoolean = !this.sortBoolean;
    if (this.sortBoolean) {
      this.sortValue = 'asc';
    } else {
      this.sortValue = 'desc';
    }
    this.fieldSort = field;
    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getAll(this.searchText, this.userAccount.id, this.sortValue, this.fieldSort, this.currentPage, 10)
      .then(
        (response: PaginationResponse) => {
          this.scheduleResponse = response;
          this.scheduleList = response.content;
          this.scheduleList.forEach((element: any) => {
            element.endTime = new Date(element.startTime).getTime() + element.duration;
          });
          this.scheduleList.forEach(element => {
            element.dayList = element.daysOfWeek.split(',');
          });
        }
      );
  }

  searchSchedule() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getSchedule();
    }, 500);
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

  selectEmployee(e) {
    this.scheduleCM.assigneeId = e.value;
  }

  changeCheckbox(id: number, event: any) {
    if (event.target.checked && !this.selectedTaskBasic.includes((task: Task) => task.id === id)) {
      this.selectedTaskBasic.push(this.taskBasicList.find(task => task.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(task => task.id !== id);
    }
    if (this.selectedTaskBasic.filter(t => t.checked === true).length === 0) {
      this.selectAtLeastOneTaskBasic = true;
    } else {
      this.selectAtLeastOneTaskBasic = false;
    }
  }

  changeDay() {
    if (this.week.filter(d => d.check === true).length === 0) {
      this.selectAtLeastOneDay = true;
    } else {
      this.selectAtLeastOneDay = false;
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
    this.companyService.getCompanyByManager(this.userAccount.id, '', '', 'id', 0, 99)
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

  // selectEmployee(e: any) {
  //   this.assignTask.assigneeId = e.value;
  // }

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
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, '', zoneId, 1, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content
          .filter((place: Place) => place.setToBeacon === true )
          .map((place) => {
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
    this.scheduleCM.duration = e;
  }

  openCreateModal() {
    if (this.scheduleCM.duration > 60000) {
      this.scheduleCM.duration /= 60000;
    }
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
          () => {
          this.toastService.success('Cập nhât thành công', '', { positionClass: 'toast-bottom-right'} );
            this.getSchedule();
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        ) :
      this.scheduleService.updateField(id, 'status', 0)
        .then(
          () => {
            this.toastService.success('Cập nhât thành công', '', { positionClass: 'toast-bottom-right'} );
            this.getSchedule();
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
  }

  createSchedule() {
    this.scheduleCM.taskBasics = this.selectedTaskBasic;
    this.scheduleCM.duration *= 60000;
    this.scheduleCM.assignerId = this.userAccount.id;
    this.scheduleCM.workplaceId = this.currentWorkplace.value;
    this.scheduleCM.status = 1;
    this.scheduleCM.daysOfWeek = this.week.filter(d => d.check === true).map(d => d.id).join(',');
    this.scheduleService.create(this.scheduleCM, this.option)
    .then(
      () => {
          this.createModal.hide();
          this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
          this.scheduleList = [],
          this.getSchedule();
        },
        () => {
          this.toastService.success('Đã có lỗi xảy ra', '', { positionClass: 'toast-bottom-right'} );
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

  openCreateBasicTaskModal(template: TemplateRef<any>) {
    this.createModal.hide();
    this.modalRef1 = this.modalService.show(template, { class: 'modal-md modal-dialog modal-notify modal-success' });
  }

  createTaskBasic() {
    this.filesToUpload ? this.createTaskBasicWithImage() : this.createTaskBasicWithoutImage();
  }
  createTaskBasicWithImage() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/task/')
      .then(
        (response) => {
          this.taskBasicCM.picture = response;
          this.taskBasicCM.basic = true;
          this.taskBasicService.create(this.taskBasicCM)
          .then(
            (response1) => {
              this.taskBasicManager.id = response1;
              this.taskBasicManager.employeeId = this.userAccount.id;
              this.taskBasicManager.editable = true;
              this.taskBasicManager.taskBasicId = response1;
                this.taskBasicService.setToManager(this.taskBasicManager)
                  .then(
                    () => {
                      this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.closeModal1();
                      this.suggestTaskBasic();
                      this.openCreateModal();
                    },
                    () => {
                      this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                    }
                );

              },
            );
        }
      );
  }
  createTaskBasicWithoutImage() {
    this.taskBasicCM.basic = true;
    this.taskBasicService.create(this.taskBasicCM)
      .then(
        (response1) => {
          this.taskBasicManager.employeeId = this.userAccount.id;
          this.taskBasicManager.editable = true;
          this.taskBasicManager.taskBasicId = response1;
          this.taskBasicService.setToManager(this.taskBasicManager)
            .then(
              () => {
                this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                this.closeModal1();
                this.suggestTaskBasic();
                this.openCreateModal();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  closeModal1() {
    if (!this.modalRef1) {
      return;
    }
    this.modalRef1.hide();
    this.modalRef1 = null;

  }

  onSelectFile(event: any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event1: any) => { // called once readAsDataURL is completed

        this.url = event1.target.result;

        this.taskBasicCM.picture ? this.taskBasicCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
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
}
