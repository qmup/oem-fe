import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Company } from '../../models/company';
import { BsModalRef, ModalDirective, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { CompanyService } from '../../services/company.service';
import { CompanyUpdateComponent } from '../company-update/company-update.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  id: number;
  companyCM: Company = new Company();
  companyList: Company[];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  map: any = { lat: 10.774157, lng: 106.661049 };

  constructor(
    private companyService: CompanyService,
    private modalService: BsModalService,
    private toastService: ToastService,
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    this.companyService.getAll()
      .then(
        (response: Company[]) => {
          this.companyList = response;
        }
      );
  }

  createCompany() {
    this.companyService.create(this.companyCM)
      .then(
        () => {
          this.toastService.success('Tạo công ty thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.companyList = [];
          this.getCompany();
        },
        (error: any) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeCompany() {
    this.companyService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa công ty thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          this.companyList = [];
          this.getCompany();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openUpdateModal(company: Company) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { company }
    };
    this.modalRef = this.modalService.show(CompanyUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getCompany());

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

        // this.employee.picture ? this.employee.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
