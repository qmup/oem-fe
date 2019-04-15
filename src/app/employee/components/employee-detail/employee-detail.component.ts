import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { Manager } from 'src/app/manager/models/manager';
import { humanizeBytes, UploadInput, UploadFile, UploadOutput, ToastService } from 'ng-uikit-pro-standard';
import { PaginationResponse } from 'src/app/core/models/shared';
import { ModalDirective, ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GlobalService } from 'src/app/core/services/global.service';
import { TaskService } from 'src/app/task/service/task.service';
import { Task } from 'src/app/task/models/task';
import { EmployeeUpdateComponent } from '../employee-update/employee-update.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  @ViewChild('updateManagerModal') updateModal: ModalDirective;
  @ViewChild('warning') warningModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  employee: Employee = new Employee();
  id: number;
  sub: any;
  managerInfo: Manager = new Manager();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  managerList = [];
  selectingManagerId: number;
  userAccount: Employee;
  taskList: Task[] = new Array<Task>();
  deletingId = 0;
  modalRef: BsModalRef;
  defaultImage = '../../../../assets/default-image.jpg';
  warningMessage = [];
  managerResponse: PaginationResponse;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private globalService: GlobalService,
    private taskService: TaskService,
    private modalService: BsModalService,
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getByRole();
    this.getEmployeeDetail(this.id);
  }

  getByRole() {
    if (this.userAccount.roleId === 1) {
      this.getManager();
    } else {
      this.getTodayTaskByEmployee();
    }
  }

  getEmployeeDetail(id: number) {
    this.employeeService.getById(id)
      .then(
        (response: Employee) => {
          this.employee = response;
          if (this.employee.managerId !== 0 && this.managerResponse) {
            this.managerInfo = this.managerResponse.content.find((manager: Manager) => manager.id === this.employee.managerId);
          }
        }
      );
  }

  getManager() {
    this.employeeService.getByRole(2, '', '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.managerResponse = response;
          this.managerList = response.content
          .filter((manager: Employee) => manager.id !== this.employee.managerId)
          .map((manager) => {
            return {
              value: manager.id,
              label: manager.fullName,
              icon: manager.picture
            };
          });
          if (this.employee.managerId !== 0) {
            this.managerInfo = response.content.find((manager: Manager) => manager.id === this.employee.managerId);
          }
          if (this.managerList.length === 0) {
            this.managerList = [
              {value: -1, label: 'Không tìm thấy người quản lý phù hợp', disabled: true}
            ];
          }
        }
      );
  }

  openUpdateManagerModal() {
    this.updateModal.show();
  }

  openRemoveTaskModal(id: number) {
    this.deletingId = id;
    this.deleteModal.show();
  }

  openUpdateEmployeeModal(employee: Employee) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { employee }
    };
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.getEmployeeDetail(this.id)
    );

  }

  selectManager(e: any) {
    this.selectingManagerId = e.value;
  }

  updateEmployeeForManager() {
    this.employeeService.updateField(this.id , 'managerId', this.selectingManagerId)
      .then(
        () => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.updateModal.hide();
          this.getByRole();
          this.getEmployeeDetail(this.id);
        }
      );
  }
  checkConstraint() {
    this.employeeService.checkConstraint(this.id)
    .then(
      (res) => {
        if (res.removeAble) {
          this.openUpdateManagerModal();
        } else {
          this.warningMessage = res.message.split(';');
          this.warningModal.show();
        }
      });
  }
  getTodayTaskByEmployee() {
    this.taskService.getTodayTaskByEmployee(this.id)
      .then(
        (response) => {
          this.taskList = response;
        }
      );
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

        this.employee.picture ? this.employee.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }
}
