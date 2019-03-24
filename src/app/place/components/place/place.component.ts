import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { Place, PlaceModel, PlacePagination } from '../../models/place';
import { BsModalService, ModalDirective, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { PlaceUpdateComponent } from '../place-update/place-update.component';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';
import { ToastService, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { Location } from '@angular/common';
import { PlaceTaskBasicComponent } from '../place-task-basic/place-task-basic.component';
import { TaskBasic } from 'src/app/task/models/task-basic';
import { GlobalService } from 'src/app/core/services/global.service';
import { TaskService } from 'src/app/task/service/task.service';
import { TaskModel } from 'src/app/task/models/task';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { Employee } from 'src/app/employee/models/employee';
import { TaskBasicService } from 'src/app/task/service/task-basic.service';
import { AssignTask, PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {

  @Input() zoneId: number;
  id: number;
  currentWorkplaceId: number;
  taskCM: TaskModel = new TaskModel();
  placeCM: PlaceModel = new PlaceModel();
  placeList: Place[] = new Array<Place>();
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  beaconName: string;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('createTaskModal') createTaskModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('beacon') beaconModal: ModalDirective;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  companyName: string;
  zoneName: string;
  taskBasicList: TaskBasic[];
  assigneeId: number;
  employeeList = [];
  timeFrom: any;
  assignTask: AssignTask = new AssignTask();
  iconPrioritySelect = [];
  currentPage = 0;
  userAccount: Employee;
  placeResponse: PaginationResponse;
  haveManager = false;
  managerList = [];
  managerId = 0;
  beaconId = 0;
  beaconList = [];
  minDate = new Date();
  dateRange = [];

  constructor(
    public location: Location,
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private taskBasicService: TaskBasicService,
    private modalService: BsModalService,
    private toastService: ToastService,
    private globalService: GlobalService,
    private taskService: TaskService,
    private employeeService: EmployeeService
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getPlace();
    this.getBeacon();
    this.getEmployee();
    this.getManager();
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
  }

  getPlace() {
    this.userAccount.roleId === 1 ? this.getWorkplaceByAdmin() : this.getWorkplaceByManager();
  }

  getWorkplaceByAdmin() {
    this.placeService.getAll(this.zoneId, '', '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content;
          this.placeResponse = response.listOfWorkplace;
          this.zoneName = response.zone.name;
          this.companyName = response.company.name;
          for (let index = 0; index < this.placeList.length; index++) {
            const element = this.placeList[index];
            this.placeService.getTaskBasic(element.id)
              .then(
                (response2: TaskBasic[]) => {
                  element.basicTaskList = response2;
                }
              );
          }
        }
      );
  }

  getWorkplaceByManager() {
    this.placeService.getWorkplaceByManager(this.userAccount.id, this.zoneId, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content;
          this.placeResponse = response.listOfWorkplace;
          this.zoneName = response.zone.name;
          this.companyName = response.company.name;
          for (let index = 0; index < this.placeList.length; index++) {
            const element = this.placeList[index];
            this.placeService.getTaskBasic(element.id)
              .then(
                (response2: TaskBasic[]) => {
                  element.basicTaskList = response2;
                }
              );
          }
        }
      );
  }

  getManager() {
    this.employeeService.getByRole(2, '', '', 'id', 0, 99)
      .then(
        (response) => {
          this.managerList = response.content.map((m: Employee) => {
            return {
              label: m.fullName,
              value: m.id,
              icon: m.picture
            };
          });
        }
      );
  }

  getBeacon() {
    this.beaconService.getAvailableBeacon()
      .then(
        (response: Beacon[]) => {
          this.beaconList = response.map((beacon) => {
            return {
              value: beacon.id,
              label: beacon.name,
            };
          });
        }
      );
  }

  getEmployee() {
    // get BY manager not get all
    this.employeeService.getEmployeeByManager(this.userAccount.id, '', 'id', 0, 99)
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

  createPlace() {
    this.filesToUpload ? this.createPlaceWithImage() : this.createPlaceWithoutImage();
  }

  createPlaceWithoutImage() {
    this.placeCM.zoneId = this.zoneId;
    this.placeService.create(this.placeCM, this.managerId)
      .then(
        () => {
          this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        (error: any) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  createPlaceWithImage() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/workplace/')
      .then(
        (response) => {
          this.placeCM.picture = response;
          this.placeCM.zoneId = this.zoneId;
          this.placeService.create(this.placeCM, this.managerId)
            .then(
              () => {
                this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.placeList = [];
                this.getPlace();
              },
              (error: any) => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );

        },
        (error) => {
          console.error(error);
        }
      );
  }

  removePlace() {
    this.placeService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa nơi làm việc thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  createTask() {
    this.placeService.getTaskBasic(this.currentWorkplaceId)
      .then(
        (response) => {
          this.taskCM.taskBasics = response;
          this.taskCM.duration *= 60000;
          this.taskCM.dateCreate = new Date().toISOString();
          this.taskCM.startTime = this.convertTime(this.timeFrom);
          this.taskService.create(this.taskCM)
            .then(
              (response2) => {
                this.assignTask.assigneeId = this.assigneeId;
                this.assignTask.assigneeId = this.userAccount.id;
                this.assignTask.dateAssign = new Date().toISOString();
                this.assignTask.taskId = response2;
                this.globalService.assignTask(this.assignTask)
                  .then(
                    () => {
                      const taskBasicData = {
                        listTaskID: [response2],
                        workplaceID: this.currentWorkplaceId
                      };
                      this.placeService.addTask(taskBasicData)
                        .then(
                          () => {
                            this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                            this.createTaskModal.hide();
                            this.placeList = [];
                            this.getPlace();
                          },
                          () => {
                            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                          }
                        );
                    }
                  );
              }
            );
        }
      );
  }

  addBeacon() {
    this.beaconService.updateField(this.beaconId, 'workplaceId', this.id)
      .then(
        (response) => {
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
          this.beaconModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  openCreateTaskModal(id: number) {
    this.currentWorkplaceId = id;
    this.createTaskModal.show();
  }
  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openBeaconModal(id: number) {
    this.id = id;
    this.beaconModal.show();
  }

  openUpdateModal(place: Place, zoneId: number) {
    zoneId = this.zoneId;
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { place, zoneId }
    };
    this.modalRef = this.modalService.show(PlaceUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getPlace());

  }

  convertTime(time: string) {
    const h = time.split(':')[0];
    const mm = time.split(':')[1];
    const today = new Date();
    let d: any = today.getDate();
    let m: any = today.getMonth();
    const y = today.getFullYear();

    if (d < 10) {
      d = '0' + d;
    }

    if (m < 10) {
      m = '0' + m;
    }
    const day = new Date(y, m, d, +h, +mm, 0, 0).toISOString();
    return day;
  }

  openTaskBasicModal(taskBasic: TaskBasic[], workplaceId: number) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { taskBasic, workplaceId }
    };
    this.modalRef = this.modalService.show(PlaceTaskBasicComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getPlace());
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

        this.placeCM.picture ? this.placeCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

  changePage(event) {
    this.currentPage = event - 1;
    this.getPlace();
  }
}
