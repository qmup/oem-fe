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
import { PlaceDetailComponent } from '../place-detail/place-detail.component';

const WORKPLACE_REMOVED_STATUS = 0;
const WORKPLACE_OPEN_STATUS = 1;
const WORKPLACE_CLOSE_STATUS = 2;

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
  @ViewChild('removeBeacon') removeBeaconModal: ModalDirective;
  @ViewChild('addManager') addManagerModal: ModalDirective;
  @ViewChild('editManager') editManagerModal: ModalDirective;
  @ViewChild('deleteManager') deleteManagerModal: ModalDirective;
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
  workplaceStatusList = [];
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
  dateSearch = new Date();
  currentIndex = 0;
  selectingManagerId: number;
  selectingWorkplaceId: number;
  showAll = false;
  canCreateTask: boolean;
  currentStatus = WORKPLACE_OPEN_STATUS;
  warningMessage = [];
  viewOptions = [];
  viewTypes = [];
  currentViewType = 1;
  currentViewOption = 2;
  currentManagerId = 0;
  _managerList = [];
  deletingBeaconId: any;
  defaultImage: '../../../../assets/default-image.jpg';
  timeoutSearch: any;
  searchText = '';

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
    this.workplaceStatusList = this.globalService.workplaceStatus;
    this.viewTypes = this.globalService.viewTypes;
    if (this.userAccount.roleId === 2 && this.workplaceStatusList.length > 2) {
    this.workplaceStatusList.pop();
    }
  }

  getPlace() {
    if (this.userAccount.roleId === 1) {
      this.getWorkplaceByAdmin();
    } else {
      if (this.currentViewOption === 1) {
        this.getAllWorkplaceByManager();
      } else {
        this.getWorkplaceByManager();
      }
    }
  }

  getWorkplaceByAdmin() {
    this.placeService.getAll(this.zoneId, this.searchText, this.currentStatus, '', 'id', this.currentPage, 9)
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
    const now = new Date().getTime() - 24 * 60 * 60 * 1000;
    const taskTime = this.dateSearch.getTime();
    if (taskTime < now) {
      this.canCreateTask = false;
    } else {
      this.canCreateTask = true;
    }
    const d = this.dateSearch.getDate();
    const m = this.dateSearch.getMonth();
    const y = this.dateSearch.getFullYear();
    const from = new Date(y, m, d, 0, 0, 0, 0).toISOString();
    const to = new Date(y, m, d, 23, 59, 0, 0).toISOString();
    this.showAll = false;
    this.placeService.getAvailableByDate(
      this.userAccount.id, this.searchText, this.currentStatus, this.zoneId, `${from};${to}`, '', 'id', 0, 9)
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
          this.viewOptions = [
            { value: 2, label: `Tại ${response.zone.name}`},
            { value: 1, label: 'Tất cả'},
          ];
        }
      );
  }

  getAllWorkplaceByManager() {
    const d = this.dateSearch.getDate();
    const m = this.dateSearch.getMonth();
    const y = this.dateSearch.getFullYear();
    const from = new Date(y, m, d, 0, 0, 0, 0).toISOString();
    const to = new Date(y, m, d, 23, 59, 0, 0).toISOString();
    const now = new Date().getTime() - 24 * 60 * 60 * 1000;
    const taskTime = this.dateSearch.getTime();
    if (taskTime < now) {
      this.canCreateTask = false;
    } else {
      this.canCreateTask = true;
    }
    this.showAll = true;
    this.placeService.getAvailableByDate(
      this.userAccount.id, this.searchText, this.currentStatus, '', `${from};${to}`, '', 'id', 0, 9)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content;
          this.placeResponse = response.listOfWorkplace;
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

  changeViewOption(e: any) {
    this.currentViewOption = e.value;
    e.value === 1 ? this.getAllWorkplaceByManager() : this.getWorkplaceByManager();
  }

  changeViewType(e: any) {
    this.currentViewType = e.value;
  }

  search() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getPlace();
    }, 500);
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

  _getManager(): any {
    this.employeeService.getByRole(2, '', '', 'id', 0, 99)
      .then(
        (response) => {
          this._managerList = response.content.filter((m: Employee) => m.id !== this.currentManagerId).map((m: Employee) => {
            return {
              label: m.fullName,
              value: m.id,
              icon: m.picture
            };
          });
          console.log(this._managerList);
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
    this.employeeService.getEmployeeByManager(1, this.userAccount.id, '', '', 'id', 0, 99)
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

  updateManagerForWorkplace() {
    this.placeService.updateManager(this.selectingWorkplaceId, 'managerId', this.selectingManagerId)
      .then(
        () => {
          this.selectingManagerId = 0;
          this.toastService.success('Thành công', '', { positionClass: 'toast-bottom-right'} );
          this.hideManagerModal();
          this.getPlace();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  checkRemovable(id: number) {
    this.warningMessage = [];
    this.placeService.checkRemove(id)
      .then(
        (response: any) => {
          response.removeAble ?
          this.deleteModal.show() :
          (this.warningMessage = response.message.split(';'), this.deleteModal.show());
        }
      );
  }

  checkRemovableManager(type: number) {
    this.placeService.removeFromManager(this.currentManagerId, this.selectingWorkplaceId)
      .then(
        (response: boolean) => {
          if (response) {
            if (type === 1) {
              this.updateManagerForWorkplace();
            } else {
              this.selectingManagerId = 0;
              this.toastService.success('Xóa thành công' , '', { positionClass: 'toast-bottom-right'});
              this.hideManagerModal();
              this.getPlace();
            }
          } else {
            this.toastService.error('Vẫn còn công việc tại đây chưa được giải quyết xong' , '', { positionClass: 'toast-bottom-right'});
            this.hideManagerModal();
          }
        }
      );
  }

  removePlace() {
    this.placeService.remove(this.id)
      .then(
        (response) => {
          (response) ? (
            this.toastService.success('Xóa nơi làm việc thành công', '', { positionClass: 'toast-bottom-right'} ),
            this.deleteModal.hide(),
            this.placeList = [],
            this.getPlace()
            ) : (
            this.toastService.error('Đang có công việc tại nơi này' , '', { positionClass: 'toast-bottom-right'}),
            this.deleteModal.hide()
            );
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

  openDetailModal(workplace: Place) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-md modal-notify modal-primary',
      initialState: { workplace }
    };
    this.modalRef = this.modalService.show(PlaceDetailComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.getPlace()
    );
  }

  openManagerModal(id: number, type: number, managerId: number) {
    this.currentManagerId = managerId;
    this.selectingManagerId = 0;
    this.selectingWorkplaceId = id;
    this.warningMessage = [];
    if (type === 1) {
      this.addManagerModal.show();
    } else {
      this.placeService.checkRemoveManager(managerId, id)
        .then(
          (res) => {
            if (res.removeAble) {
              if (type === 2) {
                this._getManager();
                this.editManagerModal.show();
              } else {
                this.deleteManagerModal.show();
              }
            } else {
              this.warningMessage = res.message.split(';');
              let warningString = '';
              this.warningMessage.forEach((element: string) => {
                warningString += element;
                this.toastService.error(warningString, '', {positionClass: 'toast-bottom-right'});
              });
            }
          }
        );
    }
  }

  openRemoveBeaconModal(e: any) {
    this.deletingBeaconId = e.value;
    this.removeBeaconModal.show();
  }

  removeBeaconOfWorkplace() {
    // this.beaconService.updateField(this.deletingBeaconId, 'workplaceId', 0)
    //   .then(
    //     (response) => {
    //     }
    //   );
  }

  hideManagerModal() {
    this.addManagerModal.hide();
    this.editManagerModal.hide();
    this.deleteManagerModal.hide();
  }

  switch(e: any, workplaceId: number) {
    e.target.checked ?
      this.placeService.updateField(workplaceId, 'status', WORKPLACE_OPEN_STATUS)
        .then(
          () => {
            this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          }
        )
        .then(
          () => this.getPlace()
        )
        :
      this.placeService.updateField(workplaceId, 'status', WORKPLACE_CLOSE_STATUS)
        .then(
          () => {
            this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          }
        )
        .then (
          () => this.getPlace()
        );
  }

  openCreateTaskModal(id: number, index) {
    this.currentWorkplaceId = id;
    this.currentIndex = index;
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
