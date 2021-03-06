import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, ToastService } from 'ng-uikit-pro-standard';
import { Manager } from '../../models/manager';
import { TaskService } from 'src/app/task/service/task.service';
import { Task } from 'src/app/task/models/task';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Employee } from 'src/app/employee/models/employee';
import { ZoneService } from 'src/app/place/services/zone.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { Company } from 'src/app/place/models/company';
import { Zone, ZonePagination } from 'src/app/place/models/zone';
import { Place, ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { PaginationResponse } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';
import { EmployeeUpdateComponent } from 'src/app/employee/components/employee-update/employee-update.component';

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
  @ViewChild('removeEmp') removeEmployeeModal: ModalDirective;
  @ViewChild('removeWp') removeWorkplaceModal: ModalDirective;
  @ViewChild('warning') warningModal: any;
  defaultImage = '../../../../assets/default-image.jpg';
  manager: Employee = new Employee();
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
  employeeList = [];
  employeeListByManager: Employee[];
  employeeResponseByManager: PaginationResponse;
  workplaceListByManager: Place[];
  workplaceResponseByManager: PaginationResponse = new PaginationResponse();
  companyList = [];
  zoneList = [];
  placeList = [];
  taskList: Task[];
  listEmployeeId: number[];
  listWorkplaceId: number[];
  addingEmpId: number;
  deletingEmpId: number;
  deletingWpId: number;
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  userAccount: Employee;
  modalRef: BsModalRef;
  currentPage1 = 0;
  currentPage2 = 0;
  searchWorkplaceText = '';
  searchEmployeeText = '';
  timeoutSearch: any;
  warningMessage: any[];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private zoneService: ZoneService,
    private workplaceService: PlaceService,
    private toastService: ToastService,
    private modalService: BsModalService,
    private globalService: GlobalService,
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.manageWorkplace.managerId = this.id;
    });
    this.getInfo();
    this.getWorkplaceByManager();
    this.getEmployeeByManager();
    this.getEmployeeWithoutManager();
    this.getCompany();
  }


  getInfo() {
    this.employeeService.getById(this.id)
      .then(
        (response: Employee) => {
          this.manager = response;
        }
      );
  }

  getEmployeeWithoutManager() {
    this.employeeService.getEmployeeByManager(1, 0, '', '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.filter((e: Employee) => !(e.id !== this.userAccount.id || e.id !== this.id));
            if (this.employeeList.length === 0) {
              this.employeeList = [
                {
                  value: '-1',
                  label: 'Không tìm thấy người nhân viên chưa có người quản lý',
                  disabled: true,
                }
              ];
            } else {
              this.employeeList.map((employee: Employee) => {
                return {
                  value: employee.id,
                  label: employee.fullName,
                  icon: employee.picture
                };
              });
            }
        }
      );
  }

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(1, this.id, this.searchEmployeeText, '', 'id', this.currentPage1, 3)
      .then(
        (response: PaginationResponse) => {
          this.employeeListByManager = response.content;
          this.employeeResponseByManager = response;
        }
      );
  }

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.id, this.searchWorkplaceText, '', 1, '', 'id', this.currentPage2, 3)
      .then(
        (response: PlacePagination) => {
          this.workplaceListByManager = response.listOfWorkplace.content;
          this.workplaceResponseByManager = response.listOfWorkplace;
        }
      );
  }

  searchEmployee() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getEmployeeByManager();
    }, 500);
  }

  searchWorkplace() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getWorkplaceByManager();
    }, 500);
  }

  selectEmployee(e: any) {
    this.addingEmpId = e.value;
  }

  getCompany() {
    this.companyService.getAll('', '', 'id', 1, 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.companyList = response.content;
          if (this.companyList.length === 0) {
            this.companyList = [
              {
                value: '-1',
                label: 'Không tìm thấy công ty',
                disabled: true,
              }
            ];
          } else {
            this.companyList = this.companyList.map((company) => {
              return {
                value: company.id,
                label: company.name,
                icon: company.picture
              };
            });
          }
        });
  }

  selectCompany(e: any) {
    this.manageWorkplace.companyId = e.value;
    this.isSelectCompany = true;
    this.getZone(e.value);
  }

  getZone(companyId: number) {
    this.zoneService.getByCompany(companyId, 1, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneList = response.listOfZone.content;
          if (this.zoneList.length === 0) {
            this.zoneList = [
              {
                value: '-1',
                label: 'Không tìm thấy khu vực tại công ty này',
                disabled: true,
              }
            ];
          } else {
            this.zoneList = this.zoneList.map((zone) => {
              return {
                value: zone.id,
                label: zone.name,
                icon: zone.picture
              };
            });
        }
      });
  }

  selectZone(e: any) {
    this.manageWorkplace.zoneId = e.value;
    this.isSelectZone = true;
    this.getWorkplaceWithoutManager(e.value);
  }

  getWorkplaceWithoutManager(zoneId: number) {
    this.workplaceService.getWorkplaceByManager(0, '', zoneId, 1, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          if (response.listOfWorkplace.totalElements !== 0) {
            this.placeList = response.listOfWorkplace.content.map((place) => {
              return {
                value: place.id,
                label: place.name,
                icon: place.picture
              };
            });
          } else {
            this.placeList = [
              { value: '-1', label: 'Không còn nơi làm việc chưa được quản lý ', disabled: true }
            ];
          }
        }
      );
  }

  openUpdateEmployeeModal(employee: Employee) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { employee }
    };
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.getInfo()
    );

  }

  checkConstraint(id: number) {
    this.deletingEmpId = id;
    this.warningMessage = [];
    this.employeeService.checkConstraint(this.deletingEmpId)
      .then(
        (res) => {
          if (res.removeAble) {
            this.removeEmployeeModal.show();
          } else {
            this.warningMessage = res.message.split(';');
            this.warningModal.show();
          }
        }
      );
  }

  checkRemoveWorkplace(id: number) {
    this.deletingWpId = id;
    this.warningMessage = [];
    this.workplaceService.checkRemoveManager(this.id, this.deletingWpId)
      .then(
        (res) => {
          if (res.removeAble) {
            this.removeWorkplaceModal.show();
          } else {
            this.warningMessage = res.message.split(';');
            this.warningModal.show();
          }
        }
      );
  }

  selectWorkplace(e: any) {
    this.manageWorkplace.workplaceId = e.value;
  }

  openCreateEmployeeModal() {
    this.createEmployeeModal.show();
  }

  openCreateWorkplaceModal() {
    this.createWorkplaceModal.show();
  }

  openRemoveWorkplaceModal(id: number) {
    this.deletingWpId = id;
    this.removeWorkplaceModal.show();
  }

  addEmployeeForManager() {
    this.employeeService.updateField(this.addingEmpId, 'managerId', this.id)
      .then(
        () => {
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createEmployeeModal.hide();
          this.employeeListByManager = [];
          this.employeeResponseByManager = new PaginationResponse();
          this.getEmployeeByManager();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  addWorkplaceForManager() {
    this.workplaceService.updateManager(this.manageWorkplace.workplaceId, 'managerId', this.manageWorkplace.managerId)
      .then(
        () => {
          this.toastService.success('Cập nhật thông tin thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createWorkplaceModal.hide();
          this.workplaceListByManager = [];
          this.workplaceResponseByManager = new PaginationResponse();
          this.getWorkplaceByManager();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeEmployeeByManager() {
    this.employeeService.updateField(this.deletingEmpId, 'managerId', 0)
      .then(
        (response) => {
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'} );
          this.getEmployeeByManager();
          this.removeEmployeeModal.hide();
          this.employeeListByManager = [];
          this.employeeResponseByManager = new PaginationResponse();

        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeWorkplaceByManager() {
    this.workplaceService.removeFromManager(this.id, this.deletingWpId)
      .then(
        (response: boolean) => {
          if (response) {
            this.toastService.success('Xóa thành công' , '', { positionClass: 'toast-bottom-right'});
            this.getWorkplaceByManager();
            this.removeWorkplaceModal.hide();
            this.workplaceListByManager = [];
            this.workplaceResponseByManager = new PaginationResponse();
          } else {
            this.toastService.error('Vẫn còn công việc tại đây chưa được giải quyết xong' , '', { positionClass: 'toast-bottom-right'});
            this.removeWorkplaceModal.hide();
          }
        }
      );
  }

  changePage1(event) {
    this.currentPage1 = event - 1;
    this.getEmployeeByManager();
  }

  changePage2(event) {
    this.currentPage2 = event - 1;
    this.getWorkplaceByManager();
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i ++) {
      if ((this.files.length - 1 === i)) {
        files += this.files[i].name;
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
