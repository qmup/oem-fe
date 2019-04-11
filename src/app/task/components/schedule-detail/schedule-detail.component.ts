import { Component, OnInit, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { ScheduleService } from '../../service/schedule.service';
import { Schedule, ScheduleModel } from '../../models/schedule';
import { ToastService, UploadOutput, UploadFile, UploadInput, humanizeBytes } from 'ng-uikit-pro-standard';
import { Employee } from 'src/app/employee/models/employee';
import { PlacePagination } from 'src/app/place/models/place';
import { PaginationResponse } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';
import { TaskBasicService } from '../../service/task-basic.service';
import { Task } from '../../models/task';
import { TaskService } from '../../service/task.service';
import { TaskBasicManager } from '../../models/task-basic';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})
export class ScheduleDetailComponent implements OnInit {

  taskBasicCM: Task = new Task();
  schedule: Schedule = new Schedule();
  scheduleId: number;
  userAccount: Employee;

  iconPrioritySelect = [];
  week = [];
  employeeList = [];
  placeList = [];
  taskBasicList = [];
  taskBasic = [];
  selectedTaskBasic = [];
  selectedDayIds = [];
  taskBasicManagerList: Task[] = new Array<Task>();
  selectedModalTaskBasic = [];

  timeFrom: any;
  timeTo: any;
  startTime: any;

  modalRef1: BsModalRef | null;
  modalRef2: BsModalRef;

  @ViewChild('create') public createModal: TemplateRef<any>;
  @ViewChild('edit') public editTaskBasicModal: TemplateRef<any>;
  @ViewChild('main') public mainModal: TemplateRef<any>;
  @ViewChild('delete') public deleteModal: TemplateRef<any>;

  refresh: EventEmitter<any> = new EventEmitter<any>();

  minDate = new Date;

  canRemove = false;

  currentPage = 0;

