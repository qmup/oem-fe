import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, ToastService } from 'ng-uikit-pro-standard';
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
import { Zone, ZonePagination } from 'src/app/place/models/zone';
import { Place, ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { PaginationResponse } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';

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
  employeeList = [];
  employeeListByManager: Employee[] = [];
  employeeResponseByManager: PaginationResponse;
  workplaceListByManager: Place[] = [];
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
  currentPage1 = 0;
  currentPage2 = 0;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private zoneService: ZoneService,
    private workplaceService: PlaceService,
    private globalService: GlobalService,
    private toastService: ToastService
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
    this.getWorkplaceByManager();
  }

  getOnInit() {
    this.getEmployeeByManager();
    this.getInfo();
    this.getEmployeeWithoutManager();
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

  getEmployeeWithoutManager() {
    this.employeeService.getEmployeeByManager(0, '', 'id', 0, 99)
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

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(this.id, '', 'id', this.currentPage1, 3)
      .then(
        (response: PaginationResponse) => {
          this.employeeListByManager = response.content;
          this.employeeResponseByManager = response;
        }
      );
  }

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.id, '', '', 'id', this.currentPage2, 3)
      .then(
        (response: PlacePagination) => {
          this.workplaceListByManager = response.listOfWorkplace.content;
          this.workplaceResponseByManager = response.listOfWorkplace;
        }
      ).then(
        () => this.getOnInit()
      );
  }

  selectEmployee(e: any) {
    this.addingEmpId = e.value;
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
    this.manageWorkplace.companyId = e.value;
    this.isSelectCompany = true;
    this.getZone(e.value);
  }

  getZone(companyId: number) {
    this.zoneService.getByCompany(companyId, '', '', 'id', 0, 99)
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
    this.isSelectZone = true;
    this.getWorkplaceWithoutManager(e.value);
  }

  getWorkplaceWithoutManager(zoneId: number) {
    this.workplaceService.getWorkplaceByManager(0, zoneId, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map((place) => {
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
    this.manageWorkplace.workplaceId = e.value;
  }

  openCreateEmployeeModal() {
    this.createEmployeeModal.show();
  }

  openCreateWorkplaceModal() {
    this.createWorkplaceModal.show();
  }

  openRemoveEmployeeModal(id: number) {
    this.deletingEmpId = id;
    this.removeEmployeeModal.show();
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
    this.workplaceService.addManagerToWorkplace(this.manageWorkplace)
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
          console.log(response);
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'} );
          this.getEmployeeByManager();
          this.removeEmployeeModal.hide();
          this.employeeListByManager = [];
          this.employeeResponseByManager = new PaginationResponse();

        },
        (error) => {
          console.log(error);
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeWorkplaceByManager() {
    this.workplaceService.removeFromManager(this.id, this.deletingWpId)
      .then(
        (response) => {
          console.log(response);
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'} );
          this.getWorkplaceByManager();
          this.removeWorkplaceModal.hide();
          this.workplaceListByManager = [];
          this.workplaceResponseByManager = new PaginationResponse();
        },
        (error) => {
          console.log(error);
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  toggleEmp() {
    this.empToggle.toggle();
    this.isShowMore1 = true;
  }

  toggleWorkplace() {
    this.workplaceToggle.toggle();
    this.isShowMore2 = true;
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
