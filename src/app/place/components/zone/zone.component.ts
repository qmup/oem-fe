import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Zone, ZoneModel, ZonePagination } from '../../models/zone';
import { BsModalRef, ModalDirective, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { ZoneService } from '../../services/zone.service';
import { ZoneUpdateComponent } from '../zone-update/zone-update.component';
import { Location } from '@angular/common';
import { Employee } from 'src/app/employee/models/employee';
import { PaginationResponse } from 'src/app/core/models/shared';
import { Company } from '../../models/company';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {

  @Input() companyId: number;
  id: number;
  companyName: string;
  zoneCM: ZoneModel = new ZoneModel();
  zoneList: Zone[];
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
  userAccount: Employee;
  currentPage = 0;
  zoneResponse: ZonePagination;

  constructor(
    private zoneService: ZoneService,
    private modalService: BsModalService,
    private toastService: ToastService,
    private globalService: GlobalService,
    public location: Location
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getZone();
  }

  getZone() {
    this.userAccount.roleId === 1 ? this.getZoneByAdmin() : this.getZoneByManager();
  }

  getZoneByAdmin() {
    this.zoneService.getByCompany(this.companyId, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneResponse = response;
          this.zoneList = response.listOfZone.content;
          this.companyName = response.company.name;
        }
      );
  }

  getZoneByManager() {
    this.zoneService.getAll(this.userAccount.id, this.companyId, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneResponse = response;
          this.zoneList = response.listOfZone.content;
        }
      );
  }

  createZone() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/zone/')
      .then(
        (response) => {
          this.zoneCM.companyId = this.zoneResponse.company.id;
          this.zoneCM.picture = response;
          this.zoneService.create(this.zoneCM)
            .then(
              () => {
                this.toastService.success('Tạo khu vực thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.zoneList = [];
                this.getZone();
              },
              (error: any) => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  removeZone() {
    this.zoneService.remove(this.id)
      .then(
        (response) => {
          if (response) {
            this.toastService.success('Xóa khu vực thành công', '', { positionClass: 'toast-bottom-right'} );
            this.deleteModal.hide();
            this.zoneList = [];
            this.getZone();
          } else {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          this.deleteModal.hide();
          }
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

  openUpdateModal(zone: Zone) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { zone }
    };
    this.modalRef = this.modalService.show(ZoneUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getZone());

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

        this.zoneCM.picture ? this.zoneCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