  filesToUpload: FileList;
  url: any;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  selectAtLeastOneTaskBasic: boolean;
  selectAtLeastOneDay: boolean;
  assigneeId: number;

  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private modalService: BsModalService,
    private scheduleService: ScheduleService,
    private toastService: ToastService,
    private taskBasicService: TaskBasicService,
    private taskService: TaskService,
    private globalService: GlobalService
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getScheduleDetail();
    this.getEmployee();
    this.getWorkplaceByManager();
    // this.getTaskBasicByManager();
  }

  getScheduleDetail() {
    this.week = [
      { id: 2, inputId: 'option1', label: 'Thứ 2' , check: false},
      { id: 3, inputId: 'option2', label: 'Thứ 3' , check: false},
      { id: 4, inputId: 'option3', label: 'Thứ 4' , check: false},
      { id: 5, inputId: 'option4', label: 'Thứ 5' , check: false},
      { id: 6, inputId: 'option5', label: 'Thứ 6' , check: false},
      { id: 7, inputId: 'option6', label: 'Thứ 7' , check: false},
      { id: 1, inputId: 'option7', label: 'Chủ nhật' , check: false},
    ];
    this.selectedDayIds = [];
    this.scheduleService.getDetail(this.scheduleId)
      .then(
        (response) => {
          this.schedule = response;
          this.assigneeId = response.assignee.id;
          this.startTime = new Date(this.schedule.startTime);
          if (this.schedule.duration / 60000 > 1) {
            this.schedule.duration /= 60000;
          }
          this.week.forEach((element1, i) => {
            this.schedule.daysOfWeek.split(',').forEach((element2, j) => {
              if (element1.id === +element2) {
                this.selectedDayIds.push(element1.id);
                element1.check = true;
                i++;
                j = 0;
              }
            });
          });
        }
      );
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

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, '', '', 1, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map(p => {
            return {
              value: p.id,
              label: p.name,
              icon: p.picture
            };
          });
        }
      );
  }

  updateSchedule() {
    this.updateTitle();
    this.updateWorkplace();
    this.updateAssignee();
    this.updateStartTime();
    this.updateDuration();
    this.updateDayOfWeek();
    this.updateDescription();
    this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
  }

  getTaskBasicByManager() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', this.currentPage, 99)
      .then(
        (response: any) => {
          this.taskBasicManagerList = response.content;
          this.schedule.taskBasics.forEach(element => {
            this.taskBasicManagerList = this.taskBasicManagerList.filter(task => task.title !== element.title);
          });
          console.log(this.taskBasicManagerList);
        }
      );
  }

  openDetailModal() {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { scheduleId: this.scheduleId }
    };
    this.modalRef = this.modalService.show( ScheduleDetailComponent , modalOptions);
    this.modalRef.content.refresh.subscribe(() => {});
  }

  removeTaskBasic() {
    this.selectedTaskBasic.forEach((element, i) => {
      this.scheduleService.deleteTaskBasicList(element.id, this.scheduleId)
        .then(
          () => {
            if (this.selectedTaskBasic.length - 1 === i) {
              this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
              this.canRemove = false;
              this.getScheduleDetail();
              this.getTaskBasicByManager();
            }
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    });

  }

  selectWorkplace(e: any) {
    this.schedule.workplaceId = e.value;
  }
  selectEmployee(e: any) {
    this.schedule.assignee.id = e.value;
  }
  updateTitle() {
    this.scheduleService.updateField(this.scheduleId, 'title', this.schedule.title);
  }
  updateWorkplace() {
    this.scheduleService.updateField(this.scheduleId, 'workplaceId', this.schedule.workplaceId);
  }
  updateAssignee() {
    this.scheduleService.updateField(this.scheduleId, 'assigneeId', this.schedule.assignee.id);
  }
  updateStartTime() {
    this.scheduleService.updateField(this.scheduleId, 'startTime', this.schedule.startTime);
  }
  updateDuration() {
    this.scheduleService.updateField(this.scheduleId, 'duration', this.schedule.duration);
  }
  updateDayOfWeek() {
    this.scheduleService.updateField(this.scheduleId, 'dayOfWeek', this.schedule.daysOfWeek);
  }
  updateDescription() {
    this.scheduleService.updateField(this.scheduleId, 'description', this.schedule.description);
  }

  changeDuration(e: any) {
    this.schedule.duration = e;
  }

  changeDayCheckbox(id: number, event: any) {
    if (event.checked && !this.selectedDayIds.includes(el => +el === id)) {
      this.selectedDayIds.push(+this.schedule.daysOfWeek.split(',').find((el: any) => +el === id));
    } else {
      this.selectedDayIds = this.selectedDayIds.filter(el => +el !== id);
    }
    if (this.selectedDayIds.length === 0) {
      this.selectAtLeastOneDay = true;
    } else {
      this.selectAtLeastOneDay = false;
    }
  }

  changeTaskCheckbox(id: number, event: any) {
    if (event.checked && !this.selectedTaskBasic.includes(el => el.id === id)) {
      this.selectedTaskBasic.push(this.schedule.taskBasics.find(el => el.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(el => el.id !== id);
    }
    if (this.selectedTaskBasic.length > 0) {
      this.canRemove = true;
    } else {
      this.canRemove = false;
    }
  }

  changeCheckboxCreateModal(id: number, event: any) {
    if (event.checked && !this.selectedModalTaskBasic.includes(el => el.id === id)) {
      this.selectedModalTaskBasic.push(this.taskBasicManagerList.find(el => el.id === id));
    } else {
      this.selectedModalTaskBasic = this.selectedModalTaskBasic.filter(el => el.id !== id);
    }
    if (this.selectedTaskBasic.filter(t => t.checked === true).length === 0) {
      this.selectAtLeastOneTaskBasic = true;
    } else {
      this.selectAtLeastOneTaskBasic = false;
    }
  }

  back() {
    this.openDetailModal();
    this.closeModal1();
  }

  addTaskBasicToSchedule() {
    this.scheduleService.updateTaskBasicList(this.schedule.id, this.selectedModalTaskBasic)
      .then(
        () => {
          this.openDetailModal();
          this.closeModal1();
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
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
              this.taskBasicCM.id = response1;
                this.scheduleService.updateTaskBasicList(this.scheduleId, [this.taskBasicCM])
                  .then(
                    () => {
                      this.taskBasicManager.employeeId = this.userAccount.id;
                      this.taskBasicManager.editable = true;
                      this.taskBasicManager.taskBasicId = response1;
                      this.taskBasicService.setToManager(this.taskBasicManager)
                        .then(
                          () => {
                            this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                            this.closeModal1();
                          },
                          () => {
                            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                          }
                      );

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
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  openModal(template: TemplateRef<any>, type: number) {
    if (type === 1) {
      this.getTaskBasicByManager();
      this.modalRef.hide();
      this.modalRef1 = this.modalService.show(template, { class: 'modal-md modal-dialog modal-notify modal-success' });
    } else if (type === 2) {
      this.getTaskBasicByManager();
      this.modalRef.hide();
      this.modalRef1 = this.modalService.show(template, { class: 'modal-md modal-dialog modal-notify modal-primary' });
    } else {
      this.modalRef.hide();
      this.modalRef1 = this.modalService.show(template, { class: 'modal-sm modal-dialog modal-notify modal-danger' });
    }
  }

  closeModal1() {
    if (!this.modalRef1) {
      return;
    }
    this.modalRef1.hide();
    this.modalRef1 = null;

  }

  closeModal2() {
    if (!this.modalRef2) {
      return;
    }
    this.modalRef2.hide();
    this.modalRef2 = null;
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
