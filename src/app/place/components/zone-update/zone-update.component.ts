import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { Employee } from 'src/app/employee/models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { GlobalService } from 'src/app/core/services/global.service';
import { ZoneService } from '../../services/zone.service';
import { Zone, ZoneModel } from '../../models/zone';

@Component({
  selector: 'app-zone-update',
  templateUrl: './zone-update.component.html',
  styleUrls: ['./zone-update.component.scss']
})
export class ZoneUpdateComponent implements OnInit {

  companyId: number;
  zone: Zone;
  zoneUM: ZoneModel = new ZoneModel();
  optionsSelect = [];
  refresh: EventEmitter<any> = new EventEmitter<any>();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  userAccount: Employee;

  constructor(
    public modalRef: BsModalRef,
    private toastService: ToastService,
    private globalService: GlobalService,
    private zoneService: ZoneService,
    ) {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
  }

  updateZone() {
    this.zoneUM.id = this.zone.id;
    this.zoneUM.name = this.zone.name;
    this.zoneUM.picture = this.zone.picture;
    this.zoneUM.companyId = this.companyId;
    this.filesToUpload ? this.updateWithImage() : this.updateWithoutImage();
  }

  updateWithoutImage() {
    this.zoneService.update(this.zoneUM)
      .then(
        () => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  updateWithImage() {
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
          this.zoneUM.picture = response;
          this.zoneService.update(this.zoneUM)
            .then(
              () => {
                this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
                this.modalRef.hide();
                this.refresh.emit();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        },
        (error) => {
          console.error(error);
        }
      );
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

        this.zone.picture ? this.zone.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
