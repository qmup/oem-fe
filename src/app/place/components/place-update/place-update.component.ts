import { Component, OnInit, EventEmitter } from '@angular/core';
import { Place, PlaceModel } from '../../models/place';
import { BsModalRef } from 'ngx-bootstrap';
import { PlaceService } from '../../services/place.service';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';
import { ToastService, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { Employee } from 'src/app/employee/models/employee';

@Component({
  selector: 'app-place-update',
  templateUrl: './place-update.component.html',
  styleUrls: ['./place-update.component.scss']
})
export class PlaceUpdateComponent implements OnInit {
  place: Place;
  zoneId: number;
  placeUM: PlaceModel = new PlaceModel();
  beaconList: Beacon[];
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
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private toastService: ToastService,
    private globalService: GlobalService
    ) {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getBeacon();
  }

  updatePlace() {
    this.placeUM.id = this.place.id;
    this.placeUM.description = this.place.description;
    this.placeUM.name = this.place.name;
    this.placeUM.numberOfReworks = this.place.numberOfReworks;
    this.placeUM.zoneId = this.zoneId;
    this.filesToUpload ? this.updatePlaceWithImage() : this.updatePlaceWithoutImage();
  }

  updateNoOfRwk() {
    this.placeService.updateField(this.place.id, 'numberOfReworks', this.place.numberOfReworks)
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

  updatePlaceWithoutImage() {
    this.placeUM.picture = this.place.picture;
    this.placeService.update(this.placeUM)
      .then(
        response => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  updatePlaceWithImage() {
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
          this.placeUM.picture = response;
          this.placeService.update(this.placeUM)
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

  getBeacon() {
    this.beaconService.getAll('', '', 'id' , 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.optionsSelect = response.content.map((beacon) => {
            return {
              value: beacon.workplaceId,
              label: beacon.name
            };
          });
        }
      );
  }

  removePlace() {
    this.placeService.remove(this.place.id)
      .then(
        (response) => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
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

        this.place.picture ? this.place.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
